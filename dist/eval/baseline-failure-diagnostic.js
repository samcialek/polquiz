/**
 * Baseline failure diagnostic for modern presidential vote aggregation.
 *
 * This script decomposes why the current archetype-population aggregate is
 * too Republican in several modern elections. It is diagnostic-only: the
 * canonical product path remains respondentVoteChoice.predictVote.
 *
 * Usage:
 *   npx tsx src/eval/baseline-failure-diagnostic.ts
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { isSelfNode } from "../config/nodes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { getActivationMultiplier } from "../historical/era-activations.js";
import { getNonIdeologicalModifier, historicalToCanonical } from "../historical/non-ideological-modifiers.js";
import { buildPopulationRuntimes, POPULATION_ADAPTER_VARIANTS, writePopulationAdapterAudit, } from "./populationAdapter.js";
const OUT_DIR = join("results", "counterfactuals");
const YEARS = [1984, 1988, 2004, 2016, 2020, 2024];
const CONTINUOUS_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB",
];
const CATEGORICAL_NODES = ["EPS", "AES"];
const ACTUAL_TWO_PARTY_DEM = {
    1984: 40.85,
    1988: 46.10,
    2004: 48.77,
    2016: 51.10,
    2020: 52.27,
    2024: 49.20,
};
const TRB_ANCHOR_ORDER = [
    "national", "ideological", "religious", "class", "ethnic_racial",
    "gender", "sexual", "global", "mixed_none",
];
const TRB_ANCHOR_BY_CANDIDATE = {
    "Trump_2016": "national",
    "Trump_2020": "national",
    "Trump_2024": "national",
    "H. Clinton_2016": "ideological",
    "Obama_2008": "ideological",
    "Obama_2012": "ideological",
    "Biden_2020": "national",
    "Harris_2024": "ideological",
    "Romney_2012": "ideological",
    "McCain_2008": "national",
    "Bush_2000": "religious",
    "Bush_2004": "religious",
    "Bush_1988": "national",
    "Reagan_1980": "ideological",
    "Reagan_1984": "ideological",
};
const STYLE_DRIVEN_ELECTIONS = {
    1932: 1.4, 1960: 1.4, 1980: 1.5, 2008: 1.4,
    2016: 2.0, 2020: 1.7, 2024: 1.8,
};
const NONIDEO_BASE_ON = process.env.PRISM_NONIDEO !== "0";
const KERNELS = [
    { id: "canonical_mirror", saliencePower: 2, styleScale: 1, nonIdeo: true, party: true, partyBase: 0.4, self: true },
    { id: "no_party", saliencePower: 2, styleScale: 1, nonIdeo: true, party: false, partyBase: 0, self: true },
    { id: "party_0_6", saliencePower: 2, styleScale: 1, nonIdeo: true, party: true, partyBase: 0.6, self: true },
    { id: "party_0_8", saliencePower: 2, styleScale: 1, nonIdeo: true, party: true, partyBase: 0.8, self: true },
    { id: "nonideo_off", saliencePower: 2, styleScale: 1, nonIdeo: false, party: true, partyBase: 0.4, self: true },
    { id: "style_off", saliencePower: 2, styleScale: 0, nonIdeo: true, party: true, partyBase: 0.4, self: true },
    { id: "salience_power_1", saliencePower: 1, styleScale: 1, nonIdeo: true, party: true, partyBase: 0.4, self: true },
    { id: "self_off", saliencePower: 2, styleScale: 1, nonIdeo: true, party: true, partyBase: 0.4, self: false },
    { id: "style_off_salience_1", saliencePower: 1, styleScale: 0, nonIdeo: true, party: true, partyBase: 0.4, self: true },
];
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
    writeFileSync(path, `${headers.join(",")}\n${rows.map((r) => headers.map((h) => csvEscape(r[h])).join(",")).join("\n")}\n`, "utf-8");
}
function loadWeights() {
    return JSON.parse(readFileSync(join("output", "live-data", "population-weights.json"), "utf-8"));
}
function categoricalPos(probs) {
    return probs.reduce((sum, p, i) => sum + p * i, 0);
}
function archetypeSignature(arch) {
    const sig = {};
    for (const node of [...CONTINUOUS_NODES, "ENG"]) {
        const template = arch.nodes[node];
        if (!template || template.kind !== "continuous")
            continue;
        const ct = template;
        sig[node] = {
            pos: ct.pos,
            sal: isSelfNode(node) ? ((ct.pos - 1) / 4) * 3 : (ct.sal ?? 0),
        };
    }
    for (const node of CATEGORICAL_NODES) {
        const template = arch.nodes[node];
        if (!template || template.kind !== "categorical")
            continue;
        const ct = template;
        sig[node] = {
            pos: categoricalPos(ct.probs),
            sal: ct.sal,
            catDist: [...ct.probs],
        };
    }
    return sig;
}
function continuousPos(arch, node, fallback = 3) {
    const template = arch.nodes[node];
    return template?.kind === "continuous" ? template.pos : fallback;
}
function engagementFromArch(arch) {
    const eng = continuousPos(arch, "ENG", 3);
    if (eng < 2)
        return "apolitical";
    if (eng < 3)
        return "casual";
    if (eng < 4)
        return "engaged";
    return "highly-engaged";
}
function inferPartyID(arch) {
    if (/democrat/i.test(arch.name))
        return "D";
    if (/republican|conservative|evangelical|white grievance|male grievance/i.test(arch.name))
        return "R";
    const mat = continuousPos(arch, "MAT");
    const cd = continuousPos(arch, "CD");
    const cu = continuousPos(arch, "CU");
    const mor = continuousPos(arch, "MOR");
    const onts = continuousPos(arch, "ONT_S");
    let d = 0;
    let r = 0;
    if (mat <= 2)
        d += 2;
    if (mat >= 4)
        r += 2;
    if (cd <= 2)
        d += 1;
    if (cd >= 4)
        r += 1;
    if (cu >= 4)
        d += 1;
    if (cu <= 2)
        r += 1;
    if (mor <= 2)
        d += 1;
    if (mor >= 4)
        r += 1;
    if (onts >= 4)
        d += 1;
    if (onts <= 2)
        r += 1;
    if (d >= r + 2)
        return "D";
    if (r >= d + 2)
        return "R";
    return null;
}
function buildRuntimes() {
    const active = ARCHETYPES.filter((a) => a.active !== false);
    const weights = loadWeights();
    const mass = active.reduce((sum, a) => sum + (weights[a.id] ?? 0), 0);
    return active.map((archetype) => ({
        archetype,
        weight: (weights[archetype.id] ?? 0) / (mass || 1),
        sig: archetypeSignature(archetype),
        engagement: engagementFromArch(archetype),
        partyID: inferPartyID(archetype),
    }));
}
function clearingBar(level) {
    if (level === "apolitical")
        return 0.95;
    if (level === "casual")
        return 1.40;
    if (level === "engaged")
        return 1.70;
    return 1.85;
}
function partyBucket(party) {
    if (party === "Democratic" || party === "Democratic-Republican" || party === "Dixiecrat" || party === "Free Soil")
        return "D";
    if (party === "Republican" || party === "National Republican" || party === "Federalist" || party === "Whig")
        return "R";
    return "T";
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
function categoricalContribution(cand, entry, node, year, kernel) {
    if (!entry?.catDist || kernel.styleScale === 0)
        return { contribution: 0, weight: 0 };
    const candIdx = cand[node];
    const alignment = entry.catDist[candIdx] ?? 0;
    const eraMult = STYLE_DRIVEN_ELECTIONS[year] ?? 1;
    const baseSal = 0.6 * eraMult * kernel.styleScale;
    const effectiveSal = Math.pow(baseSal, kernel.saliencePower);
    return {
        contribution: effectiveSal * (1 - alignment) * 4,
        weight: effectiveSal,
    };
}
function trbAnchorContribution(cand, kernel) {
    const anchor = TRB_ANCHOR_BY_CANDIDATE[`${cand.name}_${cand.year}`];
    if (!anchor)
        return { contribution: 0, weight: 0 };
    const idx = TRB_ANCHOR_ORDER.indexOf(anchor);
    if (idx < 0)
        return { contribution: 0, weight: 0 };
    // Archetype-level diagnostic has no respondent anchor posterior. Use the
    // candidate anchor only in live/respondent paths; leave at zero here.
    void kernel;
    return { contribution: 0, weight: 0 };
}
function score(runtime, cand, kernel) {
    const ctx = getContext(cand.year);
    if (!ctx)
        throw new Error(`Missing context ${cand.year}`);
    let weighted = 0;
    let weight = 0;
    const byNode = {};
    for (const node of CONTINUOUS_NODES) {
        if (!kernel.self && isSelfNode(node))
            continue;
        const entry = runtime.sig[node];
        if (!entry)
            continue;
        const candPos = cand[node];
        if (candPos == null)
            continue;
        const rawSal = entry.sal * getActivationMultiplier(ctx.year, node);
        const effectiveSal = Math.pow(rawSal, kernel.saliencePower);
        const diff = entry.pos - candPos;
        const contribution = effectiveSal * diff * diff;
        weighted += contribution;
        weight += effectiveSal;
        byNode[node] = contribution;
    }
    for (const node of CATEGORICAL_NODES) {
        const r = categoricalContribution(cand, runtime.sig[node], node, cand.year, kernel);
        weighted += r.contribution;
        weight += r.weight;
        byNode[node] = r.contribution;
    }
    const anchor = trbAnchorContribution(cand, kernel);
    weighted += anchor.contribution;
    weight += anchor.weight;
    if (anchor.contribution)
        byNode.TRB_ANCHOR = anchor.contribution;
    const ideological = weight > 0 ? Math.sqrt(weighted / weight) : 4;
    let finalDistance = ideological;
    if (kernel.nonIdeo && NONIDEO_BASE_ON) {
        const modifier = getNonIdeologicalModifier(cand.year, historicalToCanonical(cand.name, cand.year));
        finalDistance -= modifier.total;
    }
    if (kernel.party) {
        finalDistance *= partyMultiplier(cand.party, runtime.partyID, runtime.sig.PF?.pos, cand.year, kernel.partyBase);
    }
    const bar = clearingBar(runtime.engagement);
    return {
        candidate: cand,
        ideologicalDistance: ideological,
        finalDistance,
        clearingBar: bar,
        decision: finalDistance <= bar ? "vote" : "abstain",
        byNode,
    };
}
function aggregateForKernel(year, runtimes, kernel, adapterVariant) {
    const election = ELECTIONS.find((e) => e.year === year);
    if (!election)
        throw new Error(`Missing election ${year}`);
    let d = 0;
    let r = 0;
    let t = 0;
    let ab = 0;
    for (const runtime of runtimes) {
        const scores = election.candidates.map((cand) => score(runtime, cand, kernel));
        const nearest = scores.reduce((a, b) => a.finalDistance <= b.finalDistance ? a : b);
        if (nearest.decision === "abstain") {
            ab += runtime.weight;
            continue;
        }
        const bucket = partyBucket(nearest.candidate.party);
        if (bucket === "D")
            d += runtime.weight;
        else if (bucket === "R")
            r += runtime.weight;
        else
            t += runtime.weight;
    }
    const voters = d + r + t;
    const demTwo = (d + r) > 0 ? d / (d + r) : 0;
    return {
        adapter_variant: adapterVariant,
        kernel: kernel.id,
        year,
        predicted_dem_share: round(voters ? d / voters * 100 : 0, 2),
        predicted_rep_share: round(voters ? r / voters * 100 : 0, 2),
        predicted_third_share: round(voters ? t / voters * 100 : 0, 2),
        predicted_dem_two_party: round(demTwo * 100, 2),
        actual_dem_two_party: ACTUAL_TWO_PARTY_DEM[year],
        dem_two_party_residual: round(demTwo * 100 - ACTUAL_TWO_PARTY_DEM[year], 2),
        abstain_pop_share: round(ab * 100, 2),
    };
}
function topArchetypeRows(year, runtimes, kernel, adapterVariant) {
    const election = ELECTIONS.find((e) => e.year === year);
    if (!election)
        throw new Error(`Missing election ${year}`);
    return runtimes
        .slice()
        .sort((a, b) => b.weight - a.weight)
        .slice(0, 40)
        .map((runtime) => {
        const scores = election.candidates.map((cand) => score(runtime, cand, kernel));
        const nearest = scores.reduce((a, b) => a.finalDistance <= b.finalDistance ? a : b);
        const candidateDistances = Object.fromEntries(scores.map((s) => [s.candidate.name, round(s.finalDistance, 3)]));
        return {
            adapter_variant: adapterVariant,
            year,
            kernel: kernel.id,
            archetype_id: runtime.archetype.id,
            archetype_name: runtime.archetype.name,
            weight_pct: round(runtime.weight * 100, 3),
            party_id: runtime.partyID ?? "",
            vote: nearest.decision === "vote" ? nearest.candidate.name : "ABSTAIN",
            nearest_distance: round(nearest.finalDistance, 3),
            distances: JSON.stringify(candidateDistances),
        };
    });
}
function contributionRows(year, runtimes, kernel, adapterVariant) {
    const election = ELECTIONS.find((e) => e.year === year);
    if (!election)
        throw new Error(`Missing election ${year}`);
    const rows = [];
    for (const runtime of runtimes) {
        const scores = election.candidates.map((cand) => score(runtime, cand, kernel));
        const sorted = scores.slice().sort((a, b) => a.finalDistance - b.finalDistance);
        const first = sorted[0];
        const second = sorted[1];
        for (const s of scores) {
            const total = Object.values(s.byNode).reduce((sum, v) => sum + v, 0);
            const topNodes = Object.entries(s.byNode)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([node, contribution]) => `${node}:${round(total ? contribution / total * 100 : 0, 1)}%`)
                .join(";");
            rows.push({
                adapter_variant: adapterVariant,
                year,
                kernel: kernel.id,
                archetype_id: runtime.archetype.id,
                archetype_name: runtime.archetype.name,
                weight_pct: round(runtime.weight * 100, 3),
                candidate: s.candidate.name,
                party: s.candidate.party,
                distance: round(s.finalDistance, 4),
                ideological_distance: round(s.ideologicalDistance, 4),
                nearest: s.candidate.name === first.candidate.name ? 1 : 0,
                margin_to_second: second && s.candidate.name === first.candidate.name ? round(second.finalDistance - first.finalDistance, 4) : "",
                top_node_contributors: topNodes,
            });
        }
    }
    return rows;
}
function populationMeanRuntime(runtimes) {
    const sig = {};
    const total = runtimes.reduce((sum, rt) => sum + rt.weight, 0) || 1;
    for (const node of CONTINUOUS_NODES) {
        const entries = runtimes.map((rt) => ({ rt, entry: rt.sig[node] })).filter((r) => r.entry);
        if (entries.length === 0)
            continue;
        sig[node] = {
            pos: entries.reduce((sum, { rt, entry }) => sum + rt.weight * entry.pos, 0) / total,
            sal: entries.reduce((sum, { rt, entry }) => sum + rt.weight * entry.sal, 0) / total,
        };
    }
    for (const node of CATEGORICAL_NODES) {
        const dist = [0, 0, 0, 0, 0, 0];
        let sal = 0;
        for (const rt of runtimes) {
            const entry = rt.sig[node];
            if (!entry?.catDist)
                continue;
            for (let i = 0; i < dist.length; i++)
                dist[i] += rt.weight * (entry.catDist[i] ?? 0);
            sal += rt.weight * entry.sal;
        }
        sig[node] = {
            pos: dist.reduce((sum, p, i) => sum + p * i, 0),
            sal: sal / total,
            catDist: dist.map((v) => v / total),
        };
    }
    return {
        archetype: runtimes[0].archetype,
        weight: 1,
        sig,
        engagement: "engaged",
        partyID: null,
    };
}
function candidateMedianDistanceRows(year, runtimes, adapterVariant) {
    const election = ELECTIONS.find((e) => e.year === year);
    if (!election)
        throw new Error(`Missing election ${year}`);
    const geometryKernel = {
        id: "population_mean_geometry",
        saliencePower: 2,
        styleScale: 1,
        nonIdeo: false,
        party: false,
        partyBase: 0,
        self: true,
    };
    const mean = populationMeanRuntime(runtimes);
    const scores = election.candidates
        .map((cand) => score(mean, cand, geometryKernel))
        .sort((a, b) => a.finalDistance - b.finalDistance);
    return scores.map((s, i) => ({
        adapter_variant: adapterVariant,
        year,
        candidate: s.candidate.name,
        party: s.candidate.party,
        geometry_rank: i + 1,
        population_mean_distance: round(s.finalDistance, 4),
        top_node_contributors: Object.entries(s.byNode)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 5)
            .map(([node, contribution]) => `${node}:${round(contribution, 3)}`)
            .join(";"),
    }));
}
function writeReport(rows) {
    const canonical = rows.filter((r) => r.kernel === "canonical_mirror");
    const toggle2016 = rows.filter((r) => r.year === 2016);
    const canonical2016 = canonical.filter((r) => r.year === 2016);
    const adapterStats = POPULATION_ADAPTER_VARIANTS.map((variant) => {
        const subset = canonical.filter((r) => r.adapter_variant === variant);
        const avgAbsResidual = subset.reduce((sum, r) => sum + Math.abs(Number(r.dem_two_party_residual)), 0) / (subset.length || 1);
        const row2016 = subset.find((r) => r.year === 2016);
        const residual2016 = Number(row2016?.dem_two_party_residual ?? 0);
        const score = Math.abs(residual2016) + avgAbsResidual;
        const status = Math.abs(residual2016) <= 5 && avgAbsResidual <= 8
            ? "pass"
            : Math.abs(residual2016) <= 8 && avgAbsResidual <= 10
                ? "warning"
                : "fail";
        return {
            adapter_variant: variant,
            avg_abs_residual: round(avgAbsResidual, 2),
            residual_2016: round(residual2016, 2),
            predicted_2016_dem_two_party: row2016?.predicted_dem_two_party ?? "",
            score: round(score, 2),
            status,
        };
    }).sort((a, b) => Number(a.score) - Number(b.score));
    const bestNumeric = adapterStats[0];
    const selected = adapterStats.find((r) => r.adapter_variant === "base_only") ?? bestNumeric;
    writeFileSync(join(OUT_DIR, "population-adapter-selection.json"), JSON.stringify({
        generatedAt: new Date().toISOString(),
        selectedAdapterVariant: selected.adapter_variant,
        bestNumericVariant: bestNumeric.adapter_variant,
        selectionBasis: "methodological same-day default: exclude identity-primary archetypes 141-146 and renormalize base archetypes; keep numeric fit as a diagnostic, not the selector",
        status: selected.status,
        stats: adapterStats,
    }, null, 2), "utf-8");
    const lines = [
        "# Baseline Failure Diagnostic",
        "",
        "This diagnostic mirrors the live respondent vote formula closely enough to test failure modes, but it is not the canonical product path. Its purpose is to identify which assumptions make the aggregate too Republican.",
        "",
        "## Adapter Selection",
        "",
        `Selected adapter: ${selected.adapter_variant} (${selected.status}). Best numeric fit was ${bestNumeric.adapter_variant}; selection is intentionally methodological, matching production's base-scorer exclusion of identity-primary overlays.`,
        "",
        "| adapter | 2016 D two-party | 2016 residual | avg abs residual | status |",
        "|---|---:|---:|---:|---|",
        ...adapterStats.map((r) => `| ${r.adapter_variant} | ${r.predicted_2016_dem_two_party}% | ${r.residual_2016} | ${r.avg_abs_residual} | ${r.status} |`),
        "",
        "## Canonical-Mirror Modern Residuals",
        "",
        "| adapter | year | predicted D two-party | actual D two-party | residual | abstain pop |",
        "|---|---:|---:|---:|---:|---:|",
        ...canonical.map((r) => `| ${r.adapter_variant} | ${r.year} | ${r.predicted_dem_two_party}% | ${r.actual_dem_two_party}% | ${r.dem_two_party_residual} | ${r.abstain_pop_share}% |`),
        "",
        "## 2016 Adapter Matrix",
        "",
        "| adapter | D two-party | residual | D share | R share | third | abstain pop |",
        "|---|---:|---:|---:|---:|---:|---:|",
        ...canonical2016.map((r) => `| ${r.adapter_variant} | ${r.predicted_dem_two_party}% | ${r.dem_two_party_residual} | ${r.predicted_dem_share}% | ${r.predicted_rep_share}% | ${r.predicted_third_share}% | ${r.abstain_pop_share}% |`),
        "",
        "## 2016 Toggle Matrix",
        "",
        "| adapter | kernel | D two-party | residual | D share | R share | third | abstain pop |",
        "|---|---|---:|---:|---:|---:|---:|---:|",
        ...toggle2016.map((r) => `| ${r.adapter_variant} | ${r.kernel} | ${r.predicted_dem_two_party}% | ${r.dem_two_party_residual} | ${r.predicted_dem_share}% | ${r.predicted_rep_share}% | ${r.predicted_third_share}% | ${r.abstain_pop_share}% |`),
        "",
        "## Early Read",
        "",
        "If none of the adapter variants clears the residual gate, this remains a crash diagnostic rather than a decision-grade electorate model. In that case, the next repair is a survey/poststratification bridge, not another same-data coefficient tweak.",
        "",
    ];
    writeFileSync(join(OUT_DIR, "baseline-failure-diagnostic.md"), lines.join("\n"), "utf-8");
}
function main() {
    mkdirSync(OUT_DIR, { recursive: true });
    writePopulationAdapterAudit(join(OUT_DIR, "population-adapter-audit.json"));
    const runtimesByVariant = {};
    for (const variant of POPULATION_ADAPTER_VARIANTS) {
        runtimesByVariant[variant] = buildPopulationRuntimes(variant);
    }
    const aggregateRows = [];
    for (const variant of POPULATION_ADAPTER_VARIANTS) {
        const runtimes = runtimesByVariant[variant];
        for (const kernel of KERNELS) {
            for (const year of YEARS)
                aggregateRows.push(aggregateForKernel(year, runtimes, kernel, variant));
        }
    }
    writeCsv(join(OUT_DIR, "baseline-failure-toggle-matrix.csv"), aggregateRows);
    writeCsv(join(OUT_DIR, "baseline-failure-top-archetypes.csv"), POPULATION_ADAPTER_VARIANTS.flatMap((variant) => YEARS.flatMap((year) => topArchetypeRows(year, runtimesByVariant[variant], KERNELS[0], variant))));
    writeCsv(join(OUT_DIR, "baseline-failure-node-contributions.csv"), POPULATION_ADAPTER_VARIANTS.flatMap((variant) => [1984, 2016, 2024].flatMap((year) => contributionRows(year, runtimesByVariant[variant], KERNELS[0], variant))));
    writeCsv(join(OUT_DIR, "candidate-population-mean-distances.csv"), POPULATION_ADAPTER_VARIANTS.flatMap((variant) => YEARS.flatMap((year) => candidateMedianDistanceRows(year, runtimesByVariant[variant], variant))));
    writeReport(aggregateRows);
    console.log("Wrote baseline failure diagnostics to", OUT_DIR);
    console.table(aggregateRows.filter((r) => r.year === 2016 && r.kernel === "canonical_mirror"));
}
main();
//# sourceMappingURL=baseline-failure-diagnostic.js.map