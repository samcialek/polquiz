#!/usr/bin/env node
/**
 * Full question-information audit (read-only).
 *
 * For each question in the representative bank:
 *   A. Static metadata
 *   B. Touch-profile risk flags (hollow_touch, subthreshold_touch, overloaded_question, etc.)
 *   C. Evidence strength per (node, role) — spread of expected values across options
 *   D. Declared-weight vs actual-evidence cross-check
 *   E. Routing/realized-use overlay (persona-replay + dump-replay)
 *   F. UX burden + signal_per_burden ratio
 *   G. Per-node coverage summary
 *
 * Outputs:
 *   results/eig-selector/question-information-audit.md
 *   results/eig-selector/question-information-audit.json
 *   results/eig-selector/question-information-audit.csv
 *   results/eig-selector/question-information-node-summary.md
 *
 * No source modifications. Imports compiled dist for runtime data.
 */

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, "results/eig-selector");

// ────────────────────────────────────────────────────────────────────────────
// Constants (must match src/engine/config.ts)
// ────────────────────────────────────────────────────────────────────────────
const MEANINGFUL_POSITION_WEIGHT = 0.4;
const POSITION_DRILL_SAL_FLOOR = 1.5;

const SCORING_NODES = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S"];
const SELF_CLUSTER_NODES = ["PF","TRB","ENG"];
const CATEGORICAL_NODES = ["EPS","AES"];
const ALL_NODES = [...SCORING_NODES, ...SELF_CLUSTER_NODES, ...CATEGORICAL_NODES, "TRB_ANCHOR"];

const UI_BURDEN = {
  single_choice: 1,
  slider: 1,
  pairwise: 1,
  dual_axis: 2,
  best_worst: 2,
  allocation: 2,
  conjoint: 2,
  multi: 2,
  priority_sort: 3,
  ranking: 3,
};

// CORE_OPENER + UNIVERSAL_SCREENERS (current 15 — see src/engine/config.ts)
const FIXED_OPENER = [200, 103, 97, 1, 60, 89, 22, 218, 211, 212, 93, 102, 209, 210, 214];

// FORCED_COVERAGE_PROBES from selectorEIG.ts
const FORCED_COVERAGE_PROBES = [7, 213, 18, 207];

// ────────────────────────────────────────────────────────────────────────────
// Helpers — expected-value computations
// ────────────────────────────────────────────────────────────────────────────

function expectedPos(dist) {
  // ContinuousPosDist [p1..p5] — 1-indexed scale
  if (!Array.isArray(dist) || dist.length !== 5) return null;
  return dist[0]*1 + dist[1]*2 + dist[2]*3 + dist[3]*4 + dist[4]*5;
}
function expectedSal(dist) {
  // SalienceDist [s0..s3]
  if (!Array.isArray(dist) || dist.length !== 4) return null;
  return dist[0]*0 + dist[1]*1 + dist[2]*2 + dist[3]*3;
}
function l1(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  let s = 0;
  for (let i = 0; i < a.length; i++) s += Math.abs(a[i] - b[i]);
  return s;
}
function maxPairwiseL1(dists) {
  let max = 0;
  for (let i = 0; i < dists.length; i++)
    for (let j = i+1; j < dists.length; j++)
      max = Math.max(max, l1(dists[i], dists[j]));
  return max;
}
function rangeOf(values) {
  if (!values.length) return 0;
  return Math.max(...values) - Math.min(...values);
}

// ────────────────────────────────────────────────────────────────────────────
// Evidence-strength extraction — walks every evidence map shape
// ────────────────────────────────────────────────────────────────────────────

/**
 * Collect per-(node, role) evidence from a question.
 * Returns: Map<"NODE|role", { node, role, strengthScore, optionCount, hasContent }>
 * strengthScore semantics:
 *   role=position: range of E[pos] across options (in [0,4])
 *   role=salience: range of E[sal] across options (in [0,3])
 *   role=category: max pairwise L1 distance across options (in [0,2])
 *   role=anchor:   range of anchor-weight values across options (raw)
 */
function extractEvidence(q) {
  // Bucket: key = "NODE|role" → list of per-option values for that node+role
  const posLists = new Map();        // node → [E[pos]_per_option that explicitly touches]
  const salLists = new Map();        // node → [E[sal]_per_option that explicitly touches]
  const catLists = new Map();        // node → [CategoricalDist_per_option that explicitly touches]
  const anchorLists = new Map();     // anchor → [weight_per_option]
  // Total option count (denominator for "are some options silent on this node?")
  let totalOptions = 0;

  function pushPos(node, dist) {
    const e = expectedPos(dist);
    if (e == null) return;
    if (!posLists.has(node)) posLists.set(node, []);
    posLists.get(node).push(e);
  }
  function pushSal(node, dist) {
    const e = expectedSal(dist);
    if (e == null) return;
    if (!salLists.has(node)) salLists.set(node, []);
    salLists.get(node).push(e);
  }
  function pushCat(node, dist) {
    if (!Array.isArray(dist) || dist.length !== 6) return;
    if (!catLists.has(node)) catLists.set(node, []);
    catLists.get(node).push(dist);
  }
  function pushAnchor(anchor, w) {
    if (typeof w !== "number") return;
    if (!anchorLists.has(anchor)) anchorLists.set(anchor, []);
    anchorLists.get(anchor).push(w);
  }

  // optionEvidence / sliderMap — same shape: key → { continuous: {NODE: {pos?, sal?}}, categorical: {NODE: {cat?, sal?}}, trbAnchor: {a: w} }
  function walkOptionEvidence(map) {
    if (!map) return;
    for (const ev of Object.values(map)) {
      if (!ev) continue;
      if (ev.continuous) {
        for (const [node, oc] of Object.entries(ev.continuous)) {
          if (oc?.pos) pushPos(node, oc.pos);
          if (oc?.sal) pushSal(node, oc.sal);
        }
      }
      if (ev.categorical) {
        for (const [node, oc] of Object.entries(ev.categorical)) {
          if (oc?.cat) pushCat(node, oc.cat);
          if (oc?.sal) pushSal(node, oc.sal);
        }
      }
      if (ev.trbAnchor) {
        for (const [a, w] of Object.entries(ev.trbAnchor)) pushAnchor(a, w);
      }
    }
  }

  walkOptionEvidence(q.optionEvidence);
  walkOptionEvidence(q.sliderMap);
  if (q.optionEvidence) totalOptions += Object.keys(q.optionEvidence).length;
  if (q.sliderMap) totalOptions += Object.keys(q.sliderMap).length;
  if (q.allocationMap) totalOptions += Object.keys(q.allocationMap).length;
  if (q.rankingMap) totalOptions += Object.keys(q.rankingMap).length;
  if (q.bestWorstMap) totalOptions += Object.keys(q.bestWorstMap).length;
  if (q.salienceBuckets) totalOptions += Object.keys(q.salienceBuckets).length;
  if (q.dualAxisMap) totalOptions += 2;

  // allocationMap: key → { continuous: {NODE: number}, categorical: {NODE: CatDist}, trbAnchor: {a: w} }
  // For allocations, "evidence strength" is the range of per-bucket scalar deltas
  // applied to the node's posDist.
  if (q.allocationMap) {
    const perNodeDeltas = new Map();
    for (const ev of Object.values(q.allocationMap)) {
      if (!ev) continue;
      if (ev.continuous) {
        for (const [node, delta] of Object.entries(ev.continuous)) {
          if (typeof delta !== "number") continue;
          if (!perNodeDeltas.has(node)) perNodeDeltas.set(node, []);
          perNodeDeltas.get(node).push(delta);
        }
      }
      if (ev.categorical) {
        for (const [node, dist] of Object.entries(ev.categorical)) pushCat(node, dist);
      }
      if (ev.trbAnchor) {
        for (const [a, w] of Object.entries(ev.trbAnchor)) pushAnchor(a, w);
      }
    }
    // Treat allocation deltas as pseudo-positions: strength = range of deltas (typical |delta| 0.2-0.9, range 1-2)
    for (const [node, deltas] of perNodeDeltas) {
      if (!posLists.has(node)) posLists.set(node, []);
      // Translate deltas to pseudo-pos: anchor at 3 (neutral) + delta*2 to map [-1,+1]→[1,5]
      for (const d of deltas) posLists.get(node).push(3 + d * 2);
    }
  }

  // rankingMap: key → { continuous: {NODE: number | OptionEvidenceContinuous}, categorical: {NODE: CatDist}, trbAnchor: {a: w} }
  // bestWorstMap: same shape
  function walkRankingMap(map) {
    if (!map) return;
    const perNodeDeltas = new Map();
    for (const ev of Object.values(map)) {
      if (!ev) continue;
      if (ev.continuous) {
        for (const [node, val] of Object.entries(ev.continuous)) {
          if (typeof val === "number") {
            if (!perNodeDeltas.has(node)) perNodeDeltas.set(node, []);
            perNodeDeltas.get(node).push(val);
          } else if (val && typeof val === "object") {
            if (val.pos) pushPos(node, val.pos);
            if (val.sal) pushSal(node, val.sal);
          }
        }
      }
      if (ev.categorical) {
        for (const [node, dist] of Object.entries(ev.categorical)) pushCat(node, dist);
      }
      if (ev.trbAnchor) {
        for (const [a, w] of Object.entries(ev.trbAnchor)) pushAnchor(a, w);
      }
    }
    for (const [node, deltas] of perNodeDeltas) {
      if (!posLists.has(node)) posLists.set(node, []);
      for (const d of deltas) posLists.get(node).push(3 + d * 2);
    }
  }
  walkRankingMap(q.rankingMap);
  walkRankingMap(q.bestWorstMap);

  // pairMaps: { pairKey: { optKey: { continuous?, categorical? } } }
  if (q.pairMaps) {
    for (const pair of Object.values(q.pairMaps)) {
      for (const ev of Object.values(pair)) {
        if (!ev) continue;
        if (ev.continuous) {
          for (const [node, val] of Object.entries(ev.continuous)) {
            if (typeof val === "number") {
              if (!posLists.has(node)) posLists.set(node, []);
              posLists.get(node).push(3 + val * 2);
            }
          }
        }
        if (ev.categorical) {
          for (const [node, dist] of Object.entries(ev.categorical)) pushCat(node, dist);
        }
      }
    }
  }

  // dualAxisMap: { node, xLow: posDist, xHigh: posDist }
  if (q.dualAxisMap) {
    pushPos(q.dualAxisMap.node, q.dualAxisMap.xLow);
    pushPos(q.dualAxisMap.node, q.dualAxisMap.xHigh);
    // Salience comes from y axis (0..1) — implicit; treat as full-range
    if (!salLists.has(q.dualAxisMap.node)) salLists.set(q.dualAxisMap.node, []);
    salLists.get(q.dualAxisMap.node).push(0);
    salLists.get(q.dualAxisMap.node).push(3);
  }

  // salienceBuckets (Q103): { bucketKey: SalienceDist [s0..s3] }
  // Multi-node — applies to every node listed in rankingMap items.
  if (q.salienceBuckets && q.rankingMap) {
    const bucketSals = Object.values(q.salienceBuckets).map(expectedSal).filter(v => v != null);
    const range = rangeOf(bucketSals);
    // Apply this range to every continuous + categorical node mentioned in rankingMap
    for (const item of Object.values(q.rankingMap)) {
      if (!item) continue;
      const nodes = [];
      if (item.continuous) nodes.push(...Object.keys(item.continuous));
      if (item.categorical) nodes.push(...Object.keys(item.categorical));
      for (const node of nodes) {
        if (!salLists.has(node)) salLists.set(node, []);
        // Buckets define explicit per-bucket sal distributions. Add range as
        // [min, max] of expected-sal so range computation downstream is correct.
        salLists.get(node).push(Math.min(...bucketSals));
        salLists.get(node).push(Math.max(...bucketSals));
      }
    }
  }

  return { posLists, salLists, catLists, anchorLists, totalOptions };
}

/**
 * "Effective spread" includes a neutral-baseline value if some options touch
 * the node and others don't. A question with 4 options where only option D
 * pushes CD pos to 4.0 effectively has range = max(4.0, 3.0) - min(4.0, 3.0) = 1.0,
 * not 0 (which would be the case if we only looked at the explicit list).
 */
function effectiveSpread(values, totalOptions, neutral) {
  if (!values.length) return 0;
  const explicitMissing = totalOptions > values.length;
  const arr = explicitMissing ? [...values, neutral] : values;
  return rangeOf(arr);
}

function classifyStrength(role, score) {
  if (role === "position") {
    // Range across [1,5] scale
    if (score < 0.5) return "too_weak";
    if (score < 2.5) return "reasonable";
    if (score < 3.5) return "strong";
    return "too_strong";
  }
  if (role === "salience") {
    // Range across [0,3] scale
    if (score < 0.4) return "too_weak";
    if (score < 1.8) return "reasonable";
    if (score < 2.5) return "strong";
    return "too_strong";
  }
  if (role === "category") {
    // L1 distance across 6-cat dist [0,2]
    if (score < 0.3) return "too_weak";
    if (score < 1.2) return "reasonable";
    return "strong";
  }
  if (role === "anchor") {
    // score = number of distinct anchors with non-zero weight across options
    if (score < 2) return "too_weak";
    if (score < 6) return "reasonable";
    return "strong";
  }
  return "ambiguous";
}

// ────────────────────────────────────────────────────────────────────────────
// Per-question audit
// ────────────────────────────────────────────────────────────────────────────

/**
 * For a given question + (node, role) touch entry, decide whether the engine
 * has any *implicit* path that would deliver evidence for that combination
 * even when the explicit evidence map doesn't carry per-option pos/sal/cat
 * arrays. Mirrors what update.ts actually does:
 *
 *   - ranking         → RANK_SAL likelihood applied per-rank when touchProfile declares salience
 *   - best_worst      → SAL_IF_BEST / WORST / MIDDLE per node-bucket
 *   - priority_sort   → bucket-driven sal via salienceBuckets (or default per-bucket)
 *   - single_choice / slider with extreme continuous pos evidence → boostExtremitySalience
 *   - dual_axis       → y-axis salience always derived
 */
function hasImplicitDerivation(q, t) {
  if (t.role !== "salience") return false;
  // Allocation: HHI-driven salience for any sal touch (applyAllocationAnswer).
  if (q.uiType === "allocation") return true;
  // Ranking / priority_sort / best_worst: per-rank or per-bucket sal likelihoods.
  if (q.uiType === "ranking" || q.uiType === "priority_sort" || q.uiType === "best_worst") return true;
  // Dual axis: y-axis IS the salience signal.
  if (q.uiType === "dual_axis") return true;
  // strengthFollowUp (kind: "strength" | "ratio"): post-answer hook
  // applyStoredRatioBoost in src/browser/api.ts loops every salience touchProfile
  // entry and multiplies in ratioToSalienceDist(ratio). Applies to single_choice,
  // multi, conjoint — any uiType that pairs with a strength/ratio follow-up.
  if (q.strengthFollowUp) return true;
  // single_choice / slider: extremity boost triggered when chosen option has
  // an extreme continuous pos evidence map.
  if (q.uiType === "single_choice" || q.uiType === "slider") {
    if (t.kind !== "continuous") return false;
    const maps = [q.optionEvidence, q.sliderMap];
    for (const m of maps) {
      if (!m) continue;
      for (const ev of Object.values(m)) {
        const pos = ev?.continuous?.[t.node]?.pos;
        if (Array.isArray(pos) && pos.length === 5) {
          const max = Math.max(...pos);
          if (max >= 0.40) {
            const idx = pos.indexOf(max);
            if (idx === 0 || idx === 4) return true;
          }
        }
      }
    }
  }
  // multi / pairwise / conjoint without strengthFollowUp: NO implicit derivation.
  return false;
}

function auditQuestion(q, replayStats) {
  const ev = extractEvidence(q);
  const flags = [];
  const touchEvaluations = [];

  const distinctNodes = new Set();
  for (const t of q.touchProfile ?? []) distinctNodes.add(t.node);

  // Overloaded question check (≥4 distinct nodes touched)
  if (distinctNodes.size >= 4) {
    flags.push({ kind: "overloaded_question", detail: `touches ${distinctNodes.size} distinct nodes/anchors` });
  }

  // No-touch metadata question (Q200/Q211/Q212 et al.)
  if ((q.touchProfile ?? []).length === 0) {
    flags.push({ kind: "metadata_without_evidence", detail: "no touchProfile entries" });
  }

  // Per-touchProfile entry check
  for (const t of q.touchProfile ?? []) {
    let hasEvidence = false;
    let strengthScore = 0;
    let optionCount = 0;
    let strengthClass = "ambiguous";

    if (t.role === "position") {
      const list = ev.posLists.get(t.node) ?? [];
      strengthScore = effectiveSpread(list, ev.totalOptions, 3.0);
      hasEvidence = list.length > 0 && strengthScore > 0;
      optionCount = list.length;
      strengthClass = classifyStrength("position", strengthScore);
    } else if (t.role === "salience") {
      const list = ev.salLists.get(t.node) ?? [];
      strengthScore = effectiveSpread(list, ev.totalOptions, 1.5);
      hasEvidence = list.length > 0 && strengthScore > 0;
      optionCount = list.length;
      strengthClass = classifyStrength("salience", strengthScore);
    } else if (t.role === "category") {
      // Category: include implicit "no-touch" neutral by checking against uniform.
      const list = ev.catLists.get(t.node) ?? [];
      const explicitMissing = ev.totalOptions > list.length;
      const aug = explicitMissing ? [...list, [1/6,1/6,1/6,1/6,1/6,1/6]] : list;
      strengthScore = maxPairwiseL1(aug);
      hasEvidence = list.length > 0 && strengthScore > 0;
      optionCount = list.length;
      strengthClass = classifyStrength("category", strengthScore);
    } else if (t.role === "anchor") {
      // Anchor evidence is keyed by anchor name. Strength = number of distinct
      // anchors covered (each carrying meaningful signal). 8 distinct anchors
      // = full coverage of the TRB_ANCHOR space.
      hasEvidence = ev.anchorLists.size > 0;
      strengthScore = ev.anchorLists.size;
      optionCount = [...ev.anchorLists.values()].reduce((s, a) => s + a.length, 0);
      strengthClass = classifyStrength("anchor", strengthScore);
    }

    let derivedImplicit = false;
    if (!hasEvidence) {
      derivedImplicit = hasImplicitDerivation(q, t);
      if (!derivedImplicit) {
        flags.push({
          kind: "hollow_touch",
          detail: `${t.node}/${t.role} declared (weight=${t.weight}) but no evidence map or implicit derivation affects it`
        });
      }
    }
    if (t.role === "position" && t.weight < MEANINGFUL_POSITION_WEIGHT) {
      flags.push({
        kind: "subthreshold_touch",
        detail: `${t.node}/position weight=${t.weight} < MEANINGFUL_POSITION_WEIGHT (${MEANINGFUL_POSITION_WEIGHT})`
      });
    }
    if (hasEvidence && t.weight >= 0.7 && strengthClass === "too_weak") {
      flags.push({
        kind: "declared_high_actual_low",
        detail: `${t.node}/${t.role} weight=${t.weight} but evidence range ${strengthScore.toFixed(2)} is ${strengthClass}`
      });
    }
    if (hasEvidence && t.weight <= 0.3 && (strengthClass === "strong" || strengthClass === "too_strong")) {
      flags.push({
        kind: "declared_low_actual_high",
        detail: `${t.node}/${t.role} weight=${t.weight} but evidence range ${strengthScore.toFixed(2)} is ${strengthClass}`
      });
    }
    if (strengthClass === "too_strong") {
      flags.push({
        kind: "evidence_too_strong",
        detail: `${t.node}/${t.role} range ${strengthScore.toFixed(2)} (option count ${optionCount})`
      });
    }
    if (hasEvidence && strengthClass === "too_weak" && t.weight >= MEANINGFUL_POSITION_WEIGHT) {
      flags.push({
        kind: "evidence_too_weak",
        detail: `${t.node}/${t.role} range ${strengthScore.toFixed(2)} but weight=${t.weight} (counts toward routing)`
      });
    }

    touchEvaluations.push({
      node: t.node,
      role: t.role,
      kind: t.kind,
      weight: t.weight,
      touchType: t.touchType,
      hasEvidence: hasEvidence || derivedImplicit,
      hasExplicitEvidence: hasEvidence,
      derivedImplicit,
      strengthScore: +strengthScore.toFixed(3),
      strengthClass,
      optionCount,
    });
  }

  // SELF-cluster sal touches — flag if encoded (ADR-005 says PF/TRB/ENG have no sal axis)
  for (const t of q.touchProfile ?? []) {
    if (SELF_CLUSTER_NODES.includes(t.node) && t.role === "salience") {
      flags.push({
        kind: "self_cluster_salience_touch",
        detail: `${t.node} has no salience axis post-ADR-005; touch should be position-only`
      });
    }
  }

  const burden = UI_BURDEN[q.uiType] ?? 2;
  const totalEvidence = touchEvaluations
    .filter(t => t.hasEvidence)
    .reduce((s, t) => s + (t.weight * t.strengthScore), 0);
  const signalPerBurden = +(totalEvidence / burden).toFixed(3);

  // Routing/realized-use overlay
  const replay = replayStats.get(q.id) ?? { askedCount: 0, avgSlot: null, inDumps: [] };

  return {
    qid: q.id,
    promptShort: q.promptShort,
    stage: q.stage,
    section: q.section,
    uiType: q.uiType,
    quality: q.quality,
    rewriteNeeded: q.rewriteNeeded,
    priorityBattery: !!q.priorityBattery,
    burden,
    distinctNodesTouched: distinctNodes.size,
    isFixedOpener: FIXED_OPENER.includes(q.id),
    fixedOpenerSlot: FIXED_OPENER.indexOf(q.id) >= 0 ? FIXED_OPENER.indexOf(q.id) + 1 : null,
    isForcedCoverageProbe: FORCED_COVERAGE_PROBES.includes(q.id),
    touchProfile: touchEvaluations,
    flags,
    totalEvidenceWeighted: +totalEvidence.toFixed(3),
    signalPerBurden,
    realizedUse: replay,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Replay overlay
// ────────────────────────────────────────────────────────────────────────────

function buildReplayStats(personaPath, dumpPath) {
  const stats = new Map(); // qid → { askedCount, slots[], avgSlot, inDumps[] }
  const ensure = (qid) => {
    if (!stats.has(qid)) stats.set(qid, { askedCount: 0, slots: [], avgSlot: null, inDumps: [], inFixedOpener: false });
    return stats.get(qid);
  };

  if (existsSync(personaPath)) {
    const persona = JSON.parse(readFileSync(personaPath, "utf8"));
    // persona file is array of per-archetype results with questionsAsked OR sequenceAsked
    // (Inspect first entry to detect schema.)
    const arr = Array.isArray(persona) ? persona : (persona.results ?? []);
    for (const r of arr) {
      const seq = r.questionsAsked ?? r.sequenceAsked ?? r.asked ?? null;
      if (Array.isArray(seq)) {
        seq.forEach((entry, idx) => {
          const qid = typeof entry === "number" ? entry : entry.qId ?? entry.id;
          if (typeof qid !== "number") return;
          const s = ensure(qid);
          s.askedCount++;
          s.slots.push(idx + 1);
        });
      }
    }
  }

  if (existsSync(dumpPath)) {
    const dumps = JSON.parse(readFileSync(dumpPath, "utf8"));
    const dumpLabels = ["D1","D2","D3"];
    dumps.forEach((d, i) => {
      const seq = d.questionsAsked ?? [];
      seq.forEach((entry, idx) => {
        const qid = entry.qId;
        if (typeof qid !== "number") return;
        const s = ensure(qid);
        if (!s.inDumps.includes(dumpLabels[i])) {
          s.inDumps.push(`${dumpLabels[i]}@${idx+1}`);
        }
      });
    });
  }

  for (const [, s] of stats) {
    s.avgSlot = s.slots.length ? +(s.slots.reduce((a,b)=>a+b,0)/s.slots.length).toFixed(1) : null;
    delete s.slots;
  }
  return stats;
}

// ────────────────────────────────────────────────────────────────────────────
// Per-node coverage summary
// ────────────────────────────────────────────────────────────────────────────

function buildNodeCoverage(audits) {
  const summary = {};
  for (const node of [...SCORING_NODES, ...SELF_CLUSTER_NODES, ...CATEGORICAL_NODES]) {
    summary[node] = {
      node,
      cluster: SCORING_NODES.includes(node) ? (
        ["MAT","CD","CU","MOR"].includes(node) ? "ENDS" :
        ["PRO","COM"].includes(node) ? "MEANS" :
        "REALITY"
      ) : SELF_CLUSTER_NODES.includes(node) ? "SELF" : "MEANS",
      positionTouchCount: 0,
      salienceTouchCount: 0,
      categoryTouchCount: 0,
      meaningfulPositionTouchCount: 0,
      cleanDirectProbeCount: 0,        // single-node high-weight position touch
      omnibusProbeCount: 0,             // 4+ distinct nodes touched in same q
      fixedOpenerTouchCount: 0,
      dynamicOnlyTouchCount: 0,
      forcedCoverageProbeCount: 0,
      hollowTouchCount: 0,
    };
  }
  for (const a of audits) {
    for (const t of a.touchProfile) {
      const s = summary[t.node];
      if (!s) continue;
      if (t.role === "position") {
        s.positionTouchCount++;
        if (t.weight >= MEANINGFUL_POSITION_WEIGHT) s.meaningfulPositionTouchCount++;
        if (a.distinctNodesTouched === 1 && t.weight >= 0.7) s.cleanDirectProbeCount++;
      }
      if (t.role === "salience") s.salienceTouchCount++;
      if (t.role === "category") s.categoryTouchCount++;
      if (a.distinctNodesTouched >= 4) s.omnibusProbeCount++;
      if (a.isFixedOpener) s.fixedOpenerTouchCount++;
      else s.dynamicOnlyTouchCount++;
      if (a.isForcedCoverageProbe) s.forcedCoverageProbeCount++;
      if (!t.hasEvidence) s.hollowTouchCount++;
    }
  }
  // Coverage classification (categorical nodes use category coverage instead of position).
  for (const node of Object.keys(summary)) {
    const s = summary[node];
    if (CATEGORICAL_NODES.includes(node)) {
      s.coverageStatus =
        s.categoryTouchCount === 0 ? "uncovered_category" :
        s.categoryTouchCount <= 2 ? "thin_category_coverage" :
        s.categoryTouchCount >= 10 ? "over_covered_category" :
        "adequate_category_coverage";
    } else if (SELF_CLUSTER_NODES.includes(node)) {
      // SELF cluster has no separate sal axis (ADR-005). Position-only coverage.
      s.coverageStatus =
        s.meaningfulPositionTouchCount === 0 ? "uncovered_position" :
        s.meaningfulPositionTouchCount <= 2 ? "thin_position_coverage" :
        s.meaningfulPositionTouchCount >= 12 ? "over_covered_position" :
        "adequate_position_coverage";
    } else {
      s.coverageStatus =
        s.meaningfulPositionTouchCount === 0 ? "uncovered_position" :
        s.meaningfulPositionTouchCount <= 2 ? "thin_position_coverage" :
        s.meaningfulPositionTouchCount >= 12 ? "over_covered_position" :
        "adequate_position_coverage";
    }
  }
  return summary;
}

// ────────────────────────────────────────────────────────────────────────────
// Markdown / CSV rendering
// ────────────────────────────────────────────────────────────────────────────

function csvEscape(v) {
  if (v == null) return "";
  const s = String(v);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function renderCsv(audits) {
  const head = [
    "qid","promptShort","stage","uiType","quality","priorityBattery",
    "burden","distinctNodes","isFixedOpener","fixedOpenerSlot","isForcedCoverageProbe",
    "totalEvidenceWeighted","signalPerBurden",
    "askedCount","avgSlot","inDumps",
    "flagCount","flagKinds",
    "touchSummary",
  ].join(",");
  const rows = audits.map(a => {
    const flagKinds = [...new Set(a.flags.map(f => f.kind))].join("|");
    const touchSummary = a.touchProfile.map(t =>
      `${t.node}/${t.role}@${t.weight}~${t.strengthClass}(${t.strengthScore})`
    ).join("|");
    return [
      a.qid, a.promptShort, a.stage, a.uiType, a.quality, a.priorityBattery,
      a.burden, a.distinctNodesTouched, a.isFixedOpener, a.fixedOpenerSlot ?? "", a.isForcedCoverageProbe,
      a.totalEvidenceWeighted, a.signalPerBurden,
      a.realizedUse.askedCount, a.realizedUse.avgSlot ?? "", a.realizedUse.inDumps.join(";"),
      a.flags.length, flagKinds,
      touchSummary,
    ].map(csvEscape).join(",");
  });
  return [head, ...rows].join("\n");
}

function classifyIssue(audit) {
  const kinds = new Set(audit.flags.map(f => f.kind));
  // P0: hollow_touch, self_cluster_salience_touch
  if (kinds.has("hollow_touch") || kinds.has("self_cluster_salience_touch")) return "P0";
  // P1: declared_high_actual_low, evidence_too_weak (with subthreshold), evidence_too_strong, declared_low_actual_high
  if (
    kinds.has("declared_high_actual_low") ||
    kinds.has("evidence_too_strong") ||
    kinds.has("declared_low_actual_high") ||
    kinds.has("evidence_too_weak")
  ) return "P1";
  // P2: overloaded_question, subthreshold_touch (where it counts), metadata_without_evidence
  if (kinds.has("overloaded_question") || kinds.has("subthreshold_touch") || kinds.has("metadata_without_evidence")) return "P2";
  return null;
}

function renderMarkdown(audits, nodeCoverage, baselineMeta) {
  const lines = [];
  lines.push(`# Question-information audit`);
  lines.push(``);
  lines.push(`**Date:** 2026-05-03 (Terminal-3, read-only audit)`);
  lines.push(`**HEAD:** ${baselineMeta.head}`);
  lines.push(`**Bank:** \`src/config/questions.representative.ts\` — ${audits.length} questions audited`);
  lines.push(`**Replay overlay:** persona-replay (${baselineMeta.personaCount} archetypes), dump-replay (3 dumps)`);
  lines.push(``);
  lines.push(`## Methodology`);
  lines.push(``);
  lines.push(`For each question, walked every evidence map (\`optionEvidence\`, \`sliderMap\`, \`allocationMap\`, \`rankingMap\`, \`bestWorstMap\`, \`pairMaps\`, \`dualAxisMap\`, \`salienceBuckets\`) and computed per-(node, role) evidence strength as the *range* of expected outputs across all options/buckets/items. Compared declared touchProfile weight against actual evidence-map content. Cross-referenced with persona-replay + dump-replay for realized routing.`);
  lines.push(``);
  lines.push(`Evidence-strength scale:`);
  lines.push(`- **position** (range over [1,5]): too_weak <0.5, reasonable 0.5–2.5, strong 2.5–3.5, too_strong ≥3.5.`);
  lines.push(`- **salience** (range over [0,3]): too_weak <0.4, reasonable 0.4–1.8, strong 1.8–2.5, too_strong ≥2.5.`);
  lines.push(`- **category** (max pairwise L1 over 6-cat dist [0,2]): too_weak <0.3, reasonable 0.3–1.2, strong ≥1.2.`);
  lines.push(``);
  lines.push(`Issue classification:`);
  lines.push(`- **P0 bug** — hollow touch (touchProfile declares node/role but no evidence map affects it), or SELF-cluster sal touch (forbidden post-ADR-005).`);
  lines.push(`- **P1 measurement risk** — declared-vs-actual mismatch, evidence too strong/weak with material weight.`);
  lines.push(`- **P2 efficiency issue** — overloaded probe, subthreshold touch counted somewhere, or metadata-only question.`);
  lines.push(`- **P3 documentation / terminology issue** — not auto-detected; flagged manually if observed.`);
  lines.push(``);

  // Executive summary — top 10 suspicious
  const suspicionScore = a => {
    const k = new Set(a.flags.map(f => f.kind));
    let s = 0;
    if (k.has("hollow_touch")) s += 10;
    if (k.has("self_cluster_salience_touch")) s += 10;
    if (k.has("declared_high_actual_low")) s += 6;
    if (k.has("evidence_too_strong")) s += 5;
    if (k.has("evidence_too_weak")) s += 4;
    if (k.has("declared_low_actual_high")) s += 4;
    if (k.has("overloaded_question")) s += 2;
    if (k.has("subthreshold_touch")) s += 1;
    s += a.flags.length * 0.5;
    return s;
  };
  const sorted = [...audits].sort((a,b) => suspicionScore(b) - suspicionScore(a));

  lines.push(`## 1. Executive summary — top 10 suspicious questions`);
  lines.push(``);
  lines.push(`| qid | promptShort | uiType | nodes | flags | priority |`);
  lines.push(`|---:|---|---|---:|---|:-:|`);
  for (const a of sorted.slice(0, 10)) {
    const flagKinds = [...new Set(a.flags.map(f => f.kind))].join(", ") || "—";
    const p = classifyIssue(a) ?? "—";
    lines.push(`| ${a.qid} | \`${a.promptShort}\` | ${a.uiType} | ${a.distinctNodesTouched} | ${flagKinds} | ${p} |`);
  }
  lines.push(``);

  function tableForFlag(flagKind, header) {
    const subset = audits.filter(a => a.flags.some(f => f.kind === flagKind));
    if (!subset.length) {
      lines.push(`_(none detected)_`);
      lines.push(``);
      return;
    }
    lines.push(`| qid | promptShort | uiType | flag detail |`);
    lines.push(`|---:|---|---|---|`);
    for (const a of subset.slice(0, 30)) {
      const detail = a.flags.filter(f => f.kind === flagKind).map(f => f.detail).join("; ");
      lines.push(`| ${a.qid} | \`${a.promptShort}\` | ${a.uiType} | ${detail} |`);
    }
    if (subset.length > 30) lines.push(`| _…_ | _+${subset.length - 30} more_ | | |`);
    lines.push(``);
  }

  // P0 detail breakdown
  const p0List = audits.filter(a => classifyIssue(a) === "P0");
  lines.push(`### 1a. P0 hollow-touch detail (${p0List.length} questions)`);
  lines.push(``);
  lines.push(`Each row is a touchProfile entry that declares a node/role but the engine call path delivers no evidence for that combination — neither explicit per-option arrays nor any of the implicit-derivation paths in \`update.ts\` (extremity-boost for single_choice/slider, HHI for allocation, RANK_SAL for ranking, SAL_IF_BEST/WORST/MIDDLE for best_worst, salienceBuckets for priority_sort, y-axis for dual_axis). \`registerTouches\` still increments \`node.touches\` for these — so the routing ledger inflates while estimates stay unchanged.`);
  lines.push(``);
  lines.push(`| qid | uiType | hollow node/role | weight | impact |`);
  lines.push(`|---:|---|---|---:|---|`);
  for (const a of p0List) {
    const hollows = a.flags.filter(f => f.kind === "hollow_touch");
    for (const h of hollows) {
      const m = h.detail.match(/^(\S+)\/(\S+)\s+declared\s+\(weight=([0-9.]+)\)/);
      if (!m) continue;
      const [, node, role, wstr] = m;
      const w = parseFloat(wstr);
      const impact = w >= MEANINGFUL_POSITION_WEIGHT ? "**HIGH** (counts toward routing)" : "low (subthreshold)";
      lines.push(`| ${a.qid} | ${a.uiType} | ${node}/${role} | ${w} | ${impact} |`);
    }
  }
  lines.push(``);

  lines.push(`## 2. Questions that appear too weak`);
  lines.push(``);
  tableForFlag("evidence_too_weak", "evidence_too_weak");

  lines.push(`## 3. Questions that appear too strong`);
  lines.push(``);
  tableForFlag("evidence_too_strong", "evidence_too_strong");

  lines.push(`## 4. Questions that are overloaded`);
  lines.push(``);
  tableForFlag("overloaded_question", "overloaded_question");

  lines.push(`## 5. Questions that are clean but under-routed`);
  lines.push(``);
  // Clean = single-node, weight≥0.7, strong/reasonable evidence; under-routed = askedCount low
  const underRouted = audits.filter(a =>
    a.distinctNodesTouched === 1 &&
    a.touchProfile.some(t => t.role === "position" && t.weight >= 0.7 && (t.strengthClass === "strong" || t.strengthClass === "reasonable")) &&
    !a.isFixedOpener &&
    !a.isForcedCoverageProbe &&
    a.realizedUse.askedCount < 30
  ).sort((a,b) => a.realizedUse.askedCount - b.realizedUse.askedCount);
  if (!underRouted.length) {
    lines.push(`_(none detected)_`);
  } else {
    lines.push(`| qid | promptShort | node/role | quality | asked count | avg slot |`);
    lines.push(`|---:|---|---|---:|---:|---:|`);
    for (const a of underRouted.slice(0, 20)) {
      const t = a.touchProfile[0];
      lines.push(`| ${a.qid} | \`${a.promptShort}\` | ${t.node}/${t.role} | ${a.quality} | ${a.realizedUse.askedCount} | ${a.realizedUse.avgSlot ?? "—"} |`);
    }
  }
  lines.push(``);

  lines.push(`## 6. Fixed-opener questions`);
  lines.push(``);
  lines.push(`| slot | qid | promptShort | uiType | nodes | burden | flags |`);
  lines.push(`|---:|---:|---|---|---:|---:|---|`);
  for (const slot of FIXED_OPENER.map((qid, i) => ({ qid, slot: i+1 }))) {
    const a = audits.find(x => x.qid === slot.qid);
    if (!a) {
      lines.push(`| ${slot.slot} | ${slot.qid} | _(not found in bank)_ | — | — | — | — |`);
      continue;
    }
    const flagKinds = [...new Set(a.flags.map(f => f.kind))].join(", ") || "—";
    lines.push(`| ${slot.slot} | ${a.qid} | \`${a.promptShort}\` | ${a.uiType} | ${a.distinctNodesTouched} | ${a.burden} | ${flagKinds} |`);
  }
  lines.push(``);

  lines.push(`## 7. Fixed-opener questions that could become conditional`);
  lines.push(``);
  // Heuristic: low signal_per_burden AND low realized impact when dropped
  // (we can't measure impact directly here, but we can flag the bottom 3 by signal_per_burden in the fixed opener)
  const fixedAudits = audits.filter(a => a.isFixedOpener).sort((a,b) => a.signalPerBurden - b.signalPerBurden);
  lines.push(`Bottom 5 fixed-opener questions by \`signal_per_burden\` (= weighted-evidence-sum / UI-burden). These are first-cut candidates for conditional/adaptive demotion.`);
  lines.push(``);
  lines.push(`| qid | promptShort | uiType | burden | totalEvidence | signal/burden | nodes |`);
  lines.push(`|---:|---|---|---:|---:|---:|---:|`);
  for (const a of fixedAudits.slice(0, 5)) {
    lines.push(`| ${a.qid} | \`${a.promptShort}\` | ${a.uiType} | ${a.burden} | ${a.totalEvidenceWeighted} | ${a.signalPerBurden} | ${a.distinctNodesTouched} |`);
  }
  lines.push(``);

  lines.push(`## 8. Per-node coverage table`);
  lines.push(``);
  lines.push(`| node | cluster | pos touches | sal touches | cat touches | meaningful pos | clean direct probes | omnibus probes | fixed-opener touches | hollow | status |`);
  lines.push(`|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---|`);
  for (const node of [...SCORING_NODES, ...SELF_CLUSTER_NODES, ...CATEGORICAL_NODES]) {
    const s = nodeCoverage[node];
    lines.push(`| ${node} | ${s.cluster} | ${s.positionTouchCount} | ${s.salienceTouchCount} | ${s.categoryTouchCount} | ${s.meaningfulPositionTouchCount} | ${s.cleanDirectProbeCount} | ${s.omnibusProbeCount} | ${s.fixedOpenerTouchCount} | ${s.hollowTouchCount} | ${s.coverageStatus} |`);
  }
  lines.push(``);

  // Special-attention questions
  lines.push(`## 9. Special-attention questions (per spec)`);
  lines.push(``);
  const special = [
    [1,    "redundant engagement reinforcement?"],
    [22,   "EPS tie-breaker, possible conditional-only?"],
    [102,  "expensive but structurally important — why?"],
    [82,   "CD/CU lever; mixed or too strong?"],
    [3,    "clean CD probe; now Top-K routed"],
    [8,    "clean MOR probe; possible future route"],
    [93,   "broad opener; overloaded but necessary?"],
    [103,  "salience screener; high burden but essential"],
    [209,  "direct ZS screener"],
    [210,  "direct ONT_H screener"],
    [214,  "direct ONT_S screener"],
    [89,   "EPS category anchor"],
    [218,  "AES category anchor"],
    [207,  "PRO forced-coverage probe"],
    [213,  "MOR forced-coverage probe"],
    [18,   "ONT_H forced-coverage probe"],
    [7,    "COM forced-coverage probe"],
  ];
  lines.push(`| qid | note | nodes | uiType | burden | total evidence | signal/burden | flags |`);
  lines.push(`|---:|---|---:|---|---:|---:|---:|---|`);
  for (const [qid, note] of special) {
    const a = audits.find(x => x.qid === qid);
    if (!a) {
      lines.push(`| ${qid} | ${note} | — | _not in bank_ | — | — | — | — |`);
      continue;
    }
    const flagKinds = [...new Set(a.flags.map(f => f.kind))].join(", ") || "—";
    lines.push(`| ${qid} | ${note} | ${a.distinctNodesTouched} | ${a.uiType} | ${a.burden} | ${a.totalEvidenceWeighted} | ${a.signalPerBurden} | ${flagKinds} |`);
  }
  lines.push(``);

  lines.push(`## 10. Recommended next experiments`);
  lines.push(``);
  const p0Count = audits.filter(a => classifyIssue(a) === "P0").length;
  const p1Count = audits.filter(a => classifyIssue(a) === "P1").length;
  const p2Count = audits.filter(a => classifyIssue(a) === "P2").length;
  lines.push(`Issue counts: **${p0Count} P0** · **${p1Count} P1** · **${p2Count} P2**`);
  lines.push(``);
  lines.push(`### Intentional patterns (not bugs)`);
  lines.push(``);
  lines.push(`Some flags surface deliberate design choices. These were verified against the question file's inline comments and \`results/architecture/\` ADRs:`);
  lines.push(``);
  lines.push(`- **Q103** salience screener — \`evidence_too_strong\` flag for all 11 sal touches is *intentional*. Q103's whole job is to drive \`salDist[0]\` past the eligibility gate in one touch via the \`salienceBuckets\` override (\`[0.90, 0.08, 0.02, 0.00]\` on the neutral bucket). The "too strong" flag is the audit recognizing the design.`);
  lines.push(`- **Q101** \`cultural_social_placement_dual\` — \`CD/salience range 3.00\` is intentional dual-axis behavior. Y-axis = "doesn't matter" (E[sal]≈0) to "central" (E[sal]≈3) by construction.`);
  lines.push(`- **Q39** \`opponent_model_allocation\` — \`TRB/position range 3.60\` reflects the deliberate opposite-pole encoding (allocation buckets at TRB:+0.9 and TRB:-0.9). Audit will always flag this; it's not a defect.`);
  lines.push(``);
  lines.push(`### Suggested follow-ups (priority-ordered)`);
  lines.push(``);
  lines.push(`1. **P0 fix highest-impact hollow salience touches first.** The most consequential P0s are hollow *salience* touches with weight ≥ MEANINGFUL_POSITION_WEIGHT (0.4):`);
  lines.push(`   - **Q22 EPS/salience@0.40** (fixed-opener) — touch declared but the only EPS update is via \`EPS.cat\`. The "tie-breaker" framing always referred to category disambiguation; the salience row is leftover. Drop the row.`);
  lines.push(`   - **Q25 PRO/salience@0.70** — high weight, no derivation path. Either add per-option \`PRO.sal\` arrays or drop the touch.`);
  lines.push(`   - **Q27 MAT/salience@0.65** — same pattern as Q25.`);
  lines.push(`   - **Q33 PRO/salience@0.55** — same pattern.`);
  lines.push(`   These are pure routing-ledger inflation. Each one either needs explicit per-option \`.sal\` evidence added or the touchProfile row removed.`);
  lines.push(`2. **P0 subthreshold hollow touches** — Q15/Q20/Q39/Q66 all declare \`EPS/category@0.10\` on allocation questions but the \`allocationMap.categorical\` field is never populated. These are subthreshold (don't count for routing) but still increment touch counters — drop the rows for hygiene.`);
  lines.push(`3. **P1 evidence_too_strong soak test.** For Q39 (TRB/position@3.60) verify whether the opposite-pole allocation is too aggressive — if a single bucket pick is collapsing the TRB posterior, it may be over-fitting. Q103/Q101 are intentional and need no change.`);
  lines.push(`4. **Under-routed clean probes** — Q3 (CD), Q8 (MOR), Q13 (MAT), Q17 (MAT), Q42 (TRB), Q43 (MAT), Q47 (COM), Q99 (TRB) are all single-node high-weight position questions never asked in any persona-replay. Q3 just got Top-K routed; Q8 (MOR) is the next-cleanest candidate for an MOR drill probe. Q47 (COM) is a clean COM probe currently unused — could replace Q7 in FORCED_COVERAGE_PROBES.`);
  lines.push(`5. **Conditional demotion candidates.** Bottom of the fixed-opener \`signal_per_burden\` table: Q200/Q211/Q212 all sit at signal=0 because they're metadata-only questions (no node evidence by design — they feed election compute). They cost 1 burden unit each but contribute no node estimate. *They should NOT be demoted* — Q200 PartyID is needed for the partisan multiplier; Q211/Q212 feed predictVote. Document this clearly so they're not bundled with low-signal candidates.`);
  lines.push(`6. **Overloaded omnibus probes.** Q5 (multi, 7 nodes — half hollow), Q63 (best_worst, 9 nodes), Q39 (allocation, 6 nodes), Q66 (allocation, 6 nodes) carry the highest distinct-node counts. Q5 in particular has 3 hollow touches inside a 7-node declaration — restructure or split. Q102 was already pruned (2026-05-02) and is now clean (1 effective node); leave alone. Q93/Q103 are deliberate priorityBatteries.`);
  lines.push(``);

  lines.push(`## Files written by this audit`);
  lines.push(``);
  lines.push(`- \`results/eig-selector/question-information-audit.md\` (this file)`);
  lines.push(`- \`results/eig-selector/question-information-audit.json\` — full machine-readable audit`);
  lines.push(`- \`results/eig-selector/question-information-audit.csv\` — one row per question`);
  lines.push(`- \`results/eig-selector/question-information-node-summary.md\` — per-node coverage detail`);
  lines.push(`- \`scripts/question-information-audit.mjs\` — audit script (untracked; not committed)`);
  lines.push(``);

  lines.push(`## Terminology check`);
  lines.push(``);
  lines.push(`No retired model concepts as active terms. Engagement (ENG) is referenced as a separate 1D continuous variable per ADR canon. Legacy code identifiers (\`MOR\`, \`TRB\`, \`PF\`, \`CU\`, \`CD\`, etc.) appear only as implementation labels for nodes. Touch-profile field names match \`src/types.ts\`.`);

  return lines.join("\n");
}

function renderNodeSummaryMd(nodeCoverage, audits) {
  const lines = [];
  lines.push(`# Per-node coverage summary`);
  lines.push(``);
  lines.push(`Detail expansion of the per-node table in the main audit. Each section lists every question that touches that node, sorted by weight × evidence-strength.`);
  lines.push(``);

  for (const node of [...SCORING_NODES, ...SELF_CLUSTER_NODES, ...CATEGORICAL_NODES]) {
    const s = nodeCoverage[node];
    lines.push(`## ${node} (${s.cluster}) — ${s.coverageStatus}`);
    lines.push(``);
    lines.push(`Position touches: ${s.positionTouchCount} (${s.meaningfulPositionTouchCount} meaningful) · salience touches: ${s.salienceTouchCount} · category touches: ${s.categoryTouchCount} · clean direct probes: ${s.cleanDirectProbeCount} · omnibus probes: ${s.omnibusProbeCount} · hollow touches: ${s.hollowTouchCount} · fixed-opener touches: ${s.fixedOpenerTouchCount}`);
    lines.push(``);

    const touching = [];
    for (const a of audits) {
      for (const t of a.touchProfile) {
        if (t.node === node) {
          touching.push({
            qid: a.qid, promptShort: a.promptShort, uiType: a.uiType,
            role: t.role, weight: t.weight, strengthScore: t.strengthScore, strengthClass: t.strengthClass,
            isFixedOpener: a.isFixedOpener, isForcedCoverageProbe: a.isForcedCoverageProbe,
            distinctNodes: a.distinctNodesTouched,
            askedCount: a.realizedUse.askedCount,
            hollow: !t.hasEvidence,
          });
        }
      }
    }
    touching.sort((x, y) => (y.weight * y.strengthScore) - (x.weight * x.strengthScore));
    if (!touching.length) {
      lines.push(`_(no questions touch this node)_`);
      lines.push(``);
      continue;
    }
    lines.push(`| qid | promptShort | role | weight | strength | class | nodes in q | fixed | asked | hollow |`);
    lines.push(`|---:|---|---|---:|---:|---|---:|:-:|---:|:-:|`);
    for (const t of touching) {
      lines.push(`| ${t.qid} | \`${t.promptShort}\` | ${t.role} | ${t.weight} | ${t.strengthScore} | ${t.strengthClass} | ${t.distinctNodes} | ${t.isFixedOpener ? "F" : (t.isForcedCoverageProbe ? "Pr" : "—")} | ${t.askedCount} | ${t.hollow ? "Y" : "—"} |`);
    }
    lines.push(``);
  }
  return lines.join("\n");
}

// ────────────────────────────────────────────────────────────────────────────
// Main
// ────────────────────────────────────────────────────────────────────────────

async function main() {
  const m = await import("file://" + join(ROOT, "dist/config/questions.representative.js").replace(/\\/g, "/"));
  const questions = m.REPRESENTATIVE_QUESTIONS;
  console.log(`Loaded ${questions.length} questions`);

  const replayStats = buildReplayStats(
    join(ROOT, "output/persona-replay.json"),
    join(ROOT, "output/dump-replay.json"),
  );
  console.log(`Replay stats covering ${replayStats.size} unique question IDs`);

  const audits = questions.map(q => auditQuestion(q, replayStats));
  const nodeCoverage = buildNodeCoverage(audits);
  audits.sort((a,b) => a.qid - b.qid);

  // Get persona count and HEAD for metadata
  let personaCount = 0;
  if (existsSync(join(ROOT, "output/persona-replay.json"))) {
    const p = JSON.parse(readFileSync(join(ROOT, "output/persona-replay.json"), "utf8"));
    personaCount = (p.results ?? p).length ?? 0;
  }
  const baselineMeta = { head: "e776daa", personaCount };

  // Outputs
  const json = {
    meta: {
      date: "2026-05-03",
      head: baselineMeta.head,
      personaCount: baselineMeta.personaCount,
      generator: "scripts/question-information-audit.mjs",
      bank: "src/config/questions.representative.ts",
      questionCount: audits.length,
    },
    constants: {
      MEANINGFUL_POSITION_WEIGHT,
      POSITION_DRILL_SAL_FLOOR,
      FIXED_OPENER,
      FORCED_COVERAGE_PROBES,
      UI_BURDEN,
    },
    nodeCoverage,
    audits,
    issueClassification: {
      P0: audits.filter(a => classifyIssue(a) === "P0").map(a => a.qid),
      P1: audits.filter(a => classifyIssue(a) === "P1").map(a => a.qid),
      P2: audits.filter(a => classifyIssue(a) === "P2").map(a => a.qid),
    },
  };
  writeFileSync(join(OUT_DIR, "question-information-audit.json"), JSON.stringify(json, null, 2));
  writeFileSync(join(OUT_DIR, "question-information-audit.csv"), renderCsv(audits));
  writeFileSync(join(OUT_DIR, "question-information-audit.md"), renderMarkdown(audits, nodeCoverage, baselineMeta));
  writeFileSync(join(OUT_DIR, "question-information-node-summary.md"), renderNodeSummaryMd(nodeCoverage, audits));

  console.log(`\nAudit complete.`);
  console.log(`  P0: ${json.issueClassification.P0.length} (${json.issueClassification.P0.join(", ")})`);
  console.log(`  P1: ${json.issueClassification.P1.length}`);
  console.log(`  P2: ${json.issueClassification.P2.length}`);
  console.log(`\nOutputs:`);
  console.log(`  results/eig-selector/question-information-audit.{md,json,csv}`);
  console.log(`  results/eig-selector/question-information-node-summary.md`);
}

main().catch(err => { console.error(err); process.exit(1); });
