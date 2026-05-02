/**
 * Element-wise multiply two probability arrays and renormalize.
 * Used for Bayesian updates: posterior ∝ prior × likelihood.
 */
export function multiplyAndNormalize(prior, likelihood) {
    const result = prior.map((p, i) => p * (likelihood[i] ?? 0));
    return normalize(result);
}
/**
 * Normalize an array of non-negative numbers to sum to 1.
 * Guards against all-zero arrays by returning uniform distribution.
 */
export function normalize(arr) {
    const sum = arr.reduce((a, b) => a + b, 0);
    if (sum <= 0) {
        const uniform = arr.map(() => 1 / arr.length);
        return uniform;
    }
    return arr.map((v) => v / sum);
}
const TRB_ANCHOR_ORDER = [
    "national",
    "ideological",
    "religious",
    "class",
    "ethnic_racial",
    "gender",
    "sexual",
    "global",
    "mixed_none",
];
/**
 * Add weighted signals to the TRB anchor distribution.
 * Positive signals increase that anchor's probability; negative decrease.
 * The result is renormalized.
 */
export function addToAnchorDist(current, signals) {
    const updated = [...current];
    for (const [anchor, weight] of Object.entries(signals)) {
        const idx = TRB_ANCHOR_ORDER.indexOf(anchor);
        if (idx >= 0 && weight !== undefined) {
            // Use exponential bump to keep things positive
            updated[idx] = updated[idx] * Math.exp(weight);
        }
    }
    return normalize(updated);
}
// ────────────────────────────────────────────────────────────────────────────
// MOR_BOUNDARIES — compound moral-circle module helpers (ADR-006, PR 6.E.1)
// ────────────────────────────────────────────────────────────────────────────
/**
 * Canonical 7-boundary order. MUST match `MorBoundaryId` in src/types.ts and
 * `MOR_BOUNDARIES` in src/config/categories.ts. Used by anything that needs
 * positional access to the boundaries object.
 */
export const MOR_BOUNDARY_ORDER = [
    "national",
    "ethnic_racial",
    "religious",
    "class",
    "ideological",
    "gender",
    "political_tribe",
];
/** Convert a `MorBoundaries` object to a 7-tuple in canonical order. */
export function morBoundariesToVector(b) {
    return [b.national, b.ethnic_racial, b.religious, b.class, b.ideological, b.gender, b.political_tribe];
}
/** Convert a 7-tuple back to a `MorBoundaries` object. */
export function morBoundariesFromVector(v) {
    return {
        national: v[0] ?? 0,
        ethnic_racial: v[1] ?? 0,
        religious: v[2] ?? 0,
        class: v[3] ?? 0,
        ideological: v[4] ?? 0,
        gender: v[5] ?? 0,
        political_tribe: v[6] ?? 0,
    };
}
/**
 * Default initial MorBoundariesNodeState. Boundaries start at 0.5 — read this
 * as "unknown / no evidence yet," NOT as "moderately bounded." Per ADR-006
 * universalism is encoded as low boundaries + high intensity, so a 0.5 prior
 * is deliberately *not* on the universalist axis; it just means the engine
 * hasn't yet seen evidence to push the score toward 0 or 1. Convex-mix
 * updates from question evidence move boundaries toward their true value
 * over the course of the quiz.
 *
 * Intensity starts at 0 (no activation evidence yet) and is updated by
 * `bumpMorIntensity` via the same convex-mix rule as boundaries — it can
 * move both up (toward high-activation targets like 2.5..3) and down
 * (toward low-activation targets like 0..1) as evidence accumulates.
 */
export function mkInitialMorBoundaries() {
    return {
        boundaries: {
            national: 0.5,
            ethnic_racial: 0.5,
            religious: 0.5,
            class: 0.5,
            ideological: 0.5,
            gender: 0.5,
            political_tribe: 0.5,
        },
        intensity: 0,
        touches: {},
        touchTypes: new Set(),
        status: "unknown",
    };
}
/**
 * Convex-mix update for a single boundary score.
 *
 *   new = old × (1 − mix) + target × mix
 *
 * `target` should be in [0, 1]; `mix` should be in [0, 1] (typically 0.1–0.4
 * per question, depending on signal strength). Result is clamped to [0, 1].
 */
export function addToMorBoundary(current, target, mix) {
    const t = clamp01(target);
    const m = clamp01(mix);
    const updated = current * (1 - m) + t * m;
    return clamp01(updated);
}
/**
 * Convex-mix update for the intensity scalar (0..3 range).
 *
 *   new = old × (1 − mix) + target × mix
 *
 * `target` should be in [0, 3]; `mix` in [0, 1]. Result clamped to [0, 3].
 */
export function bumpMorIntensity(current, target, mix) {
    const t = Math.max(0, Math.min(3, target));
    const m = clamp01(mix);
    const updated = current * (1 - m) + t * m;
    return Math.max(0, Math.min(3, updated));
}
/**
 * Derived measure: max boundary score. Per ADR-006 §"Engine math",
 * `boundaryLoad = max(boundaries)` is the v1 default; the cumulative
 * `min(1, sqrt(Σ b²))` is reserved for v2 if multi-anchor activation needs
 * sharper detection.
 */
export function boundaryLoad(b) {
    return Math.max(b.national, b.ethnic_racial, b.religious, b.class, b.ideological, b.gender, b.political_tribe);
}
/** Derived display metric: how universalist (0..3 scale). */
export function universalismScore(intensity, b) {
    return intensity * (1 - boundaryLoad(b));
}
/** Derived display metric: how identity-bounded (0..3 scale). Replaces the
 * legacy "tribalism" term in v1 — see ADR-006 §"Derived measures".
 */
export function boundednessScore(intensity, b) {
    return intensity * boundaryLoad(b);
}
/**
 * Strict per-key boundary validator (PR 6.E.4a). Throws if any of the 7
 * MOR_BOUNDARY_ORDER keys is absent or not a finite number in [0, 1].
 * Used by morModuleDistance / morTargetVectorDistance to refuse to
 * compute on partial / malformed boundary objects rather than silently
 * substituting per-key defaults.
 */
function assertBoundariesValid(b, label) {
    for (const key of MOR_BOUNDARY_ORDER) {
        const v = b[key];
        if (typeof v !== "number" || !Number.isFinite(v) || v < 0 || v > 1) {
            throw new Error(`${label}: morBoundaries.${key} invalid (got ${String(v)}); ` +
                `must be a finite number in [0, 1]`);
        }
    }
}
/**
 * Strict intensity validator (PR 6.E.4a). Throws if intensity is absent
 * or not a finite number in [0, 3].
 */
function assertIntensityValid(i, label) {
    if (typeof i !== "number" || !Number.isFinite(i) || i < 0 || i > 3) {
        throw new Error(`${label}: intensity invalid (got ${String(i)}); ` +
            `must be a finite number in [0, 3]`);
    }
}
/**
 * Per-module distance for archetype matching: vector distance over the 7
 * boundaries (Euclidean / sqrt(7)) blended with the absolute intensity gap
 * (normalized to /3). 70/30 split; the outer scorer applies the standard
 * salience-weighted multiplier separately, so intensity is NOT double-counted
 * inside the boundary sum.
 *
 *   boundaryDist  = sqrt(Σ (resp.boundaries[i] − arch.boundaries[i])² / 7)
 *   intensityDist = |resp.intensity − arch.intensity| / 3
 *   morModuleDist = 0.7 × boundaryDist + 0.3 × intensityDist
 *
 * Returns a value in [0, 1].
 *
 * Strict invariant (PR 6.E.4a): both sides must carry well-formed
 * morBoundaries. Callers gate on
 * `useMorModule = !!state.morBoundaries && !!archetype.morBoundaries`
 * before invoking. Inside, every boundary key + intensity is validated
 * via `assertBoundariesValid` / `assertIntensityValid`; partial or
 * malformed data throws naming the offending field. No `?? 0.5` per-key
 * fallback — silent neutral-looking results would hide bugs.
 */
export function morModuleDistance(respondent, target, weights = {}) {
    if (!respondent) {
        throw new Error("morModuleDistance: respondent.morBoundaries is missing — caller must gate on useMorModule (PR 6.E.4a invariant)");
    }
    if (!target) {
        throw new Error("morModuleDistance: target.morBoundaries is missing — caller must gate on useMorModule (PR 6.E.4a invariant)");
    }
    assertBoundariesValid(respondent.boundaries, "morModuleDistance respondent");
    assertBoundariesValid(target.boundaries, "morModuleDistance target");
    assertIntensityValid(respondent.intensity, "morModuleDistance respondent");
    assertIntensityValid(target.intensity, "morModuleDistance target");
    const wB = weights.boundary ?? 0.7;
    const wI = weights.intensity ?? 0.3;
    const rb = respondent.boundaries;
    const tb = target.boundaries;
    let sumSq = 0;
    for (const key of MOR_BOUNDARY_ORDER) {
        const d = rb[key] - tb[key];
        sumSq += d * d;
    }
    const boundaryDist = Math.sqrt(sumSq / MOR_BOUNDARY_ORDER.length);
    const intensityDist = Math.abs(respondent.intensity - target.intensity) / 3;
    return wB * boundaryDist + wI * intensityDist;
}
/**
 * Per-target Layer 1 distance for candidate / regime matching: vector
 * distance over the 7 boundaries only. Used by `respondentVoteChoice.ts` and
 * `build-alignment.ts` after PR 6.E.3 cutover. No intensity term — intensity
 * differences for candidates/regimes are handled separately if at all.
 *
 *   politicalDist = sqrt(Σ (resp.boundaries[i] − target.boundaries[i])² / 7)
 *
 * Returns a value in [0, 1].
 *
 * Strict invariant (PR 6.E.4a): same as morModuleDistance — both
 * boundary objects must have all 7 keys finite in [0, 1]. Throws via
 * `assertBoundariesValid` on missing/malformed data. No `?? 0.5`
 * per-key fallback.
 */
export function morTargetVectorDistance(respondentBoundaries, targetBoundaries) {
    if (!respondentBoundaries) {
        throw new Error("morTargetVectorDistance: respondentBoundaries is missing — caller must gate on useMorModule (PR 6.E.4a invariant)");
    }
    if (!targetBoundaries) {
        throw new Error("morTargetVectorDistance: targetBoundaries is missing — caller must gate on useMorModule (PR 6.E.4a invariant)");
    }
    assertBoundariesValid(respondentBoundaries, "morTargetVectorDistance respondent");
    assertBoundariesValid(targetBoundaries, "morTargetVectorDistance target");
    let sumSq = 0;
    for (const key of MOR_BOUNDARY_ORDER) {
        const d = respondentBoundaries[key] - targetBoundaries[key];
        sumSq += d * d;
    }
    return Math.sqrt(sumSq / MOR_BOUNDARY_ORDER.length);
}
/**
 * Validator (PR 6.E.4a): asserts that every entry in a list of objects
 * carries a well-formed morBoundaries field. Used by smokes/diagnostics
 * to verify data integrity at startup or before bulk operations. Returns
 * a list of failure descriptions; empty list means all entries valid.
 *
 * Each entry must:
 *   - have a `morBoundaries` property
 *   - whose `boundaries` passes `validateMorBoundaries` (all 7 keys, finite, [0,1])
 *   - whose `intensity` is a finite number in [0, 3]
 */
export function validateMorBoundariesPopulated(entries, label) {
    const failures = [];
    for (const e of entries) {
        const tag = e.id ?? e.name ?? (e.year !== undefined ? String(e.year) : "(unknown)");
        if (!e.morBoundaries) {
            failures.push(`${label} ${tag}: missing morBoundaries`);
            continue;
        }
        const mb = e.morBoundaries;
        const bErr = validateMorBoundaries(mb.boundaries);
        if (bErr) {
            failures.push(`${label} ${tag}: ${bErr}`);
        }
        const i = mb.intensity;
        if (typeof i !== "number" || !Number.isFinite(i) || i < 0 || i > 3) {
            failures.push(`${label} ${tag}: intensity invalid (${i})`);
        }
    }
    return failures;
}
/**
 * Schema validator for a `MorBoundaries` object. Returns `null` if valid,
 * otherwise an error message naming the first invalid field. Useful for
 * loaders that ingest persisted state and need to fail fast on malformed
 * input.
 */
export function validateMorBoundaries(b) {
    if (!b || typeof b !== "object")
        return "morBoundaries: not an object";
    const obj = b;
    for (const key of MOR_BOUNDARY_ORDER) {
        const v = obj[key];
        if (typeof v !== "number" || !Number.isFinite(v))
            return `morBoundaries.${key}: not a finite number`;
        if (v < 0 || v > 1)
            return `morBoundaries.${key}: out of range [0,1] (${v})`;
    }
    return null;
}
/**
 * Schema validator for a `MorBoundariesNodeState`. Checks both the boundary
 * scores and the intensity scalar.
 */
export function validateMorBoundariesNodeState(s) {
    if (!s || typeof s !== "object")
        return "morBoundariesNodeState: not an object";
    const obj = s;
    const bErr = validateMorBoundaries(obj.boundaries);
    if (bErr)
        return bErr;
    const i = obj.intensity;
    if (typeof i !== "number" || !Number.isFinite(i))
        return "morIntensity: not a finite number";
    if (i < 0 || i > 3)
        return `morIntensity: out of range [0,3] (${i})`;
    return null;
}
function clamp01(x) {
    if (x < 0)
        return 0;
    if (x > 1)
        return 1;
    return x;
}
//# sourceMappingURL=math.js.map