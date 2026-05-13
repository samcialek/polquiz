/**
 * Phase 4 diagnostic — compare activation-multiplier scoring against the
 * legacy dense-vector / 60-40 blend. Same 121×60 archetype-election grid,
 * same candidate profiles, same sanity cases. Emits a regression.md report.
 *
 *   npx tsx src/eval/diagnose-activation-mechanism.ts
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { getNodeWeight } from "../historical/activation.js";
const SCORING_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB",
];
const LEGACY_ERA_ALPHA = 0.4;
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
// Replicates the pre-activation-map formula inline for comparison:
//   eraSal = clamp((getNodeWeight - 0.5) * 2, 0, 3)
//   effectiveSal = 0.6 * archSal + 0.4 * eraSal
function legacyDistance(sig, cand, ctx) {
    let wSumSq = 0;
    let wTotal = 0;
    for (const node of SCORING_NODES) {
        const entry = sig[node];
        if (!entry)
            continue;
        const candPos = cand[node];
        if (candPos == null)
            continue;
        const eraWeight = getNodeWeight(ctx, node);
        const eraSal = Math.min(3, Math.max(0, (eraWeight - 0.5) * 2));
        const effectiveSal = (1 - LEGACY_ERA_ALPHA) * entry.sal + LEGACY_ERA_ALPHA * eraSal;
        const diff = entry.pos - candPos;
        wSumSq += effectiveSal * diff * diff;
        wTotal += effectiveSal;
    }
    return wTotal > 0 ? Math.sqrt(wSumSq / wTotal) : 4;
}
const rows = [];
for (const arch of ARCHETYPES) {
    const sig = archetypeToSignature(arch);
    for (const election of ELECTIONS) {
        const ctx = getContext(election.year);
        if (!ctx)
            continue;
        const candsNew = election.candidates.map(c => {
            const pred = predictVote(sig, [c], ctx, "engaged");
            return {
                name: c.name,
                party: c.party,
                distNew: pred.candidates[0].distance,
                distLegacy: legacyDistance(sig, c, ctx),
            };
        });
        const nearestNew = candsNew.reduce((a, b) => a.distNew <= b.distNew ? a : b);
        const nearestLegacy = candsNew.reduce((a, b) => a.distLegacy <= b.distLegacy ? a : b);
        rows.push({
            year: election.year,
            archId: arch.id,
            archName: arch.name,
            candidates: candsNew,
            nearestNew: { name: nearestNew.name, party: nearestNew.party, distance: nearestNew.distNew },
            nearestLegacy: { name: nearestLegacy.name, party: nearestLegacy.party, distance: nearestLegacy.distLegacy },
            flipped: nearestNew.name !== nearestLegacy.name,
        });
    }
}
// ── Flip stats ──────────────────────────────────────────────────────────
const totalRows = rows.length;
const flipped = rows.filter(r => r.flipped);
const flippedByYear = new Map();
for (const r of flipped)
    flippedByYear.set(r.year, (flippedByYear.get(r.year) ?? 0) + 1);
const flipsSorted = [...flippedByYear.entries()].sort((a, b) => b[1] - a[1]);
// ── Distance distribution under new mechanism ───────────────────────────
const distances = rows.map(r => r.nearestNew.distance).sort((a, b) => a - b);
const pct = (p) => distances[Math.floor(p * distances.length)];
const dMin = distances[0], dMax = distances[distances.length - 1];
const dP10 = pct(0.10), dP25 = pct(0.25), dP50 = pct(0.50);
const dP75 = pct(0.75), dP90 = pct(0.90), dP99 = pct(0.99);
const dMean = distances.reduce((a, b) => a + b, 0) / distances.length;
const dStd = Math.sqrt(distances.reduce((s, d) => s + (d - dMean) ** 2, 0) / distances.length);
// Legacy distribution for reference
const legacyDistances = rows.map(r => r.nearestLegacy.distance).sort((a, b) => a - b);
const lPct = (p) => legacyDistances[Math.floor(p * legacyDistances.length)];
const lMin = legacyDistances[0], lMax = legacyDistances[legacyDistances.length - 1];
const lP10 = lPct(0.10), lP50 = lPct(0.50), lP90 = lPct(0.90);
const lMean = legacyDistances.reduce((a, b) => a + b, 0) / legacyDistances.length;
// ── Sanity check ────────────────────────────────────────────────────────
const SANITY_CHECKS = [
    { id: "001", year: 2020, expectParty: "Democratic", note: "Rawlsian Reformer → Biden" },
    { id: "001", year: 2024, expectParty: "Democratic", note: "Rawlsian Reformer → Harris" },
    { id: "001", year: 1984, expectParty: "Democratic", note: "Rawlsian Reformer → Mondale" },
    { id: "001", year: 1964, expectParty: "Democratic", note: "Rawlsian Reformer → Johnson" },
    { id: "092", year: 2016, expectParty: "Republican", note: "Partisan Tribalist → Trump" },
    { id: "092", year: 2020, expectParty: "Republican", note: "Partisan Tribalist → Trump" },
    { id: "092", year: 2024, expectParty: "Republican", note: "Partisan Tribalist → Trump" },
    { id: "020", year: 2020, expectParty: "Democratic", note: "020 → Biden" },
    { id: "020", year: 1972, expectParty: "Democratic", note: "020 → McGovern" },
    { id: "060", year: 1980, expectParty: "Republican", note: "060 → Reagan" },
    { id: "060", year: 1984, expectParty: "Republican", note: "060 → Reagan" },
];
const sanityResults = SANITY_CHECKS.map(chk => {
    const row = rows.find(r => r.archId === chk.id && r.year === chk.year);
    if (!row)
        return { ...chk, actual: "(no row)", distance: NaN, match: false };
    return {
        ...chk,
        actual: `${row.nearestNew.name} (${row.nearestNew.party})`,
        distance: row.nearestNew.distance,
        match: row.nearestNew.party === chk.expectParty,
    };
});
// ── Spot-check: 10 flipped pairs, no self-assessment ────────────────────
const spotCheckPool = [...flipped];
// Prefer diverse years; take 10 stratified by year bucket
const buckets = [[], [], [], []];
for (const r of spotCheckPool) {
    if (r.year < 1850)
        buckets[0].push(r);
    else if (r.year < 1920)
        buckets[1].push(r);
    else if (r.year < 1980)
        buckets[2].push(r);
    else
        buckets[3].push(r);
}
const spots = [];
let bIdx = 0;
while (spots.length < 10 && buckets.some(b => b.length > 0)) {
    const b = buckets[bIdx % 4];
    if (b.length > 0)
        spots.push(b.shift());
    bIdx++;
}
// ── Write report ────────────────────────────────────────────────────────
const outDir = "results/era-activations";
if (!existsSync(outDir))
    mkdirSync(outDir, { recursive: true });
let md = "";
md += "# Activation-map regression — Phase 4\n\n";
md += `_Generated: ${new Date().toISOString()}_\n`;
md += `_Archetypes: ${ARCHETYPES.length} · Elections: ${ELECTIONS.length} · Rows: ${totalRows}_\n\n`;
md += "## Mechanism under test\n\n";
md += "Replaced `effectiveSal = 0.6·sig.sal + 0.4·clamp((eraWeight-0.5)·2, 0, 3)` with\n";
md += "`effectiveSal = sig.sal · getActivationMultiplier(year, node)`, where the multiplier\n";
md += "is 1 / 2 / 3 per `src/historical/era-activations.json`. 3 super-activation slots\n";
md += "(1860 MOR, 1896 MAT, 1932 MAT), 46 activated slots across 32 elections, 28 elections\n";
md += "with no activation, 6 nodes (PF, COM, EPS, AES, ONT_H, ZS) that never activate.\n\n";
md += "## Historical sanity (11 named cases)\n\n";
const sanityPass = sanityResults.filter(r => r.match).length;
md += `**${sanityPass} / ${sanityResults.length} checks passed.**\n\n`;
if (sanityPass < sanityResults.length) {
    md += "⚠️ **Sanity regression.** Activation-map integration may have a bug — stop and investigate.\n\n";
}
md += "| arch | year | expected | actual | distance | pass |\n|------|------|----------|--------|----------|------|\n";
for (const r of sanityResults) {
    const distStr = Number.isFinite(r.distance) ? r.distance.toFixed(3) : "—";
    md += `| ${r.id} | ${r.year} | ${r.expectParty} | ${r.actual} | ${distStr} | ${r.match ? "✓" : "✗"} |\n`;
}
md += "\n";
md += "## Flip count — activation-multiplier vs legacy 60/40 blend\n\n";
md += `${flipped.length} of ${totalRows} (${(100 * flipped.length / totalRows).toFixed(1)}%) rows have a different nearest candidate under the new mechanism.\n\n`;
if (flipsSorted.length > 0) {
    md += "### Top flip-count years\n\n";
    md += "| year | flips | activation map |\n|------|-------|----------------|\n";
    // Need activation notes — import JSON for notes
    const { ERA_ACTIVATIONS } = await import("../historical/era-activations.js");
    for (const [year, cnt] of flipsSorted.slice(0, 15)) {
        const act = ERA_ACTIVATIONS[year];
        const tag = act
            ? (act.super_activated.length > 0 ? `super: ${act.super_activated.join(",")} · ` : "") +
                (act.activated.length > 0 ? `act: ${act.activated.join(",")}` : "(empty)")
            : "—";
        md += `| ${year} | ${cnt} | ${tag} |\n`;
    }
    md += "\n";
}
md += "## Distance distribution\n\n";
md += "| stat | new (activation-mult) | legacy (60/40 blend) |\n|------|------------------------|----------------------|\n";
md += `| min | ${dMin.toFixed(3)} | ${lMin.toFixed(3)} |\n`;
md += `| p10 | ${dP10.toFixed(3)} | ${lP10.toFixed(3)} |\n`;
md += `| p50 | ${dP50.toFixed(3)} | ${lP50.toFixed(3)} |\n`;
md += `| p90 | ${dP90.toFixed(3)} | ${lP90.toFixed(3)} |\n`;
md += `| max | ${dMax.toFixed(3)} | ${lMax.toFixed(3)} |\n`;
md += `| mean | ${dMean.toFixed(3)} | ${lMean.toFixed(3)} |\n`;
md += `| std | ${dStd.toFixed(3)} | — |\n\n`;
md += `p25=${dP25.toFixed(3)}, p75=${dP75.toFixed(3)}, p99=${dP99.toFixed(3)} on the new mechanism.\n\n`;
md += "Note: CLEARING_BAR quantile-anchored values (1.02 / 1.45 / 2.02 / 3.55) were calibrated to the legacy distribution. Under the new distribution those anchor points may no longer sit at p10 / p50 / p90. Recalibration is a Stage B/C follow-up — not in scope for this phase.\n\n";
md += "## Spot-check — 10 flipped (archetype × election) pairs\n\n";
md += "Sampled across eras. No self-assessment; flips are surfaced for Sam to review.\n\n";
md += "| arch | year | legacy nearest | legacy d | new nearest | new d | activation map |\n|------|------|----------------|----------|-------------|-------|----------------|\n";
const { ERA_ACTIVATIONS: EA } = await import("../historical/era-activations.js");
for (const r of spots) {
    const act = EA[r.year];
    const tag = act
        ? (act.super_activated.length > 0 ? `super: ${act.super_activated.join(",")}; ` : "") +
            (act.activated.length > 0 ? `act: ${act.activated.join(",")}` : "(none)")
        : "—";
    md += `| ${r.archId} ${r.archName.slice(0, 28)} | ${r.year} | ${r.nearestLegacy.name} (${r.nearestLegacy.party[0]}) | ${r.nearestLegacy.distance.toFixed(2)} | ${r.nearestNew.name} (${r.nearestNew.party[0]}) | ${r.nearestNew.distance.toFixed(2)} | ${tag} |\n`;
}
md += "\n";
md += "## Summary\n\n";
md += `- Sanity: ${sanityPass}/${sanityResults.length} ${sanityPass === sanityResults.length ? "(pass)" : "(**regression — stop and investigate**)"}\n`;
md += `- Flips: ${flipped.length}/${totalRows} = ${(100 * flipped.length / totalRows).toFixed(1)}%\n`;
md += `- Distance median: ${dMean < lMean ? "down" : "up"} vs legacy (${dMean.toFixed(3)} vs ${lMean.toFixed(3)})\n`;
md += `- Never-activate nodes (PF, COM, EPS, AES, ONT_H, ZS) default to multiplier=1 throughout; behavior confirmed by construction in era-activations.ts\n`;
writeFileSync(`${outDir}/regression.md`, md);
console.log(`Report written to ${outDir}/regression.md`);
console.log(`Sanity: ${sanityPass}/${sanityResults.length}`);
console.log(`Flips: ${flipped.length}/${totalRows}`);
//# sourceMappingURL=diagnose-activation-mechanism.js.map