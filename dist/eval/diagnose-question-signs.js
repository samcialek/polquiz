/**
 * Layer 2 — Question sign & coverage audit.
 *
 * For each continuous node:
 *   - Count questions that touch it (position and/or salience)
 *   - For every option in every question, compute implied E[pos|option] from
 *     the likelihood distribution in optionEvidence/sliderMap/rankingMap/
 *     allocationMap. Flag anything where the "neutral balanced" answerer
 *     (uniform over options) drifts the posterior away from the neutral mean.
 *   - Highlight questions where every option points the SAME direction on a
 *     node — those would pull every respondent to one pole.
 *
 * Output: per-node summary + suspicious-question list for CU, TRB, ONT_S,
 * ONT_H, ZS (the nodes the user flagged as wrong or zero-salience).
 */
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES } from "../config/nodes.js";
function expectedPosFromLikelihood(lik) {
    if (!lik || lik.length !== 5)
        return null;
    const s = lik.reduce((a, b) => a + b, 0);
    if (s <= 0)
        return null;
    let e = 0;
    for (let i = 0; i < 5; i++)
        e += (i + 1) * (lik[i] / s);
    return e;
}
function expectedSalFromLikelihood(lik) {
    if (!lik || lik.length !== 4)
        return null;
    const s = lik.reduce((a, b) => a + b, 0);
    if (s <= 0)
        return null;
    let e = 0;
    for (let i = 0; i < 4; i++)
        e += i * (lik[i] / s);
    return e;
}
function collectNodeEffects(nodeId) {
    const out = [];
    for (const q of REPRESENTATIVE_QUESTIONS) {
        const qd = q;
        // optionEvidence (single_choice, best_worst, etc.)
        const oe = qd.optionEvidence;
        if (oe) {
            for (const [key, ev] of Object.entries(oe)) {
                const node = ev.continuous?.[nodeId];
                if (!node)
                    continue;
                out.push({
                    qid: q.id,
                    promptShort: q.promptShort,
                    optionKey: key,
                    posE: expectedPosFromLikelihood(node.pos),
                    salE: expectedSalFromLikelihood(node.sal),
                });
            }
        }
        // sliderMap (likert/slider questions, keyed by bucket)
        const sm = qd.sliderMap;
        if (sm) {
            for (const [key, ev] of Object.entries(sm)) {
                const node = ev.continuous?.[nodeId];
                if (!node)
                    continue;
                out.push({
                    qid: q.id,
                    promptShort: q.promptShort,
                    optionKey: `slider:${key}`,
                    posE: expectedPosFromLikelihood(node.pos),
                    salE: expectedSalFromLikelihood(node.sal),
                });
            }
        }
        // rankingMap
        const rm = qd.rankingMap;
        if (rm) {
            for (const [key, ev] of Object.entries(rm)) {
                const val = ev.continuous?.[nodeId];
                if (val == null)
                    continue;
                // ranking scores are -1..1 deltas; convert to effective direction sign
                // via pos E: 3 + val*2 gives a roughly 1..5 pos when val in [-1..1].
                out.push({
                    qid: q.id,
                    promptShort: q.promptShort,
                    optionKey: `rank:${key}`,
                    posE: 3 + val * 2,
                    salE: null,
                });
            }
        }
        // allocationMap
        const am = qd.allocationMap;
        if (am) {
            for (const [key, ev] of Object.entries(am)) {
                const val = ev.continuous?.[nodeId];
                if (val == null)
                    continue;
                out.push({
                    qid: q.id,
                    promptShort: q.promptShort,
                    optionKey: `alloc:${key}`,
                    posE: 3 + val * 2,
                    salE: null,
                });
            }
        }
    }
    return out;
}
function summarize(nodeId) {
    const effects = collectNodeEffects(nodeId);
    const qidsTouching = new Set(effects.map((e) => e.qid));
    const posEffects = effects.filter((e) => e.posE != null);
    const posMean = posEffects.reduce((a, e) => a + (e.posE ?? 0), 0) / (posEffects.length || 1);
    const posMin = Math.min(...posEffects.map((e) => e.posE ?? 3));
    const posMax = Math.max(...posEffects.map((e) => e.posE ?? 3));
    console.log();
    console.log(`=== ${nodeId} ===`);
    console.log(`  ${qidsTouching.size} questions touch this node (${effects.length} option-level effects)`);
    console.log(`  Option-level E[pos] range: ${posMin.toFixed(2)} .. ${posMax.toFixed(2)}  (mean=${posMean.toFixed(2)})`);
    if (Math.abs(posMean - 3) > 0.3) {
        console.log(`  ⚠  BASELINE BIAS: options average E[pos]=${posMean.toFixed(2)} (should be ~3). Uniform-random answerer drifts toward pos=${posMean.toFixed(2)}`);
    }
    // Per-question summary
    const byQid = new Map();
    for (const e of effects) {
        if (!byQid.has(e.qid))
            byQid.set(e.qid, []);
        byQid.get(e.qid).push(e);
    }
    const suspicious = [];
    for (const [qid, opts] of byQid) {
        const optPosE = opts.filter((o) => o.posE != null).map((o) => o.posE);
        if (optPosE.length === 0)
            continue;
        const optMean = optPosE.reduce((a, b) => a + b, 0) / optPosE.length;
        const optMin = Math.min(...optPosE);
        const optMax = Math.max(...optPosE);
        const detail = opts.map((o) => `${o.optionKey}=${(o.posE ?? 0).toFixed(2)}`).join(", ");
        // Flag if all options push the same direction (range < 1) OR mean > 3.5/< 2.5
        if (optMax - optMin < 0.5 || Math.abs(optMean - 3) > 0.7) {
            suspicious.push({
                qid,
                promptShort: opts[0]?.promptShort ?? "?",
                optMean,
                optRange: `${optMin.toFixed(2)}-${optMax.toFixed(2)}`,
                detail,
            });
        }
    }
    if (suspicious.length > 0) {
        console.log(`  Suspicious questions (narrow option range OR skewed mean):`);
        for (const s of suspicious) {
            console.log(`    Q${s.qid}  ${s.promptShort.padEnd(32)}  range=${s.optRange}  mean=${s.optMean.toFixed(2)}`);
            console.log(`        ${s.detail}`);
        }
    }
}
for (const nodeId of CONTINUOUS_NODES) {
    summarize(nodeId);
}
//# sourceMappingURL=diagnose-question-signs.js.map