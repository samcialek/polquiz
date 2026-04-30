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

// ─────────────────────────────────────────────────────────────────────────────
// 1892: Cleveland (D) vs Harrison (R) vs Weaver (Populist)
// ─────────────────────────────────────────────────────────────────────────────
// Cleveland: Bourbon Democrat, gold standard, tariff reform, laissez-faire.
// "Public office is a public trust." Anti-corruption, anti-silver, anti-tariff.
// The conservative Democrat - closer to free-market than modern Dems. Won
// non-consecutive second term (only president to do so).
// Harrison: Incumbent Republican. High tariff (McKinley Tariff), pensions for
// Union veterans, federal spending. "Grandfather's hat fits Ben." Corporate
// Republican establishment.
// Weaver: Populist Party nominee, former Greenback candidate. Represented the
// agrarian revolt - free silver, graduated income tax, government ownership of
// railroads, direct election of senators. The farmers' champion.

const election1892: Election = {
  year: 1892,
  candidates: [
    {
      name: "Cleveland",
      party: "Democratic",
      year: 1892,
      MAT: 2,   // Mild redistributive lean - tariff reform for consumers, but Bourbon Democrat, anti-spending
      CD: 3,    // Culturally moderate - not a culture warrior, reform-minded but socially conventional
      CU: 3,    // Mixed - internationalist on trade (low tariff), but no foreign entanglements
      MOR: 3,   // Centrist moral frame - "public trust" civic virtue, not expansive
      PRO: 5,   // Maximum proceduralist - anti-corruption crusader, vetoed private pension bills, rule of law
      COM: 3,   // Mixed - principled and rigid on gold standard, but pragmatic governor
      ZS: 2,    // Positive-sum lean - believed free trade expands prosperity
      ONT_H: 3, // Moderate realism - civic republican, duty-bound, neither optimist nor pessimist
      ONT_S: 4, // System mostly fine - just needs honest administration, not structural reform
      PF: 4,    // Strong Democrat - Bourbon wing leader, party standard-bearer
      TRB: 2,   // Low tribal - above-the-fray reformer, anti-machine
      ENG: 4,   // Engaged - ran three times, serious about governance
      EPS: 1,   // Institutionalist - trusted existing institutions, just wanted them honest
      AES: 0,   // Statesman - dignified, serious, "public office is a public trust",
      morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.17, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
    },
    {
      name: "Harrison",
      party: "Republican",
      year: 1892,
      MAT: 5,   // Maximum free-market - McKinley Tariff (protectionist = pro-business), corporate champion
      CD: 4,    // Culturally conservative - Protestant establishment, Union veteran identity
      CU: 2,    // Particularist - high tariff wall, protect American industry, economic nationalism
      MOR: 2,   // Narrow moral circle - business/veteran class, Protestant establishment
      PRO: 4,   // Proceduralist - legalistic, formal, institutional Republican
      COM: 3,   // Mixed - stiff, formal, poor at building personal alliances ("White House iceberg")
      ZS: 3,    // Mixed - tariff protection implies some zero-sum thinking on trade
      ONT_H: 2, // Skeptical - conservative establishment, human nature is fixed
      ONT_S: 5, // System fine - business-led growth, government protects industry
      PF: 5,    // Maximum partisan - grandson of president, GOP establishment through and through
      TRB: 3,   // Moderate tribal - Union veteran identity, but patrician style
      ENG: 3,   // Moderate - stiff campaigner, let surrogates do the work
      EPS: 1,   // Institutionalist - formal legalist, trusted party machinery
      AES: 0,   // Statesman - dignified, formal, presidential bearing (if cold),
      morBoundaries: { boundaries: { national: 0.53, ethnic_racial: 0.12, religious: 0.29, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
    },
    {
      name: "Weaver",
      party: "Independent", // Populist Party - typed as Independent per CandidateProfile union
      year: 1892,
      MAT: 1,   // Maximum redistribution - free silver, income tax, government ownership of railroads
      CD: 4,    // Culturally conservative - agrarian, Protestant, rural values, suspicious of cities
      CU: 2,    // Particularist - nativist undertones, suspicious of foreign capital, America for farmers
      MOR: 3,   // Mixed - wide circle for "the people" but narrow in practice (white farmers mostly)
      // Weaver 1892 Pattern A correction (Phase 4, 2026-04-26). Populist Party
      // founder used the new-party institutional vehicle and pioneered direct-
      // democracy *procedures* (initiative, referendum, recall, direct
      // election of senators, railroad regulation). That is institutional
      // reform USING institutions hard, not anti-institutional nihilism.
      // PRO 2→4, ONT_S 1→4 per rubric Pattern A correction (parallels Bryan
      // and La Follette).
      PRO: 4,   // Institutional reformer - new party, direct-democracy procedures
      COM: 1,   // Never compromise - insurgent, rejected both parties as corrupt
      ZS: 4,    // Zero-sum lean - banks and railroads robbing the farmers, class war framing
      ONT_H: 3, // Mixed - believed common people were good but elites were corrupt
      ONT_S: 4, // Institutional capacity belief - the system can be made to work for farmers via NEW procedures
      PF: 1,    // Maximum independent - founded new party, rejected both old ones
      TRB: 5,   // Maximum tribal - farmer/agrarian class identity, "the people" vs. "the plutocrats"
      ENG: 5,   // Maximum engagement - launched third party, barnstormed the country
      EPS: 3,   // Intuitionist - populist gut-level politics, "the people know"
      AES: 4,   // Fighter - insurgent crusader, combative populist,
      morBoundaries: { boundaries: { national: 0.72, ethnic_racial: 0.05, religious: 0.53, class: 0.72, ideological: 0.34, gender: 0.1, political_tribe: 0 }, intensity: 3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1896: McKinley (R) vs Bryan (D/Populist) - gold vs silver
// ─────────────────────────────────────────────────────────────────────────────
// McKinley: Front-porch campaign managed by Mark Hanna. Gold standard,
// protective tariff, "full dinner pail." Outspent Bryan massively with
// corporate money. Calm, dignified, reassuring. The business candidate.
// Bryan: "Cross of Gold" speech - "you shall not crucify mankind upon a cross
// of gold!" Free silver, agrarian populism, evangelical fervor. Fused
// Democratic and Populist tickets. Barnstormed 18,000 miles - first modern
// campaign. Economically radical, culturally conservative Protestant populist.

const election1896: Election = {
  year: 1896,
  candidates: [
    {
      name: "McKinley",
      party: "Republican",
      year: 1896,
      MAT: 4,   // Moderate — "full dinner pail" = prosperity for all, not just business
      CD: 3,    // Moderate — mainstream, non-threatening
      CU: 3,    // Moderate — tariff but not nativist
      MOR: 3,   // Moderate — broad appeal
      PRO: 5,   // Maximum proceduralist — gold standard as law
      COM: 5,   // Maximum compromiser — Hanna coalition-builder
      ZS: 2,    // Positive-sum — prosperity
      ONT_H: 3, // Moderate
      ONT_S: 5, // System fine — gold standard works
      PF: 4,    // Strong partisan
      TRB: 2,   // Low tribal — broad appeal
      ENG: 3,   // Moderate — front-porch
      EPS: 1,   // Institutionalist - trusted established financial institutions, gold standard
      AES: 0,   // Statesman - dignified front-porch campaign, presidential calm,
      morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
    },
    {
      name: "Bryan",
      party: "Democratic",
      year: 1896,
      // Bryan 1896 — PATTERN A FLAGSHIP CASE per rubric (Phase 4, 2026-04-26).
      // Prior PRO 2 / ONT_S 1 read him as anti-institutional, but Bryan used
      // party machinery hard, fused Democratic-Populist tickets, ran on
      // constitutional amendments (income tax, direct election of senators),
      // and pioneered modern barnstorming WITHIN institutional channels.
      // PRO 2→4, ONT_S 1→4. EPS 3→2 traditionalist per rubric (biblical
      // "Cross of Gold," providential democracy, agrarian inherited virtue —
      // not pure intuitionism). AES 5 visionary retained for 1896.
      MAT: 1,   // Maximum redistribution - free silver = inflation = debt relief for farmers, anti-bank
      CD: 5,    // Maximum cultural closure - evangelical Protestant, rural, anti-urban, anti-immigrant
      CU: 2,    // Particularist - nativist, suspicious of foreign gold standard, agrarian nationalism
      MOR: 3,   // Mixed - evangelical compassion for "the people" but narrow to white Protestant farmers
      PRO: 4,   // Institutional reformer - constitutional amendments, party machinery, electoral institutions
      COM: 1,   // Never compromise - "shall not crucify mankind," absolutist rhetoric
      ZS: 4,    // Zero-sum - banks stealing from farmers, Eastern money vs. Western producers
      ONT_H: 4, // Optimistic - believed common people would triumph, democratic faith
      ONT_S: 4, // Institutional capacity belief - the system can be reformed via majoritarian politics, monetary policy, constitutional amendment
      PF: 3,    // Moderate - fused Democratic and Populist tickets, but also alienated Gold Democrats
      TRB: 5,   // Maximum tribal - agrarian/producer class vs. Eastern financiers, "the people"
      ENG: 5,   // Maximum engagement - 18,000 miles of barnstorming, first modern campaign
      EPS: 2,   // Traditionalist - biblical, providential democracy, agrarian inherited virtue (per rubric)
      AES: 5,   // Visionary - "Cross of Gold," messianic rhetoric, prophetic oratory,
      morBoundaries: { boundaries: { national: 0.72, ethnic_racial: 0.38, religious: 0.91, class: 0.72, ideological: 0.48, gender: 0.1, political_tribe: 0.5 }, intensity: 3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1900: McKinley (R) vs Bryan (D) - rematch, imperialism debate
// ─────────────────────────────────────────────────────────────────────────────
// McKinley: Incumbent. Spanish-American War victor, annexed Philippines,
// "full dinner pail" prosperity. Now an imperialist - "benevolent assimilation."
// Gold Standard Act of 1900 settled the silver question.
// Bryan: Tried to make imperialism the issue but silver hung over him.
// Anti-imperialist rhetoric, same populist economics. Couldn't overcome
// prosperity argument. Lost by wider margin than 1896.

const election1900: Election = {
  year: 1900,
  candidates: [
    {
      name: "McKinley",
      party: "Republican",
      year: 1900,
      MAT: 5,   // Maximum free-market - Gold Standard Act, prosperity era, corporate champion
      CD: 4,    // Culturally conservative - Victorian morality, "civilizing mission" in Philippines
      CU: 3,    // Mixed - now imperialist/internationalist (Philippines, Open Door) but still tariff wall
      MOR: 3,   // Mixed - "benevolent assimilation" had universalist rhetoric but paternalist reality
      PRO: 4,   // Proceduralist - institutional, worked through Congress, but stretched war powers
      COM: 4,   // Compromiser - managed diverse party coalition, pragmatic
      ZS: 2,    // Positive-sum - "full dinner pail," prosperity expanding through empire
      ONT_H: 3, // Moderate - steady stewardship, neither utopian nor pessimistic
      ONT_S: 5, // System fine - prosperity proves the system works
      PF: 5,    // Maximum partisan - dominant GOP machine
      TRB: 3,   // Moderate tribal - patriotic/imperial identity but broad prosperity appeal
      ENG: 4,   // Engaged - wartime president, seeking second term
      EPS: 1,   // Institutionalist - established order, gold standard, institutional governance
      AES: 0,   // Statesman - incumbent president, wartime gravitas,
      morBoundaries: { boundaries: { national: 0.36, ethnic_racial: 0.05, religious: 0.19, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
    },
    {
      name: "Bryan",
      party: "Democratic",
      year: 1900,
      // Bryan 1900 — same Pattern A as 1896. PRO 2→4, ONT_S 1→4, EPS 3→2
      // traditionalist. AES 5 visionary retained per rubric (1896 and 1900
      // are visionary; 1908 shifts to pastoral).
      MAT: 1,   // Maximum redistribution - same populist economics, anti-trust, anti-monopoly
      CD: 5,    // Maximum cultural closure - same evangelical/agrarian conservatism
      CU: 3,    // Mixed - anti-imperialist (opposed Philippines annexation) but still nativist on immigration
      MOR: 4,   // Wider moral circle than 1896 - anti-imperialism added concern for Filipino people
      PRO: 4,   // Institutional reformer - constitutional amendments, party machinery
      COM: 1,   // Never compromise - same absolutist populist stance
      ZS: 4,    // Zero-sum - imperialism as exploitation, banks still robbing the people
      ONT_H: 4, // Optimistic - democracy and self-government for all peoples
      ONT_S: 4, // Institutional capacity belief - reform via majoritarian politics, monetary policy
      PF: 4,    // Stronger partisan - more clearly Democratic this time, less Populist fusion
      TRB: 5,   // Maximum tribal - same agrarian class identity
      ENG: 5,   // Maximum engagement - another massive barnstorming campaign
      EPS: 2,   // Traditionalist - same biblical / providential democracy frame as 1896
      AES: 5,   // Visionary - anti-imperialist crusade layered onto populist economics,
      morBoundaries: { boundaries: { national: 0.57, ethnic_racial: 0.05, religious: 0.72, class: 0.72, ideological: 0.76, gender: 0.1, political_tribe: 0.75 }, intensity: 3 },
    },
    {
      // Eugene V. Debs - Socialist Party (2.8%)
      // Labor organizer, founded IWW. Ran on public ownership of railroads,
      // mines, utilities. First serious socialist candidacy.
      name: "Debs",
      party: "Independent" as any,
      year: 1900,
      MAT: 1,   // Maximum redistribution - public ownership of means of production
      CD: 1,    // Maximum cultural openness - racial equality, women's suffrage
      CU: 5,    // Maximum universalist - international workers' solidarity
      MOR: 5,   // Widest moral circle - all workers, all races, all nations
      PRO: 1,   // Anti-proceduralist - capitalist system is rigged
      COM: 1,   // Never compromise - revolutionary, not reformist
      ZS: 5,    // Maximum zero-sum - class war, capital exploits labor
      ONT_H: 5, // Maximum perfectibility - socialist utopia achievable
      ONT_S: 1, // System completely broken - capitalism must be replaced
      PF: 1,    // Anti-partisan - rejected both capitalist parties
      TRB: 5,   // Maximum tribal - working class identity
      ENG: 5,   // Maximum engagement - tireless organizer
      EPS: 0,   // Empiricist - studied labor conditions, data on exploitation
      AES: 5,   // Visionary - prophetic socialist rhetoric,
      morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1904: T. Roosevelt (R) vs Parker (D) - TR's own mandate
// ─────────────────────────────────────────────────────────────────────────────
// Roosevelt: Ascended after McKinley's assassination 1901. Trust-busting,
// Square Deal, Panama Canal, conservation. Energetic, progressive Republican.
// "Speak softly and carry a big stick." Sought his own mandate - won in a
// landslide. The cowboy-intellectual-president.
// Parker: Conservative NY judge. Bourbon Democrat trying to reclaim party from
// Bryan wing. Gold standard, anti-imperialism (weakly), states' rights.
// Colorless, forgettable - the anti-Bryan. Crushed by TR's charisma.

const election1904: Election = {
  year: 1904,
  candidates: [
    {
      name: "Roosevelt",
      party: "Republican",
      year: 1904,
      MAT: 3,   // Centrist - trust-busting but pro-business; "Square Deal" = fair play, not redistribution
      CD: 2,    // Culturally moderate - progressive for era, "strenuous life" but not moralist
      CU: 4,    // Internationalist - Panama Canal, "big stick" diplomacy, global power projection
      MOR: 5,   // Wide moral circle - conservation, labor arbitration (coal strike), progressive reform
      PRO: 3,   // Mixed - used executive power aggressively (trust-busting, Panama) but within legal bounds
      COM: 2,   // Mixed - "Square Deal" fairness but would break trusts unilaterally, not a dealmaker
      ZS: 2,    // Positive-sum - believed government could grow the pie through fair regulation
      ONT_H: 4, // Optimistic - "strenuous life," humans can improve through vigor and will
      ONT_S: 3, // Mixed - system needs reform (trusts) but basically sound with strong leadership
      PF: 4,    // Strong Republican - but progressive wing, not Old Guard
      TRB: 3,   // Moderate tribal - "100% Americanism" patriotism, but broad coalition
      ENG: 5,   // Maximum engagement - boundless energy, "bully pulpit," transformed presidency
      EPS: 0,   // Empiricist - naturalist, historian, read voraciously, evidence-based reform
      AES: 3,   // Authentic - cowboy, Rough Rider, utterly genuine, force of personality,
      morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.24, gender: 0.07, political_tribe: 0.75 }, intensity: 2.25 },
    },
    {
      name: "Parker",
      party: "Democratic",
      year: 1904,
      MAT: 1,   // Bourbon Democrat — gold standard, anti-labor
      CD: 2,    // Culturally conservative for a Democrat
      CU: 2,    // Anti-imperialism
      MOR: 2,   // Narrow — judicial restraint, not a reformer
      PRO: 5,   // Maximum proceduralist
      COM: 5,   // Maximum compromiser — bland consensus pick
      ZS: 2,    // Positive-sum
      ONT_H: 2, // Skeptical — feared change
      ONT_S: 5, // System fine — just enforce existing law
      PF: 5,    // Maximum Democrat — chosen to reclaim party
      TRB: 1,   // Minimal tribal — anti-populist, bland
      ENG: 1,   // Extremely low engagement — one of the worst campaigns in history
      EPS: 1,   // Institutionalist - judge, trusted courts and legal institutions
      AES: 0,   // Statesman - judicial dignity, understated (to a fault),
      morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.05, gender: 0.05, political_tribe: 1 }, intensity: 3 },
    },
    {
      // Eugene V. Debs - Socialist Party (3.0%)
      // Second run. Growing socialist movement. TR's progressivism stole some
      // thunder but Debs held the radical flank: public ownership, not regulation.
      name: "Debs",
      party: "Independent" as any,
      year: 1904,
      MAT: 1,   // Maximum redistribution - public ownership
      CD: 1,    // Maximum cultural openness - racial equality, women's suffrage
      CU: 5,    // Maximum universalist - international solidarity
      MOR: 5,   // Widest moral circle
      PRO: 1,   // Anti-proceduralist - system is rigged by capital
      COM: 1,   // Never compromise
      ZS: 5,    // Maximum zero-sum - class war
      ONT_H: 5, // Maximum perfectibility
      ONT_S: 1, // System broken - capitalism must go
      PF: 1,    // Anti-partisan
      TRB: 5,   // Maximum tribal - worker class identity
      ENG: 5,   // Maximum engagement
      EPS: 0,   // Empiricist
      AES: 5,   // Visionary,
      morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1908: Taft (R) vs Bryan (D) - Bryan's third try
// ─────────────────────────────────────────────────────────────────────────────
// Taft: TR's hand-picked successor. "Big Bill" - 300+ lb Yale lawyer, federal
// judge, Philippines governor. More conservative than TR but ran as his heir.
// Promised to continue TR's program. Solid institutionalist, not a campaigner.
// Bryan: Third and final try. Shifted from silver populism toward progressive
// reforms - income tax, direct election of senators, railroad regulation, anti-
// injunction. More mature, less fiery, still lost. "The Great Commoner."

const election1908: Election = {
  year: 1908,
  candidates: [
    {
      name: "Taft",
      party: "Republican",
      year: 1908,
      MAT: 4,   // Pro-market lean - more conservative than TR, business-friendly, tariff protectionist
      CD: 3,    // Culturally moderate - not a culture warrior, legalistic temperament
      CU: 3,    // Mixed - continued TR's internationalism (Philippines, dollar diplomacy) but less ambitious
      MOR: 3,   // Centrist moral frame - fair-minded judge, not a moral crusader
      PRO: 5,   // Maximum proceduralist - federal judge, constitutional lawyer, rule of law above all
      COM: 4,   // Compromiser - amiable, sought consensus, collegiate temperament
      ZS: 2,    // Positive-sum - believed in orderly growth through law
      ONT_H: 3, // Moderate - legal realism, cautious temperament
      ONT_S: 4, // System mostly fine - needs honest administration and careful legal reform
      PF: 4,    // Strong Republican - TR's chosen heir, party establishment
      TRB: 2,   // Low tribal - judicial temperament, didn't play identity politics
      ENG: 3,   // Moderate - reluctant campaigner, would rather have been on the bench
      EPS: 1,   // Institutionalist - trusted courts, legal process, established institutions
      AES: 0,   // Statesman - dignified, judicial bearing, presidential gravitas,
      morBoundaries: { boundaries: { national: 0.11, ethnic_racial: 0.05, religious: 0.05, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 0.75 }, intensity: 2.25 },
    },
    {
      name: "Bryan",
      party: "Democratic",
      year: 1908,
      // Bryan 1908 — same Pattern A as 1896/1900. PRO 2→4, ONT_S 2→4,
      // EPS 3→2 traditionalist. AES 5→2 PASTORAL — rubric explicitly tags
      // 1908 as the year Bryan's aesthetic shifted from visionary to pastoral
      // ("Great Commoner" salt-of-earth framing). Year-specificity test from
      // rubric — don't mechanically code all three Bryan rows the same.
      MAT: 1,   // Maximum redistribution - income tax, railroad regulation, anti-monopoly, anti-injunction
      CD: 4,    // Culturally conservative - same evangelical base, rural Protestant identity
      CU: 3,    // Mixed - anti-imperialist, but Progressive-era reforms were domestic-focused
      MOR: 4,   // Wide moral circle - "the Great Commoner," workers and farmers deserve justice
      PRO: 4,   // Institutional reformer - constitutional reform, party machinery, regulatory law
      COM: 2,   // Low compromise - ideological progressive, wouldn't water down demands
      ZS: 4,    // Zero-sum - railroads and trusts extracting from the common people
      ONT_H: 4, // Optimistic - believed in democratic self-government, common people's wisdom
      ONT_S: 4, // Institutional capacity belief - reform via constitutional amendment and majoritarian politics
      PF: 5,    // Maximum partisan - three-time Democratic nominee, party defined by his populism
      TRB: 4,   // High tribal - farmer/worker identity, class politics, but less maximalist
      ENG: 5,   // Maximum engagement - another barnstorming campaign, tireless
      EPS: 2,   // Traditionalist - biblical / providential democracy / agrarian inherited virtue (per rubric)
      AES: 2,   // Pastoral - "Great Commoner" salt-of-earth framing (rubric year-specificity),
      morBoundaries: { boundaries: { national: 0.44, ethnic_racial: 0.05, religious: 0.55, class: 0.55, ideological: 0.34, gender: 0.09, political_tribe: 1 }, intensity: 3 },
    },
    {
      // Eugene V. Debs - Socialist Party (2.8%)
      // Third run. IWW founded 1905. Socialist movement growing but Bryan
      // absorbed much of the populist energy with his progressive turn.
      name: "Debs",
      party: "Independent" as any,
      year: 1908,
      MAT: 1,   // Maximum redistribution - public ownership
      CD: 1,    // Maximum cultural openness
      CU: 5,    // Maximum universalist - international solidarity
      MOR: 5,   // Widest moral circle
      PRO: 1,   // Anti-proceduralist
      COM: 1,   // Never compromise
      ZS: 5,    // Maximum zero-sum - class war
      ONT_H: 5, // Maximum perfectibility
      ONT_S: 1, // System broken
      PF: 1,    // Anti-partisan
      TRB: 5,   // Maximum tribal - worker identity
      ENG: 5,   // Maximum engagement
      EPS: 0,   // Empiricist
      AES: 5,   // Visionary,
      morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1912: Wilson (D) vs T. Roosevelt (Progressive/Bull Moose) vs Taft (R)
// ─────────────────────────────────────────────────────────────────────────────
// Wilson: Princeton president, NJ governor. "New Freedom" - tariff reform,
// break up trusts (not regulate them), Federal Reserve, income tax. Intellectual,
// professorial, moralistic. Presbyterian minister's son. Won because the
// Republican vote split between Taft and TR.
// Roosevelt: Ran as Progressive "Bull Moose" after failing to retake GOP
// nomination. "New Nationalism" - strong federal regulation, worker protections,
// women's suffrage, social insurance. Shot during campaign, gave speech anyway.
// The most progressive major candidacy until FDR.
// Taft: Incumbent Republican, now conservative wing. Bitter with TR.
// Old Guard GOP - tariff, courts, limited government. Finished third.

const election1912: Election = {
  year: 1912,
  candidates: [
    {
      name: "Wilson",
      party: "Democratic",
      year: 1912,
      MAT: 2,   // Redistributive lean - tariff reduction, income tax, antitrust, but not radical
      CD: 3,    // Culturally moderate - progressive intellectual but Southern Presbyterian conservative
      CU: 4,    // Internationalist lean - moralistic foreign policy vision, "make the world safe"
      MOR: 4,   // Wide moral circle - "New Freedom" for the little man, progressive reform
      PRO: 4,   // Proceduralist - constitutional scholar, worked through legislation, institutional
      COM: 3,   // Mixed - principled, moralistic, wouldn't easily bend, but could legislate
      ZS: 2,    // Positive-sum - "New Freedom" frees competition, everyone benefits
      ONT_H: 4, // Optimistic - progressive faith in democratic improvement
      ONT_S: 2, // Structuralist - trusts must be broken, system needs reform
      PF: 5,    // Maximum partisan - rebuilt Democratic Party as progressive vehicle
      TRB: 3,   // Moderate tribal - intellectual progressive coalition, not class warrior
      ENG: 5,   // Maximum engagement - academic turned passionate campaigner
      EPS: 0,   // Empiricist - political scientist, professor, studied government systematically
      AES: 5,   // Visionary - "New Freedom," moral crusade rhetoric, professor-prophet,
      morBoundaries: { boundaries: { national: 0.12, ethnic_racial: 0.05, religious: 0.05, class: 0.29, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
    },
    {
      name: "Roosevelt",
      party: "Independent", // Progressive/Bull Moose - typed as Independent per CandidateProfile union
      year: 1912,
      // TR 1912 — RUBRIC SPECIAL CASE per Phase 4 (2026-04-26). Prior PRO 2 /
      // ONT_S 2 was exactly inverted from rubric. New Nationalism is the
      // paradigmatic "national institutions can solve collective problems"
      // worldview — ONT_S 5. PRO 3 (not 4): recall of judicial decisions,
      // executive activism, party rupture, plebiscitary style → mixed-
      // procedural; not anti-procedural, not clean institutionalist.
      MAT: 2,   // Redistributive - "New Nationalism," regulate trusts, worker protections, social insurance
      CD: 2,    // Culturally open - women's suffrage, Progressive Era reform, social justice
      CU: 4,    // Internationalist - strong foreign policy, global leadership role for America
      MOR: 5,   // Maximum universalist - social insurance, child labor laws, worker safety, broad moral vision
      PRO: 3,   // Mixed-procedural - judicial recall + executive activism + party rupture, but not anti-procedural
      COM: 2,   // Low compromise - walked out of GOP, launched new party, uncompromising on reform
      ZS: 2,    // Positive-sum - government regulation grows the pie for everyone, "Square Deal" expanded
      ONT_H: 5, // Maximum optimistic - "strenuous life," humans can be perfected through reform
      ONT_S: 5, // Maximum institutional capacity belief - New Nationalism: national institutions can solve collective problems
      PF: 1,    // Maximum independent - broke from his own party, created Bull Moose
      TRB: 4,   // High tribal - progressive movement identity, us-vs-bosses
      ENG: 5,   // Maximum engagement - shot during campaign, gave speech anyway, boundless energy
      EPS: 0,   // Empiricist - naturalist, historian, evidence-driven reform agenda
      AES: 4,   // Fighter - "Bull Moose," shot and kept speaking, combative reformer,
      morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.48, ideological: 0.12, gender: 0.09, political_tribe: 0 }, intensity: 2.25 },
    },
    {
      name: "Taft",
      party: "Republican",
      year: 1912,
      MAT: 5,   // Maximum free-market - old guard GOP, Payne-Aldrich tariff, pro-business
      CD: 4,    // Culturally conservative - establishment, traditional values, Old Guard
      CU: 2,    // Particularist - dollar diplomacy, protect American interests narrowly
      MOR: 2,   // Narrow moral circle - business establishment, judicial conservatism
      PRO: 5,   // Maximum proceduralist - judge to his core, constitutional strict construction
      COM: 3,   // Mixed - tried to hold party together but failed, rigid on principles
      ZS: 3,    // Mixed - believed in steady legal order, not dynamic reform
      ONT_H: 2, // Skeptical - conservative realism, judicial caution about human improvement
      ONT_S: 5, // System fine - courts and constitutions work, leave them alone
      PF: 5,    // Maximum partisan - fought to hold GOP establishment against TR insurgency
      TRB: 2,   // Low tribal - judicial temperament, establishment dignity
      ENG: 3,   // Moderate - defensive campaign, dispirited, knew he'd lose
      EPS: 1,   // Institutionalist - trusted courts above all else
      AES: 0,   // Statesman - judicial dignity, but failed to project leadership,
      morBoundaries: { boundaries: { national: 0.29, ethnic_racial: 0.09, religious: 0.17, class: 0.05, ideological: 0.15, gender: 0.06, political_tribe: 1 }, intensity: 3 },
    },
    {
      // Eugene V. Debs - Socialist Party (6.0%)
      // Peak vote share. Four-way race split mainstream vote. Socialist movement
      // at zenith - over 1,000 elected officials. "Vote for what you want."
      name: "Debs",
      party: "Independent" as any,
      year: 1912,
      MAT: 1,   // Maximum redistribution - public ownership
      CD: 1,    // Maximum cultural openness
      CU: 5,    // Maximum universalist - international solidarity
      MOR: 5,   // Widest moral circle
      PRO: 1,   // Anti-proceduralist
      COM: 1,   // Never compromise
      ZS: 5,    // Maximum zero-sum - class war
      ONT_H: 5, // Maximum perfectibility
      ONT_S: 1, // System broken
      PF: 1,    // Anti-partisan - rejected both capitalist parties
      TRB: 5,   // Maximum tribal - worker identity
      ENG: 5,   // Maximum engagement
      EPS: 0,   // Empiricist
      AES: 5,   // Visionary - "while there is a lower class, I am in it",
      morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.81, ideological: 0.48, gender: 0.1, political_tribe: 0 }, intensity: 3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1916: Wilson (D) vs Hughes (R) - "He Kept Us Out of War"
// ─────────────────────────────────────────────────────────────────────────────
// Wilson: Incumbent. Federal Reserve created, Clayton Antitrust Act, Federal
// Trade Commission, Adamson Act (8-hour day for railroad workers). "He Kept Us
// Out of War" - neutrality as selling point. Progressive domestic record.
// Won one of the closest elections in history.
// Hughes: Supreme Court justice who resigned to run. Progressive Republican,
// former NY governor. Tried to reunite GOP after 1912 split. Criticized Wilson
// on preparedness without clearly calling for war. Stiff, legalistic, "the
// bearded iceberg." Lost California by 3,773 votes.

const election1916: Election = {
  year: 1916,
  candidates: [
    {
      name: "Wilson",
      party: "Democratic",
      year: 1916,
      MAT: 1,   // Maximum redistribution - Adamson Act (8-hour day), FTC, Clayton Act, progressive taxation
      CD: 3,    // Culturally open lean - progressive reform, but Southern racial conservatism
      CU: 4,    // Internationalist - but "he kept us out of war" = cautious internationalism
      MOR: 3,   // Wide moral circle - progressive legislation for workers, moral foreign policy rhetoric
      PRO: 4,   // Proceduralist - worked through Congress (Federal Reserve Act, FTC), institutional reform
      COM: 3,   // Mixed - moralistic, wouldn't easily compromise principles, but legislated effectively
      ZS: 2,    // Positive-sum - reform benefits everyone, shared prosperity through regulation
      ONT_H: 4, // Optimistic - progressive faith in democratic improvement, "New Freedom" working
      ONT_S: 3, // Mixed - system reformed substantially (Fed, FTC), but not calling for overhaul
      PF: 5,    // Maximum partisan - rebuilt Democratic Party, strong party leader
      TRB: 3,   // Moderate tribal - progressive coalition, not class-warfare rhetoric
      ENG: 5,   // Maximum engagement - aggressive legislative agenda, seeking reelection
      EPS: 0,   // Empiricist - political scientist, studied government, evidence-based reform
      AES: 0,   // Statesman - incumbent president, "above politics" neutrality posture,
      morBoundaries: { boundaries: { national: 0.17, ethnic_racial: 0.05, religious: 0.05, class: 0.29, ideological: 0.24, gender: 0.07, political_tribe: 1 }, intensity: 3 },
    },
    {
      name: "Hughes",
      party: "Republican",
      year: 1916,
      MAT: 5,   // Push extreme — pro-business, anti-labor legislation
      CD: 5,    // Push extreme — conservative establishment
      CU: 1,    // Push extreme — preparedness/nationalism
      MOR: 1,   // Push extreme — narrow establishment
      PRO: 5,   // Maximum proceduralist
      COM: 3,   // Mixed — couldn't reunite the wings
      ZS: 3,    // Mixed
      ONT_H: 2, // Pessimistic — wanted war preparedness
      ONT_S: 5, // System fine — just needs Republican management
      PF: 5,    // Maximum Republican partisan
      TRB: 4,   // Tribal — GOP establishment
      ENG: 3,   // Moderate — stiff campaigner
      EPS: 1,   // Institutionalist - Supreme Court justice, trusted legal institutions
      AES: 0,   // Statesman - judicial dignity, presidential bearing, but aloof,
      morBoundaries: { boundaries: { national: 0.76, ethnic_racial: 0.76, religious: 0.41, class: 0.05, ideological: 0.44, gender: 0.16, political_tribe: 1 }, intensity: 3 },
    },
    {
      // Allan L. Benson - Socialist Party (3.2%)
      // Journalist, not organizer like Debs. Won nomination because Debs
      // declined. Main platform: national referendum before declaring war.
      // Anti-war was his defining issue as Europe burned.
      name: "Benson",
      party: "Independent" as any,
      year: 1916,
      MAT: 1,   // Maximum redistribution - socialist economics
      CD: 1,    // Maximum cultural openness - progressive
      CU: 5,    // Maximum universalist - anti-war internationalist
      MOR: 5,   // Widest moral circle - war is immoral
      PRO: 1,   // Anti-proceduralist - wanted referendum to bypass Congress on war
      COM: 1,   // Never compromise - absolutist pacifist-socialist
      ZS: 5,    // Maximum zero-sum - class war, war profiteers vs workers
      ONT_H: 4, // Optimistic - but less charismatic than Debs
      ONT_S: 1, // System broken - capitalism produces war
      PF: 1,    // Anti-partisan
      TRB: 4,   // High tribal - worker identity, but less personal than Debs
      ENG: 3,   // Moderate - journalist, not mass organizer
      EPS: 0,   // Empiricist - journalist, studied issues
      AES: 5,   // Visionary - anti-war idealism,
      morBoundaries: { boundaries: { national: 0.05, ethnic_racial: 0.05, religious: 0.05, class: 0.62, ideological: 0.37, gender: 0.09, political_tribe: 0 }, intensity: 2.25 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Export all elections
// ─────────────────────────────────────────────────────────────────────────────
export const ELECTIONS_1892_1916: Election[] = [
  election1892,
  election1896,
  election1900,
  election1904,
  election1908,
  election1912,
  election1916,
];

// ─────────────────────────────────────────────────────────────────────────────
// ACTUAL_RESULTS block - paste into simulate.ts ACTUAL_RESULTS object
// ─────────────────────────────────────────────────────────────────────────────
//
// 1892: { winner: "Cleveland", winnerPct: 46.0, loserPct: 43.0 }, // Weaver 8.5%
// 1896: { winner: "McKinley", winnerPct: 51.0, loserPct: 46.7 },
// 1900: { winner: "McKinley", winnerPct: 51.6, loserPct: 45.5 },
// 1904: { winner: "Roosevelt", winnerPct: 56.4, loserPct: 37.6 },
// 1908: { winner: "Taft", winnerPct: 51.6, loserPct: 43.0 },
// 1912: { winner: "Wilson", winnerPct: 41.8, loserPct: 27.4 }, // TR 27.4%, Taft 23.2%
// 1916: { winner: "Wilson", winnerPct: 49.2, loserPct: 46.1 },
//
