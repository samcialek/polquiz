import assert from "node:assert/strict";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { predictVote } from "../historical/respondentVoteChoice.js";
const userSig = {
    MAT: { pos: 1.5543484064909672, sal: 2.893829483138184 },
    CD: { pos: 2.157007168137523, sal: 1.6986992321874368 },
    CU: { pos: 2.8697199620605067, sal: 2.939042959672591 },
    MOR: { pos: 3.744858322263144, sal: 1.6788641132739706 },
    PRO: { pos: 3.3742978858269814, sal: 2.3162578331856993 },
    COM: { pos: 3.603610091120977, sal: 0.4049586776859504 },
    ZS: { pos: 1.9428785857238162, sal: 0.39085648070173074 },
    ONT_H: { pos: 3.671674691107373, sal: 1.9816217886730003 },
    ONT_S: { pos: 3.6467464539179946, sal: 2.787135706294962 },
    PF: { pos: 4.140000000000001, sal: ((4.140000000000001 - 1) / 4) * 3 },
    TRB: { pos: 2.6902051879025257, sal: ((2.6902051879025257 - 1) / 4) * 3 },
    ENG: { pos: 4.53, sal: ((4.53 - 1) / 4) * 3 },
    EPS: {
        pos: 0.15035789142893527,
        sal: 2.7187395463848696,
        catDist: [
            0.866957750772096,
            0.12356851158399565,
            0.002153332389486508,
            0.001023413273383616,
            0.0061491258507058374,
            0.00014786613033219442,
        ],
    },
    AES: {
        pos: 4.000785376081152,
        sal: 2.6915286711372657,
        catDist: [
            0.06085700755074912,
            0.07443337459958163,
            0.053565322162133285,
            0.07443337459958162,
            0.4072096607353374,
            0.32950126035261706,
        ],
    },
};
const userAnchor = [
    0.28018984977089767,
    0.09326709893444082,
    0.07636064214799337,
    0.11391669188412344,
    0.07636064214799337,
    0.07636064214799337,
    0.07636064214799337,
    0.11391669188412344,
    0.09326709893444082,
];
function prediction(year) {
    const election = ELECTIONS.find(e => e.year === year);
    assert(election, `missing election ${year}`);
    const ctx = getContext(year);
    assert(ctx, `missing context ${year}`);
    return predictVote(userSig, election.candidates, ctx, "highly-engaged", "D", userAnchor);
}
const p1824 = prediction(1824);
assert.notEqual(p1824.nearest.name, "Jackson", "1824 should not resolve to Jackson");
assert.equal(p1824.nearestByValues.name, p1824.nearest.name);
const p1828 = prediction(1828);
assert.equal(p1828.nearest.name, "Adams", "1828 should resolve to Adams over Jackson");
const p1832 = prediction(1832);
assert.notEqual(p1832.nearest.name, "Jackson", "1832 should not resolve to Jackson");
const p1856 = prediction(1856);
assert.equal(p1856.nearest.name, "Fremont", "1856 should resolve to Fremont over Buchanan");
const p1860 = prediction(1860);
assert.equal(p1860.nearest.name, "Lincoln", "1860 should resolve to Lincoln over Douglas");
assert((p1860.candidates.find(c => c.name === "Douglas")?.moralFloorPenalty ?? 0) > 0, "Douglas should receive the rights-context moral-floor penalty");
const p1876 = prediction(1876);
assert.equal(p1876.nearestByValues.name, "Hayes", "1876 values-only winner should be Hayes");
assert.equal(p1876.nearest.name, "Hayes", "1876 predicted winner should remain Hayes after modifiers");
const p2004 = prediction(2004);
assert.equal(p2004.nearest.name, "Kerry", "2004 should resolve to Kerry over Bush");
const kerry2004 = p2004.candidates.find(c => c.name === "Kerry");
const bush2004 = p2004.candidates.find(c => c.name === "Bush");
assert(kerry2004 && bush2004, "missing 2004 candidates");
assert(bush2004.distance - kerry2004.distance > 0.5, "2004 Kerry/Bush margin should no longer be knife-edge");
console.log("user election calibration regression passed");
//# sourceMappingURL=test-user-election-calibration.js.map