/**
 * Diagnostic report for the respondent-signature election prediction pipeline.
 *
 * Runs five tests against every active archetype × every US election:
 *   A. Distance distribution — histogram of nearest-candidate distances, to
 *      sanity-check clearing-bar thresholds
 *   B. Era-transformation impact — how often the era-weighted salience blend
 *      flips the nearest candidate vs. archetype-salience only
 *   C. Engagement-threshold turnout — vote rate by engagement level
 *   D. Per-election candidate separation — which elections are landslides vs
 *      close calls in signature distance units
 *   E. Historical sanity check — known archetypes land on plausible candidates
 *
 * Writes results/election-pipeline-diagnostic.md.
 *
 *   npx tsx src/eval/diagnose-election-pipeline.ts
 */
import { writeFileSync, mkdirSync, existsSync } from "node:fs";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
const ENGAGEMENT_LEVELS = [
    "apolitical", "casual", "engaged", "highly-engaged",
];
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
// ── Distance variants ──────────────────────────────────────────────────────
// Replicate predictVote's inner distance function with a switch for era
// weighting so we can measure its effect (Test B).
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
function distancesForElection(sig, candidates, ctx) {
    return candidates.map(c => {
        const flat = unweightedDistance(sig, c);
        const pred = predictVote(sig, [c], ctx, "engaged");
        return { name: c.name, distEra: pred.candidates[0].distance, distFlat: flat };
    });
}
const rows = [];
for (const arch of ARCHETYPES) {
    const sig = archetypeToSignature(arch);
    for (const election of ELECTIONS) {
        const ctx = getContext(election.year);
        if (!ctx)
            continue;
        const scored = distancesForElection(sig, election.candidates, ctx);
        const nearestEra = scored.reduce((a, b) => a.distEra <= b.distEra ? a : b);
        const nearestFlat = scored.reduce((a, b) => a.distFlat <= b.distFlat ? a : b);
        const decisionByEng = {
            "apolitical": "abstain", "casual": "abstain",
            "engaged": "abstain", "highly-engaged": "abstain",
        };
        for (const lvl of ENGAGEMENT_LEVELS) {
            const p = predictVote(sig, election.candidates, ctx, lvl);
            decisionByEng[lvl] = p.decision;
        }
        const candidatesWithParty = election.candidates.map((c, i) => ({
            name: c.name,
            party: c.party,
            distEra: scored[i].distEra,
            distFlat: scored[i].distFlat,
        }));
        rows.push({
            year: election.year,
            archId: arch.id,
            archName: arch.name,
            candidates: candidatesWithParty,
            nearestEra: { name: nearestEra.name, distance: nearestEra.distEra },
            nearestFlat: { name: nearestFlat.name, distance: nearestFlat.distFlat },
            nearestFlipped: nearestEra.name !== nearestFlat.name,
            decisionByEng,
        });
    }
}
// ── Test A: distance distribution ─────────────────────────────────────────
const distances = rows.map(r => r.nearestEra.distance);
const distMean = distances.reduce((a, b) => a + b, 0) / distances.length;
const distSorted = [...distances].sort((a, b) => a - b);
const pct = (p) => distSorted[Math.floor(p * distSorted.length)];
const distP10 = pct(0.10), distP25 = pct(0.25), distP50 = pct(0.50);
const distP75 = pct(0.75), distP90 = pct(0.90), distP99 = pct(0.99);
const distMin = distSorted[0], distMax = distSorted[distSorted.length - 1];
const distStd = Math.sqrt(distances.reduce((s, d) => s + (d - distMean) * (d - distMean), 0) / distances.length);
// Histogram bins 0-4 step 0.25
const histBins = [];
for (let lo = 0; lo < 4; lo += 0.25) {
    const count = distances.filter(d => d >= lo && d < lo + 0.25).length;
    histBins.push(count);
}
// ── Test B: era-transformation impact ─────────────────────────────────────
const flippedRows = rows.filter(r => r.nearestFlipped);
const flipRate = flippedRows.length / rows.length;
const shiftMeans = [];
for (const r of rows) {
    for (const c of r.candidates) {
        shiftMeans.push(c.distEra - c.distFlat);
    }
}
const shiftMean = shiftMeans.reduce((a, b) => a + b, 0) / shiftMeans.length;
const shiftAbs = shiftMeans.map(Math.abs);
const shiftAbsMean = shiftAbs.reduce((a, b) => a + b, 0) / shiftAbs.length;
const shiftAbsMax = Math.max(...shiftAbs);
// Flips grouped by era
const flipsByYear = new Map();
const totalByYear = new Map();
for (const r of rows) {
    totalByYear.set(r.year, (totalByYear.get(r.year) ?? 0) + 1);
    if (r.nearestFlipped) {
        flipsByYear.set(r.year, (flipsByYear.get(r.year) ?? 0) + 1);
    }
}
const topFlipYears = [...flipsByYear.entries()]
    .map(([y, c]) => ({ year: y, flips: c, total: totalByYear.get(y) ?? 0, rate: c / (totalByYear.get(y) ?? 1) }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 10);
// ── Test C: engagement-threshold turnout ──────────────────────────────────
const turnoutByEng = {
    "apolitical": 0, "casual": 0, "engaged": 0, "highly-engaged": 0,
};
for (const r of rows) {
    for (const lvl of ENGAGEMENT_LEVELS) {
        if (r.decisionByEng[lvl] === "vote")
            turnoutByEng[lvl]++;
    }
}
const turnoutRate = {
    "apolitical": turnoutByEng.apolitical / rows.length,
    "casual": turnoutByEng.casual / rows.length,
    "engaged": turnoutByEng.engaged / rows.length,
    "highly-engaged": turnoutByEng["highly-engaged"] / rows.length,
};
// Turnout by era — aggregate by year
const turnoutByYear = {};
const archCountByYear = {};
for (const r of rows) {
    const y = String(r.year);
    if (!turnoutByYear[y]) {
        turnoutByYear[y] = { "apolitical": 0, "casual": 0, "engaged": 0, "highly-engaged": 0 };
        archCountByYear[y] = 0;
    }
    archCountByYear[y]++;
    for (const lvl of ENGAGEMENT_LEVELS) {
        if (r.decisionByEng[lvl] === "vote")
            turnoutByYear[y][lvl]++;
    }
}
// ── Test D: per-election candidate separation ─────────────────────────────
// For each election, measure how separated the candidates are across the
// archetype distribution — mean gap between nearest and runner-up.
const separationByYear = [];
for (const election of ELECTIONS) {
    const rowsForYear = rows.filter(r => r.year === election.year);
    if (rowsForYear.length === 0)
        continue;
    const gaps = [];
    const nearests = [];
    const runnerUps = [];
    for (const r of rowsForYear) {
        const sorted = [...r.candidates].sort((a, b) => a.distEra - b.distEra);
        nearests.push(sorted[0].distEra);
        if (sorted.length >= 2) {
            runnerUps.push(sorted[1].distEra);
            gaps.push(sorted[1].distEra - sorted[0].distEra);
        }
    }
    separationByYear.push({
        year: election.year,
        meanGap: gaps.length ? gaps.reduce((a, b) => a + b, 0) / gaps.length : 0,
        meanNearest: nearests.reduce((a, b) => a + b, 0) / nearests.length,
        meanRunnerUp: runnerUps.length ? runnerUps.reduce((a, b) => a + b, 0) / runnerUps.length : 0,
        nCandidates: election.candidates.length,
    });
}
const byGapAsc = [...separationByYear].sort((a, b) => a.meanGap - b.meanGap);
const closestElections = byGapAsc.slice(0, 8);
const blowoutElections = [...byGapAsc].reverse().slice(0, 8);
// ── Test E: historical sanity check ───────────────────────────────────────
// Pick a handful of archetypes with well-understood political leans and check
// that the 2020 and 2024 nearest candidate matches the expected party.
const SANITY_CHECKS = [
    { id: "001", year: 2020, expectParty: "Democratic", note: "Rawlsian Reformer → Biden" },
    { id: "001", year: 2024, expectParty: "Democratic", note: "Rawlsian Reformer → Harris" },
    { id: "001", year: 1984, expectParty: "Democratic", note: "Rawlsian Reformer → Mondale" },
    { id: "001", year: 1964, expectParty: "Democratic", note: "Rawlsian Reformer → Johnson" },
    { id: "092", year: 2016, expectParty: "Republican", note: "Partisan Tribalist (TRB=5,PF=5) → Trump" },
    { id: "092", year: 2020, expectParty: "Republican", note: "Partisan Tribalist → Trump" },
    { id: "092", year: 2024, expectParty: "Republican", note: "Partisan Tribalist → Trump" },
    { id: "020", year: 2020, expectParty: "Democratic", note: "Lefty → Biden" },
    { id: "020", year: 1972, expectParty: "Democratic", note: "Lefty → McGovern" },
    { id: "060", year: 1980, expectParty: "Republican", note: "Conservative → Reagan" },
    { id: "060", year: 1984, expectParty: "Republican", note: "Conservative → Reagan" },
];
const sanityResults = SANITY_CHECKS.map(chk => {
    const row = rows.find(r => r.archId === chk.id && r.year === chk.year);
    if (!row)
        return { ...chk, actual: "(no row)", distance: NaN, match: false };
    const cand = row.candidates.find(c => c.name === row.nearestEra.name);
    const party = cand?.party ?? "?";
    return {
        ...chk,
        actual: `${row.nearestEra.name} (${party})`,
        distance: row.nearestEra.distance,
        match: party === chk.expectParty,
    };
});
// ── Archetype-level vote rate by engagement (distribution) ────────────────
const archVoteRates = {};
for (const arch of ARCHETYPES) {
    archVoteRates[arch.id] = { "apolitical": 0, "casual": 0, "engaged": 0, "highly-engaged": 0 };
    const archRows = rows.filter(r => r.archId === arch.id);
    for (const lvl of ENGAGEMENT_LEVELS) {
        const votes = archRows.filter(r => r.decisionByEng[lvl] === "vote").length;
        archVoteRates[arch.id][lvl] = archRows.length ? votes / archRows.length : 0;
    }
}
const lowVoteArchs = ARCHETYPES
    .filter(a => archVoteRates[a.id].engaged < 0.7)
    .map(a => ({ id: a.id, name: a.name, rate: archVoteRates[a.id].engaged }))
    .sort((a, b) => a.rate - b.rate)
    .slice(0, 10);
const highVoteArchs = ARCHETYPES
    .map(a => ({ id: a.id, name: a.name, rate: archVoteRates[a.id].engaged }))
    .sort((a, b) => b.rate - a.rate)
    .slice(0, 10);
// ── Format report ─────────────────────────────────────────────────────────
const outDir = "results";
if (!existsSync(outDir))
    mkdirSync(outDir, { recursive: true });
let md = "";
md += "# Election Prediction Pipeline — Diagnostic Report\n\n";
md += `_Generated: ${new Date().toISOString()}_\n`;
md += `_Archetypes: ${ARCHETYPES.length} · Elections: ${ELECTIONS.length} · Rows: ${rows.length}_\n\n`;
md += "## Pipeline recap\n\n";
md += "- Respondent's 11-node signature (MAT, CD, CU, MOR, PRO, COM, ZS, ONT_H, ONT_S, PF, TRB)\n";
md += "- Each node contributes `sal × (pos - candPos)²` to weighted sum of squares\n";
md += "- Salience blended as `effectiveSal = 0.6·sigSal + 0.4·eraSal` where `eraSal = clamp((eraWeight−0.5)·2, 0, 3)`\n";
md += "- Final distance is `√(Σ effectiveSal·diff² / Σ effectiveSal)` → weighted RMS, bounded [0, 4]\n";
md += "- Vote if `nearest.distance ≤ clearingBar[engagementLevel]`\n";
md += "- Clearing bars: apolitical=0.75, casual=1.75, engaged=2.75, highly-engaged=3.75\n\n";
md += "## Test A — Distance distribution (nearest candidate, all rows)\n\n";
md += `| stat | value |\n|------|-------|\n`;
md += `| rows | ${rows.length} |\n`;
md += `| min | ${distMin.toFixed(3)} |\n`;
md += `| p10 | ${distP10.toFixed(3)} |\n`;
md += `| p25 | ${distP25.toFixed(3)} |\n`;
md += `| median | ${distP50.toFixed(3)} |\n`;
md += `| p75 | ${distP75.toFixed(3)} |\n`;
md += `| p90 | ${distP90.toFixed(3)} |\n`;
md += `| p99 | ${distP99.toFixed(3)} |\n`;
md += `| max | ${distMax.toFixed(3)} |\n`;
md += `| mean | ${distMean.toFixed(3)} |\n`;
md += `| std | ${distStd.toFixed(3)} |\n\n`;
md += "### Histogram (bin width 0.25)\n\n";
md += "```\n";
for (let i = 0; i < histBins.length; i++) {
    const lo = i * 0.25;
    const hi = lo + 0.25;
    const bar = "#".repeat(Math.round((histBins[i] / rows.length) * 300));
    md += `${lo.toFixed(2)}-${hi.toFixed(2)} | ${String(histBins[i]).padStart(5)} | ${bar}\n`;
}
md += "```\n\n";
md += "### Clearing-bar implication\n\n";
md += `- rows with nearest ≤ 0.75 (apolitical bar): ${distances.filter(d => d <= 0.75).length} / ${rows.length} (${(100 * distances.filter(d => d <= 0.75).length / rows.length).toFixed(1)}%)\n`;
md += `- rows with nearest ≤ 1.75 (casual bar): ${distances.filter(d => d <= 1.75).length} / ${rows.length} (${(100 * distances.filter(d => d <= 1.75).length / rows.length).toFixed(1)}%)\n`;
md += `- rows with nearest ≤ 2.75 (engaged bar): ${distances.filter(d => d <= 2.75).length} / ${rows.length} (${(100 * distances.filter(d => d <= 2.75).length / rows.length).toFixed(1)}%)\n`;
md += `- rows with nearest ≤ 3.75 (highly-engaged bar): ${distances.filter(d => d <= 3.75).length} / ${rows.length} (${(100 * distances.filter(d => d <= 3.75).length / rows.length).toFixed(1)}%)\n\n`;
md += "## Test B — Era-transformation impact\n\n";
md += `- Flip rate (nearest-candidate changes under era weighting): **${(flipRate * 100).toFixed(1)}%** of ${rows.length} rows\n`;
md += `- Mean distance shift (era − flat): ${shiftMean.toFixed(4)}\n`;
md += `- Mean absolute shift: ${shiftAbsMean.toFixed(4)}\n`;
md += `- Max absolute shift: ${shiftAbsMax.toFixed(4)}\n\n`;
md += "### Years with highest flip rate\n\n";
md += "| year | flips | total rows | rate |\n|------|-------|------------|------|\n";
for (const r of topFlipYears) {
    md += `| ${r.year} | ${r.flips} | ${r.total} | ${(r.rate * 100).toFixed(1)}% |\n`;
}
md += "\n";
md += "## Test C — Engagement-level turnout\n\n";
md += "| engagement | vote-rate across (archetype × election) |\n|------------|-----------------------------------------|\n";
for (const lvl of ENGAGEMENT_LEVELS) {
    md += `| ${lvl} | ${(turnoutRate[lvl] * 100).toFixed(1)}% |\n`;
}
md += "\n";
md += "### Turnout by year (engaged level, first/last 5 elections)\n\n";
const yearsSorted = ELECTIONS.map(e => e.year).sort((a, b) => a - b);
md += "| year | engaged turnout |\n|------|-----------------|\n";
for (const y of [...yearsSorted.slice(0, 5), ...yearsSorted.slice(-5)]) {
    const k = String(y);
    if (!turnoutByYear[k])
        continue;
    const rate = turnoutByYear[k].engaged / (archCountByYear[k] || 1);
    md += `| ${y} | ${(rate * 100).toFixed(1)}% |\n`;
}
md += "\n";
md += "### Low-turnout archetypes at 'engaged' level\n\n";
md += "| arch | name | engaged turnout |\n|------|------|-----------------|\n";
for (const r of lowVoteArchs) {
    md += `| ${r.id} | ${r.name} | ${(r.rate * 100).toFixed(1)}% |\n`;
}
md += "\n";
md += "### High-turnout archetypes at 'engaged' level (should be near 100%)\n\n";
md += "| arch | name | engaged turnout |\n|------|------|-----------------|\n";
for (const r of highVoteArchs) {
    md += `| ${r.id} | ${r.name} | ${(r.rate * 100).toFixed(1)}% |\n`;
}
md += "\n";
md += "## Test D — Per-election candidate separation\n\n";
md += "### Closest races (smallest mean gap between nearest and runner-up)\n\n";
md += "| year | mean nearest | mean runner-up | mean gap | # candidates |\n|------|--------------|----------------|----------|--------------|\n";
for (const r of closestElections) {
    md += `| ${r.year} | ${r.meanNearest.toFixed(3)} | ${r.meanRunnerUp.toFixed(3)} | ${r.meanGap.toFixed(3)} | ${r.nCandidates} |\n`;
}
md += "\n### Blowouts (largest mean gap — most decisive)\n\n";
md += "| year | mean nearest | mean runner-up | mean gap | # candidates |\n|------|--------------|----------------|----------|--------------|\n";
for (const r of blowoutElections) {
    md += `| ${r.year} | ${r.meanNearest.toFixed(3)} | ${r.meanRunnerUp.toFixed(3)} | ${r.meanGap.toFixed(3)} | ${r.nCandidates} |\n`;
}
md += "\n";
md += "## Test E — Historical sanity check\n\n";
const passes = sanityResults.filter(r => r.match).length;
md += `${passes}/${sanityResults.length} checks passed.\n\n`;
md += "| arch | year | expected | actual | distance | pass |\n|------|------|----------|--------|----------|------|\n";
for (const r of sanityResults) {
    const distStr = Number.isFinite(r.distance) ? r.distance.toFixed(3) : "—";
    md += `| ${r.id} | ${r.year} | ${r.expectParty} | ${r.actual} | ${distStr} | ${r.match ? "✓" : "✗"} |\n`;
}
md += "\n*(Note column):*\n\n";
for (const r of sanityResults) {
    md += `- ${r.id} @ ${r.year}: ${r.note}\n`;
}
md += "\n";
// ── Drill-downs ──────────────────────────────────────────────────────────
// Show the full candidate distance ranking for (a) the one sanity-check miss
// and (b) the suspicious 1980 "close race" entry so we can see what's
// driving them.
md += "## Drill-downs\n\n";
const drillTargets = [];
const failing = sanityResults.find(r => !r.match);
if (failing) {
    drillTargets.push({
        archId: failing.id,
        year: failing.year,
        reason: `sanity fail (expected ${failing.expectParty}, got ${failing.actual})`,
    });
}
// Also pull the closest-race years for drill-down, excluding 1-candidate elections
for (const e of closestElections.filter(x => x.nCandidates > 1).slice(0, 3)) {
    drillTargets.push({ archId: "001", year: e.year, reason: `close race investigation (001 in ${e.year})` });
}
for (const t of drillTargets) {
    const row = rows.find(r => r.archId === t.archId && r.year === t.year);
    if (!row)
        continue;
    md += `### ${t.archId} @ ${t.year} — ${t.reason}\n\n`;
    md += `archetype: **${row.archName}**\n\n`;
    const sorted = [...row.candidates].sort((a, b) => a.distEra - b.distEra);
    md += "| candidate | party | dist (era) | dist (flat) | Δ |\n|-----------|-------|------------|-------------|---|\n";
    for (const c of sorted) {
        md += `| ${c.name} | ${c.party} | ${c.distEra.toFixed(3)} | ${c.distFlat.toFixed(3)} | ${(c.distEra - c.distFlat).toFixed(3)} |\n`;
    }
    const gap = sorted.length >= 2 ? sorted[1].distEra - sorted[0].distEra : 0;
    md += `\nnearest gap: ${gap.toFixed(3)}\n\n`;
}
// ── Recalibration recommendation ──────────────────────────────────────────
md += "## Recalibration recommendation\n\n";
md += "Current bars set the cut-points symmetrically every 1.0 distance unit, without reference to the empirical distribution. Based on Test A quantiles:\n\n";
md += `- p10 = ${distP10.toFixed(3)}, p25 = ${distP25.toFixed(3)}, p50 = ${distP50.toFixed(3)}, p75 = ${distP75.toFixed(3)}, p90 = ${distP90.toFixed(3)}\n\n`;
md += "Better-calibrated clearing bars (mapping each engagement level to a target quantile of the nearest-distance distribution):\n\n";
md += "| engagement | current | recommended | target quantile |\n|------------|---------|-------------|-----------------|\n";
md += `| apolitical | 0.75 | ${distP10.toFixed(2)} | p10 (bottom 10%) |\n`;
md += `| casual | 1.75 | ${distP50.toFixed(2)} | p50 (median) |\n`;
md += `| engaged | 2.75 | ${distP90.toFixed(2)} | p90 (top 10% abstain) |\n`;
md += `| highly-engaged | 3.75 | ${(distMax + 0.1).toFixed(2)} | max + ε (always vote) |\n\n`;
md += "This lines up turnout at apolitical ≈ 10%, casual ≈ 50%, engaged ≈ 90%, highly-engaged ≈ 100%.\n\n";
// Simulate the what-if turnout under recalibrated bars
const RECAL_BARS = {
    "apolitical": distP10,
    "casual": distP50,
    "engaged": distP90,
    "highly-engaged": distMax + 0.1,
};
const recalTurnout = {
    "apolitical": 0, "casual": 0, "engaged": 0, "highly-engaged": 0,
};
for (const r of rows) {
    for (const lvl of ENGAGEMENT_LEVELS) {
        if (r.nearestEra.distance <= RECAL_BARS[lvl])
            recalTurnout[lvl]++;
    }
}
md += "### What-if: turnout under recalibrated bars\n\n";
md += "| engagement | recal bar | turnout |\n|------------|-----------|---------|\n";
for (const lvl of ENGAGEMENT_LEVELS) {
    md += `| ${lvl} | ${RECAL_BARS[lvl].toFixed(3)} | ${(100 * recalTurnout[lvl] / rows.length).toFixed(1)}% |\n`;
}
md += "\n";
md += "## Interpretation notes\n\n";
md += "- **Clearing bars** are a first-pass calibration. If Test A's p50 is X, then ~50% of archetypes vote at engagement levels with clearing bar > X. Levels should land roughly at: apolitical ≈ bottom 10% of rows, casual ≈ bottom 40%, engaged ≈ bottom 75%, highly-engaged ≈ ~100%.\n";
md += "- **Era weighting** is dampening — if flip rate is very low, ERA_ALPHA could be increased from 0.4 to pull signatures harder toward era-relevant axes.\n";
md += "- **Engagement turnout** should be monotonically increasing. If an archetype votes at apolitical but abstains at engaged, something's wrong (can't happen given fixed bar < bar).\n";
md += "- **Closest races** should align with historical nail-biters (1796, 1800, 1824, 1876, 1888, 1960, 2000, 2020). If 1980 appears as close, calibration is off.\n";
md += "- **Post-1940 candidate profiles** are richer than pre-1940 (13 nodes vs ~4-6 populated). Mean-gap comparisons across eras should account for this.\n";
writeFileSync(`${outDir}/election-pipeline-diagnostic.md`, md);
console.log(`Report written to ${outDir}/election-pipeline-diagnostic.md`);
console.log(`\nSummary:`);
console.log(`  Rows: ${rows.length}`);
console.log(`  Median nearest-distance: ${distP50.toFixed(3)}`);
console.log(`  Flip rate (era vs flat): ${(flipRate * 100).toFixed(1)}%`);
console.log(`  Turnout @ apolitical/casual/engaged/highly-engaged: ${(turnoutRate.apolitical * 100).toFixed(1)}% / ${(turnoutRate.casual * 100).toFixed(1)}% / ${(turnoutRate.engaged * 100).toFixed(1)}% / ${(turnoutRate["highly-engaged"] * 100).toFixed(1)}%`);
console.log(`  Sanity checks passed: ${passes}/${sanityResults.length}`);
//# sourceMappingURL=diagnose-election-pipeline.js.map