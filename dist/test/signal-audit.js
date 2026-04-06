import { REPRESENTATIVE_QUESTIONS as QUESTIONS } from "../config/questions.representative.js";
const activeQs = QUESTIONS.filter(q => q.optionEvidence || q.pairMaps || q.rankingMap || q.bestWorstMap || q.allocationBuckets);
console.log("# PRISM Quiz � Full Signal Audit");
console.log(`## Active Questions: ${activeQs.length} / ${QUESTIONS.length} total\n`);
// Node coverage tracking
const nodeCoverage = {};
for (const q of QUESTIONS) {
    if (!q.touchProfile)
        continue;
    const opts = q.options || Object.keys(q.optionEvidence || {});
    const optCount = opts.length;
    // Skip commented-out / inactive questions (no evidence)
    if (!q.optionEvidence && !q.pairMaps && !q.rankingMap && !q.bestWorstMap && !q.allocationBuckets)
        continue;
    console.log(`### Q${q.id} � ${q.promptShort}`);
    console.log(`- **UI Type:** ${q.uiType} | **Stage:** ${q.stage} | **Quality:** ${q.quality}`);
    console.log(`- **Options (${optCount}):** ${opts.join(', ')}`);
    // Touch profile breakdown
    console.log(`- **Touch Profile:**`);
    for (const t of q.touchProfile) {
        const nodeId = t.node;
        const role = t.role;
        const kind = t.kind;
        const weight = t.weight;
        const touchType = t.touchType;
        console.log(`  - ${nodeId} (${kind}) ? ${role} [weight=${weight}] (${touchType})`);
        // Track coverage
        if (!nodeCoverage[nodeId])
            nodeCoverage[nodeId] = { position: [], salience: [], categorical: [] };
        if (role === 'position')
            nodeCoverage[nodeId].position.push(`Q${q.id}(${weight})`);
        else if (role === 'salience')
            nodeCoverage[nodeId].salience.push(`Q${q.id}(${weight})`);
        else if (role === 'category')
            nodeCoverage[nodeId].categorical.push(`Q${q.id}(${weight})`);
    }
    // Option evidence signals
    if (q.optionEvidence) {
        console.log(`- **Option Evidence:**`);
        for (const [optKey, ev] of Object.entries(q.optionEvidence)) {
            const signals = [];
            if (ev.continuous) {
                for (const [node, upd] of Object.entries(ev.continuous)) {
                    if (upd.pos) {
                        const posArr = upd.pos;
                        const peak = Math.max(...posArr);
                        const peakIdx = posArr.indexOf(peak);
                        signals.push(`${node}.pos ? peak at bin ${peakIdx + 1}/5 (${(peak * 100).toFixed(0)}%)`);
                    }
                    if (upd.sal) {
                        const salArr = upd.sal;
                        const peak = Math.max(...salArr);
                        const peakIdx = salArr.indexOf(peak);
                        signals.push(`${node}.sal ? peak at bin ${peakIdx + 1}/4 (${(peak * 100).toFixed(0)}%)`);
                    }
                }
            }
            if (ev.categorical) {
                for (const [node, cat] of Object.entries(ev.categorical)) {
                    signals.push(`${node}.cat ? [${cat.cat?.join(',')}]`);
                }
            }
            console.log(`  - **${optKey}:** ${signals.join(' | ')}`);
        }
    }
    console.log('');
}
// Node coverage summary
console.log('\n## Node Coverage Summary\n');
console.log('| Node | Position Touches | Salience Touches | Categorical Touches |');
console.log('|------|-----------------|------------------|---------------------|');
const allNodes = ['MAT', 'CD', 'CU', 'MOR', 'PRO', 'EPS', 'AES', 'COM', 'ZS', 'ONT_H', 'ONT_S', 'PF', 'TRB', 'ENG'];
for (const node of allNodes) {
    const c = nodeCoverage[node] || { position: [], salience: [], categorical: [] };
    console.log(`| ${node} | ${c.position.length}: ${c.position.join(', ')} | ${c.salience.length}: ${c.salience.join(', ')} | ${c.categorical.length}: ${c.categorical.join(', ')} |`);
}
//# sourceMappingURL=signal-audit.js.map