/**
 * PRISM non-ideological modifier layer.
 *
 * Canonical data lives in non-ideological-data.json. This module:
 *   - declares the NonIdeologicalModifier type,
 *   - loads + validates the JSON at module-load time,
 *   - exports getNonIdeologicalModifier(year, candidateKey) returning the
 *     three components + their weighted-and-clipped total,
 *   - exports historicalToCanonical(name, year) — resolves candidate names
 *     used in src/historical/candidates.ts (bare last names like "Roosevelt")
 *     to the disambiguated keys used in consensus-final.json + this data file
 *     (e.g., "Roosevelt_1932" → "RooseveltFranklin_1932"). This is the
 *     crosswalk used at the integration point in respondentVoteChoice.ts.
 *
 * Composition (see data file _meta.formula):
 *   non_ideo = 0.60 * economic + 0.20 * incumbency + 0.20 * charisma,
 *   clipped to [-0.30, +0.30].
 *
 * 2026-05-14 (charisma calibration in flight): the charisma component is
 * currently hand-assigned 1–5 per candidate per cycle (Trump_2016 = 4.3,
 * Trump_2020 = 4.3, McCain_2008 = 3, etc.) with no documented derivation.
 * That makes it a subjective lever — overfitting hazard. Replacement plan:
 * derive charisma from public time-stamped polling (Gallup approval for
 * incumbents, net favorability for challengers) so every value traces to an
 * external source. See results/non-ideological/polling-derived-charisma.md
 * for the methodology + data assembly. Once that's in place, the hand-set
 * scores in non-ideological-data.json get replaced and the formula here
 * unchanged.
 *
 * Application at call site:
 *   final_distance = ideological_distance - non_ideo
 * (positive total helps the candidate — pulls distance down).
 *
 * Third-party candidates get economic_component = 0 (neither rewarded nor
 * punished for the incumbent party's record).
 */
import dataJson from "./non-ideological-data.json" with { type: "json" };
const WEIGHT_ECON = 0.60;
const WEIGHT_INCUMB = 0.20;
const WEIGHT_CHARISMA = 0.20;
// 2026-04-23: tightened from 0.30 → 0.20 after the candidates-as-voters
// diagnostic revealed Obama's +0.20 modifier was flipping elections where
// ideological distance was within 0.3 (e.g. Trump/Nixon/Harding → Obama in
// 2012). At 0.20, non-ideo factors still nudge but can't override clear
// ideological gaps.
const TOTAL_CAP = 0.20;
const MIN_YEAR = 1789;
const MAX_YEAR = 2024;
function loadAndValidate() {
    const parsed = dataJson;
    if (!parsed.elections || typeof parsed.elections !== "object") {
        throw new Error("non-ideological-data.json: missing or malformed 'elections' map");
    }
    if (!parsed.candidates || typeof parsed.candidates !== "object") {
        throw new Error("non-ideological-data.json: missing or malformed 'candidates' map");
    }
    for (const [yearStr, entry] of Object.entries(parsed.elections)) {
        if (!/^\d{4}$/.test(yearStr)) {
            throw new Error(`non-ideological-data.json: election key ${yearStr} is not a 4-digit year`);
        }
        const year = Number(yearStr);
        if (year < MIN_YEAR || year > MAX_YEAR) {
            throw new Error(`non-ideological-data.json: year ${year} outside [${MIN_YEAR}, ${MAX_YEAR}]`);
        }
        if (typeof entry.raw_econ !== "number" || entry.raw_econ < -1 || entry.raw_econ > 1) {
            throw new Error(`non-ideological-data.json: year ${year} raw_econ invalid (${entry.raw_econ})`);
        }
    }
    for (const [key, entry] of Object.entries(parsed.candidates)) {
        if (typeof entry.is_incumbent_person !== "boolean") {
            throw new Error(`non-ideological-data.json: candidate ${key} missing is_incumbent_person`);
        }
        if (typeof entry.charisma !== "number" || entry.charisma < 1 || entry.charisma > 5) {
            throw new Error(`non-ideological-data.json: candidate ${key} charisma invalid (${entry.charisma})`);
        }
        if (typeof entry.party !== "string") {
            throw new Error(`non-ideological-data.json: candidate ${key} missing party`);
        }
    }
    return parsed;
}
const DATA = loadAndValidate();
// Crosswalk from candidates.ts bare last-name keys to data-file keys.
// The data file uses the same bare-last-name + year convention as
// candidates.ts, so most candidate names round-trip unchanged (e.g.,
// Kennedy_1960 → Kennedy_1960, Roosevelt_1932 → Roosevelt_1932, Bush_1988 →
// Bush_1988). The only candidate whose candidates.ts name format differs
// from the data-file key is Henry A. Wallace — candidates.ts stores "H.
// Wallace" (with space and period), the data file uses "HWallace" to keep
// the key identifier-safe.
const NAME_OVERRIDES = {
    "H. Wallace_1948": "HWallace_1948",
};
/**
 * Resolve a "<name>_<year>" key from candidates.ts to the data-file key.
 * Falls back to the raw concatenation for names that don't need disambiguation.
 */
export function historicalToCanonical(name, year) {
    const raw = `${name}_${year}`;
    return NAME_OVERRIDES[raw] ?? raw;
}
function clip(x, lo, hi) {
    return Math.max(lo, Math.min(hi, x));
}
function economicComponent(rawEcon, candidateParty, incumbentParty) {
    if (incumbentParty == null)
        return 0;
    const base = 0.5 * rawEcon;
    if (candidateParty === incumbentParty)
        return base;
    // Third-party / minor-party candidates don't get rewarded or punished
    // for the incumbent party's economic record. Only the two main parties
    // (one of which is the incumbent party) split the sign.
    const major = ["Democratic", "Republican", "Whig", "Federalist", "Democratic-Republican", "National Republican"];
    const candIsMajor = major.includes(candidateParty);
    const incumbIsMajor = major.includes(incumbentParty);
    if (!candIsMajor || !incumbIsMajor)
        return 0;
    return -base;
}
/**
 * Look up (year, candidateKey) in the non-ideological data file and return
 * the three modifier components plus the weighted-and-capped total.
 *
 * candidateKey must be a data-file key (e.g., "Roosevelt_1932"), not a
 * candidates.ts bare-name key. Call historicalToCanonical() first if
 * going from the respondent-vote-choice integration point.
 *
 * Returns an all-zero modifier if the year or candidate key is unknown.
 * (Unknown inputs must not crash the alignment pipeline; they just
 * contribute no nudge.)
 */
export function getNonIdeologicalModifier(year, candidateKey) {
    const election = DATA.elections[String(year)];
    const cand = DATA.candidates[candidateKey];
    if (!election || !cand) {
        return { economic: 0, incumbency: 0, charisma: 0, total: 0 };
    }
    const economic = economicComponent(election.raw_econ, cand.party, election.incumbent_party);
    const incumbency = cand.is_incumbent_person ? 0.3 : 0;
    const charisma = (cand.charisma - 3) / 4;
    const raw = WEIGHT_ECON * economic + WEIGHT_INCUMB * incumbency + WEIGHT_CHARISMA * charisma;
    const total = clip(raw, -TOTAL_CAP, TOTAL_CAP);
    return { economic, incumbency, charisma, total };
}
//# sourceMappingURL=non-ideological-modifiers.js.map