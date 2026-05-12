/**
 * Archetype labeler (2026-05-12).
 *
 * Generates a salience-driven label for a respondent (or archetype-as-respondent)
 * from their position + salience profile. Replaces the static archetype.name on
 * the v27 results page.
 *
 * Rules (per Sam, 2026-05-12):
 *   1. A node enters the label if its salience >= 2.5 / 3.
 *   2. The MOST salient node always emits a token, even if its position is in
 *      the mid bin (so "Mixed-Economy" can appear when MAT is the top-1).
 *   3. Top-2 and top-3 salient nodes emit tokens only if their position is in
 *      the low or high bin — mid drops out.
 *   4. Composition: try the merger-table lookup on the resulting token set
 *      (full, then 2-subset, then 1-subset); if a hit doesn't cover everything,
 *      prepend uncovered tokens. Else compose 1-3 lexicon fragments directly.
 *   5. Final label is capped at 3 words. Lower-salience tokens drop first.
 *
 * Categoricals (EPS / AES) emit their top category literally (Statesman,
 * Empiricist, etc.) — no mid bin. Moral circle emits "Universalist" when
 * universalAffinity is high with no scope excess, or a scope-tagged adjective
 * when one scope has clear excess.
 */
import type { Archetype } from "../types.js";

/**
 * Dump-shape respondent state — the structure stored in localStorage by
 * quiz-v2-live.html's finishResults(). The canonical RespondentState type
 * carries posDist/salDist arrays; the dump pre-computes expectedPos and
 * salience as scalars for downstream consumers. The labeler reads the dump
 * shape because that's what v27 has on hand.
 */
export interface LabelerRespondentState {
  continuous?: Record<string, {
    expectedPos?: number;
    salience?: number;
  } | undefined>;
  categorical?: Record<string, {
    catDist?: number[];
    salience?: number;
  } | undefined>;
  moralCircle?: {
    universalAffinity?: number;
    scopedAffinities?: Record<string, number | null>;
    intensity03?: number;
  } | null;
}

// ──────────────────────────────────────────────────────────────────────────────
// Lexicon
// ──────────────────────────────────────────────────────────────────────────────

interface PoleTokens {
  low: string;
  mid: string;   // only used when this node is the top-1 salient
  high: string;
}

/**
 * Continuous-node lexicon. Three bins per node:
 *   low  → position ≤ 2.5
 *   mid  → 2.5 < position < 3.5  (only contributes when top-1 salient)
 *   high → position ≥ 3.5
 */
export const POSITION_LEXICON: Record<string, PoleTokens> = {
  MAT:   { low: "Redistributionist", mid: "Mixed-Economy",  high: "Free-Marketeer" },
  CD:    { low: "Progressive",       mid: "Hinge",          high: "Traditionalist" },
  CU:    { low: "Assimilationist",   mid: "Civic-Pluralist", high: "Pluralist" },
  MOR:   { low: "Particularist",     mid: "Civic",          high: "Universalist" },
  PRO:   { low: "Consequentialist",  mid: "Pragmatic",      high: "Procedural" },
  COM:   { low: "Principled",        mid: "Practical",      high: "Dealmaker" },
  ZS:    { low: "Positive-Sum",      mid: "Realist",        high: "Combative" },
  ONT_H: { low: "Essentialist",      mid: "Tempered",       high: "Malleabilist" },
  ONT_S: { low: "Anti-Institutional", mid: "Reformist",     high: "Institutional" },
  PF:    { low: "Detached",          mid: "Engaged-Civic",  high: "Partisan" },
  TRB:   { low: "Inclusivist",       mid: "Civic",          high: "Tribal" },
  ENG:   { low: "Tuned-Out",         mid: "Casual",         high: "All-In" },
};

/** EPS categorical labels, indexed 0-5. */
export const EPS_LEXICON: readonly string[] = [
  "Empiricist", "Institutionalist", "Traditionalist", "Intuitionist", "Autonomous", "Nihilist",
];

/** AES categorical labels, indexed 0-5. */
export const AES_LEXICON: readonly string[] = [
  "Statesman", "Technocrat", "Pastoral", "Authentic", "Fighter", "Visionary",
];

/** Moral-circle scope adjectives — when a single scope has clear excess. */
export const MORAL_CIRCLE_SCOPE_LEXICON: Record<string, string> = {
  national:      "Nationalist",
  religious:     "Religious-Communitarian",
  ethnic_racial: "Ethnic-Communitarian",
  class:         "Class-Conscious",
  gender:        "Gender-Identitarian",
  ideological:   "Partisan-Communitarian",
};

// ──────────────────────────────────────────────────────────────────────────────
// Threshold constants
// ──────────────────────────────────────────────────────────────────────────────

const SALIENCE_THRESHOLD = 2.5;           // node enters label only if sal ≥ this
const POSITION_LOW_MAX = 2.5;             // pos ≤ this → low bin
const POSITION_HIGH_MIN = 3.5;            // pos ≥ this → high bin
const MAX_LABEL_TOKENS = 3;
const MORAL_CIRCLE_SCOPE_EXCESS_MIN = 20; // a scope needs this much excess to count
const MORAL_CIRCLE_UNIVERSAL_MIN = 70;    // universal must be at least this for "Universalist"

// ──────────────────────────────────────────────────────────────────────────────
// Tokenizer types
// ──────────────────────────────────────────────────────────────────────────────

export type Bin = "low" | "mid" | "high";

export interface TokenEntry {
  node: string;           // e.g., "MAT", "EPS", "MORAL_CIRCLE"
  bin: Bin | string;      // "low"/"mid"/"high" for continuous; category name for categorical/moral-circle
  token: string;          // the lexicon word
  salience: number;       // 0-3
  isCategorical: boolean; // EPS, AES, moral-circle
}

// ──────────────────────────────────────────────────────────────────────────────
// Tokenize a respondent's live state
// ──────────────────────────────────────────────────────────────────────────────

function continuousBin(pos: number): Bin {
  if (pos <= POSITION_LOW_MAX) return "low";
  if (pos >= POSITION_HIGH_MIN) return "high";
  return "mid";
}

export function tokenizeRespondent(state: LabelerRespondentState): TokenEntry[] {
  const entries: TokenEntry[] = [];

  // Continuous nodes
  if (state.continuous) {
    for (const [node, n] of Object.entries(state.continuous)) {
      if (!n || typeof n.salience !== "number") continue;
      if (!(node in POSITION_LEXICON)) continue;
      const bin = continuousBin(n.expectedPos ?? 3);
      const lex = POSITION_LEXICON[node]!;
      const token = bin === "low" ? lex.low : bin === "high" ? lex.high : lex.mid;
      entries.push({ node, bin, token, salience: n.salience, isCategorical: false });
    }
  }

  // Categorical EPS
  const eps = state.categorical?.EPS;
  if (eps && Array.isArray(eps.catDist)) {
    const topIdx = argmax(eps.catDist);
    if (topIdx >= 0 && topIdx < EPS_LEXICON.length) {
      entries.push({
        node: "EPS",
        bin: EPS_LEXICON[topIdx]!,
        token: EPS_LEXICON[topIdx]!,
        salience: eps.salience ?? 0,
        isCategorical: true,
      });
    }
  }

  // Categorical AES
  const aes = state.categorical?.AES;
  if (aes && Array.isArray(aes.catDist)) {
    const topIdx = argmax(aes.catDist);
    if (topIdx >= 0 && topIdx < AES_LEXICON.length) {
      entries.push({
        node: "AES",
        bin: AES_LEXICON[topIdx]!,
        token: AES_LEXICON[topIdx]!,
        salience: aes.salience ?? 0,
        isCategorical: true,
      });
    }
  }

  // Moral circle: emit a token when intensity is meaningful or universal is high.
  const mc = state.moralCircle;
  if (mc) {
    const universal = mc.universalAffinity ?? 50;
    const scopes = mc.scopedAffinities ? Object.entries(mc.scopedAffinities)
      .filter(([, v]) => typeof v === "number")
      .map(([scope, v]) => ({ scope, excess: Math.max(0, (v as number) - universal) })) : [];
    const maxScope = scopes.length ? scopes.reduce((a, b) => a.excess > b.excess ? a : b) : null;

    if (maxScope && maxScope.excess >= MORAL_CIRCLE_SCOPE_EXCESS_MIN) {
      const adj = MORAL_CIRCLE_SCOPE_LEXICON[maxScope.scope];
      if (adj) {
        entries.push({
          node: "MORAL_CIRCLE",
          bin: maxScope.scope,
          token: adj,
          salience: Math.min(3, mc.intensity03 ?? 0),
          isCategorical: true,
        });
      }
    } else if (universal >= MORAL_CIRCLE_UNIVERSAL_MIN) {
      entries.push({
        node: "MORAL_CIRCLE",
        bin: "universal",
        token: "Universalist",
        salience: Math.min(3, (universal - 50) / 16.67), // 50→0, 100→3
        isCategorical: true,
      });
    }
  }

  return entries;
}

// ──────────────────────────────────────────────────────────────────────────────
// Tokenize an archetype centroid (used for merger-table generation)
// ──────────────────────────────────────────────────────────────────────────────

export function tokenizeArchetype(arch: Archetype): TokenEntry[] {
  const entries: TokenEntry[] = [];
  for (const [node, n] of Object.entries(arch.nodes)) {
    if (!n) continue;
    if (n.kind === "continuous") {
      if (!(node in POSITION_LEXICON)) continue;
      const bin = continuousBin(n.pos);
      const lex = POSITION_LEXICON[node]!;
      const token = bin === "low" ? lex.low : bin === "high" ? lex.high : lex.mid;
      entries.push({ node, bin, token, salience: n.sal ?? 0, isCategorical: false });
    } else if (n.kind === "categorical" && node === "EPS") {
      const topIdx = argmax(n.probs as number[]);
      if (topIdx >= 0 && topIdx < EPS_LEXICON.length) {
        entries.push({
          node: "EPS", bin: EPS_LEXICON[topIdx]!, token: EPS_LEXICON[topIdx]!,
          salience: n.sal ?? 0, isCategorical: true,
        });
      }
    } else if (n.kind === "categorical" && node === "AES") {
      const topIdx = argmax(n.probs as number[]);
      if (topIdx >= 0 && topIdx < AES_LEXICON.length) {
        entries.push({
          node: "AES", bin: AES_LEXICON[topIdx]!, token: AES_LEXICON[topIdx]!,
          salience: n.sal ?? 0, isCategorical: true,
        });
      }
    }
  }

  // Archetype moral-circle: prefer the explicit moralCircle field if present.
  const mc = (arch as { moralCircle?: { universalAffinity: number; scopedAffinities: Record<string, number | null> } }).moralCircle;
  if (mc) {
    const universal = mc.universalAffinity ?? 50;
    const scopes = Object.entries(mc.scopedAffinities ?? {})
      .filter(([, v]) => typeof v === "number")
      .map(([scope, v]) => ({ scope, excess: Math.max(0, (v as number) - universal) }));
    const maxScope = scopes.length ? scopes.reduce((a, b) => a.excess > b.excess ? a : b) : null;
    if (maxScope && maxScope.excess >= MORAL_CIRCLE_SCOPE_EXCESS_MIN) {
      const adj = MORAL_CIRCLE_SCOPE_LEXICON[maxScope.scope];
      if (adj) {
        entries.push({
          node: "MORAL_CIRCLE", bin: maxScope.scope, token: adj,
          salience: 3, // archetype-level: treat as fully salient
          isCategorical: true,
        });
      }
    } else if (universal >= MORAL_CIRCLE_UNIVERSAL_MIN) {
      entries.push({
        node: "MORAL_CIRCLE", bin: "universal", token: "Universalist",
        salience: 3,
        isCategorical: true,
      });
    }
  }

  return entries;
}

// ──────────────────────────────────────────────────────────────────────────────
// Selection: top-N salient with the mid-drop rule for non-top-1 entries
// ──────────────────────────────────────────────────────────────────────────────

export function selectLabelTokens(entries: TokenEntry[]): TokenEntry[] {
  // 2026-05-12 (revised): take top-3 by salience descending, with no hard
  // threshold. Archetype data uses integer sal 1-3, so a 2.5 threshold strands
  // most archetypes with <2 tokens; respondents with sub-2.5 profiles still
  // deserve a meaningful label. Mid-drop still applies at rank 2/3.
  // Tie-break: continuous tokens by |position-3| (more-extreme first), then
  // categoricals after equal-salience continuous, then alphabetically.
  const sorted = [...entries].sort((a, b) => {
    if (b.salience !== a.salience) return b.salience - a.salience;
    const distA = a.isCategorical ? 0 : Math.abs(positionFromBin(a.bin) - 3);
    const distB = b.isCategorical ? 0 : Math.abs(positionFromBin(b.bin) - 3);
    if (distB !== distA) return distB - distA;
    return a.node.localeCompare(b.node);
  });
  const picked: TokenEntry[] = [];
  for (let i = 0; i < sorted.length && picked.length < MAX_LABEL_TOKENS; i++) {
    const e = sorted[i]!;
    if (picked.length === 0) {
      picked.push(e);
    } else {
      if (!e.isCategorical && e.bin === "mid") continue;
      picked.push(e);
    }
  }
  return picked;
}

function positionFromBin(bin: string): number {
  if (bin === "low") return 1.5;
  if (bin === "high") return 4.5;
  if (bin === "mid") return 3;
  return 3;
}

// ──────────────────────────────────────────────────────────────────────────────
// Signature key for merger-table lookup
// ──────────────────────────────────────────────────────────────────────────────

export function signatureOf(tokens: TokenEntry[]): string {
  return tokens
    .map(t => `${t.node}:${t.bin}`)
    .sort()
    .join("|");
}

// ──────────────────────────────────────────────────────────────────────────────
// Composer
// ──────────────────────────────────────────────────────────────────────────────

export interface MergerTable {
  [signatureKey: string]: string;
}

export interface ComposeResult {
  label: string;
  source: "merger-full" | "merger-partial" | "lexicon";
  signature: string;
  tokensUsed: TokenEntry[];
}

/**
 * Algorithm (revised 2026-05-12, per Sam):
 *   Lexicon composition is the DEFAULT. Merger lookup is a "save-a-word"
 *   overlay — it only fires when an exact 2-token or 3-token signature
 *   appears in the curated merger table. No partial / lossy / leftover-prefix
 *   matches; those produced output like "Dealmaker Tribal Insurgent" which
 *   sounded worse than the natural lexicon composition.
 *
 *   Flow:
 *     1. Compose lexicon directly from the tokens (top-N joined by space).
 *     2. If the full signature has a merger entry, swap to that.
 *     3. If a 2-subset (top-2) has a merger entry AND the 3rd token is
 *        meaningful, prepend the 3rd token to the merger name.
 *     4. Else use the lexicon composition.
 */
export function composeLabel(tokens: TokenEntry[], mergerTable: MergerTable): ComposeResult {
  if (tokens.length === 0) {
    return { label: "Civic Generalist", source: "lexicon", signature: "", tokensUsed: [] };
  }

  const fullSig = signatureOf(tokens);
  const lexicon = tokens.map(t => t.token).join(" ");

  // Try the full-signature merger first.
  if (fullSig in mergerTable) {
    return { label: mergerTable[fullSig]!, source: "merger-full", signature: fullSig, tokensUsed: tokens };
  }

  // If there are 3 tokens, try the top-2 subset (most-salient pair) only.
  // Skip other 2-subsets — they produced bad partial matches in v0.
  if (tokens.length === 3) {
    const top2 = [tokens[0]!, tokens[1]!];
    const sig2 = signatureOf(top2);
    if (sig2 in mergerTable) {
      const merged = mergerTable[sig2]!;
      const leftover = tokens[2]!;
      return {
        label: `${leftover.token} ${merged}`,
        source: "merger-partial",
        signature: sig2,
        tokensUsed: tokens,
      };
    }
  }

  // Lexicon path with compression layer: if any pair of tokens has a
  // compression entry, substitute that pair with one word before joining.
  const compressed = applyCompression(tokens);
  if (compressed) {
    return {
      label: compressed.map(t => t.token).join(" "),
      source: "lexicon",
      signature: fullSig,
      tokensUsed: tokens,
    };
  }

  // Pure lexicon default: 1-3 fragment composition with no compression.
  return { label: lexicon, source: "lexicon", signature: fullSig, tokensUsed: tokens };
}

// ──────────────────────────────────────────────────────────────────────────────
// Public top-level entry points
// ──────────────────────────────────────────────────────────────────────────────

export function labelForRespondent(state: LabelerRespondentState, mergerTable: MergerTable): ComposeResult {
  const entries = tokenizeRespondent(state);
  const tokens = selectLabelTokens(entries);
  return composeLabel(tokens, mergerTable);
}

export function labelForArchetype(arch: Archetype, mergerTable: MergerTable): ComposeResult {
  const entries = tokenizeArchetype(arch);
  const tokens = selectLabelTokens(entries);
  return composeLabel(tokens, mergerTable);
}

// ──────────────────────────────────────────────────────────────────────────────
// Embedded merger table (used when no external table is passed)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Default merger table — embedded so the browser bundle works without a
 * separate fetch. Mirrors src/identity/mergerTable.json. When the JSON file
 * changes, re-paste here (or wire a build step).
 */
export const DEFAULT_MERGER_TABLE: MergerTable = {
  "MAT:low|ONT_S:high": "Institutional Leftist",
  "MAT:high|ONT_S:high": "Institutional Conservative",
  "MAT:low|MORAL_CIRCLE:universal": "Rawlsian Reformer",
  "MAT:low|MORAL_CIRCLE:class": "Class-War Leftist",
  "MAT:low|COM:low": "Jacobin Egalitarian",
  "MAT:low|CD:low|MORAL_CIRCLE:national": "Progressive Civic Nationalist",
  "MAT:low|CD:low": "Progressive Leftist",
  "MAT:high|CD:high": "Conservative",
  "CD:high|MORAL_CIRCLE:national": "Heritage Guardian",
  "CD:high|MORAL_CIRCLE:religious": "Religious Traditionalist",
  "MAT:high|CD:high|ZS:high": "Combative Conservative",
  "MAT:low|ZS:high": "Combative Leftist",
  "MAT:low|AES:Fighter": "Insurgent Equalizer",
  "MAT:high|AES:Fighter": "Combative Populist",
  "CD:high|AES:Fighter": "Heritage Firebrand",
  "AES:Statesman|ONT_S:high": "Statesman Institutionalist",
  "AES:Technocrat|ONT_S:high": "Technocratic Optimizer",
  "AES:Visionary|ONT_S:low": "Visionary Insurgent",
  "AES:Visionary|MAT:low": "Visionary Progressive",
  "EPS:Empiricist|ONT_S:high": "Evidence-Based Institutionalist",
  "EPS:Empiricist|MAT:low": "Evidence-Based Progressive",
  "EPS:Traditionalist|CD:high": "Civic Traditionalist",
  "EPS:Intuitionist|AES:Fighter": "Gut-Politics Fighter",
  "COM:high|ONT_S:high": "Burkean Steward",
  "COM:low|ONT_S:low": "Disaffected Contrarian",
  "MAT:low|ONT_H:high": "Constructivist Progressive",
  "CD:high|ONT_H:low": "Essentialist Traditionalist",
  "CU:high|MORAL_CIRCLE:universal": "World-Minded Reformer",
  "CU:high|MOR:high": "Principled Cosmopolitan",
  "CD:high|CU:low": "Communitarian Traditionalist",
  "MAT:low|PF:high": "Loyal Democrat",
  "MAT:high|PF:high": "Loyal Republican",
  "AES:Fighter|PF:high": "Militant Partisan",
  "CD:high|ENG:low": "Quiet Traditionalist",
  "ENG:low|MAT:low": "Comfortable Bystander",
  "MORAL_CIRCLE:gender": "Identity-Group Activist",
  "MORAL_CIRCLE:ethnic_racial": "Identity-Group Activist",
  "CU:high|MAT:low|ONT_S:high": "Institutional Leftist",
  "MAT:low|ONT_S:high|PRO:high": "Procedural Institutional Leftist",
  "COM:high|MAT:low|ONT_S:high": "Pragmatic Institutional Leftist",
  "CD:low|CU:high|MAT:low": "Cosmopolitan Progressive",
  "CD:low|MAT:low|MOR:high": "Rawlsian Reformer",
  "CD:high|MAT:high|ONT_S:high": "Institutional Conservative",
  "CD:high|MAT:high|MORAL_CIRCLE:religious": "Religious Right",
  "CD:high|CU:low|MORAL_CIRCLE:national": "Heritage Guardian",
  "MAT:low|ONT_S:high|ZS:low": "Pluralist Structuralist",
  "CU:high|MAT:low|MOR:high": "Cosmopolitan Reformer",
  "AES:Fighter|MAT:low|MORAL_CIRCLE:class": "Class-War Fighter",
  "AES:Statesman|MAT:low|ONT_S:high": "Statesman Institutional Leftist",
  "AES:Statesman|MAT:high|ONT_S:high": "Statesman Institutional Conservative",
  "EPS:Empiricist|MAT:low|ONT_S:high": "Evidence-Based Institutional Leftist",
  "EPS:Empiricist|MAT:high|ONT_S:high": "Evidence-Based Institutional Conservative",
  "CU:high|MAT:low|MORAL_CIRCLE:universal": "Cosmopolitan Reformer",
};

/**
 * Compression table — token PAIR → ONE word.
 *
 * Different from the merger table:
 *   merger:      signature → iconic multi-word name (preserves "Institutional Leftist")
 *   compression: signature → single-word semantic substitute (combines two ideas)
 *
 * Compression runs inside the lexicon path only. If the full signature has a
 * merger hit, the merger wins. Otherwise the composer scans the token list for
 * a compressible pair, substitutes with one word, and joins remaining tokens.
 *
 * Keep signatures sorted alphabetically (same format as merger table).
 */
export const COMPRESSION_TABLE: MergerTable = {
  // Ideology axes (economy × culture)
  "CD:low|MAT:low":   "Leftist",
  "CD:high|MAT:high": "Conservative",
  "CD:low|MAT:high":  "Libertarian",
  "CD:high|MAT:low":  "Populist-Left",

  // Economy × moral circle width
  "MAT:low|MOR:high":  "Internationalist",
  "MAT:low|MOR:low":   "Class-Particularist",
  "MAT:high|MOR:low":  "Tribal-Capitalist",

  // Economy × institutions
  "MAT:high|ONT_S:low":  "Free-Market-Disruptor",
  "MAT:low|ONT_S:low":   "Anti-Capitalist-Radical",

  // Cultural axes (continuity × pluralism)
  "CD:high|CU:high": "Conservative-Pluralist",
  "CD:low|CU:high":  "Cosmopolitan",
  "CD:high|CU:low":  "Communitarian",
  "CD:low|CU:low":   "Progressive-Unifier",

  // Cultural × moral circle
  "CU:high|MOR:low":  "Provincial-Pluralist",
  "CU:low|MOR:high":  "Civic-Universalist",

  // Process axes (procedure × compromise)
  "COM:high|PRO:high": "Establishment",
  "COM:low|PRO:low":   "Insurgent",
  "COM:high|PRO:low":  "Negotiator",
  "COM:low|PRO:high":  "Hard-Liner",

  // Process × institutions
  "ONT_S:high|PRO:high": "Bureaucratic",
  "ONT_S:low|PRO:low":   "Outsider",
  "COM:high|ONT_S:high": "Statesman-Style",
  "COM:low|ONT_S:low":   "Antagonist",

  // Worldview (zero-sum × human nature)
  "ONT_H:low|ZS:high":   "Hobbesian",
  "ONT_H:high|ZS:low":   "Utopian",
  "MOR:high|ZS:low":     "Idealist",
  "MOR:low|ZS:high":     "Hard-Realist",

  // Worldview × institutions
  "ONT_H:high|ONT_S:high": "Social-Engineer",
  "ONT_H:low|ONT_S:low":   "Reactionary",
  "ONT_S:high|ZS:low":     "Cooperator",
  "ONT_S:low|ZS:high":     "Cynic",

  // Conflict-style
  "AES:Fighter|ZS:high":  "Militant",
  "AES:Fighter|COM:low":  "Combatant",
  "AES:Fighter|MAT:high": "Populist-Right",
  "AES:Fighter|CD:high":  "Reactionary-Firebrand",

  // Style × engagement
  "AES:Statesman|PF:high": "Loyal-Statesman",
  "AES:Technocrat|EPS:Empiricist": "Wonk",
  "AES:Visionary|MOR:high": "Prophet",
  "AES:Pastoral|CD:high":  "Hearth-Conservative",
  "AES:Authentic|PF:high": "Plain-Partisan",

  // Epistemic × institutions
  "EPS:Empiricist|ONT_S:high":    "Evidence-Institutionalist",
  "EPS:Empiricist|ONT_S:low":     "Skeptic",
  "EPS:Traditionalist|ONT_S:high": "Custom-Institutionalist",
  "EPS:Intuitionist|ONT_S:low":   "Gut-Outsider",
  "EPS:Autonomous|MAT:high":      "Self-Reliant",
  "EPS:Nihilist|ZS:high":         "Cynic",

  // Moral-circle scope compressions
  "MAT:low|MORAL_CIRCLE:national":  "Civic-Nationalist-Left",
  "MAT:high|MORAL_CIRCLE:national": "Civic-Nationalist-Right",
  "MORAL_CIRCLE:national|PF:high":  "Patriot-Partisan",
  "MORAL_CIRCLE:class|AES:Fighter": "Class-Fighter",
  "MORAL_CIRCLE:religious|CD:high": "Religious-Conservative",
  "MORAL_CIRCLE:universal|MAT:low": "Solidarist",
  "MORAL_CIRCLE:universal|CU:high": "Cosmopolite",

  // Engagement modifiers
  "ENG:low|MAT:high":  "Quiet-Conservative",
  "ENG:low|CD:low":    "Disengaged-Progressive",
  "ENG:high|PF:high":  "Activist-Partisan",
};

/**
 * Apply compression to a token list: find the first compressible pair (highest-
 * salience pair first), substitute the pair with the single word, return new
 * token-like array. Returns null if no compression applies.
 */
function applyCompression(tokens: TokenEntry[]): TokenEntry[] | null {
  if (tokens.length < 2) return null;
  // Try every pair, prefer earlier (higher-salience) pairs.
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      const pair = [tokens[i]!, tokens[j]!];
      const sig = signatureOf(pair);
      if (sig in COMPRESSION_TABLE) {
        const compressed: TokenEntry = {
          node: "_COMPRESSED",
          bin: sig,
          token: COMPRESSION_TABLE[sig]!,
          salience: Math.max(tokens[i]!.salience, tokens[j]!.salience),
          isCategorical: true,
        };
        // Replace tokens[i] and tokens[j] with the compressed entry, preserving rest.
        const remaining = tokens.filter((_, k) => k !== i && k !== j);
        return [compressed, ...remaining];
      }
    }
  }
  return null;
}

/**
 * Browser-friendly wrapper: takes a respondent state (dump shape) and returns
 * just the composed label string. Uses the embedded default merger table.
 */
export function composeArchetypeLabel(state: LabelerRespondentState): string {
  return labelForRespondent(state, DEFAULT_MERGER_TABLE).label;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

function argmax(arr: number[]): number {
  let best = -1, bestV = -Infinity;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i]! > bestV) { bestV = arr[i]!; best = i; }
  }
  return best;
}
