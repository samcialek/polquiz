/**
 * Identity-primary resolver regression + synthetic test battery.
 *
 * Adds 2026-04-24 alongside ADR-006 (identity-primary policy-flat refactor).
 *
 * Cases:
 *   1. NEGATIVE — replay of user's actual quiz signature: Loyal-Democrat-shaped
 *      progressive with national anchor and high policy salience. Resolver
 *      should return null identity-primary, reason "policy_salience_too_high".
 *
 *   2. POSITIVE — synthetic identity-primary candidate per anchor:
 *        Black Voter (ethnic_racial anchor + black demographic + ideology-thin)
 *        White Grievance Voter (ethnic_racial + white)
 *        Evangelical Voter (religious + christian)
 *        LGBTQ Voter (sexual + yes)
 *        Feminist Voter (gender + female)
 *        Male Grievance Voter (gender + male)
 *
 *   3. NEGATIVE — same anchor + demographic as #2 but with high policy salience.
 *      Resolver should return unresolved, "policy_salience_too_high".
 *
 *   4. NEGATIVE — identity-thin user with national anchor (civic). Resolver
 *      should return unresolved, "national_anchor_civic_not_demographic".
 *
 *   5. NEGATIVE — identity-thin user with anchor at exactly threshold mass
 *      (0.20, below the 0.25 bar). Resolver should return "anchor_not_dominant".
 *
 *   6. NEGATIVE — passes all gates but no demographic provided. Resolver
 *      should return "missing_demographic_confirmation".
 */
import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";
// ── Helpers to build synthetic states ───────────────────────────────────────
function peakedPos(pos, sigma = 0.4) {
    const out = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        const d = i + 1 - pos;
        out[i] = Math.exp(-(d * d) / (2 * sigma * sigma));
    }
    const s = out.reduce((a, b) => a + b, 0);
    return out.map((p) => p / s);
}
function peakedSal(sal, sigma = 0.5) {
    const out = [0, 0, 0, 0];
    for (let i = 0; i < 4; i++) {
        const d = i - sal;
        out[i] = Math.exp(-(d * d) / (2 * sigma * sigma));
    }
    const s = out.reduce((a, b) => a + b, 0);
    return out.map((p) => p / s);
}
function uniformCat() {
    return [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6];
}
function anchorDist(target, mass) {
    // 9 anchors. Put `mass` on `target` index, distribute the rest evenly.
    const remaining = (1 - mass) / 8;
    const out = new Array(9).fill(remaining);
    out[target] = mass;
    return out;
}
function buildState(opts = {}) {
    const trbPos = opts.trbPos ?? 5;
    const pfPos = opts.pfPos ?? 5;
    const engPos = opts.engPos ?? 4;
    const policySals = opts.policySals ?? {};
    const policyPositions = opts.policyPositions ?? {};
    const anchorIdx = opts.anchorIdx ?? 4; // ethnic_racial by default
    const anchorMass = opts.anchorMass ?? 0.45;
    const continuous = {};
    const continuousNonSelf = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S"];
    for (const nid of continuousNonSelf) {
        const pos = policyPositions[nid] ?? 3;
        const sal = policySals[nid] ?? 0;
        continuous[nid] = {
            posDist: peakedPos(pos),
            salDist: peakedSal(sal),
            touches: 1,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    for (const [nid, pos] of [["PF", pfPos], ["TRB", trbPos], ["ENG", engPos]]) {
        continuous[nid] = {
            posDist: peakedPos(pos),
            salDist: peakedSal(1.5),
            touches: 1,
            touchTypes: new Set(),
            status: "live_resolved",
        };
    }
    const categorical = {};
    for (const nid of ["EPS", "AES"]) {
        categorical[nid] = {
            catDist: uniformCat(),
            salDist: peakedSal(policySals[nid] ?? 0),
            touches: 0,
            touchTypes: new Set(),
            status: "unknown",
        };
    }
    return {
        answers: {},
        continuous,
        categorical,
        trbAnchor: { dist: anchorDist(anchorIdx, anchorMass), touches: 1 },
        archetypeDistances: {},
        currentLeader: undefined,
        consecutiveLeadCount: 0,
    };
}
const ENGAGED = {
    level: "engaged", salience: "medium", position: 3.5, saliencePosition: 1.5,
};
const HIGHLY_ENGAGED = {
    level: "highly-engaged", salience: "high", position: 4.5, saliencePosition: 2.5,
};
const cases = [
    // 1. User's actual signature replay (negative — high policy salience).
    {
        name: "NEG: user trace replay (high policy salience)",
        state: buildState({
            trbPos: 3.72,
            pfPos: 4.14,
            engPos: 4.5,
            policySals: { MAT: 2.94, CU: 2.97, PRO: 2.68, ONT_S: 2.83, EPS: 2.63, AES: 2.78, CD: 1.81, MOR: 1.74 },
            anchorIdx: 0, // national
            anchorMass: 0.30,
        }),
        engagement: HIGHLY_ENGAGED,
        demographics: null,
        expect: { state: "unresolved", reasonHas: "policy_salience_too_high" },
    },
    // 2a. POSITIVE — clean Black Voter
    {
        name: "POS: identity-thin Black Voter",
        state: buildState({ anchorIdx: 4, anchorMass: 0.45 }),
        engagement: ENGAGED,
        demographics: { demo_ethnicity: "black" },
        expect: { state: "active", label: "Black Voter", reasonHas: "black_demographic_match" },
    },
    // 2b. POSITIVE — White Grievance Voter
    {
        name: "POS: identity-thin White Grievance Voter",
        state: buildState({ anchorIdx: 4, anchorMass: 0.45 }),
        engagement: ENGAGED,
        demographics: { demo_ethnicity: "white" },
        expect: { state: "active", label: "White Grievance Voter", reasonHas: "white_demographic_match" },
    },
    // 2c. POSITIVE — Evangelical Voter
    {
        name: "POS: identity-thin Evangelical Voter",
        state: buildState({ anchorIdx: 2, anchorMass: 0.45 }),
        engagement: ENGAGED,
        demographics: { demo_religion: "christian" },
        expect: { state: "active", label: "Evangelical Voter", reasonHas: "christian_demographic_match" },
    },
    // 2d. POSITIVE — LGBTQ Voter
    {
        name: "POS: identity-thin LGBTQ Voter",
        state: buildState({ anchorIdx: 6, anchorMass: 0.45 }),
        engagement: ENGAGED,
        demographics: { demo_lgbtq: "yes" },
        expect: { state: "active", label: "LGBTQ Voter", reasonHas: "lgbtq_demographic_match" },
    },
    // 2e. POSITIVE — Feminist Voter
    {
        name: "POS: identity-thin Feminist Voter",
        state: buildState({ anchorIdx: 5, anchorMass: 0.45 }),
        engagement: ENGAGED,
        demographics: { demo_gender: "female" },
        expect: { state: "active", label: "Feminist Voter", reasonHas: "female_demographic_match" },
    },
    // 2f. POSITIVE — Male Grievance Voter
    {
        name: "POS: identity-thin Male Grievance Voter",
        state: buildState({ anchorIdx: 5, anchorMass: 0.45 }),
        engagement: ENGAGED,
        demographics: { demo_gender: "male" },
        expect: { state: "active", label: "Male Grievance Voter", reasonHas: "male_demographic_match" },
    },
    // 3. NEGATIVE — same anchor+demographic as 2a but heavy ideology
    {
        name: "NEG: ethnic_racial+black demographic but high MAT/MOR/ONT_S salience",
        state: buildState({
            anchorIdx: 4,
            anchorMass: 0.45,
            policySals: { MAT: 2.8, MOR: 2.6, ONT_S: 2.7 },
        }),
        engagement: ENGAGED,
        demographics: { demo_ethnicity: "black" },
        expect: { state: "unresolved", reasonHas: "policy_salience_too_high" },
    },
    // 4. NEGATIVE — national anchor (civic, not demographic-identity)
    {
        name: "NEG: national anchor falls through",
        state: buildState({ anchorIdx: 0, anchorMass: 0.45 }),
        engagement: ENGAGED,
        demographics: { demo_ethnicity: "white" },
        expect: { state: "unresolved", reasonHas: "national_anchor_civic_not_demographic" },
    },
    // 5. NEGATIVE — anchor present but not dominant (mass below 0.25)
    {
        name: "NEG: anchor mass below 0.25",
        state: buildState({ anchorIdx: 4, anchorMass: 0.20 }),
        engagement: ENGAGED,
        demographics: { demo_ethnicity: "black" },
        expect: { state: "unresolved", reasonHas: "anchor_not_dominant" },
    },
    // 6. NEGATIVE — passes all gates but no demographic provided
    {
        name: "NEG: missing demographic confirmation",
        state: buildState({ anchorIdx: 4, anchorMass: 0.45 }),
        engagement: ENGAGED,
        demographics: null,
        expect: { state: "unresolved", reasonHas: "missing_demographic_confirmation" },
    },
];
// ── Run cases ───────────────────────────────────────────────────────────────
let pass = 0;
let fail = 0;
console.log(`Identity-primary resolver — ${cases.length} cases`);
console.log("=".repeat(70));
for (const c of cases) {
    const result = resolveIdentityPrimary(c.state, c.engagement, c.demographics);
    const stateOk = result.state === c.expect.state;
    const labelOk = c.expect.label ? result.label === c.expect.label : true;
    const reasonOk = result.reasonCodes.some((r) => r.includes(c.expect.reasonHas));
    const ok = stateOk && labelOk && reasonOk;
    if (ok)
        pass++;
    else
        fail++;
    const icon = ok ? "✓" : "✗";
    console.log(`${icon} ${c.name}`);
    if (!ok) {
        console.log(`    expected state=${c.expect.state}${c.expect.label ? `, label=${c.expect.label}` : ""}, reasonHas=${c.expect.reasonHas}`);
        console.log(`    actual   state=${result.state}, label=${result.label ?? "—"}, reasons=[${result.reasonCodes.join(", ")}]`);
        console.log(`    gate: trb=${result.gate.trb.toFixed(2)} pf=${result.gate.pf.toFixed(2)} polScore=${result.gate.policySalienceScore.toFixed(2)} highCount=${result.gate.highSaliencePolicyCount} anchorMass=${result.gate.anchorMass.toFixed(2)} anchorMargin=${result.gate.anchorMargin.toFixed(2)}`);
    }
}
console.log("=".repeat(70));
console.log(`${pass} pass, ${fail} fail`);
if (fail > 0)
    process.exit(1);
//# sourceMappingURL=test-identity-primary-resolver.js.map