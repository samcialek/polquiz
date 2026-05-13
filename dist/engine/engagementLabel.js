const APOLITICAL_MAX = 2.0;
const CASUAL_MAX = 3.0;
const ENGAGED_MAX = 4.0;
const SALIENCE_LOW_MAX = 1.0;
const SALIENCE_MEDIUM_MAX = 2.0;
function expectedPos(posDist) {
    return ((posDist[0] ?? 0) * 1 +
        (posDist[1] ?? 0) * 2 +
        (posDist[2] ?? 0) * 3 +
        (posDist[3] ?? 0) * 4 +
        (posDist[4] ?? 0) * 5);
}
function expectedSal(salDist) {
    return ((salDist[0] ?? 0) * 0 +
        (salDist[1] ?? 0) * 1 +
        (salDist[2] ?? 0) * 2 +
        (salDist[3] ?? 0) * 3);
}
function levelForPosition(pos) {
    if (pos < APOLITICAL_MAX)
        return "apolitical";
    if (pos < CASUAL_MAX)
        return "casual";
    if (pos < ENGAGED_MAX)
        return "engaged";
    return "highly-engaged";
}
function salienceForPosition(sal) {
    if (sal < SALIENCE_LOW_MAX)
        return "low";
    if (sal < SALIENCE_MEDIUM_MAX)
        return "medium";
    return "high";
}
export function computeEngagementLabel(state) {
    const eng = state.continuous.ENG;
    const position = eng ? expectedPos(eng.posDist) : 3.0;
    const saliencePosition = eng ? expectedSal(eng.salDist) : 1.5;
    return {
        level: levelForPosition(position),
        salience: salienceForPosition(saliencePosition),
        position,
        saliencePosition,
    };
}
//# sourceMappingURL=engagementLabel.js.map