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
import { JURISDICTION_DYSFUNCTION, dysfunctionFactor, } from "./jurisdictions-dysfunction.js";
import { morTargetVectorDistance } from "../engine/math.js";
import { writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
// ── Configuration ───────────────────────────────────────────────────────────
const GAUSSIAN_SIGMA = 2.0; // Tighter σ for more polarized scores (was 2.9, too neutral)
const CONTINUOUS_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S",
    // PF, TRB, ENG excluded — these are structural/meta nodes about identity
    // intensity, not policy content. High PF/TRB means strong partisan/tribal
    // attachment, but says nothing about *which* side — an Evangelical and a
    // Stalinist both have PF=5/TRB=5 for opposite reasons.
];
// 6.E.3b cutover (ADR-006). Continuous nodes whose contribution is folded
// into the compound morBoundaries Layer 1 vector when both sides carry
// the new module. Mirrors archetypeDistance/respondentVoteChoice — we use
// a per-archetype gate instead of removing the node outright, so legacy
// regimes/archetypes without morBoundaries keep their current geometry.
//
// Layer 2 (membership lock-and-key) is intentionally NOT implemented for
// world-map alignment. Per ADR-006, regimes never get Layer 2 — the
// archetype-vs-regime question is structural ("how would this archetype
// fit this society"), not a membership match question. Only candidate
// alignment uses Layer 2.
const MOR_MODULE_LEGACY_NODES = new Set(["MOR"]);
// ── Load all regime periods ─────────────────────────────────────────────────
const ALL_REGIMES = [
    ...EUROPE_PART1,
    ...EUROPE_PART2,
    ...AMERICAS,
    ...ASIA,
    ...MENA_AFRICA,
];
// ── Alignment computation ───────────────────────────────────────────────────
export function computeAlignment(arch, regime) {
    let weightedSumSq = 0;
    let totalWeight = 0;
    // Per-archetype gate: when both sides carry morBoundaries, fold MOR
    // into a single Layer 1 boundary-vector contribution computed below.
    // Otherwise (legacy archetype/regime) the per-node MOR contribution
    // still fires.
    const useMorModule = !!arch.morBoundaries && !!regime.morBoundaries;
    for (const node of CONTINUOUS_NODES) {
        if (useMorModule && MOR_MODULE_LEGACY_NODES.has(node))
            continue;
        const tmpl = arch.nodes[node];
        if (!tmpl || tmpl.kind !== "continuous")
            continue;
        const ct = tmpl;
        const archPos = ct.pos;
        const archSal = Math.max(ct.sal ?? 0, 0.5); // Floor: even low-salience nodes contribute some distance
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
    // ── Compound moral-circle Layer 1 contribution (ADR-006 PR 6.E.3b) ────
    // One boundary-vector term replacing the legacy MOR per-node contribution.
    // morTargetVectorDistance returns ∈ [0,1] over 7 boundaries; we scale to
    // the same 0..4 |posDiff| range used by per-node terms (so the squared
    // contribution matches the 0..16 sumSq range elsewhere in this loop).
    // Salience-equivalent uses the archetype's morBoundaries.intensity (with
    // the same 0.5 floor as per-node archSal) — the analog of "how much does
    // this dimension matter for this archetype." Regime intensity is NOT
    // mixed into the weight: the question is "how relevant is this dimension
    // for this archetype," not "how relevant for the regime."
    //
    // No Layer 2 (membership lock-and-key) for regimes — see top-of-file.
    //
    // Known calibration regression for 6.H to address: bare 7-dim vector
    // averaging produces a ~3× weaker contribution than the legacy single-
    // dimension MOR per-node for cases where one boundary differs strongly
    // (e.g., 001 Rawlsian vs Nazi: legacy MOR contributes ~81 sumSq via
    // diff² + the per-node anti:"low" 1.3× amplifier; bare Layer 1 ~16). For
    // the Rawlsian/National-Protector test pairings the per-node geometry
    // still drives the right direction, but extreme universalist vs
    // exclusionary cases lose magnitude. An anti-mismatch amplifier was
    // drafted in 6.E.3b but pulled (Sam, 2026-05-01) as scope creep — it's
    // a calibration design decision with broad world-map effects (50k pairs)
    // and belongs in its own consciously-reviewed commit, not bundled into a
    // wiring cutover. Defer to 6.H along with the rest of the alignment
    // calibration sweep.
    if (useMorModule) {
        const vd = morTargetVectorDistance(arch.morBoundaries.boundaries, regime.morBoundaries.boundaries);
        const archIntensity = arch.morBoundaries.intensity;
        const archSal = Math.max(archIntensity, 0.5);
        const posDiff = vd * 4; // map [0,1] vector distance into the 0..4 |posDiff| scale
        weightedSumSq += archSal * posDiff * posDiff;
        totalWeight += archSal;
    }
    // Normalized distance (salience-weighted RMS)
    const distance = totalWeight > 0
        ? Math.sqrt(weightedSumSq / totalWeight)
        : 4; // Max distance if no nodes have salience
    // Gaussian support → alignment, then *asymmetric* dysfunction multiplier
    // (PR 5, 2026-04-29). Dysfunction makes "you'd thrive there" harder to
    // claim, but does not soften "you'd find it repugnant." Compresses positive
    // alignment only; negative alignment stays at full magnitude. See
    // src/global/jurisdictions-dysfunction.ts and
    // results/calibration-exceptions/pr5-diagnostic-baseline.md.
    const support = 100 * Math.exp(-Math.pow(distance / GAUSSIAN_SIGMA, 2));
    const dysKey = `${regime.jurisdiction}|${regime.regime}|${regime.startYear}`;
    const dysFactor = dysfunctionFactor(JURISDICTION_DYSFUNCTION[dysKey]);
    const rawAlignment = (support / 50 - 1) * 3;
    const alignment = rawAlignment > 0 ? rawAlignment * dysFactor : rawAlignment;
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
// ESM main guard (PR 6.E.3b): only run the regime-CSV regeneration when
// invoked directly (`node dist/global/build-alignment.js`), NOT when this
// module is imported by tests/smokes that just want the pure helpers.
// Without this guard, `import { computeAlignment } from "..."` triggered
// a 50k-line CSV rewrite as a side effect of module load.
const _isMainEntrypoint = (() => {
    try {
        return process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
    }
    catch {
        return false;
    }
})();
if (_isMainEntrypoint)
    main();
//# sourceMappingURL=build-alignment.js.map