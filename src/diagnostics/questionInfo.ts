/**
 * Per-question information-gain audit.
 *
 * For every question in the representative + full banks, simulate each
 * reasonable answer, measure the Jensen-Shannon divergence between the
 * uniform prior and the resulting posterior on every node the question
 * declares it touches (and every node the evidence actually writes to).
 *
 * Outputs:
 *   results/question-info-audit/by-question.jsonl
 *     One row per question with per-node mean/max/min JSD on pos, sal, cat.
 *   results/question-info-audit/weak-spots.md
 *     Human-readable diagnosis of the weakest touches + hollow declarations.
 *
 * Usage:
 *   npx tsx src/diagnostics/questionInfo.ts
 */

import * as fs from "fs";
import * as path from "path";
import {
  applySingleChoiceAnswer,
  applySliderAnswer,
  applyRankingAnswer,
  applyAllocationAnswer,
  applyPairwiseAnswer,
} from "../engine/update.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import type {
  ContinuousNodeId,
  CategoricalNodeId,
  ContinuousPosDist,
  SalienceDist,
  CategoricalDist,
  QuestionDef,
  RespondentState,
  TrbAnchorDist,
} from "../types.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { FULL_QUESTIONS } from "../config/questions.full.js";

// ---------- state scaffolding ----------

function freshState(): RespondentState {
  const continuous = {} as RespondentState["continuous"];
  for (const n of CONTINUOUS_NODES) {
    continuous[n] = {
      posDist: [0.2, 0.2, 0.2, 0.2, 0.2] as ContinuousPosDist,
      salDist: [0.25, 0.25, 0.25, 0.25] as SalienceDist,
      touches: 0,
      touchTypes: new Set<string>(),
      status: "unknown",
    };
  }
  const categorical = {} as RespondentState["categorical"];
  for (const n of CATEGORICAL_NODES) {
    categorical[n] = {
      catDist: [1/6, 1/6, 1/6, 1/6, 1/6, 1/6] as CategoricalDist,
      salDist: [0.25, 0.25, 0.25, 0.25] as SalienceDist,
      touches: 0,
      touchTypes: new Set<string>(),
      status: "unknown",
    };
  }
  return {
    answers: {},
    continuous,
    categorical,
    trbAnchor: {
      dist: [1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9, 1/9] as TrbAnchorDist,
      touches: 0,
    },
    archetypeDistances: {},
    currentLeader: undefined,
    consecutiveLeadCount: 0,
  };
}

// ---------- info metrics ----------

function kl(p: number[], q: number[]): number {
  let s = 0;
  for (let i = 0; i < p.length; i++) {
    const a = p[i] ?? 0, b = q[i] ?? 0;
    if (a > 0 && b > 0) s += a * Math.log(a / b);
  }
  return s;
}
function jsd(p: number[], q: number[]): number {
  if (p.length !== q.length) throw new Error("JSD length mismatch");
  const m = p.map((x, i) => (x + (q[i] ?? 0)) / 2);
  return 0.5 * kl(p, m) + 0.5 * kl(q, m);
}

// ---------- snapshot the state's posterior distributions ----------

type Snapshot = {
  continuous: Record<string, { pos: number[]; sal: number[] }>;
  categorical: Record<string, { cat: number[]; sal: number[] }>;
  trbAnchor: number[];
};

function snapshot(state: RespondentState): Snapshot {
  const continuous: Snapshot["continuous"] = {};
  for (const n of CONTINUOUS_NODES) {
    const s = state.continuous[n];
    continuous[n] = { pos: [...s.posDist], sal: [...s.salDist] };
  }
  const categorical: Snapshot["categorical"] = {};
  for (const n of CATEGORICAL_NODES) {
    const s = state.categorical[n];
    categorical[n] = { cat: [...s.catDist], sal: [...s.salDist] };
  }
  return {
    continuous, categorical,
    trbAnchor: [...state.trbAnchor.dist],
  };
}

const PRIOR_SNAPSHOT = snapshot(freshState());

function diffFromPrior(sn: Snapshot) {
  const continuous: Record<string, { posJsd: number; salJsd: number }> = {};
  for (const n of CONTINUOUS_NODES) {
    continuous[n] = {
      posJsd: jsd(PRIOR_SNAPSHOT.continuous[n]!.pos, sn.continuous[n]!.pos),
      salJsd: jsd(PRIOR_SNAPSHOT.continuous[n]!.sal, sn.continuous[n]!.sal),
    };
  }
  const categorical: Record<string, { catJsd: number; salJsd: number }> = {};
  for (const n of CATEGORICAL_NODES) {
    categorical[n] = {
      catJsd: jsd(PRIOR_SNAPSHOT.categorical[n]!.cat, sn.categorical[n]!.cat),
      salJsd: jsd(PRIOR_SNAPSHOT.categorical[n]!.sal, sn.categorical[n]!.sal),
    };
  }
  const trbAnchorJsd = jsd(PRIOR_SNAPSHOT.trbAnchor, sn.trbAnchor);
  return { continuous, categorical, trbAnchorJsd };
}

// ---------- answer variant generation ----------

type Variant = { label: string; apply: (s: RespondentState) => void };

function variantsFor(q: QuestionDef): Variant[] {
  const variants: Variant[] = [];

  switch (q.uiType) {
    case "single_choice":
    case "multi": {
      for (const key of Object.keys(q.optionEvidence || {})) {
        variants.push({
          label: `opt:${key}`,
          apply: (s) => applySingleChoiceAnswer(s, q, key),
        });
      }
      break;
    }
    case "slider": {
      for (const bucket of Object.keys(q.sliderMap || {})) {
        const [loStr, hiStr] = bucket.split("-");
        const lo = Number(loStr), hi = Number(hiStr);
        const mid = Math.round((lo + hi) / 2);
        variants.push({
          label: `slider:${bucket}`,
          apply: (s) => applySliderAnswer(s, q, mid),
        });
      }
      break;
    }
    case "ranking": {
      const items = Object.keys(q.rankingMap || {});
      // For each item, rank it first, rest alphabetical — gives us the item-at-top signal
      for (const item of items) {
        const rest = items.filter((x) => x !== item).sort();
        variants.push({
          label: `rank1:${item}`,
          apply: (s) => applyRankingAnswer(s, q, [item, ...rest]),
        });
      }
      break;
    }
    case "allocation": {
      const buckets = Object.keys(q.allocationMap || {});
      // All-in on each bucket
      for (const b of buckets) {
        const alloc: Record<string, number> = {};
        for (const k of buckets) alloc[k] = (k === b ? 100 : 0);
        variants.push({
          label: `alloc:${b}`,
          apply: (s) => applyAllocationAnswer(s, q, alloc),
        });
      }
      // Plus an even split (baseline)
      if (buckets.length > 1) {
        const alloc: Record<string, number> = {};
        const each = Math.floor(100 / buckets.length);
        for (const k of buckets) alloc[k] = each;
        variants.push({
          label: "alloc:even",
          apply: (s) => applyAllocationAnswer(s, q, alloc),
        });
      }
      break;
    }
    case "pairwise": {
      if (!q.pairMaps) break;
      // One variant per pair: iterate each pair, pick first option then re-pick with second
      const pairIds = Object.keys(q.pairMaps);
      for (const pid of pairIds) {
        const opts = Object.keys(q.pairMaps[pid] || {});
        for (const o of opts) {
          const all: Record<string, string> = {};
          for (const ppid of pairIds) {
            const pairOpts = Object.keys(q.pairMaps[ppid] || {});
            all[ppid] = (ppid === pid ? o : (pairOpts[0] ?? ""));
          }
          variants.push({
            label: `pair:${pid}=${o}`,
            apply: (s) => applyPairwiseAnswer(s, q, all),
          });
        }
      }
      break;
    }
    case "best_worst": {
      const items = Object.keys(q.bestWorstMap || q.rankingMap || {});
      // Best = each item once; Worst = alphabetically last remaining item
      for (const best of items) {
        for (const worst of items) {
          if (best === worst) continue;
          const middle = items.filter((x) => x !== best && x !== worst);
          variants.push({
            label: `bw:best=${best},worst=${worst}`,
            apply: (s) => applyRankingAnswer(s, q, [best, ...middle, worst]),
          });
        }
      }
      break;
    }
  }
  return variants;
}

// ---------- per-question audit ----------

type NodeStat = {
  meanJsd: number;
  maxJsd: number;
  minJsd: number;
  interVariantMaxJsd: number;  // max JSD between any two variant posteriors on this node
  declared: boolean;            // whether question's touchProfile declares this node
  roles: string[];              // which roles touched this node in touchProfile
};

type QuestionAudit = {
  bank: "representative" | "full";
  id: number;
  promptShort: string;
  uiType: string;
  quality: number;
  nVariants: number;
  touchProfile: Array<{ node: string; role: string; kind: string; weight: number }>;
  posJsd: Record<string, NodeStat>;
  salJsd: Record<string, NodeStat>;
  catJsd: Record<string, NodeStat>;
  trbAnchorJsd: { mean: number; max: number; min: number; interVariantMax: number };
  flags: string[];
};

function stats(values: number[]): { mean: number; max: number; min: number } {
  if (!values.length) return { mean: 0, max: 0, min: 0 };
  let s = 0, mx = -Infinity, mn = Infinity;
  for (const v of values) { s += v; if (v > mx) mx = v; if (v < mn) mn = v; }
  return { mean: s / values.length, max: mx === -Infinity ? 0 : mx, min: mn === Infinity ? 0 : mn };
}
function maxPairJsd(dists: number[][]): number {
  let mx = 0;
  for (let i = 0; i < dists.length; i++) {
    for (let j = i+1; j < dists.length; j++) {
      const d = jsd(dists[i]!, dists[j]!);
      if (d > mx) mx = d;
    }
  }
  return mx;
}

function auditQuestion(q: QuestionDef, bank: "representative" | "full"): QuestionAudit {
  const variants = variantsFor(q);
  const snaps: Snapshot[] = [];
  for (const v of variants) {
    const s = freshState();
    v.apply(s);
    snaps.push(snapshot(s));
  }

  // Gather per-variant JSDs per node
  const posByNode: Record<string, number[]> = {};
  const salContByNode: Record<string, number[]> = {};
  const catByNode: Record<string, number[]> = {};
  const salCatByNode: Record<string, number[]> = {};
  const trbAnchorJsds: number[] = [];

  // Also gather raw dists for inter-variant JSD
  const posDists: Record<string, number[][]> = {};
  const salContDists: Record<string, number[][]> = {};
  const catDists: Record<string, number[][]> = {};
  const salCatDists: Record<string, number[][]> = {};
  const trbDists: number[][] = [];

  for (const n of CONTINUOUS_NODES) { posByNode[n] = []; salContByNode[n] = []; posDists[n] = []; salContDists[n] = []; }
  for (const n of CATEGORICAL_NODES) { catByNode[n] = []; salCatByNode[n] = []; catDists[n] = []; salCatDists[n] = []; }

  for (const sn of snaps) {
    const d = diffFromPrior(sn);
    for (const n of CONTINUOUS_NODES) {
      posByNode[n]!.push(d.continuous[n]!.posJsd);
      salContByNode[n]!.push(d.continuous[n]!.salJsd);
      posDists[n]!.push(sn.continuous[n]!.pos);
      salContDists[n]!.push(sn.continuous[n]!.sal);
    }
    for (const n of CATEGORICAL_NODES) {
      catByNode[n]!.push(d.categorical[n]!.catJsd);
      salCatByNode[n]!.push(d.categorical[n]!.salJsd);
      catDists[n]!.push(sn.categorical[n]!.cat);
      salCatDists[n]!.push(sn.categorical[n]!.sal);
    }
    trbAnchorJsds.push(d.trbAnchorJsd);
    trbDists.push(sn.trbAnchor);
  }

  // Touch profile index — what roles claim each node?
  const declaredRoles: Record<string, string[]> = {};
  for (const t of q.touchProfile) {
    const nodeKey = t.node === "TRB_ANCHOR" ? "TRB_ANCHOR" : (t.node as string);
    if (!declaredRoles[nodeKey]) declaredRoles[nodeKey] = [];
    declaredRoles[nodeKey]!.push(t.role);
  }

  const posJsd: Record<string, NodeStat> = {};
  const salJsd: Record<string, NodeStat> = {};
  const catJsd: Record<string, NodeStat> = {};

  for (const n of CONTINUOUS_NODES) {
    const sPos = stats(posByNode[n]!);
    const sSal = stats(salContByNode[n]!);
    const posInter = maxPairJsd(posDists[n]!);
    const salInter = maxPairJsd(salContDists[n]!);
    const rolesPos = (declaredRoles[n] || []).filter((r) => r === "position");
    const rolesSal = (declaredRoles[n] || []).filter((r) => r === "salience");
    posJsd[n] = { ...sPos, interVariantMaxJsd: posInter, declared: rolesPos.length > 0, roles: rolesPos };
    salJsd[n] = { ...sSal, interVariantMaxJsd: salInter, declared: rolesSal.length > 0, roles: rolesSal };
  }
  for (const n of CATEGORICAL_NODES) {
    const sCat = stats(catByNode[n]!);
    const sSal = stats(salCatByNode[n]!);
    const catInter = maxPairJsd(catDists[n]!);
    const salInter = maxPairJsd(salCatDists[n]!);
    const rolesCat = (declaredRoles[n] || []).filter((r) => r === "category" || r === "position");
    const rolesSal = (declaredRoles[n] || []).filter((r) => r === "salience");
    catJsd[n] = { ...sCat, interVariantMaxJsd: catInter, declared: rolesCat.length > 0, roles: rolesCat };
    salJsd[n] = { ...sSal, interVariantMaxJsd: salInter, declared: rolesSal.length > 0, roles: rolesSal };
  }

  const trbStats = stats(trbAnchorJsds);
  const trbInter = maxPairJsd(trbDists);

  // Compose flags
  const flags: string[] = [];
  const EPS = 1e-4;

  // Hollow touches: declared in touchProfile but JSD near zero across all variants
  for (const [nodeKey, roles] of Object.entries(declaredRoles)) {
    if (nodeKey === "TRB_ANCHOR") {
      if (roles.includes("anchor") && trbInter < EPS) flags.push(`hollow_touch:TRB_ANCHOR`);
      continue;
    }
    for (const role of new Set(roles)) {
      if (role === "position") {
        const sInter = posJsd[nodeKey]?.interVariantMaxJsd ?? 0;
        if (sInter < EPS) flags.push(`hollow_touch:${nodeKey}:position`);
      } else if (role === "salience") {
        const sInter = (salJsd[nodeKey]?.interVariantMaxJsd) ?? 0;
        if (sInter < EPS) flags.push(`hollow_touch:${nodeKey}:salience`);
      } else if (role === "category") {
        const sInter = catJsd[nodeKey]?.interVariantMaxJsd ?? 0;
        if (sInter < EPS) flags.push(`hollow_touch:${nodeKey}:category`);
      }
    }
  }

  // Orphan evidence: max JSD > 0 on an undeclared node (evidence fires but touchProfile doesn't say so)
  for (const n of CONTINUOUS_NODES) {
    if (!(declaredRoles[n]?.includes("position")) && (posJsd[n]?.maxJsd ?? 0) > 0.01) {
      flags.push(`orphan_evidence:${n}:position`);
    }
    if (!(declaredRoles[n]?.includes("salience")) && (salJsd[n]?.maxJsd ?? 0) > 0.01) {
      flags.push(`orphan_evidence:${n}:salience`);
    }
  }
  for (const n of CATEGORICAL_NODES) {
    const catRoles = declaredRoles[n] || [];
    if (!catRoles.includes("category") && !catRoles.includes("position") && (catJsd[n]?.maxJsd ?? 0) > 0.01) {
      flags.push(`orphan_evidence:${n}:category`);
    }
    if (!catRoles.includes("salience") && (salJsd[n]?.maxJsd ?? 0) > 0.01) {
      flags.push(`orphan_evidence:${n}:salience`);
    }
  }

  // No-variants flag (couldn't generate any variants for this question — missing evidence map)
  if (variants.length === 0) flags.push("no_variants_generable");

  // Collapsed options: multiple variants but inter-variant JSD near zero everywhere
  if (variants.length > 1) {
    const maxInter = Math.max(
      trbInter,
      ...CONTINUOUS_NODES.map((n) => Math.max(posJsd[n]!.interVariantMaxJsd, salJsd[n]!.interVariantMaxJsd)),
      ...CATEGORICAL_NODES.map((n) => Math.max(catJsd[n]!.interVariantMaxJsd, salJsd[n]!.interVariantMaxJsd))
    );
    if (maxInter < EPS) flags.push("collapsed_variants");
  }

  return {
    bank, id: q.id,
    promptShort: q.promptShort,
    uiType: q.uiType,
    quality: q.quality,
    nVariants: variants.length,
    touchProfile: q.touchProfile.map((t) => ({
      node: String(t.node), role: t.role, kind: t.kind, weight: t.weight,
    })),
    posJsd, salJsd, catJsd,
    trbAnchorJsd: { mean: trbStats.mean, max: trbStats.max, min: trbStats.min, interVariantMax: trbInter },
    flags,
  };
}

// ---------- run ----------

const outDir = path.join("results", "question-info-audit");
fs.mkdirSync(outDir, { recursive: true });

const bankNames: Array<["representative" | "full", QuestionDef[]]> = [
  ["representative", REPRESENTATIVE_QUESTIONS as QuestionDef[]],
  ["full", FULL_QUESTIONS as QuestionDef[]],
];

const allAudits: QuestionAudit[] = [];
for (const [bank, bankQs] of bankNames) {
  console.log(`\n=== ${bank} bank (${bankQs.length} questions) ===`);
  for (const q of bankQs) {
    try {
      const audit = auditQuestion(q, bank);
      allAudits.push(audit);
    } catch (e) {
      console.error(`Error auditing Q${q.id} (${q.promptShort}):`, (e as Error).message);
    }
  }
}

// JSONL per-question
const jsonlPath = path.join(outDir, "by-question.jsonl");
fs.writeFileSync(jsonlPath, allAudits.map((a) => JSON.stringify(a)).join("\n") + "\n", "utf-8");
console.log(`\nWrote ${jsonlPath} (${allAudits.length} rows)`);

// Summary metric: per-audit headline = max interVariantMaxJsd across declared touches
function headlineOf(a: QuestionAudit): number {
  let mx = 0;
  for (const [n, ns] of Object.entries(a.posJsd))   if (ns.declared) mx = Math.max(mx, ns.interVariantMaxJsd);
  for (const [n, ns] of Object.entries(a.salJsd))   if (ns.declared) mx = Math.max(mx, ns.interVariantMaxJsd);
  for (const [n, ns] of Object.entries(a.catJsd))   if (ns.declared) mx = Math.max(mx, ns.interVariantMaxJsd);
  if (a.touchProfile.some((t) => t.node === "TRB_ANCHOR")) mx = Math.max(mx, a.trbAnchorJsd.interVariantMax);
  return mx;
}

// Rank: weakest declared-info first
const ranked = [...allAudits].sort((a, b) => headlineOf(a) - headlineOf(b));

// Markdown weak-spots report
const mdLines: string[] = [];
mdLines.push("# Question information-gain audit");
mdLines.push("");
mdLines.push("Metric: **inter-variant max JSD** on each declared touch node. ");
mdLines.push("Low values mean answer options collapse to the same posterior — the question doesn't discriminate on that node.");
mdLines.push("");
mdLines.push(`- Representative bank: ${bankNames[0][1].length} questions`);
mdLines.push(`- Full bank: ${bankNames[1][1].length} questions`);
mdLines.push(`- Total audits: ${allAudits.length}`);
mdLines.push("");

// Flag summary
const flagCounts = new Map<string, number>();
for (const a of allAudits) {
  for (const f of a.flags) {
    const key = f.split(":")[0]!;
    flagCounts.set(key, (flagCounts.get(key) || 0) + 1);
  }
}
mdLines.push("## Flag summary");
mdLines.push("");
mdLines.push("| flag | count |");
mdLines.push("|---|---|");
for (const [k, v] of [...flagCounts.entries()].sort((a, b) => b[1] - a[1])) {
  mdLines.push(`| ${k} | ${v} |`);
}
mdLines.push("");

// Questions with zero-info declared touches
const hollowQs = allAudits.filter((a) => a.flags.some((f) => f.startsWith("hollow_touch:")));
mdLines.push(`## Hollow touches (${hollowQs.length} questions declare at least one touch that produces zero information)`);
mdLines.push("");
mdLines.push("| bank | id | prompt | uiType | hollow touches |");
mdLines.push("|---|---|---|---|---|");
for (const a of hollowQs.sort((x, y) => x.id - y.id)) {
  const hollows = a.flags.filter((f) => f.startsWith("hollow_touch:")).map((f) => f.replace("hollow_touch:", "")).join(", ");
  mdLines.push(`| ${a.bank} | ${a.id} | ${a.promptShort} | ${a.uiType} | ${hollows} |`);
}
mdLines.push("");

// Questions with no variants generable
const noVarQs = allAudits.filter((a) => a.flags.includes("no_variants_generable"));
if (noVarQs.length) {
  mdLines.push(`## Questions with no variants generable (${noVarQs.length})`);
  mdLines.push("");
  mdLines.push("These have a uiType but no populated evidence map — the question doesn't update state at all.");
  mdLines.push("");
  mdLines.push("| bank | id | prompt | uiType |");
  mdLines.push("|---|---|---|---|");
  for (const a of noVarQs.sort((x, y) => x.id - y.id)) {
    mdLines.push(`| ${a.bank} | ${a.id} | ${a.promptShort} | ${a.uiType} |`);
  }
  mdLines.push("");
}

// Collapsed variants
const collapsedQs = allAudits.filter((a) => a.flags.includes("collapsed_variants"));
if (collapsedQs.length) {
  mdLines.push(`## Collapsed variants (${collapsedQs.length} questions where all answer options produce same posterior)`);
  mdLines.push("");
  mdLines.push("| bank | id | prompt | uiType | nVariants |");
  mdLines.push("|---|---|---|---|---|");
  for (const a of collapsedQs.sort((x, y) => x.id - y.id)) {
    mdLines.push(`| ${a.bank} | ${a.id} | ${a.promptShort} | ${a.uiType} | ${a.nVariants} |`);
  }
  mdLines.push("");
}

// Orphan evidence
const orphanQs = allAudits.filter((a) => a.flags.some((f) => f.startsWith("orphan_evidence:")));
if (orphanQs.length) {
  mdLines.push(`## Orphan evidence (${orphanQs.length} questions write to nodes not declared in touchProfile)`);
  mdLines.push("");
  mdLines.push("| bank | id | prompt | orphans |");
  mdLines.push("|---|---|---|---|");
  for (const a of orphanQs.sort((x, y) => x.id - y.id)) {
    const orphs = a.flags.filter((f) => f.startsWith("orphan_evidence:")).map((f) => f.replace("orphan_evidence:", "")).join(", ");
    mdLines.push(`| ${a.bank} | ${a.id} | ${a.promptShort} | ${orphs} |`);
  }
  mdLines.push("");
}

// Ranked: 15 weakest and 15 strongest
mdLines.push("## Headline: weakest 20 questions by max inter-variant JSD across declared touches");
mdLines.push("");
mdLines.push("| bank | id | prompt | uiType | nVariants | headline JSD | flags |");
mdLines.push("|---|---|---|---|---|---|---|");
for (const a of ranked.slice(0, 20)) {
  mdLines.push(`| ${a.bank} | ${a.id} | ${a.promptShort} | ${a.uiType} | ${a.nVariants} | ${headlineOf(a).toExponential(2)} | ${a.flags.length ? a.flags.join(", ") : ""} |`);
}
mdLines.push("");

mdLines.push("## Strongest 20 questions");
mdLines.push("");
mdLines.push("| bank | id | prompt | uiType | headline JSD |");
mdLines.push("|---|---|---|---|---|");
for (const a of [...ranked].reverse().slice(0, 20)) {
  mdLines.push(`| ${a.bank} | ${a.id} | ${a.promptShort} | ${a.uiType} | ${headlineOf(a).toFixed(4)} |`);
}
mdLines.push("");

// Save
const mdPath = path.join(outDir, "weak-spots.md");
fs.writeFileSync(mdPath, mdLines.join("\n") + "\n", "utf-8");
console.log(`Wrote ${mdPath}`);
