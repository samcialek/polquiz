/**
 * Non-ideological modifier layer regression.
 *
 * Runs the 121 archetypes × 60 elections grid four times:
 *   - OFF (baseline — ideological distance only)
 *   - ECON_ONLY (economic component only)
 *   - INCUMB_ONLY (incumbency component only)
 *   - CHARISMA_ONLY (charisma component only)
 *   - ON (all three, weighted and capped per spec)
 *
 * Metrics:
 *   - Top-1 party accuracy (nearest-candidate's party == historical winner)
 *   - Flip count OFF → ON (per-row and per-year)
 *   - Per-component isolation
 *   - 11-sanity-case pass rate (including the 001/Mondale-1984 check)
 *   - Distance distribution
 *
 * Hard stop: if top-1 drops ≥2pp OFF→ON we flag the regression.
 * Red flag: if charisma-alone accuracy > econ-alone accuracy.
 *
 *   npx tsx src/eval/diagnose-nonideological-layer.ts
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { getActivationMultiplier } from "../historical/era-activations.js";
import { getNonIdeologicalModifier, historicalToCanonical, } from "../historical/non-ideological-modifiers.js";
const SCORING_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB",
];
// Historical winners table (party of the winner; used for top-1 accuracy).
// Coded from the US presidential election record.
const WINNERS = {
    1789: "Unaffiliated", 1792: "Unaffiliated",
    1796: "Federalist", 1800: "Democratic-Republican",
    1804: "Democratic-Republican", 1808: "Democratic-Republican",
    1812: "Democratic-Republican", 1816: "Democratic-Republican",
    1820: "Democratic-Republican", 1824: "Democratic-Republican",
    1828: "Democratic", 1832: "Democratic", 1836: "Democratic",
    1840: "Whig", 1844: "Democratic", 1848: "Whig",
    1852: "Democratic", 1856: "Democratic", 1860: "Republican",
    1864: "Republican", 1868: "Republican", 1872: "Republican",
    1876: "Republican", 1880: "Republican", 1884: "Democratic",
    1888: "Republican", 1892: "Democratic", 1896: "Republican",
    1900: "Republican", 1904: "Republican", 1908: "Republican",
    1912: "Democratic", 1916: "Democratic", 1920: "Republican",
    1924: "Republican", 1928: "Republican", 1932: "Democratic",
    1936: "Democratic", 1940: "Democratic", 1944: "Democratic",
    1948: "Democratic", 1952: "Republican", 1956: "Republican",
    1960: "Democratic", 1964: "Democratic", 1968: "Republican",
    1972: "Republican", 1976: "Democratic", 1980: "Republican",
    1984: "Republican", 1988: "Republican", 1992: "Democratic",
    1996: "Democratic", 2000: "Republican", 2004: "Republican",
    2008: "Democratic", 2012: "Democratic", 2016: "Republican",
    2020: "Democratic", 2024: "Republican",
};
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
// Inlined copy of weightedDistance from respondentVoteChoice.ts, minus the
// feature flag. We compute ideological distance here and apply the modifier
// directly so the regression doesn't depend on env state or module reload.
function ideologicalDistance(sig, cand, ctx) {
    let wSumSq = 0;
    let wTotal = 0;
    for (const node of SCORING_NODES) {
        const entry = sig[node];
        if (!entry)
            continue;
        const candPos = cand[node];
        if (candPos == null)
            continue;
        const effectiveSal = entry.sal * getActivationMultiplier(ctx.year, node);
        const diff = entry.pos - candPos;
        wSumSq += effectiveSal * diff * diff;
        wTotal += effectiveSal;
    }
    return wTotal > 0 ? Math.sqrt(wSumSq / wTotal) : 4;
}
const WEIGHT_ECON = 0.60;
const WEIGHT_INCUMB = 0.20;
const WEIGHT_CHARISMA = 0.20;
const TOTAL_CAP = 0.30;
function clip(x, lo, hi) {
    return Math.max(lo, Math.min(hi, x));
}
function adjustedDistance(ideo, year, cand, mode) {
    if (mode === "off")
        return ideo;
    const m = getNonIdeologicalModifier(year, historicalToCanonical(cand.name, cand.year));
    let total = 0;
    if (mode === "econ_only")
        total = clip(WEIGHT_ECON * m.economic, -TOTAL_CAP, TOTAL_CAP);
    else if (mode === "incumb_only")
        total = clip(WEIGHT_INCUMB * m.incumbency, -TOTAL_CAP, TOTAL_CAP);
    else if (mode === "charisma_only")
        total = clip(WEIGHT_CHARISMA * m.charisma, -TOTAL_CAP, TOTAL_CAP);
    else
        total = m.total;
    return ideo - total;
}
const rows = [];
for (const arch of ARCHETYPES) {
    const sig = archetypeToSignature(arch);
    for (const election of ELECTIONS) {
        const ctx = getContext(election.year);
        if (!ctx)
            continue;
        const cands = election.candidates.map(c => ({
            name: c.name,
            party: c.party,
            ideo: ideologicalDistance(sig, c, ctx),
            profile: c,
        }));
        const modes = ["off", "econ_only", "incumb_only", "charisma_only", "on"];
        const nearestByMode = {};
        for (const mode of modes) {
            const scored = cands.map(c => ({
                name: c.name,
                party: c.party,
                distance: adjustedDistance(c.ideo, election.year, c.profile, mode),
            }));
            const near = scored.reduce((a, b) => a.distance <= b.distance ? a : b);
            nearestByMode[mode] = near;
        }
        rows.push({
            year: election.year,
            archId: arch.id,
            archName: arch.name,
            candidates: cands.map(c => ({ name: c.name, party: c.party, ideo: c.ideo })),
            nearestByMode,
        });
    }
}
// ── Top-1 party accuracy per mode ───────────────────────────────────────
function accuracyByMode(mode) {
    let hits = 0;
    for (const r of rows) {
        if (r.nearestByMode[mode].party === WINNERS[r.year])
            hits++;
    }
    return { pct: (100 * hits) / rows.length, hits, total: rows.length };
}
const accOff = accuracyByMode("off");
const accEcon = accuracyByMode("econ_only");
const accIncumb = accuracyByMode("incumb_only");
const accCharisma = accuracyByMode("charisma_only");
const accOn = accuracyByMode("on");
// ── Flip counts OFF → ON ───────────────────────────────────────────────
const flipsRows = rows.filter(r => r.nearestByMode.off.name !== r.nearestByMode.on.name);
const flipsByYear = new Map();
for (const r of flipsRows) {
    flipsByYear.set(r.year, (flipsByYear.get(r.year) ?? 0) + 1);
}
const flipsSorted = [...flipsByYear.entries()].sort((a, b) => b[1] - a[1]);
// Correctness transitions OFF→ON: won-wins (W→W), flipped-into-correct (L→W),
// flipped-into-wrong (W→L), stayed-wrong (L→L).
let ww = 0, lw = 0, wl = 0, ll = 0;
for (const r of rows) {
    const offCorrect = r.nearestByMode.off.party === WINNERS[r.year];
    const onCorrect = r.nearestByMode.on.party === WINNERS[r.year];
    if (offCorrect && onCorrect)
        ww++;
    else if (!offCorrect && onCorrect)
        lw++;
    else if (offCorrect && !onCorrect)
        wl++;
    else
        ll++;
}
// ── Per-year delta in top-1 accuracy ────────────────────────────────────
const perYear = [];
const years = Array.from(new Set(rows.map(r => r.year))).sort((a, b) => a - b);
for (const y of years) {
    const yr = rows.filter(r => r.year === y);
    const offCorrect = yr.filter(r => r.nearestByMode.off.party === WINNERS[y]).length / yr.length;
    const onCorrect = yr.filter(r => r.nearestByMode.on.party === WINNERS[y]).length / yr.length;
    perYear.push({ year: y, off: offCorrect, on: onCorrect, delta: onCorrect - offCorrect });
}
const worstYears = [...perYear].sort((a, b) => a.delta - b.delta).slice(0, 10);
const bestYears = [...perYear].sort((a, b) => b.delta - a.delta).slice(0, 10);
// ── Sanity checks — 11 named cases + Mondale-1984 specific ─────────────
const SANITY = [
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
const sanityResults = SANITY.map(chk => {
    const row = rows.find(r => r.archId === chk.id && r.year === chk.year);
    if (!row)
        return { ...chk, offActual: "—", onActual: "—", offMatch: false, onMatch: false };
    const off = row.nearestByMode.off;
    const on = row.nearestByMode.on;
    return {
        ...chk,
        offActual: `${off.name} (${off.party})`,
        onActual: `${on.name} (${on.party})`,
        offMatch: off.party === chk.expectParty,
        onMatch: on.party === chk.expectParty,
    };
});
// ── Distance distribution OFF vs ON ────────────────────────────────────
const offD = rows.map(r => r.nearestByMode.off.distance).sort((a, b) => a - b);
const onD = rows.map(r => r.nearestByMode.on.distance).sort((a, b) => a - b);
const pct = (arr, p) => arr[Math.floor(p * arr.length)];
const dMean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
// ── Spot-check flipped pairs ───────────────────────────────────────────
const buckets = [[], [], [], []];
for (const r of flipsRows) {
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
// ── Write report ───────────────────────────────────────────────────────
const outDir = "results/non-ideological-layer";
if (!existsSync(outDir))
    mkdirSync(outDir, { recursive: true });
let md = "";
md += "# Non-ideological modifier layer regression\n\n";
md += `_Generated: ${new Date().toISOString()}_\n`;
md += `_Archetypes: ${ARCHETYPES.length} · Elections: ${ELECTIONS.length} · Rows: ${rows.length}_\n\n`;
md += "## Mechanism under test\n\n";
md += "`final_distance = ideological_distance - nonideo.total`, where\n";
md += "`nonideo.total = clip(0.60·econ + 0.20·incumb + 0.20·charisma, -0.30, +0.30)`.\n\n";
md += "- **econ**: `0.5 · raw_econ` × incumbent-party-sign, 0 for third parties. `raw_econ` in `[-1, +1]` from tier-specific formula (quarterly/annual/binary).\n";
md += "- **incumb**: `+0.3` if `is_incumbent_person`, else 0. Non-consecutive-comeback (Cleveland_1892, Trump_2024) NOT flagged.\n";
md += "- **charisma**: `(charisma - 3) / 4`, from consensus-final.json charisma-by-key snapshot.\n\n";
md += "Data: `src/historical/non-ideological-data.json` (60 elections + 148 candidates).\n";
md += "Feature flag: `PRISM_NONIDEO=1` in `respondentVoteChoice.ts`.\n\n";
md += "## Top-1 party accuracy\n\n";
md += "Metric: nearest candidate's party matches the historical winner's party for that year.\n\n";
md += "| mode | accuracy | Δ vs OFF |\n|------|----------|----------|\n";
md += `| **OFF** (ideological only) | ${accOff.pct.toFixed(2)}% (${accOff.hits}/${accOff.total}) | — |\n`;
md += `| ECON_ONLY | ${accEcon.pct.toFixed(2)}% | ${(accEcon.pct - accOff.pct >= 0 ? "+" : "")}${(accEcon.pct - accOff.pct).toFixed(2)} pp |\n`;
md += `| INCUMB_ONLY | ${accIncumb.pct.toFixed(2)}% | ${(accIncumb.pct - accOff.pct >= 0 ? "+" : "")}${(accIncumb.pct - accOff.pct).toFixed(2)} pp |\n`;
md += `| CHARISMA_ONLY | ${accCharisma.pct.toFixed(2)}% | ${(accCharisma.pct - accOff.pct >= 0 ? "+" : "")}${(accCharisma.pct - accOff.pct).toFixed(2)} pp |\n`;
md += `| **ON** (all three) | ${accOn.pct.toFixed(2)}% | ${(accOn.pct - accOff.pct >= 0 ? "+" : "")}${(accOn.pct - accOff.pct).toFixed(2)} pp |\n\n`;
const accDelta = accOn.pct - accOff.pct;
if (accDelta <= -2) {
    md += "⚠️ **Accuracy regression ≥ 2 pp — hard stop per spec.**\n\n";
}
else if (accDelta < 0) {
    md += `⚠️ Mild regression (${accDelta.toFixed(2)} pp). Below the ≥2pp hard-stop threshold but worth a look.\n\n`;
}
else {
    md += `Improvement of ${accDelta.toFixed(2)} pp. Within the expected +1-3 pp band per spec.\n\n`;
}
const econIsolation = accEcon.pct - accOff.pct;
const charismaIsolation = accCharisma.pct - accOff.pct;
md += "### Per-component red-flag check\n\n";
md += `Economic-only delta: ${econIsolation >= 0 ? "+" : ""}${econIsolation.toFixed(2)} pp · Charisma-only delta: ${charismaIsolation >= 0 ? "+" : ""}${charismaIsolation.toFixed(2)} pp.\n\n`;
if (charismaIsolation > econIsolation) {
    md += `⚠️ **Red flag per spec**: charisma-alone is doing more work than economic-alone. Charisma component may be too aggressive for its 0.20 weight.\n\n`;
}
else {
    md += `Economic-alone does more work than charisma-alone — sanity check passes.\n\n`;
}
md += "## Transition matrix OFF → ON\n\n";
md += "| | ON correct | ON wrong |\n|---|---|---|\n";
md += `| **OFF correct** | ${ww} (held) | ${wl} (broke) |\n`;
md += `| **OFF wrong** | ${lw} (fixed) | ${ll} (still wrong) |\n\n`;
md += `Net: ${lw - wl >= 0 ? "+" : ""}${lw - wl} rows moved to correct.\n\n`;
md += "## Flip count OFF → ON (nearest-candidate name changed)\n\n";
md += `${flipsRows.length} of ${rows.length} rows (${(100 * flipsRows.length / rows.length).toFixed(1)}%) flipped nearest candidate.\n\n`;
if (flipsSorted.length > 0) {
    md += "### Top flip-count years\n\n";
    md += "| year | flips | winner |\n|------|-------|--------|\n";
    for (const [year, cnt] of flipsSorted.slice(0, 15)) {
        md += `| ${year} | ${cnt} | ${WINNERS[year]} |\n`;
    }
    md += "\n";
}
md += "## Per-year accuracy change\n\n";
md += "### Top 10 years by accuracy improvement (OFF → ON)\n\n";
md += "| year | off | on | Δ | winner |\n|------|-----|----|-----|--------|\n";
for (const y of bestYears) {
    md += `| ${y.year} | ${(100 * y.off).toFixed(0)}% | ${(100 * y.on).toFixed(0)}% | ${y.delta >= 0 ? "+" : ""}${(100 * y.delta).toFixed(0)} pp | ${WINNERS[y.year]} |\n`;
}
md += "\n### Bottom 10 years by accuracy change (OFF → ON)\n\n";
md += "| year | off | on | Δ | winner |\n|------|-----|----|-----|--------|\n";
for (const y of worstYears) {
    md += `| ${y.year} | ${(100 * y.off).toFixed(0)}% | ${(100 * y.on).toFixed(0)}% | ${y.delta >= 0 ? "+" : ""}${(100 * y.delta).toFixed(0)} pp | ${WINNERS[y.year]} |\n`;
}
md += "\n";
md += "## Sanity checks (11 named cases)\n\n";
md += `OFF pass: ${sanityResults.filter(r => r.offMatch).length}/${sanityResults.length} · ON pass: ${sanityResults.filter(r => r.onMatch).length}/${sanityResults.length}\n\n`;
md += "| arch | year | expected | OFF actual | OFF | ON actual | ON |\n|------|------|----------|------------|-----|-----------|-----|\n";
for (const r of sanityResults) {
    md += `| ${r.id} | ${r.year} | ${r.expectParty} | ${r.offActual} | ${r.offMatch ? "✓" : "✗"} | ${r.onActual} | ${r.onMatch ? "✓" : "✗"} |\n`;
}
md += "\n";
// 001/Mondale-1984 specific — the marked flip from the activation-map phase
const m84 = rows.find(r => r.archId === "001" && r.year === 1984);
if (m84) {
    md += "### 001 / 1984 specific check\n\n";
    md += `OFF nearest: **${m84.nearestByMode.off.name} (${m84.nearestByMode.off.party})** d=${m84.nearestByMode.off.distance.toFixed(3)}\n\n`;
    md += `ON nearest:  **${m84.nearestByMode.on.name} (${m84.nearestByMode.on.party})** d=${m84.nearestByMode.on.distance.toFixed(3)}\n\n`;
    md += "Per-candidate ideological-only distances for context:\n\n";
    for (const c of m84.candidates) {
        md += `- ${c.name} (${c.party}): ${c.ideo.toFixed(3)}\n`;
    }
    md += "\n";
}
md += "## Distance distribution\n\n";
md += "| stat | OFF | ON |\n|------|-----|-----|\n";
md += `| min | ${offD[0].toFixed(3)} | ${onD[0].toFixed(3)} |\n`;
md += `| p10 | ${pct(offD, 0.10).toFixed(3)} | ${pct(onD, 0.10).toFixed(3)} |\n`;
md += `| p50 | ${pct(offD, 0.50).toFixed(3)} | ${pct(onD, 0.50).toFixed(3)} |\n`;
md += `| p90 | ${pct(offD, 0.90).toFixed(3)} | ${pct(onD, 0.90).toFixed(3)} |\n`;
md += `| max | ${offD[offD.length - 1].toFixed(3)} | ${onD[onD.length - 1].toFixed(3)} |\n`;
md += `| mean | ${dMean(offD).toFixed(3)} | ${dMean(onD).toFixed(3)} |\n\n`;
md += "The modifier subtracts up to 0.30 from distance, so ON's distribution should shift down by ≤0.30 on average.\n\n";
md += "## Spot-check — 10 flipped pairs\n\n";
md += "| arch | year | OFF nearest | OFF d | ON nearest | ON d | winner |\n|------|------|-------------|-------|------------|------|--------|\n";
for (const r of spots) {
    md += `| ${r.archId} ${r.archName.slice(0, 24)} | ${r.year} | ${r.nearestByMode.off.name} (${r.nearestByMode.off.party[0]}) | ${r.nearestByMode.off.distance.toFixed(2)} | ${r.nearestByMode.on.name} (${r.nearestByMode.on.party[0]}) | ${r.nearestByMode.on.distance.toFixed(2)} | ${WINNERS[r.year]} |\n`;
}
md += "\n";
md += "## Summary\n\n";
md += `- Top-1 accuracy OFF → ON: ${accOff.pct.toFixed(2)}% → ${accOn.pct.toFixed(2)}% (${accDelta >= 0 ? "+" : ""}${accDelta.toFixed(2)} pp)\n`;
md += `- Per-component: econ ${econIsolation >= 0 ? "+" : ""}${econIsolation.toFixed(2)} pp, incumb ${(accIncumb.pct - accOff.pct) >= 0 ? "+" : ""}${(accIncumb.pct - accOff.pct).toFixed(2)} pp, charisma ${charismaIsolation >= 0 ? "+" : ""}${charismaIsolation.toFixed(2)} pp\n`;
md += `- Sanity: OFF ${sanityResults.filter(r => r.offMatch).length}/${sanityResults.length} → ON ${sanityResults.filter(r => r.onMatch).length}/${sanityResults.length}\n`;
md += `- Flips: ${flipsRows.length}/${rows.length} = ${(100 * flipsRows.length / rows.length).toFixed(1)}%\n`;
md += `- Transitions OFF→ON: +${lw} fixed, −${wl} broke, net ${lw - wl >= 0 ? "+" : ""}${lw - wl}\n`;
md += accDelta <= -2
    ? "- **HARD STOP**: accuracy drop ≥ 2 pp; do not enable the feature flag by default\n"
    : charismaIsolation > econIsolation
        ? "- Red flag: charisma-alone moves accuracy more than economic-alone (possible over-weighting)\n"
        : "- Recommend enabling flag by default after doc review\n";
writeFileSync(`${outDir}/regression-results.md`, md);
console.log(`Report written to ${outDir}/regression-results.md`);
console.log(`OFF top-1: ${accOff.pct.toFixed(2)}%  ON top-1: ${accOn.pct.toFixed(2)}%  Δ=${accDelta.toFixed(2)}pp`);
console.log(`Econ-only Δ: ${econIsolation.toFixed(2)}pp  Charisma-only Δ: ${charismaIsolation.toFixed(2)}pp  Incumb-only Δ: ${(accIncumb.pct - accOff.pct).toFixed(2)}pp`);
console.log(`Sanity OFF→ON: ${sanityResults.filter(r => r.offMatch).length}/${sanityResults.length} → ${sanityResults.filter(r => r.onMatch).length}/${sanityResults.length}`);
console.log(`Flips: ${flipsRows.length}/${rows.length} = ${(100 * flipsRows.length / rows.length).toFixed(1)}%`);
//# sourceMappingURL=diagnose-nonideological-layer.js.map