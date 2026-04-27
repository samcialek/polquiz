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

// ─────────────────────────────────────────────────────────────────────────────
// 1856: Buchanan (D) vs Fremont (R) vs Fillmore (Know-Nothing/American)
// ─────────────────────────────────────────────────────────────────────────────
// First election with the new Republican Party. Slavery was THE issue.
// Buchanan: Pennsylvania "doughface" (northern man with southern principles).
// Ran on popular sovereignty, Compromise of 1850, preserving the Union by
// appeasing the South. Experienced diplomat - ambassador to UK, avoided Kansas
// controversy by being abroad. "Old Buck."
// Fremont: "The Pathfinder." Explorer, romantic figure, first Republican nominee.
// Ran on "Free Soil, Free Labor, Free Men" - no slavery in the territories.
// Not an abolitionist per se, but anti-slavery-expansion.
// Fillmore: Ex-president running as Know-Nothing/American Party. Nativist,
// anti-Catholic, anti-immigrant. Also tried to be the "Union" candidate.
// Carried only Maryland.

const election1856: Election = {
  year: 1856,
  candidates: [
    {
      name: "Buchanan",
      party: "Democratic",
      year: 1856,
      MAT: 4,   // Pro-planter economics - low tariff, free trade, agrarian elite
      CD: 4,    // Culturally conservative - defended southern social order, status quo
      CU: 2,    // Particularist - states' rights, popular sovereignty, not universal principles
      MOR: 1,   // Narrow moral circle - pro-slavery accommodation, Dred Scott compliance
      PRO: 4,   // Proceduralist - legalist, Compromise of 1850, Dred Scott compliance
      COM: 5,   // Maximum compromiser - entire platform was compromise to hold Union together
      ZS: 3,    // Mixed - believed compromise could produce positive outcomes but defensive
      ONT_H: 2, // Pessimistic - feared social disruption, human nature requires order
      ONT_S: 5, // System fine - Constitution as-is protects slavery, don't change it
      PF: 5,    // Maximum partisan - Democratic Party machine, Jacksonian tradition
      TRB: 4,   // High tribal - southern planter class + northern Catholic immigrants
      ENG: 4,   // Engaged - career diplomat/politician, but "Old Buck" was cautious
      EPS: 1,   // Institutionalist - trusted constitutional framework, legal precedent
      AES: 0,   // Statesman - elder diplomat, gravitas, experienced hand
    },
    {
      name: "Fremont",
      party: "Republican",
      year: 1856,
      MAT: 3,   // Free-labor reformer; anti-planter, not modern redistributionist
      CD: 2,    // Culturally open for the era, not a modern endpoint
      CU: 4,    // Universalist free-soil appeal, short of full pluralist maximum
      MOR: 4,   // Anti-slavery-expansion moral politics, not full abolitionist maximalism
      PRO: 3,   // New-party challenger but still constitutional/electoral
      COM: 2,   // Low compromise on slave-power expansion, not total absolutism
      ZS: 2,    // Positive-sum
      ONT_H: 4, // Optimistic - free labor promise
      ONT_S: 2, // System corrupted by slave power, reformable through new party
      PF: 4,    // Strong partisan - first Republican nominee
      TRB: 4,   // Strong northern free-state identity
      ENG: 5,   // Maximum engagement
      EPS: 3,   // Intuitionist
      AES: 5,   // Visionary
    },
    {
      name: "Fillmore",
      party: "Independent", // Know-Nothing / American Party
      year: 1856,
      MAT: 4,   // Pro-business - Whig economics, tariff supporter
      CD: 5,    // Maximum cultural closure - nativist, anti-Catholic, anti-immigrant
      CU: 1,    // Maximum particularist - "Americans must rule America," closed borders
      MOR: 1,   // Maximum narrow - nativist exclusion, Protestant-only moral community
      PRO: 4,   // Proceduralist - legalist, Compromise of 1850 architect as president
      COM: 4,   // Compromiser - ran as Union candidate, above-sectional-conflict
      ZS: 4,    // Zero-sum - immigrants taking American jobs, Catholic conspiracy fears
      ONT_H: 2, // Pessimistic - feared foreign subversion, society under threat
      ONT_S: 3, // Mixed - system threatened by immigration, needs protection not overhaul
      PF: 2,    // Low partisan - bolted from Whigs, ran on third-party ticket
      TRB: 5,   // Maximum tribal - "native-born Americans" as identity, Protestant nativism
      ENG: 4,   // Engaged - ex-president running again on nativist platform
      EPS: 2,   // Traditionalist - "the way things were" before immigrant wave
      AES: 0,   // Statesman - ex-president, tried to project elder authority
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1860: Lincoln (R) vs Douglas (Northern D) vs Breckinridge (Southern D)
//       vs Bell (Constitutional Union)
// ─────────────────────────────────────────────────────────────────────────────
// The election that broke the Union. Four-way race with deep sectional splits.
// Lincoln: "Rail-Splitter." Anti-slavery expansion, free labor, Homestead Act,
// transcontinental railroad. Not an abolitionist - promised not to touch slavery
// where it existed. Won with 39.8% in a four-way race, didn't appear on
// southern ballots. Moral clarity combined with legal caution.
// Douglas: "Little Giant." Popular sovereignty - let territories decide. Tried
// to hold the Democratic center. Lincoln-Douglas debates. Broke with Buchanan
// over Lecompton. Exhausting national campaign. Died shortly after.
// Breckinridge: Vice President running as Southern Democrat. Slavery must be
// protected in all territories. Fire-eater candidate. States' rights maximum.
// Bell: Old Whig. Constitutional Union - "the Constitution, the Union, and
// the Enforcement of the Laws." No platform on slavery. Pure proceduralism.

const election1860: Election = {
  year: 1860,
  candidates: [
    {
      name: "Lincoln",
      party: "Republican",
      year: 1860,
      MAT: 3,   // Free-labor developmentalism; tariffs/railroads but not laissez-faire
      CD: 2,    // Culturally open - anti-slavery expansion, moral opposition to slavery
      CU: 4,    // Universalist - Declaration of Independence, "all men are created equal"
      MOR: 5,   // Maximum wide moral circle - slavery is morally wrong, must not expand
      PRO: 5,   // Maximum proceduralist - won't touch slavery where Constitution protects it
      COM: 3,   // Mixed - principled on slavery expansion but pragmatic coalition builder
      ZS: 2,    // Positive-sum - free labor benefits everyone, "right to rise"
      ONT_H: 4, // Optimistic - believed in human improvement, self-made man narrative
      ONT_S: 3, // Mixed - system needs correction on slavery but Constitution basically sound
      PF: 4,    // Strong Republican - party's champion, but attracted ex-Whigs and Know-Nothings
      TRB: 3,   // Moderate tribal - northern free-state identity but universal rhetoric
      ENG: 5,   // Maximum engagement - historic stakes, tireless campaigner (through surrogates)
      EPS: 0,   // Empiricist - lawyer, logical reasoning, Lincoln-Douglas debates
      AES: 3,   // Authentic - "Rail-Splitter," log cabin, self-made man
    },
    {
      name: "Douglas",
      party: "Democratic",
      year: 1860,
      MAT: 3,   // Centrist - popular sovereignty, let markets and voters decide
      CD: 3,    // Culturally moderate - tried to straddle slavery issue, not moralist
      CU: 2,    // Local-choice particularism; territories decide rather than universal rights
      MOR: 2,   // Narrow-to-mixed - refused to call slavery morally wrong, "I don't care" stance
      PRO: 4,   // Proceduralist - popular sovereignty IS proceduralism, let the process decide
      COM: 5,   // Maximum compromiser - career built on compromise, "Little Giant" dealmaker
      ZS: 3,    // Mixed - believed compromise avoided conflict
      ONT_H: 3, // Moderate - pragmatic, not idealistic
      ONT_S: 3, // Mixed - popular sovereignty as a patch for a visibly failing order
      PF: 5,    // Maximum partisan - Democratic Party man, fought for party unity
      TRB: 3,   // Moderate tribal - tried to be national, not sectional
      ENG: 5,   // Maximum engagement - campaigned nationally even when cause was lost
      EPS: 1,   // Institutionalist - trusted democratic process, popular sovereignty
      AES: 4,   // Fighter - "Little Giant," combative debater, tireless campaigner
    },
    {
      name: "Breckinridge",
      party: "Democratic", // Southern Democrat faction
      year: 1860,
      MAT: 4,   // Pro-planter - slave economy, low tariff, agrarian elite
      CD: 5,    // Maximum cultural closure - slavery is a positive good, white supremacy
      CU: 1,    // Maximum particularist - states' rights, slave property paramount
      MOR: 1,   // Maximum narrow moral circle - slavery, racial hierarchy, white-only citizenship
      PRO: 2,   // Anti-proceduralist - defied party, would defy Union if slavery not protected
      COM: 1,   // Never compromise - slavery must be protected everywhere, no concessions
      ZS: 5,    // Maximum zero-sum - racial hierarchy, slave labor vs free labor
      ONT_H: 1, // Maximum pessimistic - fixed racial hierarchy, human nature unchangeable
      ONT_S: 2, // System broken - federal government failing to protect slave property
      PF: 3,    // Moderate partisan - split from main Democratic Party, sectional
      TRB: 5,   // Maximum tribal - white southern slaveholder identity
      ENG: 5,   // Maximum engagement - existential stakes for slavery, secession looming
      EPS: 2,   // Traditionalist - "peculiar institution" as tradition, ancestral ways
      AES: 0,   // Statesman - Vice President, senior Southern dignitary
    },
    {
      name: "Bell",
      party: "Independent", // Constitutional Union
      year: 1860,
      MAT: 5,   // Pro-business Whig — tariff, planter economics
      CD: 4,    // Conservative — Southern slaveholder, traditional
      CU: 2,    // Assimilationist — Union but no pluralism
      MOR: 2,   // Narrow — avoided moral stance on slavery
      PRO: 5,   // Maximum proceduralist — Constitution above all
      COM: 5,   // Maximum compromiser — avoiding the issue
      ZS: 2,    // Positive-sum
      ONT_H: 2, // Skeptical
      ONT_S: 5, // System fine
      PF: 1,    // Independent
      TRB: 2,   // Low tribal
      ENG: 2,   // Low — ran as calming presence
      EPS: 1,   // Institutionalist - trusted constitutional framework above all
      AES: 0,   // Statesman - elder Whig, dignified, above-the-fray
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1864: Lincoln (R) vs McClellan (D) - Wartime election
// ─────────────────────────────────────────────────────────────────────────────
// Held during the Civil War. Lincoln ran on National Union ticket (R + War Dems).
// By 1864, Emancipation Proclamation issued, war aims expanded from Union to
// abolition. Lincoln was deeply unpopular in summer 1864 before Atlanta fell.
// Lincoln: Now a wartime president. Suspended habeas corpus, Emancipation
// Proclamation, total war strategy. "With malice toward none." Constitutional
// amendment to abolish slavery. Stronger moral position than 1860.
// McClellan: "Young Napoleon." Former Union general fired by Lincoln. Peace
// Democrats nominated him on a platform calling the war a failure. McClellan
// himself repudiated the peace plank but ran as war-weariness candidate.
// Copperhead platform, moderate candidate. Won only 3 states.

const election1864: Election = {
  year: 1864,
  candidates: [
    {
      name: "Lincoln",
      party: "Republican",
      year: 1864,
      MAT: 4,   // Mixed - wartime spending, Homestead Act, but pro-tariff and railroad subsidies
      CD: 1,    // Maximum culturally open - Emancipation Proclamation, abolition amendment
      CU: 5,    // Maximum universalist - "all men are created equal" now includes Black men
      MOR: 5,   // Maximum wide moral circle - abolition, "new birth of freedom"
      PRO: 4,   // Proceduralist - sought constitutional amendment for abolition, but stretched executive power in wartime
      COM: 3,   // Mixed - "with malice toward none" but uncompromising on Union and abolition
      ZS: 2,    // Positive-sum - Union victory benefits all, free labor for all
      ONT_H: 4, // Optimistic - "better angels of our nature," believed in human improvement
      // ONT_S 2→4 (Phase 4, 2026-04-26). Wartime Lincoln was the paradigmatic
      // institution-USING reformer — his entire war effort was institution-
      // preserving, and his reforms (13th Amendment, habeas suspension,
      // emergency war powers) were institutions used hard to save the Union,
      // not signals that institutions can never work. ONT_S 4 (institutional
      // reformer using institutions hard, per rubric) replaces ONT_S 2.
      ONT_S: 4, // Institutional reformer - 13th Amendment via constitutional process, used federal power hard to preserve Union
      PF: 4,    // Strong Republican - ran as "National Union" to broaden coalition
      TRB: 3,   // Moderate tribal - national unity rhetoric, "Union" above faction
      ENG: 5,   // Maximum engagement - wartime president, existential stakes
      EPS: 0,   // Empiricist - lawyer, logical, adapted strategy to evidence
      AES: 5,   // Visionary - Gettysburg Address, "new birth of freedom," transformative
    },
    {
      // McClellan 1864 platform-vs-persona correction (Phase 6, 2026-04-27).
      // Per rubric, "signal" = platform + rhetoric + persona + actions. The
      // prior coding read McClellan exclusively through the Copperhead party
      // platform, but McClellan publicly REPUDIATED the peace plank, ran as
      // a War Democrat, and was a former Union general. His personal signal
      // was moderate-conservative Democrat, not max-extreme on every axis.
      // Softened: MAT 5→4 (not max free-market, conservative-moderate),
      // CD 5→4 (traditional Democrat, not maximum), MOR 1→2 (narrow practiced
      // scope, not klan-tier), PRO 5→4 (institutional general, not max-rules-
      // bound; he stretched the platform-vs-persona line). CU=1 retained
      // (party platform genuinely was states-rights peace).
      name: "McClellan",
      party: "Democratic",
      year: 1864,
      MAT: 4,   // Conservative Democrat, not max-laissez-faire
      CD: 4,    // Traditional Democrat opposing emancipation; not max-restorationist
      CU: 1,    // Maximum assimilationist - states' rights peace platform
      MOR: 2,   // Narrow practiced scope - Civil War Democrat, not klan-tier
      PRO: 4,   // Institutional general - mostly procedural but war Democrat tension with platform
      COM: 4,   // Compromiser - negotiated peace, restore Union through concession
      ZS: 4,    // Zero-sum - war is destroying both sides, stop the bleeding
      ONT_H: 2, // Pessimistic - war is failing, carnage is pointless
      ONT_S: 4, // System was fine - prewar Union should be restored as-was
      PF: 4,    // Strong Democrat - party nominee, but repudiated peace plank
      TRB: 4,   // Tribal - northern Democrats, peace movement, anti-Black-equality
      ENG: 4,   // Engaged - but ran cautious campaign, let party do the work
      EPS: 1,   // Institutionalist - military man, trusted hierarchy and order
      AES: 0,   // Statesman - "Young Napoleon," military prestige, gravitas
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1868: Grant (R) vs Seymour (D) - Reconstruction
// ─────────────────────────────────────────────────────────────────────────────
// First postwar election. Reconstruction in full swing - military occupation of
// South, 14th Amendment, Freedmen's Bureau. KKK violence rising.
// Grant: "Let us have peace." War hero, taciturn, projected strength and
// stability. Supported Radical Reconstruction, Black suffrage, crushing the KKK.
// But not a politician - simple, direct, military authority.
// Seymour: New York governor, reluctant nominee. "White man's government."
// Opposed Reconstruction, Black suffrage, 14th Amendment. Aligned with
// Copperhead/Peace Democrat wing. Ran on racism and states' rights.

const election1868: Election = {
  year: 1868,
  candidates: [
    {
      name: "Grant",
      party: "Republican",
      year: 1868,
      MAT: 4,   // Mixed - supported sound money, pro-business, but also Freedmen's Bureau spending
      CD: 2,    // Culturally open - supported Reconstruction, Black suffrage, anti-KKK
      CU: 4,    // Universalist - equal citizenship regardless of race, 14th Amendment
      MOR: 4,   // Wide moral circle - defended freedmen, crushed KKK, expanded rights
      PRO: 4,   // Proceduralist - military discipline, constitutional amendments, rule of law
      COM: 3,   // Mixed - "let us have peace" but uncompromising on Reconstruction
      ZS: 2,    // Positive-sum - Union victory benefits all, national reconciliation
      ONT_H: 3, // Moderate - military realist, not utopian, but believed in progress
      ONT_S: 3, // Mixed - Reconstruction reforms but didn't seek systemic economic overhaul
      PF: 4,    // Strong Republican - party's hero, Reconstruction champion
      TRB: 3,   // Moderate tribal - national unity appeal, but firmly Republican
      ENG: 4,   // Engaged - but quiet, let reputation speak, not a campaigner
      EPS: 0,   // Empiricist - military pragmatist, evidence and results over theory
      AES: 3,   // Authentic - plain-spoken, simple, honest soldier
    },
    {
      name: "Seymour",
      party: "Democratic",
      year: 1868,
      MAT: 4,   // Pro-planter/merchant - opposed Reconstruction spending, low tariff
      CD: 5,    // Maximum cultural closure - "white man's government," anti-Black suffrage
      CU: 1,    // Maximum particularist - states' rights, opposed 14th Amendment
      MOR: 1,   // Maximum narrow moral circle - white-only citizenship, racial hierarchy
      PRO: 3,   // Mixed - invoked Constitution but selectively, opposed amendments
      COM: 3,   // Mixed - reluctant nominee, tried to moderate but base was extreme
      ZS: 5,    // Maximum zero-sum - racial competition, Black rights = white dispossession
      ONT_H: 1, // Maximum pessimistic - fixed racial hierarchy, Reconstruction is tyranny
      ONT_S: 2, // System broken - Reconstruction is destroying constitutional order
      PF: 4,    // Strong Democrat - party nominee, but reluctant
      TRB: 5,   // Maximum tribal - white racial identity, anti-Reconstruction solidarity
      ENG: 3,   // Moderate engagement - reluctant candidate, lackluster campaign
      EPS: 2,   // Traditionalist - antebellum order was correct, restore it
      AES: 0,   // Statesman - governor, tried for dignified image
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1872: Grant (R) vs Greeley (Liberal R + D fusion)
// ─────────────────────────────────────────────────────────────────────────────
// Grant: Incumbent. Reconstruction continuing, KKK Enforcement Acts, but
// scandals emerging (Credit Mobilier, Whiskey Ring). Still popular war hero.
// Greeley: Editor of New York Tribune. Lifelong eccentric - abolitionist,
// vegetarian, spiritualist, utopian reformer. Liberal Republicans + Democrats
// fused against Grant's corruption and Reconstruction "excess." Wanted
// amnesty for ex-Confederates, civil service reform, lower tariffs.
// Bizarre fusion candidate - died shortly after losing.

const election1872: Election = {
  year: 1872,
  candidates: [
    {
      name: "Grant",
      party: "Republican",
      year: 1872,
      MAT: 4,   // Mixed - sound money, pro-business, but continued Freedmen's Bureau
      CD: 2,    // Culturally open - continued Reconstruction, KKK suppression
      CU: 4,    // Universalist - equal rights enforcement, 15th Amendment
      MOR: 4,   // Wide moral circle - defended Black rights against Klan violence
      PRO: 3,   // Mixed - strong executive, used military force, but constitutional
      COM: 3,   // Mixed - unyielding on Reconstruction but administration was pragmatic
      ZS: 2,    // Positive-sum - national prosperity narrative, stability
      ONT_H: 3, // Moderate - experienced realism, scandals tarnishing idealism
      ONT_S: 4, // System working - Reconstruction is succeeding, stay the course
      PF: 5,    // Maximum partisan - incumbent Republican, party-line Reconstruction
      TRB: 3,   // Moderate tribal - national unity, but firmly identified with freedmen
      ENG: 4,   // Engaged - incumbent seeking reelection
      EPS: 0,   // Empiricist - military results-oriented pragmatist
      AES: 3,   // Authentic - plain soldier, unpretentious, honest reputation (despite scandals)
    },
    {
      name: "Greeley",
      party: "Democratic", // Liberal Republican + Democratic fusion
      year: 1872,
      MAT: 3,   // Mixed - reformer but not redistributionist, lower tariff, civil service
      CD: 2,    // Culturally open - lifelong abolitionist, progressive reformer
      CU: 4,    // Universalist - abolitionist, but now wanted reconciliation with South
      MOR: 4,   // Wide moral circle - abolitionist, humanitarian, utopian reformer
      PRO: 4,   // Proceduralist - civil service reform, anti-corruption, clean government
      COM: 5,   // Maximum compromiser - entire campaign was reconciliation, amnesty for Confederates
      ZS: 2,    // Positive-sum - reconciliation benefits all, end Reconstruction divisions
      ONT_H: 5, // Maximum optimistic - utopian reformer, believed in human perfectibility
      ONT_S: 2, // System needs reform - Grant's corruption proves system broken
      PF: 1,    // Maximum independent - bolted own party, fusion candidate
      TRB: 2,   // Low tribal - explicitly anti-partisan, cross-party appeal
      ENG: 5,   // Maximum engagement - crusading editor, tireless campaigner (died from it)
      EPS: 0,   // Empiricist - journalist, investigative editor, reform through information
      AES: 5,   // Visionary - utopian reformer, reconciliation crusade, eccentric idealist
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1876: Hayes (R) vs Tilden (D) - Contested election
// ─────────────────────────────────────────────────────────────────────────────
// Most disputed election until 2000. Tilden won popular vote but Hayes won EC
// after Compromise of 1877 ended Reconstruction.
// Hayes: Ohio governor, reform Republican, honest. Ran on civil service reform
// and honest government after Grant scandals. Supported Reconstruction in
// principle but quietly willing to end it for the presidency.
// Tilden: New York governor, anti-Tammany reformer, prosecuted Boss Tweed.
// Ran on clean government, ending Reconstruction "corruption," gold standard.
// Won popular vote 50.9% but lost in disputed EC.

const election1876: Election = {
  year: 1876,
  candidates: [
    {
      name: "Hayes",
      party: "Republican",
      year: 1876,
      MAT: 4,   // Push extreme — pro-business, gold standard, high tariff
      CD: 3,    // Moderate Republican reform signal, not a culture-war conservative
      CU: 3,    // Civic-national reformer, with Reconstruction commitment fading
      MOR: 4,   // Campaign signal still leaned toward equal citizenship / reform Republicanism
      PRO: 5,   // Maximum proceduralist
      COM: 5,   // Compromiser
      ZS: 3,    // Mixed
      ONT_H: 3, // Pessimistic — Reconstruction fatigue
      ONT_S: 4, // System mostly sound, needs honest reform rather than overhaul
      PF: 5,    // Strong Republican machine
      TRB: 3,   // Moderate Republican establishment identity
      ENG: 3,   // Moderate — quiet campaign
      EPS: 0,   // Empiricist - lawyer, evidence-based, reform-minded
      AES: 0,   // Statesman - dignified governor, reformer, integrity
    },
    {
      name: "Tilden",
      party: "Democratic",
      year: 1876,
      MAT: 4,   // Pro-business - gold standard, fiscal conservative, anti-spending
      CD: 4,    // Culturally conservative - opposed Reconstruction, states' rights
      CU: 2,    // Particularist - states' rights, end federal "interference" in South
      MOR: 2,   // Narrow moral circle - white Democratic base, anti-Reconstruction
      PRO: 5,   // Maximum proceduralist - prosecuted Tweed, anti-corruption crusader
      COM: 3,   // Mixed - reformer but principled, wouldn't fight stolen election
      ZS: 3,    // Mixed - anti-corruption but not expansive positive-sum vision
      ONT_H: 2, // Skeptical - lawyer's caution, feared concentrated power
      ONT_S: 3, // Mixed - system corrupted by Grant/Reconstruction, needs reform
      PF: 4,    // Strong Democrat - party nominee, reformist wing
      TRB: 4,   // Tribal - white Democratic coalition, anti-Reconstruction solidarity
      ENG: 4,   // Engaged - but accepted stolen election gracefully
      EPS: 0,   // Empiricist - lawyer, prosecutor, evidence-based reform
      AES: 1,   // Technocrat - reform manager, prosecutorial efficiency
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1880: Garfield (R) vs Hancock (D)
// ─────────────────────────────────────────────────────────────────────────────
// Post-Reconstruction. "Stalwart vs Half-Breed" Republican split. Tariff and
// civil service were main issues. Razor-thin popular vote margin.
// Garfield: Ohio congressman, former Union general, self-made man (canal boy
// to president). Half-Breed Republican - supported civil service reform.
// Classical scholar, skilled orator. Moderate on everything.
// Hancock: Union general, hero of Gettysburg. "Hancock the Superb." Apolitical
// military figure, chosen to distance Democrats from Copperhead image. Called
// tariff "a local question" - gaffe that showed he wasn't a politician.

const election1880: Election = {
  year: 1880,
  candidates: [
    {
      name: "Garfield",
      party: "Republican",
      year: 1880,
      MAT: 4,   // Pro-business - high tariff, sound money, industrial development
      CD: 3,    // Moderate culturally - supported Black rights but Reconstruction fading
      CU: 3,    // Mixed - nationalist, pro-tariff protectionism, but equal citizenship
      MOR: 3,   // Center - nominally supported Black rights but not crusading
      PRO: 5,   // Maximum proceduralist - civil service reform, institutional integrity
      COM: 4,   // Compromiser - bridged Stalwart and Half-Breed factions, Chester Arthur as VP
      ZS: 2,    // Positive-sum - industrial growth benefits all, national development
      ONT_H: 4, // Optimistic - self-made man, upward mobility, American dream
      ONT_S: 4, // System working - system just needs honest men in charge (civil service reform)
      PF: 4,    // Strong Republican - party nominee, loyal partisan
      TRB: 3,   // Moderate tribal - national Republican identity, not sectional
      ENG: 4,   // Engaged - skilled campaigner, front-porch campaign
      EPS: 0,   // Empiricist - scholar, intellectual, evidence-based
      AES: 0,   // Statesman - classical orator, gravitas, self-made dignity
    },
    {
      // Hancock 1880 — "push extreme" loser-coding artifact corrected (Phase 4,
      // 2026-04-26). Per user direction, "push extreme" overrides candidate
      // signal and the rubric overrides "push extreme." Hancock was an
      // apolitical Democratic war hero who deliberately avoided issues; the
      // max-redistributive max-progressive max-universalist max-wide-MOR
      // coding was rubric-incompatible. MAT 1→4 (Democratic low-tariff but
      // not redistributive), CD 1→3 (apolitical, not progressive), CU 5→3
      // (not pluralist), MOR 5→3 (no wide-moral-circle stance taken).
      name: "Hancock",
      party: "Democratic",
      year: 1880,
      MAT: 4,   // Democratic low-tariff/agrarian property, not redistributive
      CD: 3,    // Apolitical war hero, no progressive cultural stance
      CU: 3,    // No pluralist commitment - civic-Democratic centrist
      MOR: 3,   // No wide-circle stance - civic-national, "the Superb" persona
      PRO: 3,   // Mixed
      COM: 4,   // Compromiser
      ZS: 3,    // Mixed
      ONT_H: 3, // Moderate
      ONT_S: 3, // Mixed
      PF: 5,    // Maximum partisan — Democrat machine
      TRB: 4,   // Tribal
      ENG: 3,   // Moderate
      EPS: 1,   // Institutionalist - military hierarchy, institutional framework
      AES: 0,   // Statesman - "Hancock the Superb," military prestige
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1884: Cleveland (D) vs Blaine (R) - Mugwumps
// ─────────────────────────────────────────────────────────────────────────────
// Cleveland: "Grover the Good." Reform governor of New York, honest, anti-Tammany.
// "Public office is a public trust." Gold standard, low tariff, vetoed pension
// fraud. Scandal: acknowledged illegitimate child ("Ma, Ma, where's my Pa?").
// First Democratic president since Buchanan (1856).
// Blaine: "Plumed Knight" or "Continental Liar from the State of Maine."
// Charismatic but corrupt - Mulligan letters scandal. Lost Mugwump Republicans
// who defected to Cleveland over corruption. "Rum, Romanism, and Rebellion"
// gaffe cost him Catholic vote in NY.

const election1884: Election = {
  year: 1884,
  candidates: [
    {
      name: "Cleveland",
      party: "Democratic",
      year: 1884,
      MAT: 4,   // Pro-business - gold standard, vetoed spending, fiscal conservative
      CD: 3,    // Culturally moderate - honest reformer, not culture warrior
      CU: 3,    // Mixed - not ideological on this axis, pragmatic
      MOR: 3,   // Center - owned personal scandal honestly, "tell the truth"
      PRO: 5,   // Maximum proceduralist - "public office is a public trust," vetoed pension fraud
      COM: 3,   // Mixed - principled reformer, not a dealmaker
      ZS: 2,    // Positive-sum - clean government benefits all citizens
      ONT_H: 3, // Moderate - realistic about human nature, hence need for good government
      ONT_S: 4, // System fine - just needs honest men, reform not revolution
      PF: 3,    // Moderate partisan - Democrats nominated him, but Mugwumps (R defectors) supported him
      TRB: 2,   // Low tribal - reform appeal transcended party, anti-machine
      ENG: 4,   // Engaged - but projected competence, not passion
      EPS: 0,   // Empiricist - lawyer, evidence-based, practical reform
      AES: 3,   // Authentic - owned scandal, "tell the truth," plain-spoken integrity
    },
    {
      name: "Blaine",
      party: "Republican",
      year: 1884,
      MAT: 4,   // Pro-business - high tariff champion, industrial development
      CD: 3,    // Moderate culturally - but alienated Catholics with "Rum, Romanism" gaffe
      CU: 3,    // Mixed - protectionist but Pan-American outreach
      MOR: 3,   // Center - charismatic but personally corrupt
      PRO: 2,   // Anti-proceduralist - corrupt, Mulligan letters, patronage politician
      COM: 4,   // Compromiser - master politician, coalition builder
      ZS: 3,    // Mixed - competitive protectionism but growth-oriented
      ONT_H: 3, // Moderate - politician's optimism tempered by cynicism
      ONT_S: 4, // System fine - just needs Republican management
      PF: 5,    // Maximum partisan - "Plumed Knight" of the party, stalwart Republican
      TRB: 4,   // High tribal - Protestant Republican identity, partisan warrior
      ENG: 5,   // Maximum engagement - charismatic, tireless campaigner
      EPS: 3,   // Intuitionist - gut politician, instinctive, charismatic appeal
      AES: 4,   // Fighter - "Plumed Knight," combative, charismatic warrior
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// 1888: Harrison (R) vs Cleveland (D) - Tariff election
// ─────────────────────────────────────────────────────────────────────────────
// Cleveland: Incumbent. Devoted his entire 1887 State of the Union to tariff
// reduction. "Unnecessary taxation is unjust taxation." Won popular vote
// (48.6%) but lost EC. Honest, stubborn, boring.
// Harrison: "Little Ben" - grandson of President William Henry Harrison.
// Indiana senator, Union veteran, high-tariff champion. Ran a classic
// front-porch campaign. Protected manufacturers, pension increases for
// veterans. Won through superior organization and swing-state purchases.

const election1888: Election = {
  year: 1888,
  candidates: [
    {
      name: "Harrison",
      party: "Republican",
      year: 1888,
      MAT: 5,   // Maximum free-market/pro-business - maximum tariff protection for industry
      CD: 3,    // Moderate culturally - not a culture warrior, Presbyterian dignity
      CU: 2,    // Particularist - protectionist, "America first" economics
      MOR: 3,   // Center - supported Black voting rights rhetorically, pension generosity
      PRO: 4,   // Proceduralist - lawyer, institutional, respected constitutional process
      COM: 3,   // Mixed - principled on tariff but pragmatic party operator
      ZS: 3,    // Mixed - protectionism implies competition, but prosperity rhetoric
      ONT_H: 3, // Moderate - conservative temperament
      ONT_S: 4, // System fine - protect American industry, system works
      PF: 5,    // Maximum partisan - party machine candidate, organization man
      TRB: 3,   // Moderate tribal - Republican veteran identity, not populist
      ENG: 3,   // Moderate engagement - front-porch campaign, not dynamic
      EPS: 1,   // Institutionalist - lawyer, senator, institutional man
      AES: 0,   // Statesman - dignified, reserved, presidential grandson
    },
    {
      name: "Cleveland",
      party: "Democratic",
      year: 1888,
      MAT: 4,   // Pro-business - gold standard, but lower tariff (tariff = tax on consumers)
      CD: 3,    // Moderate - same reformer, not culture warrior
      CU: 3,    // Mixed - pragmatic, but tariff reduction opened to international trade
      MOR: 3,   // Center - honest governance, not moral crusader
      PRO: 5,   // Maximum proceduralist - same "public trust" integrity, vetoed pension fraud
      COM: 2,   // Low compromise - stubbornly devoted 1887 message entirely to tariff
      ZS: 2,    // Positive-sum - lower tariff benefits consumers and economy overall
      ONT_H: 3, // Moderate - realistic, practical
      ONT_S: 4, // System fine - just reduce unnecessary taxation
      PF: 4,    // Strong Democrat - incumbent running for reelection
      TRB: 2,   // Low tribal - reform transcended faction, anti-machine
      ENG: 3,   // Moderate engagement - honest but boring, not a dynamic campaigner
      EPS: 0,   // Empiricist - evidence-based tariff argument, economist's logic
      AES: 1,   // Technocrat - devoted State of Union to policy substance, wonkish
    },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// Export all elections
// ─────────────────────────────────────────────────────────────────────────────
export const ELECTIONS_1856_1888: Election[] = [
  election1856,
  election1860,
  election1864,
  election1868,
  election1872,
  election1876,
  election1880,
  election1884,
  election1888,
];

// ─────────────────────────────────────────────────────────────────────────────
// ACTUAL_RESULTS block - paste into simulate.ts ACTUAL_RESULTS object
// ─────────────────────────────────────────────────────────────────────────────
//
// 1856: { winner: "Buchanan", winnerPct: 45.3, loserPct: 33.1 }, // Fillmore 21.6%
// 1860: { winner: "Lincoln", winnerPct: 39.8, loserPct: 29.5 }, // Douglas 29.5%, Breckinridge 18.1%, Bell 12.6%
// 1864: { winner: "Lincoln", winnerPct: 55.0, loserPct: 45.0 },
// 1868: { winner: "Grant", winnerPct: 52.7, loserPct: 47.3 },
// 1872: { winner: "Grant", winnerPct: 55.6, loserPct: 43.8 },
// 1876: { winner: "Tilden", winnerPct: 50.9, loserPct: 47.9 }, // Tilden won popular but Hayes won EC
// 1880: { winner: "Garfield", winnerPct: 48.3, loserPct: 48.2 }, // razor-thin margin
// 1884: { winner: "Cleveland", winnerPct: 48.9, loserPct: 48.3 },
// 1888: { winner: "Cleveland", winnerPct: 48.6, loserPct: 47.8 }, // Cleveland won popular but Harrison won EC
//
