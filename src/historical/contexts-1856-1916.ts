/**
 * Election Activation Contexts (1856-1916)
 *
 * Three-layer activation model for the sectional crisis, Civil War,
 * Reconstruction, Gilded Age, and Progressive Era. Sixteen elections
 * spanning the birth of the Republican Party through Wilson's reelection
 * on the eve of World War I.
 */

import type { ElectionContext } from "./activation.js";

// ─────────────────────────────────────────────────────────────────────────────
// 1856: Buchanan (D) vs Fremont (R) vs Fillmore (Know-Nothing)
// ─────────────────────────────────────────────────────────────────────────────
// First Republican nominee. Slavery in territories is THE question. Know-Nothings
// channel nativism as a distraction from sectional crisis. Buchanan wins as the
// "safe" choice — the last president to hold the Union together by appeasement.

const context1856: ElectionContext = {
  year: 1856,
  zeitgeist: {
    era: "sectional",
    nodeWeights: { MOR: 1.8, CD: 1.5, CU: 1.5, ONT_S: 5.5, COM: 1.3 },
    intensity: 1.3,
    description: "Bleeding Kansas; slavery expansion fracturing the party system",
  },
  issueLandscape: {
    primaryAxis: ["MOR", "CD"],
    secondaryAxis: ["CU", "ONT_S", "COM", "PRO", "ZS"],
    dormant: ["MAT", "ONT_H", "ENG"],
    description: "Slavery in territories dominates; nativism a secondary current; economics irrelevant",
  },
  candidateActivations: [
    {
      candidateName: "Buchanan",
      activationNodes: { COM: 1.4, PRO: 1.3, MOR: 1.2 },
      novelty: 1.0,
      threatActivation: { ONT_S: 5.2 },
    },
    {
      candidateName: "Fremont",
      activationNodes: { MOR: 1.5, CU: 1.4, ONT_S: 5.3 },
      novelty: 1.5,
      threatActivation: { MOR: 1.5, CD: 1.4 },
    },
    {
      candidateName: "Fillmore",
      activationNodes: { CD: 1.5, MOR: 1.5, ZS: 1.3 },
      novelty: 0.8,
      threatActivation: { CU: 1.3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1860: Lincoln (R) vs Douglas (N.Dem) vs Breckinridge (S.Dem) vs Bell (CU)
// ─────────────────────────────────────────────────────────────────────────────
// The election that broke the Union. Four-way race. Lincoln not on southern
// ballots. Secession threats are real. Moral clarity vs. compromise vs.
// fire-eating vs. procedural Unionism. Most consequential election in history.

const context1860: ElectionContext = {
  year: 1860,
  zeitgeist: {
    era: "sectional",
    nodeWeights: { MOR: 2.0, ONT_S: 4.0, CD: 1.8, CU: 1.5, ZS: 1.5 },
    intensity: 1.5,
    description: "Nation fracturing over slavery; secession looming; existential stakes",
  },
  issueLandscape: {
    primaryAxis: ["MOR", "ONT_S"],
    secondaryAxis: ["CD", "CU", "PRO", "ZS"],
    dormant: ["MAT", "COM", "ONT_H", "ENG"],
    description: "Slavery expansion is THE issue; economic policy irrelevant; party system shattering",
  },
  candidateActivations: [
    {
      candidateName: "Lincoln",
      activationNodes: { MOR: 1.5, CU: 1.3, PRO: 1.2 },
      novelty: 1.8,
      threatActivation: { MOR: 1.5, CD: 1.3 },
    },
    {
      candidateName: "Douglas",
      activationNodes: { COM: 1.3, PRO: 1.2 },
      novelty: 1.0,
    },
    {
      candidateName: "Breckinridge",
      activationNodes: { MOR: 1.8, CD: 1.5, ZS: 1.3 },
      novelty: 1.2,
      threatActivation: { MOR: 1.4, CU: 1.3 },
    },
    {
      candidateName: "Bell",
      activationNodes: { COM: 1.5, PRO: 1.3 },
      novelty: 0.8,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1864: Lincoln (R/National Union) vs McClellan (D) - Civil War
// ─────────────────────────────────────────────────────────────────────────────
// Wartime election. Emancipation Proclamation transformed war aims. Total war
// strategy under Grant/Sherman. Lincoln deeply unpopular in summer 1864 before
// Atlanta fell. McClellan on a peace platform he personally repudiated.
// Existential: if McClellan wins, the Confederacy may survive.

const context1864: ElectionContext = {
  year: 1864,
  zeitgeist: {
    era: "civil-war",
    nodeWeights: { MOR: 2.5, ZS: 2.0, ONT_S: 4.0, ENG: 1.8, CD: 1.5 },
    intensity: 1.5,
    description: "Civil War raging; emancipation now a war aim; Union survival at stake",
  },
  issueLandscape: {
    primaryAxis: ["MOR", "ZS"],
    secondaryAxis: ["ONT_S", "CD", "ENG", "PRO"],
    dormant: ["MAT", "CU", "COM", "ONT_H"],
    description: "War vs. peace; emancipation vs. restoration; total commitment vs. negotiation",
  },
  candidateActivations: [
    {
      candidateName: "Lincoln",
      activationNodes: { MOR: 1.8, ENG: 1.5, ONT_S: 5.4, CU: 1.3 },
      novelty: 1.5,
      threatActivation: { ZS: 1.3, MOR: 1.3 },
    },
    {
      candidateName: "McClellan",
      activationNodes: { COM: 1.3, PRO: 1.4, ZS: 1.2 },
      novelty: 1.0,
      threatActivation: { MOR: 1.5, ONT_S: 5.4 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1868: Grant (R) vs Seymour (D) - Reconstruction
// ─────────────────────────────────────────────────────────────────────────────
// First postwar election. Radical Reconstruction, 14th Amendment, Freedmen's
// Bureau, KKK violence. Grant is the war hero promising stability and continued
// reform. Seymour runs on "white man's government" and opposition to
// Reconstruction. Race is THE axis of conflict.

const context1868: ElectionContext = {
  year: 1868,
  zeitgeist: {
    era: "civil-war",
    nodeWeights: { MOR: 2.0, CD: 1.8, CU: 1.5, ONT_S: 5.5, ZS: 1.5 },
    intensity: 1.3,
    description: "Reconstruction underway; 14th Amendment; KKK violence; freedmen's rights contested",
  },
  issueLandscape: {
    primaryAxis: ["MOR", "CD"],
    secondaryAxis: ["CU", "ONT_S", "ZS", "PRO"],
    dormant: ["MAT", "COM", "ONT_H", "ENG"],
    description: "Reconstruction and Black rights dominate; racial hierarchy vs. equal citizenship",
  },
  candidateActivations: [
    {
      candidateName: "Grant",
      activationNodes: { MOR: 1.4, PRO: 1.3, CU: 1.3 },
      novelty: 1.5,
      threatActivation: { MOR: 1.2 },
    },
    {
      candidateName: "Seymour",
      activationNodes: { MOR: 1.6, CD: 1.5, ZS: 1.4 },
      novelty: 0.8,
      threatActivation: { MOR: 1.5, CU: 1.4, ONT_S: 5.3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1872: Grant (R) vs Greeley (Liberal R + D fusion)
// ─────────────────────────────────────────────────────────────────────────────
// Reconstruction fatigue setting in. Liberal Republicans bolt over Grant's
// corruption and Reconstruction "excess." Democrats fuse with Greeley — a
// lifelong abolitionist turned reconciliation candidate. Low-intensity
// mismatch: Grant still popular, Greeley an eccentric. Greeley dies after losing.

const context1872: ElectionContext = {
  year: 1872,
  zeitgeist: {
    era: "reconstruction",
    nodeWeights: { PRO: 1.5, MOR: 1.3, ONT_S: 5.3, COM: 1.3 },
    intensity: 0.9,
    description: "Reconstruction fatigue; corruption scandals; Liberal Republican revolt",
  },
  issueLandscape: {
    primaryAxis: ["PRO", "COM", "ONT_S"],
    secondaryAxis: ["MOR", "CD", "CU"],
    dormant: ["MAT", "ZS", "ONT_H", "ENG"],
    description: "Corruption vs. clean government; reconciliation vs. continued Reconstruction",
  },
  candidateActivations: [
    {
      candidateName: "Grant",
      activationNodes: { MOR: 1.3 },
      novelty: 1.0,
    },
    {
      candidateName: "Greeley",
      activationNodes: { COM: 1.5, PRO: 1.4, ONT_H: 1.3, ONT_S: 5.3 },
      novelty: 1.3,
      threatActivation: { MOR: 1.2 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1876: Hayes (R) vs Tilden (D) - Contested election / End of Reconstruction
// ─────────────────────────────────────────────────────────────────────────────
// Most disputed election until 2000. Tilden won the popular vote. Compromise
// of 1877 gave Hayes the presidency in exchange for ending Reconstruction.
// Both candidates ran as reformers against corruption. The real issue —
// hidden beneath proceduralism — was whether Reconstruction would survive.

const context1876: ElectionContext = {
  year: 1876,
  zeitgeist: {
    era: "reconstruction",
    nodeWeights: { PRO: 1.8, ONT_S: 5.5, MOR: 1.3, COM: 1.3 },
    intensity: 1.2,
    description: "Reconstruction winding down; Grant scandals; reform movement ascendant",
  },
  issueLandscape: {
    primaryAxis: ["PRO", "ONT_S", "MOR"],
    secondaryAxis: ["COM", "CD"],
    dormant: ["MAT", "CU", "ZS", "ONT_H", "ENG"],
    description: "Clean government vs. corruption; Reconstruction's fate decided behind closed doors",
  },
  candidateActivations: [
    {
      candidateName: "Hayes",
      activationNodes: { PRO: 1.4, MOR: 1.3, COM: 1.2 },
      novelty: 1.0,
    },
    {
      candidateName: "Tilden",
      activationNodes: { PRO: 1.5, ONT_S: 5.3 },
      novelty: 1.3,
      threatActivation: { MOR: 1.2 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1880: Garfield (R) vs Hancock (D)
// ─────────────────────────────────────────────────────────────────────────────
// Low-stakes election after the drama of 1876. Reconstruction is over.
// Stalwart vs. Half-Breed Republican infighting over patronage. Civil service
// reform and tariff are the "issues" but nobody's excited. Razor-thin popular
// vote margin. Garfield assassinated by a Stalwart the next year.

const context1880: ElectionContext = {
  year: 1880,
  zeitgeist: {
    era: "gilded",
    nodeWeights: { PRO: 2.0, MAT: 1.5, MOR: 1.5, CD: 0.3, CU: 0.3 },
    intensity: 0.8,
    description: "Post-Reconstruction calm; patronage politics; tariff debate; low-stakes",
  },
  issueLandscape: {
    primaryAxis: ["PRO", "MAT", "MOR"],
    secondaryAxis: ["COM", "ONT_S"],
    dormant: ["CD", "CU", "ZS", "ONT_H", "ENG"],
    description: "Civil service reform and tariff; moral questions of Reconstruction era fading",
  },
  candidateActivations: [
    {
      candidateName: "Garfield",
      activationNodes: { PRO: 1.3, MAT: 1.2, ONT_H: 1.2 },
      novelty: 1.0,
    },
    {
      candidateName: "Hancock",
      activationNodes: { COM: 1.2, MOR: 1.1 },
      novelty: 1.0,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1884: Cleveland (D) vs Blaine (R) - Mugwumps
// ─────────────────────────────────────────────────────────────────────────────
// Character election. Cleveland: honest, reformer, acknowledged illegitimate
// child. Blaine: charismatic but corrupt (Mulligan letters). Mugwump
// Republicans defect to Cleveland over Blaine's corruption. "Rum, Romanism,
// and Rebellion" gaffe costs Blaine Catholic votes in NY. First Democratic
// president since 1856.

const context1884: ElectionContext = {
  year: 1884,
  zeitgeist: {
    era: "gilded",
    nodeWeights: { PRO: 1.8, MOR: 1.3, MAT: 1.2, CD: 0.6 },
    intensity: 1.0,
    description: "Corruption vs. reform; Mugwump revolt; character matters more than policy",
  },
  issueLandscape: {
    primaryAxis: ["PRO", "MOR", "COM"],
    secondaryAxis: ["MAT", "CD"],
    dormant: ["CU", "ZS", "ONT_H", "ONT_S", "ENG"],
    description: "Personal integrity and clean government dominate; tariff secondary; moral questions dormant",
  },
  candidateActivations: [
    {
      candidateName: "Cleveland",
      activationNodes: { PRO: 1.5, COM: 1.2 },
      novelty: 1.3,
    },
    {
      candidateName: "Blaine",
      activationNodes: { MOR: 1.4, ENG: 1.3 },
      novelty: 1.0,
      threatActivation: { PRO: 1.4 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1888: Harrison (R) vs Cleveland (D) - Tariff election
// ─────────────────────────────────────────────────────────────────────────────
// Cleveland devoted his 1887 State of the Union entirely to tariff reform —
// a brave but boring move. Harrison ran a front-porch campaign on high tariffs
// and veteran pensions. Cleveland won the popular vote but lost the EC.
// Pure policy election, low passion, patronage and organization decided it.

const context1888: ElectionContext = {
  year: 1888,
  zeitgeist: {
    era: "gilded",
    nodeWeights: { MAT: 1.5, PRO: 1.3, MOR: 1.3, CD: 0.5 },
    intensity: 0.8,
    description: "Tariff is THE issue; patronage politics; honest but boring",
  },
  issueLandscape: {
    primaryAxis: ["MAT", "PRO", "MOR"],
    secondaryAxis: ["COM", "CU"],
    dormant: ["CD", "ZS", "ONT_H", "ONT_S", "ENG"],
    description: "Tariff reduction vs. protection; party organization and patronage; low moral stakes",
  },
  candidateActivations: [
    {
      candidateName: "Harrison",
      activationNodes: { MAT: 1.3, MOR: 1.3 },
      novelty: 1.0,
    },
    {
      candidateName: "Cleveland",
      activationNodes: { PRO: 1.3, MAT: 1.2 },
      novelty: 0.8,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1892: Cleveland (D) vs Harrison (R) vs Weaver (Populist)
// ─────────────────────────────────────────────────────────────────────────────
// Rematch plus the Populist insurgency. Agrarian revolt erupting — free silver,
// income tax, government ownership of railroads. Homestead Strike shows
// labor tensions. Weaver carries 4 states. Cleveland wins but inherits the
// Panic of 1893. The old order's last gasp before realignment.

const context1892: ElectionContext = {
  year: 1892,
  zeitgeist: {
    era: "gilded",
    nodeWeights: { MAT: 1.8, ONT_S: 5.8, ZS: 1.5, MOR: 1.5, ENG: 1.3 },
    intensity: 1.1,
    description: "Agrarian revolt; Homestead Strike; Populist insurgency; economic anxiety rising",
  },
  issueLandscape: {
    primaryAxis: ["MAT", "ONT_S", "ZS"],
    secondaryAxis: ["MOR", "ENG", "COM"],
    dormant: ["CD", "CU", "PRO", "ONT_H"],
    description: "Economic class conflict erupting; gold vs. silver nascent; Populist third force",
  },
  candidateActivations: [
    {
      candidateName: "Cleveland",
      activationNodes: { PRO: 1.3, COM: 1.2 },
      novelty: 0.8,
    },
    {
      candidateName: "Harrison",
      activationNodes: { MAT: 1.2, MOR: 1.3 },
      novelty: 0.8,
    },
    {
      candidateName: "Weaver",
      activationNodes: { ONT_S: 5.6, ZS: 1.5, MOR: 1.5, MAT: 1.4, ENG: 1.4 },
      novelty: 1.5,
      threatActivation: { MAT: 1.3, ONT_S: 5.3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1896: McKinley (R) vs Bryan (D/Populist) - REALIGNMENT
// ─────────────────────────────────────────────────────────────────────────────
// The great realignment election. Bryan's "Cross of Gold" speech electrified
// agrarian America. Gold vs. silver = industrialism vs. agrarianism, creditor
// vs. debtor, city vs. country. McKinley's front-porch campaign backed by
// Hanna's corporate machine. Bryan barnstormed 18,000 miles — first modern
// campaign. McKinley's victory locked in Republican dominance for 36 years.

const context1896: ElectionContext = {
  year: 1896,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { MAT: 2.0, PRO: 1.5, MOR: 1.5 },
    intensity: 1.2,
    description: "Realignment: gold vs. silver; industrial capitalism vs. agrarian populism; Panic of 1893 aftermath",
  },
  issueLandscape: {
    primaryAxis: ["MAT", "PRO", "MOR"],
    secondaryAxis: ["ONT_S", "CD", "COM"],
    dormant: ["CU", "ZS", "ONT_H", "ENG"],
    description: "Economic policy dominates; McKinley's 'full dinner pail' vs Bryan's silver populism",
  },
  candidateActivations: [
    {
      candidateName: "McKinley",
      activationNodes: { MAT: 1.5, PRO: 1.5, MOR: 1.3, COM: 1.3 },
      novelty: 1.2,
      threatActivation: { ONT_S: 5.3 },
    },
    {
      candidateName: "Bryan",
      activationNodes: { ONT_S: 5.3, MOR: 1.2 },
      novelty: 1.3,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1900: McKinley (R) vs Bryan (D) - Rematch + Imperialism
// ─────────────────────────────────────────────────────────────────────────────
// Prosperity and empire. McKinley won the Spanish-American War, annexed the
// Philippines. Bryan tried to pivot to anti-imperialism but silver still
// haunted him. "Full dinner pail" prosperity was hard to argue with. Lower
// stakes than 1896 — the realignment was already settled.

const context1900: ElectionContext = {
  year: 1900,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { MAT: 1.5, CU: 1.5, MOR: 1.3, ZS: 1.3, ONT_S: 0.7 },
    intensity: 1.0,
    description: "Prosperity; imperialism debate; silver question fading; realignment consolidated",
  },
  issueLandscape: {
    primaryAxis: ["MAT", "CU", "MOR"],
    secondaryAxis: ["ZS", "CD", "ENG"],
    dormant: ["PRO", "COM", "ONT_H", "ONT_S"],
    description: "Imperialism (Philippines) joins economic debate; prosperity vs. populism rematch",
  },
  candidateActivations: [
    {
      candidateName: "McKinley",
      activationNodes: { MAT: 1.3, CU: 1.2, MOR: 1.2 },
      novelty: 1.0,
    },
    {
      candidateName: "Bryan",
      activationNodes: { MOR: 1.4, CU: 1.3, ZS: 1.3, ENG: 1.3 },
      novelty: 1.0,
      threatActivation: { MAT: 1.3 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1904: T. Roosevelt (R) vs Parker (D) - TR's own mandate
// ─────────────────────────────────────────────────────────────────────────────
// TR ascended after McKinley's assassination. Trust-busting, coal strike
// arbitration, conservation, Panama Canal. Now seeking his own mandate.
// Parker is the anti-Bryan — a conservative judge chosen to pivot the party
// back to Bourbon respectability. TR wins in a landslide. Progressive era
// is dawning.

const context1904: ElectionContext = {
  year: 1904,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { ONT_S: 5.5, MAT: 1.5, MOR: 1.3, ONT_H: 1.3, PRO: 0.7 },
    intensity: 1.1,
    description: "Progressive era dawning; trust-busting; conservation; Square Deal; prosperity continuing",
  },
  issueLandscape: {
    primaryAxis: ["ONT_S", "MAT", "MOR"],
    secondaryAxis: ["ONT_H", "CU", "ENG", "ZS"],
    dormant: ["CD", "PRO", "COM"],
    description: "Trust regulation and corporate power; role of government in economy; cultural issues quiet",
  },
  candidateActivations: [
    {
      candidateName: "Roosevelt",
      activationNodes: { ONT_S: 5.4, MOR: 1.4, ENG: 1.5, ONT_H: 1.3 },
      novelty: 1.5,
    },
    {
      candidateName: "Parker",
      activationNodes: { PRO: 1.3, COM: 1.3 },
      novelty: 0.8,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1908: Taft (R) vs Bryan (D) - Bryan's third try
// ─────────────────────────────────────────────────────────────────────────────
// TR handpicked Taft to continue his program. Bryan's third and final run —
// shifted from silver to income tax, railroad regulation, direct election of
// senators. More mature, less fiery, still lost. Progressive reform agenda
// now mainstream in both parties. Low-stakes: everyone agrees on reform, just
// disagree on degree.

const context1908: ElectionContext = {
  year: 1908,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { ONT_S: 5.5, MAT: 1.5, PRO: 1.3, ONT_H: 1.3, MOR: 0.6 },
    intensity: 0.9,
    description: "Progressive reforms mainstreaming; TR's heir vs. the Great Commoner; reform consensus",
  },
  issueLandscape: {
    primaryAxis: ["ONT_S", "MAT", "PRO"],
    secondaryAxis: ["ONT_H", "MOR", "COM", "ENG"],
    dormant: ["CD", "CU", "ZS"],
    description: "Degree of Progressive reform; railroad regulation; income tax; direct democracy",
  },
  candidateActivations: [
    {
      candidateName: "Taft",
      activationNodes: { PRO: 1.3, COM: 1.2 },
      novelty: 1.0,
    },
    {
      candidateName: "Bryan",
      activationNodes: { ONT_S: 5.4, MAT: 1.3, MOR: 1.3, ENG: 1.3 },
      novelty: 1.0,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1912: Wilson (D) vs Roosevelt (Progressive/Bull Moose) vs Taft (R)
// ─────────────────────────────────────────────────────────────────────────────
// The most Progressive election in American history. Three candidates all
// running on reform — the question is what KIND. Wilson's "New Freedom"
// (break up trusts) vs. TR's "New Nationalism" (regulate trusts) vs. Taft's
// judicial conservatism. TR bolted the GOP and created the Progressive Party.
// Wilson wins with 42% because the Republican vote splits. Peak reformism.

const context1912: ElectionContext = {
  year: 1912,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { ONT_S: 4.0, MAT: 1.8, ONT_H: 1.8, MOR: 1.5, ENG: 1.5 },
    intensity: 1.3,
    description: "Peak Progressive era; three-way reform debate; party system fracturing; high engagement",
  },
  issueLandscape: {
    primaryAxis: ["ONT_S", "MAT", "ONT_H"],
    secondaryAxis: ["MOR", "ENG", "PRO"],
    dormant: ["CD", "CU", "ZS", "COM"],
    description: "How to reform capitalism: break trusts, regulate trusts, or leave courts in charge",
  },
  candidateActivations: [
    {
      candidateName: "Wilson",
      activationNodes: { ONT_S: 5.4, MAT: 1.3, MOR: 1.3, PRO: 1.2 },
      novelty: 1.3,
    },
    {
      candidateName: "Roosevelt",
      activationNodes: { ONT_S: 5.6, MOR: 1.6, ONT_H: 1.5, ENG: 1.5, MAT: 1.3 },
      novelty: 1.5,
      threatActivation: { PRO: 1.3, MOR: 1.3 },
    },
    {
      candidateName: "Taft",
      activationNodes: { PRO: 1.4, MOR: 1.3 },
      novelty: 0.8,
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1916: Wilson (D) vs Hughes (R) - "He Kept Us Out of War"
// ─────────────────────────────────────────────────────────────────────────────
// War in Europe looms over everything. Wilson's domestic record is strong
// (Federal Reserve, FTC, Clayton Act, Adamson Act 8-hour day). But the
// campaign is about neutrality vs. preparedness. Hughes tries to reunite
// the GOP after 1912 without being clear on war. Wilson wins razor-thin —
// lost California by 3,773 votes. War comes anyway in 1917.

const context1916: ElectionContext = {
  year: 1916,
  zeitgeist: {
    era: "progressive",
    nodeWeights: { ZS: 1.8, CU: 1.5, MAT: 1.5, MOR: 1.3, ONT_S: 5.3 },
    intensity: 1.2,
    description: "European war looming; neutrality vs. preparedness; Progressive legislation at home",
  },
  issueLandscape: {
    primaryAxis: ["ZS", "CU", "MAT"],
    secondaryAxis: ["MOR", "ONT_S", "PRO"],
    dormant: ["CD", "COM", "ONT_H", "ENG"],
    description: "War and peace dominate; Progressive reforms continue; party reunification for GOP",
  },
  candidateActivations: [
    {
      candidateName: "Wilson",
      activationNodes: { MAT: 1.3, MOR: 1.3, CU: 1.2, ONT_S: 5.2 },
      novelty: 1.0,
      threatActivation: { ZS: 1.3, MOR: 1.2 },
    },
    {
      candidateName: "Hughes",
      activationNodes: { PRO: 1.3, ZS: 1.2, MOR: 1.3 },
      novelty: 1.0,
      threatActivation: { CU: 1.2 },
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Export all contexts
// ─────────────────────────────────────────────────────────────────────────────
export const CONTEXTS_1856_1916: ElectionContext[] = [
  context1856,
  context1860,
  context1864,
  context1868,
  context1872,
  context1876,
  context1880,
  context1884,
  context1888,
  context1892,
  context1896,
  context1900,
  context1904,
  context1908,
  context1912,
  context1916,
];
