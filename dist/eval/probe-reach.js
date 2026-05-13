import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES } from "../config/nodes.js";
for (const node of CONTINUOUS_NODES) {
    const qs = REPRESENTATIVE_QUESTIONS.filter(q => q.touchProfile.some(t => t.kind === "continuous" && t.node === node && t.role !== "salience"));
    console.log(`\n${node}: ${qs.length} position-touching questions`);
    for (const q of qs) {
        const hasOpt = q.optionEvidence && Object.values(q.optionEvidence).some(e => e?.continuous?.[node]?.pos);
        const hasSlider = q.sliderMap && Object.values(q.sliderMap).some(e => e?.continuous?.[node]?.pos);
        const hasAlloc = q.allocationMap && Object.values(q.allocationMap).some(m => m.continuous?.[node] !== undefined);
        const hasRank = q.rankingMap && Object.values(q.rankingMap).some(m => m.continuous?.[node] !== undefined);
        const hasPair = q.pairMaps && Object.values(q.pairMaps).some(opts => Object.values(opts).some((m) => m.continuous?.[node] !== undefined));
        const hasDual = q.dualAxisMap?.node === node;
        const shapes = [hasOpt && "opt", hasSlider && "sli", hasAlloc && "alloc", hasRank && "rank", hasPair && "pair", hasDual && "dual"].filter(Boolean).join(",");
        console.log(`  Q${q.id} [${q.uiType}] → ${shapes}`);
    }
}
//# sourceMappingURL=probe-reach.js.map