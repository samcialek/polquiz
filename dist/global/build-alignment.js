/**
 * Global Regime Alignment Builder
 *
 * Computes alignment scores for all 130 archetypes against all ~370
 * historical regime periods across 47 jurisdictions (1789-2026).
 *
 * Formula (adapted from regime-alignment.ts):
 *   distance  = sqrt( Σ(sal_i × (archPos_i - regimePos_i)²) / Σ(sal_i) )
 *   support   = 100 × exp(-(distance / σ)²)
 *   alignment = (support / 50 - 1) × 3          // Maps to -3 … +3
 *
 * Outputs:
 *   global/regime-profiles.csv   — flat list of all regime periods with node values
 *   global/regime-alignment.csv  — archetype × regime alignment scores
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { EUROPE_PART1 } from "./jurisdictions-europe1.js";
import { EUROPE_PART2 } from "./jurisdictions-europe2.js";
import { AMERICAS } from "./jurisdictions-americas.js";
import { ASIA } from "./jurisdictions-asia.js";
import { MENA_AFRICA } from "./jurisdictions-mena.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
// ── Configuration ───────────────────────────────────────────────────────────
const GAUSSIAN_SIGMA = 2.9; // Same σ as regime-alignment.ts
const CONTINUOUS_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB",
    // ENG excluded — engagement is emergent, not a trait
];
// ── Load all regime periods ─────────────────────────────────────────────────
const ALL_REGIMES = [
    ...EUROPE_PART1,
    ...EUROPE_PART2,
    ...AMERICAS,
    ...ASIA,
    ...MENA_AFRICA,
];
// ── Alignment computation ───────────────────────────────────────────────────
function computeAlignment(arch, regime) {
    let weightedSumSq = 0;
    let totalWeight = 0;
    for (const node of CONTINUOUS_NODES) {
        const tmpl = arch.nodes[node];
        if (!tmpl || tmpl.kind !== "continuous")
            continue;
        const ct = tmpl;
        const archPos = ct.pos;
        const archSal = ct.sal; // 0-3
        const regimePos = regime[node];
        if (regimePos == null)
            continue;
        // Anti-position penalty
        let antiMultiplier = 1.0;
        if (ct.anti) {
            const diff = Math.abs(archPos - regimePos);
            if (diff >= 3)
                antiMultiplier = 1.3;
            else if (diff >= 2)
                antiMultiplier = 1.1;
        }
        const posDiff = Math.abs(archPos - regimePos) * antiMultiplier;
        weightedSumSq += archSal * posDiff * posDiff;
        totalWeight += archSal;
    }
    // Normalized distance (salience-weighted RMS)
    const distance = totalWeight > 0
        ? Math.sqrt(weightedSumSq / totalWeight)
        : 4; // Max distance if no nodes have salience
    // Gaussian support → alignment
    const support = 100 * Math.exp(-Math.pow(distance / GAUSSIAN_SIGMA, 2));
    const alignment = (support / 50 - 1) * 3;
    return Math.max(-3, Math.min(3, +alignment.toFixed(3)));
}
// ── CSV builders ────────────────────────────────────────────────────────────
function buildRegimeProfilesCsv() {
    const header = [
        "jurisdiction", "regime", "startYear", "endYear",
        "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
        "ONT_H", "ONT_S", "PF", "TRB", "ENG", "EPS", "AES",
        "description",
    ].join(",");
    const rows = ALL_REGIMES.map(r => [
        csvQuote(r.jurisdiction),
        csvQuote(r.regime),
        r.startYear,
        r.endYear,
        r.MAT, r.CD, r.CU, r.MOR, r.PRO, r.COM, r.ZS,
        r.ONT_H, r.ONT_S, r.PF, r.TRB, r.ENG, r.EPS, r.AES,
        csvQuote(r.description),
    ].join(","));
    return [header, ...rows].join("\n");
}
function buildAlignmentCsv() {
    // Header: archetype_id, archetype_name, then one column per regime
    const regimeKeys = ALL_REGIMES.map(r => `${r.jurisdiction}|${r.regime} (${r.startYear}-${r.endYear})`);
    const header = ["archetype_id", "archetype_name", ...regimeKeys.map(csvQuote)].join(",");
    const rows = ARCHETYPES.map(arch => {
        const scores = ALL_REGIMES.map(regime => computeAlignment(arch, regime));
        return [
            arch.id,
            csvQuote(arch.name),
            ...scores.map(s => s.toFixed(3)),
        ].join(",");
    });
    return [header, ...rows].join("\n");
}
/** Also build a long-form CSV (archetype_id, regime_key, alignment) for easier analysis */
function buildAlignmentLongCsv() {
    const header = [
        "archetype_id", "archetype_name",
        "jurisdiction", "regime", "startYear", "endYear",
        "alignment",
    ].join(",");
    const rows = [];
    for (const arch of ARCHETYPES) {
        for (const regime of ALL_REGIMES) {
            const score = computeAlignment(arch, regime);
            rows.push([
                arch.id,
                csvQuote(arch.name),
                csvQuote(regime.jurisdiction),
                csvQuote(regime.regime),
                regime.startYear,
                regime.endYear,
                score.toFixed(3),
            ].join(","));
        }
    }
    return [header, ...rows].join("\n");
}
function csvQuote(s) {
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}
// ── Main ────────────────────────────────────────────────────────────────────
function main() {
    const outDir = join(process.cwd(), "global");
    mkdirSync(outDir, { recursive: true });
    console.log(`Loaded ${ALL_REGIMES.length} regime periods across ${new Set(ALL_REGIMES.map(r => r.jurisdiction)).size} jurisdictions`);
    console.log(`Loaded ${ARCHETYPES.length} archetypes`);
    console.log(`Computing ${ALL_REGIMES.length * ARCHETYPES.length} alignment scores...`);
    // 1. Regime profiles
    const profilesCsv = buildRegimeProfilesCsv();
    writeFileSync(join(outDir, "regime-profiles.csv"), profilesCsv);
    console.log(`  → regime-profiles.csv (${ALL_REGIMES.length} rows)`);
    // 2. Wide-form alignment matrix
    const alignmentCsv = buildAlignmentCsv();
    writeFileSync(join(outDir, "regime-alignment.csv"), alignmentCsv);
    console.log(`  → regime-alignment.csv (${ARCHETYPES.length} rows × ${ALL_REGIMES.length} regime columns)`);
    // 3. Long-form alignment (easier for analysis)
    const longCsv = buildAlignmentLongCsv();
    writeFileSync(join(outDir, "regime-alignment-long.csv"), longCsv);
    console.log(`  → regime-alignment-long.csv (${ARCHETYPES.length * ALL_REGIMES.length} rows)`);
    // 4. Summary stats
    let minScore = Infinity, maxScore = -Infinity;
    let totalPositive = 0, totalNegative = 0, totalNeutral = 0;
    const allScores = [];
    for (const arch of ARCHETYPES) {
        for (const regime of ALL_REGIMES) {
            const s = computeAlignment(arch, regime);
            allScores.push(s);
            if (s < minScore)
                minScore = s;
            if (s > maxScore)
                maxScore = s;
            if (s > 0.5)
                totalPositive++;
            else if (s < -0.5)
                totalNegative++;
            else
                totalNeutral++;
        }
    }
    const mean = allScores.reduce((a, b) => a + b, 0) / allScores.length;
    const sorted = [...allScores].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)];
    console.log(`\nSummary statistics:`);
    console.log(`  Score range: ${minScore.toFixed(3)} to ${maxScore.toFixed(3)}`);
    console.log(`  Mean: ${mean.toFixed(3)}, Median: ${median.toFixed(3)}`);
    console.log(`  Positive (>0.5): ${totalPositive} (${(100 * totalPositive / allScores.length).toFixed(1)}%)`);
    console.log(`  Neutral (-0.5..0.5): ${totalNeutral} (${(100 * totalNeutral / allScores.length).toFixed(1)}%)`);
    console.log(`  Negative (<-0.5): ${totalNegative} (${(100 * totalNegative / allScores.length).toFixed(1)}%)`);
    console.log(`\nDone.`);
}
main();
//# sourceMappingURL=build-alignment.js.map