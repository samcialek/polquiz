/**
 * Layer 2-B — detailed coverage for CU, TRB, ONT_S (the 3 wrong nodes).
 *
 * For each node, print EVERY option-level effect so we can see the full
 * distribution and spot where the bias comes from.
 */
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
function expectedPos(lik) {
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
function expectedSal(lik) {
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
function collectForNode(nodeId) {
    const out = [];
    for (const q of REPRESENTATIVE_QUESTIONS) {
        const qd = q;
        const oe = qd.optionEvidence;
        if (oe) {
            for (const [key, ev] of Object.entries(oe)) {
                const node = ev.continuous?.[nodeId];
                if (!node)
                    continue;
                out.push({ qid: q.id, promptShort: q.promptShort, optionKey: key,
                    posE: expectedPos(node.pos), salE: expectedSal(node.sal) });
            }
        }
        const sm = qd.sliderMap;
        if (sm) {
            for (const [key, ev] of Object.entries(sm)) {
                const node = ev.continuous?.[nodeId];
                if (!node)
                    continue;
                out.push({ qid: q.id, promptShort: q.promptShort, optionKey: `slider:${key}`,
                    posE: expectedPos(node.pos), salE: expectedSal(node.sal) });
            }
        }
        const rm = qd.rankingMap;
        if (rm) {
            for (const [key, ev] of Object.entries(rm)) {
                const val = ev.continuous?.[nodeId];
                if (val == null)
                    continue;
                if (typeof val === "number") {
                    out.push({ qid: q.id, promptShort: q.promptShort, optionKey: `rank:${key}`,
                        posE: 3 + val * 2, salE: null });
                }
                else {
                    out.push({ qid: q.id, promptShort: q.promptShort, optionKey: `rank:${key}`,
                        posE: expectedPos(val.pos), salE: expectedSal(val.sal) });
                }
            }
        }
        const am = qd.allocationMap;
        if (am) {
            for (const [key, ev] of Object.entries(am)) {
                const val = ev.continuous?.[nodeId];
                if (val == null)
                    continue;
                out.push({ qid: q.id, promptShort: q.promptShort, optionKey: `alloc:${key}`,
                    posE: 3 + val * 2, salE: null });
            }
        }
    }
    return out;
}
function summarize(nodeId, header) {
    const rows = collectForNode(nodeId);
    console.log(`\n===== ${nodeId} — ${header} =====\n`);
    console.log(`  Total effects: ${rows.length}  (unique Qs: ${new Set(rows.map((r) => r.qid)).size})`);
    const valid = rows.filter((r) => r.posE != null && !Number.isNaN(r.posE));
    if (valid.length > 0) {
        const mean = valid.reduce((a, r) => a + (r.posE ?? 0), 0) / valid.length;
        console.log(`  Mean E[pos] across options: ${mean.toFixed(2)}  (should be ~3 for unbiased bank)`);
        const lowCount = valid.filter((r) => (r.posE ?? 3) < 2.5).length;
        const highCount = valid.filter((r) => (r.posE ?? 3) > 3.5).length;
        const midCount = valid.length - lowCount - highCount;
        console.log(`  Distribution: ${lowCount} pull-low  ${midCount} middle  ${highCount} pull-high`);
    }
    // Sort and print
    rows.sort((a, b) => (a.posE ?? 3) - (b.posE ?? 3));
    console.log(`\n  --- All option effects (sorted by posE ascending: pos=1 pole first) ---`);
    for (const r of rows) {
        const pos = r.posE != null && !Number.isNaN(r.posE) ? r.posE.toFixed(2) : " - ";
        const sal = r.salE != null && !Number.isNaN(r.salE) ? r.salE.toFixed(2) : " - ";
        console.log(`  Q${r.qid.toString().padEnd(4)} ${r.promptShort.padEnd(36)} ${r.optionKey.padEnd(30)} posE=${pos}  salE=${sal}`);
    }
}
summarize("CU", "Cultural Uniformity (user expected ~4.5 pluralist, got ~1 shared culture)");
summarize("TRB", "Tribalism (user expected ~2 non-tribal, got ~4.55)");
summarize("ONT_S", "System Ontology (user got 'system is broken', uncertain if correct)");
summarize("ONT_H", "Hierarchy Orientation (user got zero salience)");
summarize("ZS", "Zero-Sum (user got zero salience)");
//# sourceMappingURL=diagnose-cu-trb-coverage.js.map