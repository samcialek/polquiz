import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";
// Delta at position p (1..5) → ContinuousPosDist
function posAt(p) {
    const d = [0, 0, 0, 0, 0];
    d[p - 1] = 1;
    return d;
}
function makeContinuous(p) {
    return {
        posDist: posAt(p),
        salDist: [0, 0, 0, 1],
        touches: 1,
        touchTypes: new Set(),
        status: "live_resolved",
    };
}
function makeCategorical() {
    return {
        catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
        salDist: [1, 0, 0, 0],
        touches: 0,
        touchTypes: new Set(),
        status: "unknown",
    };
}
// Anchor order: national, ideological, religious, class, ethnic_racial, gender, sexual, global, mixed_none
function anchorDist(topIdx) {
    const d = [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05];
    d[topIdx] = 0.6;
    return d;
}
// Build a state with specified continuous node positions; others default to 3
function buildState(positions, topAnchorIdx) {
    const continuousIds = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG"];
    const continuous = {};
    for (const id of continuousIds) {
        continuous[id] = makeContinuous(positions[id] ?? 3);
    }
    return {
        answers: {},
        continuous: continuous,
        categorical: {
            EPS: makeCategorical(),
            AES: makeCategorical(),
        },
        trbAnchor: { dist: anchorDist(topAnchorIdx), touches: 1 },
        archetypePosterior: {},
    };
}
const cases = [
    {
        name: "LGBTQ Voter — sexual anchor + demo_lgbtq=yes + high TRB/PF/ENG",
        state: buildState({ TRB: 5, PF: 5, ENG: 4 }, 6), // sexual = idx 6
        demographics: { demo_lgbtq: "yes" },
        expectLabel: "LGBTQ Voter",
        expectState: "dominant",
    },
    {
        name: "LGBTQ unresolved — sexual anchor but demo_lgbtq missing",
        state: buildState({ TRB: 5, PF: 5, ENG: 4 }, 6),
        demographics: {},
        expectLabel: undefined,
        expectState: "unresolved",
    },
    {
        name: "Feminist Voter — gender anchor + female + progressive signals",
        state: buildState({ TRB: 5, PF: 5, ENG: 4, CD: 1, MOR: 5, ONT_S: 5 }, 5), // gender = idx 5
        demographics: { demo_gender: "female" },
        expectLabel: "Feminist Voter",
        expectState: "dominant",
    },
    {
        name: "Feminist unresolved — female but insufficient progressive signals",
        state: buildState({ TRB: 5, PF: 5, ENG: 4, CD: 4, MOR: 2, ONT_S: 2 }, 5),
        demographics: { demo_gender: "female" },
        expectLabel: undefined,
        expectState: "unresolved",
    },
    {
        name: "Male Grievance Voter — gender anchor + male + grievance signals",
        state: buildState({ TRB: 5, PF: 5, ENG: 4, ZS: 5, CD: 5, ONT_S: 1 }, 5),
        demographics: { demo_gender: "male" },
        expectLabel: "Male Grievance Voter",
        expectState: "dominant",
    },
    {
        name: "Male unresolved — male but insufficient grievance signals",
        state: buildState({ TRB: 5, PF: 5, ENG: 4, ZS: 2, CD: 2, ONT_S: 4 }, 5),
        demographics: { demo_gender: "male" },
        expectLabel: undefined,
        expectState: "unresolved",
    },
    {
        name: "Black Voter (regression) — racial anchor + black",
        state: buildState({ TRB: 5, PF: 5, ENG: 4 }, 4), // ethnic_racial = idx 4
        demographics: { demo_ethnicity: "black" },
        expectLabel: "Black Voter",
        expectState: "dominant",
    },
    {
        name: "Gate not met — TRB too low",
        state: buildState({ TRB: 2, PF: 2, ENG: 2 }, 6),
        demographics: { demo_lgbtq: "yes" },
        expectLabel: undefined,
        expectState: "none",
    },
];
let pass = 0;
let fail = 0;
for (const c of cases) {
    const result = resolveIdentityPrimary(c.state, c.demographics);
    const ok = result.label === c.expectLabel && result.state === c.expectState;
    if (ok) {
        pass++;
        console.log(`PASS  ${c.name}`);
        console.log(`      → state=${result.state} label=${result.label ?? "(none)"} anchor=${result.anchor} conf=${result.confidence ?? "(n/a)"}`);
    }
    else {
        fail++;
        console.log(`FAIL  ${c.name}`);
        console.log(`      expected: state=${c.expectState} label=${c.expectLabel ?? "(none)"}`);
        console.log(`      got:      state=${result.state} label=${result.label ?? "(none)"} anchor=${result.anchor} conf=${result.confidence ?? "(n/a)"}`);
        console.log(`      reasons:  ${result.reasonCodes.join(", ")}`);
    }
}
console.log();
console.log(`${pass} passed, ${fail} failed (${cases.length} total)`);
if (fail > 0)
    process.exit(1);
//# sourceMappingURL=resolver-smoke.js.map