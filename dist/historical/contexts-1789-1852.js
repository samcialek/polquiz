// ─────────────────────────────────────────────────────────────────────────────
// 1789: Washington (unopposed) — Founding era, constitutional experiment
// ─────────────────────────────────────────────────────────────────────────────
const context1789 = {
    year: 1789,
    zeitgeist: {
        era: "founding",
        nodeWeights: { PRO: 2.5, ONT_H: 1.8, ONT_S: 1.5, COM: 2.0, ENG: 1.5 },
        intensity: 1.3,
        description: "Birth of the republic; constitutional experiment with no precedent",
    },
    issueLandscape: {
        primaryAxis: ["PRO", "ONT_H", "COM"],
        secondaryAxis: ["MAT", "ONT_S", "ENG"],
        dormant: ["CD", "CU", "MOR", "ZS", "PF", "TRB"],
        description: "Can a republic work? Procedural legitimacy and institutional design are everything",
    },
    candidateActivations: [
        {
            candidateName: "Washington",
            activationNodes: { PRO: 1.8, COM: 1.5, ENG: 1.5, ONT_H: 1.3 },
            novelty: 1.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1792: Washington (unopposed) — Partisan factions emerging
// ─────────────────────────────────────────────────────────────────────────────
const context1792 = {
    year: 1792,
    zeitgeist: {
        era: "founding",
        nodeWeights: { PRO: 2.0, MAT: 1.5, PF: 1.3, COM: 1.5 },
        intensity: 0.9,
        description: "Washington reelected; Hamilton vs Jefferson factions crystallizing beneath the surface",
    },
    issueLandscape: {
        primaryAxis: ["PRO", "MAT", "COM"],
        secondaryAxis: ["ONT_H", "ONT_S", "PF", "ENG"],
        dormant: ["CD", "CU", "MOR", "ZS", "TRB"],
        description: "Hamilton's financial program divides elites; tariffs and the national bank are contested",
    },
    candidateActivations: [
        {
            candidateName: "Washington",
            activationNodes: { PRO: 1.5, COM: 1.5, ENG: 1.2 },
            novelty: 1.3,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1796: Adams vs Jefferson — First contested election
// ─────────────────────────────────────────────────────────────────────────────
const context1796 = {
    year: 1796,
    zeitgeist: {
        era: "founding",
        nodeWeights: { PRO: 1.8, MAT: 1.5, CD: 1.3, PF: 1.2 },
        intensity: 1.0,
        description: "First contested election; Jay Treaty anger; institutional stability matters most",
    },
    issueLandscape: {
        primaryAxis: ["PRO", "MAT", "CD"],
        secondaryAxis: ["PF", "COM", "ENG"],
        dormant: ["MOR", "CU", "ZS", "ONT_S", "TRB", "ONT_H"],
        description: "Can the republic hold? Proceduralism and commerce vs agrarian populism",
    },
    candidateActivations: [
        {
            candidateName: "Adams",
            activationNodes: { PRO: 1.5, CD: 1.3, MAT: 1.3 },
            novelty: 1.2,
            threatActivation: { ONT_H: 1.2 },
        },
        {
            candidateName: "Jefferson",
            activationNodes: { ONT_H: 1.3, CU: 1.2 },
            novelty: 1.0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1800: Jefferson vs Adams — "Revolution of 1800"
// ─────────────────────────────────────────────────────────────────────────────
const context1800 = {
    year: 1800,
    zeitgeist: {
        era: "founding",
        nodeWeights: { PF: 2.0, ONT_S: 2.0, CD: 1.8, MAT: 1.5, TRB: 1.5, CU: 1.5 },
        intensity: 1.5,
        description: "Alien & Sedition Acts; partisan warfare; both sides fear the republic will die if they lose",
    },
    issueLandscape: {
        primaryAxis: ["PF", "ONT_S", "CD"],
        secondaryAxis: ["MAT", "CU", "TRB", "ONT_H"],
        dormant: ["MOR", "PRO", "COM", "ZS", "ENG"],
        description: "Liberty vs order; Sedition Acts make free speech THE issue; existential partisan conflict",
    },
    candidateActivations: [
        {
            candidateName: "Jefferson",
            activationNodes: { ONT_S: 1.5, CU: 1.5, ONT_H: 1.3, PF: 1.3 },
            novelty: 1.5,
            threatActivation: { CD: 1.5, PRO: 1.3 },
        },
        {
            candidateName: "Adams",
            activationNodes: { PRO: 1.3, CD: 1.5, MAT: 1.2 },
            novelty: 1.0,
            threatActivation: { ONT_S: 1.5, CU: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1804: Jefferson vs Pinckney — Louisiana Purchase, Jefferson dominant
// ─────────────────────────────────────────────────────────────────────────────
const context1804 = {
    year: 1804,
    zeitgeist: {
        era: "founding",
        nodeWeights: { ONT_H: 1.5, MAT: 1.3, PF: 0.7 },
        intensity: 0.8,
        description: "Louisiana Purchase vindicates Jefferson; national optimism; Federalists crumbling",
    },
    issueLandscape: {
        primaryAxis: ["ONT_H", "MAT", "CU"],
        secondaryAxis: ["CD", "PRO", "ONT_S", "ENG"],
        dormant: ["MOR", "COM", "ZS", "PF", "TRB"],
        description: "Expansion and prosperity dominate; opposition party has no compelling counter-narrative",
    },
    candidateActivations: [
        {
            candidateName: "Jefferson",
            activationNodes: { ONT_H: 1.5, CU: 1.3, MAT: 1.2 },
            novelty: 1.3,
        },
        {
            candidateName: "Pinckney",
            activationNodes: { CD: 1.2, PRO: 1.2 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1808: Madison vs Pinckney — Embargo Act anger, approaching War of 1812
// ─────────────────────────────────────────────────────────────────────────────
const context1808 = {
    year: 1808,
    zeitgeist: {
        era: "founding",
        nodeWeights: { MAT: 2.0, ONT_S: 1.5, ZS: 1.5, CU: 1.3 },
        intensity: 1.1,
        description: "Embargo Act devastating New England commerce; British impressment; war looming",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ZS", "ONT_S"],
        secondaryAxis: ["CU", "PRO", "CD", "ENG"],
        dormant: ["MOR", "COM", "ONT_H", "PF", "TRB"],
        description: "Trade embargo splits the country; economic pain vs national honor against Britain",
    },
    candidateActivations: [
        {
            candidateName: "Madison",
            activationNodes: { PRO: 1.3, CU: 1.2, ONT_H: 1.2 },
            novelty: 1.0,
            threatActivation: { MAT: 1.3 },
        },
        {
            candidateName: "Pinckney",
            activationNodes: { MAT: 1.5, CD: 1.3, ZS: 1.2 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1812: Madison vs Clinton — WAR election, War of 1812 underway
// ─────────────────────────────────────────────────────────────────────────────
const context1812 = {
    year: 1812,
    zeitgeist: {
        era: "founding",
        nodeWeights: { ZS: 2.5, TRB: 2.0, ONT_S: 1.8, ENG: 1.5, MAT: 1.3 },
        intensity: 1.3,
        description: "Nation at war with Britain; security and national survival dominate the election",
    },
    issueLandscape: {
        primaryAxis: ["ZS", "TRB", "ONT_S"],
        secondaryAxis: ["MAT", "ENG", "PRO", "PF"],
        dormant: ["CD", "CU", "MOR", "COM", "ONT_H"],
        description: "War hawks vs peace faction; national honor and security override all other concerns",
    },
    candidateActivations: [
        {
            candidateName: "Madison",
            activationNodes: { ZS: 1.5, TRB: 1.3, ENG: 1.3 },
            novelty: 1.0,
            threatActivation: { ONT_S: 1.3 },
        },
        {
            candidateName: "Clinton",
            activationNodes: { MAT: 1.3, COM: 1.2, PRO: 1.2 },
            novelty: 1.0,
            threatActivation: { ZS: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1816: Monroe vs King — Era of Good Feelings beginning, post-war nationalism
// ─────────────────────────────────────────────────────────────────────────────
const context1816 = {
    year: 1816,
    zeitgeist: {
        era: "good-feelings",
        nodeWeights: { COM: 1.5, ONT_H: 1.5, PF: 0.5, TRB: 0.5 },
        intensity: 0.7,
        description: "Post-war nationalism; Federalists irrelevant; one-party era beginning",
    },
    issueLandscape: {
        primaryAxis: ["COM", "ONT_H", "MAT"],
        secondaryAxis: ["PRO", "ONT_S", "ENG"],
        dormant: ["CD", "CU", "MOR", "ZS", "PF", "TRB"],
        description: "National unity and internal improvements; partisan conflict dormant",
    },
    candidateActivations: [
        {
            candidateName: "Monroe",
            activationNodes: { COM: 1.5, ONT_H: 1.3, MAT: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "King",
            activationNodes: { PRO: 1.2, CD: 1.2 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1820: Monroe (unopposed) — Peak Era of Good Feelings
// ─────────────────────────────────────────────────────────────────────────────
const context1820 = {
    year: 1820,
    zeitgeist: {
        era: "good-feelings",
        nodeWeights: { COM: 1.8, ONT_H: 1.5, PF: 0.5, TRB: 0.5, ZS: 0.5 },
        intensity: 0.7,
        description: "Peak national unity; Monroe Doctrine era; Missouri Compromise foreshadows trouble",
    },
    issueLandscape: {
        primaryAxis: ["COM", "ONT_H", "PRO"],
        secondaryAxis: ["MAT", "ONT_S", "ENG"],
        dormant: ["CD", "CU", "MOR", "ZS", "PF", "TRB"],
        description: "Virtually no contest; national consensus on internal improvements and expansion",
    },
    candidateActivations: [
        {
            candidateName: "Monroe",
            activationNodes: { COM: 1.5, ONT_H: 1.3 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1824: Adams vs Jackson vs Crawford vs Clay — "Corrupt Bargain"
// ─────────────────────────────────────────────────────────────────────────────
const context1824 = {
    year: 1824,
    zeitgeist: {
        era: "good-feelings",
        nodeWeights: { PF: 1.8, TRB: 1.5, ONT_S: 1.5, MAT: 1.5, ENG: 1.3 },
        intensity: 1.2,
        description: "One-party system fracturing; 4-way race driven by personality and regional identity",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "TRB", "ONT_S"],
        secondaryAxis: ["PRO", "PF", "COM", "ENG"],
        dormant: ["CD", "CU", "MOR", "ZS", "ONT_H"],
        description: "American System vs agrarian populism; regional blocs and personal factions replace parties",
    },
    candidateActivations: [
        {
            candidateName: "Adams",
            activationNodes: { MAT: 1.3, PRO: 1.3, COM: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "Jackson",
            activationNodes: { TRB: 1.5, ONT_S: 1.5, ENG: 1.5 },
            novelty: 1.5,
            threatActivation: { PRO: 1.3, COM: 1.2 },
        },
        {
            candidateName: "Crawford",
            activationNodes: { PF: 1.3, PRO: 1.2 },
            novelty: 0.8,
        },
        {
            candidateName: "Clay",
            activationNodes: { MAT: 1.3, COM: 1.5, PRO: 1.2 },
            novelty: 1.0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1828: Jackson vs Adams — First modern campaign, mass democracy
// ─────────────────────────────────────────────────────────────────────────────
const context1828 = {
    year: 1828,
    zeitgeist: {
        era: "jacksonian",
        nodeWeights: { TRB: 2.0, ONT_S: 2.0, PF: 2.0, ENG: 1.8, MAT: 1.5, ONT_H: 1.3 },
        intensity: 1.3,
        description: "Mass democracy arrives; common man vs establishment; 'corrupt bargain' revenge",
    },
    issueLandscape: {
        primaryAxis: ["TRB", "ONT_S", "PF"],
        secondaryAxis: ["MAT", "ENG", "ONT_H", "PRO"],
        dormant: ["CD", "CU", "MOR", "ZS", "COM"],
        description: "Populism vs elitism; Jackson channels rage of the common man against Adams aristocracy",
    },
    candidateActivations: [
        {
            candidateName: "Jackson",
            activationNodes: { TRB: 1.8, ONT_S: 1.5, ENG: 1.5, PF: 1.3 },
            novelty: 1.8,
            threatActivation: { PRO: 1.5, COM: 1.3 },
        },
        {
            candidateName: "Adams",
            activationNodes: { PRO: 1.3, MAT: 1.2 },
            novelty: 0.8,
            threatActivation: { ONT_S: 1.3, TRB: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1832: Jackson vs Clay — Bank War, nullification crisis
// ─────────────────────────────────────────────────────────────────────────────
const context1832 = {
    year: 1832,
    zeitgeist: {
        era: "jacksonian",
        nodeWeights: { MAT: 2.5, ONT_S: 2.0, TRB: 1.8, PF: 1.8, PRO: 1.5 },
        intensity: 1.3,
        description: "Bank War dominates; Jackson vetoes BUS; nullification crisis challenges federal authority",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "PRO"],
        secondaryAxis: ["TRB", "PF", "ENG", "COM"],
        dormant: ["CD", "CU", "MOR", "ZS", "ONT_H"],
        description: "National Bank is THE issue; executive power vs congressional prerogative; state vs federal",
    },
    candidateActivations: [
        {
            candidateName: "Jackson",
            activationNodes: { MAT: 1.5, ONT_S: 1.5, TRB: 1.3, ENG: 1.3 },
            novelty: 1.3,
            threatActivation: { PRO: 1.5, COM: 1.3 },
        },
        {
            candidateName: "Clay",
            activationNodes: { MAT: 1.5, PRO: 1.5, COM: 1.3 },
            novelty: 1.0,
            threatActivation: { ONT_S: 1.3, TRB: 1.2 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1836: Van Buren vs Harrison — Jacksonian succession, Panic of 1837 looming
// ─────────────────────────────────────────────────────────────────────────────
const context1836 = {
    year: 1836,
    zeitgeist: {
        era: "jacksonian",
        nodeWeights: { PF: 2.0, TRB: 1.8, COM: 1.3 },
        intensity: 1.0,
        description: "Jacksonian succession; party machine vs scattered Whig opposition",
    },
    issueLandscape: {
        primaryAxis: ["PF", "TRB", "COM"],
        secondaryAxis: ["MAT", "PRO", "ENG"],
        dormant: ["CD", "CU", "MOR", "ZS", "ONT_H", "ONT_S"],
        description: "Party loyalty and coalition management dominate; VB inherits Jackson's machine",
    },
    candidateActivations: [
        {
            candidateName: "Van Buren",
            activationNodes: { PF: 1.8, TRB: 1.5, COM: 1.3 },
            novelty: 1.2,
        },
        {
            candidateName: "Harrison",
            activationNodes: { PRO: 1.2 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1840: Harrison vs Van Buren — "Tippecanoe," first campaign spectacle
// ─────────────────────────────────────────────────────────────────────────────
const context1840 = {
    year: 1840,
    zeitgeist: {
        era: "jacksonian",
        nodeWeights: { MAT: 2.5, ONT_S: 2.5, TRB: 2.0, ENG: 2.0, ZS: 1.5 },
        intensity: 1.3,
        description: "Depression of 1837 devastates the country; first mass-spectacle campaign; record turnout",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "ENG"],
        secondaryAxis: ["TRB", "ZS", "COM"],
        dormant: ["CD", "CU", "MOR", "PRO", "ONT_H", "PF"],
        description: "Economic catastrophe drives everything; 'log cabin and hard cider' populism vs incumbent blame",
    },
    candidateActivations: [
        {
            candidateName: "Harrison",
            activationNodes: { ONT_S: 1.5, TRB: 1.5, ENG: 1.5, MAT: 1.3 },
            novelty: 1.3,
            threatActivation: { MAT: 1.3 },
        },
        {
            candidateName: "Van Buren",
            activationNodes: { PF: 1.3, COM: 1.2 },
            novelty: 0.8,
            threatActivation: { ONT_S: 1.5, MAT: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1844: Polk vs Clay — Manifest Destiny, Texas annexation, slavery emerging
// ─────────────────────────────────────────────────────────────────────────────
const context1844 = {
    year: 1844,
    zeitgeist: {
        era: "jacksonian",
        nodeWeights: { TRB: 2.5, ZS: 2.0, ENG: 1.5 },
        intensity: 1.2,
        description: "Manifest Destiny fever; Texas annexation; expansionist energy vs cautious establishment",
    },
    issueLandscape: {
        primaryAxis: ["TRB", "ZS", "ENG"],
        secondaryAxis: ["MAT", "PF", "ONT_S"],
        dormant: ["CD", "CU", "MOR", "PRO", "COM", "ONT_H"],
        description: "Expansion and national destiny dominate; Texas and Oregon questions split along sectional lines",
    },
    candidateActivations: [
        {
            candidateName: "Polk",
            activationNodes: { TRB: 1.8, ZS: 1.5, ENG: 1.5 },
            novelty: 1.5,
        },
        {
            candidateName: "Clay",
            activationNodes: { MAT: 1.3, COM: 1.5, PRO: 1.3 },
            novelty: 1.0,
            threatActivation: { CU: 1.2 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1848: Taylor vs Cass vs Van Buren (Free Soil) — Mexican War aftermath
// ─────────────────────────────────────────────────────────────────────────────
const context1848 = {
    year: 1848,
    zeitgeist: {
        era: "jacksonian",
        nodeWeights: { MOR: 2.0, TRB: 1.8, CU: 1.5, ONT_S: 1.5, ZS: 1.3 },
        intensity: 1.2,
        description: "Mexican War conquered new territory; slavery expansion is now unavoidable; Free Soil revolt",
    },
    issueLandscape: {
        primaryAxis: ["MOR", "TRB", "ONT_S"],
        secondaryAxis: ["CU", "ZS", "PF", "ENG"],
        dormant: ["MAT", "CD", "PRO", "COM", "ONT_H"],
        description: "Wilmot Proviso and slavery in the territories; Free Soil movement fractures both parties",
    },
    candidateActivations: [
        {
            candidateName: "Taylor",
            activationNodes: { COM: 1.3, TRB: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "Cass",
            activationNodes: { PF: 1.3, TRB: 1.3 },
            novelty: 0.8,
        },
        {
            candidateName: "Van Buren",
            activationNodes: { MOR: 1.8, ONT_S: 1.5, ENG: 1.3, CU: 1.3 },
            novelty: 1.3,
            threatActivation: { TRB: 1.3, PF: 1.2 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1852: Pierce vs Scott — Compromise of 1850, Fugitive Slave Act, Whigs dying
// ─────────────────────────────────────────────────────────────────────────────
const context1852 = {
    year: 1852,
    zeitgeist: {
        era: "jacksonian",
        nodeWeights: { MOR: 1.8, COM: 1.5, PF: 1.5, TRB: 1.5, ONT_S: 1.3 },
        intensity: 1.0,
        description: "Compromise of 1850 bought time but satisfied nobody; Fugitive Slave Act enrages North; Whig party fracturing",
    },
    issueLandscape: {
        primaryAxis: ["MOR", "COM", "PF"],
        secondaryAxis: ["TRB", "ONT_S", "CD", "ENG"],
        dormant: ["MAT", "CU", "PRO", "ZS", "ONT_H"],
        description: "Slavery and the Compromise dominate; both parties claim to be unionist; Whigs have no clear identity",
    },
    candidateActivations: [
        {
            candidateName: "Pierce",
            activationNodes: { PF: 1.3, COM: 1.3, TRB: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "Scott",
            activationNodes: { PRO: 1.2 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const CONTEXTS_1789_1852 = [
    context1789, context1792, context1796, context1800, context1804,
    context1808, context1812, context1816, context1820, context1824,
    context1828, context1832, context1836, context1840, context1844,
    context1848, context1852,
];
//# sourceMappingURL=contexts-1789-1852.js.map