/**
 * Historical US Presidential Candidate Profiles (1960-2024)
 *
 * Each candidate is coded on the 14 PRISM nodes representing the political
 * SIGNAL they sent to voters - their platform, rhetoric, and persona - not
 * their private beliefs.
 *
 * Continuous nodes: 1-5 scale (see CLAUDE.md for pole definitions)
 * Categorical nodes (EPS, AES): index into the 6-category arrays
 *   EPS: 0=empiricist, 1=institutionalist, 2=traditionalist, 3=intuitionist, 4=autonomous, 5=nihilist
 *   AES: 0=statesman, 1=technocrat, 2=pastoral, 3=authentic, 4=fighter, 5=visionary
 */
export interface CandidateProfile {
    name: string;
    party: "Democratic" | "Republican" | "Independent" | "American Independent" | "Dixiecrat";
    year: number;
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
    /**
     * Compound moral-circle module per ADR-006 (added in PR 6.D as additive).
     * The boundary vector encodes the candidate's POLITICAL-COALITION appeal
     * (which identity-political boundaries their campaign organized around),
     * not their personal demographic. Optional during the additive transition;
     * the engine cutover in PR 6.E will read this. Currently unused.
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
    /**
     * Optional self-reported group membership per ADR-006. For candidates,
     * this captures the candidate's demographic identity (used by Layer 2
     * lock-and-key in respondentVoteChoice.ts after PR 6.E cutover).
     * `null` indicates ambiguous / not coded.
     */
    morMembership?: {
        ethnic_racial?: string | null;
        religious?: string | null;
        class?: string | null;
        gender?: string | null;
        political_tribe?: string | null;
    };
}
export interface Election {
    year: number;
    candidates: CandidateProfile[];
}
export declare const ELECTIONS: Election[];
