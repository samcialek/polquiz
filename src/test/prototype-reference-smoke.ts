/**
 * Prototype-reference validation smoke (2026-05-09).
 *
 * Walks every evidence map in REPRESENTATIVE_QUESTIONS and asserts that any
 * categorical prototype distribution it references is actually defined (i.e.
 * not `undefined` from a typo like `AES_PROTOTYPES.plainspoken` when the
 * intended key was `authentic`).
 *
 * Background: on 2026-05-09, four pre-existing `AES_PROTOTYPES.plainspoken`
 * references were discovered — `plainspoken` is not one of the 6 AES
 * categories (statesman/technocrat/pastoral/authentic/fighter/visionary).
 * applyRankingAnswer crashed when it hit one. Defensive `if (!catDist)`
 * guards were added to the engine so future typos silently skip rather than
 * crash; this test ensures they never have to fire — a missing prototype
 * fails CI here instead of producing silent miscalibration in production.
 *
 * Checks every map shape that can carry categorical evidence:
 *   - optionEvidence (single_choice, multi)
 *   - sliderMap     (slider)
 *   - rankingMap    (ranking, best_worst, priority_sort)
 *   - bestWorstMap  (best_worst with explicit max-diff)
 *   - allocationMap (allocation)
 *   - pairMaps      (pairwise)
 *
 * For each categorical entry it inspects the value used as the prototype
 * (either a flat `CategoricalDist` array or `{ cat: CategoricalDist, sal? }`)
 * and asserts it's a 6-element array of finite numbers in [0,1].
 *
 * Run with: npx tsx src/test/prototype-reference-smoke.ts
 */

import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import type { QuestionDef } from "../types.js";

interface Failure {
  qid: number;
  promptShort: string;
  mapShape: string;
  itemKey: string;
  nodeId: string;
  reason: string;
}

const failures: Failure[] = [];
let totalChecks = 0;

function record(f: Failure): void { failures.push(f); }

function isValidCatDist(v: unknown): boolean {
  if (!Array.isArray(v)) return false;
  if (v.length !== 6) return false;
  for (const x of v) {
    if (typeof x !== "number" || !Number.isFinite(x)) return false;
  }
  return true;
}

function isValidSalDist(v: unknown): boolean {
  if (!Array.isArray(v)) return false;
  if (v.length !== 4) return false;
  for (const x of v) {
    if (typeof x !== "number" || !Number.isFinite(x)) return false;
  }
  return true;
}

/**
 * Two evidence schemas exist:
 *   - "envelope": value is `{ cat?: number[6], sal?: number[4] }` — used by
 *     optionEvidence and sliderMap. Either field may be absent (a salience-
 *     only or category-only touch is valid).
 *   - "flat":     value is the CategoricalDist (number[6]) directly — used
 *     by rankingMap, bestWorstMap, allocationMap, and pairMaps.
 */
type Schema = "envelope" | "flat";

function checkCategoricalEntry(
  q: QuestionDef,
  mapShape: string,
  schema: Schema,
  itemKey: string,
  nodeId: string,
  evidence: unknown,
): void {
  totalChecks++;
  if (evidence === null || evidence === undefined) {
    record({
      qid: q.id, promptShort: q.promptShort, mapShape, itemKey, nodeId,
      reason: `evidence is ${evidence} — likely an undefined prototype reference`,
    });
    return;
  }

  if (schema === "envelope") {
    if (typeof evidence !== "object" || Array.isArray(evidence)) {
      record({
        qid: q.id, promptShort: q.promptShort, mapShape, itemKey, nodeId,
        reason: `expected { cat?, sal? } envelope, got ${Array.isArray(evidence) ? "flat array" : typeof evidence}`,
      });
      return;
    }
    const env = evidence as { cat?: unknown; sal?: unknown };
    if (env.cat === undefined && env.sal === undefined) {
      record({
        qid: q.id, promptShort: q.promptShort, mapShape, itemKey, nodeId,
        reason: `envelope has neither .cat nor .sal — empty evidence`,
      });
      return;
    }
    if (env.cat !== undefined && !isValidCatDist(env.cat)) {
      record({
        qid: q.id, promptShort: q.promptShort, mapShape, itemKey, nodeId,
        reason: `.cat is not a 6-element finite-number array (got: ${JSON.stringify(env.cat).slice(0, 80)})`,
      });
    }
    if (env.sal !== undefined && !isValidSalDist(env.sal)) {
      record({
        qid: q.id, promptShort: q.promptShort, mapShape, itemKey, nodeId,
        reason: `.sal is not a 4-element finite-number array (got: ${JSON.stringify(env.sal).slice(0, 80)})`,
      });
    }
    return;
  }

  // Flat schema: value is the CategoricalDist directly.
  if (!isValidCatDist(evidence)) {
    record({
      qid: q.id, promptShort: q.promptShort, mapShape, itemKey, nodeId,
      reason: `flat-schema prototype is not a 6-element finite-number array (got: ${JSON.stringify(evidence).slice(0, 80)})`,
    });
  }
}

function harvestMap(
  q: QuestionDef,
  mapShape: string,
  schema: Schema,
  itemKey: string,
  itemMap: { categorical?: Record<string, unknown> } | undefined,
): void {
  if (!itemMap?.categorical) return;
  for (const [nodeId, evidence] of Object.entries(itemMap.categorical)) {
    checkCategoricalEntry(q, mapShape, schema, itemKey, nodeId, evidence);
  }
}

for (const q of REPRESENTATIVE_QUESTIONS) {
  const optionEvidence = (q as any).optionEvidence as Record<string, any> | undefined;
  if (optionEvidence) {
    for (const [optKey, ev] of Object.entries(optionEvidence)) {
      harvestMap(q, "optionEvidence", "envelope", optKey, ev);
    }
  }

  const sliderMap = (q as any).sliderMap as Record<string, any> | undefined;
  if (sliderMap) {
    for (const [bucketKey, ev] of Object.entries(sliderMap)) {
      harvestMap(q, "sliderMap", "envelope", bucketKey, ev);
    }
  }

  if (q.rankingMap) {
    for (const [itemKey, ev] of Object.entries(q.rankingMap)) {
      harvestMap(q, "rankingMap", "flat", itemKey, ev as any);
    }
  }

  const bestWorstMap = (q as any).bestWorstMap as Record<string, any> | undefined;
  if (bestWorstMap) {
    for (const [itemKey, ev] of Object.entries(bestWorstMap)) {
      harvestMap(q, "bestWorstMap", "flat", itemKey, ev);
    }
  }

  const allocationMap = (q as any).allocationMap as Record<string, any> | undefined;
  if (allocationMap) {
    for (const [bucketKey, ev] of Object.entries(allocationMap)) {
      harvestMap(q, "allocationMap", "flat", bucketKey, ev);
    }
  }

  const pairMaps = (q as any).pairMaps as Record<string, Record<string, any>> | undefined;
  if (pairMaps) {
    for (const [pairKey, sides] of Object.entries(pairMaps)) {
      for (const [optKey, ev] of Object.entries(sides)) {
        harvestMap(q, `pairMaps.${pairKey}`, "flat", optKey, ev);
      }
    }
  }
}

console.log(`Checked ${totalChecks} categorical prototype references across ${REPRESENTATIVE_QUESTIONS.length} questions.`);

if (failures.length === 0) {
  console.log("All prototype references resolve. No undefined prototypes found.");
  process.exit(0);
}

console.error(`\n${failures.length} INVALID PROTOTYPE REFERENCE${failures.length === 1 ? "" : "S"}:\n`);
for (const f of failures) {
  console.error(`  Q${f.qid} (${f.promptShort})`);
  console.error(`    ${f.mapShape}.${f.itemKey}.categorical.${f.nodeId}`);
  console.error(`    ${f.reason}`);
  console.error("");
}
console.error("These would either crash the engine (older code paths without the");
console.error("defensive `if (!catDist) continue` guards) or silently skip evidence");
console.error("(newer guarded paths). Either way, the question is undermeasuring");
console.error("the node it claims to touch. Fix by replacing the dead reference with");
console.error("a defined prototype key.");
process.exit(1);
