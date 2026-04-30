export interface RegimePeriod {
    jurisdiction: string;
    regime: string;
    startYear: number;
    endYear: number;
    MAT: number;
    CD: number;
    CU: number;
    MOR: number;
    PRO: number;
    COM: number;
    ZS: number;
    ONT_H: number;
    ONT_S: number;
    PF: number;
    TRB: number;
    ENG: number;
    EPS: number;
    AES: number;
    description: string;
    /**
     * Compound moral-circle module per ADR-006 (added in PR 6.D as additive).
     * The boundary vector encodes the regime's identity-political organization
     * — which boundaries the regime drew its in-group around. Regimes do NOT
     * get demographic membership fields (per ADR-006 Layer 2 scope).
     * Optional during the additive transition; the engine cutover in PR 6.E
     * will read this. Currently unused.
     */
    morBoundaries?: {
        boundaries: {
            national: number;
            ethnic_racial: number;
            religious: number;
            class: number;
            ideological: number;
            gender: number;
            political_tribe: number;
        };
        intensity: number;
    };
}
export declare const EUROPE_PART1: RegimePeriod[];
