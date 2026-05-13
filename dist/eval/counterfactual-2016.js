/**
 * Same-day population aggregate and Bernie 2016 counterfactual diagnostic.
 *
 * This intentionally uses the live respondent vote kernel
 * (historical/respondentVoteChoice.predictVote) rather than the legacy
 * historical simulator, so the output is comparable to the live quiz.
 *
 * Usage:
 *   npx tsx src/eval/counterfactual-2016.ts
 */
import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { POPULATION_WEIGHTS as TS_POPULATION_WEIGHTS } from "../config/population-weights.js";
import { isSelfNode } from "../config/nodes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { buildPopulationRuntimes, POPULATION_ADAPTER_VARIANTS, writePopulationAdapterAudit, } from "./populationAdapter.js";
const OUT_DIR = join("results", "counterfactuals");
const SOURCE_CSV = join(OUT_DIR, "source-1976-2020-president.csv");
const PRESIDENT_RESULTS_URL = "https://huggingface.co/datasets/fdaudens/us-presidential-elections/resolve/main/1976-2020-president.csv?download=true";
const CONTINUOUS_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CATEGORICAL_NODES = ["EPS", "AES"];
const MODERN_YEARS = [
    1976, 1980, 1984, 1988, 1992, 1996, 2000,
    2004, 2008, 2012, 2016, 2020, 2024,
];
const ELECTORAL_VOTES_2016 = {
    AL: 9, AK: 3, AZ: 11, AR: 6, CA: 55, CO: 9, CT: 7, DE: 3, DC: 3,
    FL: 29, GA: 16, HI: 4, ID: 4, IL: 20, IN: 11, IA: 6, KS: 6, KY: 8,
    LA: 8, ME: 4, MD: 10, MA: 11, MI: 16, MN: 10, MS: 6, MO: 10, MT: 3,
    NE: 5, NV: 6, NH: 4, NJ: 14, NM: 5, NY: 29, NC: 15, ND: 3, OH: 18,
    OK: 7, OR: 7, PA: 20, RI: 4, SC: 9, SD: 3, TN: 11, TX: 38, UT: 6,
    VT: 3, VA: 13, WA: 12, WV: 5, WI: 10, WY: 3,
};
const ACTUAL_2024 = {
    totalVotes: 155324507,
    shares: {
        Democratic: 48.3,
        Republican: 49.8,
    },
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
    const lines = [
        headers.join(","),
        ...rows.map((row) => headers.map((h) => csvEscape(row[h])).join(",")),
    ];
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
    const text = readFileSync(SOURCE_CSV, "utf-8");
    const rows = parseCsv(text);
    const headers = rows.shift();
    if (!headers)
        return [];
    return rows
        .filter((r) => r.length === headers.length)
        .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
}
function isPopulationAdapterVariant(value) {
    return POPULATION_ADAPTER_VARIANTS.includes(value);
}
function loadSelectedAdapterVariant() {
    const p = join(OUT_DIR, "population-adapter-selection.json");
    if (!existsSync(p)) {
        return {
            variant: "redistribute_identity_overlay",
            source: "default",
            status: "not_run",
            selection: null,
        };
    }
    const selection = JSON.parse(readFileSync(p, "utf-8"));
    const variant = selection.selectedAdapterVariant && isPopulationAdapterVariant(selection.selectedAdapterVariant)
        ? selection.selectedAdapterVariant
        : "redistribute_identity_overlay";
    return {
        variant,
        source: p,
        status: selection.status ?? "unknown",
        selection,
    };
}
function activeArchetypes() {
    return ARCHETYPES.filter((a) => a.active !== false);
}
function auditWeightSource(label, weights, active) {
    const activeIds = new Set(active.map((a) => a.id));
    const archetypeIds = new Set(ARCHETYPES.map((a) => a.id));
    const keys = Object.keys(weights);
    const missingActive = active.filter((a) => weights[a.id] == null).map((a) => a.id);
    const inactiveWeighted = ARCHETYPES
        .filter((a) => a.active === false && weights[a.id] != null)
        .map((a) => a.id);
    const unknownKeys = keys.filter((k) => !archetypeIds.has(k));
    const inactiveOrUnknownMass = keys
        .filter((k) => !activeIds.has(k))
        .reduce((sum, k) => sum + (weights[k] ?? 0), 0);
    const activeMass = active.reduce((sum, a) => sum + (weights[a.id] ?? 0), 0);
    const totalMass = keys.reduce((sum, k) => sum + (weights[k] ?? 0), 0);
    return {
        label,
        weightKeys: keys.length,
        totalMass: round(totalMass, 8),
        activeMass: round(activeMass, 8),
        inactiveOrUnknownMass: round(inactiveOrUnknownMass, 8),
        missingActive,
        inactiveWeighted,
        unknownKeys,
    };
}
function loadJsonWeights() {
    const p = join("output", "live-data", "population-weights.json");
    if (!existsSync(p))
        return null;
    return JSON.parse(readFileSync(p, "utf-8"));
}
function canonicalWeights(active) {
    const jsonWeights = loadJsonWeights();
    const audits = [
        auditWeightSource("src/config/population-weights.ts", TS_POPULATION_WEIGHTS, active),
    ];
    if (jsonWeights)
        audits.push(auditWeightSource("output/live-data/population-weights.json", jsonWeights, active));
    const sourceWeights = jsonWeights ?? TS_POPULATION_WEIGHTS;
    const source = jsonWeights ? "output/live-data/population-weights.json" : "src/config/population-weights.ts";
    const activeMass = active.reduce((sum, a) => sum + (sourceWeights[a.id] ?? 0), 0);
    const normalized = {};
    for (const a of active)
        normalized[a.id] = (sourceWeights[a.id] ?? 0) / (activeMass || active.length);
    if (activeMass === 0) {
        for (const a of active)
            normalized[a.id] = 1 / active.length;
    }
    return { source, weights: normalized, audits };
}
function categoricalPos(probs) {
    return probs.reduce((sum, p, i) => sum + p * i, 0);
}
function archetypeSignature(arch) {
    const sig = {};
    for (const node of CONTINUOUS_NODES) {
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
    const trb = continuousPos(arch, "TRB");
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
    if (trb >= 4 && cd >= 4)
        r += 1;
    if (d >= r + 2)
        return "D";
    if (r >= d + 2)
        return "R";
    return null;
}
function buildRuntime(active, weights) {
    return active.map((archetype) => ({
        archetype,
        weight: weights[archetype.id] ?? 0,
        sig: archetypeSignature(archetype),
        engagement: engagementFromArch(archetype),
        partyID: inferPartyID(archetype),
    }));
}
function partyBucket(party) {
    if (party === "Democratic" || party === "Democratic-Republican" || party === "Free Soil" || party === "Dixiecrat") {
        return "Democratic";
    }
    if (party === "Republican" || party === "National Republican" || party === "Federalist" || party === "Whig") {
        return "Republican";
    }
    return "Third/Other";
}
function predictFor(runtime, candidates, year) {
    const ctx = getContext(year);
    if (!ctx)
        throw new Error(`Missing election context for ${year}`);
    return predictVote(runtime.sig, candidates, ctx, runtime.engagement, runtime.partyID, null, null, false, null);
}
function aggregateElection(year, candidates, runtimes, scenario, mode, fixedBaseline) {
    const byCandidate = {};
    const byParty = {};
    const predictionsByArch = new Map();
    let abstain = 0;
    for (const runtime of runtimes) {
        const pred = predictFor(runtime, candidates, year);
        predictionsByArch.set(runtime.archetype.id, pred);
        const baseline = fixedBaseline?.get(runtime.archetype.id);
        const shouldVote = mode === "elastic"
            ? pred.decision === "vote"
            : baseline?.decision === "vote";
        if (!shouldVote) {
            abstain += runtime.weight;
            continue;
        }
        byCandidate[pred.nearest.name] = (byCandidate[pred.nearest.name] ?? 0) + runtime.weight;
        const party = partyBucket(pred.nearest.party);
        byParty[party] = (byParty[party] ?? 0) + runtime.weight;
    }
    const totalVoterWeight = Object.values(byCandidate).reduce((sum, v) => sum + v, 0);
    return { year, mode, scenario, byCandidate, byParty, abstain, totalVoterWeight, predictionsByArch };
}
function voteShare(result, key, by = "party") {
    const numerator = by === "party" ? (result.byParty[key] ?? 0) : (result.byCandidate[key] ?? 0);
    return result.totalVoterWeight > 0 ? numerator / result.totalVoterWeight : 0;
}
function twoPartyDemShare(result) {
    const d = result.byParty.Democratic ?? 0;
    const r = result.byParty.Republican ?? 0;
    return (d + r) > 0 ? d / (d + r) : 0;
}
function actualNationalByYear(rows) {
    const byYear = new Map();
    for (const row of rows) {
        const year = Number(row.year);
        const party = row.party_simplified;
        const votes = Number(row.candidatevotes);
        const total = Number(row.totalvotes);
        if (!year || !party || !Number.isFinite(votes) || !Number.isFinite(total))
            continue;
        const rec = byYear.get(year) ?? { totalVotes: 0 };
        rec.totalVotes = Math.max(rec.totalVotes ?? 0, 0);
        rec[party] = (rec[party] ?? 0) + votes;
        byYear.set(year, rec);
    }
    for (const [year, rec] of byYear) {
        const total = Object.entries(rec)
            .filter(([k]) => k !== "totalVotes")
            .reduce((sum, [, votes]) => sum + votes, 0);
        rec.totalVotes = total;
        byYear.set(year, rec);
    }
    byYear.set(2024, {
        totalVotes: ACTUAL_2024.totalVotes,
        DEMOCRAT: ACTUAL_2024.shares.Democratic * ACTUAL_2024.totalVotes / 100,
        REPUBLICAN: ACTUAL_2024.shares.Republican * ACTUAL_2024.totalVotes / 100,
    });
    return byYear;
}
function actualState2016(rows) {
    const states = new Map();
    for (const row of rows) {
        if (Number(row.year) !== 2016)
            continue;
        const statePo = row.state_po;
        if (!statePo || !(statePo in ELECTORAL_VOTES_2016))
            continue;
        const votes = Number(row.candidatevotes);
        const totalVotes = Number(row.totalvotes);
        if (!Number.isFinite(votes) || !Number.isFinite(totalVotes))
            continue;
        const rec = states.get(statePo) ?? {
            state: row.state,
            statePo,
            demVotes: 0,
            repVotes: 0,
            totalVotes,
            demTwoParty: 0,
            repTwoParty: 0,
        };
        rec.totalVotes = Math.max(rec.totalVotes, totalVotes);
        if (row.party_simplified === "DEMOCRAT")
            rec.demVotes += votes;
        if (row.party_simplified === "REPUBLICAN")
            rec.repVotes += votes;
        states.set(statePo, rec);
    }
    return [...states.values()]
        .map((rec) => {
        const denom = rec.demVotes + rec.repVotes;
        return {
            ...rec,
            demTwoParty: denom > 0 ? rec.demVotes / denom : 0,
            repTwoParty: denom > 0 ? rec.repVotes / denom : 0,
        };
    })
        .sort((a, b) => a.statePo.localeCompare(b.statePo));
}
function makeSandersScenarios() {
    const base = ELECTIONS.find((e) => e.year === 2016)?.candidates.find((c) => c.name === "H. Clinton");
    if (!base)
        throw new Error("Missing 2016 Clinton profile");
    const sanders = (overrides) => ({
        ...base,
        name: "Sanders",
        party: "Democratic",
        year: 2016,
        ...overrides,
    });
    return [
        {
            id: "static_platform",
            label: "Static/platform Sanders",
            profile: sanders({
                MAT: 1, CD: 2, CU: 3, MOR: 4.5, PRO: 2, COM: 1.5,
                ZS: 4, ONT_H: 4, ONT_S: 2, PF: 4, TRB: 3.5, ENG: 5,
                EPS: 0, AES: 3,
            }),
            ranges: {
                MAT: [1.0, 1.0], CD: [1.5, 2.5], CU: [2.5, 3.5], MOR: [4.0, 5.0],
                PRO: [1.5, 2.5], COM: [1.0, 2.0], ZS: [3.5, 4.5],
                ONT_H: [3.5, 4.5], ONT_S: [1.5, 2.5], PF: [3.5, 4.5], TRB: [3.0, 4.0],
            },
            notes: [
                "Issue-record/platform signal: maximum redistribution, class-conflict populist, mid-CU labor internationalist rather than elite cosmopolitan.",
            ],
        },
        {
            id: "perceived_attack",
            label: "Perceived/attack-framed Sanders",
            profile: sanders({
                MAT: 1, CD: 2.5, CU: 3, MOR: 4, PRO: 1.5, COM: 1.5,
                ZS: 4.5, ONT_H: 3.5, ONT_S: 1.5, PF: 4, TRB: 3.5, ENG: 5,
                EPS: 0, AES: 4,
            }),
            ranges: {
                MAT: [1.0, 1.3], CD: [2.0, 3.0], CU: [2.5, 3.5], MOR: [3.5, 4.5],
                PRO: [1.0, 2.0], COM: [1.0, 2.0], ZS: [4.0, 5.0],
                ONT_H: [3.0, 4.0], ONT_S: [1.0, 2.0], PF: [3.5, 4.5], TRB: [3.0, 4.0],
            },
            notes: [
                "Campaign-mediated version: GOP attacks and media framing make him look more radical and anti-system.",
            ],
        },
        {
            id: "populist_crossover",
            label: "Populist crossover Sanders",
            profile: sanders({
                MAT: 1, CD: 2.7, CU: 2.8, MOR: 4, PRO: 2, COM: 1.5,
                ZS: 4.5, ONT_H: 4, ONT_S: 1.8, PF: 4, TRB: 4, ENG: 5,
                EPS: 0, AES: 4,
            }),
            ranges: {
                MAT: [1.0, 1.2], CD: [2.2, 3.2], CU: [2.5, 3.3], MOR: [3.5, 4.5],
                PRO: [1.5, 2.5], COM: [1.0, 2.0], ZS: [4.0, 5.0],
                ONT_H: [3.5, 4.5], ONT_S: [1.2, 2.3], PF: [3.5, 4.5], TRB: [3.5, 4.5],
            },
            notes: [
                "Best case for Obama-Trump/class crossover: stronger class anchor, less elite-pluralist coding.",
            ],
        },
        {
            id: "youth_turnout",
            label: "Youth/left enthusiasm Sanders",
            profile: sanders({
                MAT: 1, CD: 1.8, CU: 3.3, MOR: 4.5, PRO: 2, COM: 1.5,
                ZS: 4, ONT_H: 4.3, ONT_S: 2, PF: 4, TRB: 3.5, ENG: 5,
                EPS: 0, AES: 4,
            }),
            ranges: {
                MAT: [1.0, 1.2], CD: [1.3, 2.3], CU: [2.8, 3.8], MOR: [4.0, 5.0],
                PRO: [1.5, 2.4], COM: [1.0, 2.0], ZS: [3.4, 4.6],
                ONT_H: [3.8, 4.8], ONT_S: [1.5, 2.5], PF: [3.5, 4.5], TRB: [3.0, 4.0],
            },
            notes: [
                "Left enthusiasm case: maximum visionary/activation signal for young and movement-left voters.",
            ],
        },
    ];
}
function candidatesWithReplacement(year, replacement) {
    const election = ELECTIONS.find((e) => e.year === year);
    if (!election)
        throw new Error(`Missing election ${year}`);
    return election.candidates.map((c) => c.name === "H. Clinton" ? replacement : c);
}
function baselineRows(aggregates, actualByYear) {
    return aggregates.map((result) => {
        const actual = actualByYear.get(result.year);
        const actualTotal = actual?.totalVotes ?? 0;
        const actualDem = actualTotal > 0 ? (actual?.DEMOCRAT ?? 0) / actualTotal : 0;
        const actualRep = actualTotal > 0 ? (actual?.REPUBLICAN ?? 0) / actualTotal : 0;
        const actualTwoPartyDem = ((actual?.DEMOCRAT ?? 0) + (actual?.REPUBLICAN ?? 0)) > 0
            ? (actual?.DEMOCRAT ?? 0) / ((actual?.DEMOCRAT ?? 0) + (actual?.REPUBLICAN ?? 0))
            : 0;
        const predDem = voteShare(result, "Democratic");
        const predRep = voteShare(result, "Republican");
        const predTwoPartyDem = twoPartyDemShare(result);
        const winner = Object.entries(result.byCandidate).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "ABSTAIN";
        return {
            year: result.year,
            predicted_winner: winner,
            predicted_dem_share: round(predDem * 100, 2),
            predicted_rep_share: round(predRep * 100, 2),
            predicted_third_share: round(voteShare(result, "Third/Other") * 100, 2),
            predicted_dem_two_party: round(predTwoPartyDem * 100, 2),
            actual_dem_share: round(actualDem * 100, 2),
            actual_rep_share: round(actualRep * 100, 2),
            actual_dem_two_party: round(actualTwoPartyDem * 100, 2),
            dem_share_residual: round((predDem - actualDem) * 100, 2),
            dem_two_party_residual: round((predTwoPartyDem - actualTwoPartyDem) * 100, 2),
            abstain_population_share: round(result.abstain * 100, 2),
            voter_population_share: round(result.totalVoterWeight * 100, 2),
        };
    });
}
function movementRows(baseline, scenario, runtimes) {
    return runtimes.map((runtime) => {
        const base = baseline.predictionsByArch.get(runtime.archetype.id);
        const scen = scenario.predictionsByArch.get(runtime.archetype.id);
        const baseVote = base.decision === "vote" ? base.nearest.name : "ABSTAIN";
        const scenarioVoted = scenario.mode === "fixed"
            ? base.decision === "vote"
            : scen.decision === "vote";
        const scenVote = scenarioVoted ? scen.nearest.name : "ABSTAIN";
        return {
            scenario: scenario.scenario,
            mode: scenario.mode,
            archetype_id: runtime.archetype.id,
            archetype_name: runtime.archetype.name,
            weight_pct: round(runtime.weight * 100, 4),
            party_id: runtime.partyID ?? "",
            engagement: runtime.engagement,
            baseline_vote: baseVote,
            scenario_vote: scenVote,
            baseline_distance: round(base.nearest.distance, 4),
            scenario_distance: round(scen.nearest.distance, 4),
            changed: baseVote !== scenVote ? 1 : 0,
        };
    }).sort((a, b) => Number(b.weight_pct) - Number(a.weight_pct));
}
function aggregateSummaryRow(result, baseline) {
    const dem = voteShare(result, "Democratic");
    const rep = voteShare(result, "Republican");
    const third = voteShare(result, "Third/Other");
    const demTwo = twoPartyDemShare(result);
    const baseDemTwo = baseline ? twoPartyDemShare(baseline) : demTwo;
    const winner = Object.entries(result.byCandidate).sort(([, a], [, b]) => b - a)[0]?.[0] ?? "ABSTAIN";
    return {
        scenario: result.scenario,
        mode: result.mode,
        predicted_winner: winner,
        dem_share: round(dem * 100, 2),
        rep_share: round(rep * 100, 2),
        third_share: round(third * 100, 2),
        dem_two_party: round(demTwo * 100, 2),
        dem_two_party_delta_vs_baseline: round((demTwo - baseDemTwo) * 100, 2),
        abstain_population_share: round(result.abstain * 100, 2),
        voter_population_share: round(result.totalVoterWeight * 100, 2),
    };
}
function stateSwingRows(states, scenario, baseline) {
    const swing = twoPartyDemShare(scenario) - twoPartyDemShare(baseline);
    return states.map((s) => {
        const shifted = Math.max(0, Math.min(1, s.demTwoParty + swing));
        const demWin = shifted >= 0.5;
        const ev = ELECTORAL_VOTES_2016[s.statePo] ?? 0;
        return {
            scenario: scenario.scenario,
            mode: scenario.mode,
            state: s.state,
            state_po: s.statePo,
            electoral_votes: ev,
            actual_2016_dem_two_party: round(s.demTwoParty * 100, 3),
            model_dem_two_party_swing: round(swing * 100, 3),
            counterfactual_dem_two_party: round(shifted * 100, 3),
            counterfactual_winner: demWin ? "Democratic" : "Republican",
            dem_ev: demWin ? ev : 0,
            rep_ev: demWin ? 0 : ev,
            margin_pct: round(Math.abs(shifted - 0.5) * 100, 3),
        };
    });
}
function evSummary(rows) {
    return {
        dem_ev: rows.reduce((sum, r) => sum + Number(r.dem_ev), 0),
        rep_ev: rows.reduce((sum, r) => sum + Number(r.rep_ev), 0),
        tipping_states: rows
            .slice()
            .sort((a, b) => Number(a.margin_pct) - Number(b.margin_pct))
            .slice(0, 8)
            .map((r) => `${r.state_po}:${r.counterfactual_winner} ${r.margin_pct}%`)
            .join("; "),
    };
}
function mulberry32(seed) {
    let t = seed >>> 0;
    return () => {
        t += 0x6D2B79F5;
        let x = Math.imul(t ^ (t >>> 15), 1 | t);
        x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
        return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
    };
}
function sampleRange(rng, range, fallback) {
    if (!range)
        return fallback;
    return range[0] + (range[1] - range[0]) * rng();
}
function jitterScenario(scenario, seed) {
    const rng = mulberry32(seed);
    const profile = { ...scenario.profile };
    for (const key of [
        "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
        "ONT_H", "ONT_S", "PF", "TRB", "ENG",
    ]) {
        const value = profile[key];
        if (typeof value === "number") {
            profile[key] = sampleRange(rng, scenario.ranges[key], value);
        }
    }
    return profile;
}
function jitterWeights(runtimes, seed) {
    const rng = mulberry32(seed);
    const multipliers = runtimes.map(() => 0.85 + rng() * 0.30);
    const total = runtimes.reduce((sum, rt, i) => sum + rt.weight * multipliers[i], 0);
    return runtimes.map((rt, i) => ({
        ...rt,
        weight: total > 0 ? (rt.weight * multipliers[i]) / total : rt.weight,
    }));
}
function runMonteCarlo(scenarios, runtimes, states, reps) {
    const election2016 = ELECTIONS.find((e) => e.year === 2016);
    if (!election2016)
        throw new Error("Missing 2016 election");
    const rows = [];
    for (const scenario of scenarios) {
        for (let i = 0; i < reps; i++) {
            const seed = 100000 + i * 17 + scenario.id.length * 101;
            const jitteredRuntimes = jitterWeights(runtimes, seed);
            const baseline = aggregateElection(2016, election2016.candidates, jitteredRuntimes, "baseline_clinton", "elastic");
            const profile = jitterScenario(scenario, seed + 7);
            const candidates = candidatesWithReplacement(2016, profile);
            const counter = aggregateElection(2016, candidates, jitteredRuntimes, scenario.id, "elastic");
            const stateRows = stateSwingRows(states, counter, baseline);
            const ev = evSummary(stateRows);
            rows.push({
                scenario: scenario.id,
                rep: i,
                dem_two_party: round(twoPartyDemShare(counter) * 100, 3),
                dem_two_party_delta: round((twoPartyDemShare(counter) - twoPartyDemShare(baseline)) * 100, 3),
                dem_ev: ev.dem_ev,
                rep_ev: ev.rep_ev,
                sanders_wins: Number(ev.dem_ev) >= 270 ? 1 : 0,
                tipping_states: ev.tipping_states,
            });
        }
    }
    return rows;
}
function percentile(values, p) {
    if (values.length === 0)
        return 0;
    const sorted = values.slice().sort((a, b) => a - b);
    const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor((sorted.length - 1) * p)));
    return sorted[idx];
}
function stabilitySummary(rows) {
    const scenarios = [...new Set(rows.map((r) => String(r.scenario)))];
    const lines = [
        "# Bernie 2016 Stability Summary",
        "",
        "Monte Carlo varies active archetype weights by +/-15% and samples Sanders node values within each scenario range. State outcomes use a uniform two-party swing from the model's national delta.",
        "",
        "| scenario | reps | win rate | median EV | EV 5th | EV 95th | median D two-party | median D swing |",
        "|---|---:|---:|---:|---:|---:|---:|---:|",
    ];
    for (const scenario of scenarios) {
        const subset = rows.filter((r) => r.scenario === scenario);
        const ev = subset.map((r) => Number(r.dem_ev));
        const demTwo = subset.map((r) => Number(r.dem_two_party));
        const swing = subset.map((r) => Number(r.dem_two_party_delta));
        const wins = subset.reduce((sum, r) => sum + Number(r.sanders_wins), 0);
        lines.push(`| ${scenario} | ${subset.length} | ${round((wins / subset.length) * 100, 1)}% | ${round(percentile(ev, 0.5), 0)} | ${round(percentile(ev, 0.05), 0)} | ${round(percentile(ev, 0.95), 0)} | ${round(percentile(demTwo, 0.5), 2)}% | ${round(percentile(swing, 0.5), 2)} |`);
    }
    lines.push("");
    return lines.join("\n");
}
function reportMarkdown(audit, baselineRowsOut, nationalRows, stateSummaries, stability) {
    const modernBaseline = baselineRowsOut.filter((r) => MODERN_YEARS.includes(Number(r.year)));
    const avgAbsResidual = modernBaseline.reduce((sum, r) => sum + Math.abs(Number(r.dem_two_party_residual)), 0) / modernBaseline.length;
    const baselineStatus = avgAbsResidual <= 5
        ? "pass"
        : avgAbsResidual <= 10
            ? "warning"
            : "fail";
    const rows = [
        "# Bernie 2016 Same-Day Counterfactual Report",
        "",
        "This is a crash diagnostic, not a CCES/MRP-validated result. It uses current PRISM archetypes, normalized population weights, and the live respondent vote kernel.",
        "",
        "## Bottom Line",
        "",
        baselineStatus === "fail"
            ? "The selected archetype-population adapter is not accurate enough to support a decision-grade Bernie 2016 answer. Treat the counterfactuals below as sensitivity diagnostics: they show which assumptions push the model toward or away from a Sanders win, not what would have happened."
            : "The current archetype-population baseline is close enough for a provisional directional read, pending CCES validation.",
        "",
        "Within this same-day diagnostic, the useful output is the scenario band: how the national two-party swing, uniform-swing Electoral College projection, and stability runs move when Sanders is encoded as static/platform, perceived/attack-framed, populist-crossover, or youth/left-enthusiasm.",
        "",
        "## Foundation",
        "",
        `- Population adapter: ${audit.populationAdapterVariant}`,
        `- Adapter selection status: ${audit.populationAdapterSelectionStatus}`,
        `- Weight source: ${audit.populationWeightSource}`,
        `- Active archetypes available: ${audit.activeArchetypes}`,
        `- Population archetypes included: ${audit.includedPopulationArchetypes}`,
        `- Modern-election average absolute Democratic two-party residual: ${round(avgAbsResidual, 2)} points`,
        `- Baseline status: ${baselineStatus}`,
        "",
        "The baseline miss is concentrated in several high-salience modern elections, including 1984, 1988, 2004, 2016, and 2024. That means the next real validation step is still a CCES 2016 bridge or a recalibrated population/vote adapter, not stronger rhetoric around this run.",
        "",
        "## National Counterfactual",
        "",
        "| scenario | mode | winner | D share | R share | third | D two-party | D two-party delta | abstain pop |",
        "|---|---|---|---:|---:|---:|---:|---:|---:|",
        ...nationalRows.map((r) => `| ${r.scenario} | ${r.mode} | ${r.predicted_winner} | ${r.dem_share}% | ${r.rep_share}% | ${r.third_share}% | ${r.dem_two_party}% | ${r.dem_two_party_delta_vs_baseline} | ${r.abstain_population_share}% |`),
        "",
        "## Uniform-Swing Electoral College",
        "",
        "State estimates apply the model's national two-party swing to actual 2016 state two-party margins. This is a first-pass state approximation, not a demographic-cell MRP model.",
        "",
        "| scenario | mode | Democratic EV | Republican EV | tipping states |",
        "|---|---|---:|---:|---|",
        ...stateSummaries.map((r) => `| ${r.scenario} | ${r.mode} | ${r.dem_ev} | ${r.rep_ev} | ${r.tipping_states} |`),
        "",
        "## Stability",
        "",
        stability,
        "## Caveats",
        "",
        "- No CCES individual-voter bridge is included in this same-day run.",
        "- The baseline model currently predicts Trump by far too much in 2016, so the state EV results use relative swing from a bad baseline applied to actual state margins.",
        "- State outcomes are uniform-swing approximations.",
        "- Sanders profiles are explicit scenarios, not measured voter perceptions.",
        "- The result is useful for finding model implications and load-bearing assumptions, not for closing the historical debate.",
        "",
    ];
    return rows.join("\n");
}
async function main() {
    mkdirSync(OUT_DIR, { recursive: true });
    await ensureSourceCsv();
    const presidentRows = loadPresidentRows();
    const actualByYear = actualNationalByYear(presidentRows);
    const states2016 = actualState2016(presidentRows);
    const adapterAudits = writePopulationAdapterAudit(join(OUT_DIR, "population-adapter-audit.json"));
    const adapterSelection = loadSelectedAdapterVariant();
    const active = activeArchetypes();
    const runtimes = buildPopulationRuntimes(adapterSelection.variant);
    const selectedAdapterAudit = adapterAudits.find((a) => a.variant === adapterSelection.variant) ?? null;
    const audit = {
        generatedAt: new Date().toISOString(),
        totalArchetypes: ARCHETYPES.length,
        activeArchetypes: active.length,
        includedPopulationArchetypes: runtimes.length,
        inactiveArchetypes: ARCHETYPES.filter((a) => a.active === false).map((a) => a.id),
        populationAdapterVariant: adapterSelection.variant,
        populationAdapterSelectionStatus: adapterSelection.status,
        populationAdapterSelectionSource: adapterSelection.source,
        populationAdapterSelection: adapterSelection.selection,
        populationWeightSource: selectedAdapterAudit?.source ?? "",
        populationAdapterAudit: selectedAdapterAudit,
        normalizedActiveWeightSum: round(runtimes.reduce((sum, rt) => sum + rt.weight, 0), 8),
        inferredPartyCounts: runtimes.reduce((acc, rt) => {
            acc[rt.partyID ?? "none"] = (acc[rt.partyID ?? "none"] ?? 0) + 1;
            return acc;
        }, {}),
    };
    writeFileSync(join(OUT_DIR, "foundation-audit.json"), JSON.stringify(audit, null, 2), "utf-8");
    const baselineAggregates = [];
    for (const year of MODERN_YEARS) {
        const election = ELECTIONS.find((e) => e.year === year);
        if (!election)
            continue;
        baselineAggregates.push(aggregateElection(year, election.candidates, runtimes, "baseline", "elastic"));
    }
    const baseline = baselineRows(baselineAggregates, actualByYear);
    writeCsv(join(OUT_DIR, "population-aggregate-baseline.csv"), baseline);
    const baseline2016Election = ELECTIONS.find((e) => e.year === 2016);
    if (!baseline2016Election)
        throw new Error("Missing 2016 election");
    const baseline2016 = aggregateElection(2016, baseline2016Election.candidates, runtimes, "baseline_clinton", "elastic");
    const scenarios = makeSandersScenarios();
    writeFileSync(join(OUT_DIR, "bernie-2016-scenarios.json"), JSON.stringify(scenarios.map((s) => ({
        id: s.id,
        label: s.label,
        profile: s.profile,
        ranges: s.ranges,
        notes: s.notes,
    })), null, 2), "utf-8");
    const nationalRows = [
        aggregateSummaryRow(baseline2016),
    ];
    const movementAll = [];
    const stateRowsAll = [];
    const stateSummaryRows = [];
    for (const scenario of scenarios) {
        const candidates = candidatesWithReplacement(2016, scenario.profile);
        const elastic = aggregateElection(2016, candidates, runtimes, scenario.id, "elastic");
        const fixed = aggregateElection(2016, candidates, runtimes, scenario.id, "fixed", baseline2016.predictionsByArch);
        for (const result of [elastic, fixed]) {
            nationalRows.push(aggregateSummaryRow(result, baseline2016));
            movementAll.push(...movementRows(baseline2016, result, runtimes));
            const rows = stateSwingRows(states2016, result, baseline2016);
            stateRowsAll.push(...rows);
            stateSummaryRows.push({
                scenario: result.scenario,
                mode: result.mode,
                ...evSummary(rows),
            });
        }
    }
    writeCsv(join(OUT_DIR, "bernie-2016-national.csv"), nationalRows);
    writeCsv(join(OUT_DIR, "bernie-2016-archetype-movements.csv"), movementAll);
    writeCsv(join(OUT_DIR, "bernie-2016-state-uniform-swing.csv"), stateRowsAll);
    writeCsv(join(OUT_DIR, "bernie-2016-state-summary.csv"), stateSummaryRows);
    const mcRows = runMonteCarlo(scenarios, runtimes, states2016, 300);
    writeCsv(join(OUT_DIR, "bernie-2016-monte-carlo.csv"), mcRows);
    const stability = stabilitySummary(mcRows);
    writeFileSync(join(OUT_DIR, "bernie-2016-stability-summary.md"), stability, "utf-8");
    writeFileSync(join(OUT_DIR, "bernie-2016-report.md"), reportMarkdown(audit, baseline, nationalRows, stateSummaryRows, stability), "utf-8");
    console.log("Wrote counterfactual outputs to", OUT_DIR);
    console.log("Foundation:", JSON.stringify({
        active: active.length,
        adapterVariant: adapterSelection.variant,
        adapterStatus: adapterSelection.status,
        weightSource: selectedAdapterAudit?.source ?? "",
        normalizedWeightSum: audit.normalizedActiveWeightSum,
    }));
    console.log("National rows:");
    for (const row of nationalRows)
        console.log(row);
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=counterfactual-2016.js.map