import type { CategoricalDist } from "../types.js";
export declare const EPS_CATEGORIES: readonly ["empiricist", "institutionalist", "traditionalist", "intuitionist", "autonomous", "nihilist"];
export declare const AES_CATEGORIES: readonly ["statesman", "technocrat", "pastoral", "authentic", "fighter", "visionary"];
export declare const TRB_ANCHORS: readonly ["national", "ideological", "religious", "class", "ethnic_racial", "global", "mixed_none"];
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
