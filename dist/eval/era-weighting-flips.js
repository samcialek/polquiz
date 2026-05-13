/**
 * Dump every archetype-election flip for a given set of years. A flip is an
 * archetype whose nearest candidate differs between flat-salience scoring and
 * era-weighted scoring (the blend `effectiveSal = 0.6·sigSal + 0.4·eraSal`).
 *
 * Output: flat JSON + human-readable markdown for
 *   results/alignment-stage-a/era-weighting-flips-raw.md
 *
 *   npx tsx src/eval/era-weighting-flips.ts
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { getNodeWeight } from "../historical/activation.js";
const YEARS = [1908, 1912, 1984];
const SCORING_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB",
];
function archetypeToSignature(arch) {
    const sig = {};
    for (const [nodeId, tmpl] of Object.entries(arch.nodes)) {
        if (!tmpl)
            continue;
        if (tmpl.kind === "continuous") {
            const ct = tmpl;
            sig[nodeId] = { pos: ct.pos, sal: ct.sal };
        }
        else if (tmpl.kind === "categorical") {
            const ct = tmpl;
            const expectedIdx = ct.probs.reduce((s, p, i) => s + p * i, 0);
            sig[nodeId] = { pos: expectedIdx, sal: ct.sal };
        }
    }
    return sig;
}
function unweightedDistance(sig, cand) {
    let weightedSumSq = 0;
    let totalWeight = 0;
    for (const node of SCORING_NODES) {
        const entry = sig[node];
        if (!entry)
            continue;
        const candPos = cand[node];
        if (candPos == null)
            continue;
        const diff = entry.pos - candPos;
        weightedSumSq += entry.sal * diff * diff;
        totalWeight += entry.sal;
    }
    return totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
}
const outDir = "results/alignment-stage-a";
if (!existsSync(outDir))
    mkdirSync(outDir, { recursive: true });
let md = "";
md += "# Era-weighting flips — raw data for 1908, 1912, 1984\n\n";
md += `_Generated: ${new Date().toISOString()}_\n\n`;
md += "A \"flip\" is an archetype-election pair where the nearest candidate differs between flat-salience scoring (`sig.sal` only) and era-weighted scoring (`0.6·sig.sal + 0.4·eraSal`). These are the cases where era weighting makes a categorical difference to the output, not just a numeric one.\n\n";
const flipsByYear = {};
for (const year of YEARS) {
    flipsByYear[year] = [];
    const election = ELECTIONS.find(e => e.year === year);
    if (!election)
        continue;
    const ctx = getContext(year);
    if (!ctx)
        continue;
    for (const arch of ARCHETYPES) {
        const sig = archetypeToSignature(arch);
        const candData = election.candidates.map(c => {
            const flat = unweightedDistance(sig, c);
            const pred = predictVote(sig, [c], ctx, "engaged");
            return {
                name: c.name,
                party: c.party,
                distFlat: flat,
                distEra: pred.candidates[0].distance,
            };
        });
        const flatWinner = [...candData].sort((a, b) => a.distFlat - b.distFlat)[0];
        const eraWinner = [...candData].sort((a, b) => a.distEra - b.distEra)[0];
        if (flatWinner.name === eraWinner.name)
            continue;
        // Node profile snapshot — only continuous nodes that appear in SCORING_NODES,
        // plus their pos/sal/anti.
        const nodeProfile = {};
        for (const node of SCORING_NODES) {
            const tmpl = arch.nodes[node];
            if (!tmpl || tmpl.kind !== "continuous")
                continue;
            const ct = tmpl;
            nodeProfile[node] = { pos: ct.pos, sal: ct.sal, ...(ct.anti ? { anti: ct.anti } : {}) };
        }
        flipsByYear[year].push({
            archId: arch.id,
            archName: arch.name,
            flatWinner,
            eraWinner,
            allCandidates: candData,
            nodeProfile,
        });
    }
}
// Context / era weights for each year
for (const year of YEARS) {
    const ctx = getContext(year);
    md += `## ${year}\n\n`;
    md += `**Zeitgeist:** ${ctx.zeitgeist.description}\n\n`;
    md += `**Issue landscape:** ${ctx.issueLandscape.description}\n\n`;
    md += "**Era node weights** (only non-1.0 shown; blended via `eraSal = clamp((weight−0.5)·2, 0, 3)`):\n\n";
    md += "| node | weight | ≈ eraSal |\n|------|--------|----------|\n";
    for (const node of SCORING_NODES) {
        const w = getNodeWeight(ctx, node);
        if (Math.abs(w - 1.0) < 1e-9)
            continue;
        const eraSal = Math.min(3, Math.max(0, (w - 0.5) * 2));
        md += `| ${node} | ${w.toFixed(2)} | ${eraSal.toFixed(2)} |\n`;
    }
    md += "\n";
    const flips = flipsByYear[year];
    md += `**Flips:** ${flips.length} of ${ARCHETYPES.length} archetypes changed nearest candidate.\n\n`;
    md += "| arch | archetype | flat winner (party, distFlat→distEra) | era winner (party, distFlat→distEra) |\n|------|-----------|---------------------------------------|--------------------------------------|\n";
    for (const f of flips) {
        md += `| ${f.archId} | ${f.archName} | ${f.flatWinner.name} (${f.flatWinner.party}, ${f.flatWinner.distFlat.toFixed(2)}→${f.flatWinner.distEra.toFixed(2)}) | ${f.eraWinner.name} (${f.eraWinner.party}, ${f.eraWinner.distFlat.toFixed(2)}→${f.eraWinner.distEra.toFixed(2)}) |\n`;
    }
    md += "\n";
    md += "<details><summary>Full node profiles for each flipped archetype (click)</summary>\n\n";
    for (const f of flips) {
        md += `**${f.archId} ${f.archName}:**\n\n`;
        md += "| node | pos | sal | anti |\n|------|-----|-----|------|\n";
        for (const node of SCORING_NODES) {
            const p = f.nodeProfile[node];
            if (!p)
                continue;
            md += `| ${node} | ${p.pos} | ${p.sal} | ${p.anti ?? ""} |\n`;
        }
        md += "\nAll candidates:\n\n| candidate | party | distFlat | distEra |\n|-----------|-------|----------|---------|\n";
        for (const c of f.allCandidates) {
            md += `| ${c.name} | ${c.party} | ${c.distFlat.toFixed(3)} | ${c.distEra.toFixed(3)} |\n`;
        }
        md += "\n";
    }
    md += "</details>\n\n";
}
writeFileSync(`${outDir}/era-weighting-flips-raw.md`, md);
writeFileSync(`${outDir}/era-weighting-flips-raw.json`, JSON.stringify(flipsByYear, null, 2));
console.log(`Raw markdown → ${outDir}/era-weighting-flips-raw.md`);
console.log(`Raw JSON     → ${outDir}/era-weighting-flips-raw.json`);
for (const year of YEARS) {
    console.log(`  ${year}: ${flipsByYear[year].length} flips`);
}
//# sourceMappingURL=era-weighting-flips.js.map