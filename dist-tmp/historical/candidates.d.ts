/**
 * Historical US Presidential Candidate Profiles (1960–2024)
 *
 * Each candidate is coded on the 14 PRISM nodes representing the political
 * SIGNAL they sent to voters — their platform, rhetoric, and persona — not
 * their private beliefs.
 *
 * Continuous nodes: 1-5 scale (see CLAUDE.md for pole definitions)
 * Categorical nodes (EPS, AES): index into the 6-category arrays
 *   EPS: 0=empiricist, 1=institutionalist, 2=traditionalist, 3=intuitionist, 4=autonomous, 5=nihilist
 *   AES: 0=statesman, 1=technocrat, 2=pastoral, 3=authentic, 4=fighter, 5=visionary
 */
export interface CandidateProfile {
    name: string;
    party: "Democratic" | "Republican" | "Independent" | "American Independent";
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
}
export interface Election {
    year: number;
    candidates: CandidateProfile[];
}
export declare const ELECTIONS: Election[];
