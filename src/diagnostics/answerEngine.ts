// PRISM harness answer engine (HARNESS-HANDOFF §2 / §11.9).
//
// Maps a persona's declared identity sketch (positions, saliences, moral-circle
// affinities, style prefs) onto answers for whichever question the live engine
// next asks. Generic by question UI type, with question-ID special-cases for
// metadata items (Q200 partyID, Q211 strategic voting, Q212 negative partisan)
// that have no evidence pull and need direct persona->option mapping.
//
// Scoring approach for generic answer questions: for each candidate option,
// inspect its declared evidence (optionEvidence / sliderMap bucket / rankingMap
// item / bestWorstMap item / pairMaps side) and compute a fit score against
// the persona's stated profile. Pick the best-fit option. For priority_sort,
// place each item into the bucket whose direction is most consistent with the
// persona's position on the item's target node.
//
// Intentionally minimal in this first pass: gets ONE Tier-A persona through
// the live quiz end-to-end. Iterate from observed misroutings.

import type { QuestionDef, ContinuousNodeId, CategoricalNodeId, MoralCircleScope } from "../types.js";

// ─── Persona schema ───────────────────────────────────────────────────────

export type Scope = MoralCircleScope;

export interface Persona {
  id: string;
  name: string;
  demographics: {
    age: string;
    gender: "male" | "female" | "nonbinary" | "prefer_not_say";
    race: string;
    lgbtq: "yes" | "no";
    religion: string;
  };
  /**
   * Persona-level party identification. Includes lean variants for narrative
   * granularity (used downstream by predictVote scoring, expected-vote
   * tracking, etc.). The mapping table PARTYID_TO_Q200_OPT collapses lean
   * variants down to Q200's actual options (which are coarser).
   */
  partyID:
    | "dem"
    | "rep"
    | "ind_lean_d"
    | "ind_lean_r"
    | "ind_pure"
    | "ind"
    | "third"
    | "other"
    | "none";
  /** Continuous position on 1-5 scale per node. */
  positions: Partial<Record<ContinuousNodeId, number>>;
  /** Salience 0-3 per node (continuous and categorical). */
  saliences: Partial<Record<ContinuousNodeId | CategoricalNodeId, number>>;
  moralCircle: {
    universal: number;
    scopedAffinities: Partial<Record<Scope, number>>;
  };
  /** Preferred EPS category — one of: empiricist, institutionalist, traditionalist, intuitionist, autonomous, nihilist */
  eps: string;
  /** Preferred AES category — one of: statesman, technocrat, pastoral, authentic, fighter, visionary */
  aes: string;
  engagement: "tuned_out" | "casual" | "engaged" | "all_in";
  strategicVoting: "strategic_lesser_evil" | "sincere_always" | "depends_on_stakes" | "not_sure";
  negativePartisanship: "never_dem" | "never_rep" | "never_dem_or_rep" | "consider_all";
  expected: {
    /** Human-readable family for context (not asserted directly). */
    archetypeFamily: string;
    /** Specific archetype IDs that are acceptable top-1 outcomes (optional). */
    archetypeIds?: number[];
    /** Tokens that must all appear in the composed label string. */
    archetypeLabelContains?: string[];
    /**
     * Expected identity-primary state. Use "none" when no IDP overlay is
     * expected to trigger (top excess scope doesn't route, or scoped values
     * fall below gate). Use a specific label like "Evangelical Voter" when
     * the IDP should trigger. Pass-through `null` means don't assert.
     */
    identityPrimaryLabel?: string | null;
    identityPrimaryState?: "none" | "unresolved" | "latent" | "active" | "dominant" | null;
    /** Vote per election year. R/D/T/ABSTAIN. */
    votes: Record<number, "R" | "D" | "T" | "ABSTAIN">;
    /** Minimum vote-match count out of `Object.keys(votes).length` required to pass. */
    voteMatchMin?: number;
    /** Expected engagement level. */
    engagement?: "tuned_out" | "casual" | "engaged" | "highly-engaged";
    /** Acceptable question-count band (inclusive). */
    questionsInRange?: [number, number];
  };
}

const PARTYID_TO_Q200_OPT: Record<string, string> = {
  dem: "dem", rep: "rep", ind_lean_d: "ind", ind_lean_r: "ind", ind_pure: "ind",
  ind: "ind", third: "third", other: "other", none: "none",
};

const EPS_CATEGORIES = ["empiricist", "institutionalist", "traditionalist", "intuitionist", "autonomous", "nihilist"];
const AES_CATEGORIES = ["statesman", "technocrat", "pastoral", "authentic", "fighter", "visionary"];

// ─── Scoring primitives ───────────────────────────────────────────────────

function distPeak(dist: number[] | undefined): number | null {
  if (!dist || dist.length === 0) return null;
  let peak = 0;
  for (let i = 1; i < dist.length; i++) if (dist[i]! > dist[peak]!) peak = i;
  return peak + 1; // 1-indexed
}

/**
 * Squared difference between persona's stated position and the option's
 * declared evidence direction (peak of the pos distribution). 0 = perfect.
 */
function posDistanceForEvidence(personaPos: number, evDist: number[] | undefined): number {
  const peak = distPeak(evDist);
  if (peak == null) return 0;
  const d = personaPos - peak;
  return d * d;
}

/** Same shape for salience (4-bucket). Persona salience is 0-3, peak is 1-indexed → subtract 1. */
function salDistanceForEvidence(personaSal: number, evDist: number[] | undefined): number {
  const peak = distPeak(evDist);
  if (peak == null) return 0;
  const peakSal = peak - 1; // 0-3
  const d = personaSal - peakSal;
  return d * d;
}

/** Categorical fit: 0 if option's categorical-peak matches persona's preferred category, else 1. */
function catDistanceForEvidence(personaCat: string, node: "EPS" | "AES", evDist: number[] | undefined): number {
  const peak = distPeak(evDist);
  if (peak == null) return 0;
  const lookup = node === "EPS" ? EPS_CATEGORIES : AES_CATEGORIES;
  const evCategory = lookup[peak - 1];
  return evCategory === personaCat ? 0 : 1;
}

/** Distance between persona's universal (0-100) and option's emitted scalar. Normalized to 0-1 range. */
function universalDistance(personaUniv: number, evUniv: number): number {
  const d = (personaUniv - evUniv) / 100;
  return d * d;
}

/** Same shape for scoped affinity. */
function scopedDistance(personaScoped: number, evScoped: number): number {
  const d = (personaScoped - evScoped) / 100;
  return d * d;
}

/**
 * Score an evidence block against persona. Lower = better fit.
 * Sums squared distances across all dimensions the evidence touches.
 */
function scoreEvidence(persona: Persona, ev: any): number {
  let total = 0;
  if (!ev) return 0;

  if (ev.continuous) {
    for (const [node, fields] of Object.entries<any>(ev.continuous)) {
      if (!fields || typeof fields !== "object") continue;
      const personaPos = persona.positions[node as ContinuousNodeId];
      const personaSal = persona.saliences[node as ContinuousNodeId];
      if (fields.pos && personaPos != null) total += posDistanceForEvidence(personaPos, fields.pos);
      if (fields.sal && personaSal != null) total += salDistanceForEvidence(personaSal, fields.sal);
    }
  }
  if (ev.categorical) {
    for (const [node, fields] of Object.entries<any>(ev.categorical)) {
      if (fields == null) continue;
      const cat = node === "EPS" ? persona.eps : node === "AES" ? persona.aes : null;
      if (!cat) continue;
      // Raw-array shape: `categorical: { EPS: [p0, p1, ...] }`. The whole
      // array IS the category distribution. Common with EPS_PROTOTYPES /
      // AES_PROTOTYPES delegations (Q89, Q218, etc.).
      if (Array.isArray(fields)) {
        total += catDistanceForEvidence(cat, node as "EPS" | "AES", fields);
        continue;
      }
      if (typeof fields !== "object") continue;
      const personaSal = persona.saliences[node as CategoricalNodeId];
      if (fields.cat) total += catDistanceForEvidence(cat, node as "EPS" | "AES", fields.cat);
      if (fields.probs) total += catDistanceForEvidence(cat, node as "EPS" | "AES", fields.probs);
      if (fields.sal && personaSal != null) total += salDistanceForEvidence(personaSal, fields.sal);
    }
  }
  if (ev.moralCircle) {
    if (typeof ev.moralCircle.universal === "number") {
      total += universalDistance(persona.moralCircle.universal, ev.moralCircle.universal);
    }
    if (ev.moralCircle.scopedAffinities) {
      for (const [scope, val] of Object.entries<any>(ev.moralCircle.scopedAffinities)) {
        const personaScoped = persona.moralCircle.scopedAffinities[scope as Scope] ?? persona.moralCircle.universal;
        total += scopedDistance(personaScoped, val);
      }
    }
  }
  return total;
}

// ─── Question-ID special cases ────────────────────────────────────────────

function specialCase(persona: Persona, q: QuestionDef): unknown | undefined {
  if (q.id === 200) {
    return PARTYID_TO_Q200_OPT[persona.partyID] ?? "none";
  }
  if (q.id === 211) return persona.strategicVoting;
  if (q.id === 212) return persona.negativePartisanship;
  return undefined;
}

// ─── Per-UI-type dispatch ─────────────────────────────────────────────────

function decideSingleChoice(persona: Persona, q: QuestionDef): string {
  const options = q.options ?? Object.keys(q.optionEvidence ?? {});
  if (!options.length) return "unknown";
  let best = options[0]!;
  let bestScore = Infinity;
  for (const opt of options) {
    const ev = q.optionEvidence?.[opt];
    const score = scoreEvidence(persona, ev);
    if (score < bestScore) { bestScore = score; best = opt; }
  }
  return best;
}

function decideMulti(persona: Persona, q: QuestionDef): string[] {
  // Multi: pick options whose evidence aligns AND whose score is below a threshold.
  // Conservative: pick top-2 lowest-score options.
  const options = q.options ?? Object.keys(q.optionEvidence ?? {});
  const scored = options.map(opt => ({ opt, score: scoreEvidence(persona, q.optionEvidence?.[opt]) }));
  scored.sort((a, b) => a.score - b.score);
  return scored.slice(0, Math.min(2, options.length)).map(s => s.opt);
}

function decideSlider(persona: Persona, q: QuestionDef): number {
  // For each bucket, score the persona-fit; pick the bucket with lowest score;
  // emit the bucket's midpoint as the slider value.
  const map = q.sliderMap ?? {};
  let bestBucket: string | null = null;
  let bestScore = Infinity;
  for (const [bucket, ev] of Object.entries(map)) {
    const score = scoreEvidence(persona, ev);
    if (score < bestScore) { bestScore = score; bestBucket = bucket; }
  }
  if (!bestBucket) return 50;
  const m = bestBucket.match(/^(\d+)-(\d+)$/);
  if (!m) return 50;
  return Math.round((Number(m[1]) + Number(m[2])) / 2);
}

/**
 * Compute a single item's *alignment* with the persona on a -1..+1 scale.
 *
 *   +1 → item strongly matches persona's stance (place in supportHigh)
 *    0 → item is neutral or off-axis (place in neutral)
 *   -1 → item strongly opposes persona's stance (place in opposeHigh)
 *
 * The scoring inspects what the item's evidence emits and asks:
 *   "If I (the persona) were to endorse this item by placing it in supportHigh,
 *    would the engine then write values consistent with my actual profile?"
 *
 * For moralCircle scoped emissions: the persona's loading on that scope IS
 * the alignment (>0.7 scoped → strong endorse; <0.3 → strong reject).
 *
 * For moralCircle universal emissions: similar, using persona.universal.
 *
 * For continuous-pos emissions toward peak P on node N: alignment = how
 * strongly the persona agrees with that pole, accounting for salience.
 * Items pulling toward the persona's pole are endorsed; items pulling
 * against are opposed. Magnitude scales with how *extreme* the item is —
 * one-pole question banks (Q102) where all items pull the same direction
 * still produce meaningful alignment gradients.
 *
 * Categorical-cat emissions: +1 if peak matches persona's preferred
 * category, else 0 (no anti-signal — preference is positive-only).
 */
function alignmentForItem(persona: Persona, ev: any): number {
  if (!ev) return 0;
  let total = 0;
  let count = 0;

  // moralCircle scoped — persona's loading on that scope drives alignment.
  if (ev.moralCircle?.scopedAffinities) {
    for (const [scope, _val] of Object.entries<any>(ev.moralCircle.scopedAffinities)) {
      const personaScoped = persona.moralCircle.scopedAffinities[scope as Scope];
      if (personaScoped == null) continue;
      // 0-100 scale → -1..+1 centered at 50.
      total += (personaScoped - 50) / 50;
      count++;
    }
  }
  if (ev.moralCircle?.universal !== undefined) {
    total += (persona.moralCircle.universal - 50) / 50;
    count++;
  }

  // continuous position — directional agreement with the item's pull.
  if (ev.continuous) {
    for (const [node, fields] of Object.entries<any>(ev.continuous)) {
      if (!fields || typeof fields !== "object" || !fields.pos) continue;
      const personaPos = persona.positions[node as ContinuousNodeId];
      if (personaPos == null) continue;
      const peak = distPeak(fields.pos);
      if (peak == null) continue;
      // Both expressed on 1-5 scale, centered at 3.
      const personaSide = personaPos - 3;   // -2..+2
      const itemSide = peak - 3;            // -2..+2
      // Pure dot-product would be too peaked; soft it with division.
      // Agreement = same direction × extremity of the item, normalized.
      let align = (personaSide * itemSide) / 4; // -1..+1
      // Salience-aware weighting: if persona doesn't care about this node,
      // their endorsement of one-side items shouldn't be strong.
      const personaSal = persona.saliences[node as ContinuousNodeId];
      if (personaSal != null && personaSal < 1) align *= 0.5;
      total += align;
      count++;
    }
  }

  // categorical cat — preferred category match is positive endorse.
  if (ev.categorical) {
    for (const [node, fields] of Object.entries<any>(ev.categorical)) {
      if (fields == null) continue;
      const personaCat = node === "EPS" ? persona.eps : node === "AES" ? persona.aes : null;
      if (!personaCat) continue;
      let dist: number[] | null = null;
      if (Array.isArray(fields)) dist = fields;
      else if (typeof fields === "object" && fields.cat) dist = fields.cat;
      else if (typeof fields === "object" && fields.probs) dist = fields.probs;
      if (!dist) continue;
      const peak = distPeak(dist);
      if (peak == null) continue;
      const lookup = node === "EPS" ? EPS_CATEGORIES : AES_CATEGORIES;
      const evCategory = lookup[peak - 1];
      total += evCategory === personaCat ? 1 : -0.3;
      count++;
    }
  }

  return count > 0 ? Math.max(-1, Math.min(1, total / count)) : 0;
}

/**
 * Detect the node a priority_sort item routes to when its rankingMap entry
 * carries only an empty evidence object (e.g., `{ continuous: { MAT: {} } }`).
 * These items are placeholder routings — the actual salience signal is emitted
 * by `salienceBuckets` aggregation at the engine layer (Q103-style). Returns
 * the first node key present in either `continuous` or `categorical`.
 */
function itemTargetNode(ev: any): ContinuousNodeId | CategoricalNodeId | null {
  if (!ev || typeof ev !== "object") return null;
  if (ev.continuous) {
    const keys = Object.keys(ev.continuous);
    if (keys.length) return keys[0] as ContinuousNodeId;
  }
  if (ev.categorical) {
    const keys = Object.keys(ev.categorical);
    if (keys.length) return keys[0] as CategoricalNodeId;
  }
  return null;
}

/**
 * Q103-style placement: when the question carries `salienceBuckets`, the
 * per-item evidence is intentionally empty and the engine derives all signal
 * from which BUCKET the respondent dropped each item into. The right strategy
 * is to read `persona.saliences[targetNode]` for each item and bucket by
 * absolute salience thresholds (0-3 scale):
 *
 *   sal ≥ 2.5  → supportHigh   (peak at sal=3 — central to my politics)
 *   1.5–2.5    → supportMid    (somewhat salient)
 *   < 1.5      → neutral       (peak at sal=0 — doesn't register for me)
 *
 * `opposeHigh` is not used here — Q103's UI is 3-bucket (central / somewhat
 * / doesn't register); the 4th bucket exists internally but has no semantic
 * "I oppose this dimension being part of politics" meaning.
 */
function decideSalienceBucketSort(persona: Persona, q: QuestionDef): {
  supportHigh: string[];
  supportMid: string[];
  neutral: string[];
  opposeHigh: string[];
} {
  const items = q.rankingMap ? Object.keys(q.rankingMap) : [];
  const supportHigh: string[] = [];
  const supportMid: string[] = [];
  const neutral: string[] = [];
  const opposeHigh: string[] = [];

  for (const item of items) {
    const targetNode = itemTargetNode(q.rankingMap![item]);
    if (!targetNode) { neutral.push(item); continue; }
    const sal = persona.saliences[targetNode];
    if (sal == null) { neutral.push(item); continue; }
    if (sal >= 2.5) supportHigh.push(item);
    else if (sal >= 1.5) supportMid.push(item);
    else neutral.push(item);
  }

  return { supportHigh, supportMid, neutral, opposeHigh };
}

function decidePrioritySort(persona: Persona, q: QuestionDef): {
  supportHigh: string[];
  supportMid: string[];
  neutral: string[];
  opposeHigh: string[];
} {
  const items = q.rankingMap ? Object.keys(q.rankingMap) : [];
  if (items.length === 0) return { supportHigh: [], supportMid: [], neutral: [], opposeHigh: [] };

  // salienceBuckets routing (Q103-style): per-item evidence is empty by
  // design; the engine derives signal from bucket placement via
  // salienceBuckets. Bucket items by persona.saliences[targetNode] directly.
  if ((q as any).salienceBuckets) {
    return decideSalienceBucketSort(persona, q);
  }

  // Score by semantic alignment, then bucket by absolute thresholds.
  // A persona with 3 strongly-loaded scopes (e.g., national+religious+ideological)
  // correctly places all 3 in supportHigh — no quartile cap.
  const scored = items.map(item => ({
    item, align: alignmentForItem(persona, q.rankingMap![item]),
  }));

  const supportHigh: string[] = [];
  const supportMid: string[] = [];
  const neutral: string[] = [];
  const opposeHigh: string[] = [];

  for (const { item, align } of scored) {
    if (align >= 0.4) supportHigh.push(item);
    else if (align >= 0.15) supportMid.push(item);
    else if (align >= -0.15) neutral.push(item);
    else opposeHigh.push(item);
  }

  // Failsafe: if every bucket happens to be empty except neutral (because the
  // scoring couldn't differentiate), promote the highest-aligned item to
  // supportHigh so we don't emit an empty-pull answer.
  if (supportHigh.length === 0 && supportMid.length === 0 && opposeHigh.length === 0 && scored.length > 0) {
    const best = [...scored].sort((a, b) => b.align - a.align)[0]!;
    if (best.align > -0.15) {
      const idx = neutral.indexOf(best.item);
      if (idx >= 0) neutral.splice(idx, 1);
      supportHigh.push(best.item);
    }
  }

  return { supportHigh, supportMid, neutral, opposeHigh };
}

function decideBestWorst(persona: Persona, q: QuestionDef): { best: string[]; worst: string[] } {
  const map = q.bestWorstMap ?? q.rankingMap ?? {};
  const items = Object.keys(map);
  if (!items.length) return { best: [], worst: [] };
  const scored = items.map(item => ({
    item, score: scoreEvidence(persona, (map as any)[item]),
  })).sort((a, b) => a.score - b.score);
  const picks = q.bwMaxPicks ?? 1;
  return {
    best: scored.slice(0, picks).map(s => s.item),
    worst: scored.slice(-picks).map(s => s.item),
  };
}

function decideRanking(persona: Persona, q: QuestionDef): string[] {
  const items = q.rankingMap ? Object.keys(q.rankingMap) : [];
  if (!items.length) return [];
  const scored = items.map(item => ({
    item, score: scoreEvidence(persona, q.rankingMap![item]),
  })).sort((a, b) => a.score - b.score);
  return scored.map(s => s.item);
}

function decideAllocation(persona: Persona, q: QuestionDef): Record<string, number> {
  // Inverse-score weighting: lower score (better fit) → more allocation.
  const buckets = Object.keys(q.allocationMap ?? {});
  if (!buckets.length) return {};
  const scored = buckets.map(b => ({ b, score: scoreEvidence(persona, q.allocationMap![b]) }));
  // Transform: weight = 1 / (1 + score). Normalize to 100.
  const weights = scored.map(s => 1 / (1 + s.score));
  const sum = weights.reduce((a, b) => a + b, 0);
  const out: Record<string, number> = {};
  let acc = 0;
  for (let i = 0; i < scored.length - 1; i++) {
    const w = Math.round((weights[i]! / sum) * 100);
    out[scored[i]!.b] = w;
    acc += w;
  }
  out[scored[scored.length - 1]!.b] = Math.max(0, 100 - acc); // remainder
  return out;
}

function decidePairwise(persona: Persona, q: QuestionDef): Record<string, string> {
  const out: Record<string, string> = {};
  if (!q.pairMaps) return out;
  for (const [pairId, sides] of Object.entries(q.pairMaps)) {
    const sideEntries = Object.entries(sides);
    if (!sideEntries.length) continue;
    let best = sideEntries[0]![0];
    let bestScore = Infinity;
    for (const [side, ev] of sideEntries) {
      const s = scoreEvidence(persona, ev);
      if (s < bestScore) { bestScore = s; best = side; }
    }
    out[pairId] = best;
  }
  return out;
}

function decideDualAxis(persona: Persona, q: QuestionDef): { x: number; y: number } {
  const node = q.dualAxisMap?.node as ContinuousNodeId | undefined;
  if (!node) return { x: 50, y: 50 };
  const pos = persona.positions[node];
  const sal = persona.saliences[node as ContinuousNodeId];
  // pos 1-5 → x 0-100; sal 0-3 → y 0-100
  const x = pos != null ? Math.round(((pos - 1) / 4) * 100) : 50;
  const y = sal != null ? Math.round((sal / 3) * 100) : 50;
  return { x, y };
}

// ─── Top-level dispatch ───────────────────────────────────────────────────

export function decideAnswer(persona: Persona, q: QuestionDef): unknown {
  const sc = specialCase(persona, q);
  if (sc !== undefined) return sc;

  switch (q.uiType) {
    case "single_choice": return decideSingleChoice(persona, q);
    case "conjoint":      return decideSingleChoice(persona, q);
    case "multi":         return decideMulti(persona, q);
    case "slider":        return decideSlider(persona, q);
    case "priority_sort": return decidePrioritySort(persona, q);
    case "best_worst":    return decideBestWorst(persona, q);
    case "ranking":       return decideRanking(persona, q);
    case "allocation":    return decideAllocation(persona, q);
    case "pairwise":      return decidePairwise(persona, q);
    case "dual_axis":     return decideDualAxis(persona, q);
    default:              return decideSingleChoice(persona, q);
  }
}
