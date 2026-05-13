// Averaging state: parallel fork of RespondentState that stores running
// averages instead of Bayesian posteriors.
//
// Each answer produces integer codes (pos: 1-5, sal: 0-3). A node's current
// estimate is the arithmetic mean of every code it has received. A node with
// zero observations defaults to the prior-equivalent midpoint (pos=3, sal=1.5)
// so that distance scoring against an un-touched node treats it as neutral.
//
// Contrast with the Bayesian engine in update.ts + archetypeDistance.ts:
// instead of multiplying likelihood vectors and reading the posterior's
// expected value, we accumulate observation codes directly. Compounding is
// lost (the Bayesian system can reach E[sal]=0.14 with many signals; this
// floors at min(code) = 0), but the engine becomes authorable in plain
// integers rather than probability vectors.
import { CONTINUOUS_NODES, CATEGORICAL_NODES } from "../config/nodes.js";
const DEFAULT_POS = 3;
const DEFAULT_SAL = 1.5;
const DEFAULT_CAT = [
    1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6,
];
export function createInitialStateAvg() {
    const continuous = {};
    for (const nodeId of CONTINUOUS_NODES) {
        continuous[nodeId] = {
            pos: { sum: 0, count: 0 },
            sal: { sum: 0, count: 0 },
            touches: 0,
            touchTypes: new Set(),
        };
    }
    const categorical = {};
    for (const nodeId of CATEGORICAL_NODES) {
        categorical[nodeId] = {
            catSum: [0, 0, 0, 0, 0, 0],
            catCount: 0,
            sal: { sum: 0, count: 0 },
            touches: 0,
            touchTypes: new Set(),
        };
    }
    return {
        answers: {},
        continuous,
        categorical,
        trbAnchor: {
            dist: [0, 0, 0, 0, 0, 0, 0, 0, 0],
            touches: 0,
        },
        archetypeDistances: {},
    };
}
export function getPos(state, node) {
    const acc = state.continuous[node].pos;
    return acc.count > 0 ? acc.sum / acc.count : DEFAULT_POS;
}
export function getSal(state, node) {
    const s = node in state.continuous
        ? state.continuous[node].sal
        : state.categorical[node].sal;
    return s.count > 0 ? s.sum / s.count : DEFAULT_SAL;
}
export function getCat(state, node) {
    const c = state.categorical[node];
    if (c.catCount <= 0)
        return [...DEFAULT_CAT];
    return c.catSum.map((v) => v / c.catCount);
}
// Codes are real-valued (not forced to integers). A pos touch carrying
// evidence like [0.50, 0.30, 0.15, 0.05, 0.00] produces code=1.75, which
// preserves more signal than rounding to 2. The averaging nature is unchanged:
// sum/count is the running mean. Clamps keep codes in the engine-valid range.
export function addPos(state, node, code) {
    const clamped = Math.max(1, Math.min(5, code));
    const acc = state.continuous[node].pos;
    acc.sum += clamped;
    acc.count += 1;
}
export function addSal(state, node, code) {
    const clamped = Math.max(0, Math.min(3, code));
    const s = node in state.continuous
        ? state.continuous[node].sal
        : state.categorical[node].sal;
    s.sum += clamped;
    s.count += 1;
}
export function addCat(state, node, dist) {
    const c = state.categorical[node];
    const sum = dist.reduce((a, b) => a + b, 0) || 1;
    for (let i = 0; i < 6; i++)
        c.catSum[i] = (c.catSum[i] ?? 0) + (dist[i] ?? 0) / sum;
    c.catCount += 1;
}
export function registerTouchAvg(state, node, touchType) {
    const s = node in state.continuous
        ? state.continuous[node]
        : state.categorical[node];
    s.touches += 1;
    s.touchTypes.add(touchType);
}
// Expected-value conversions from Bayesian likelihood vectors to real-valued
// codes. No rounding — keeping fractional E preserves the strength of the
// Bayesian vector's "lean" (e.g. [0.5, 0.3, 0.15, 0.05, 0] → 1.75, not 2).
// The averaging runs a mean over these values; arithmetic is identical to
// averaging integers, you just don't throw away the sub-integer signal.
export function posCodeFromDist(dist) {
    if (!dist || dist.length !== 5)
        return null;
    const total = dist.reduce((a, b) => a + b, 0);
    if (total <= 0)
        return null;
    const e = (dist[0] * 1 + dist[1] * 2 + dist[2] * 3 + dist[3] * 4 + dist[4] * 5) / total;
    return Math.max(1, Math.min(5, e));
}
export function salCodeFromDist(dist) {
    if (!dist || dist.length !== 4)
        return null;
    const total = dist.reduce((a, b) => a + b, 0);
    if (total <= 0)
        return null;
    const e = (dist[0] * 0 + dist[1] * 1 + dist[2] * 2 + dist[3] * 3) / total;
    return Math.max(0, Math.min(3, e));
}
//# sourceMappingURL=stateAvg.js.map