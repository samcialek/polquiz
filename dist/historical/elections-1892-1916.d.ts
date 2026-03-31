/**
 * Historical US Presidential Candidate Profiles (1892-1916)
 *
 * Phase 2: The Gilded Age through the Progressive Era - from the Populist
 * revolt and Bryan's Cross of Gold through TR's trust-busting, the 1912
 * three-way split, and Wilson's New Freedom on the eve of World War I.
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
export declare const ELECTIONS_1892_1916: Election[];
