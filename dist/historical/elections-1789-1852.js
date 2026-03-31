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
            ONT_S: 2, // System new and working - he's building it
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
            ZS: 2, ONT_H: 4, ONT_S: 2, PF: 1, TRB: 1, ENG: 4,
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
            ONT_S: 2, // System working - defend it from demagogues
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
            MAT: 2, // Agrarian populist
            CD: 2, // Culturally open
            CU: 4, // Internationalist
            MOR: 4, // Wide moral circle
            PRO: 2, // Anti-federal power - states' rights skeptic
            COM: 2, // Low compromise - partisan opposition
            ZS: 3, // Mixed
            ONT_H: 4, // Optimistic
            ONT_S: 4, // System corrupted by Federalists
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
            MAT: 1, // Maximum populist signal - opposition to Hamilton's system
            CD: 1, // Maximum cultural openness - religious freedom, anti-established church
            CU: 5, // Maximum universalist - rights of man, French Revolution sympathy
            MOR: 5, // Maximum universalist moral circle
            PRO: 2, // Anti-proceduralist - opposed Alien & Sedition Acts, federal overreach
            COM: 2, // Low compromise - revolutionary rhetoric
            ZS: 2, // Positive-sum
            ONT_H: 5, // Maximum optimistic
            ONT_S: 4, // System needs overhaul - "revolution" against Federalist tyranny
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
            ONT_S: 1, // System working - defend it
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
            MAT: 2, CD: 2, CU: 4, MOR: 4, PRO: 3, COM: 3,
            ZS: 2, ONT_H: 4, ONT_S: 2, PF: 4, TRB: 3, ENG: 5,
            EPS: 0, AES: 5,
        },
        {
            name: "Pinckney",
            party: "Federalist",
            year: 1804,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 3,
            ZS: 4, ONT_H: 2, ONT_S: 1, PF: 4, TRB: 4, ENG: 3,
            EPS: 1, AES: 0,
        },
    ],
};
// 1808: Madison vs C.C. Pinckney
const election1808 = {
    year: 1808,
    candidates: [
        {
            name: "Madison",
            party: "Democratic-Republican",
            year: 1808,
            MAT: 2, // Moderate - Constitution framer, more institutional than Jefferson
            CD: 2, // Culturally open
            CU: 4, // Internationalist but navigating embargo
            MOR: 4, // Wide moral circle
            PRO: 5, // Maximum proceduralist - Father of the Constitution
            COM: 4, // Compromiser - Great Compromiser at Convention
            ZS: 2, // Positive-sum
            ONT_H: 4, // Optimistic
            ONT_S: 2, // System working - he designed it
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
            ZS: 4, ONT_H: 2, ONT_S: 1, PF: 4, TRB: 4, ENG: 3,
            EPS: 1, AES: 0,
        },
    ],
};
// 1812: Madison vs DeWitt Clinton
const election1812 = {
    year: 1812,
    candidates: [
        {
            name: "Madison",
            party: "Democratic-Republican",
            year: 1812,
            MAT: 2, CD: 2, CU: 4, MOR: 4, PRO: 4, COM: 3,
            ZS: 3, ONT_H: 3, ONT_S: 3, PF: 4, TRB: 3, ENG: 5,
            EPS: 0, AES: 0,
        },
        {
            name: "Clinton",
            party: "Federalist",
            year: 1812,
            MAT: 4, CD: 4, CU: 2, MOR: 2, PRO: 5, COM: 4,
            ZS: 3, ONT_H: 3, ONT_S: 2, PF: 3, TRB: 3, ENG: 4,
            EPS: 1, AES: 1,
        },
    ],
};
// 1816: Monroe vs Rufus King
const election1816 = {
    year: 1816,
    candidates: [
        {
            name: "Monroe",
            party: "Democratic-Republican",
            year: 1816,
            MAT: 2, CD: 2, CU: 4, MOR: 4, PRO: 4, COM: 5,
            ZS: 1, ONT_H: 5, ONT_S: 1, PF: 3, TRB: 2, ENG: 4,
            EPS: 1, AES: 0,
        },
        {
            name: "King",
            party: "Federalist",
            year: 1816,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 3,
            ZS: 4, ONT_H: 2, ONT_S: 2, PF: 4, TRB: 4, ENG: 3,
            EPS: 1, AES: 0,
        },
    ],
};
// 1820: Monroe (unopposed - Era of Good Feelings)
const election1820 = {
    year: 1820,
    candidates: [
        {
            name: "Monroe",
            party: "Democratic-Republican",
            year: 1820,
            MAT: 3, CD: 3, CU: 4, MOR: 4, PRO: 4, COM: 5,
            ZS: 1, ONT_H: 5, ONT_S: 1, PF: 2, TRB: 1, ENG: 3,
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
            MAT: 5, // Pro-commerce, American System, tariffs - push extreme to differentiate
            CD: 5, // Culturally conservative elite - Puritan gravitas
            CU: 1, // Assimilationist - national project, not pluralist
            MOR: 1, // Narrow moral circle - establishment elite
            PRO: 5, // Maximum proceduralist - institutional
            COM: 4, // Compromiser - corrupt bargain
            ZS: 2, // Positive-sum
            ONT_H: 2, // Pessimistic - distrusted popular passions
            ONT_S: 1, // System working - defend from demagogues
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
            MAT: 2, // Populist - bank opposition, anti-elite economics
            CD: 3, // Moderate cultural - frontier but broad appeal
            CU: 3, // Mixed - expansion but national unity
            MOR: 3, // Moderate - broad "common man" appeal
            PRO: 2, // Anti-procedural - military hero, direct action
            COM: 2, // Low compromise but not extreme
            ZS: 3, // Mixed
            ONT_H: 3, // Moderate
            ONT_S: 4, // System needs reform - elites rigged it
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
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 4,
            ZS: 4, ONT_H: 2, ONT_S: 1, PF: 5, TRB: 4, ENG: 3,
            EPS: 1, AES: 0,
        },
        {
            name: "Clay",
            party: "Democratic-Republican",
            year: 1824,
            MAT: 5, // American System - tariffs, pro-commerce, push extreme
            CD: 4, // Conservative - establishment
            CU: 1, // Assimilationist - national project
            MOR: 2, // Narrow-ish
            PRO: 5, // Maximum proceduralist
            COM: 5, // Maximum compromiser
            ZS: 2, // Positive-sum
            ONT_H: 3, // Moderate
            ONT_S: 1, // System working
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
            MAT: 2, CD: 3, CU: 3, MOR: 3, PRO: 2, COM: 2,
            ZS: 3, ONT_H: 3, ONT_S: 4, PF: 4, TRB: 4, ENG: 5,
            EPS: 3, AES: 4,
        },
        {
            name: "Adams",
            party: "National Republican",
            year: 1828,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 3,
            ZS: 3, ONT_H: 2, ONT_S: 1, PF: 4, TRB: 2, ENG: 3,
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
            MAT: 2, // Bank War - populist anti-elite economics
            CD: 3, CU: 3, MOR: 3, PRO: 2, COM: 2,
            ZS: 3, ONT_H: 3, ONT_S: 4, PF: 4, TRB: 4, ENG: 5,
            EPS: 3, AES: 4,
        },
        {
            name: "Clay",
            party: "National Republican",
            year: 1832,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 5,
            ZS: 2, ONT_H: 2, ONT_S: 1, PF: 5, TRB: 2, ENG: 5,
            EPS: 1, AES: 0,
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
            MAT: 2, // Redistributive — labor friendly, Jacksonian heir
            CD: 3, // Moderate
            CU: 3, // Mixed
            MOR: 3, // Moderate universalist
            PRO: 3, // Mixed — machine politician but competent
            COM: 4, // Compromiser — "Little Magician"
            ZS: 3, // Mixed — Jacksonian optimism
            ONT_H: 3, // Moderate
            ONT_S: 3, // Mixed — system working but challenges
            PF: 4, // Strong partisan
            TRB: 3, // Moderate — northern coalition builder
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
            ONT_S: 4, // System needs change - Depression of 1837 blamed on Van Buren
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
            MAT: 1, // Blamed for depression
            CD: 1, // Extreme left
            CU: 5, // Extreme internationalist
            MOR: 5, // Extreme universalist
            PRO: 1, // Anti-procedural - failed policies
            COM: 1, // Never compromise - stubborn incumbent
            ZS: 5, // Zero-sum - depression scarcity thinking
            ONT_H: 1, // Pessimistic - failed
            ONT_S: 1, // System working (incumbent defense)
            PF: 5, TRB: 5, ENG: 5,
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
            MAT: 3, // Moderate - tariff reform but not radical
            CD: 3, // Moderate - Southern but broad appeal
            CU: 2, // Mild assimilationist - expansion
            MOR: 3, // Moderate
            PRO: 3, // Mixed
            COM: 3, // Mixed - pragmatic
            ZS: 2, // Positive-sum - expansion as opportunity for all
            ONT_H: 3, // Moderate
            ONT_S: 3, // Mixed
            PF: 4, // Strong Democrat
            TRB: 3, // Moderate - broad coalition
            ENG: 5, // Maximum - energized dark horse
            EPS: 3, // Intuitionist
            AES: 4, // Fighter - aggressive expansionist
        },
        {
            name: "Clay",
            party: "Whig",
            year: 1844,
            MAT: 5, CD: 5, CU: 1, MOR: 1, PRO: 5, COM: 5,
            ZS: 1, ONT_H: 2, ONT_S: 1, PF: 5, TRB: 1, ENG: 5,
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
            ONT_S: 2, // System fine - just needs steady hand
            PF: 1, // Maximum independent - "I am a Whig but not an ultra Whig"
            TRB: 3, // Moderate - military hero identity
            ENG: 3, // Moderate - reluctant candidate
            EPS: 3, // Intuitionist - military man
            AES: 0, // Statesman - war hero
        },
        {
            name: "Cass",
            party: "Democratic",
            year: 1848,
            MAT: 1, CD: 1, CU: 5, MOR: 5, PRO: 1, COM: 2,
            ZS: 4, ONT_H: 3, ONT_S: 4, PF: 5, TRB: 5, ENG: 4,
            EPS: 3, AES: 0,
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
            ONT_S: 5, // System broken - slavery corrupting republic
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
            ONT_S: 2, // System working - status quo on slavery
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
            ZS: 2, ONT_H: 1, ONT_S: 1, PF: 2, TRB: 1, ENG: 2,
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