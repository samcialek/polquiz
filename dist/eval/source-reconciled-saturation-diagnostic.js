/**
 * Source-reconciled saturation diagnostic.
 *
 * Tests whether archetype-level winner-take-all saturation is structural or
 * an artifact of population-weight source drift.
 *
 * Diagnostic-only: does not mutate production scoring or candidate profiles.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { getActivationMultiplier } from "../historical/era-activations.js";
import { getNonIdeologicalModifier, historicalToCanonical } from "../historical/non-ideological-modifiers.js";
import { buildPopulationRuntimes, POPULATION_ADAPTER_VARIANTS, writePopulationAdapterAudit, } from "./populationAdapter.js";
const OUT_DIR = join("results", "counterfactuals", "source-reconciled-saturation");
const SOURCE_CSV = join("results", "counterfactuals", "source-1976-2020-president.csv");
const PRESIDENT_RESULTS_URL = "https://huggingface.co/datasets/fdaudens/us-presidential-elections/resolve/main/1976-2020-president.csv?download=true";
const WEIGHT_SOURCES = ["ts_static", "live_output"];
const ADAPTERS = [...POPULATION_ADAPTER_VARIANTS];
const MODERN_YEARS = [1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
const FOCUS_YEARS = [1984, 1988, 2004, 2016, 2024];
const TEMPERATURES = [0.3, 0.5, 0.75, 1.0, 1.5];
const NONIDEO_SCALES = [0, 0.5, 1];
const CANDIDATE_PATCHES = ["canonical", "kerry_harris_moderated"];
const AGGREGATION_MODES = ["winner_take_all", "softmax"];
const SCORING_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB",
];
const CATEGORICAL_NODES = ["EPS", "AES"];
const STYLE_DRIVEN_ELECTIONS = {
    1932: 1.4,
    1960: 1.4,
    1980: 1.5,
    2008: 1.4,
    2016: 2.0,
    2020: 1.7,
    2024: 1.8,
};
const BASE_KERNEL = {
    saliencePower: 2,
    nonIdeoScale: 1,
    partyBase: 0.4,
    clearingScale: 1,
    styleScale: 1,
};
function round(value, digits = 4) {
    const k = 10 ** digits;
    return Math.round(value * k) / k;
}
function csvEscape(value) {
    const s = String(value ?? "");
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}
function writeCsv(path, rows) {
    if (rows.length === 0) {
        writeFileSync(path, "", "utf-8");
        return;
    }
    const headers = Object.keys(rows[0]);
    const lines = [headers.join(","), ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(","))];
    writeFileSync(path, `${lines.join("\n")}\n`, "utf-8");
}
function parseCsv(text) {
    const rows = [];
    let row = [];
    let cell = "";
    let quoted = false;
    for (let i = 0; i < text.length; i++) {
        const ch = text[i];
        const next = text[i + 1];
        if (quoted) {
            if (ch === '"' && next === '"') {
                cell += '"';
                i++;
            }
            else if (ch === '"') {
                quoted = false;
            }
            else {
                cell += ch;
            }
        }
        else if (ch === '"') {
            quoted = true;
        }
        else if (ch === ",") {
            row.push(cell);
            cell = "";
        }
        else if (ch === "\n") {
            row.push(cell);
            rows.push(row);
            row = [];
            cell = "";
        }
        else if (ch !== "\r") {
            cell += ch;
        }
    }
    if (cell.length > 0 || row.length > 0) {
        row.push(cell);
        rows.push(row);
    }
    return rows;
}
async function ensureSourceCsv() {
    mkdirSync(OUT_DIR, { recursive: true });
    if (existsSync(SOURCE_CSV))
        return;
    const res = await fetch(PRESIDENT_RESULTS_URL);
    if (!res.ok)
        throw new Error(`Failed to download president results: ${res.status} ${res.statusText}`);
    writeFileSync(SOURCE_CSV, await res.text(), "utf-8");
}
function loadPresidentRows() {
    const rows = parseCsv(readFileSync(SOURCE_CSV, "utf-8"));
    const headers = rows.shift();
    if (!headers)
        return [];
    return rows
        .filter((row) => row.length === headers.length)
        .map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])));
}
function actualNationalByYear(rows) {
    const byYear = new Map();
    for (const row of rows) {
        const year = Number(row.year);
        const party = row.party_simplified;
        const votes = Number(row.candidatevotes);
        if (!year || !party || !Number.isFinite(votes))
            continue;
        const rec = byYear.get(year) ?? {};
        rec[party] = (rec[party] ?? 0) + votes;
        byYear.set(year, rec);
    }
    byYear.set(2024, { DEMOCRAT: 48.3, REPUBLICAN: 49.8, IS_PERCENT: 1 });
    return byYear;
}
function actualShares(actualByYear, year) {
    const rec = actualByYear.get(year);
    if (!rec)
        return null;
    if (rec.IS_PERCENT) {
        const total = rec.DEMOCRAT + rec.REPUBLICAN;
        return {
            dem: rec.DEMOCRAT / 100,
            rep: rec.REPUBLICAN / 100,
            third: Math.max(0, 1 - (rec.DEMOCRAT + rec.REPUBLICAN) / 100),
            demTwoParty: rec.DEMOCRAT / total,
        };
    }
    const dem = rec.DEMOCRAT ?? 0;
    const rep = rec.REPUBLICAN ?? 0;
    const total = Object.entries(rec)
        .filter(([party]) => party !== "IS_PERCENT")
        .reduce((sum, [, votes]) => sum + votes, 0);
    return total > 0 && dem + rep > 0
        ? { dem: dem / total, rep: rep / total, third: Math.max(0, total - dem - rep) / total, demTwoParty: dem / (dem + rep) }
        : null;
}
function electionForYear(year) {
    const election = ELECTIONS.find((e) => e.year === year);
    if (!election)
        throw new Error(`Missing election ${year}`);
    return election.candidates.map((candidate) => ({ ...candidate }));
}
function patchCandidates(candidates, patch) {
    return candidates.map((candidate) => {
        const c = { ...candidate };
        if (patch === "kerry_harris_moderated" && c.name === "Kerry" && c.year === 2004) {
            c.MAT = 2;
            c.CD = 2;
            c.CU = 4;
            c.MOR = 4;
        }
        if (patch === "kerry_harris_moderated" && c.name === "Harris" && c.year === 2024) {
            c.MAT = 2;
            c.CD = 2;
            c.CU = 4;
            c.MOR = 4;
        }
        return c;
    });
}
function partyBucket(party) {
    if (/democratic|democrat/i.test(party))
        return "D";
    if (/republican|federalist|whig|national republican/i.test(party))
        return "R";
    return "T";
}
function clearingBar(level, scale) {
    const base = level === "apolitical" ? 0.95 : level === "casual" ? 1.4 : level === "engaged" ? 1.7 : 1.85;
    return base * scale;
}
function partyMultiplier(candidateParty, partyID, pfPos, year, partyBase) {
    if (year < 1932 || !partyID || partyID === "I" || partyID === "N")
        return 1;
    const cand = partyBucket(candidateParty);
    const user = partyID === "D" ? "D" : partyID === "R" ? "R" : "T";
    if (cand === user)
        return 1;
    const pf = Math.max(1, Math.min(5, pfPos ?? 3));
    return 1 + partyBase * (pf / 5);
}
function categoricalContribution(candidate, entry, node, year, kernel) {
    if (!entry?.catDist || kernel.styleScale === 0)
        return { contribution: 0, weight: 0 };
    const idx = candidate[node];
    const alignment = entry.catDist[idx] ?? 0;
    const styleEra = STYLE_DRIVEN_ELECTIONS[year] ?? 1;
    const sal = Math.pow(0.6 * styleEra * kernel.styleScale, kernel.saliencePower);
    return { contribution: sal * (1 - alignment) * 4, weight: sal };
}
function scoreCandidate(runtime, candidate, kernel) {
    const ctx = getContext(candidate.year);
    if (!ctx)
        throw new Error(`Missing context ${candidate.year}`);
    let weighted = 0;
    let weight = 0;
    for (const node of SCORING_NODES) {
        const entry = runtime.sig[node];
        if (!entry)
            continue;
        const rawSal = entry.sal * getActivationMultiplier(ctx.year, node);
        const sal = Math.pow(rawSal, kernel.saliencePower);
        const diff = entry.pos - candidate[node];
        weighted += sal * diff * diff;
        weight += sal;
    }
    for (const node of CATEGORICAL_NODES) {
        const c = categoricalContribution(candidate, runtime.sig[node], node, candidate.year, kernel);
        weighted += c.contribution;
        weight += c.weight;
    }
    let distance = weight > 0 ? Math.sqrt(weighted / weight) : 4;
    if (kernel.nonIdeoScale !== 0) {
        distance -= kernel.nonIdeoScale * getNonIdeologicalModifier(candidate.year, historicalToCanonical(candidate.name, candidate.year)).total;
    }
    distance *= partyMultiplier(candidate.party, runtime.partyID, runtime.sig.PF?.pos, candidate.year, kernel.partyBase);
    return { candidate, distance, clearingBar: clearingBar(runtime.engagement, kernel.clearingScale) };
}
function aggregateWinnerTakeAll(runtimes, candidates, kernel) {
    const agg = { dem: 0, rep: 0, third: 0, abstain: 0 };
    for (const runtime of runtimes) {
        const scores = candidates
            .map((candidate) => scoreCandidate(runtime, candidate, kernel))
            .sort((a, b) => a.distance - b.distance);
        const first = scores[0];
        if (first.distance > first.clearingBar) {
            agg.abstain += runtime.weight;
            continue;
        }
        const bucket = partyBucket(first.candidate.party);
        if (bucket === "D")
            agg.dem += runtime.weight;
        else if (bucket === "R")
            agg.rep += runtime.weight;
        else
            agg.third += runtime.weight;
    }
    return agg;
}
function aggregateSoftmax(runtimes, candidates, kernel, temperature) {
    const agg = { dem: 0, rep: 0, third: 0, abstain: 0 };
    for (const runtime of runtimes) {
        const scores = candidates
            .map((candidate) => scoreCandidate(runtime, candidate, kernel))
            .sort((a, b) => a.distance - b.distance);
        const first = scores[0];
        if (first.distance > first.clearingBar) {
            agg.abstain += runtime.weight;
            continue;
        }
        const logits = scores.map((score) => -score.distance / temperature);
        const maxLogit = Math.max(...logits);
        const exps = logits.map((logit) => Math.exp(logit - maxLogit));
        const denom = exps.reduce((sum, value) => sum + value, 0);
        for (let i = 0; i < scores.length; i++) {
            const share = denom > 0 ? exps[i] / denom : 1 / scores.length;
            const bucket = partyBucket(scores[i].candidate.party);
            const w = runtime.weight * share;
            if (bucket === "D")
                agg.dem += w;
            else if (bucket === "R")
                agg.rep += w;
            else
                agg.third += w;
        }
    }
    return agg;
}
function demTwoParty(agg) {
    return agg.dem + agg.rep > 0 ? agg.dem / (agg.dem + agg.rep) : 0;
}
function repTwoParty(agg) {
    return agg.dem + agg.rep > 0 ? agg.rep / (agg.dem + agg.rep) : 0;
}
function aggregate(runtimes, candidates, kernel, mode, temperature) {
    return mode === "winner_take_all"
        ? aggregateWinnerTakeAll(runtimes, candidates, kernel)
        : aggregateSoftmax(runtimes, candidates, kernel, temperature ?? 1);
}
function averageAbs(rows, key) {
    return rows.reduce((sum, row) => sum + Math.abs(Number(row[key])), 0) / (rows.length || 1);
}
function maxAbs(rows, key) {
    return Math.max(...rows.map((row) => Math.abs(Number(row[key]))));
}
function runMatrix(actualByYear) {
    const yearRows = [];
    const summaryRows = [];
    for (const weightSource of WEIGHT_SOURCES) {
        for (const adapter of ADAPTERS) {
            const runtimes = buildPopulationRuntimes(adapter, weightSource);
            for (const candidatePatch of CANDIDATE_PATCHES) {
                for (const nonIdeoScale of NONIDEO_SCALES) {
                    const kernel = { ...BASE_KERNEL, nonIdeoScale };
                    for (const aggregationMode of AGGREGATION_MODES) {
                        const temperatures = aggregationMode === "winner_take_all" ? [null] : TEMPERATURES;
                        for (const temperature of temperatures) {
                            const comboRows = [];
                            for (const year of MODERN_YEARS) {
                                const actual = actualShares(actualByYear, year);
                                if (!actual)
                                    continue;
                                const candidates = patchCandidates(electionForYear(year), candidatePatch);
                                const agg = aggregate(runtimes, candidates, kernel, aggregationMode, temperature);
                                const row = {
                                    weight_source: weightSource,
                                    adapter,
                                    candidate_patch: candidatePatch,
                                    aggregation_mode: aggregationMode,
                                    temperature: temperature ?? "",
                                    nonideo_scale: nonIdeoScale,
                                    year,
                                    predicted_dem_share: round(agg.dem * 100, 3),
                                    predicted_rep_share: round(agg.rep * 100, 3),
                                    predicted_third_share: round(agg.third * 100, 3),
                                    abstain_share: round(agg.abstain * 100, 3),
                                    predicted_dem_two_party: round(demTwoParty(agg) * 100, 3),
                                    predicted_rep_two_party: round(repTwoParty(agg) * 100, 3),
                                    actual_dem_two_party: round(actual.demTwoParty * 100, 3),
                                    dem_two_party_residual: round((demTwoParty(agg) - actual.demTwoParty) * 100, 3),
                                    rep_two_party_residual: round((repTwoParty(agg) - (1 - actual.demTwoParty)) * 100, 3),
                                };
                                yearRows.push(row);
                                comboRows.push(row);
                            }
                            const focus = comboRows.filter((row) => FOCUS_YEARS.includes(Number(row.year)));
                            const modernMae = averageAbs(comboRows, "dem_two_party_residual");
                            const focusMae = averageAbs(focus, "dem_two_party_residual");
                            const row2016 = comboRows.find((row) => Number(row.year) === 2016);
                            const row2004 = comboRows.find((row) => Number(row.year) === 2004);
                            const row2024 = comboRows.find((row) => Number(row.year) === 2024);
                            summaryRows.push({
                                weight_source: weightSource,
                                adapter,
                                candidate_patch: candidatePatch,
                                aggregation_mode: aggregationMode,
                                temperature: temperature ?? "",
                                nonideo_scale: nonIdeoScale,
                                modern_mae: round(modernMae, 3),
                                focus_mae: round(focusMae, 3),
                                max_modern_abs_residual: round(maxAbs(comboRows, "dem_two_party_residual"), 3),
                                residual_2004: row2004?.dem_two_party_residual ?? "",
                                residual_2016: row2016?.dem_two_party_residual ?? "",
                                residual_2024: row2024?.dem_two_party_residual ?? "",
                                pred_2016_dem_two_party: row2016?.predicted_dem_two_party ?? "",
                                pred_2024_dem_two_party: row2024?.predicted_dem_two_party ?? "",
                                pass_modern_mae_6: modernMae <= 6 ? 1 : 0,
                                pass_focus_mae_5: focusMae <= 5 ? 1 : 0,
                                pass_2016_pm2: row2016 && Math.abs(Number(row2016.dem_two_party_residual)) <= 2 ? 1 : 0,
                                pass_no_catastrophic_12: maxAbs(comboRows, "dem_two_party_residual") <= 12 ? 1 : 0,
                            });
                        }
                    }
                }
            }
        }
    }
    return { yearRows, summaryRows };
}
function comboKey(row, omitSource = true) {
    const parts = [
        omitSource ? "" : String(row.weight_source),
        row.adapter,
        row.candidate_patch,
        row.aggregation_mode,
        row.temperature,
        row.nonideo_scale,
    ].filter((part) => part !== "");
    return parts.join("|");
}
function buildSurvivors(summaryRows) {
    const byKey = new Map();
    for (const row of summaryRows) {
        const key = comboKey(row);
        const rows = byKey.get(key) ?? [];
        rows.push(row);
        byKey.set(key, rows);
    }
    const survivors = [];
    for (const [key, rows] of byKey) {
        if (rows.length !== WEIGHT_SOURCES.length)
            continue;
        const survivesBoth = rows.every((row) => Number(row.pass_modern_mae_6) === 1 &&
            Number(row.pass_focus_mae_5) === 1 &&
            Number(row.pass_2016_pm2) === 1 &&
            Number(row.pass_no_catastrophic_12) === 1);
        const looseSurvivesBoth = rows.every((row) => Number(row.focus_mae) <= 6 &&
            Math.abs(Number(row.residual_2016)) <= 3);
        survivors.push({
            key,
            adapter: rows[0].adapter,
            candidate_patch: rows[0].candidate_patch,
            aggregation_mode: rows[0].aggregation_mode,
            temperature: rows[0].temperature,
            nonideo_scale: rows[0].nonideo_scale,
            strict_survives_both_sources: survivesBoth ? 1 : 0,
            loose_survives_both_sources: looseSurvivesBoth ? 1 : 0,
            worst_modern_mae: round(Math.max(...rows.map((row) => Number(row.modern_mae))), 3),
            worst_focus_mae: round(Math.max(...rows.map((row) => Number(row.focus_mae))), 3),
            worst_abs_2016_residual: round(Math.max(...rows.map((row) => Math.abs(Number(row.residual_2016)))), 3),
            worst_max_abs_residual: round(Math.max(...rows.map((row) => Number(row.max_modern_abs_residual))), 3),
            ts_static_focus_mae: rows.find((row) => row.weight_source === "ts_static")?.focus_mae ?? "",
            live_output_focus_mae: rows.find((row) => row.weight_source === "live_output")?.focus_mae ?? "",
            ts_static_2016_residual: rows.find((row) => row.weight_source === "ts_static")?.residual_2016 ?? "",
            live_output_2016_residual: rows.find((row) => row.weight_source === "live_output")?.residual_2016 ?? "",
        });
    }
    return survivors.sort((a, b) => Number(b.strict_survives_both_sources) - Number(a.strict_survives_both_sources) ||
        Number(b.loose_survives_both_sources) - Number(a.loose_survives_both_sources) ||
        Number(a.worst_focus_mae) - Number(b.worst_focus_mae) ||
        Number(a.worst_modern_mae) - Number(b.worst_modern_mae));
}
function summarizeDimension(summaryRows, dimension) {
    const groups = new Map();
    for (const row of summaryRows) {
        const value = String(row[dimension]);
        const rows = groups.get(value) ?? [];
        rows.push(row);
        groups.set(value, rows);
    }
    return [...groups.entries()]
        .map(([value, rows]) => ({
        dimension,
        value,
        rows: rows.length,
        avg_modern_mae: round(rows.reduce((sum, row) => sum + Number(row.modern_mae), 0) / rows.length, 3),
        avg_focus_mae: round(rows.reduce((sum, row) => sum + Number(row.focus_mae), 0) / rows.length, 3),
        avg_abs_2016_residual: round(rows.reduce((sum, row) => sum + Math.abs(Number(row.residual_2016)), 0) / rows.length, 3),
        strict_pass_rows: rows.filter((row) => Number(row.pass_modern_mae_6) === 1 &&
            Number(row.pass_focus_mae_5) === 1 &&
            Number(row.pass_2016_pm2) === 1 &&
            Number(row.pass_no_catastrophic_12) === 1).length,
    }))
        .sort((a, b) => Number(a.avg_focus_mae) - Number(b.avg_focus_mae));
}
function writeReport(summaryRows, survivors, dimensionRows) {
    const best = summaryRows.slice().sort((a, b) => Number(a.focus_mae) - Number(b.focus_mae) ||
        Number(a.modern_mae) - Number(b.modern_mae))[0];
    const strict = survivors.filter((row) => Number(row.strict_survives_both_sources) === 1);
    const loose = survivors.filter((row) => Number(row.loose_survives_both_sources) === 1);
    const softmax = dimensionRows.filter((row) => row.dimension === "aggregation_mode" && row.value === "softmax")[0];
    const wta = dimensionRows.filter((row) => row.dimension === "aggregation_mode" && row.value === "winner_take_all")[0];
    const nonideo = dimensionRows.filter((row) => row.dimension === "nonideo_scale");
    const patch = dimensionRows.filter((row) => row.dimension === "candidate_patch");
    const temp = dimensionRows.filter((row) => row.dimension === "temperature" && row.value !== "");
    const lines = [
        "# Source-Reconciled Saturation Diagnostic",
        "",
        "Diagnostic-only run comparing static TypeScript population weights with live-output population weights.",
        "",
        "## Run Shape",
        "",
        `- Weight sources: ${WEIGHT_SOURCES.join(", ")}`,
        `- Population adapters: ${ADAPTERS.join(", ")}`,
        `- Aggregation modes: winner_take_all plus softmax temperatures ${TEMPERATURES.join(", ")}`,
        `- Non-ideological scales: ${NONIDEO_SCALES.join(", ")}`,
        `- Candidate patches: ${CANDIDATE_PATCHES.join(", ")}`,
        "",
        "## Best Single Row",
        "",
        `Best focus MAE row: source=${best.weight_source}, adapter=${best.adapter}, patch=${best.candidate_patch}, mode=${best.aggregation_mode}, T=${best.temperature || "n/a"}, nonideo=${best.nonideo_scale}, focus MAE=${best.focus_mae}, modern MAE=${best.modern_mae}, 2016 residual=${best.residual_2016}.`,
        "",
        "## Cross-Source Survivors",
        "",
        `Strict survivors across both sources: ${strict.length}.`,
        `Loose survivors across both sources: ${loose.length}.`,
        "",
        "| rank | adapter | patch | mode | T | nonideo | worst focus MAE | worst 2016 abs residual | strict | loose |",
        "|---:|---|---|---|---:|---:|---:|---:|---:|---:|",
        ...survivors.slice(0, 12).map((row, i) => `| ${i + 1} | ${row.adapter} | ${row.candidate_patch} | ${row.aggregation_mode} | ${row.temperature || ""} | ${row.nonideo_scale} | ${row.worst_focus_mae} | ${row.worst_abs_2016_residual} | ${row.strict_survives_both_sources} | ${row.loose_survives_both_sources} |`),
        "",
        "## Dimension Effects",
        "",
        `Aggregation: softmax avg focus MAE ${softmax?.avg_focus_mae ?? "n/a"} vs winner-take-all ${wta?.avg_focus_mae ?? "n/a"}.`,
        `Best non-ideo scale by avg focus MAE: ${nonideo[0]?.value ?? "n/a"} (${nonideo[0]?.avg_focus_mae ?? "n/a"}).`,
        `Candidate patch comparison: ${patch.map((row) => `${row.value}=${row.avg_focus_mae}`).join(", ")} avg focus MAE.`,
        `Best softmax temperature by avg focus MAE: ${temp[0]?.value ?? "n/a"} (${temp[0]?.avg_focus_mae ?? "n/a"}).`,
        "",
        "## Interpretation",
        "",
        strict.length > 0
            ? "At least one setting survives both weight sources under strict gates. Inspect survivor rows before considering production experiments."
            : "No setting survives both weight sources under strict gates. Treat any apparent fix as diagnostic until the failure mode is narrowed further.",
        "",
        "If softmax rows dominate the survivor table across both sources, saturation is structural. If only one source passes, source drift is load-bearing.",
        "",
    ];
    writeFileSync(join(OUT_DIR, "source-reconciled-saturation-report.md"), lines.join("\n"), "utf-8");
}
async function main() {
    mkdirSync(OUT_DIR, { recursive: true });
    await ensureSourceCsv();
    writePopulationAdapterAudit(join(OUT_DIR, "population-adapter-audit-by-source.json"), ["ts_static", "live_output"]);
    const actualByYear = actualNationalByYear(loadPresidentRows());
    const { yearRows, summaryRows } = runMatrix(actualByYear);
    const survivors = buildSurvivors(summaryRows);
    const dimensions = [
        "weight_source",
        "adapter",
        "candidate_patch",
        "aggregation_mode",
        "temperature",
        "nonideo_scale",
    ];
    const dimensionRows = dimensions.flatMap((dimension) => summarizeDimension(summaryRows, dimension));
    writeCsv(join(OUT_DIR, "source-reconciled-year-residuals.csv"), yearRows);
    writeCsv(join(OUT_DIR, "source-reconciled-saturation-matrix.csv"), summaryRows);
    writeCsv(join(OUT_DIR, "source-reconciled-survivors.csv"), survivors);
    writeCsv(join(OUT_DIR, "source-reconciled-dimension-effects.csv"), dimensionRows);
    writeReport(summaryRows, survivors, dimensionRows);
    const best = summaryRows.slice().sort((a, b) => Number(a.focus_mae) - Number(b.focus_mae) ||
        Number(a.modern_mae) - Number(b.modern_mae))[0];
    console.log(JSON.stringify({
        out_dir: OUT_DIR,
        year_rows: yearRows.length,
        summary_rows: summaryRows.length,
        strict_survivors: survivors.filter((row) => Number(row.strict_survives_both_sources) === 1).length,
        loose_survivors: survivors.filter((row) => Number(row.loose_survives_both_sources) === 1).length,
        best,
    }, null, 2));
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=source-reconciled-saturation-diagnostic.js.map