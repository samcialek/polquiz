/**
 * Respondent-signature election prediction.
 *
 * Distance formula: weighted Euclidean against each candidate's node profile,
 * where each node's weight is the respondent's archetype salience multiplied
 * by an era-activation multiplier from era-activations.json (1x / 2x / 3x per
 * year × node). See era-activations.ts for the canonical activation map and
 * the multiplier semantics. The prior dense-vector eraWeight + 60/40 blend
 * has been removed; activation-multiplier is the sole era mechanism.
 *
 * Output: per-candidate distances + an engagement-driven clearing bar that
 * decides vote vs abstain.
 *
 * Anti-position branch is intentionally skipped: respondents don't carry
 * anti markers. The archetype classification layer still uses anti.
 */
import { getActivationMultiplier } from "./era-activations.js";
import { getNonIdeologicalModifier, historicalToCanonical } from "./non-ideological-modifiers.js";
// Candidate-side TRB anchor encoding (P3.2, ADR-009). Each anchor predicts
// different identity-driven appeal:
//   national      — appeals to nationalist identity voters
//   ideological   — appeals to ideological-identity voters
//   religious     — appeals to religious-identity voters
//   class         — appeals to class-identity voters
//   ethnic_racial — appeals via ethnic/racial identity (very modern; risky for
//                   pre-1968 elections so use sparingly)
//   gender        — gender-identity appeal
//   sexual        — LGBTQ-coded
//   global        — cosmopolitan, internationalist
//   mixed_none    — no dominant identity hook
//
// Encoded only for candidates where the anchor is a meaningfully distinct
// part of their political appeal. Many candidates leave it null (no signal).
const TRB_ANCHOR_BY_CANDIDATE = {
    // Modern-era — strongest signals
    "Trump_2016": "national",
    "Trump_2020": "national",
    "Trump_2024": "national",
    "Sanders_2016": "class",
    "Sanders_2016_primary": "class", // not in main set but reserved
    "H. Clinton_2016": "ideological",
    "Obama_2008": "ideological",
    "Obama_2012": "ideological",
    "Biden_2020": "national",
    "Harris_2024": "ideological",
    "Romney_2012": "ideological",
    "McCain_2008": "national",
    "Bush_2000": "religious",
    "Bush_2004": "religious",
    "Bush_1988": "national",
    "Bush_1992": "national",
    "Reagan_1980": "ideological",
    "Reagan_1984": "ideological",
    "Carter_1976": "religious",
    "Carter_1980": "religious",
    "Goldwater_1964": "ideological",
    "Johnson_1964": "class",
    "Kennedy_1960": "national",
    "Nixon_1968": "national",
    "Nixon_1972": "national",
    "Roosevelt_1932": "class",
    "Roosevelt_1936": "class",
    "Roosevelt_1940": "class",
    "Roosevelt_1944": "class",
    "Truman_1948": "class",
    "Eisenhower_1952": "national",
    "Eisenhower_1956": "national",
    "Wallace_1968": "ethnic_racial", // segregationist
    "Thurmond_1948": "ethnic_racial", // Dixiecrat
    // Third party / independent
    "Nader_2000": "ideological",
    "Perot_1992": "class",
    "Perot_1996": "class",
    "Anderson_1980": "ideological",
};
const TRB_ANCHOR_ORDER = [
    "national", "ideological", "religious", "class", "ethnic_racial",
    "gender", "sexual", "global", "mixed_none",
];
function getCandidateAnchor(cand) {
    const key = `${cand.name}_${cand.year}`;
    return TRB_ANCHOR_BY_CANDIDATE[key] ?? null;
}
function anchorDistanceContribution(cand, anchorDist) {
    if (!anchorDist)
        return { contribution: 0, weight: 0 };
    const anchor = getCandidateAnchor(cand);
    if (!anchor)
        return { contribution: 0, weight: 0 };
    const idx = TRB_ANCHOR_ORDER.indexOf(anchor);
    if (idx < 0)
        return { contribution: 0, weight: 0 };
    // userMassOnCandidateAnchor: 0-1. Higher = more aligned.
    const userMass = anchorDist[idx] ?? 0;
    // Convert to distance-like contribution. Same scale as categorical (0-4).
    const baseSal = 0.7; // small but nonzero — anchor is a real predictor
    const effectiveSal = Math.pow(baseSal, SALIENCE_POWER);
    const diff2 = (1 - userMass) * 4;
    return { contribution: effectiveSal * diff2, weight: effectiveSal };
}
// Partisan-loyalty multiplier (added 2026-04-24 per ADR-007).
//
// Pure ideological-distance scoring missed a major real-world voting force:
// people with strong party identification vote their party regardless of
// small ideological shifts in candidates. A registered Democrat with high PF
// votes Democratic ~95%+ of the time post-1970 even if the candidate is
// ideologically off in some dimension.
//
// Mechanism: when the respondent has a partyID, multiply the distance to each
// candidate by 1 + PARTY_LOYALTY_BASE × (PF/5) × outOfPartyFactor. PF ranges
// 1-5, so a high-PF (5) Democrat gets a 1 + 0.40 × 1.0 = 1.40× distance bump
// to non-Democratic candidates. A casual (PF=2) Democrat gets ~1.16×. An
// independent (partyID='I') gets no multiplier — ideology dominates.
//
// Party-mapping function below handles historical parties (Democratic-Republican
// counts as 'D' for early-19th-century Jeffersonian Democrats; Whig and
// National Republican count as the proto-Republican coalition).
const PARTY_LOYALTY_BASE = 0.40;
function candidatePartyToCanonical(party) {
    // Map historical / third-party labels to a canonical 4-bucket scheme so
    // the partyID multiplier can decide "is this candidate my party or not?"
    if (party === "Democratic" || party === "Democratic-Republican" ||
        party === "Free Soil" || party === "Dixiecrat")
        return "D";
    if (party === "Republican" || party === "National Republican" ||
        party === "Federalist" || party === "Whig")
        return "R";
    if (party === "Independent" || party === "American Independent" ||
        party === "Libertarian" || party === "Green")
        return "T";
    return "O";
}
function partisanLoyaltyMultiplier(candidateParty, respondentParty, pfPos, electionYear) {
    // Era-limit (P3.4): modern Democrat/Republican loyalty doesn't map cleanly
    // backward onto Whigs, Federalists, Free Soilers, Dixiecrats, etc. Pre-1932
    // (the New Deal realignment), partisan-loyalty multiplier is disabled and
    // ideological distance alone governs.
    if (electionYear < 1932)
        return 1;
    if (!respondentParty || respondentParty === "I" || respondentParty === "N")
        return 1;
    const candPartyKey = candidatePartyToCanonical(candidateParty);
    const userPartyKey = respondentParty === "D" ? "D" :
        respondentParty === "R" ? "R" :
            respondentParty === "T" ? "T" : "O";
    if (candPartyKey === userPartyKey)
        return 1;
    const pf = Math.max(1, Math.min(5, pfPos ?? 3));
    // PF=5 → 1.40× distance to other-party candidates; PF=1 → 1.08×.
    return 1 + PARTY_LOYALTY_BASE * (pf / 5);
}
// Kill switch: non-ideological modifier layer (economic + incumbency +
// charisma) is on by default as of 2026-04-20 per ADR-004. Set env var
// PRISM_NONIDEO=0 to disable it for debugging; any other value (or unset)
// leaves it enabled. See results/non-ideological-layer/.
const NONIDEO_ENABLED = process.env.PRISM_NONIDEO !== "0";
// SELF-cluster nodes are activation-only per ADR-005. PF still drives the
// party-loyalty multiplier, and TRB still contributes via anchor alignment,
// but neither should be treated as a direct candidate-position distance.
const SCORING_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S",
];
// Engagement → clearing-bar thresholds in weighted-RMS distance units (0-4 range).
// Originally anchored to the pre-recoding distance distribution (Stage A,
// 2026-04-19). The 2026-04-23 Pass-1 candidate recodings shrank nearest-
// candidate distances system-wide, so the original bars produced ~2-5%
// abstention rates across centroid-sim runs.
// Retuned 2026-04-23 to target ~20% aggregate abstention per user feedback.
// Scaled down ~30% from original values; re-check against centroid-sim if
// distance distribution shifts further.
// 2026-04-23: tightened "highly-engaged" from 2.45 → 1.90 so that voters at the
// top engagement level abstain when no candidate is within a reasonable
// ideological distance — fixes "Kamala voting for Jackson in 1828 because it's
// the less-bad option" artifact. Casual/engaged bars unchanged.
// 2026-04-23 retune: bars scaled up to give uniform-distribution respondents
// realistic vote-through rates (their raw distances are naturally 1.5–2.0 for
// random positions). Highly-engaged kept below 1.90 so Harris-type universalists
// still abstain when their nearest 1828 option is 1.900+ away.
const CLEARING_BAR = {
    "apolitical": 0.95,
    "casual": 1.40,
    "engaged": 1.70,
    "highly-engaged": 1.85,
};
// 2026-04-23: salience power-law weighting.
// Linear salience weighting (sal as a weight directly) caused single-issue
// voters to be diluted by averaging — a voter with sal=3 on MAT and sal=1 on
// everything else only gave MAT 3× the weight of minor issues, not the ~30×
// weight that matches real single-issue behavior. SALIENCE_POWER=2 squares
// the weight, so sal=3 issues dominate (9× vs 1×) while sal=0 still drops
// cleanly to zero contribution.
const SALIENCE_POWER = 2;
// Categorical-node (EPS/AES) weight in the vote-distance metric. Per ADR-009
// (P3.1), categorical nodes were silently absent from predictVote despite
// being measured for archetype matching. Modern elections (esp. 2016/2024)
// are partly style-driven: fighter vs statesman AES, intuitionist vs
// institutionalist EPS predict vote choice. Added here at low base weight
// (0.30 of policy-node base) so style augments — but doesn't dominate —
// ideological alignment. Era-elevated for elections where style was
// historically decisive: 1932 (FDR's vision/fighter persona), 1960 (Kennedy
// charisma), 1980 (Reagan visionary), 2008 (Obama visionary), 2016 (Trump
// fighter vs Clinton statesman), 2020 (Biden statesman vs Trump fighter),
// 2024 (Harris statesman vs Trump fighter).
const CATEGORICAL_BASE_SALIENCE = 0.6; // before pow-2 squaring → effective ≈0.36
const STYLE_DRIVEN_ELECTIONS = {
    1932: 1.4, 1960: 1.4, 1980: 1.5, 2008: 1.4,
    2016: 2.0, 2020: 1.7, 2024: 1.8,
};
const RIGHTS_VETO_CONTEXTS = {
    1824: "Jacksonian exclusion / Native removal and slavery-era citizenship",
    1828: "Jacksonian exclusion / Native removal and slavery-era citizenship",
    1832: "Jacksonian exclusion / Native removal and slavery-era citizenship",
    1836: "Jacksonian exclusion / slavery-era citizenship",
    1840: "Jacksonian exclusion / slavery-era citizenship",
    1844: "slavery expansion and equal citizenship",
    1848: "slavery expansion and equal citizenship",
    1852: "Fugitive Slave Act / slavery accommodation",
    1856: "slavery expansion and equal citizenship",
    1860: "slavery expansion and equal citizenship",
    1864: "slavery / emancipation / equal citizenship",
    1868: "Reconstruction and Black citizenship",
    1872: "Reconstruction and Black citizenship",
    1876: "Reconstruction and Black citizenship",
    1948: "segregation and civil rights",
    1964: "civil rights and segregation",
    1968: "segregation and civil rights backlash",
};
function clamp01(x) {
    return Math.max(0, Math.min(1, x));
}
function moralFloorPenalty(sig, cand, year) {
    const reason = RIGHTS_VETO_CONTEXTS[year];
    if (!reason)
        return { penalty: 0 };
    if (cand.MOR > 2)
        return { penalty: 0 };
    const mor = sig.MOR;
    if (!mor || mor.pos < 3.5 || mor.sal < 1.5)
        return { penalty: 0 };
    const posStrength = clamp01((mor.pos - 3.5) / 1.5);
    const salStrength = clamp01((mor.sal - 1.5) / 1.5);
    const severity = cand.MOR <= 1 ? 0.20 : 0;
    const penalty = 0.25 + 0.25 * posStrength + 0.25 * salStrength + severity;
    return { penalty, reason };
}
function categoricalDistance(cand, cat, nodeName, year) {
    if (!cat)
        return { contribution: 0, weight: 0 };
    const candIdx = cand[nodeName];
    if (candIdx == null || candIdx < 0 || candIdx >= 6)
        return { contribution: 0, weight: 0 };
    // 1 - userMassOnCandidateCategory: 0 if user is fully aligned, 1 if fully misaligned.
    const alignment = cat.catDist[candIdx] ?? 0;
    const eraMult = STYLE_DRIVEN_ELECTIONS[year] ?? 1.0;
    const baseSal = CATEGORICAL_BASE_SALIENCE * eraMult;
    const effectiveSal = Math.pow(baseSal, SALIENCE_POWER);
    // Convert alignment (0-1) to a distance-like metric in pos² units (0-16
    // matches the policy-node squared-diff range).
    const diff2 = (1 - alignment) * 4; // alignment=1 → diff²=0 ; alignment=0 → diff²=4
    return { contribution: effectiveSal * diff2, weight: effectiveSal };
}
function ideologicalDistance(sig, cand, ctx, anchorDist, dominantNode) {
    let weightedSumSq = 0;
    let totalWeight = 0;
    for (const node of SCORING_NODES) {
        const entry = sig[node];
        if (!entry)
            continue;
        const candPos = cand[node];
        if (candPos == null)
            continue;
        const rawSal = entry.sal * getActivationMultiplier(ctx.year, node);
        let effectiveSal = Math.pow(rawSal, SALIENCE_POWER);
        // Single-issue dominance amplifier (P3.6). If this node has been
        // flagged as the user's dominant single issue, give its contribution
        // a 1.5× multiplier so it can override otherwise-close candidates.
        if (dominantNode === node)
            effectiveSal *= 1.5;
        const diff = entry.pos - candPos;
        weightedSumSq += effectiveSal * diff * diff;
        totalWeight += effectiveSal;
    }
    // EPS / AES categorical contributions (P3.1, ADR-009).
    const epsSig = sig.EPS;
    const aesSig = sig.AES;
    if (epsSig?.catDist) {
        const r = categoricalDistance(cand, { catDist: epsSig.catDist }, "EPS", ctx.year);
        weightedSumSq += r.contribution;
        totalWeight += r.weight;
    }
    if (aesSig?.catDist) {
        const r = categoricalDistance(cand, { catDist: aesSig.catDist }, "AES", ctx.year);
        weightedSumSq += r.contribution;
        totalWeight += r.weight;
    }
    // TRB anchor alignment (P3.2, ADR-009). User's anchor distribution vs
    // candidate's encoded anchor identity. Only fires for candidates with
    // an entry in TRB_ANCHOR_BY_CANDIDATE.
    if (anchorDist) {
        const r = anchorDistanceContribution(cand, anchorDist);
        weightedSumSq += r.contribution;
        totalWeight += r.weight;
    }
    const ideological = totalWeight > 0 ? Math.sqrt(weightedSumSq / totalWeight) : 4;
    return ideological;
}
export function predictVote(sig, candidates, ctx, engagement, partyID, anchorDist, negativeParties, strategicVoting, dominantNode) {
    const pfPos = sig.PF?.pos ?? null;
    const scored = candidates.map(c => {
        const baseValuesDist = ideologicalDistance(sig, c, ctx, anchorDist, dominantNode);
        const moralFloor = moralFloorPenalty(sig, c, ctx.year);
        const valuesDist = baseValuesDist + moralFloor.penalty;
        const nonIdeologicalModifier = NONIDEO_ENABLED
            ? getNonIdeologicalModifier(ctx.year, historicalToCanonical(c.name, c.year)).total
            : 0;
        const nonIdeologicalAdjustedDistance = valuesDist - nonIdeologicalModifier;
        const loyaltyMult = partisanLoyaltyMultiplier(c.party, partyID, pfPos, ctx.year);
        // Negative-partisanship hard penalty (P3.3). Multiplies distance by
        // 1.8x for parties the user has flagged as never-vote.
        let negPenalty = 1.0;
        if (negativeParties) {
            const cp = candidatePartyToCanonical(c.party);
            if ((cp === "D" && negativeParties.has("D")) ||
                (cp === "R" && negativeParties.has("R")) ||
                (cp === "T" && negativeParties.has("T"))) {
                negPenalty = 1.8;
            }
        }
        return {
            name: c.name,
            party: c.party,
            baseIdeologicalDistance: baseValuesDist,
            moralFloorPenalty: moralFloor.penalty,
            ...(moralFloor.reason ? { moralFloorReason: moralFloor.reason } : {}),
            ideologicalDistance: valuesDist,
            nonIdeologicalModifier,
            nonIdeologicalAdjustedDistance,
            partisanMultiplier: loyaltyMult,
            negativePartisanshipMultiplier: negPenalty,
            distance: nonIdeologicalAdjustedDistance * loyaltyMult * negPenalty,
        };
    });
    const nearestByValues = scored.reduce((a, b) => (a.ideologicalDistance <= b.ideologicalDistance ? a : b));
    let nearest = scored.reduce((a, b) => (a.distance <= b.distance ? a : b));
    const clearingBar = CLEARING_BAR[engagement];
    // Strategic voting (P3.5). If user is a strategic voter AND nearest is a
    // third-party candidate AND a major-party candidate is within 0.4 distance,
    // re-route to the lesser-evil major-party. Captures the "I'd prefer Nader
    // but I voted Gore" pattern.
    if (strategicVoting) {
        const nearestCanon = candidatePartyToCanonical(nearest.party);
        if (nearestCanon === "T" || nearestCanon === "O") {
            const majorWithin = scored
                .filter(s => {
                const k = candidatePartyToCanonical(s.party);
                return (k === "D" || k === "R") && (s.distance - nearest.distance) <= 0.4;
            })
                .sort((a, b) => a.distance - b.distance)[0];
            if (majorWithin)
                nearest = majorWithin;
        }
    }
    return {
        year: ctx.year,
        candidates: scored,
        clearingBar,
        nearestByValues,
        nearest,
        valuesDecision: nearestByValues.ideologicalDistance <= clearingBar ? "vote" : "abstain",
        decision: nearest.distance <= clearingBar ? "vote" : "abstain",
    };
}
//# sourceMappingURL=respondentVoteChoice.js.map