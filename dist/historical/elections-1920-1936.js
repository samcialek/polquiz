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
// ─────────────────────────────────────────────────────────────────────────────
// 1920: Harding (R) vs Cox (D)
// ─────────────────────────────────────────────────────────────────────────────
// Harding: "Return to Normalcy" - rejection of Wilson's internationalism and
// wartime government expansion. Pro-business, isolationist, anti-League of Nations.
// Small-town Ohio newspaper publisher. Promised peace, prosperity, and less government.
// Cox: Ohio governor, Wilsonian internationalist, pro-League of Nations.
// Ran as Wilson's heir on progressive internationalism. Largely forgotten candidate.
// FDR was his VP pick. Crushed in a landslide - America wanted normalcy, not crusades.
const election1920 = {
    year: 1920,
    candidates: [
        {
            name: "Harding",
            party: "Republican",
            year: 1920,
            MAT: 4, // Moderate — "Return to Normalcy" = centrist, broadly appealing
            CD: 4, // Moderate — genial, not culture warrior
            CU: 3, // Moderate — isolationist but not extreme
            MOR: 2, // Moderate moral circle — broad appeal
            PRO: 4, // Proceduralist — institutional normalcy
            COM: 5, // Maximum compromiser — amiable, consensus
            ZS: 2, // Positive-sum — prosperity message
            ONT_H: 3, // Moderate
            ONT_S: 4, // System mostly fine — just needs calm hand
            PF: 4, // Moderate partisan — broad coalition
            TRB: 2, // Low tribal — genial "normalcy"
            ENG: 3, // Moderate — front porch calm
            EPS: 2, // Traditionalist - "return to normalcy" = traditional ways are best
            AES: 2, // Pastoral - small-town Ohio, Main Street, folksy newspaper editor
        },
        {
            // Cox 1920 — "push extreme" loser-coding artifact corrected (Phase 4,
            // 2026-04-26). Cox was a forgotten Wilsonian-heir progressive newspaper
            // publisher who lost in a Harding landslide; the prior coding maxed
            // every axis as if to manufacture distance from Harding. Per user
            // direction the rubric overrides "push extreme." Softened to mainstream
            // Wilson-progressive-internationalist: MAT 1→2, CD 1→3, CU 5→4, MOR 5→4,
            // PRO 2→4 (Wilsonian institutionalist, not anti-procedural), COM 1→3,
            // ZS 1→2, ONT_H 5→4, ONT_S 1→4 (institutional capacity belief).
            name: "Cox",
            party: "Democratic",
            year: 1920,
            MAT: 2, // Wilsonian-progressive-redistributive lean, not max
            CD: 3, // Mainstream progressive Democrat - not max progressive
            CU: 4, // Internationalist (League) but not max-pluralist
            MOR: 4, // Liberal-internationalist wide-circle, not maximum
            PRO: 4, // Wilsonian institutionalist - worked through political institutions
            COM: 3, // Mixed - principled on League but a working politician
            ZS: 2, // Positive-sum - League/internationalism as growth-frame
            ONT_H: 4, // Optimistic but not maximalist
            ONT_S: 4, // Institutional capacity belief - League and federal institutions can work
            PF: 5, // Maximum partisan
            TRB: 5, // Maximum tribal — alienating
            ENG: 5, // Maximum
            EPS: 1, // Institutionalist - trusted League, government machinery
            AES: 0, // Statesman - projected Wilsonian gravitas and internationalism
        },
        {
            // Eugene V. Debs - Socialist Party (3.4%)
            // Ran from federal prison (convicted under Espionage Act for anti-war
            // speech). Convict No. 9653. Maximum martyrdom. "While there is a soul
            // in prison, I am not free."
            name: "Debs",
            party: "Independent",
            year: 1920,
            MAT: 1, // Maximum redistribution - public ownership
            CD: 1, // Maximum cultural openness
            CU: 5, // Maximum universalist - anti-war, international solidarity
            MOR: 5, // Widest moral circle
            PRO: 1, // Anti-proceduralist - imprisoned by the system he fought
            COM: 1, // Never compromise - went to prison rather than recant
            ZS: 5, // Maximum zero-sum - class war intensified by WWI profiteering
            ONT_H: 5, // Maximum perfectibility
            ONT_S: 1, // System broken - jailed for speech, Red Scare, Palmer Raids
            PF: 1, // Anti-partisan
            TRB: 5, // Maximum tribal - worker/prisoner solidarity
            ENG: 5, // Maximum engagement - ran from prison cell
            EPS: 0, // Empiricist
            AES: 5, // Visionary - ultimate martyr-prophet figure
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1924: Coolidge (R) vs Davis (D) vs La Follette (Progressive)
// ─────────────────────────────────────────────────────────────────────────────
// Coolidge: "Silent Cal." Ascended after Harding's death. Maximum laissez-faire:
// "The business of America is business." Minimalist government, low taxes, balanced
// budgets. Quiet, austere, Puritan-ethic New Englander.
// Davis: Conservative Wall Street lawyer chosen as compromise. Most conservative
// Democratic nominee of the era. Anti-KKK plank fight. Barely campaigned.
// La Follette: Progressive insurgent - "Fighting Bob." Anti-monopoly, pro-labor,
// public ownership of railroads, direct democracy. Won 17% - strongest third-party
// showing until Perot. Wisconsin progressive tradition.
const election1924 = {
    year: 1924,
    candidates: [
        {
            name: "Coolidge",
            party: "Republican",
            year: 1924,
            MAT: 4, // Moderate — prosperity message, broadly appealing
            CD: 3, // Moderate — quiet, not a culture warrior
            CU: 3, // Moderate
            MOR: 3, // Moderate — "Coolidge prosperity" for all
            PRO: 5, // Maximum proceduralist — strict constitutionalist
            COM: 4, // Compromiser — let things run smoothly
            ZS: 2, // Positive-sum — rising tide, prosperity
            ONT_H: 3, // Moderate
            ONT_S: 5, // System fine — don't touch what works
            PF: 3, // Moderate partisan
            TRB: 2, // Low tribal
            ENG: 3, // Moderate
            EPS: 2, // Traditionalist - inherited wisdom, Puritan tradition, established ways
            AES: 0, // Statesman - dignified, austere, presidential reserve
        },
        {
            // Davis 1924 — "push extreme" loser-coding artifact corrected (Phase 4,
            // 2026-04-26). Davis was a CONSERVATIVE Wall Street lawyer chosen as a
            // compromise candidate after a deadlocked 103-ballot convention. The
            // prior MAT 1 / CD 1 / CU 5 / MOR 5 max-progressive coding was directly
            // contradicted by his actual signal: Bourbon Democrat, J.P. Morgan
            // counsel, later head of the anti-New-Deal American Liberty League.
            // MAT 1→4 (Wall Street conservative, not redistributive), CD 1→3,
            // CU 5→3, MOR 5→3, ONT_S 2→4 (institutionalist lawyer, not "system
            // needs reform"). PRO 4 retained (constitutional lawyer).
            name: "Davis",
            party: "Democratic",
            year: 1924,
            MAT: 4, // Wall Street Bourbon Democrat - free-market lean, J.P. Morgan counsel
            CD: 3, // Centrist - anti-KKK plank but otherwise traditional Democrat
            CU: 3, // Mixed - civic-Democratic, not max-pluralist
            MOR: 3, // Civic-national circle - no max-universalist crusade
            PRO: 4, // Proceduralist — constitutional lawyer
            COM: 4, // Compromiser - was the literal compromise candidate
            ZS: 2, // Positive-sum
            ONT_H: 4, // Optimistic
            ONT_S: 4, // Institutional capacity belief - constitutional lawyer trusted institutions
            PF: 5, // Maximum partisan
            TRB: 4, // Tribal — Democratic coalition
            ENG: 3, // Moderate — lackluster campaign
            EPS: 1, // Institutionalist - trusted courts, legal process, institutions
            AES: 0, // Statesman - dignified lawyer, understated
        },
        {
            name: "La Follette",
            party: "Independent", // Progressive Party - typed as Independent per CandidateProfile union
            year: 1924,
            // Recalibrated 2026-04-26: previous encoding (MAT=1, PRO=2, ONT_S=1)
            // misread La Follette as a Debs-style anti-systemic radical. Historical
            // reality: he was a Progressive REPUBLICAN INSTITUTIONAL REFORMER who
            // pioneered direct democracy (referendum/initiative/recall), used the
            // regulatory state, founded the Progressive Party as an institutional
            // reform vehicle. MAT 1→2 (social-democratic with selective public
            // ownership, not revolutionary class-struggle). PRO 2→4 (procedural
            // reformer who created NEW procedures rather than rejecting them).
            // ONT_S 1→4 (believed institutions can produce good change via reform —
            // his entire career was institutional reformism, not nihilism).
            MAT: 2, // Social-democratic redistribution - public ownership of railroads, break up monopolies, but not class-revolutionary
            CD: 1, // Maximum cultural openness - pro-labor, anti-nativist, civil liberties
            CU: 4, // Internationalist lean - anti-imperialism, but not League (seen as elite club)
            MOR: 5, // Maximum universalist - fought for workers, farmers, immigrants, the little guy
            PRO: 4, // Procedural reformer - direct democracy, referenda, recall as INSTITUTIONAL innovations within constitutional frame
            COM: 1, // Never compromise - "Fighting Bob," ideological purist, insurgent
            ZS: 3, // Mixed - saw monopolies as zero-sum extraction but believed reform could fix it
            ONT_H: 4, // Optimistic - believed common people would choose wisely given direct democracy
            ONT_S: 4, // Institutional capacity belief - reform via institutions, not abolition; founded Progressive Party AS institutional reform vehicle
            PF: 1, // Maximum independent - rejected both parties, ran as Progressive
            TRB: 4, // Tribal - worker/farmer identity, class-based politics
            ENG: 5, // Maximum engagement - lifelong crusader, launched entire third party
            EPS: 0, // Empiricist - investigated corporate corruption, data-driven muckraker
            AES: 4, // Fighter - "Fighting Bob," combative, insurgent champion of the people
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1928: Hoover (R) vs Smith (D)
// ─────────────────────────────────────────────────────────────────────────────
// Hoover: "The Great Engineer." Stanford-educated mining engineer, humanitarian
// (Belgian relief, Mississippi flood), Commerce Secretary. Technocratic progressive
// Republican. "A chicken in every pot, a car in every garage." Peak 1920s optimism.
// Smith: "The Happy Warrior." First Catholic major-party nominee. Tammany Hall,
// working-class Irish Catholic, anti-Prohibition wet. Lost in a landslide -
// anti-Catholic bigotry was a major factor. Urban machine Democrat.
const election1928 = {
    year: 1928,
    candidates: [
        {
            name: "Hoover",
            party: "Republican",
            year: 1928,
            MAT: 4, // Pro-market - but believed in "associationalism," voluntary cooperation
            CD: 3, // Culturally moderate - not a culture warrior, progressive on race for era
            CU: 3, // Mixed - internationalist background (relief work) but America-first economics
            MOR: 3, // Centrist moral frame - humanitarian but not expansive moral crusader
            PRO: 5, // Maximum proceduralist - engineer, systems, order, efficiency
            COM: 3, // Mixed - principled but rigid, not a natural dealmaker
            ZS: 1, // Maximum positive-sum - peak 1920s prosperity optimism, "abolish poverty"
            ONT_H: 4, // Optimistic - engineering mentality, problems are solvable
            ONT_S: 4, // System working - voluntary cooperation, "rugged individualism"
            PF: 4, // Strong Republican - party standard-bearer in prosperity era
            TRB: 2, // Low tribal - technocratic, above-the-fray, not populist
            ENG: 4, // Engaged - ambitious, ran on competence and vision
            EPS: 0, // Empiricist - engineer, data-driven, technocratic problem-solver
            AES: 1, // Technocrat - "The Great Engineer," efficiency and expertise
        },
        {
            name: "Smith",
            party: "Democratic",
            year: 1928,
            MAT: 2, // Redistributive lean - pro-labor, urban working class, public works
            CD: 1, // Maximum cultural openness - wet (anti-Prohibition), Catholic, urban, immigrant
            CU: 4, // Pluralist - immigrant tolerance, cultural diversity of NYC
            MOR: 4, // Wide moral circle - championed workers, immigrants, religious minorities
            PRO: 3, // Mixed - Tammany machine pragmatism, not a purist on process
            COM: 4, // Compromiser - machine politician, dealmaker, worked across interests
            ZS: 2, // Positive-sum - believed in shared prosperity through urban development
            ONT_H: 4, // Optimistic - up-from-poverty narrative, American Dream
            ONT_S: 4, // ADR-010 polarity fix 2026-04-26: high institutional capacity belief - government BUILDS infrastructure and helps workers. "Structuralist" advocacy is institutional reform, NOT institutional nihilism. Was 2 under old "system broken" framing.
            PF: 5, // Maximum partisan - Tammany Democrat, party machine product
            TRB: 4, // Tribal - Catholic/Irish/urban immigrant identity, ethnic coalition
            ENG: 5, // Maximum engagement - barnstorming campaigner, passionate
            EPS: 3, // Intuitionist - street-smart, gut-level populist, not academic
            AES: 3, // Authentic - Lower East Side accent, brown derby, "the real article"
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1932: FDR (D) vs Hoover (R)
// ─────────────────────────────────────────────────────────────────────────────
// FDR: "The only thing we have to fear is fear itself." Promised a "New Deal
// for the American people." Projected bold action, optimism, energy against
// Depression despair. Governor of New York, patrician reformer. Vague on specifics
// but promised experimentation and relief.
// Hoover: Incumbent crushed by Depression. "Rugged individualism" rhetoric rang
// hollow with 25% unemployment. Hoovervilles. Seen as rigid, cold, out of touch.
// Vetoed direct relief. Bonus Army debacle. Defensive campaign.
const election1932 = {
    year: 1932,
    candidates: [
        {
            name: "Roosevelt",
            party: "Democratic",
            year: 1932,
            MAT: 1, // Maximum redistribution - "New Deal," bold government spending and relief
            CD: 2, // Culturally open - cosmopolitan patrician, progressive for era
            CU: 3, // Mixed - focused on domestic crisis, "good neighbor" policy but not League
            MOR: 4, // Wide moral circle - "forgotten man" speech, broad compassion
            PRO: 2, // Anti-proceduralist - "bold, persistent experimentation," executive action
            COM: 4, // Dealmaker - built huge coalition, pragmatic about means
            ZS: 2, // Positive-sum - "abundance for all," economic expansion through spending
            ONT_H: 5, // Maximum optimistic - "nothing to fear but fear itself," can-do spirit
            ONT_S: 4, // ADR-010 polarity fix 2026-04-26: high institutional capacity belief - FDR was the paradigmatic institution-builder (RFC, CCC, SEC, SSA, NLRB). Was 1 under old "system broken" framing — exactly inverted. Structuralism = institutional reform, NOT nihilism.
            PF: 5, // Maximum partisan - built the New Deal Democratic coalition from scratch
            TRB: 3, // Moderate tribal - broad coalition appeal, not narrowly sectarian
            ENG: 5, // Maximum engagement - energetic campaigning despite disability
            EPS: 1, // Institutionalist - brain trust, government expertise, bold institutions
            AES: 5, // Visionary - "New Deal," transformative rhetoric, "happy days are here again"
        },
        {
            name: "Hoover",
            party: "Republican",
            year: 1932,
            MAT: 5, // Maximum free-market - refused direct relief, "rugged individualism"
            CD: 4, // Culturally conservative - defended traditional order, business establishment
            CU: 2, // Particularist - Smoot-Hawley tariff, turned inward
            MOR: 2, // Narrow moral circle - "rugged individualism," personal responsibility framing
            PRO: 5, // Maximum proceduralist - refused to break precedent on relief, rigid
            COM: 2, // Low compromise - stubborn, wouldn't bend on relief philosophy
            ZS: 3, // Mixed - still claimed prosperity would return but defensive
            ONT_H: 2, // Skeptical - government relief would destroy character, fixed human nature
            ONT_S: 5, // System fine - Depression is temporary, system will self-correct
            PF: 4, // Strong Republican - party standard-bearer
            TRB: 3, // Moderate tribal - not populist, establishment identity
            ENG: 3, // Moderate engagement - defensive, beleaguered campaign
            EPS: 0, // Empiricist - engineer, but data contradicted his optimism
            AES: 1, // Technocrat - still projected managerial competence, but hollow
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1936: FDR (D) vs Landon (R)
// ─────────────────────────────────────────────────────────────────────────────
// FDR: Incumbent. New Deal in full swing - Social Security, WPA, Wagner Act,
// SEC. "I welcome their hatred" (of economic royalists). Peak New Deal populism.
// Carried 46 of 48 states. Greatest landslide in modern history.
// Landon: Kansas governor, moderate Republican. Accepted some New Deal programs
// but attacked spending and bureaucracy. "The Kansas Coolidge." Bland, cautious,
// overwhelmed by FDR's charisma and the New Deal's popularity.
const election1936 = {
    year: 1936,
    candidates: [
        {
            name: "Roosevelt",
            party: "Democratic",
            year: 1936,
            MAT: 1, // Maximum redistribution - Social Security, WPA, Wagner Act, "economic royalists"
            CD: 2, // Culturally open - progressive coalition, but pre-civil-rights
            CU: 3, // Mixed - "good neighbor" policy, focused domestically on New Deal
            MOR: 5, // Maximum universalist - "I see one-third of a nation ill-housed, ill-clad"
            PRO: 2, // Anti-proceduralist - court-packing threat, executive expansion
            COM: 3, // Less compromising - "I welcome their hatred," confrontational populism
            ZS: 2, // Positive-sum - government spending creates growth, "priming the pump"
            ONT_H: 5, // Maximum optimistic - New Deal working, recovery underway
            ONT_S: 5, // ADR-010 polarity fix 2026-04-26: maximum institutional capacity belief - "total systemic reform, new institutions" = building institutional capacity at maximum scale. Was 1 under old "system broken" framing.
            PF: 5, // Maximum partisan - New Deal coalition at peak, "Roosevelt coalition"
            TRB: 4, // High tribal - "forgotten man" vs. "economic royalists," class warfare
            ENG: 5, // Maximum engagement - barnstorming incumbent, massive rallies
            EPS: 1, // Institutionalist - brain trust, government agencies, new institutions
            AES: 4, // Fighter - "I welcome their hatred," combative populist champion
        },
        {
            name: "Landon",
            party: "Republican",
            year: 1936,
            // Recoded 2026-04-23: previous coding ran Landon to extremes on every
            // axis (avg dist 2.304). He was a moderate Kansas Republican — "Kansas
            // Coolidge" — not an ideological maximalist. Softened to reflect
            // mainstream Republican positioning of the era.
            MAT: 4, // Pro-market but not laissez-faire maximalist
            CD: 4, // Culturally conservative but not extreme
            CU: 2, // Particularist-leaning America-first
            MOR: 2, // Narrow moral circle
            PRO: 4, // Proceduralist — attacked executive overreach
            COM: 3, // Mixed
            ZS: 3, // Mixed
            ONT_H: 2, // Pessimistic about government dependency
            ONT_S: 4, // System mostly working — free enterprise
            PF: 4, // Strong Republican
            TRB: 2, // Low tribal
            ENG: 2, // Low — outmatched by FDR
            EPS: 0, // Empiricist - businessman, practical, fiscal prudence
            AES: 2, // Pastoral - "the Kansas Coolidge," folksy midwestern governor
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// Export all elections
// ─────────────────────────────────────────────────────────────────────────────
export const ELECTIONS_1920_1936 = [
    election1920,
    election1924,
    election1928,
    election1932,
    election1936,
];
// ─────────────────────────────────────────────────────────────────────────────
// ACTUAL_RESULTS block - paste into simulate.ts ACTUAL_RESULTS object
// ─────────────────────────────────────────────────────────────────────────────
//
// 1920: { winner: "Harding", winnerPct: 60.3, loserPct: 34.1 },
// 1924: { winner: "Coolidge", winnerPct: 54.0, loserPct: 28.8 }, // La Follette 16.6%
// 1928: { winner: "Hoover", winnerPct: 58.2, loserPct: 40.8 },
// 1932: { winner: "Roosevelt", winnerPct: 57.4, loserPct: 39.7 },
// 1936: { winner: "Roosevelt", winnerPct: 60.8, loserPct: 36.5 },
//
//# sourceMappingURL=elections-1920-1936.js.map