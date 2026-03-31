/**
 * Historical US Presidential Candidate Profiles (1920-1936)
 *
 * Phase 1: The interwar era - from post-WWI "Return to Normalcy" through
 * the New Deal realignment. Covers the last gasp of laissez-faire Republicanism,
 * the Depression crisis, and FDR's transformation of the Democratic Party.
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
import type { Election } from "./candidates.js";
export declare const ELECTIONS_1920_1936: Election[];
