/**
 * Sanity check for the respondent-signature election prediction pipeline.
 *
 * Two passes:
 *   1. Build a NodeSignature directly from an archetype template and run
 *      predictVote across all 60 elections for each engagement level.
 *   2. Build a RespondentState with hand-set posteriors concentrated on the
 *      target archetype's node values, then confirm derivation → predictVote
 *      produces comparable output.
 */
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { respondentSignatureFromState } from "../engine/respondentSignature.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
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
// Build a RespondentState whose posterior is concentrated on the archetype's
// {pos, sal} values. Used to sanity-check the derivation path produces the
// same numbers as direct archetype→signature.
function archetypeAsRespondentState(arch) {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        const tmpl = arch.nodes[nodeId];
        const pos = tmpl && tmpl.kind === "continuous" ? tmpl.pos : 3;
        const sal = tmpl && tmpl.kind === "continuous" ? tmpl.sal : 1;
        const posDist = [0, 0, 0, 0, 0];
        posDist[pos - 1] = 1;
        const salDist = [0, 0, 0, 0];
        salDist[sal] = 1;
        continuous[nodeId] = {
            posDist,
            salDist,
            touches: 10,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        const tmpl = arch.nodes[nodeId];
        const catDist = (tmpl && tmpl.kind === "categorical"
            ? [...tmpl.probs]
            : [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6]);
        const sal = tmpl && tmpl.kind === "categorical" ? tmpl.sal : 1;
        const salDist = [0, 0, 0, 0];
        salDist[sal] = 1;
        categorical[nodeId] = {
            catDist,
            salDist,
            touches: 10,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    return {
        answers: {},
        continuous,
        categorical,
        trbAnchor: {
            dist: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9],
            touches: 0,
        },
        archetypeDistances: {},
    };
}
function summarize(sig, engagement, label) {
    console.log(`\n=== ${label} (engagement: ${engagement}) ===`);
    let votes = 0;
    let abstains = 0;
    const samples = [];
    const sampleYears = new Set([1940, 1960, 1980, 2000, 2020]);
    for (const election of ELECTIONS) {
        const ctx = getContext(election.year);
        if (!ctx)
            continue;
        const pred = predictVote(sig, election.candidates, ctx, engagement);
        if (pred.decision === "vote")
            votes++;
        else
            abstains++;
        if (sampleYears.has(election.year)) {
            const n = pred.nearest;
            const all = pred.candidates
                .map(c => `${c.name.slice(0, 6)}:${c.distance.toFixed(2)}`)
                .join(" ");
            samples.push(`  ${election.year}: nearest=${n.name} d=${n.distance.toFixed(2)} bar=${pred.clearingBar.toFixed(2)} → ${pred.decision}   [${all}]`);
        }
    }
    console.log(`votes: ${votes}, abstains: ${abstains} (of ${votes + abstains})`);
    for (const s of samples)
        console.log(s);
}
// ── Pass 1: archetype-as-signature ─────────────────────────────────────────
const TARGET_ID = "001";
const target = ARCHETYPES.find(a => a.id === TARGET_ID);
if (!target)
    throw new Error(`archetype ${TARGET_ID} not found`);
console.log(`Pass 1: ${target.id} ${target.name} (archetype template → signature)`);
const archSig = archetypeToSignature(target);
for (const level of ["apolitical", "casual", "engaged", "highly-engaged"]) {
    summarize(archSig, level, `${target.id} @ ${level}`);
}
// ── Pass 2: RespondentState → signature ────────────────────────────────────
console.log(`\n\nPass 2: RespondentState (concentrated on ${target.id}) → derived signature`);
const state = archetypeAsRespondentState(target);
const respSig = respondentSignatureFromState(state);
console.log("signature diff (arch-direct vs state-derived, 11 scoring nodes):");
for (const node of ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB"]) {
    const a = archSig[node];
    const r = respSig[node];
    const match = a && r && Math.abs(a.pos - r.pos) < 1e-9 && Math.abs(a.sal - r.sal) < 1e-9 ? "✓" : "✗";
    console.log(`  ${node}: arch=(${a?.pos}, ${a?.sal}) derived=(${r?.pos.toFixed(2)}, ${r?.sal.toFixed(2)}) ${match}`);
}
summarize(respSig, "engaged", `${target.id} state-derived @ engaged`);
//# sourceMappingURL=test-respondent-vote.js.map