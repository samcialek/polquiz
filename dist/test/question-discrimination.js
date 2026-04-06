/**
 * Layer 1 — Question Discrimination Audit.
 *
 * For each question Q and each meaningful answer-signal O in Q, apply that
 * answer to a fresh uniform state and measure how much the archetype posterior
 * shifts from uniform. A question that doesn't move the posterior (low KL
 * across all its options) is not discriminating between archetypes.
 *
 * Output:
 *   - output/question-discrimination.json : per-Q, per-option metrics
 *   - console summary + ranked table of weakest questions
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { applySingleChoiceAnswer, applySliderAnswer, applyAllocationAnswer, applyRankingAnswer, applyPairwiseAnswer, } from "../engine/update.js";
const CONTINUOUS_IDS = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CATEGORICAL_IDS = ["EPS", "AES"];
const UNIFORM_POS = [0.2, 0.2, 0.2, 0.2, 0.2];
const UNIFORM_SAL = [0.25, 0.25, 0.25, 0.25];
const UNIFORM_CAT = [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
const UNIFORM_ANCHOR = [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9];
function createFreshState() {
    const continuous = {};
    for (const id of CONTINUOUS_IDS) {
        continuous[id] = {
            posDist: [...UNIFORM_POS],
            salDist: [...UNIFORM_SAL],
            touches: 0,
            touchTypes: new Set(),
            status: "unknown",
        };
    }
    const categorical = {};
    for (const id of CATEGORICAL_IDS) {
        categorical[id] = {
            catDist: [...UNIFORM_CAT],
            salDist: [...UNIFORM_SAL],
            touches: 0,
            touchTypes: new Set(),
            status: "unknown",
        };
    }
    const archetypePosterior = {};
    for (const a of ARCHETYPES) {
        archetypePosterior[a.id] = a.prior;
    }
    return {
        answers: {},
        continuous,
        categorical,
        trbAnchor: { dist: [...UNIFORM_ANCHOR], touches: 0 },
        archetypePosterior,
    };
}
/** Mirrors src/browser/api.ts updatePosteriors at nAnswered=1 (warm temp). */
function updatePosteriors(state, archetypes) {
    const distances = {};
    let minDist = Infinity;
    for (const a of archetypes) {
        const d = archetypeDistance(state, a);
        distances[a.id] = d;
        if (d < minDist)
            minDist = d;
    }
    // Use warm temp 0.12 (nAnswered=1) to match engine semantics.
    const temperature = 0.12;
    let total = 0;
    const like = {};
    for (const a of archetypes) {
        const l = Math.exp(-(distances[a.id] - minDist) / temperature);
        like[a.id] = l * a.prior;
        total += like[a.id];
    }
    for (const a of archetypes) {
        state.archetypePosterior[a.id] = total > 0 ? like[a.id] / total : a.prior;
    }
}
/** KL(posterior || prior) when priors are uniform over active archetypes. */
function klFromUniform(posterior, archetypes) {
    const active = archetypes.filter(a => a.prior > 0);
    const priorP = active[0].prior; // uniform across active
    let kl = 0;
    for (const a of active) {
        const p = posterior[a.id] ?? 0;
        if (p > 0)
            kl += p * Math.log(p / priorP);
    }
    return kl;
}
function entropyOf(posterior, archetypes) {
    let h = 0;
    for (const a of archetypes) {
        const p = posterior[a.id] ?? 0;
        if (p > 0)
            h -= p * Math.log(p);
    }
    return h;
}
function topArch(posterior, archetypes) {
    let bestId = "";
    let bestP = -1;
    for (const a of archetypes) {
        const p = posterior[a.id] ?? 0;
        if (p > bestP) {
            bestP = p;
            bestId = a.id;
        }
    }
    const arch = archetypes.find(a => a.id === bestId);
    return { id: bestId, name: arch?.name ?? "?", p: bestP };
}
/** KL(P || Q) between two posterior distributions over archetypes. */
function klBetween(p, q, archetypes) {
    let kl = 0;
    for (const a of archetypes) {
        const pi = p[a.id] ?? 0;
        const qi = q[a.id] ?? 0;
        if (pi > 0 && qi > 0)
            kl += pi * Math.log(pi / qi);
    }
    return kl;
}
/** Classify whether a question's signals reach the archetype-bearing distributions. */
function classifySignal(q) {
    // Does the question write to any continuous/categorical node (not just trbAnchor)?
    const checkEvidence = (ev) => {
        if (!ev || typeof ev !== "object")
            return false;
        const e = ev;
        return !!(e.continuous || e.categorical);
    };
    if (q.optionEvidence) {
        for (const v of Object.values(q.optionEvidence)) {
            if (checkEvidence(v))
                return "archetype_bearing";
        }
    }
    if (q.sliderMap) {
        for (const v of Object.values(q.sliderMap)) {
            if (checkEvidence(v))
                return "archetype_bearing";
        }
    }
    if (q.allocationMap) {
        for (const v of Object.values(q.allocationMap)) {
            if (checkEvidence(v))
                return "archetype_bearing";
        }
    }
    if (q.rankingMap) {
        for (const v of Object.values(q.rankingMap)) {
            if (checkEvidence(v))
                return "archetype_bearing";
        }
    }
    if (q.pairMaps) {
        for (const pair of Object.values(q.pairMaps)) {
            for (const v of Object.values(pair)) {
                if (checkEvidence(v))
                    return "archetype_bearing";
            }
        }
    }
    if (q.bestWorstMap) {
        for (const v of Object.values(q.bestWorstMap)) {
            if (checkEvidence(v))
                return "archetype_bearing";
        }
    }
    // If question only has trbAnchor signals (or no signals), it's anchor_only
    const hasAnyMap = q.optionEvidence || q.sliderMap || q.allocationMap || q.rankingMap || q.pairMaps || q.bestWorstMap;
    return hasAnyMap ? "anchor_only" : "unknown";
}
function enumerateSignals(q) {
    const signals = [];
    switch (q.uiType) {
        case "single_choice":
        case "multi": {
            if (!q.optionEvidence)
                break;
            for (const optKey of Object.keys(q.optionEvidence)) {
                signals.push({
                    key: optKey,
                    apply: (state, qq) => applySingleChoiceAnswer(state, qq, optKey),
                });
            }
            break;
        }
        case "slider": {
            if (!q.sliderMap)
                break;
            for (const bucketKey of Object.keys(q.sliderMap)) {
                const parts = bucketKey.split("-").map(Number);
                const lo = parts[0] ?? 0;
                const hi = parts[1] ?? 100;
                const mid = Math.floor((lo + hi) / 2);
                signals.push({
                    key: bucketKey,
                    apply: (state, qq) => applySliderAnswer(state, qq, mid),
                });
            }
            break;
        }
        case "allocation": {
            if (!q.allocationMap)
                break;
            const buckets = Object.keys(q.allocationMap);
            for (const bucket of buckets) {
                const alloc = {};
                for (const b of buckets)
                    alloc[b] = b === bucket ? 100 : 0;
                signals.push({
                    key: `all→${bucket}`,
                    apply: (state, qq) => applyAllocationAnswer(state, qq, alloc),
                });
            }
            break;
        }
        case "ranking": {
            if (!q.rankingMap)
                break;
            const items = Object.keys(q.rankingMap);
            for (const item of items) {
                const ranking = [item, ...items.filter(x => x !== item)];
                signals.push({
                    key: `${item}@1`,
                    apply: (state, qq) => applyRankingAnswer(state, qq, ranking),
                });
            }
            break;
        }
        case "pairwise": {
            if (!q.pairMaps)
                break;
            for (const pairId of Object.keys(q.pairMaps)) {
                const choices = Object.keys(q.pairMaps[pairId] ?? {});
                for (const choice of choices) {
                    signals.push({
                        key: `${pairId}:${choice}`,
                        apply: (state, qq) => applyPairwiseAnswer(state, qq, { [pairId]: choice }),
                    });
                }
            }
            break;
        }
        case "best_worst": {
            if (!q.bestWorstMap)
                break;
            const items = Object.keys(q.bestWorstMap);
            for (const item of items) {
                // use ranking semantics: best first, pick an arbitrary worst
                const worst = items.find(x => x !== item) ?? item;
                const ranking = [item, ...items.filter(x => x !== item && x !== worst), worst];
                signals.push({
                    key: `best=${item}`,
                    apply: (state, qq) => applyRankingAnswer(state, qq, ranking),
                });
            }
            break;
        }
    }
    return signals;
}
async function main() {
    const questions = REPRESENTATIVE_QUESTIONS;
    const archetypes = ARCHETYPES;
    console.log(`Loaded ${questions.length} questions, ${archetypes.length} archetypes (${archetypes.filter(a => a.prior > 0).length} active)`);
    console.log(`Priors are uniform: ${archetypes.filter(a => a.prior > 0)[0]?.prior.toFixed(6)} each`);
    console.log();
    const results = [];
    for (const q of questions) {
        const signalClass = classifySignal(q);
        const signals = enumerateSignals(q);
        if (signals.length === 0) {
            results.push({
                id: q.id,
                promptShort: q.promptShort,
                uiType: q.uiType,
                stage: q.stage,
                section: q.section,
                signalClass,
                optionCount: 0,
                meanKL: 0,
                maxKL: 0,
                minKL: 0,
                meanInterOptionKL: 0,
                maxInterOptionKL: 0,
                distinctTopArchetypes: 0,
                options: [],
            });
            continue;
        }
        const optionResults = [];
        for (const sig of signals) {
            const state = createFreshState();
            sig.apply(state, q);
            updatePosteriors(state, archetypes);
            const kl = klFromUniform(state.archetypePosterior, archetypes);
            const ent = entropyOf(state.archetypePosterior, archetypes);
            const top = topArch(state.archetypePosterior, archetypes);
            optionResults.push({
                optionKey: sig.key,
                kl,
                entropy: ent,
                topArchId: top.id,
                topArchName: top.name,
                topPosterior: top.p,
                posterior: { ...state.archetypePosterior },
            });
        }
        // Inter-option KL: how different are option posteriors from each other?
        const pairwiseKLs = [];
        for (let i = 0; i < optionResults.length; i++) {
            for (let j = i + 1; j < optionResults.length; j++) {
                const symKL = 0.5 * (klBetween(optionResults[i].posterior, optionResults[j].posterior, archetypes) +
                    klBetween(optionResults[j].posterior, optionResults[i].posterior, archetypes));
                pairwiseKLs.push(symKL);
            }
        }
        const kls = optionResults.map(o => o.kl);
        const topIds = new Set(optionResults.map(o => o.topArchId));
        results.push({
            id: q.id,
            promptShort: q.promptShort,
            uiType: q.uiType,
            stage: q.stage,
            section: q.section,
            signalClass,
            optionCount: signals.length,
            meanKL: kls.reduce((a, b) => a + b, 0) / kls.length,
            maxKL: Math.max(...kls),
            minKL: Math.min(...kls),
            meanInterOptionKL: pairwiseKLs.length > 0 ? pairwiseKLs.reduce((a, b) => a + b, 0) / pairwiseKLs.length : 0,
            maxInterOptionKL: pairwiseKLs.length > 0 ? Math.max(...pairwiseKLs) : 0,
            distinctTopArchetypes: topIds.size,
            options: optionResults,
        });
    }
    // Partition by signal class — only archetype_bearing questions affect archetype posterior
    const archBearing = results.filter(r => r.signalClass === "archetype_bearing" && r.optionCount > 0);
    const anchorOnly = results.filter(r => r.signalClass === "anchor_only" && r.optionCount > 0);
    const unknown = results.filter(r => r.signalClass === "unknown");
    // Summary stats on arch-bearing questions only
    const interKLs = archBearing.map(r => r.meanInterOptionKL).sort((a, b) => a - b);
    const medianInter = interKLs[Math.floor(interKLs.length / 2)] ?? 0;
    const meanInter = interKLs.reduce((a, b) => a + b, 0) / (interKLs.length || 1);
    console.log("=== Question Discrimination Summary ===");
    console.log(`Total questions: ${results.length}`);
    console.log(`  archetype-bearing: ${archBearing.length}`);
    console.log(`  anchor-only (don't affect archetype posterior): ${anchorOnly.length}`);
    console.log(`  unknown/skipped: ${unknown.length}`);
    console.log();
    console.log(`Inter-option KL (archetype-bearing questions): how differently each option routes`);
    console.log(`  Mean: ${meanInter.toFixed(4)} nats`);
    console.log(`  Median: ${medianInter.toFixed(4)} nats`);
    console.log(`  Min: ${interKLs[0]?.toFixed(4)} nats`);
    console.log(`  Max: ${interKLs[interKLs.length - 1]?.toFixed(4)} nats`);
    console.log();
    // PROBLEM CATEGORY 1: archetype-bearing but distinct_top=1 means options all converge to same archetype
    const convergent = archBearing.filter(r => r.distinctTopArchetypes === 1 && r.optionCount >= 2);
    console.log(`=== PROBLEM 1: Archetype-bearing questions where ALL options route to the SAME top archetype (${convergent.length}) ===`);
    console.log(`These questions don't steer respondents toward different archetypes — possible dead signal.`);
    for (const r of convergent.sort((a, b) => a.meanInterOptionKL - b.meanInterOptionKL)) {
        const sample = r.options[0];
        console.log(`  Q${r.id.toString().padStart(3)}  ${r.uiType.padEnd(12)}  ${r.promptShort.padEnd(42)}  ${r.optionCount} opts → ${sample?.topArchName}  interKL=${r.meanInterOptionKL.toFixed(4)}`);
    }
    console.log();
    // PROBLEM CATEGORY 2: low inter-option KL — options produce near-identical posteriors
    const LOW_INTER = 0.01;
    const lowInter = archBearing.filter(r => r.meanInterOptionKL < LOW_INTER && r.distinctTopArchetypes > 1).sort((a, b) => a.meanInterOptionKL - b.meanInterOptionKL);
    console.log(`=== PROBLEM 2: Low inter-option divergence (meanInterKL < ${LOW_INTER}) — ${lowInter.length} ===`);
    console.log(`Options technically route to different archetypes but the posteriors barely differ.`);
    for (const r of lowInter.slice(0, 15)) {
        console.log(`  Q${r.id.toString().padStart(3)}  ${r.uiType.padEnd(12)}  ${r.promptShort.padEnd(42)}  distinct=${r.distinctTopArchetypes}/${r.optionCount}  interKL=${r.meanInterOptionKL.toFixed(4)}`);
    }
    console.log();
    console.log("=== Strongest Questions — highest inter-option divergence (top 15) ===");
    const strongest = [...archBearing].sort((a, b) => b.meanInterOptionKL - a.meanInterOptionKL).slice(0, 15);
    for (const r of strongest) {
        console.log(`  Q${r.id.toString().padStart(3)}  ${r.uiType.padEnd(12)}  ${r.promptShort.padEnd(42)}  distinct=${r.distinctTopArchetypes}/${r.optionCount}  interKL=${r.meanInterOptionKL.toFixed(4)}  maxInterKL=${r.maxInterOptionKL.toFixed(4)}`);
    }
    console.log();
    console.log(`=== Anchor-only questions (don't affect archetype posterior, only identity-primary overlay) ===`);
    for (const r of anchorOnly) {
        console.log(`  Q${r.id.toString().padStart(3)}  ${r.uiType.padEnd(12)}  ${r.promptShort}`);
    }
    console.log();
    // Strip `posterior` field (big) from serialized output to keep file small
    const serialized = results.map(r => ({
        ...r,
        options: r.options.map(o => ({ optionKey: o.optionKey, kl: o.kl, entropy: o.entropy, topArchId: o.topArchId, topArchName: o.topArchName, topPosterior: o.topPosterior })),
    }));
    const outDir = path.join(process.cwd(), "output");
    await fs.mkdir(outDir, { recursive: true });
    const outFile = path.join(outDir, "question-discrimination.json");
    await fs.writeFile(outFile, JSON.stringify({
        summary: {
            totalQuestions: results.length,
            archetypeBearing: archBearing.length,
            anchorOnly: anchorOnly.length,
            meanInterOptionKL: meanInter,
            medianInterOptionKL: medianInter,
            problem1_convergent: convergent.length,
            problem2_lowInter: lowInter.length,
        },
        questions: serialized,
    }, null, 2));
    console.log(`Wrote ${outFile}`);
}
main().catch(err => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=question-discrimination.js.map