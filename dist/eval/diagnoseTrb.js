/**
 * TRB anchor diagnostic: measure per-touch JSD on the trbAnchor dist, and
 * detect whether any touches write to bins the anchor dist treats as dead.
 *
 * Runs against results/step5/sigma-00.jsonl (121 deterministic runs — clean
 * signal, no noise).
 *
 * Outputs:
 *   results/trb-fix/per-touch-stats.json
 *     { count, median_jsd, mean_jsd, max_jsd, min_jsd, zero_touch_count,
 *       histogram_bins, by_archetype, per_touch_sample }
 *   results/trb-fix/per-archetype.csv
 *     archetype_id, arch_name, touches, final_H, final_max_bin, var_reduction_pct
 *   results/trb-fix/mass-conservation.txt
 *     Single-archetype trace: before/after each touch, dist, sum(dist), and
 *     whether gender (idx 5) and sexual (idx 6) ever receive non-trivial mass.
 */
import * as fs from "fs";
import * as path from "path";
const STEP5_DIR = path.join(process.cwd(), "results", "step5");
const OUT_DIR = path.join(process.cwd(), "results", "trb-fix");
const ANCHOR_ORDER = [
    "national", "ideological", "religious", "class", "ethnic_racial",
    "gender", "sexual", "global", "mixed_none",
];
function jsd(p, q) {
    // Jensen-Shannon divergence in nats
    if (p.length !== q.length)
        throw new Error("jsd length mismatch");
    const m = p.map((x, i) => (x + q[i]) / 2);
    const kl = (a, b) => {
        let s = 0;
        for (let i = 0; i < a.length; i++) {
            if (a[i] > 0 && b[i] > 0)
                s += a[i] * Math.log(a[i] / b[i]);
        }
        return s;
    };
    return 0.5 * kl(p, m) + 0.5 * kl(q, m);
}
function entropy(p) {
    let h = 0;
    for (const v of p)
        if (v > 0)
            h -= v * Math.log(v);
    return h;
}
function sum(a) {
    return a.reduce((s, x) => s + x, 0);
}
function main() {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const file = path.join(STEP5_DIR, "sigma-00.jsonl");
    if (!fs.existsSync(file)) {
        console.error(`Missing ${file}`);
        process.exit(2);
    }
    const jsds = [];
    const perArch = [];
    const sampleTouches = [];
    const massTrace = [];
    let firstArchTraced = false;
    let zeroTouchCount = 0;
    let genderNonTrivialWrites = 0;
    let sexualNonTrivialWrites = 0;
    const lines = fs.readFileSync(file, "utf-8").split("\n").filter(l => l.trim());
    for (const line of lines) {
        const r = JSON.parse(line);
        let archTouches = 0;
        let traceThis = false;
        if (r.archetypeId === "144" && !firstArchTraced) {
            // 144 = LGBTQ Voter, sexual-anchor identity
            traceThis = true;
            firstArchTraced = true;
            massTrace.push(`=== Archetype ${r.archetypeId} ${r.archetypeName} (σ=0, seed from manifest) ===`);
            massTrace.push(`questionsAsked: ${r.questionsAsked}`);
            massTrace.push("");
        }
        for (const step of r.nodeTrajectory) {
            for (const td of step.touchedNodes) {
                if (td.nodeId !== "TRB_ANCHOR")
                    continue;
                if (!td.anchorBefore || !td.anchorAfter) {
                    zeroTouchCount++;
                    continue;
                }
                archTouches++;
                const j = jsd(td.anchorBefore, td.anchorAfter);
                jsds.push(j);
                const changed = [];
                for (let i = 0; i < td.anchorBefore.length; i++) {
                    if (Math.abs(td.anchorAfter[i] - td.anchorBefore[i]) > 1e-8)
                        changed.push(i);
                }
                // Check if gender/sexual bins received non-trivial updates
                const genderDelta = Math.abs(td.anchorAfter[5] - td.anchorBefore[5]);
                const sexualDelta = Math.abs(td.anchorAfter[6] - td.anchorBefore[6]);
                if (genderDelta > 0.01)
                    genderNonTrivialWrites++;
                if (sexualDelta > 0.01)
                    sexualNonTrivialWrites++;
                if (sampleTouches.length < 25) {
                    sampleTouches.push({
                        arch: r.archetypeId,
                        qid: step.questionId,
                        ui: step.uiType,
                        before: td.anchorBefore,
                        after: td.anchorAfter,
                        jsd: j,
                        changedBins: changed,
                    });
                }
                if (traceThis) {
                    massTrace.push(`--- qIdx=${step.qIdx} qid=${step.questionId} ui=${step.uiType} ---`);
                    massTrace.push(`before: ${td.anchorBefore.map((x, i) => `${ANCHOR_ORDER[i]}=${x.toFixed(4)}`).join(", ")}`);
                    massTrace.push(`after:  ${td.anchorAfter.map((x, i) => `${ANCHOR_ORDER[i]}=${x.toFixed(4)}`).join(", ")}`);
                    massTrace.push(`sum(before)=${sum(td.anchorBefore).toFixed(6)}  sum(after)=${sum(td.anchorAfter).toFixed(6)}`);
                    massTrace.push(`JSD=${j.toFixed(6)} changed_bins=[${changed.map(i => ANCHOR_ORDER[i]).join(",")}]`);
                    massTrace.push(`gender_delta=${genderDelta.toFixed(4)} sexual_delta=${sexualDelta.toFixed(4)}`);
                    massTrace.push("");
                }
            }
        }
        const finalDist = r.nodeFinalState?.trbAnchor?.dist ?? new Array(9).fill(1 / 9);
        const maxVal = Math.max(...finalDist);
        const maxIdx = finalDist.indexOf(maxVal);
        perArch.push({
            id: r.archetypeId,
            name: r.archetypeName,
            touches: archTouches,
            finalH: entropy(finalDist),
            finalMax: maxVal,
            finalMaxIdx: maxIdx,
            finalDist,
        });
        if (traceThis) {
            massTrace.push(`=== FINAL dist ===`);
            massTrace.push(finalDist.map((x, i) => `${ANCHOR_ORDER[i]}=${x.toFixed(4)}`).join(", "));
            massTrace.push(`sum=${sum(finalDist).toFixed(6)}`);
            massTrace.push(`H(final)=${entropy(finalDist).toFixed(4)}, H_uniform=${Math.log(9).toFixed(4)}, var_reduction=${(((Math.log(9) - entropy(finalDist)) / Math.log(9)) * 100).toFixed(2)}%`);
            massTrace.push(`top anchor = ${ANCHOR_ORDER[maxIdx]} (${maxVal.toFixed(4)})`);
            massTrace.push("");
        }
    }
    // Stats
    jsds.sort((a, b) => a - b);
    const n = jsds.length;
    const median = n ? jsds[Math.floor(n / 2)] : 0;
    const mean = n ? jsds.reduce((s, x) => s + x, 0) / n : 0;
    const min = n ? jsds[0] : 0;
    const max = n ? jsds[n - 1] : 0;
    const p25 = n ? jsds[Math.floor(n * 0.25)] : 0;
    const p75 = n ? jsds[Math.floor(n * 0.75)] : 0;
    const p95 = n ? jsds[Math.floor(n * 0.95)] : 0;
    // Histogram (log-scale bins of JSD)
    const binEdges = [0, 1e-6, 1e-5, 1e-4, 1e-3, 1e-2, 0.05, 0.1, 0.25, 0.5, 1.0];
    const hist = new Array(binEdges.length - 1).fill(0);
    for (const j of jsds) {
        for (let b = 0; b < binEdges.length - 1; b++) {
            if (j >= binEdges[b] && j < binEdges[b + 1]) {
                hist[b]++;
                break;
            }
        }
    }
    const H_uniform = Math.log(9);
    const meanFinalH = perArch.reduce((s, a) => s + a.finalH, 0) / (perArch.length || 1);
    const varReduction = ((H_uniform - meanFinalH) / H_uniform) * 100;
    const stats = {
        jsdTouchCount: n,
        median_jsd: median,
        mean_jsd: mean,
        min_jsd: min,
        max_jsd: max,
        p25: p25,
        p75: p75,
        p95: p95,
        zero_touch_count: zeroTouchCount,
        gender_nontrivial_writes: genderNonTrivialWrites,
        sexual_nontrivial_writes: sexualNonTrivialWrites,
        total_archetypes: perArch.length,
        mean_final_H: meanFinalH,
        H_uniform,
        variance_reduction_pct: varReduction,
        histogram: binEdges.slice(0, -1).map((lo, i) => ({
            low: lo,
            high: binEdges[i + 1],
            count: hist[i],
        })),
        per_touch_sample: sampleTouches,
    };
    fs.writeFileSync(path.join(OUT_DIR, "per-touch-stats.json"), JSON.stringify(stats, null, 2));
    // Per-archetype CSV
    const csvLines = [
        ["arch_id", "arch_name", "touches", "final_H", "top_anchor", "top_anchor_mass", "var_reduction_pct"].join(","),
    ];
    for (const a of perArch) {
        const red = ((H_uniform - a.finalH) / H_uniform) * 100;
        csvLines.push([
            a.id,
            `"${a.name.replace(/"/g, '""')}"`,
            a.touches,
            a.finalH.toFixed(4),
            ANCHOR_ORDER[a.finalMaxIdx] ?? "?",
            a.finalMax.toFixed(4),
            red.toFixed(2),
        ].join(","));
    }
    fs.writeFileSync(path.join(OUT_DIR, "per-archetype.csv"), csvLines.join("\n"));
    // Mass-conservation trace (fallback if 144 didn't appear, trace the first archetype)
    if (massTrace.length === 0) {
        massTrace.push("(no trace written — archetype 144 not found in sigma-00.jsonl)");
    }
    fs.writeFileSync(path.join(OUT_DIR, "mass-conservation.txt"), massTrace.join("\n"));
    console.log("=== TRB anchor diagnostic ===");
    console.log(`TRB touches sampled: ${n}`);
    console.log(`  median JSD: ${median.toFixed(6)}`);
    console.log(`  mean JSD:   ${mean.toFixed(6)}`);
    console.log(`  p25 / p75:  ${p25.toFixed(6)} / ${p75.toFixed(6)}`);
    console.log(`  max JSD:    ${max.toFixed(6)}`);
    console.log(`  zero-delta touches:       ${zeroTouchCount}`);
    console.log(`  gender bin nontrivial:    ${genderNonTrivialWrites}`);
    console.log(`  sexual bin nontrivial:    ${sexualNonTrivialWrites}`);
    console.log(`Mean final H (n=${perArch.length}): ${meanFinalH.toFixed(4)} nats (uniform=${H_uniform.toFixed(4)})`);
    console.log(`Variance reduction: ${varReduction.toFixed(2)}%`);
    console.log();
    console.log(`Outputs:`);
    console.log(`  ${path.join(OUT_DIR, "per-touch-stats.json")}`);
    console.log(`  ${path.join(OUT_DIR, "per-archetype.csv")}`);
    console.log(`  ${path.join(OUT_DIR, "mass-conservation.txt")}`);
}
main();
//# sourceMappingURL=diagnoseTrb.js.map