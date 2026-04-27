// ─────────────────────────────────────────────────────────────────────────────
// 1789: Washington (unopposed)
// ─────────────────────────────────────────────────────────────────────────────
const election1789 = {
    year: 1789,
    candidates: [
        {
            name: "Washington",
            party: "Independent",
            year: 1789,
            MAT: 3, // Centrist - planter aristocrat but supported Hamilton's program
            CD: 3, // Culturally moderate - Enlightenment values
            CU: 3, // Mixed - national unity focus
            MOR: 4, // Wide moral circle - "all men" rhetoric (limited in practice)
            PRO: 5, // Maximum proceduralist - Constitution, precedent-setting
            COM: 5, // Maximum compromiser - held factions together
            ZS: 2, // Positive-sum - new nation optimism
            ONT_H: 4, // Optimistic - republic experiment
            ONT_S: 4, // System new and working - he's building it
            PF: 1, // Maximum independent - warned against factions
            TRB: 1, // No tribal - national father figure
            ENG: 5, // Maximum - accepted the call
            EPS: 1, // Institutionalist - building institutions
            AES: 0, // Statesman - Cincinnatus
        },
    ],
};
// 1792: Washington (unopposed)
const election1792 = {
    year: 1792,
    candidates: [
        {
            name: "Washington",
            party: "Independent",
            year: 1792,
            MAT: 3, CD: 3, CU: 3, MOR: 4, PRO: 5, COM: 5,
            ZS: 2, ONT_H: 4, ONT_S: 4, PF: 1, TRB: 1, ENG: 4,
            EPS: 1, AES: 0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1796: Adams vs Jefferson
// ─────────────────────────────────────────────────────────────────────────────
const election1796 = {
    year: 1796,
    candidates: [
        {
            name: "Adams",
            party: "Federalist",
            year: 1796,
            MAT: 4, // Pro-commerce, pro-tariff
            CD: 4, // Culturally conservative - Puritan New England values
            CU: 3, // Mixed - British alliance but national focus
            MOR: 3, // Moderate moral circle
            PRO: 5, // Maximum proceduralist - rule of law, Constitution
            COM: 3, // Mixed - principled but stubborn
            ZS: 3, // Mixed - worried about French threat
            ONT_H: 2, // Pessimistic - distrusted popular passions
            ONT_S: 4, // System working - defend it from demagogues
            PF: 4, // Strong Federalist
            TRB: 3, // Moderate - New England identity
            ENG: 4, // Engaged
            EPS: 1, // Institutionalist - government as stabilizer
            AES: 0, // Statesman - gravitas, learning
        },
        {
            name: "Jefferson",
            party: "Democratic-Republican",
            year: 1796,
            // Recalibrated 2026-04-26: previous encoding (MAT=2, MOR=4, CU=4)
            // misrepresented Jefferson by reading him through modern progressive
            // optics. Historical reality: anti-federal-tax, anti-bank, agrarian-
            // property-protective slaveholder whose universalism was for free white
            // men only. MAT 2→4 (anti-redistribution, market-favoring of agrarian
            // property), MOR 4→2 (slavery contradicts wide moral circle), CU 4→2
            // (assimilationist white-settler expansion, not pluralism).
            MAT: 4, // Anti-federal-tax, anti-Hamilton's bank, pro-agrarian-property
            CD: 2, // Enlightenment progressive (religious tolerance) for whites
            CU: 2, // Assimilationist on white-settler expansion (not universalist)
            MOR: 2, // Narrow circle: held 600+ slaves, Indian Removal sympathizer
            PRO: 2, // Anti-federal power - states' rights skeptic
            COM: 2, // Low compromise - partisan opposition
            ZS: 3, // Mixed
            ONT_H: 4, // Optimistic about Enlightenment-rational free white men
            ONT_S: 2, // Anti-Federalist - ideological institutional skeptic
            PF: 5, // Maximum D-R partisan
            TRB: 4, // Factional - planter/agrarian identity
            ENG: 4, // Engaged
            EPS: 0, // Empiricist
            AES: 5, // Visionary
        },
    ],
};
// 1800: Jefferson vs Adams (Revolution of 1800)
const election1800 = {
    year: 1800,
    candidates: [
        {
            name: "Jefferson",
            party: "Democratic-Republican",
            year: 1800,
            // Recalibrated 2026-04-26: previous encoding read MAT=1 (maximum
            // redistributive) for an anti-Hamilton position that was actually
            // anti-federal-taxation and pro-agrarian-property. CU=5 and MOR=5
            // ignored that Jefferson's "rights of man" was rhetorical universalism
            // while he held hundreds of enslaved people. MAT 1→4, CU 5→2, MOR 5→2.
            MAT: 4, // Anti-Hamilton ≠ pro-redistribution; pro-agrarian-property
            CD: 1, // Religious tolerance / Enlightenment-progressive (for whites)
            CU: 2, // Assimilationist white-settler expansion (Louisiana Purchase)
            MOR: 2, // Slaveholder; rhetorical universalism, narrow practiced scope
            PRO: 2, // Anti-proceduralist - opposed Alien & Sedition Acts
            COM: 2, // Low compromise - revolutionary rhetoric
            ZS: 2, // Positive-sum yeoman vision
            ONT_H: 5, // Maximum optimistic about Enlightenment-rational free whites
            ONT_S: 2, // Anti-Federalist institutional skeptic
            PF: 5, // Maximum partisan - built party machine
            TRB: 4, // High tribal - yeoman farmer vs. merchant class
            ENG: 5, // Maximum engagement
            EPS: 0, // Empiricist
            AES: 5, // Visionary
        },
        {
            name: "Adams",
            party: "Federalist",
            year: 1800,
            MAT: 5, // Maximum pro-commerce - Hamilton's system
            CD: 5, // Maximum cultural conservatism - Alien & Sedition Acts
            CU: 1, // Maximum closed - nativist legislation
            MOR: 1, // Narrow moral circle - elite governance
            PRO: 5, // Maximum proceduralist
            COM: 2, // Low compromise - stubborn
            ZS: 4, // Zero-sum - French threat, partisan enemies
            ONT_H: 1, // Maximum pessimistic - distrusted the mob
            ONT_S: 5, // System working - defend it
            PF: 5, // Maximum Federalist
            TRB: 4, // High tribal - Federalist establishment
            ENG: 4, // Engaged but aloof
            EPS: 1, // Institutionalist
            AES: 0, // Statesman
        },
    ],
};
// 1804: Jefferson vs C.C. Pinckney
const election1804 = {
    year: 1804,
    candidates: [
        {
            name: "Jefferson",
            party: "Democratic-Republican",
            year: 1804,
            // Recalibrated 2026-04-26: previous encoding (MAT=2, MOR=4, CU=4,
            // ONT_S=4) created a major calibration anomaly — Jefferson 1804 base
            // distance to a modern progressive (0.495) was lower than FDR's (0.613),
            // matching slave-owning anti-federal Jefferson closer than New Deal
            // architect FDR. MAT 2→4, MOR 4→2, CU 4→2, ONT_S 4→2 corrects this.
            // ONT_S 1804 spike to 4 conflated his presidential actions (Louisiana
            // Purchase required executive action) with his ideology (states-rights
            // anti-Federalist). His core belief remained anti-strong-government.
            MAT: 4, CD: 2, CU: 2, MOR: 2, PRO: 3, COM: 3,
            ZS: 2, ONT_H: 4, ONT_S: 2, PF: 4, TRB: 3, ENG: 5,
            EPS: 0, AES: 5,
        },
        {
            name: "Pinckney",
            party: "Federalist",
            year: 1804,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 3,
            ZS: 4, ONT_H: 2, ONT_S: 5, PF: 4, TRB: 4, ENG: 3,
            EPS: 1, AES: 0,
        },
    ],
};
// 1808: Madison vs C.C. Pinckney
const election1808 = {
    year: 1808,
    candidates: [
        {
            // Madison 1808 Pattern B + Jeffersonian-agrarian recalibration (2026-04-26
            // Phase 4). Madison held ~100 enslaved people; the prior MOR 4 / CU 4
            // overread his rhetorical universalism for practiced moral scope. MAT 2→4
            // (Jeffersonian agrarian-property, anti-Hamilton, not redistributive),
            // CU 4→2 (assimilationist white-settler), MOR 4→2 (slaveholder).
            name: "Madison",
            party: "Democratic-Republican",
            year: 1808,
            MAT: 4, // Anti-Hamilton agrarian-property (per Jeffersonian-agrarian rubric)
            CD: 2, // Culturally open
            CU: 2, // Assimilationist white-settler expansion (Pattern B)
            MOR: 2, // Slaveholder - narrow practiced scope, not rhetorical universalism (Pattern B)
            PRO: 5, // Maximum proceduralist - Father of the Constitution
            COM: 4, // Compromiser - Great Compromiser at Convention
            ZS: 2, // Positive-sum
            ONT_H: 4, // Optimistic
            ONT_S: 4, // System working - he designed it
            PF: 4, // Strong D-R
            TRB: 2, // Low tribal - intellectual
            ENG: 4, // Engaged
            EPS: 0, // Empiricist - political theorist
            AES: 1, // Technocrat - policy wonk of his era
        },
        {
            name: "Pinckney",
            party: "Federalist",
            year: 1808,
            MAT: 5, CD: 5, CU: 1, MOR: 2, PRO: 5, COM: 3,
            ZS: 4, ONT_H: 2, ONT_S: 5, PF: 4, TRB: 4, ENG: 3,
            EPS: 1, AES: 0,
        },
    ],
};
// 1812: Madison vs DeWitt Clinton
const election1812 = {
    year: 1812,
    candidates: [
        {
            // Madison 1812 — same Pattern B as 1808 (slaveholder; rhetorical
            // universalism overread). MAT 2→4, CU 4→2, MOR 4→2. Plus Madison-drift
            // caveat applied: as wartime president (War of 1812) using federal +
            // military institutions hard, ONT_S drifts up from 3→4.
            name: "Madison",
            party: "Democratic-Republican",
            year: 1812,
            MAT: 4, CD: 2, CU: 2, MOR: 2, PRO: 4, COM: 3,
            ZS: 3, ONT_H: 3, ONT_S: 4, PF: 4, TRB: 3, ENG: 5,
            EPS: 0, AES: 0,
        },
        {
            name: "Clinton",
            party: "Federalist",
            year: 1812,
            MAT: 4, CD: 4, CU: 2, MOR: 2, PRO: 5, COM: 4,
            ZS: 3, ONT_H: 3, ONT_S: 4, PF: 3, TRB: 3, ENG: 4,
            EPS: 1, AES: 1,
        },
    ],
};
// 1816: Monroe vs Rufus King
const election1816 = {
    year: 1816,
    candidates: [
        {
            // Monroe 1816 — same Pattern B as Madison. Held ~250 enslaved people.
            // MAT 2→4 (Jeffersonian agrarian-property), CU 4→2 (assimilationist),
            // MOR 4→2 (slaveholder; rhetorical-universalism overread). ONT_S 5
            // already correct by Madison/Monroe-drift caveat (Monroe Doctrine,
            // internal improvements via federal institutions).
            name: "Monroe",
            party: "Democratic-Republican",
            year: 1816,
            MAT: 4, CD: 2, CU: 2, MOR: 2, PRO: 4, COM: 5,
            ZS: 1, ONT_H: 5, ONT_S: 5, PF: 3, TRB: 2, ENG: 4,
            EPS: 1, AES: 0,
        },
        {
            name: "King",
            party: "Federalist",
            year: 1816,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 3,
            ZS: 4, ONT_H: 2, ONT_S: 4, PF: 4, TRB: 4, ENG: 3,
            EPS: 1, AES: 0,
        },
    ],
};
// 1820: Monroe (unopposed - Era of Good Feelings)
const election1820 = {
    year: 1820,
    candidates: [
        {
            // Monroe 1820 — same Pattern B. Even Era of Good Feelings Monroe was a
            // slaveholder. MAT 3→4 (Jeffersonian agrarian), CU 4→2 (assimilationist),
            // MOR 4→2. ENG 3 retained — defensible for unopposed reluctant-style
            // election.
            name: "Monroe",
            party: "Democratic-Republican",
            year: 1820,
            MAT: 4, CD: 3, CU: 2, MOR: 2, PRO: 4, COM: 5,
            ZS: 1, ONT_H: 5, ONT_S: 5, PF: 2, TRB: 1, ENG: 3,
            EPS: 1, AES: 0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1824: Adams vs Jackson vs Crawford vs Clay (4-way)
// ─────────────────────────────────────────────────────────────────────────────
const election1824 = {
    year: 1824,
    candidates: [
        {
            name: "Adams",
            party: "Democratic-Republican",
            year: 1824,
            MAT: 4, // Developmentalist - tariffs/internal improvements, not laissez-faire maximalism
            CD: 3, // Moderate-conservative elite - Puritan gravitas without culture-war closure
            CU: 3, // National-development project; neither mosaic pluralist nor closed nativist
            MOR: 4, // Broad civic-national moral language, especially in later anti-slavery career
            PRO: 5, // Maximum proceduralist - institutional
            COM: 4, // Compromiser - corrupt bargain
            ZS: 2, // Positive-sum
            ONT_H: 2, // Pessimistic - distrusted popular passions
            ONT_S: 5, // System working - defend from demagogues
            PF: 4, // Strong establishment
            TRB: 2, // Low tribal
            ENG: 4, // Engaged
            EPS: 1, // Institutionalist
            AES: 1, // Technocrat
        },
        {
            name: "Jackson",
            party: "Democratic-Republican",
            year: 1824,
            MAT: 4, // Anti-bank populist, but not modern redistributionist; hard-money/agrarian
            CD: 4, // Traditional frontier values - expansion, slavery-tolerant, anti-establishment
            CU: 1, // Particularist - Jacksonian democracy was white-male-centric, Indian Removal
            MOR: 1, // Very narrow moral circle - "common (white) man," Native removal, slavery tolerance
            PRO: 2, // Anti-procedural - military hero, direct action
            COM: 1, // Maximum uncompromising - "corrupt bargain" rhetoric, vendetta politics
            ZS: 4, // Zero-sum "enemies of the people" populist framing
            ONT_H: 2, // Pessimistic about elite motives, rigged institutions
            ONT_S: 2, // System needs reform - elites rigged it
            PF: 3, // Building a new party
            TRB: 4, // Tribal - common man identity
            ENG: 5, // Maximum engagement
            EPS: 3, // Intuitionist - gut instinct
            AES: 4, // Fighter - Old Hickory
        },
        {
            name: "Crawford",
            party: "Democratic-Republican",
            year: 1824,
            // Recoded 2026-04-23: previous all-1s-and-5s coding (avg dist 2.291) was
            // over-extreme for a conventional Jeffersonian Democratic-Republican.
            MAT: 4, CD: 4, CU: 2, MOR: 2, PRO: 4, COM: 3,
            ZS: 3, ONT_H: 2, ONT_S: 4, PF: 4, TRB: 3, ENG: 3,
            EPS: 1, AES: 0,
        },
        {
            name: "Clay",
            party: "Democratic-Republican",
            year: 1824,
            MAT: 4, // American System - tariffs and internal improvements, not pure free-market
            CD: 3, // Establishment conservative but not maximum cultural closure
            CU: 3, // National-development civic project
            MOR: 3, // Centrist moral frame; compromise politics, not universalist crusade
            PRO: 5, // Maximum proceduralist
            COM: 5, // Maximum compromiser
            ZS: 2, // Positive-sum
            ONT_H: 3, // Moderate
            ONT_S: 5, // System working
            PF: 4, // Strong establishment
            TRB: 2, // Low tribal
            ENG: 5, // Maximum
            EPS: 1, // Institutionalist
            AES: 0, // Statesman
        },
    ],
};
// 1828: Jackson (D) vs Adams (NR)
const election1828 = {
    year: 1828,
    candidates: [
        {
            name: "Jackson",
            party: "Democratic",
            year: 1828,
            // Recoded 2026-04-23: previous coding (CD=3, CU=3, MOR=3, ZS=3, ONT_H=3)
            // placed Jackson near the archetype centroid, making him universally
            // "close" to all archetypes. Jacksonian populism was sharply particularist
            // and zero-sum; recoded to match the actual platform.
            MAT: 4, CD: 4, CU: 1, MOR: 1, PRO: 2, COM: 1,
            ZS: 4, ONT_H: 2, ONT_S: 2, PF: 4, TRB: 4, ENG: 5,
            EPS: 3, AES: 4,
        },
        {
            name: "Adams",
            party: "National Republican",
            year: 1828,
            MAT: 4, CD: 3, CU: 3, MOR: 4, PRO: 5, COM: 3,
            ZS: 3, ONT_H: 2, ONT_S: 5, PF: 4, TRB: 2, ENG: 3,
            EPS: 1, AES: 1,
        },
    ],
};
// 1832: Jackson (D) vs Clay (NR/Whig)
const election1832 = {
    year: 1832,
    candidates: [
        {
            name: "Jackson",
            party: "Democratic",
            year: 1832,
            MAT: 4, // Bank War anti-elite populism, but not modern redistributionism
            // Recoded 2026-04-23 — see Jackson 1828 note. Sharper particularism +
            // zero-sum framing for Bank War re-election.
            CD: 4, CU: 1, MOR: 1, PRO: 2, COM: 1,
            ZS: 4, ONT_H: 2, ONT_S: 2, PF: 4, TRB: 4, ENG: 5,
            EPS: 3, AES: 4,
        },
        {
            name: "Clay",
            party: "National Republican",
            year: 1832,
            // ADR-010 (2026-04-26): ONT_H 2 → 4. Clay was an arch-Hamiltonian
            // institutionalist who believed genteel education, law, and institutions
            // CULTIVATE human character. Under malleability framing he is high
            // ONT_H, not low. Old "pessimistic about humans" reading inverted his
            // actual Burkean-cultivation worldview.
            MAT: 4, CD: 3, CU: 3, MOR: 3, PRO: 5, COM: 5,
            ZS: 2, ONT_H: 4, ONT_S: 5, PF: 5, TRB: 2, ENG: 5,
            EPS: 1, AES: 0,
        },
        {
            // William Wirt - Anti-Masonic Party (7.8%)
            // First significant third-party candidate. Former Attorney General.
            // Anti-Masonic movement opposed secret societies as anti-democratic.
            // Irony: Wirt himself was a former Mason. Party was really anti-Jackson.
            name: "Wirt",
            party: "Independent",
            year: 1832,
            MAT: 3, // Centrist economics - not the issue
            CD: 4, // Culturally conservative - religious moralism, anti-secret-society
            CU: 2, // Particularist - focused on American civic institutions
            MOR: 4, // Wide moral circle - democratic transparency for all citizens
            PRO: 5, // Maximum proceduralist - transparency, rule of law, anti-corruption
            COM: 3, // Mixed
            ZS: 3, // Mixed
            ONT_H: 3, // Moderate
            ONT_S: 2, // System corrupted by secret societies but reformable
            PF: 1, // Anti-partisan - new third party against establishment
            TRB: 3, // Moderate tribal - civic reformers
            ENG: 4, // Engaged reform movement
            EPS: 1, // Institutionalist - fix corrupted institutions
            AES: 0, // Statesman - former Attorney General
        },
    ],
};
// 1836: Van Buren (D) vs Harrison (Whig)
const election1836 = {
    year: 1836,
    candidates: [
        {
            name: "Van Buren",
            party: "Democratic",
            year: 1836,
            // Recoded 2026-04-23: previous coding had VB at near-centroid (avg dist
            // 1.44, lowest of any candidate in the bank). Sharpened the coalitional
            // axes to reflect Jacksonian Democratic coalition, not "moderate on
            // everything."
            MAT: 2, // Redistributive — labor friendly, Jacksonian heir
            CD: 3, // Moderate
            CU: 2, // Assimilationist — Democratic coalition was particularist
            MOR: 2, // Narrow moral circle — coalition didn't emphasize universal rights
            PRO: 3, // Mixed — machine politician but competent
            COM: 4, // Compromiser — "Little Magician"
            ZS: 3, // Mixed — Jacksonian optimism
            ONT_H: 3, // Moderate
            ONT_S: 3, // Mixed — system working but challenges
            PF: 5, // Maximum partisan — literally built the Democratic Party
            TRB: 4, // Strong Northern Democratic partisan identity
            ENG: 5, // Maximum
            EPS: 1, // Institutionalist - party builder
            AES: 1, // Technocrat - operator/fixer
        },
        {
            name: "Harrison",
            party: "Whig",
            year: 1836,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 4,
            ZS: 3, ONT_H: 3, ONT_S: 3, PF: 2, TRB: 2, ENG: 3,
            EPS: 2, AES: 3,
        },
    ],
};
// 1840: Harrison (Whig) vs Van Buren (D) - "Tippecanoe and Tyler Too"
const election1840 = {
    year: 1840,
    candidates: [
        {
            name: "Harrison",
            party: "Whig",
            year: 1840,
            MAT: 4, // Pro-market - Whig economics
            CD: 4, // Culturally conservative
            CU: 2, // Assimilationist
            MOR: 2, // Narrow moral circle
            PRO: 4, // Proceduralist - Whig constitutionalism
            COM: 4, // Compromiser
            ZS: 2, // Positive-sum - prosperity message
            ONT_H: 3, // Moderate
            ONT_S: 2, // System needs change - Depression of 1837 blamed on Van Buren
            PF: 4, // Strong Whig
            TRB: 4, // High tribal - "log cabin and hard cider" populism
            ENG: 5, // Maximum - massive campaign
            EPS: 3, // Intuitionist - ran on image not policy
            AES: 3, // Authentic - "log cabin" common man image
        },
        {
            name: "Van Buren",
            party: "Democratic",
            year: 1840,
            // Recoded 2026-04-23: previous coding was deeply miscalibrated —
            // every axis pushed to extremes with comments like "blamed for depression"
            // (a non-ideological factor, not a position change). Reset to match his
            // 1836 profile with minor adjustments reflecting recession-era pressure.
            MAT: 2, // Same Jacksonian heir position — sub-treasury hard-money
            CD: 3, // Moderate — unchanged from 1836
            CU: 2, // Assimilationist — same Democratic coalition
            MOR: 2, // Narrow moral circle — unchanged
            PRO: 3, // Mixed
            COM: 3, // Less compromising under recession pressure, defending sub-treasury
            ZS: 3, // Mixed
            ONT_H: 2, // Pessimistic under Panic of 1837 pressure
            ONT_S: 3, // Defending the system (incumbent)
            PF: 5, TRB: 4, ENG: 5,
            EPS: 1, AES: 1,
        },
    ],
};
// 1844: Polk (D) vs Clay (Whig)
const election1844 = {
    year: 1844,
    candidates: [
        {
            name: "Polk",
            party: "Democratic",
            year: 1844,
            // Recoded 2026-04-23: previous coding placed Polk at avg dist 1.445
            // (near-centroid). Dark-horse Southern expansionist — sharper on MAT
            // (anti-tariff populist), MOR (particularist expansion), TRB.
            MAT: 2, // Anti-tariff Jacksonian, Walker Tariff — mild redistributionist
            CD: 3, // Moderate
            CU: 2, // Particularist expansionism — Manifest Destiny
            MOR: 2, // Narrow moral circle — expansion at Mexican/Native expense
            PRO: 3, // Mixed
            COM: 3, // Mixed - pragmatic
            ZS: 3, // Zero-sum territorial expansion vs Mexico
            ONT_H: 3, // Moderate
            ONT_S: 2, // Expansion mandate to reshape the map
            PF: 4, // Strong Democrat
            TRB: 4, // Southern Democratic partisan
            ENG: 5, // Maximum - energized dark horse
            EPS: 3, // Intuitionist
            AES: 4, // Fighter - aggressive expansionist
        },
        {
            name: "Clay",
            party: "Whig",
            year: 1844,
            // Recoded 2026-04-23: previous coding was all 1s and 5s (avg dist 2.462).
            // Clay was a mainstream Whig leader, not maximally extreme. Softened.
            MAT: 4, CD: 4, CU: 2, MOR: 2, PRO: 4, COM: 4,
            ZS: 2, ONT_H: 3, ONT_S: 4, PF: 4, TRB: 2, ENG: 5,
            EPS: 1, AES: 0,
        },
    ],
};
// 1848: Taylor (Whig) vs Cass (D) vs Van Buren (Free Soil)
const election1848 = {
    year: 1848,
    candidates: [
        {
            name: "Taylor",
            party: "Whig",
            year: 1848,
            MAT: 4, // Pro-market Whig
            CD: 4, // Culturally conservative - slaveholder, military
            CU: 2, // Assimilationist - national unity
            MOR: 2, // Narrow - slaveholder
            PRO: 3, // Mixed - military man, above politics
            COM: 4, // Compromiser - "no party" stance
            ZS: 3, // Mixed
            ONT_H: 3, // Moderate
            ONT_S: 4, // System fine - just needs steady hand
            PF: 1, // Maximum independent - "I am a Whig but not an ultra Whig"
            TRB: 3, // Moderate - military hero identity
            ENG: 3, // Moderate - reluctant candidate
            EPS: 3, // Intuitionist - military man
            AES: 0, // Statesman - war hero
        },
        {
            // Cass full-row recalibration (Phase 1 of audit, 2026-04-26).
            // Prior encoding read him as max-redistributive max-universalist anti-institutional;
            // that's wrong on every count. Cass was a Jacksonian institutionalist (Pattern A
            // correction: PRO 1→4, ONT_S 2→3) whose "popular sovereignty" doctrine was a
            // slavery-accommodating compromise, not a universalist moral stance (Pattern B
            // correction: CU 5→2, MOR 5→2). MAT 1→3 (hard-money Jacksonian, not redistributive),
            // CD 1→4 (anti-abolition, culturally traditional), COM 2→4 (popular sovereignty WAS
            // the compromise position).
            name: "Cass",
            party: "Democratic",
            year: 1848,
            MAT: 3, CD: 4, CU: 2, MOR: 2, PRO: 4, COM: 4,
            ZS: 3, ONT_H: 3, ONT_S: 3, PF: 5, TRB: 5, ENG: 4,
            EPS: 1, AES: 0,
        },
        {
            name: "Van Buren",
            party: "Free Soil",
            year: 1848,
            MAT: 1, // Maximum redistributive - anti-slavery economics
            CD: 1, // Maximum cultural openness - anti-slavery moral crusade
            CU: 5, // Maximum universalist - free soil, free labor
            MOR: 5, // Maximum universalist - anti-slavery expansion
            PRO: 4, // Proceduralist - constitutional anti-slavery
            COM: 1, // Never compromise - broke from Democrats over slavery
            ZS: 2, // Positive-sum - free labor ideology
            ONT_H: 4, // Optimistic
            ONT_S: 1, // System broken - slavery corrupting republic
            PF: 1, // Independent - third party
            TRB: 3, // Moderate
            ENG: 5, // Maximum - came out of retirement
            EPS: 0, // Empiricist
            AES: 5, // Visionary - moral crusade
        },
    ],
};
// 1852: Pierce (D) vs Scott (Whig)
const election1852 = {
    year: 1852,
    candidates: [
        {
            name: "Pierce",
            party: "Democratic",
            year: 1852,
            MAT: 2, // Moderate redistributive
            CD: 4, // Culturally conservative - Northern doughface, pro-South
            CU: 1, // Assimilationist - expansion, nativist tendencies
            MOR: 1, // Narrow moral circle - enforced Fugitive Slave Act
            PRO: 2, // Anti-procedural - Kansas-Nebraska, executive overreach
            COM: 3, // Mixed - tried to hold party together
            ZS: 3, // Mixed
            ONT_H: 3, // Moderate
            ONT_S: 4, // System working - status quo on slavery
            PF: 5, // Maximum Democrat - party unity above all
            TRB: 4, // High tribal - Democratic identity
            ENG: 4, // Engaged
            EPS: 1, // Institutionalist
            AES: 3, // Authentic - "handsome Frank," young, vigorous
        },
        {
            name: "Scott",
            party: "Whig",
            year: 1852,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 5,
            ZS: 2, ONT_H: 1, ONT_S: 5, PF: 2, TRB: 1, ENG: 2,
            EPS: 1, AES: 0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const ELECTIONS_1789_1852 = [
    election1789, election1792, election1796, election1800, election1804,
    election1808, election1812, election1816, election1820, election1824,
    election1828, election1832, election1836, election1840, election1844,
    election1848, election1852,
];
// ACTUAL_RESULTS (no popular vote before 1824):
// 1789: { winner: "Washington", winnerPct: 100, loserPct: 0 },
// 1792: { winner: "Washington", winnerPct: 100, loserPct: 0 },
// 1796: { winner: "Adams", winnerPct: 53.4, loserPct: 46.6 }, // electoral vote share (no popular)
// 1800: { winner: "Jefferson", winnerPct: 61.4, loserPct: 38.6 }, // electoral vote
// 1804: { winner: "Jefferson", winnerPct: 72.8, loserPct: 27.2 }, // electoral vote
// 1808: { winner: "Madison", winnerPct: 64.7, loserPct: 32.4 }, // electoral vote
// 1812: { winner: "Madison", winnerPct: 58.7, loserPct: 41.3 }, // electoral vote
// 1816: { winner: "Monroe", winnerPct: 68.2, loserPct: 31.8 }, // electoral vote
// 1820: { winner: "Monroe", winnerPct: 99.6, loserPct: 0.4 }, // electoral vote
// 1824: { winner: "Jackson", winnerPct: 41.4, loserPct: 30.9 }, // Jackson won PV but lost House
// 1828: { winner: "Jackson", winnerPct: 56.0, loserPct: 43.6 },
// 1832: { winner: "Jackson", winnerPct: 54.2, loserPct: 37.4 },
// 1836: { winner: "Van Buren", winnerPct: 50.8, loserPct: 36.6 },
// 1840: { winner: "Harrison", winnerPct: 52.9, loserPct: 46.8 },
// 1844: { winner: "Polk", winnerPct: 49.5, loserPct: 48.1 },
// 1848: { winner: "Taylor", winnerPct: 47.3, loserPct: 42.5 }, // Van Buren 10.1%
// 1852: { winner: "Pierce", winnerPct: 50.8, loserPct: 43.9 },
//# sourceMappingURL=elections-1789-1852.js.map