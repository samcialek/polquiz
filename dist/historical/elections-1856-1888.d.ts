/**
 * Historical US Presidential Candidate Profiles (1856-1888)
 *
 * Phase 3: The Civil War era and its aftermath - from the birth of the Republican
 * Party through Reconstruction, the Gilded Age, and the tariff wars. Covers the
 * collapse of the Whigs, the slavery crisis, Lincoln's wartime presidency, Grant's
 * Reconstruction, and the emergence of the modern two-party patronage system.
 *
 * CRITICAL: In this era, Republicans are the PROGRESSIVE/ABOLITIONIST party and
 * Democrats are the CONSERVATIVE/STATES-RIGHTS party. This is the OPPOSITE of
 * modern alignment. Republicans signal low CD (culturally open), high CU (universalist),
 * high MOR (wide moral circle). Democrats signal high CD, low CU, low MOR.
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
export declare const ELECTIONS_1856_1888: Election[];
