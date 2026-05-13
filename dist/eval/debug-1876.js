import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { isSelfNode } from "../config/nodes.js";
const election = ELECTIONS.find((e) => e.year === 1876);
const ctx = getContext(1876);
const SCORING = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB"];
const DEACT = new Set(["019", "023", "025"]);
const active = ARCHETYPES.filter((a) => !DEACT.has(a.id));
const buckets = { Tilden: [], Hayes: [], ABSTAIN: [] };
const distToHayes = [];
for (const a of active) {
    const sig = {};
    for (const n of SCORING) {
        const t = a.nodes[n];
        if (!t || t.kind !== "continuous")
            continue;
        const sal = isSelfNode(n) ? ((t.pos - 1) / 4) * 3 : (t.sal ?? 1);
        sig[n] = { pos: t.pos, sal };
    }
    const pred = predictVote(sig, election.candidates, ctx, "engaged");
    const winner = pred.decision === "vote" ? pred.nearest.name : "ABSTAIN";
    buckets[winner]?.push(`${a.id} ${a.name}`);
    const hayes = pred.candidates.find((c) => c.name === "Hayes");
    const tilden = pred.candidates.find((c) => c.name === "Tilden");
    distToHayes.push({ id: a.id, name: a.name, dH: hayes?.distance ?? 99, dT: tilden?.distance ?? 99 });
}
console.log(`Tilden: ${buckets.Tilden?.length}  Hayes: ${buckets.Hayes?.length}  Abstain: ${buckets.ABSTAIN?.length}`);
console.log();
console.log(`Archetypes picking Hayes:`);
for (const w of buckets.Hayes ?? [])
    console.log(`  ${w}`);
console.log();
console.log(`Top 10 archetypes where Hayes is CLOSEST (lowest dH):`);
const top = distToHayes.slice().sort((a, b) => a.dH - b.dH).slice(0, 10);
for (const t of top) {
    const winner = t.dH < t.dT ? "HAYES" : "Tilden";
    console.log(`  ${t.id} ${t.name.padEnd(34)}  dH=${t.dH.toFixed(2)}  dT=${t.dT.toFixed(2)}  → ${winner}`);
}
console.log();
console.log(`Top 10 where Hayes is CLOSER than Tilden:`);
const hayesPref = distToHayes.filter((t) => t.dH < t.dT).sort((a, b) => a.dH - b.dH);
for (const t of hayesPref.slice(0, 10)) {
    console.log(`  ${t.id} ${t.name.padEnd(34)}  dH=${t.dH.toFixed(2)}  dT=${t.dT.toFixed(2)}`);
}
console.log(`Total archetypes where Hayes is closer: ${hayesPref.length}`);
//# sourceMappingURL=debug-1876.js.map