/**
 * PRISM Archetype-Entity Alignment Audit
 *
 * For each entity (US presidential candidate × year, global regime period),
 * compute the 118-active-archetype distance vector using the `archetypeDistance`
 * baseline from the quiz, convert to posterior via softmax (T=0.04 — same as
 * quiz at termination), and record:
 *
 *   - Top-5 archetypes with scores + posterior probabilities
 *   - Top-3 node drivers (nodes contributing MOST to low distance = support)
 *   - Top-3 node tensions (nodes contributing MOST to high distance = misfit)
 *   - Family-pair flag (margin between rank 1 and 2 < 0.03)
 *   - Signature-distance family-pair flag (rank-1/rank-2 archetype pair is
 *     in the 10th-percentile tail of pairwise archetype-archetype distance)
 *
 * Operates on fully-observed entity profiles (position + categorical are
 * one-hot; salience is uniform since entity profiles don't encode salience
 * independently of position).
 *
 * Usage:
 *   npx tsx src/eval/runAudit.ts
 *
 * Outputs (under results/audit/):
 *   - entity-scores.jsonl        one line per entity with full top-5 + drivers
 *   - face-validity.csv          flat CSV for spot-checking
 *   - manifest.json              provenance + summary stats
 */
import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { execSync } from "child_process";
import { ARCHETYPES } from "../config/archetypes.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
import { CATEGORY_COST_MATRIX } from "../config/categories.js";
import { archetypeDistance } from "../engine/archetypeDistance.js";
import { ELECTIONS } from "../historical/candidates.js";
import { EUROPE_PART1 } from "../global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../global/jurisdictions-europe2.js";
import { AMERICAS } from "../global/jurisdictions-americas.js";
import { ASIA } from "../global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../global/jurisdictions-mena.js";
// ──────────────────────────────────────────────────────────────────────────
// Configuration
// ──────────────────────────────────────────────────────────────────────────
const SOFTMAX_T = 0.04; // minTemp at quiz termination
const DEACTIVATED_IDS = new Set(["019", "023", "025"]);
const MARGIN_PAIR_THRESHOLD = 0.03;
const SIG_PAIR_PERCENTILE = 10; // 10th percentile of pairwise archetype distances
// Non-identifiable archetypes (from Step 4 report)
const NON_IDENTIFIABLE = new Set([
    "006", "016", "020", "033", "050", "056", "065", "067", "069",
    "089", "107", "117", "138",
]);
// Pre-registered family pairs (from Step 4)
const PRE_REGISTERED_PAIRS = [
    ["098", "102"],
    ["070", "075"],
];
const ENGINE_FILES = [
    "src/types.ts",
    "src/config/archetypes.ts",
    "src/config/nodes.ts",
    "src/config/categories.ts",
    "src/engine/archetypeDistance.ts",
    "src/historical/candidates.ts",
    "src/global/jurisdictions-americas.ts",
    "src/global/jurisdictions-asia.ts",
    "src/global/jurisdictions-europe1.ts",
    "src/global/jurisdictions-europe2.ts",
    "src/global/jurisdictions-mena.ts",
];
function candidateToEntity(c, year) {
    return {
        entityId: `cand:${year}:${c.name}`,
        entityKind: "candidate",
        entityName: c.name,
        entityContext: String(year),
        party: c.party,
        year,
        MAT: c.MAT, CD: c.CD, CU: c.CU, MOR: c.MOR,
        PRO: c.PRO, COM: c.COM, ZS: c.ZS,
        ONT_H: c.ONT_H, ONT_S: c.ONT_S,
        PF: c.PF, TRB: c.TRB, ENG: c.ENG,
        EPS: c.EPS, AES: c.AES,
    };
}
function regimeToEntity(r) {
    return {
        entityId: `regime:${r.jurisdiction}:${r.regime}:${r.startYear}`,
        entityKind: "regime",
        entityName: r.regime,
        entityContext: `${r.jurisdiction}|${r.regime} (${r.startYear}-${r.endYear})`,
        jurisdiction: r.jurisdiction,
        year: r.startYear,
        endYear: r.endYear,
        MAT: r.MAT, CD: r.CD, CU: r.CU, MOR: r.MOR,
        PRO: r.PRO, COM: r.COM, ZS: r.ZS,
        ONT_H: r.ONT_H, ONT_S: r.ONT_S,
        PF: r.PF, TRB: r.TRB, ENG: r.ENG,
        EPS: r.EPS, AES: r.AES,
    };
}
// ──────────────────────────────────────────────────────────────────────────
// Entity → RespondentState (fully-observed, uniform salience)
// ──────────────────────────────────────────────────────────────────────────
const UNIFORM_SAL = [0.25, 0.25, 0.25, 0.25];
function oneHotPos(pos) {
    const out = [0, 0, 0, 0, 0];
    const idx = Math.max(1, Math.min(5, Math.round(pos))) - 1;
    out[idx] = 1;
    return out;
}
function oneHotCat(catIdx) {
    const out = [0, 0, 0, 0, 0, 0];
    const idx = Math.max(0, Math.min(5, Math.round(catIdx)));
    out[idx] = 1;
    return out;
}
function entityToState(e) {
    const state = {
        answers: {},
        continuous: {},
        categorical: {},
        trbAnchor: { dist: [0, 0, 0, 0, 0, 0, 0, 0, 0], touches: 0 },
        archetypeDistances: {},
    };
    for (const nodeId of CONTINUOUS_NODES) {
        const pos = e[nodeId];
        state.continuous[nodeId] = {
            posDist: oneHotPos(pos),
            salDist: [...UNIFORM_SAL],
            touches: 1,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const catIdx = e[nodeId];
        state.categorical[nodeId] = {
            catDist: oneHotCat(catIdx),
            salDist: [...UNIFORM_SAL],
            touches: 1,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    return state;
}
function perNodeContribution(state, arch) {
    const contribs = [];
    for (const nodeId of CONTINUOUS_NODES) {
        const template = arch.nodes[nodeId];
        if (!template || template.kind !== "continuous")
            continue;
        const ct = template;
        const nodeState = state.continuous[nodeId];
        const expectedPos = nodeState.posDist[0] * 1 +
            nodeState.posDist[1] * 2 +
            nodeState.posDist[2] * 3 +
            nodeState.posDist[3] * 4 +
            nodeState.posDist[4] * 5;
        const posProb = nodeState.posDist[ct.pos - 1] ?? 0.2;
        const expectedSal = nodeState.salDist[0] * 0 +
            nodeState.salDist[1] * 1 +
            nodeState.salDist[2] * 2 +
            nodeState.salDist[3] * 3;
        const salProb = nodeState.salDist[ct.sal] ?? 0.25;
        const posMeanDiff = Math.abs(expectedPos - ct.pos) / 4;
        const posProbDist = 1 - posProb;
        const salMeanDiff = Math.abs(expectedSal - ct.sal) / 3;
        const salProbDist = 1 - salProb;
        const positionDist = posMeanDiff * 0.6 + posProbDist * 0.4;
        const salienceDist = salMeanDiff * 0.6 + salProbDist * 0.4;
        let antiPenalty = 0;
        if (ct.anti === "high" && expectedPos > 3.8) {
            antiPenalty = 0.8 * (expectedPos - 3.8) / 1.2;
        }
        else if (ct.anti === "low" && expectedPos < 2.2) {
            antiPenalty = 0.8 * (2.2 - expectedPos) / 1.2;
        }
        const archSalWeight = 0.5 + ct.sal * 0.5;
        const respondentSalWeight = 0.5 + expectedSal * 0.25;
        const nodeWeight = archSalWeight * respondentSalWeight;
        const nodeDist = positionDist * 0.65 + salienceDist * 0.35 + antiPenalty;
        contribs.push({ node: nodeId, nodeDist, nodeWeight, contribution: nodeDist * nodeWeight });
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const template = arch.nodes[nodeId];
        if (!template || template.kind !== "categorical")
            continue;
        const ct = template;
        const nodeState = state.categorical[nodeId];
        const costMatrix = CATEGORY_COST_MATRIX[nodeId];
        let catCostDist = 0;
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 6; j++) {
                catCostDist += nodeState.catDist[i] * ct.probs[j] * (costMatrix[i]?.[j] ?? 0);
            }
        }
        let dot = 0;
        for (let i = 0; i < 6; i++) {
            dot += nodeState.catDist[i] * ct.probs[i];
        }
        const dotDist = 1 - dot;
        let antiCatPenalty = 0;
        if (ct.antiCats) {
            for (const antiIdx of ct.antiCats) {
                if (antiIdx >= 0 && antiIdx < 6)
                    antiCatPenalty += nodeState.catDist[antiIdx] * 0.5;
            }
        }
        const expectedSal = nodeState.salDist[0] * 0 +
            nodeState.salDist[1] * 1 +
            nodeState.salDist[2] * 2 +
            nodeState.salDist[3] * 3;
        const salDiff = Math.abs(expectedSal - ct.sal) / 3;
        const archSalWeight = 0.5 + ct.sal * 0.5;
        const respondentSalWeight = 0.5 + expectedSal * 0.25;
        const nodeWeight = archSalWeight * respondentSalWeight;
        const catDist = catCostDist * 0.5 + dotDist * 0.5;
        const nodeDist = catDist * 0.65 + salDiff * 0.35 + antiCatPenalty;
        contribs.push({ node: nodeId, nodeDist, nodeWeight, contribution: nodeDist * nodeWeight });
    }
    return contribs;
}
// ──────────────────────────────────────────────────────────────────────────
// Archetype-as-state (for pairwise signature-distance family-pair)
// ──────────────────────────────────────────────────────────────────────────
function archetypeToState(arch) {
    const state = {
        answers: {},
        continuous: {},
        categorical: {},
        trbAnchor: { dist: [0, 0, 0, 0, 0, 0, 0, 0, 0], touches: 0 },
        archetypeDistances: {},
    };
    for (const nodeId of CONTINUOUS_NODES) {
        const tmpl = arch.nodes[nodeId];
        if (tmpl && tmpl.kind === "continuous") {
            const ct = tmpl;
            const posDist = [0, 0, 0, 0, 0];
            posDist[ct.pos - 1] = 1;
            const salDist = [0, 0, 0, 0];
            salDist[ct.sal] = 1;
            state.continuous[nodeId] = {
                posDist, salDist, touches: 1, touchTypes: new Set(), status: "live_resolved",
            };
        }
        else {
            state.continuous[nodeId] = {
                posDist: [0.2, 0.2, 0.2, 0.2, 0.2], salDist: [...UNIFORM_SAL],
                touches: 0, touchTypes: new Set(), status: "unknown",
            };
        }
    }
    for (const nodeId of CATEGORICAL_NODES) {
        const tmpl = arch.nodes[nodeId];
        if (tmpl && tmpl.kind === "categorical") {
            const ct = tmpl;
            const salDist = [0, 0, 0, 0];
            salDist[ct.sal] = 1;
            state.categorical[nodeId] = {
                catDist: [...ct.probs],
                salDist,
                touches: 1, touchTypes: new Set(), status: "live_resolved",
            };
        }
        else {
            state.categorical[nodeId] = {
                catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
                salDist: [...UNIFORM_SAL],
                touches: 0, touchTypes: new Set(), status: "unknown",
            };
        }
    }
    return state;
}
// ──────────────────────────────────────────────────────────────────────────
// Softmax (T=0.04, same as quiz at termination)
// ──────────────────────────────────────────────────────────────────────────
function softmaxFromDistance(dists, T) {
    // Lower distance = better match. Convert to "score" = -distance, then softmax.
    const scores = dists.map(d => -d / T);
    const maxScore = Math.max(...scores);
    const exps = scores.map(s => Math.exp(s - maxScore));
    const sum = exps.reduce((a, b) => a + b, 0);
    return exps.map(e => e / sum);
}
// ──────────────────────────────────────────────────────────────────────────
// Git info / provenance
// ──────────────────────────────────────────────────────────────────────────
function fileSha256(absPath) {
    return crypto.createHash("sha256").update(fs.readFileSync(absPath)).digest("hex");
}
function gitInfo() {
    try {
        const sha = execSync("git rev-parse HEAD", { encoding: "utf-8" }).trim();
        const branch = execSync("git rev-parse --abbrev-ref HEAD", { encoding: "utf-8" }).trim();
        const status = execSync("git status --porcelain", { encoding: "utf-8" });
        const dirty = status
            .split("\n")
            .some(l => l.trim() && !l.includes("results/") && !l.includes(".claude/"));
        return { sha, branch, dirty };
    }
    catch {
        return { sha: "unknown", branch: "unknown", dirty: false };
    }
}
// ──────────────────────────────────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────────────────────────────────
function main() {
    const outDir = path.join(process.cwd(), "results", "audit");
    fs.mkdirSync(outDir, { recursive: true });
    console.log("=== PRISM archetype-entity alignment audit ===");
    // Load entities
    const entities = [];
    for (const el of ELECTIONS) {
        for (const c of el.candidates)
            entities.push(candidateToEntity(c, el.year));
    }
    const ALL_REGIMES = [
        ...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA,
    ];
    for (const r of ALL_REGIMES)
        entities.push(regimeToEntity(r));
    const candCount = entities.filter(e => e.entityKind === "candidate").length;
    const regimeCount = entities.filter(e => e.entityKind === "regime").length;
    // Active archetypes (active !== false AND not in deactivated set)
    const activeArchetypes = ARCHETYPES.filter(a => a.active !== false && !DEACTIVATED_IDS.has(a.id));
    console.log(`Elections: ${ELECTIONS.length}  candidates: ${candCount}`);
    console.log(`Regimes:   ${ALL_REGIMES.length}  (entities: ${regimeCount})`);
    console.log(`Active archetypes:     ${activeArchetypes.length}`);
    console.log(`Total entities:        ${entities.length}`);
    console.log(`Softmax T:             ${SOFTMAX_T}`);
    console.log(`Pair-margin threshold: ${MARGIN_PAIR_THRESHOLD}`);
    console.log();
    const startedAt = new Date().toISOString();
    const t0 = Date.now();
    // ── Precompute archetype-archetype pairwise distances for signature-pair flag
    console.log("Computing archetype-archetype pairwise signature distances...");
    const archStates = activeArchetypes.map(a => ({ id: a.id, state: archetypeToState(a) }));
    const archPairDist = new Map();
    for (let i = 0; i < archStates.length; i++) {
        for (let j = i + 1; j < archStates.length; j++) {
            const a = archStates[i];
            const b = archStates[j];
            const dAB = archetypeDistance(a.state, activeArchetypes[j]);
            const dBA = archetypeDistance(b.state, activeArchetypes[i]);
            const dSym = (dAB + dBA) / 2;
            archPairDist.set(`${a.id}|${b.id}`, dSym);
            archPairDist.set(`${b.id}|${a.id}`, dSym);
        }
    }
    const allPairDists = [...new Set([...archPairDist.values()])].sort((a, b) => a - b);
    const pctIdx = Math.floor((allPairDists.length * SIG_PAIR_PERCENTILE) / 100);
    const SIG_PAIR_CUTOFF = allPairDists[pctIdx] ?? 0;
    console.log(`  ${allPairDists.length} unique pairs. 10th-pctl distance cutoff: ${SIG_PAIR_CUTOFF.toFixed(4)}\n`);
    // ── Score entities
    const jsonlPath = path.join(outDir, "entity-scores.jsonl");
    const csvPath = path.join(outDir, "face-validity.csv");
    const wsJson = fs.createWriteStream(jsonlPath, { encoding: "utf-8" });
    const wsCsv = fs.createWriteStream(csvPath, { encoding: "utf-8" });
    wsCsv.write([
        "entityId", "kind", "name", "context",
        "top1Id", "top1Name", "top1Dist", "top1Posterior",
        "top2Id", "top2Name", "top2Dist", "top2Posterior",
        "top3Id", "top3Name", "top3Posterior",
        "marginTop1Top2", "familyPairByMargin", "familyPairBySignature",
        "top1NonIdentifiable", "anyDeactivatedInTop5",
        "topDrivers", "topTensions",
    ].map(csvEscape).join(",") + "\n");
    let marginFlagCount = 0;
    let sigPairFlagCount = 0;
    let nonIdentifiableTop1Count = 0;
    let deactivatedInTop5Count = 0;
    const entityTopArch = [];
    for (const e of entities) {
        const state = entityToState(e);
        const dists = activeArchetypes.map(a => archetypeDistance(state, a));
        const posterior = softmaxFromDistance(dists, SOFTMAX_T);
        const ranked = activeArchetypes
            .map((a, idx) => ({ id: a.id, name: a.name, dist: dists[idx], post: posterior[idx] }))
            .sort((a, b) => a.dist - b.dist);
        const top5 = ranked.slice(0, 5);
        const top1 = top5[0];
        const top2 = top5[1];
        const top3 = top5[2];
        const margin = top2.dist - top1.dist;
        // Family-pair by margin
        const byMargin = margin < MARGIN_PAIR_THRESHOLD;
        // Family-pair by signature distance
        const sigDist = archPairDist.get(`${top1.id}|${top2.id}`) ?? Infinity;
        const bySig = sigDist <= SIG_PAIR_CUTOFF;
        if (byMargin)
            marginFlagCount++;
        if (bySig)
            sigPairFlagCount++;
        // Per-node contributions for top1
        const contribs = perNodeContribution(state, activeArchetypes.find(a => a.id === top1.id));
        const sortedContribs = [...contribs].sort((a, b) => a.contribution - b.contribution);
        const drivers = sortedContribs.slice(0, 3).map(c => `${c.node}=${c.nodeDist.toFixed(3)}`);
        const tensions = [...sortedContribs].reverse().slice(0, 3).map(c => `${c.node}=${c.nodeDist.toFixed(3)}`);
        // Non-identifiable / deactivated flags
        if (NON_IDENTIFIABLE.has(top1.id))
            nonIdentifiableTop1Count++;
        const anyDeactivated = top5.some(t => DEACTIVATED_IDS.has(t.id));
        if (anyDeactivated)
            deactivatedInTop5Count++;
        entityTopArch.push({
            entityId: e.entityId, topId: top1.id, topName: top1.name, kind: e.entityKind,
        });
        const row = {
            entityId: e.entityId,
            entityKind: e.entityKind,
            entityName: e.entityName,
            entityContext: e.entityContext,
            party: e.party ?? null,
            jurisdiction: e.jurisdiction ?? null,
            year: e.year,
            endYear: e.endYear ?? null,
            profile: {
                MAT: e.MAT, CD: e.CD, CU: e.CU, MOR: e.MOR,
                PRO: e.PRO, COM: e.COM, ZS: e.ZS,
                ONT_H: e.ONT_H, ONT_S: e.ONT_S,
                PF: e.PF, TRB: e.TRB, ENG: e.ENG,
                EPS: e.EPS, AES: e.AES,
            },
            top5: top5.map(t => ({ id: t.id, name: t.name, dist: +t.dist.toFixed(5), posterior: +t.post.toFixed(6) })),
            marginTop1Top2: +margin.toFixed(5),
            familyPairByMargin: byMargin,
            familyPairBySignature: bySig,
            signatureDistTop1Top2: +sigDist.toFixed(5),
            topDrivers: sortedContribs.slice(0, 3).map(c => ({
                node: c.node, nodeDist: +c.nodeDist.toFixed(4), nodeWeight: +c.nodeWeight.toFixed(4),
            })),
            topTensions: [...sortedContribs].reverse().slice(0, 3).map(c => ({
                node: c.node, nodeDist: +c.nodeDist.toFixed(4), nodeWeight: +c.nodeWeight.toFixed(4),
            })),
            flags: {
                top1NonIdentifiable: NON_IDENTIFIABLE.has(top1.id),
                anyDeactivatedInTop5: anyDeactivated,
            },
        };
        wsJson.write(JSON.stringify(row) + "\n");
        wsCsv.write([
            e.entityId, e.entityKind, e.entityName, e.entityContext,
            top1.id, top1.name, top1.dist.toFixed(4), top1.post.toFixed(4),
            top2.id, top2.name, top2.dist.toFixed(4), top2.post.toFixed(4),
            top3.id, top3.name, top3.post.toFixed(4),
            margin.toFixed(4), byMargin, bySig,
            NON_IDENTIFIABLE.has(top1.id), anyDeactivated,
            drivers.join("; "), tensions.join("; "),
        ].map(csvEscape).join(",") + "\n");
    }
    wsJson.end();
    wsCsv.end();
    // ── Pre-registered pair occurrence
    const preRegHits = [];
    for (const e of entities) {
        // Need to re-check from the JSONL? It's easier to just re-scan the entityTopArch
        // but we don't have top5 in memory. Just log presence of pre-reg pairs in top-2
        // during main loop instead — TODO later if needed.
    }
    // ── Summary
    const elapsedSec = ((Date.now() - t0) / 1000).toFixed(1);
    const finishedAt = new Date().toISOString();
    const engineHashes = {};
    for (const f of ENGINE_FILES) {
        const abs = path.join(process.cwd(), f);
        if (fs.existsSync(abs))
            engineHashes[f] = fileSha256(abs);
    }
    const manifest = {
        startedAt,
        finishedAt,
        elapsedSec: +elapsedSec,
        git: gitInfo(),
        engineHashes,
        config: {
            scoringFunction: "archetypeDistance (baseline)",
            softmaxT: SOFTMAX_T,
            marginPairThreshold: MARGIN_PAIR_THRESHOLD,
            sigPairPercentile: SIG_PAIR_PERCENTILE,
            sigPairCutoff: SIG_PAIR_CUTOFF,
            deactivatedIds: [...DEACTIVATED_IDS],
            nonIdentifiableIds: [...NON_IDENTIFIABLE],
            preRegisteredPairs: PRE_REGISTERED_PAIRS,
            entitySalienceEncoding: "uniform [0.25,0.25,0.25,0.25] — entity profiles do not encode salience independently",
            entityPositionEncoding: "one-hot at specified position (continuous) / one-hot at specified category (EPS/AES)",
        },
        corpus: {
            electionCount: ELECTIONS.length,
            candidateCount: candCount,
            regimeCount,
            activeArchetypeCount: activeArchetypes.length,
            totalEntities: entities.length,
        },
        flagCounts: {
            familyPairByMargin: marginFlagCount,
            familyPairBySignature: sigPairFlagCount,
            top1NonIdentifiable: nonIdentifiableTop1Count,
            anyDeactivatedInTop5: deactivatedInTop5Count,
        },
    };
    fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2));
    console.log(`\n=== Done (${elapsedSec}s) ===`);
    console.log(`Entities scored:        ${entities.length}`);
    console.log(`family-pair by margin:  ${marginFlagCount}`);
    console.log(`family-pair by sig:     ${sigPairFlagCount}`);
    console.log(`top1 non-identifiable:  ${nonIdentifiableTop1Count}`);
    console.log(`deactivated in top5:    ${deactivatedInTop5Count}  (must be 0)`);
    console.log(`Output:                 ${outDir}`);
}
function csvEscape(v) {
    if (v === null || v === undefined)
        return "";
    const s = String(v);
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}
main();
//# sourceMappingURL=runAudit.js.map