/**
 * Bernie 2016 diagnostic experiment matrix.
 *
 * This is intentionally a diagnostic runner, not a production vote scorer.
 * It sweeps labeled assumptions around salience power, candidate geometry,
 * identity-population handling, third-party recapture, turnout elasticity,
 * and state-specific allocation.
 *
 * Usage:
 *   npx tsx src/eval/counterfactual-2016-matrix.ts
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { getActivationMultiplier } from "../historical/era-activations.js";
import { getNonIdeologicalModifier, historicalToCanonical } from "../historical/non-ideological-modifiers.js";
import { buildPopulationRuntimes, POPULATION_ADAPTER_VARIANTS, writePopulationAdapterAudit, } from "./populationAdapter.js";
const OUT_DIR = join("results", "counterfactuals");
const SOURCE_CSV = join(OUT_DIR, "source-1976-2020-president.csv");
const PRESIDENT_RESULTS_URL = "https://huggingface.co/datasets/fdaudens/us-presidential-elections/resolve/main/1976-2020-president.csv?download=true";
const SCORING_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB",
];
const CATEGORICAL_NODES = ["EPS", "AES"];
const SALIENCE_POWERS = [1, 1.5, 2];
const ELECTORAL_VOTES_2016 = {
    AL: 9, AK: 3, AZ: 11, AR: 6, CA: 55, CO: 9, CT: 7, DE: 3, DC: 3,
    FL: 29, GA: 16, HI: 4, ID: 4, IL: 20, IN: 11, IA: 6, KS: 6, KY: 8,
    LA: 8, ME: 4, MD: 10, MA: 11, MI: 16, MN: 10, MS: 6, MO: 10, MT: 3,
    NE: 5, NV: 6, NH: 4, NJ: 14, NM: 5, NY: 29, NC: 15, ND: 3, OH: 18,
    OK: 7, OR: 7, PA: 20, RI: 4, SC: 9, SD: 3, TN: 11, TX: 38, UT: 6,
    VT: 3, VA: 13, WA: 12, WV: 5, WI: 10, WY: 3,
};
const KEY_STATES = ["PA", "MI", "WI", "FL", "NC", "AZ", "GA", "NV", "OH", "IA"];
const TRB_ANCHOR_ORDER = [
    "national", "ideological", "religious", "class", "ethnic_racial",
    "gender", "sexual", "global", "mixed_none",
];
const TRB_ANCHOR_BY_CANDIDATE = {
    "Trump_2016": "national",
    "Sanders_2016": "class",
    "H. Clinton_2016": "ideological",
    "Johnson_2016": "mixed_none",
};
const STYLE_DRIVEN_ELECTIONS = {
    1932: 1.4, 1960: 1.4, 1980: 1.5, 2008: 1.4,
    2016: 2.0, 2020: 1.7, 2024: 1.8,
};
const CANDIDATE_GEOMETRIES = [
    "canonical",
    "trump_median_economic",
    "trump_less_anti_procedure",
    "clinton_perceived_technocrat",
    "combined_dem_favorable",
    "combined_trump_favorable",
];
const TURNOUT_REGIMES = [
    "fixed",
    "model_elastic",
    "youth_left_boost",
    "black_turnout_risk",
    "rustbelt_populist_boost",
    "suburban_moderate_defection",
    "full_uncertainty_band",
];
const THIRD_PARTY_REGIMES = [
    "none",
    "stein_soft",
    "stein_high",
    "stein_high_johnson_low",
    "mixed_third_party",
];
const STATE_REGIMES = [
    "uniform",
    "rustbelt_boost",
    "florida_socialism_penalty",
    "sunbelt_suburban_penalty",
    "combined_balanced",
    "combined_adverse",
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
    const rows = parseCsv(readFileSync(SOURCE_CSV, "utf-8"));
    const headers = rows.shift();
    if (!headers)
        return [];
    return rows
        .filter((r) => r.length === headers.length)
        .map((r) => Object.fromEntries(headers.map((h, i) => [h, r[i] ?? ""])));
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
        };
        rec.totalVotes = Math.max(rec.totalVotes, totalVotes);
        if (row.party_simplified === "DEMOCRAT")
            rec.demVotes += votes;
        if (row.party_simplified === "REPUBLICAN")
            rec.repVotes += votes;
        states.set(statePo, rec);
    }
    return [...states.values()].map((rec) => ({
        ...rec,
        demTwoParty: (rec.demVotes + rec.repVotes) > 0 ? rec.demVotes / (rec.demVotes + rec.repVotes) : 0,
    }));
}
function election2016() {
    const election = ELECTIONS.find((e) => e.year === 2016);
    if (!election)
        throw new Error("Missing 2016 election");
    return election.candidates;
}
function cloneCandidate(candidate) {
    return { ...candidate };
}
function applyCandidateGeometry(candidates, geometry) {
    return candidates.map((candidate) => {
        const c = cloneCandidate(candidate);
        if (c.name === "Trump") {
            if (geometry === "trump_median_economic")
                c.MAT = 3;
            if (geometry === "trump_less_anti_procedure")
                c.PRO = 1.75;
            if (geometry === "combined_dem_favorable") {
                c.MAT = 4.5;
                c.PRO = 1;
                c.PF = 3;
            }
            if (geometry === "combined_trump_favorable") {
                c.MAT = 3;
                c.PRO = 1.5;
                c.PF = 5;
                c.ONT_S = 1.5;
            }
        }
        if (c.name === "H. Clinton") {
            if (geometry === "clinton_perceived_technocrat" || geometry === "combined_dem_favorable") {
                c.MAT = 2.7;
                c.ONT_S = 5;
                c.AES = 1;
            }
            if (geometry === "combined_trump_favorable") {
                c.MAT = 2.8;
                c.ONT_S = 4;
                c.AES = 0;
            }
        }
        return c;
    });
}
function makeSandersScenarios() {
    const clinton = election2016().find((c) => c.name === "H. Clinton");
    if (!clinton)
        throw new Error("Missing Clinton profile");
    const sanders = (overrides) => ({
        ...clinton,
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
                MAT: [1, 1], CD: [1.5, 2.5], CU: [2.5, 3.5], MOR: [4, 5],
                PRO: [1.5, 2.5], COM: [1, 2], ZS: [3.5, 4.5],
                ONT_H: [3.5, 4.5], ONT_S: [1.5, 2.5], PF: [3.5, 4.5], TRB: [3, 4],
            },
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
                MAT: [1, 1.3], CD: [2, 3], CU: [2.5, 3.5], MOR: [3.5, 4.5],
                PRO: [1, 2], COM: [1, 2], ZS: [4, 5],
                ONT_H: [3, 4], ONT_S: [1, 2], PF: [3.5, 4.5], TRB: [3, 4],
            },
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
                MAT: [1, 1.2], CD: [2.2, 3.2], CU: [2.5, 3.3], MOR: [3.5, 4.5],
                PRO: [1.5, 2.5], COM: [1, 2], ZS: [4, 5],
                ONT_H: [3.5, 4.5], ONT_S: [1.2, 2.3], PF: [3.5, 4.5], TRB: [3.5, 4.5],
            },
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
                MAT: [1, 1.2], CD: [1.3, 2.3], CU: [2.8, 3.8], MOR: [4, 5],
                PRO: [1.5, 2.4], COM: [1, 2], ZS: [3.4, 4.6],
                ONT_H: [3.8, 4.8], ONT_S: [1.5, 2.5], PF: [3.5, 4.5], TRB: [3, 4],
            },
        },
    ];
}
function replaceClintonWithSanders(candidates, sanders) {
    return candidates.map((c) => c.name === "H. Clinton" ? { ...sanders } : { ...c });
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
function partyMultiplier(candidateParty, partyID, pfPos, year) {
    if (year < 1932 || !partyID || partyID === "I" || partyID === "N")
        return 1;
    const cand = partyBucket(candidateParty);
    const user = partyID === "D" ? "D" : partyID === "R" ? "R" : "T";
    if (cand === user)
        return 1;
    const pf = Math.max(1, Math.min(5, pfPos ?? 3));
    return 1 + 0.40 * (pf / 5);
}
function categoricalContribution(candidate, entry, node, year, kernel) {
    if (!entry?.catDist)
        return { contribution: 0, weight: 0 };
    const candIdx = candidate[node];
    const alignment = entry.catDist[candIdx] ?? 0;
    const eraMult = STYLE_DRIVEN_ELECTIONS[year] ?? 1;
    const baseSal = 0.6 * eraMult * kernel.styleScale;
    const effectiveSal = Math.pow(baseSal, kernel.saliencePower);
    return {
        contribution: effectiveSal * (1 - alignment) * 4,
        weight: effectiveSal,
    };
}
function trbAnchorContribution(candidate, kernel) {
    const anchor = TRB_ANCHOR_BY_CANDIDATE[`${candidate.name}_${candidate.year}`];
    if (!anchor)
        return { contribution: 0, weight: 0 };
    const idx = TRB_ANCHOR_ORDER.indexOf(anchor);
    if (idx < 0)
        return { contribution: 0, weight: 0 };
    // Aggregate archetype rows do not carry respondent anchor posterior. Keep
    // candidate-anchor contribution zero here; this is a labeled limitation.
    void kernel;
    return { contribution: 0, weight: 0 };
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
        const effectiveSal = Math.pow(rawSal, kernel.saliencePower);
        const diff = entry.pos - candidate[node];
        weighted += effectiveSal * diff * diff;
        weight += effectiveSal;
    }
    for (const node of CATEGORICAL_NODES) {
        const r = categoricalContribution(candidate, runtime.sig[node], node, candidate.year, kernel);
        weighted += r.contribution;
        weight += r.weight;
    }
    const anchor = trbAnchorContribution(candidate, kernel);
    weighted += anchor.contribution;
    weight += anchor.weight;
    let distance = weight > 0 ? Math.sqrt(weighted / weight) : 4;
    if (kernel.nonIdeo) {
        distance -= getNonIdeologicalModifier(candidate.year, historicalToCanonical(candidate.name, candidate.year)).total;
    }
    distance *= partyMultiplier(candidate.party, runtime.partyID, runtime.sig.PF?.pos, candidate.year);
    const bar = clearingBar(runtime.engagement);
    return {
        nearestName: candidate.name,
        nearestParty: candidate.party,
        nearestDistance: distance,
        clearingBar: bar,
        decision: distance <= bar ? "vote" : "abstain",
    };
}
function predictAll(runtimes, candidates, kernel) {
    const preds = new Map();
    for (const runtime of runtimes) {
        const scores = candidates
            .map((candidate) => scoreCandidate(runtime, candidate, kernel))
            .sort((a, b) => a.nearestDistance - b.nearestDistance);
        preds.set(runtime.archetype.id, scores[0]);
    }
    return preds;
}
function continuousPos(runtime, node, fallback = 3) {
    return runtime.sig[node]?.pos ?? fallback;
}
function isYouthLeft(runtime) {
    return continuousPos(runtime, "MAT") <= 2.3 &&
        continuousPos(runtime, "CD") <= 2.6 &&
        continuousPos(runtime, "ONT_H") >= 3.4;
}
function isBlackCoalitionProxy(runtime) {
    return ["010", "005", "045", "048", "088", "128"].includes(runtime.archetype.id) ||
        (runtime.partyID === "D" && continuousPos(runtime, "CU") >= 3.2 && continuousPos(runtime, "TRB") >= 2.8);
}
function isRustbeltClassProxy(runtime) {
    return /labor|class|bread|rooted|solidar/i.test(runtime.archetype.name) ||
        (continuousPos(runtime, "MAT") <= 2.5 && continuousPos(runtime, "ZS") >= 3.2 && continuousPos(runtime, "TRB") >= 3.2);
}
function isSuburbanModerateProxy(runtime) {
    return continuousPos(runtime, "MAT") >= 2 &&
        continuousPos(runtime, "MAT") <= 4 &&
        continuousPos(runtime, "PRO") >= 3.8 &&
        continuousPos(runtime, "ONT_S") >= 3.5;
}
function shouldVote(runtime, pred, baselinePred, regime) {
    if (regime === "fixed")
        return baselinePred.decision === "vote";
    if (pred.decision === "vote")
        return true;
    const near = pred.nearestDistance <= pred.clearingBar + 0.25;
    if (!near || pred.nearestName !== "Sanders")
        return false;
    return (regime === "youth_left_boost" && isYouthLeft(runtime)) ||
        (regime === "rustbelt_populist_boost" && isRustbeltClassProxy(runtime)) ||
        (regime === "full_uncertainty_band" && (isYouthLeft(runtime) || isRustbeltClassProxy(runtime)));
}
function turnoutMultiplier(runtime, pred, regime) {
    let mult = 1;
    if (regime === "youth_left_boost" && pred.nearestName === "Sanders" && isYouthLeft(runtime))
        mult *= 1.15;
    if (regime === "black_turnout_risk" && pred.nearestName === "Sanders" && isBlackCoalitionProxy(runtime))
        mult *= 0.88;
    if (regime === "rustbelt_populist_boost" && pred.nearestName === "Sanders" && isRustbeltClassProxy(runtime))
        mult *= 1.12;
    if (regime === "suburban_moderate_defection" && isSuburbanModerateProxy(runtime)) {
        mult *= pred.nearestName === "Sanders" ? 0.90 : 1.08;
    }
    if (regime === "full_uncertainty_band") {
        if (pred.nearestName === "Sanders" && isYouthLeft(runtime))
            mult *= 1.12;
        if (pred.nearestName === "Sanders" && isBlackCoalitionProxy(runtime))
            mult *= 0.90;
        if (pred.nearestName === "Sanders" && isRustbeltClassProxy(runtime))
            mult *= 1.08;
        if (isSuburbanModerateProxy(runtime))
            mult *= pred.nearestName === "Sanders" ? 0.92 : 1.05;
    }
    return Math.max(0.55, Math.min(1.25, mult));
}
function aggregatePredictions(runtimes, preds, baselinePreds, turnoutRegime) {
    let dem = 0;
    let rep = 0;
    let third = 0;
    let abstain = 0;
    for (const runtime of runtimes) {
        const pred = preds.get(runtime.archetype.id);
        const baselinePred = baselinePreds.get(runtime.archetype.id);
        if (!shouldVote(runtime, pred, baselinePred, turnoutRegime)) {
            abstain += runtime.weight;
            continue;
        }
        const adjustedWeight = runtime.weight * turnoutMultiplier(runtime, pred, turnoutRegime);
        const bucket = partyBucket(pred.nearestParty);
        if (bucket === "D")
            dem += adjustedWeight;
        else if (bucket === "R")
            rep += adjustedWeight;
        else
            third += adjustedWeight;
    }
    const total = dem + rep + third + abstain;
    if (total > 0) {
        dem /= total;
        rep /= total;
        third /= total;
        abstain /= total;
    }
    return { dem, rep, third, abstain, voterMass: dem + rep + third };
}
function thirdPartyFractions(regime) {
    if (regime === "stein_soft")
        return { dem: 0.15, rep: 0.05 };
    if (regime === "stein_high")
        return { dem: 0.25, rep: 0.05 };
    if (regime === "stein_high_johnson_low")
        return { dem: 0.20, rep: 0.15 };
    if (regime === "mixed_third_party")
        return { dem: 0.15, rep: 0.25 };
    return { dem: 0, rep: 0 };
}
function applyThirdPartyRegime(mass, regime) {
    const frac = thirdPartyFractions(regime);
    const demGain = mass.third * frac.dem;
    const repGain = mass.third * frac.rep;
    return {
        ...mass,
        dem: mass.dem + demGain,
        rep: mass.rep + repGain,
        third: Math.max(0, mass.third - demGain - repGain),
    };
}
function demTwoParty(mass) {
    return (mass.dem + mass.rep) > 0 ? mass.dem / (mass.dem + mass.rep) : 0;
}
function share(mass, key) {
    return mass[key] * 100;
}
function stateAdjustment(statePo, regime) {
    const rust = new Set(["PA", "MI", "WI", "OH", "IA", "ME"]);
    const sunbelt = new Set(["AZ", "GA", "NC", "VA", "CO"]);
    if (regime === "rustbelt_boost")
        return rust.has(statePo) ? 0.015 : 0;
    if (regime === "florida_socialism_penalty")
        return statePo === "FL" ? -0.025 : 0;
    if (regime === "sunbelt_suburban_penalty")
        return sunbelt.has(statePo) ? -0.012 : 0;
    if (regime === "combined_balanced") {
        if (rust.has(statePo))
            return 0.012;
        if (statePo === "FL")
            return -0.025;
        if (sunbelt.has(statePo))
            return -0.010;
        if (statePo === "NV")
            return 0.005;
    }
    if (regime === "combined_adverse") {
        if (rust.has(statePo))
            return 0.006;
        if (statePo === "FL")
            return -0.040;
        if (sunbelt.has(statePo))
            return -0.020;
        if (["GA", "NC", "MI", "PA", "WI", "OH"].includes(statePo))
            return -0.008;
    }
    return 0;
}
function stateSummary(states, counter, baseline, stateRegime) {
    const nationalSwing = demTwoParty(counter) - demTwoParty(baseline);
    let demEv = 0;
    let repEv = 0;
    const keyResults = {};
    const tipping = [];
    for (const state of states) {
        const shifted = Math.max(0, Math.min(1, state.demTwoParty + nationalSwing + stateAdjustment(state.statePo, stateRegime)));
        const demWin = shifted >= 0.5;
        const ev = ELECTORAL_VOTES_2016[state.statePo] ?? 0;
        if (demWin)
            demEv += ev;
        else
            repEv += ev;
        if (KEY_STATES.includes(state.statePo)) {
            keyResults[state.statePo] = `${demWin ? "D" : "R"} ${round(Math.abs(shifted - 0.5) * 100, 2)}%`;
        }
        tipping.push({ state: state.statePo, winner: demWin ? "D" : "R", margin: Math.abs(shifted - 0.5) });
    }
    tipping.sort((a, b) => a.margin - b.margin);
    return {
        state_regime: stateRegime,
        dem_ev: demEv,
        rep_ev: repEv,
        winner: demEv >= 270 ? "Sanders/Democratic" : "Trump/Republican",
        tipping_states: tipping.slice(0, 8).map((s) => `${s.state}:${s.winner} ${round(s.margin * 100, 2)}%`).join("; "),
        ...Object.fromEntries(KEY_STATES.map((s) => [`state_${s}`, keyResults[s] ?? ""])),
    };
}
function assumptionTags(row) {
    const tags = [];
    if (row.salience_power !== 2)
        tags.push(`salience=${row.salience_power}`);
    if (row.candidate_geometry !== "canonical")
        tags.push(String(row.candidate_geometry));
    if (row.population_adapter !== "base_only")
        tags.push(String(row.population_adapter));
    if (row.turnout_regime !== "model_elastic")
        tags.push(String(row.turnout_regime));
    if (row.third_party_regime !== "none")
        tags.push(String(row.third_party_regime));
    if (row.state_regime && row.state_regime !== "uniform")
        tags.push(String(row.state_regime));
    return tags.join("; ");
}
function matrixTruthKey(row) {
    return [
        row.population_adapter,
        row.salience_power,
        row.candidate_geometry,
        row.sanders_profile,
        row.turnout_regime,
        row.third_party_regime,
        row.state_regime,
    ].join("|");
}
function buildMatrixRows(states) {
    const nationalRows = [];
    const stateRows = [];
    const truthRows = [];
    const scenarios = makeSandersScenarios();
    const runtimesByAdapter = Object.fromEntries(POPULATION_ADAPTER_VARIANTS.map((variant) => [variant, buildPopulationRuntimes(variant)]));
    for (const populationAdapter of POPULATION_ADAPTER_VARIANTS) {
        const runtimes = runtimesByAdapter[populationAdapter];
        for (const saliencePower of SALIENCE_POWERS) {
            const kernel = { saliencePower, styleScale: 1, nonIdeo: true, partyBase: 0.4 };
            for (const candidateGeometry of CANDIDATE_GEOMETRIES) {
                const baselineCandidates = applyCandidateGeometry(election2016(), candidateGeometry);
                const baselinePreds = predictAll(runtimes, baselineCandidates, kernel);
                const baselineMass = aggregatePredictions(runtimes, baselinePreds, baselinePreds, "model_elastic");
                for (const scenario of scenarios) {
                    const counterCandidates = replaceClintonWithSanders(baselineCandidates, scenario.profile);
                    const counterPreds = predictAll(runtimes, counterCandidates, kernel);
                    for (const turnoutRegime of TURNOUT_REGIMES) {
                        const unadjustedCounter = aggregatePredictions(runtimes, counterPreds, baselinePreds, turnoutRegime);
                        for (const thirdPartyRegime of THIRD_PARTY_REGIMES) {
                            const counter = applyThirdPartyRegime(unadjustedCounter, thirdPartyRegime);
                            const nationalRow = {
                                population_adapter: populationAdapter,
                                salience_power: saliencePower,
                                candidate_geometry: candidateGeometry,
                                sanders_profile: scenario.id,
                                turnout_regime: turnoutRegime,
                                third_party_regime: thirdPartyRegime,
                                baseline_dem_two_party: round(demTwoParty(baselineMass) * 100, 3),
                                dem_share: round(share(counter, "dem"), 3),
                                rep_share: round(share(counter, "rep"), 3),
                                third_share: round(share(counter, "third"), 3),
                                abstain_share: round(share(counter, "abstain"), 3),
                                dem_two_party: round(demTwoParty(counter) * 100, 3),
                                dem_two_party_delta_vs_baseline: round((demTwoParty(counter) - demTwoParty(baselineMass)) * 100, 3),
                                national_winner: demTwoParty(counter) >= 0.5 ? "Sanders/Democratic" : "Trump/Republican",
                            };
                            nationalRows.push(nationalRow);
                            for (const stateRegime of STATE_REGIMES) {
                                const state = stateSummary(states, counter, baselineMass, stateRegime);
                                const stateRow = {
                                    ...nationalRow,
                                    ...state,
                                };
                                stateRow["assumption_tags"] = assumptionTags(stateRow);
                                stateRows.push(stateRow);
                                truthRows.push({
                                    key: matrixTruthKey(stateRow),
                                    population_adapter: populationAdapter,
                                    salience_power: saliencePower,
                                    candidate_geometry: candidateGeometry,
                                    sanders_profile: scenario.id,
                                    turnout_regime: turnoutRegime,
                                    third_party_regime: thirdPartyRegime,
                                    state_regime: stateRegime,
                                    national_dem_two_party: nationalRow.dem_two_party,
                                    national_winner: nationalRow.national_winner,
                                    dem_ev: state.dem_ev,
                                    winner: state.winner,
                                    PA: state.state_PA,
                                    MI: state.state_MI,
                                    WI: state.state_WI,
                                    FL: state.state_FL,
                                    NC: state.state_NC,
                                    AZ: state.state_AZ,
                                    GA: state.state_GA,
                                    NV: state.state_NV,
                                    assumption_tags: stateRow["assumption_tags"],
                                });
                            }
                        }
                    }
                }
            }
        }
    }
    return { nationalRows, stateRows, truthRows };
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
function pick(rng, values) {
    return values[Math.min(values.length - 1, Math.floor(rng() * values.length))];
}
function sampleRange(rng, range, fallback) {
    if (!range)
        return fallback;
    return range[0] + (range[1] - range[0]) * rng();
}
function jitterSanders(rng, scenario) {
    const profile = { ...scenario.profile };
    for (const key of [
        "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
    ]) {
        profile[key] = sampleRange(rng, scenario.ranges[key], Number(profile[key]));
    }
    return profile;
}
function jitterWeights(runtimes, rng) {
    const multipliers = runtimes.map(() => 0.85 + rng() * 0.30);
    const total = runtimes.reduce((sum, rt, i) => sum + rt.weight * multipliers[i], 0);
    return runtimes.map((rt, i) => ({
        ...rt,
        weight: total > 0 ? (rt.weight * multipliers[i]) / total : rt.weight,
    }));
}
function runMonteCarlo(states, reps) {
    const scenarios = makeSandersScenarios();
    const rows = [];
    const plausibleAdapters = ["base_only", "identity_coalition_proxy"];
    const plausibleGeometries = [
        "canonical",
        "trump_median_economic",
        "clinton_perceived_technocrat",
        "combined_dem_favorable",
        "combined_trump_favorable",
    ];
    const plausibleTurnout = [
        "model_elastic",
        "youth_left_boost",
        "black_turnout_risk",
        "rustbelt_populist_boost",
        "suburban_moderate_defection",
        "full_uncertainty_band",
    ];
    const plausibleThird = THIRD_PARTY_REGIMES;
    const plausibleState = STATE_REGIMES;
    for (let rep = 0; rep < reps; rep++) {
        const rng = mulberry32(90001 + rep * 7919);
        const populationAdapter = pick(rng, plausibleAdapters);
        const runtimes = jitterWeights(buildPopulationRuntimes(populationAdapter), rng);
        const saliencePower = 1 + rng();
        const candidateGeometry = pick(rng, plausibleGeometries);
        const sandersScenario = pick(rng, scenarios);
        const turnoutRegime = pick(rng, plausibleTurnout);
        const thirdPartyRegime = pick(rng, plausibleThird);
        const stateRegime = pick(rng, plausibleState);
        const kernel = { saliencePower, styleScale: 1, nonIdeo: true, partyBase: 0.4 };
        const baselineCandidates = applyCandidateGeometry(election2016(), candidateGeometry);
        const baselinePreds = predictAll(runtimes, baselineCandidates, kernel);
        const baselineMass = aggregatePredictions(runtimes, baselinePreds, baselinePreds, "model_elastic");
        const counterCandidates = replaceClintonWithSanders(baselineCandidates, jitterSanders(rng, sandersScenario));
        const counterPreds = predictAll(runtimes, counterCandidates, kernel);
        const counter = applyThirdPartyRegime(aggregatePredictions(runtimes, counterPreds, baselinePreds, turnoutRegime), thirdPartyRegime);
        const state = stateSummary(states, counter, baselineMass, stateRegime);
        rows.push({
            rep,
            population_adapter: populationAdapter,
            salience_power: round(saliencePower, 3),
            candidate_geometry: candidateGeometry,
            sanders_profile: sandersScenario.id,
            turnout_regime: turnoutRegime,
            third_party_regime: thirdPartyRegime,
            state_regime: stateRegime,
            baseline_dem_two_party: round(demTwoParty(baselineMass) * 100, 3),
            dem_two_party: round(demTwoParty(counter) * 100, 3),
            dem_two_party_delta_vs_baseline: round((demTwoParty(counter) - demTwoParty(baselineMass)) * 100, 3),
            dem_ev: state.dem_ev,
            rep_ev: state.rep_ev,
            sanders_wins: Number(state.dem_ev) >= 270 ? 1 : 0,
            tipping_states: state.tipping_states,
        });
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
function groupedWinRows(rows, key) {
    const groups = new Map();
    for (const row of rows) {
        const k = String(row[key]);
        groups.set(k, [...(groups.get(k) ?? []), row]);
    }
    return [...groups.entries()]
        .map(([value, subset]) => {
        const ev = subset.map((r) => Number(r.dem_ev));
        const wins = subset.reduce((sum, r) => sum + (Number(r.dem_ev) >= 270 ? 1 : 0), 0);
        return {
            dimension: key,
            value,
            rows: subset.length,
            win_rate: round(wins / subset.length * 100, 2),
            median_ev: round(percentile(ev, 0.5), 0),
            ev_p05: round(percentile(ev, 0.05), 0),
            ev_p95: round(percentile(ev, 0.95), 0),
        };
    })
        .sort((a, b) => String(a.dimension).localeCompare(String(b.dimension)) || Number(b.win_rate) - Number(a.win_rate));
}
function writeTruthTableReport(nationalRows, stateRows, mcRows) {
    const totalState = stateRows.length;
    const wins = stateRows.reduce((sum, r) => sum + (Number(r.dem_ev) >= 270 ? 1 : 0), 0);
    const plausible = stateRows.filter((r) => ["base_only", "identity_coalition_proxy"].includes(String(r.population_adapter)) &&
        Number(r.salience_power) <= 1.5 &&
        !["combined_trump_favorable"].includes(String(r.candidate_geometry)) &&
        ["combined_balanced", "uniform", "rustbelt_boost"].includes(String(r.state_regime)));
    const plausibleWins = plausible.reduce((sum, r) => sum + (Number(r.dem_ev) >= 270 ? 1 : 0), 0);
    const mcWins = mcRows.reduce((sum, r) => sum + Number(r.sanders_wins), 0);
    const mcEv = mcRows.map((r) => Number(r.dem_ev));
    const topWinRows = stateRows
        .slice()
        .sort((a, b) => Number(b.dem_ev) - Number(a.dem_ev))
        .slice(0, 8);
    const topLossRows = stateRows
        .slice()
        .sort((a, b) => Number(a.dem_ev) - Number(b.dem_ev))
        .slice(0, 8);
    const lines = [
        "# Bernie 2016 Matrix Truth Table",
        "",
        "This report is a diagnostic assumption sweep, not a production prediction. It asks which Bernie 2016 outcomes survive across named model choices.",
        "",
        "## Run Order Completion",
        "",
        "1. Baseline matrix sanity check: completed.",
        "2. Full national matrix: completed.",
        "3. State-modified matrix: completed.",
        "4. Monte Carlo over plausible bands: completed.",
        "5. Final report and decision-grade diagnostic: completed.",
        "",
        "## Headline",
        "",
        `- National matrix rows: ${nationalRows.length}`,
        `- State matrix rows: ${stateRows.length}`,
        `- Sanders wins in ${round(wins / totalState * 100, 2)}% of state-matrix rows.`,
        `- Sanders wins in ${round(plausibleWins / plausible.length * 100, 2)}% of the narrower plausible subset (${plausible.length} rows).`,
        `- Monte Carlo win rate: ${round(mcWins / mcRows.length * 100, 2)}%; median EV ${round(percentile(mcEv, 0.5), 0)}; 5/95 EV band ${round(percentile(mcEv, 0.05), 0)}-${round(percentile(mcEv, 0.95), 0)}.`,
        "",
        "## Best-Case Rows",
        "",
        "| EV | profile | salience | geometry | adapter | turnout | third-party | state | national D two-party | key states |",
        "|---:|---|---:|---|---|---|---|---|---:|---|",
        ...topWinRows.map((r) => `| ${r.dem_ev} | ${r.sanders_profile} | ${r.salience_power} | ${r.candidate_geometry} | ${r.population_adapter} | ${r.turnout_regime} | ${r.third_party_regime} | ${r.state_regime} | ${r.dem_two_party}% | PA ${r.state_PA}; MI ${r.state_MI}; WI ${r.state_WI}; FL ${r.state_FL} |`),
        "",
        "## Worst-Case Rows",
        "",
        "| EV | profile | salience | geometry | adapter | turnout | third-party | state | national D two-party | key states |",
        "|---:|---|---:|---|---|---|---|---|---:|---|",
        ...topLossRows.map((r) => `| ${r.dem_ev} | ${r.sanders_profile} | ${r.salience_power} | ${r.candidate_geometry} | ${r.population_adapter} | ${r.turnout_regime} | ${r.third_party_regime} | ${r.state_regime} | ${r.dem_two_party}% | PA ${r.state_PA}; MI ${r.state_MI}; WI ${r.state_WI}; FL ${r.state_FL} |`),
        "",
        "## Decision-Grade Diagnostic",
        "",
        "Verdict: not decision-grade yet.",
        "",
        "Reasons:",
        "- The baseline failure diagnostic still fails: base-only 2016 remains materially too Republican and the modern residual band is too large.",
        "- The outcome is sensitive to perceived candidate geometry and turnout assumptions, especially perceived/attack Sanders and Black-turnout/suburban-defection penalties.",
        "- State allocation remains a hand-coded modifier layer, not a CCES/ACS poststratified state model.",
        "- Identity-primary behavior is still represented as a base-exclusion/proxy sensitivity rather than respondent-level overlay validation.",
        "",
        "What the matrix does support: a directional statement that Sanders can win under static/platform or left-populist assumptions, but loses or becomes coin-flippy when attack-framed anti-system perception, Black-turnout risk, Florida socialism penalty, and suburban moderate defection are active together.",
        "",
    ];
    writeFileSync(join(OUT_DIR, "bernie-2016-truth-table.md"), lines.join("\n"), "utf-8");
}
function writeDecisionGradeReport(stateRows, mcRows) {
    const baseOnlyRows = stateRows.filter((r) => r.population_adapter === "base_only");
    const baseOnlyWins = baseOnlyRows.reduce((sum, r) => sum + (Number(r.dem_ev) >= 270 ? 1 : 0), 0);
    const mcWins = mcRows.reduce((sum, r) => sum + Number(r.sanders_wins), 0);
    const ev = mcRows.map((r) => Number(r.dem_ev));
    const lines = [
        "# Decision-Grade Diagnostic",
        "",
        "Decision-grade prediction allowed: no.",
        "",
        "| gate | status | evidence |",
        "|---|---|---|",
        "| Baseline validation | fail | Existing baseline diagnostic selected `base_only` but still marked status `fail`; modern residuals remain too large. |",
        `| Assumption stability | warning | Base-only state-matrix win rate is ${round(baseOnlyWins / baseOnlyRows.length * 100, 2)}%, which leans Sanders, but the remaining losses cluster in plausible perceived-attack/turnout-risk settings. |`,
        `| Monte Carlo stability | warning | Monte Carlo win rate is ${round(mcWins / mcRows.length * 100, 2)}%, EV 5/50/95 = ${round(percentile(ev, 0.05), 0)}/${round(percentile(ev, 0.5), 0)}/${round(percentile(ev, 0.95), 0)}. |`,
        "| State grounding | fail | State modifiers are hand-coded directional adjustments, not CCES/ACS MRP. |",
        "| Identity overlay grounding | fail | Identity-primary voters are excluded/proxied, not resolved from respondent-level demographic anchors. |",
        "",
        "Use the matrix to prioritize calibration, not as a final historical claim.",
        "",
    ];
    writeFileSync(join(OUT_DIR, "bernie-2016-decision-grade-diagnostic.md"), lines.join("\n"), "utf-8");
}
async function main() {
    mkdirSync(OUT_DIR, { recursive: true });
    await ensureSourceCsv();
    writePopulationAdapterAudit(join(OUT_DIR, "population-adapter-audit.json"));
    const states = actualState2016(loadPresidentRows());
    const { nationalRows, stateRows, truthRows } = buildMatrixRows(states);
    writeCsv(join(OUT_DIR, "bernie-2016-matrix.csv"), nationalRows);
    writeCsv(join(OUT_DIR, "bernie-2016-state-matrix.csv"), stateRows);
    writeCsv(join(OUT_DIR, "bernie-2016-truth-table.csv"), truthRows);
    const assumptionRows = [
        ...groupedWinRows(stateRows, "population_adapter"),
        ...groupedWinRows(stateRows, "salience_power"),
        ...groupedWinRows(stateRows, "candidate_geometry"),
        ...groupedWinRows(stateRows, "sanders_profile"),
        ...groupedWinRows(stateRows, "turnout_regime"),
        ...groupedWinRows(stateRows, "third_party_regime"),
        ...groupedWinRows(stateRows, "state_regime"),
    ];
    writeCsv(join(OUT_DIR, "bernie-2016-assumption-winners.csv"), assumptionRows);
    const mcRows = runMonteCarlo(states, 1000);
    writeCsv(join(OUT_DIR, "bernie-2016-matrix-monte-carlo.csv"), mcRows);
    writeTruthTableReport(nationalRows, stateRows, mcRows);
    writeDecisionGradeReport(stateRows, mcRows);
    console.log("Wrote Bernie 2016 matrix outputs to", OUT_DIR);
    console.log(JSON.stringify({
        nationalRows: nationalRows.length,
        stateRows: stateRows.length,
        truthRows: truthRows.length,
        monteCarloRows: mcRows.length,
    }));
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=counterfactual-2016-matrix.js.map