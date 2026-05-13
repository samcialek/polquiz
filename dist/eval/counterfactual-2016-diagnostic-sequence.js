/**
 * Modular diagnostic sequence for PRISM 2016 / Bernie counterfactual work.
 *
 * Runs modules 0-5 in order:
 * 0. Control run
 * 1. Baseline calibration grid
 * 2. Candidate geometry audit
 * 3. 2016 bloc constraint check
 * 4. Knife-edge archetype audit
 * 5. Turnout module split
 *
 * This is diagnostic-only and does not mutate production scoring.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { getActivationMultiplier } from "../historical/era-activations.js";
import { getNonIdeologicalModifier, historicalToCanonical } from "../historical/non-ideological-modifiers.js";
import { buildPopulationRuntimes, POPULATION_ADAPTER_VARIANTS, writePopulationAdapterAudit, } from "./populationAdapter.js";
const ROOT_OUT_DIR = join("results", "counterfactuals");
const RUN_ID = new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "").replace("T", "-");
const OUT_DIR = join(ROOT_OUT_DIR, `diagnostic-sequence-${RUN_ID}`);
const LATEST_POINTER = join(ROOT_OUT_DIR, "diagnostic-sequence-latest.json");
const SOURCE_CSV = join(ROOT_OUT_DIR, "source-1976-2020-president.csv");
const PRESIDENT_RESULTS_URL = "https://huggingface.co/datasets/fdaudens/us-presidential-elections/resolve/main/1976-2020-president.csv?download=true";
const MODERN_YEARS = [1976, 1980, 1984, 1988, 1992, 1996, 2000, 2004, 2008, 2012, 2016, 2020, 2024];
const TRAIN_YEARS = MODERN_YEARS.filter((y) => y !== 2016 && y !== 2024);
const TEST_YEARS = [2016, 2024];
const PRIMARY_ADAPTER = "base_only";
const SCORING_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB",
];
const CATEGORICAL_NODES = ["EPS", "AES"];
const STYLE_DRIVEN_ELECTIONS = {
    1932: 1.4, 1960: 1.4, 1980: 1.5, 2008: 1.4,
    2016: 2.0, 2020: 1.7, 2024: 1.8,
};
const ELECTORAL_VOTES_2016 = {
    AL: 9, AK: 3, AZ: 11, AR: 6, CA: 55, CO: 9, CT: 7, DE: 3, DC: 3,
    FL: 29, GA: 16, HI: 4, ID: 4, IL: 20, IN: 11, IA: 6, KS: 6, KY: 8,
    LA: 8, ME: 4, MD: 10, MA: 11, MI: 16, MN: 10, MS: 6, MO: 10, MT: 3,
    NE: 5, NV: 6, NH: 4, NJ: 14, NM: 5, NY: 29, NC: 15, ND: 3, OH: 18,
    OK: 7, OR: 7, PA: 20, RI: 4, SC: 9, SD: 3, TN: 11, TX: 38, UT: 6,
    VT: 3, VA: 13, WA: 12, WV: 5, WI: 10, WY: 3,
};
const CANONICAL_KERNEL = {
    saliencePower: 2,
    nonIdeoScale: 1,
    partyBase: 0.4,
    clearingScale: 1,
    styleScale: 1,
};
const BEST_GRID_KERNEL = {
    saliencePower: 1,
    nonIdeoScale: 0,
    partyBase: 0.4,
    clearingScale: 1.1,
    styleScale: 0.5,
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
    mkdirSync(ROOT_OUT_DIR, { recursive: true });
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
    // 2024 is not in the source CSV.
    byYear.set(2024, {
        DEMOCRAT: 48.3,
        REPUBLICAN: 49.8,
        IS_PERCENT: 1,
    });
    return byYear;
}
function actualDemTwoParty(actualByYear, year) {
    const rec = actualByYear.get(year);
    if (!rec)
        return null;
    if (rec.IS_PERCENT)
        return rec.DEMOCRAT / (rec.DEMOCRAT + rec.REPUBLICAN);
    const d = rec.DEMOCRAT ?? 0;
    const r = rec.REPUBLICAN ?? 0;
    return (d + r) > 0 ? d / (d + r) : null;
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
        if (row.party_simplified === "DEMOCRAT")
            rec.demVotes += votes;
        if (row.party_simplified === "REPUBLICAN")
            rec.repVotes += votes;
        rec.totalVotes = Math.max(rec.totalVotes, totalVotes);
        states.set(statePo, rec);
    }
    return [...states.values()].map((rec) => ({
        ...rec,
        demTwoParty: (rec.demVotes + rec.repVotes) > 0 ? rec.demVotes / (rec.demVotes + rec.repVotes) : 0,
    }));
}
function electionForYear(year) {
    const election = ELECTIONS.find((e) => e.year === year);
    if (!election)
        throw new Error(`Missing election ${year}`);
    return election.candidates.map((c) => ({ ...c }));
}
function partyBucket(party) {
    if (party === "Democratic" || party === "Democratic-Republican" || party === "Free Soil" || party === "Dixiecrat")
        return "D";
    if (party === "Republican" || party === "National Republican" || party === "Federalist" || party === "Whig")
        return "R";
    return "T";
}
function clearingBar(level, scale) {
    const base = level === "apolitical" ? 0.95 : level === "casual" ? 1.40 : level === "engaged" ? 1.70 : 1.85;
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
    const bar = clearingBar(runtime.engagement, kernel.clearingScale);
    return {
        nearestName: candidate.name,
        nearestParty: candidate.party,
        nearestDistance: distance,
        clearingBar: bar,
        decision: distance <= bar ? "vote" : "abstain",
        secondName: "",
        secondDistance: 0,
        margin: 0,
    };
}
function predictRuntime(runtime, candidates, kernel) {
    const scored = candidates
        .map((candidate) => scoreCandidate(runtime, candidate, kernel))
        .sort((a, b) => a.nearestDistance - b.nearestDistance);
    const first = scored[0];
    const second = scored[1] ?? first;
    return {
        ...first,
        secondName: second.nearestName,
        secondDistance: second.nearestDistance,
        margin: second.nearestDistance - first.nearestDistance,
    };
}
function aggregateElection(runtimes, year, candidates, kernel) {
    let dem = 0;
    let rep = 0;
    let third = 0;
    let abstain = 0;
    for (const runtime of runtimes) {
        const pred = predictRuntime(runtime, candidates, kernel);
        if (pred.decision === "abstain") {
            abstain += runtime.weight;
            continue;
        }
        const bucket = partyBucket(pred.nearestParty);
        if (bucket === "D")
            dem += runtime.weight;
        else if (bucket === "R")
            rep += runtime.weight;
        else
            third += runtime.weight;
    }
    const voters = dem + rep + third;
    void year;
    return { dem, rep, third, abstain, voterMass: voters };
}
function demTwoParty(agg) {
    return (agg.dem + agg.rep) > 0 ? agg.dem / (agg.dem + agg.rep) : 0;
}
function continuousPos(rt, node, fallback = 3) {
    return rt.sig[node]?.pos ?? fallback;
}
function isYouthLeft(rt) {
    return continuousPos(rt, "MAT") <= 2.3 && continuousPos(rt, "CD") <= 2.6 && continuousPos(rt, "ONT_H") >= 3.4;
}
function isBlackCoalitionProxy(rt) {
    return ["010", "005", "045", "048", "088", "128"].includes(rt.archetype.id) ||
        (rt.partyID === "D" && continuousPos(rt, "CU") >= 3.2 && continuousPos(rt, "TRB") >= 2.8);
}
function isWhiteNonCollegeProxy(rt) {
    return continuousPos(rt, "CD") >= 3.3 && (continuousPos(rt, "CU") <= 2.7 || continuousPos(rt, "ONT_S") <= 2.5);
}
function isWhiteCollegeSuburbanProxy(rt) {
    return continuousPos(rt, "PRO") >= 3.7 && continuousPos(rt, "ONT_S") >= 3.3 && continuousPos(rt, "CD") <= 3.7;
}
function isLatinoProxy(rt) {
    return rt.partyID === "D" && continuousPos(rt, "CU") >= 3.5 && continuousPos(rt, "MOR") >= 3;
}
function isCubanFlProxy(rt) {
    return rt.partyID === "R" && continuousPos(rt, "CD") >= 3.4 && continuousPos(rt, "MAT") >= 3;
}
function isJohnsonProxy(rt) {
    return continuousPos(rt, "MAT") >= 3.7 && continuousPos(rt, "CD") <= 2.8 && continuousPos(rt, "PRO") <= 3.5;
}
function isSteinProxy(rt) {
    return continuousPos(rt, "MAT") <= 2 && continuousPos(rt, "ONT_S") <= 2.8 && rt.partyID !== "R";
}
function isObamaTrumpProxy(rt) {
    return isWhiteNonCollegeProxy(rt) && continuousPos(rt, "MAT") <= 3.4 && continuousPos(rt, "ZS") >= 3;
}
function isRustbeltClassProxy(rt) {
    return /labor|class|bread|rooted|solidar/i.test(rt.archetype.name) ||
        (continuousPos(rt, "MAT") <= 2.5 && continuousPos(rt, "ZS") >= 3.2 && continuousPos(rt, "TRB") >= 3.2);
}
function isSuburbanModerateProxy(rt) {
    return continuousPos(rt, "MAT") >= 2 &&
        continuousPos(rt, "MAT") <= 4 &&
        continuousPos(rt, "PRO") >= 3.8 &&
        continuousPos(rt, "ONT_S") >= 3.5;
}
function blocSpecs() {
    return [
        { id: "black_voters_proxy", label: "Black voters proxy", anchorDem: 88, anchorRep: 8, anchorThird: 3, confidence: "medium", note: "Proxy selector, not demographic data.", selector: isBlackCoalitionProxy },
        { id: "latino_overall_proxy", label: "Latino voters proxy", anchorDem: 66, anchorRep: 28, anchorThird: 6, confidence: "low", note: "Uses D/CU/MOR proxy.", selector: isLatinoProxy },
        { id: "cuban_fl_proxy", label: "Cuban Florida proxy", anchorDem: 41, anchorRep: 54, anchorThird: 5, confidence: "low", note: "Uses conservative assimilation/pro-market proxy.", selector: isCubanFlProxy },
        { id: "white_noncollege_proxy", label: "White non-college proxy", anchorDem: 28, anchorRep: 64, anchorThird: 8, confidence: "medium", note: "Uses culturally closed/low-system proxy.", selector: isWhiteNonCollegeProxy },
        { id: "white_college_suburban_proxy", label: "White college/suburban proxy", anchorDem: 45, anchorRep: 48, anchorThird: 7, confidence: "medium", note: "Uses high PRO/ONT_S proxy.", selector: isWhiteCollegeSuburbanProxy },
        { id: "young_voters_proxy", label: "Young voters proxy", anchorDem: 55, anchorRep: 36, anchorThird: 9, confidence: "medium", note: "Uses youth-left disposition proxy.", selector: isYouthLeft },
        { id: "stein_proxy", label: "Stein voter proxy", anchorDem: 0, anchorRep: 0, anchorThird: 100, confidence: "low", note: "Not directly observable without Green candidate in candidate file.", selector: isSteinProxy },
        { id: "johnson_proxy", label: "Johnson voter proxy", anchorDem: 0, anchorRep: 0, anchorThird: 100, confidence: "low", note: "Libertarian proxy.", selector: isJohnsonProxy },
        { id: "obama_trump_proxy", label: "Obama-Trump proxy", anchorDem: 0, anchorRep: 100, anchorThird: 0, confidence: "low", note: "Disposition proxy for crossover voters.", selector: isObamaTrumpProxy },
    ];
}
function candidateGeometry(candidates, geometry) {
    return candidates.map((candidate) => {
        const c = { ...candidate };
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
function applyTurnoutRegime(rt, pred, regime) {
    if (regime === "all_vote")
        return { vote: true, multiplier: 1 };
    let vote = pred.decision === "vote";
    let multiplier = 1;
    if (regime === "loose_bars")
        vote = pred.nearestDistance <= pred.clearingBar * 1.1;
    if (regime === "tight_bars")
        vote = pred.nearestDistance <= pred.clearingBar * 0.9;
    if (regime === "youth_left_boost" && pred.nearestName === "Sanders" && isYouthLeft(rt)) {
        if (pred.nearestDistance <= pred.clearingBar + 0.25)
            vote = true;
        multiplier *= 1.15;
    }
    if (regime === "black_turnout_risk" && pred.nearestName === "Sanders" && isBlackCoalitionProxy(rt))
        multiplier *= 0.88;
    if (regime === "suburban_moderate_defection" && isSuburbanModerateProxy(rt)) {
        multiplier *= pred.nearestName === "Sanders" ? 0.9 : 1.08;
    }
    return { vote, multiplier };
}
function aggregateWithTurnout(runtimes, candidates, kernel, regime) {
    let dem = 0;
    let rep = 0;
    let third = 0;
    let abstain = 0;
    for (const rt of runtimes) {
        const pred = predictRuntime(rt, candidates, kernel);
        const turnout = applyTurnoutRegime(rt, pred, regime);
        if (!turnout.vote) {
            abstain += rt.weight;
            continue;
        }
        const w = rt.weight * turnout.multiplier;
        const bucket = partyBucket(pred.nearestParty);
        if (bucket === "D")
            dem += w;
        else if (bucket === "R")
            rep += w;
        else
            third += w;
    }
    const total = dem + rep + third + abstain;
    return total > 0
        ? { dem: dem / total, rep: rep / total, third: third / total, abstain: abstain / total, voterMass: (dem + rep + third) / total }
        : { dem: 0, rep: 0, third: 0, abstain: 1, voterMass: 0 };
}
function stateEvFromSwing(states, counter, baseline) {
    const swing = demTwoParty(counter) - demTwoParty(baseline);
    let demEv = 0;
    let repEv = 0;
    for (const state of states) {
        const shifted = Math.max(0, Math.min(1, state.demTwoParty + swing));
        const ev = ELECTORAL_VOTES_2016[state.statePo] ?? 0;
        if (shifted >= 0.5)
            demEv += ev;
        else
            repEv += ev;
    }
    return { demEv, repEv };
}
function makeSanders(base, id) {
    if (id === "perceived") {
        return {
            ...base,
            name: "Sanders",
            party: "Democratic",
            MAT: 1,
            CD: 2.5,
            CU: 3,
            MOR: 4,
            PRO: 1.5,
            COM: 1.5,
            ZS: 4.5,
            ONT_H: 3.5,
            ONT_S: 1.5,
            PF: 4,
            TRB: 3.5,
            ENG: 5,
            EPS: 0,
            AES: 4,
        };
    }
    return {
        ...base,
        name: "Sanders",
        party: "Democratic",
        MAT: 1,
        CD: 2,
        CU: 3,
        MOR: 4.5,
        PRO: 2,
        COM: 1.5,
        ZS: 4,
        ONT_H: 4,
        ONT_S: 2,
        PF: 4,
        TRB: 3.5,
        ENG: 5,
        EPS: 0,
        AES: 3,
    };
}
function replaceClinton(candidates, replacement) {
    return candidates.map((c) => c.name === "H. Clinton" ? { ...replacement } : { ...c });
}
function module0Control(actualByYear, states) {
    const rows = [];
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    for (const year of MODERN_YEARS) {
        const actual = actualDemTwoParty(actualByYear, year);
        if (actual == null)
            continue;
        const agg = aggregateElection(runtimes, year, electionForYear(year), CANONICAL_KERNEL);
        rows.push({
            module: "0_control",
            population_adapter: PRIMARY_ADAPTER,
            year,
            predicted_dem_two_party: round(demTwoParty(agg) * 100, 3),
            actual_dem_two_party: round(actual * 100, 3),
            residual: round((demTwoParty(agg) - actual) * 100, 3),
            abstain_share: round(agg.abstain * 100, 3),
        });
    }
    const election = electionForYear(2016);
    const clinton = election.find((c) => c.name === "H. Clinton");
    const sandersCandidates = replaceClinton(election, makeSanders(clinton, "static"));
    const baseline = aggregateElection(runtimes, 2016, election, CANONICAL_KERNEL);
    const sanders = aggregateElection(runtimes, 2016, sandersCandidates, CANONICAL_KERNEL);
    const ev = stateEvFromSwing(states, sanders, baseline);
    const avgAbsResidual = rows.reduce((sum, r) => sum + Math.abs(Number(r.residual)), 0) / rows.length;
    writeCsv(join(OUT_DIR, "00-control-baseline.csv"), rows);
    return {
        avg_abs_modern_residual: round(avgAbsResidual, 3),
        baseline_2016_dem_two_party: rows.find((r) => r.year === 2016)?.predicted_dem_two_party,
        static_sanders_dem_two_party: round(demTwoParty(sanders) * 100, 3),
        static_sanders_ev: ev.demEv,
    };
}
function module1CalibrationGrid(actualByYear) {
    const rows = [];
    const saliencePowers = [1, 1.25, 1.5, 1.75, 2];
    const nonIdeoScales = [0, 0.5, 1];
    const partyBases = [0.4, 0.6, 0.8];
    const clearingScales = [
        { id: "tight", v: 0.9 },
        { id: "current", v: 1 },
        { id: "loose", v: 1.1 },
    ];
    const styleScales = [0, 0.5, 1];
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    for (const saliencePower of saliencePowers) {
        for (const nonIdeoScale of nonIdeoScales) {
            for (const partyBase of partyBases) {
                for (const clearing of clearingScales) {
                    for (const styleScale of styleScales) {
                        const kernel = { saliencePower, nonIdeoScale, partyBase, clearingScale: clearing.v, styleScale };
                        const yearRows = [];
                        for (const year of MODERN_YEARS) {
                            const actual = actualDemTwoParty(actualByYear, year);
                            if (actual == null)
                                continue;
                            const agg = aggregateElection(runtimes, year, electionForYear(year), kernel);
                            yearRows.push({
                                year,
                                residual: (demTwoParty(agg) - actual) * 100,
                                predicted_dem_two_party: demTwoParty(agg) * 100,
                            });
                        }
                        const train = yearRows.filter((r) => TRAIN_YEARS.includes(Number(r.year)));
                        const test = yearRows.filter((r) => TEST_YEARS.includes(Number(r.year)));
                        const avgAbs = (xs) => xs.reduce((sum, r) => sum + Math.abs(Number(r.residual)), 0) / (xs.length || 1);
                        rows.push({
                            module: "1_calibration_grid",
                            salience_power: saliencePower,
                            nonideo_scale: nonIdeoScale,
                            party_base: partyBase,
                            clearing: clearing.id,
                            clearing_scale: clearing.v,
                            style_scale: styleScale,
                            train_avg_abs_residual: round(avgAbs(train), 3),
                            test_avg_abs_residual: round(avgAbs(test), 3),
                            residual_2016: round(Number(yearRows.find((r) => r.year === 2016)?.residual ?? 0), 3),
                            residual_2024: round(Number(yearRows.find((r) => r.year === 2024)?.residual ?? 0), 3),
                            pred_2016: round(Number(yearRows.find((r) => r.year === 2016)?.predicted_dem_two_party ?? 0), 3),
                        });
                    }
                }
            }
        }
    }
    rows.sort((a, b) => (Number(a.train_avg_abs_residual) + Number(a.test_avg_abs_residual)) -
        (Number(b.train_avg_abs_residual) + Number(b.test_avg_abs_residual)));
    writeCsv(join(OUT_DIR, "01-baseline-calibration-grid.csv"), rows);
    const best = rows[0];
    return {
        best_train_avg_abs_residual: best.train_avg_abs_residual,
        best_test_avg_abs_residual: best.test_avg_abs_residual,
        best_residual_2016: best.residual_2016,
        best_settings: `${best.salience_power}/${best.nonideo_scale}/${best.party_base}/${best.clearing}/${best.style_scale}`,
        pass: Number(best.train_avg_abs_residual) <= 5 && Math.abs(Number(best.residual_2016)) <= 4,
    };
}
function populationMeanRuntime(runtimes) {
    const first = runtimes[0];
    const sig = { ...first.sig };
    for (const node of SCORING_NODES) {
        sig[node] = {
            pos: runtimes.reduce((sum, rt) => sum + rt.weight * (rt.sig[node]?.pos ?? 3), 0),
            sal: runtimes.reduce((sum, rt) => sum + rt.weight * (rt.sig[node]?.sal ?? 0), 0),
        };
    }
    for (const node of CATEGORICAL_NODES) {
        const dist = [0, 0, 0, 0, 0, 0];
        for (const rt of runtimes) {
            const entry = rt.sig[node];
            if (!entry?.catDist)
                continue;
            for (let i = 0; i < dist.length; i++)
                dist[i] += rt.weight * (entry.catDist[i] ?? 0);
        }
        sig[node] = {
            pos: dist.reduce((sum, p, i) => sum + p * i, 0),
            sal: runtimes.reduce((sum, rt) => sum + rt.weight * (rt.sig[node]?.sal ?? 0), 0),
            catDist: dist,
        };
    }
    return { ...first, archetype: first.archetype, weight: 1, sig, partyID: null, engagement: "engaged" };
}
function module2CandidateGeometry(actualByYear) {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const mean = populationMeanRuntime(runtimes);
    const distanceRows = [];
    for (const year of MODERN_YEARS) {
        for (const candidate of electionForYear(year)) {
            const pred = scoreCandidate(mean, candidate, { ...CANONICAL_KERNEL, nonIdeoScale: 0, partyBase: 0 });
            distanceRows.push({
                module: "2_candidate_geometry",
                year,
                candidate: candidate.name,
                party: candidate.party,
                population_mean_distance: round(pred.nearestDistance, 4),
            });
        }
    }
    writeCsv(join(OUT_DIR, "02-candidate-mean-distances.csv"), distanceRows);
    const geometryRows = [];
    const geometries = [
        "canonical",
        "trump_median_economic",
        "trump_less_anti_procedure",
        "clinton_perceived_technocrat",
        "combined_dem_favorable",
        "combined_trump_favorable",
    ];
    for (const geometry of geometries) {
        const candidates = candidateGeometry(electionForYear(2016), geometry);
        const actual = actualDemTwoParty(actualByYear, 2016);
        const agg = aggregateElection(runtimes, 2016, candidates, CANONICAL_KERNEL);
        geometryRows.push({
            module: "2_candidate_geometry",
            geometry,
            predicted_dem_two_party: round(demTwoParty(agg) * 100, 3),
            actual_dem_two_party: round(actual * 100, 3),
            residual: round((demTwoParty(agg) - actual) * 100, 3),
        });
    }
    writeCsv(join(OUT_DIR, "02-candidate-perturbations-2016.csv"), geometryRows);
    const canonical = geometryRows.find((r) => r.geometry === "canonical");
    const best = geometryRows.slice().sort((a, b) => Math.abs(Number(a.residual)) - Math.abs(Number(b.residual)))[0];
    return {
        canonical_residual_2016: canonical.residual,
        best_geometry: best.geometry,
        best_residual_2016: best.residual,
    };
}
function module3BlocConstraints() {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const candidates = electionForYear(2016);
    const rows = [];
    for (const bloc of blocSpecs()) {
        const subset = runtimes.filter(bloc.selector);
        const mass = subset.reduce((sum, rt) => sum + rt.weight, 0);
        let dem = 0;
        let rep = 0;
        let third = 0;
        let abstain = 0;
        for (const rt of subset) {
            const pred = predictRuntime(rt, candidates, CANONICAL_KERNEL);
            if (pred.decision === "abstain") {
                abstain += rt.weight;
                continue;
            }
            const bucket = partyBucket(pred.nearestParty);
            if (bucket === "D")
                dem += rt.weight;
            else if (bucket === "R")
                rep += rt.weight;
            else
                third += rt.weight;
        }
        const denom = dem + rep + third;
        rows.push({
            module: "3_bloc_constraints",
            bloc: bloc.id,
            label: bloc.label,
            proxy_mass_pct: round(mass * 100, 3),
            confidence: bloc.confidence,
            predicted_dem: round(denom ? dem / denom * 100 : 0, 3),
            predicted_rep: round(denom ? rep / denom * 100 : 0, 3),
            predicted_third: round(denom ? third / denom * 100 : 0, 3),
            predicted_abstain_within_proxy: round(mass ? abstain / mass * 100 : 0, 3),
            anchor_dem: bloc.anchorDem,
            anchor_rep: bloc.anchorRep,
            anchor_third: bloc.anchorThird,
            dem_error: round((denom ? dem / denom * 100 : 0) - bloc.anchorDem, 3),
            note: bloc.note,
        });
    }
    writeCsv(join(OUT_DIR, "03-bloc-constraint-check.csv"), rows);
    const maxError = rows.reduce((m, r) => Math.max(m, Math.abs(Number(r.dem_error))), 0);
    const bigMisses = rows.filter((r) => Math.abs(Number(r.dem_error)) > 10).map((r) => r.bloc);
    return {
        max_dem_error: round(maxError, 3),
        big_miss_count: bigMisses.length,
        big_misses: bigMisses.join("; "),
    };
}
function module4KnifeEdge() {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const candidates = electionForYear(2016);
    const clinton = candidates.find((c) => c.name === "H. Clinton");
    const sandersStatic = replaceClinton(candidates, makeSanders(clinton, "static"));
    const sandersPerceived = replaceClinton(candidates, makeSanders(clinton, "perceived"));
    const rows = [];
    for (const rt of runtimes) {
        const base = predictRuntime(rt, candidates, CANONICAL_KERNEL);
        const linear = predictRuntime(rt, candidates, { ...CANONICAL_KERNEL, saliencePower: 1 });
        const staticS = predictRuntime(rt, sandersStatic, CANONICAL_KERNEL);
        const perceivedS = predictRuntime(rt, sandersPerceived, CANONICAL_KERNEL);
        const flips = [
            base.nearestName !== linear.nearestName ? "salience_linear" : "",
            base.nearestName !== staticS.nearestName ? "static_sanders" : "",
            base.nearestName !== perceivedS.nearestName ? "perceived_sanders" : "",
            staticS.decision !== perceivedS.decision ? "sanders_turnout_sensitive" : "",
        ].filter(Boolean).join(";");
        rows.push({
            module: "4_knife_edge",
            archetype_id: rt.archetype.id,
            archetype_name: rt.archetype.name,
            weight_pct: round(rt.weight * 100, 4),
            party_id: rt.partyID ?? "",
            baseline_vote: base.decision === "vote" ? base.nearestName : "ABSTAIN",
            baseline_margin: round(base.margin, 4),
            linear_vote: linear.decision === "vote" ? linear.nearestName : "ABSTAIN",
            static_sanders_vote: staticS.decision === "vote" ? staticS.nearestName : "ABSTAIN",
            perceived_sanders_vote: perceivedS.decision === "vote" ? perceivedS.nearestName : "ABSTAIN",
            flip_flags: flips,
        });
    }
    rows.sort((a, b) => Math.abs(Number(a.baseline_margin)) - Math.abs(Number(b.baseline_margin)));
    writeCsv(join(OUT_DIR, "04-knife-edge-archetypes.csv"), rows);
    const knife = rows.filter((r) => Number(r.baseline_margin) < 0.1);
    const weightedKnife = knife.reduce((sum, r) => sum + Number(r.weight_pct), 0);
    const flipMass = rows.filter((r) => String(r.flip_flags).length > 0).reduce((sum, r) => sum + Number(r.weight_pct), 0);
    return {
        knife_edge_count_margin_lt_0_1: knife.length,
        knife_edge_weight_pct: round(weightedKnife, 3),
        flip_sensitive_weight_pct: round(flipMass, 3),
    };
}
function module5TurnoutSplit(states) {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const candidates = electionForYear(2016);
    const clinton = candidates.find((c) => c.name === "H. Clinton");
    const scenarios = [
        { id: "baseline_clinton", candidates },
        { id: "static_sanders", candidates: replaceClinton(candidates, makeSanders(clinton, "static")) },
        { id: "perceived_sanders", candidates: replaceClinton(candidates, makeSanders(clinton, "perceived")) },
    ];
    const regimes = ["current", "all_vote", "loose_bars", "tight_bars", "youth_left_boost", "black_turnout_risk", "suburban_moderate_defection"];
    const rows = [];
    const baselineCurrent = aggregateWithTurnout(runtimes, candidates, CANONICAL_KERNEL, "current");
    for (const scenario of scenarios) {
        for (const regime of regimes) {
            const agg = aggregateWithTurnout(runtimes, scenario.candidates, CANONICAL_KERNEL, regime);
            const ev = stateEvFromSwing(states, agg, baselineCurrent);
            rows.push({
                module: "5_turnout_split",
                scenario: scenario.id,
                turnout_regime: regime,
                dem_two_party: round(demTwoParty(agg) * 100, 3),
                dem_two_party_delta_vs_baseline_current: round((demTwoParty(agg) - demTwoParty(baselineCurrent)) * 100, 3),
                dem_share: round(agg.dem * 100, 3),
                rep_share: round(agg.rep * 100, 3),
                third_share: round(agg.third * 100, 3),
                abstain_share: round(agg.abstain * 100, 3),
                dem_ev_uniform_swing: ev.demEv,
                rep_ev_uniform_swing: ev.repEv,
            });
        }
    }
    writeCsv(join(OUT_DIR, "05-turnout-module-split.csv"), rows);
    const staticCurrent = rows.find((r) => r.scenario === "static_sanders" && r.turnout_regime === "current");
    const perceivedCurrent = rows.find((r) => r.scenario === "perceived_sanders" && r.turnout_regime === "current");
    return {
        static_current_dem_two_party: staticCurrent.dem_two_party,
        static_current_ev: staticCurrent.dem_ev_uniform_swing,
        perceived_current_dem_two_party: perceivedCurrent.dem_two_party,
        perceived_current_ev: perceivedCurrent.dem_ev_uniform_swing,
    };
}
function module6CanonicalVsBestGrid(actualByYear) {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const rows = [];
    for (const year of MODERN_YEARS) {
        const actual = actualDemTwoParty(actualByYear, year);
        if (actual == null)
            continue;
        const canonical = aggregateElection(runtimes, year, electionForYear(year), CANONICAL_KERNEL);
        const best = aggregateElection(runtimes, year, electionForYear(year), BEST_GRID_KERNEL);
        const canonicalResidual = (demTwoParty(canonical) - actual) * 100;
        const bestResidual = (demTwoParty(best) - actual) * 100;
        rows.push({
            module: "6_canonical_vs_best_grid",
            year,
            actual_dem_two_party: round(actual * 100, 3),
            canonical_predicted_dem_two_party: round(demTwoParty(canonical) * 100, 3),
            canonical_residual: round(canonicalResidual, 3),
            canonical_abstain_share: round(canonical.abstain * 100, 3),
            best_grid_predicted_dem_two_party: round(demTwoParty(best) * 100, 3),
            best_grid_residual: round(bestResidual, 3),
            best_grid_abstain_share: round(best.abstain * 100, 3),
            abs_residual_delta_best_minus_canonical: round(Math.abs(bestResidual) - Math.abs(canonicalResidual), 3),
            direction: Math.abs(bestResidual) < Math.abs(canonicalResidual) ? "improved" : "worsened",
        });
    }
    writeCsv(join(OUT_DIR, "06-canonical-vs-best-grid-residual-autopsy.csv"), rows);
    const avgAbs = (key) => rows.reduce((sum, r) => sum + Math.abs(Number(r[key])), 0) / (rows.length || 1);
    const improved = rows.filter((r) => r.direction === "improved").length;
    const worsened = rows.length - improved;
    const worstRegression = rows
        .slice()
        .sort((a, b) => Number(b.abs_residual_delta_best_minus_canonical) - Number(a.abs_residual_delta_best_minus_canonical))[0];
    return {
        canonical_avg_abs_residual: round(avgAbs("canonical_residual"), 3),
        best_grid_avg_abs_residual: round(avgAbs("best_grid_residual"), 3),
        improved_years: improved,
        worsened_years: worsened,
        worst_regression_year: worstRegression.year,
        worst_regression_delta: worstRegression.abs_residual_delta_best_minus_canonical,
    };
}
function candidateParts(runtime, candidate, kernel) {
    const ctx = getContext(candidate.year);
    if (!ctx)
        throw new Error(`Missing context ${candidate.year}`);
    const parts = {};
    let weighted = 0;
    let weight = 0;
    for (const node of SCORING_NODES) {
        const entry = runtime.sig[node];
        if (!entry)
            continue;
        const rawSal = entry.sal * getActivationMultiplier(ctx.year, node);
        const sal = Math.pow(rawSal, kernel.saliencePower);
        const diff = entry.pos - candidate[node];
        const term = sal * diff * diff;
        parts[node] = term;
        weighted += term;
        weight += sal;
    }
    for (const node of CATEGORICAL_NODES) {
        const c = categoricalContribution(candidate, runtime.sig[node], node, candidate.year, kernel);
        parts[node] = c.contribution;
        weighted += c.contribution;
        weight += c.weight;
    }
    const rawDistance = weight > 0 ? Math.sqrt(weighted / weight) : 4;
    let finalDistance = rawDistance;
    if (kernel.nonIdeoScale !== 0) {
        finalDistance -= kernel.nonIdeoScale * getNonIdeologicalModifier(candidate.year, historicalToCanonical(candidate.name, candidate.year)).total;
    }
    finalDistance *= partyMultiplier(candidate.party, runtime.partyID, runtime.sig.PF?.pos, candidate.year, kernel.partyBase);
    return { parts, weighted, weight, rawDistance, finalDistance };
}
function topPulls(deltaByNode, limit = 4) {
    return Object.entries(deltaByNode)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .slice(0, limit)
        .map(([node, delta]) => `${node}:${round(delta, 3)}`)
        .join("; ");
}
function module7NodeContributionAudit() {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const candidates = electionForYear(2016);
    const clinton = candidates.find((c) => c.name === "H. Clinton");
    const trump = candidates.find((c) => c.name === "Trump");
    const nodes = [...SCORING_NODES, ...CATEGORICAL_NODES];
    const aggregate = {};
    const topRows = [];
    for (const rt of runtimes) {
        const clintonParts = candidateParts(rt, clinton, CANONICAL_KERNEL);
        const trumpParts = candidateParts(rt, trump, CANONICAL_KERNEL);
        const pred = predictRuntime(rt, candidates, CANONICAL_KERNEL);
        const deltaByNode = {};
        for (const node of nodes) {
            const delta = (trumpParts.parts[node] ?? 0) - (clintonParts.parts[node] ?? 0);
            deltaByNode[node] = delta;
            aggregate[node] = (aggregate[node] ?? 0) + rt.weight * delta;
        }
        aggregate.nonideo_final_delta = (aggregate.nonideo_final_delta ?? 0) +
            rt.weight * ((trumpParts.rawDistance - clintonParts.rawDistance) - (trumpParts.finalDistance - clintonParts.finalDistance));
        aggregate.final_distance_delta = (aggregate.final_distance_delta ?? 0) +
            rt.weight * (trumpParts.finalDistance - clintonParts.finalDistance);
        if (topRows.length < 35 || rt.weight > Number(topRows[topRows.length - 1]?.weight_pct ?? 0) / 100) {
            topRows.push({
                module: "7_node_contribution_top_archetypes",
                archetype_id: rt.archetype.id,
                archetype_name: rt.archetype.name,
                weight_pct: round(rt.weight * 100, 4),
                party_id: rt.partyID ?? "",
                winner: pred.decision === "abstain" ? "ABSTAIN" : pred.nearestName,
                margin: round(pred.margin, 4),
                clinton_final_distance: round(clintonParts.finalDistance, 4),
                trump_final_distance: round(trumpParts.finalDistance, 4),
                trump_minus_clinton_final_distance: round(trumpParts.finalDistance - clintonParts.finalDistance, 4),
                top_node_deltas_trump_minus_clinton: topPulls(deltaByNode),
            });
            topRows.sort((a, b) => Number(b.weight_pct) - Number(a.weight_pct));
            if (topRows.length > 35)
                topRows.pop();
        }
    }
    const aggregateRows = Object.entries(aggregate)
        .sort((a, b) => Math.abs(b[1]) - Math.abs(a[1]))
        .map(([node, delta]) => ({
        module: "7_node_contribution_aggregate",
        node,
        weighted_delta_trump_minus_clinton: round(delta, 5),
        interpretation: delta < 0 ? "pulls_toward_trump" : "pulls_toward_clinton",
    }));
    writeCsv(join(OUT_DIR, "07-2016-node-contribution-aggregate.csv"), aggregateRows);
    writeCsv(join(OUT_DIR, "07-2016-top-archetype-node-contributions.csv"), topRows);
    const topTrumpPull = aggregateRows.find((r) => r.interpretation === "pulls_toward_trump");
    const topClintonPull = aggregateRows.find((r) => r.interpretation === "pulls_toward_clinton");
    return {
        largest_trump_pull: topTrumpPull ? `${topTrumpPull.node}:${topTrumpPull.weighted_delta_trump_minus_clinton}` : "",
        largest_clinton_pull: topClintonPull ? `${topClintonPull.node}:${topClintonPull.weighted_delta_trump_minus_clinton}` : "",
        final_distance_delta_trump_minus_clinton: round(aggregate.final_distance_delta ?? 0, 4),
    };
}
function module8PartyRetentionCheck() {
    const rows = [];
    for (const adapter of POPULATION_ADAPTER_VARIANTS) {
        const runtimes = buildPopulationRuntimes(adapter);
        const groups = ["D", "R", "none"];
        for (const group of groups) {
            const subset = runtimes.filter((rt) => (rt.partyID ?? "none") === group);
            const mass = subset.reduce((sum, rt) => sum + rt.weight, 0);
            const agg = aggregateElection(subset, 2016, electionForYear(2016), CANONICAL_KERNEL);
            rows.push({
                module: "8_party_retention",
                adapter,
                party_id: group,
                mass_pct: round(mass * 100, 3),
                dem_vote_pct_within_group: round(agg.dem * 100 / (mass || 1), 3),
                rep_vote_pct_within_group: round(agg.rep * 100 / (mass || 1), 3),
                third_vote_pct_within_group: round(agg.third * 100 / (mass || 1), 3),
                abstain_pct_within_group: round(agg.abstain * 100 / (mass || 1), 3),
            });
        }
    }
    writeCsv(join(OUT_DIR, "08-party-loyalty-retention.csv"), rows);
    const baseD = rows.find((r) => r.adapter === PRIMARY_ADAPTER && r.party_id === "D");
    const baseR = rows.find((r) => r.adapter === PRIMARY_ADAPTER && r.party_id === "R");
    return {
        base_d_coded_rep_vote_pct: baseD.rep_vote_pct_within_group,
        base_d_coded_abstain_pct: baseD.abstain_pct_within_group,
        base_r_coded_dem_vote_pct: baseR.dem_vote_pct_within_group,
        base_r_coded_abstain_pct: baseR.abstain_pct_within_group,
    };
}
function module9IdentityOverlayStress(actualByYear) {
    const rows = [];
    const actual = actualDemTwoParty(actualByYear, 2016);
    for (const adapter of POPULATION_ADAPTER_VARIANTS) {
        const runtimes = buildPopulationRuntimes(adapter);
        const agg = aggregateElection(runtimes, 2016, electionForYear(2016), CANONICAL_KERNEL);
        rows.push({
            module: "9_identity_overlay_stress",
            adapter,
            dem_two_party: round(demTwoParty(agg) * 100, 3),
            residual_vs_actual: round((demTwoParty(agg) - actual) * 100, 3),
            dem_share: round(agg.dem * 100, 3),
            rep_share: round(agg.rep * 100, 3),
            third_share: round(agg.third * 100, 3),
            abstain_share: round(agg.abstain * 100, 3),
        });
    }
    writeCsv(join(OUT_DIR, "09-identity-overlay-stress.csv"), rows);
    const min = Math.min(...rows.map((r) => Number(r.dem_two_party)));
    const max = Math.max(...rows.map((r) => Number(r.dem_two_party)));
    const best = rows.slice().sort((a, b) => Math.abs(Number(a.residual_vs_actual)) - Math.abs(Number(b.residual_vs_actual)))[0];
    return {
        identity_adapter_range_pp: round(max - min, 3),
        best_identity_adapter: best.adapter,
        best_identity_residual: best.residual_vs_actual,
    };
}
function stateWinner(demTwoPartyShare) {
    return demTwoPartyShare >= 0.5 ? "D" : "R";
}
function module10StateBaselineCheck(states, actualByYear) {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const actualNational = actualDemTwoParty(actualByYear, 2016);
    const models = [
        { id: "canonical", kernel: CANONICAL_KERNEL },
        { id: "best_grid", kernel: BEST_GRID_KERNEL },
    ];
    const rows = [];
    for (const model of models) {
        const agg = aggregateElection(runtimes, 2016, electionForYear(2016), model.kernel);
        const swing = demTwoParty(agg) - actualNational;
        for (const state of states) {
            const modeled = Math.max(0, Math.min(1, state.demTwoParty + swing));
            rows.push({
                module: "10_state_baseline",
                model: model.id,
                state: state.statePo,
                electoral_votes: ELECTORAL_VOTES_2016[state.statePo] ?? 0,
                actual_dem_two_party: round(state.demTwoParty * 100, 3),
                modeled_dem_two_party: round(modeled * 100, 3),
                error_pp: round((modeled - state.demTwoParty) * 100, 3),
                actual_winner: stateWinner(state.demTwoParty),
                modeled_winner: stateWinner(modeled),
                winner_wrong: stateWinner(state.demTwoParty) === stateWinner(modeled) ? 0 : 1,
            });
        }
    }
    writeCsv(join(OUT_DIR, "10-state-baseline-check.csv"), rows);
    const summarize = (id) => {
        const subset = rows.filter((r) => r.model === id);
        const wrong = subset.filter((r) => Number(r.winner_wrong) === 1);
        const wrongEv = wrong.reduce((sum, r) => sum + Number(r.electoral_votes), 0);
        const mae = subset.reduce((sum, r) => sum + Math.abs(Number(r.error_pp)), 0) / (subset.length || 1);
        return { wrongStates: wrong.length, wrongEv, mae };
    };
    const canonical = summarize("canonical");
    const best = summarize("best_grid");
    return {
        canonical_state_mae_pp: round(canonical.mae, 3),
        canonical_wrong_states: canonical.wrongStates,
        canonical_wrong_ev: canonical.wrongEv,
        best_grid_state_mae_pp: round(best.mae, 3),
        best_grid_wrong_states: best.wrongStates,
        best_grid_wrong_ev: best.wrongEv,
    };
}
function blocAggregate(runtimes, candidates, selector) {
    let dem = 0;
    let rep = 0;
    let third = 0;
    let abstain = 0;
    let mass = 0;
    for (const rt of runtimes) {
        if (!selector(rt))
            continue;
        mass += rt.weight;
        const pred = predictRuntime(rt, candidates, CANONICAL_KERNEL);
        if (pred.decision === "abstain") {
            abstain += rt.weight;
        }
        else {
            const bucket = partyBucket(pred.nearestParty);
            if (bucket === "D")
                dem += rt.weight;
            else if (bucket === "R")
                rep += rt.weight;
            else
                third += rt.weight;
        }
    }
    return { dem, rep, third, abstain, voterMass: dem + rep + third, mass };
}
function module11BlocAnchorCorrection() {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const candidates = electionForYear(2016);
    const baseline = aggregateElection(runtimes, 2016, candidates, CANONICAL_KERNEL);
    const rows = [];
    for (const spec of blocSpecs()) {
        const agg = blocAggregate(runtimes, candidates, spec.selector);
        const voteMass = agg.dem + agg.rep + agg.third;
        const predDem = voteMass > 0 ? agg.dem / voteMass : 0;
        const predRep = voteMass > 0 ? agg.rep / voteMass : 0;
        const predThird = voteMass > 0 ? agg.third / voteMass : 0;
        const anchoredDem = spec.anchorDem / 100;
        const anchoredRep = spec.anchorRep / 100;
        const anchoredThird = spec.anchorThird / 100;
        const corrected = {
            dem: baseline.dem - agg.dem + voteMass * anchoredDem,
            rep: baseline.rep - agg.rep + voteMass * anchoredRep,
            third: baseline.third - agg.third + voteMass * anchoredThird,
            abstain: baseline.abstain,
            voterMass: 0,
        };
        corrected.voterMass = corrected.dem + corrected.rep + corrected.third;
        rows.push({
            module: "11_bloc_anchor_correction",
            bloc: spec.id,
            confidence: spec.confidence,
            proxy_mass_pct: round(agg.mass * 100, 3),
            vote_mass_pct: round(voteMass * 100, 3),
            predicted_dem_within_bloc: round(predDem * 100, 3),
            anchor_dem: spec.anchorDem,
            predicted_rep_within_bloc: round(predRep * 100, 3),
            anchor_rep: spec.anchorRep,
            predicted_third_within_bloc: round(predThird * 100, 3),
            anchor_third: spec.anchorThird,
            corrected_national_dem_two_party_if_applied_alone: round(demTwoParty(corrected) * 100, 3),
            national_delta_if_applied_alone_pp: round((demTwoParty(corrected) - demTwoParty(baseline)) * 100, 3),
        });
    }
    const assigned = new Set();
    let dem = baseline.dem;
    let rep = baseline.rep;
    let third = baseline.third;
    for (const spec of blocSpecs()) {
        const subset = runtimes.filter((rt) => !assigned.has(rt.archetype.id) && spec.selector(rt));
        if (subset.length === 0)
            continue;
        for (const rt of subset)
            assigned.add(rt.archetype.id);
        const selectorIds = new Set(subset.map((rt) => rt.archetype.id));
        const agg = blocAggregate(runtimes, candidates, (rt) => selectorIds.has(rt.archetype.id));
        const voteMass = agg.dem + agg.rep + agg.third;
        dem = dem - agg.dem + voteMass * (spec.anchorDem / 100);
        rep = rep - agg.rep + voteMass * (spec.anchorRep / 100);
        third = third - agg.third + voteMass * (spec.anchorThird / 100);
    }
    const stacked = { dem, rep, third, abstain: baseline.abstain, voterMass: dem + rep + third };
    rows.push({
        module: "11_bloc_anchor_correction",
        bloc: "stacked_nonoverlap_all_proxy_anchors",
        confidence: "diagnostic",
        proxy_mass_pct: round(runtimes.filter((rt) => assigned.has(rt.archetype.id)).reduce((sum, rt) => sum + rt.weight, 0) * 100, 3),
        vote_mass_pct: "",
        predicted_dem_within_bloc: "",
        anchor_dem: "",
        predicted_rep_within_bloc: "",
        anchor_rep: "",
        predicted_third_within_bloc: "",
        anchor_third: "",
        corrected_national_dem_two_party_if_applied_alone: round(demTwoParty(stacked) * 100, 3),
        national_delta_if_applied_alone_pp: round((demTwoParty(stacked) - demTwoParty(baseline)) * 100, 3),
    });
    writeCsv(join(OUT_DIR, "11-bloc-anchor-correction.csv"), rows);
    const stackedRow = rows.find((r) => r.bloc === "stacked_nonoverlap_all_proxy_anchors");
    const largest = rows
        .filter((r) => r.bloc !== "stacked_nonoverlap_all_proxy_anchors")
        .sort((a, b) => Math.abs(Number(b.national_delta_if_applied_alone_pp)) - Math.abs(Number(a.national_delta_if_applied_alone_pp)))[0];
    return {
        stacked_anchor_dem_two_party: stackedRow.corrected_national_dem_two_party_if_applied_alone,
        stacked_anchor_delta_pp: stackedRow.national_delta_if_applied_alone_pp,
        largest_single_bloc_delta: `${largest.bloc}:${largest.national_delta_if_applied_alone_pp}`,
    };
}
function module12TurnoutLayerIsolation(states) {
    const runtimes = buildPopulationRuntimes(PRIMARY_ADAPTER);
    const candidates = electionForYear(2016);
    const clinton = candidates.find((c) => c.name === "H. Clinton");
    const scenarios = [
        { id: "baseline_clinton", candidates },
        { id: "static_sanders", candidates: replaceClinton(candidates, makeSanders(clinton, "static")) },
        { id: "perceived_sanders", candidates: replaceClinton(candidates, makeSanders(clinton, "perceived")) },
    ];
    const kernels = [
        { id: "canonical", kernel: CANONICAL_KERNEL },
        { id: "best_grid", kernel: BEST_GRID_KERNEL },
    ];
    const regimes = ["current", "all_vote", "loose_bars", "tight_bars", "youth_left_boost", "black_turnout_risk", "suburban_moderate_defection"];
    const rows = [];
    for (const kernel of kernels) {
        const baseline = aggregateWithTurnout(runtimes, candidates, kernel.kernel, "current");
        for (const scenario of scenarios) {
            for (const regime of regimes) {
                const agg = aggregateWithTurnout(runtimes, scenario.candidates, kernel.kernel, regime);
                const ev = stateEvFromSwing(states, agg, baseline);
                rows.push({
                    module: "12_turnout_layer_isolation",
                    kernel: kernel.id,
                    scenario: scenario.id,
                    turnout_regime: regime,
                    dem_two_party: round(demTwoParty(agg) * 100, 3),
                    delta_vs_baseline_current_pp: round((demTwoParty(agg) - demTwoParty(baseline)) * 100, 3),
                    dem_share: round(agg.dem * 100, 3),
                    rep_share: round(agg.rep * 100, 3),
                    third_share: round(agg.third * 100, 3),
                    abstain_share: round(agg.abstain * 100, 3),
                    dem_ev_uniform_swing: ev.demEv,
                });
            }
        }
    }
    writeCsv(join(OUT_DIR, "12-turnout-layer-isolation.csv"), rows);
    const band = (kernelId, scenarioId) => {
        const subset = rows.filter((r) => r.kernel === kernelId && r.scenario === scenarioId);
        const values = subset.map((r) => Number(r.dem_two_party));
        return round(Math.max(...values) - Math.min(...values), 3);
    };
    return {
        canonical_static_sanders_turnout_band_pp: band("canonical", "static_sanders"),
        canonical_perceived_sanders_turnout_band_pp: band("canonical", "perceived_sanders"),
        best_grid_static_sanders_turnout_band_pp: band("best_grid", "static_sanders"),
        best_grid_perceived_sanders_turnout_band_pp: band("best_grid", "perceived_sanders"),
    };
}
function writeReport(summary) {
    const lines = [
        "# Diagnostic Sequence 0-5",
        "",
        `Run folder: ${OUT_DIR}`,
        "",
        "## Module Results",
        "",
        "| module | key result | status |",
        "|---|---|---|",
        `| 0 control | avg modern residual ${summary["0_control.avg_abs_modern_residual"]}; static Sanders EV ${summary["0_control.static_sanders_ev"]} | ${Number(summary["0_control.avg_abs_modern_residual"]) <= 5 ? "pass" : "fail"} |`,
        `| 1 calibration grid | best train/test residual ${summary["1_grid.best_train_avg_abs_residual"]}/${summary["1_grid.best_test_avg_abs_residual"]}; 2016 residual ${summary["1_grid.best_residual_2016"]}; settings ${summary["1_grid.best_settings"]} | ${summary["1_grid.pass"] ? "pass" : "fail"} |`,
        `| 2 candidate geometry | canonical 2016 residual ${summary["2_geometry.canonical_residual_2016"]}; best ${summary["2_geometry.best_geometry"]} residual ${summary["2_geometry.best_residual_2016"]} | diagnostic |`,
        `| 3 bloc constraints | big misses ${summary["3_bloc.big_miss_count"]}; max D error ${summary["3_bloc.max_dem_error"]} | ${Number(summary["3_bloc.big_miss_count"]) === 0 ? "pass" : "fail"} |`,
        `| 4 knife edge | margin<0.1 weight ${summary["4_knife.knife_edge_weight_pct"]}%; flip-sensitive weight ${summary["4_knife.flip_sensitive_weight_pct"]}% | diagnostic |`,
        `| 5 turnout split | static Sanders ${summary["5_turnout.static_current_dem_two_party"]}% / EV ${summary["5_turnout.static_current_ev"]}; perceived Sanders ${summary["5_turnout.perceived_current_dem_two_party"]}% / EV ${summary["5_turnout.perceived_current_ev"]} | diagnostic |`,
        `| 6 canonical vs best grid | avg abs residual ${summary["6_grid_autopsy.canonical_avg_abs_residual"]} -> ${summary["6_grid_autopsy.best_grid_avg_abs_residual"]}; improved/worsened ${summary["6_grid_autopsy.improved_years"]}/${summary["6_grid_autopsy.worsened_years"]} | diagnostic |`,
        `| 7 node contribution | largest Trump pull ${summary["7_node_contrib.largest_trump_pull"]}; largest Clinton pull ${summary["7_node_contrib.largest_clinton_pull"]} | diagnostic |`,
        `| 8 party retention | D-coded R vote ${summary["8_party_retention.base_d_coded_rep_vote_pct"]}%; R-coded D vote ${summary["8_party_retention.base_r_coded_dem_vote_pct"]}% | diagnostic |`,
        `| 9 identity overlay stress | range ${summary["9_identity_overlay.identity_adapter_range_pp"]} pp; best ${summary["9_identity_overlay.best_identity_adapter"]} residual ${summary["9_identity_overlay.best_identity_residual"]} | diagnostic |`,
        `| 10 state baseline | canonical wrong EV ${summary["10_state_baseline.canonical_wrong_ev"]}; best-grid wrong EV ${summary["10_state_baseline.best_grid_wrong_ev"]} | diagnostic |`,
        `| 11 bloc anchor correction | stacked D2P ${summary["11_bloc_anchor.stacked_anchor_dem_two_party"]}%; delta ${summary["11_bloc_anchor.stacked_anchor_delta_pp"]} pp | diagnostic |`,
        `| 12 turnout isolation | canonical static/perceived bands ${summary["12_turnout_isolation.canonical_static_sanders_turnout_band_pp"]}/${summary["12_turnout_isolation.canonical_perceived_sanders_turnout_band_pp"]} pp | diagnostic |`,
        "",
        "## Decision Implication",
        "",
        "This run does not permit decision-grade claims yet unless the baseline residuals, bloc anchors, party-retention checks, and state baseline all become stable at the same time. Use the module CSVs to decide whether the next priority is scorer calibration, demographic/identity grounding, or turnout modeling.",
        "",
    ];
    writeFileSync(join(OUT_DIR, "diagnostic-sequence-report.md"), lines.join("\n"), "utf-8");
}
function flatten(prefix, obj) {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [`${prefix}.${k}`, v]));
}
async function main() {
    mkdirSync(OUT_DIR, { recursive: true });
    await ensureSourceCsv();
    writePopulationAdapterAudit(join(OUT_DIR, "population-adapter-audit.json"));
    writeFileSync(LATEST_POINTER, JSON.stringify({ runId: RUN_ID, outDir: OUT_DIR }, null, 2), "utf-8");
    const presidentRows = loadPresidentRows();
    const actualByYear = actualNationalByYear(presidentRows);
    const states = actualState2016(presidentRows);
    console.log("Module 0: control");
    const m0 = module0Control(actualByYear, states);
    console.log("Module 1: calibration grid");
    const m1 = module1CalibrationGrid(actualByYear);
    console.log("Module 2: candidate geometry");
    const m2 = module2CandidateGeometry(actualByYear);
    console.log("Module 3: bloc constraints");
    const m3 = module3BlocConstraints();
    console.log("Module 4: knife edge");
    const m4 = module4KnifeEdge();
    console.log("Module 5: turnout split");
    const m5 = module5TurnoutSplit(states);
    console.log("Module 6: canonical vs best-grid autopsy");
    const m6 = module6CanonicalVsBestGrid(actualByYear);
    console.log("Module 7: Clinton-Trump node contribution audit");
    const m7 = module7NodeContributionAudit();
    console.log("Module 8: party retention check");
    const m8 = module8PartyRetentionCheck();
    console.log("Module 9: identity overlay stress");
    const m9 = module9IdentityOverlayStress(actualByYear);
    console.log("Module 10: state baseline check");
    const m10 = module10StateBaselineCheck(states, actualByYear);
    console.log("Module 11: bloc anchor correction");
    const m11 = module11BlocAnchorCorrection();
    console.log("Module 12: turnout layer isolation");
    const m12 = module12TurnoutLayerIsolation(states);
    const summary = {
        run_id: RUN_ID,
        out_dir: OUT_DIR,
        ...flatten("0_control", m0),
        ...flatten("1_grid", m1),
        ...flatten("2_geometry", m2),
        ...flatten("3_bloc", m3),
        ...flatten("4_knife", m4),
        ...flatten("5_turnout", m5),
        ...flatten("6_grid_autopsy", m6),
        ...flatten("7_node_contrib", m7),
        ...flatten("8_party_retention", m8),
        ...flatten("9_identity_overlay", m9),
        ...flatten("10_state_baseline", m10),
        ...flatten("11_bloc_anchor", m11),
        ...flatten("12_turnout_isolation", m12),
    };
    writeFileSync(join(OUT_DIR, "diagnostic-sequence-summary.json"), JSON.stringify(summary, null, 2), "utf-8");
    writeReport(summary);
    console.log(JSON.stringify(summary, null, 2));
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=counterfactual-2016-diagnostic-sequence.js.map