import type { CategoricalDist } from "../types.js";
export declare const EPS_CATEGORIES: readonly ["empiricist", "institutionalist", "traditionalist", "intuitionist", "autonomous", "nihilist"];
export declare const AES_CATEGORIES: readonly ["statesman", "technocrat", "pastoral", "authentic", "fighter", "visionary"];
/**
 * Canonical ordered list of the 7 moral-circle boundaries per ADR-006
 * (PR 6.B additive). Order MUST match `MorBoundaryId` in `src/types.ts`
 * and any `MOR_BOUNDARY_ORDER` constants added downstream (e.g., a runtime
 * order constant in `src/engine/math.ts` that PR 6.E will introduce).
 *
 * Boundaries are independent 0..1 boundedness scores — they do NOT sum to 1.
 * Universalism is encoded as "low across all 7" + high intensity, not as
 * a uniform distribution.
 */
export declare const MOR_BOUNDARIES: readonly ["national", "ethnic_racial", "religious", "class", "ideological", "gender", "political_tribe"];
export declare const UNIFORM_CAT: CategoricalDist;
export declare const CATEGORY_COST_MATRIX: Record<"EPS" | "AES", number[][]>;
export declare const EPS_PROTOTYPES: Record<string, CategoricalDist> & {
    empiricist: CategoricalDist;
    institutionalist: CategoricalDist;
    traditionalist: CategoricalDist;
    intuitionist: CategoricalDist;
    autonomous: CategoricalDist;
    nihilist: CategoricalDist;
};
export declare const AES_PROTOTYPES: Record<string, CategoricalDist> & {
    statesman: CategoricalDist;
    technocrat: CategoricalDist;
    pastoral: CategoricalDist;
    authentic: CategoricalDist;
    fighter: CategoricalDist;
    visionary: CategoricalDist;
};
