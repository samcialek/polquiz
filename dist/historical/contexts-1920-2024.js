/**
 * Election Activation Contexts: 1920–2024
 *
 * 27 elections from "Return to Normalcy" through the polarization era.
 * Each election has three layers:
 *   1. Zeitgeist — macro conditions affecting all voters
 *   2. Issue Landscape — what the election is actually about
 *   3. Candidate Activations — who energizes or repels whom
 *
 * All 12 continuous nodes must appear in exactly one of
 * primaryAxis / secondaryAxis / dormant.
 */
// ─────────────────────────────────────────────────────────────────────────────
// 1920: Harding vs Cox — "Return to Normalcy"
// ─────────────────────────────────────────────────────────────────────────────
const context1920 = {
    year: 1920,
    zeitgeist: {
        era: "normalcy",
        nodeWeights: { COM: 2.0, PRO: 1.5, ONT_S: 0.5, ENG: 0.6 },
        intensity: 0.7,
        description: "Post-WWI exhaustion; voters reject Wilsonian crusades and want calm normalcy",
    },
    issueLandscape: {
        primaryAxis: ["COM", "PRO", "MAT"],
        secondaryAxis: ["CD", "ONT_S"],
        dormant: ["CU", "MOR", "ZS", "ONT_H", "PF", "TRB", "ENG"],
        description: "Normalcy vs reform; voters exhausted; compromise and stability win",
    },
    candidateActivations: [
        {
            candidateName: "Harding",
            activationNodes: { COM: 1.5, PRO: 1.3 },
            novelty: 1.2,
        },
        {
            candidateName: "Cox",
            activationNodes: { CU: 1.1 },
            novelty: 0.7,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1924: Coolidge vs Davis vs La Follette — Roaring 20s
// ─────────────────────────────────────────────────────────────────────────────
const context1924 = {
    year: 1924,
    zeitgeist: {
        era: "normalcy",
        nodeWeights: { MAT: 1.3, ONT_S: 5.4, PF: 0.7 },
        intensity: 0.8,
        description: "Prosperity + KKK controversy + Progressive insurgency fragmenting politics",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "CD"],
        secondaryAxis: ["MOR", "PRO", "COM", "CU"],
        dormant: ["ZS", "ONT_H", "PF", "TRB", "ENG"],
        description: "Business prosperity vs. anti-monopoly reform; KKK and cultural identity simmer",
    },
    candidateActivations: [
        {
            candidateName: "Coolidge",
            activationNodes: { MAT: 1.2, PRO: 1.3 },
            novelty: 0.8,
        },
        {
            candidateName: "Davis",
            activationNodes: { MOR: 1.2, PRO: 1.2 },
            novelty: 0.8,
        },
        {
            candidateName: "La Follette",
            activationNodes: { MAT: 1.5, ONT_S: 5.6, COM: 0.7, PF: 0.7 },
            novelty: 1.5,
            threatActivation: { MAT: 1.3, ONT_S: 5.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1928: Hoover vs Smith — Prosperity, Prohibition, first Catholic candidate
// ─────────────────────────────────────────────────────────────────────────────
const context1928 = {
    year: 1928,
    zeitgeist: {
        era: "normalcy",
        nodeWeights: { CD: 1.8, TRB: 1.5, MOR: 1.4 },
        intensity: 0.9,
        description: "Peak 1920s prosperity but deep urban-rural cultural divide over religion and prohibition",
    },
    issueLandscape: {
        primaryAxis: ["CD", "TRB", "MOR"],
        secondaryAxis: ["MAT", "CU", "PRO", "ONT_H"],
        dormant: ["COM", "ZS", "ONT_S", "PF", "ENG"],
        description: "Catholic candidate triggers cultural identity war; economy is background consensus",
    },
    candidateActivations: [
        {
            candidateName: "Hoover",
            activationNodes: { PRO: 1.3, MAT: 1.2, ONT_H: 1.2 },
            novelty: 1.2,
        },
        {
            candidateName: "Smith",
            activationNodes: { CD: 1.4, TRB: 1.5, CU: 1.3 },
            novelty: 1.4,
            threatActivation: { CD: 1.5, TRB: 1.4, MOR: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1932: Roosevelt vs Hoover — GREAT DEPRESSION, New Deal promise
// ─────────────────────────────────────────────────────────────────────────────
const context1932 = {
    year: 1932,
    zeitgeist: {
        era: "new-deal",
        nodeWeights: { MAT: 2.5, ONT_S: 4.0, ZS: 1.5, ONT_H: 1.5, ENG: 1.3 },
        intensity: 1.5,
        description: "25% unemployment; Hoovervilles; total economic collapse; realignment election",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "ONT_H"],
        secondaryAxis: ["ZS", "PRO", "COM", "ENG"],
        dormant: ["CD", "CU", "MOR", "PF", "TRB"],
        description: "Depression is THE issue; economic philosophy and systemic failure dominate everything",
    },
    candidateActivations: [
        {
            candidateName: "Roosevelt",
            activationNodes: { MAT: 1.5, ONT_S: 5.5, ONT_H: 1.5, ENG: 1.4 },
            novelty: 1.8,
            threatActivation: { MAT: 1.2 },
        },
        {
            candidateName: "Hoover",
            activationNodes: { PRO: 1.3, MAT: 1.2 },
            novelty: 0.8,
            threatActivation: { MAT: 1.5, ONT_S: 5.5 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1936: Roosevelt vs Landon — New Deal referendum, landslide
// ─────────────────────────────────────────────────────────────────────────────
const context1936 = {
    year: 1936,
    zeitgeist: {
        era: "new-deal",
        nodeWeights: { MAT: 2.2, ONT_S: 5.8, TRB: 1.5, PF: 1.5 },
        intensity: 1.3,
        description: "New Deal as referendum; labor vs. business class warfare; party realignment solidifying",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "TRB"],
        secondaryAxis: ["PF", "ZS", "ONT_H", "PRO"],
        dormant: ["CD", "CU", "MOR", "COM", "ENG"],
        description: "Pure economics and class: New Deal populism vs. free enterprise; labor vs. business",
    },
    candidateActivations: [
        {
            candidateName: "Roosevelt",
            activationNodes: { MAT: 1.5, ONT_S: 5.4, TRB: 1.4, ENG: 1.3 },
            novelty: 1.5,
        },
        {
            candidateName: "Landon",
            activationNodes: { PRO: 1.3, MAT: 1.2 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1940: Roosevelt vs Willkie — WWII in Europe, third term controversy
// ─────────────────────────────────────────────────────────────────────────────
const context1940 = {
    year: 1940,
    zeitgeist: {
        era: "new-deal",
        nodeWeights: { CU: 1.8, PRO: 1.5, ZS: 1.4, ONT_S: 5.3 },
        intensity: 1.2,
        description: "Europe falling to fascism; interventionism debate; unprecedented third term bid",
    },
    issueLandscape: {
        primaryAxis: ["CU", "PRO", "ZS"],
        secondaryAxis: ["MAT", "ONT_S", "MOR", "COM"],
        dormant: ["CD", "ONT_H", "PF", "TRB", "ENG"],
        description: "Interventionism vs. isolation + third-term norm-breaking; New Deal fading as issue",
    },
    candidateActivations: [
        {
            candidateName: "Roosevelt",
            activationNodes: { CU: 1.4, MOR: 1.3, ONT_S: 5.2 },
            novelty: 1.3,
            threatActivation: { PRO: 1.3 },
        },
        {
            candidateName: "Willkie",
            activationNodes: { PRO: 1.5, MAT: 1.3 },
            novelty: 1.2,
            threatActivation: { PRO: 1.2 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1944: Roosevelt vs Dewey — WWII wartime, D-Day, fourth term
// ─────────────────────────────────────────────────────────────────────────────
const context1944 = {
    year: 1944,
    zeitgeist: {
        era: "new-deal",
        nodeWeights: { CU: 2.0, ZS: 1.5, TRB: 1.5, ENG: 1.3 },
        intensity: 1.3,
        description: "World War raging; D-Day; national unity but war fatigue setting in",
    },
    issueLandscape: {
        primaryAxis: ["CU", "ZS", "TRB"],
        secondaryAxis: ["MAT", "PRO", "MOR", "ENG"],
        dormant: ["CD", "COM", "ONT_H", "ONT_S", "PF"],
        description: "War leadership dominates; 'don't change horses midstream' vs. four-term fatigue",
    },
    candidateActivations: [
        {
            candidateName: "Roosevelt",
            activationNodes: { CU: 1.4, TRB: 1.3, ENG: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "Dewey",
            activationNodes: { PRO: 1.3, MAT: 1.2 },
            novelty: 1.0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1948: Truman vs Dewey vs Thurmond — Cold War, Dixiecrat revolt
// ─────────────────────────────────────────────────────────────────────────────
const context1948 = {
    year: 1948,
    zeitgeist: {
        era: "new-deal",
        nodeWeights: { CD: 1.6, MOR: 1.5, TRB: 1.8, CU: 1.4, PF: 1.4 },
        intensity: 1.2,
        description: "Cold War begins; civil rights emerging; Dixiecrat revolt fractures New Deal coalition",
    },
    issueLandscape: {
        primaryAxis: ["CD", "TRB", "MOR"],
        secondaryAxis: ["CU", "MAT", "PF", "ZS"],
        dormant: ["PRO", "COM", "ONT_H", "ONT_S", "ENG"],
        description: "Civil rights vs. segregation fractures the Democratic Party; Cold War as backdrop",
    },
    candidateActivations: [
        {
            candidateName: "Truman",
            activationNodes: { CD: 1.3, MOR: 1.3, CU: 1.3, ENG: 1.4 },
            novelty: 1.3,
        },
        {
            candidateName: "Dewey",
            activationNodes: { PRO: 1.2, COM: 1.2 },
            novelty: 0.8,
        },
        {
            candidateName: "Thurmond",
            activationNodes: { CD: 1.6, TRB: 1.8, MOR: 1.4 },
            novelty: 1.3,
            threatActivation: { CD: 1.5, MOR: 1.5, TRB: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1952: Eisenhower vs Stevenson — Korean War, McCarthyism, 'I Like Ike'
// ─────────────────────────────────────────────────────────────────────────────
const context1952 = {
    year: 1952,
    zeitgeist: {
        era: "consensus",
        nodeWeights: { ZS: 1.6, CU: 1.4, TRB: 1.3, ONT_S: 5.2 },
        intensity: 1.1,
        description: "Korean War stalemate; McCarthyism; Cold War anxiety; desire for steady leadership",
    },
    issueLandscape: {
        primaryAxis: ["ZS", "CU", "TRB"],
        secondaryAxis: ["MAT", "PRO", "ONT_S", "CD"],
        dormant: ["MOR", "COM", "ONT_H", "PF", "ENG"],
        description: "Cold War security + Korea dominate; communism fear; first TV campaign era",
    },
    candidateActivations: [
        {
            candidateName: "Eisenhower",
            activationNodes: { ZS: 1.3, PRO: 1.3, COM: 1.2 },
            novelty: 1.3,
        },
        {
            candidateName: "Stevenson",
            activationNodes: { ONT_H: 1.3, CU: 1.2, MOR: 1.2 },
            novelty: 1.2,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1956: Eisenhower vs Stevenson — Suez, Hungary, prosperity, calm
// ─────────────────────────────────────────────────────────────────────────────
const context1956 = {
    year: 1956,
    zeitgeist: {
        era: "consensus",
        nodeWeights: { CU: 1.3, ZS: 1.2, ONT_S: 0.6 },
        intensity: 0.8,
        description: "Prosperous peace; Suez and Hungary remind voters to trust Ike; low domestic tension",
    },
    issueLandscape: {
        primaryAxis: ["CU", "ZS", "PRO"],
        secondaryAxis: ["MAT", "CD", "ONT_H"],
        dormant: ["MOR", "COM", "ONT_S", "PF", "TRB", "ENG"],
        description: "Foreign crises reinforce Ike's commander image; domestic consensus; boring election",
    },
    candidateActivations: [
        {
            candidateName: "Eisenhower",
            activationNodes: { CU: 1.2, PRO: 1.3, ZS: 1.2 },
            novelty: 0.8,
        },
        {
            candidateName: "Stevenson",
            activationNodes: { ONT_H: 1.3, CU: 1.3, MOR: 1.2 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1960: Kennedy vs Nixon — Cold War, TV debates, Catholic, razor-thin
// ─────────────────────────────────────────────────────────────────────────────
const context1960 = {
    year: 1960,
    zeitgeist: {
        era: "consensus",
        nodeWeights: { CU: 1.5, ZS: 1.4, CD: 1.3, TRB: 1.3 },
        intensity: 1.1,
        description: "Cold War missile gap; TV debates transform politics; Catholic question resurfaces",
    },
    issueLandscape: {
        primaryAxis: ["CU", "ZS", "CD"],
        secondaryAxis: ["TRB", "MAT", "ONT_H", "ENG"],
        dormant: ["MOR", "PRO", "COM", "ONT_S", "PF"],
        description: "Cold War competition + generational change; Catholic identity as cultural flashpoint",
    },
    candidateActivations: [
        {
            candidateName: "Kennedy",
            activationNodes: { CU: 1.3, ONT_H: 1.4, ENG: 1.4, CD: 1.2 },
            novelty: 1.5,
            threatActivation: { CD: 1.3, TRB: 1.2 },
        },
        {
            candidateName: "Nixon",
            activationNodes: { ZS: 1.3, PRO: 1.2 },
            novelty: 1.0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1964: Johnson vs Goldwater — Civil Rights, Great Society, 'extremism'
// ─────────────────────────────────────────────────────────────────────────────
const context1964 = {
    year: 1964,
    zeitgeist: {
        era: "upheaval",
        nodeWeights: { CD: 1.8, MOR: 1.6, MAT: 1.5, ONT_S: 5.5, COM: 1.4 },
        intensity: 1.3,
        description: "Civil Rights Act transforms politics; Great Society expansion; Goldwater scares moderates",
    },
    issueLandscape: {
        primaryAxis: ["CD", "MOR", "MAT"],
        secondaryAxis: ["ONT_S", "COM", "PRO", "ZS"],
        dormant: ["CU", "ONT_H", "PF", "TRB", "ENG"],
        description: "Civil rights + Great Society vs. anti-government conservatism; first modern ideological election",
    },
    candidateActivations: [
        {
            candidateName: "Johnson",
            activationNodes: { MAT: 1.4, CD: 1.3, ONT_S: 5.3, COM: 1.3 },
            novelty: 1.2,
        },
        {
            candidateName: "Goldwater",
            activationNodes: { MAT: 1.5, COM: 0.6, PRO: 1.3 },
            novelty: 1.5,
            threatActivation: { ZS: 1.5, CD: 1.4, MOR: 1.4, ONT_S: 5.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1968: Nixon vs Humphrey vs Wallace — Vietnam, assassinations, riots
// ─────────────────────────────────────────────────────────────────────────────
const context1968 = {
    year: 1968,
    zeitgeist: {
        era: "upheaval",
        nodeWeights: { CD: 2.0, ONT_S: 4.0, TRB: 1.8, ZS: 1.8 },
        intensity: 1.4,
        description: "Vietnam, MLK/RFK assassinated, riots, convention chaos; nation coming apart",
    },
    issueLandscape: {
        primaryAxis: ["CD", "ONT_S", "ZS"],
        secondaryAxis: ["TRB", "ENG", "PF"],
        dormant: ["MAT", "CU", "MOR", "PRO", "COM", "ONT_H"],
        description: "Law and order vs chaos; cultural backlash dominates; progressive idealism suppressed",
    },
    candidateActivations: [
        {
            candidateName: "Nixon",
            activationNodes: { CD: 1.6, ZS: 1.5, TRB: 1.4, ONT_S: 5.3 },
            novelty: 1.3,
            threatActivation: { ONT_S: 5.3 },
        },
        {
            candidateName: "Humphrey",
            activationNodes: { COM: 1.2 },
            novelty: 0.8,
        },
        {
            candidateName: "Wallace",
            activationNodes: { CD: 1.5, TRB: 1.5 },
            novelty: 1.3,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1972: Nixon vs McGovern — Vietnam winding down, 'acid amnesty abortion'
// ─────────────────────────────────────────────────────────────────────────────
const context1972 = {
    year: 1972,
    zeitgeist: {
        era: "upheaval",
        nodeWeights: { CD: 1.8, CU: 1.5, MOR: 1.5, TRB: 1.4 },
        intensity: 1.1,
        description: "Vietnam winding down but cultural revolution deepens; New Left vs. Silent Majority",
    },
    issueLandscape: {
        primaryAxis: ["CD", "CU", "MOR"],
        secondaryAxis: ["TRB", "MAT", "ONT_S", "ZS"],
        dormant: ["PRO", "COM", "ONT_H", "PF", "ENG"],
        description: "Cultural identity war: counterculture vs. traditional America; Vietnam as cultural proxy",
    },
    candidateActivations: [
        {
            candidateName: "Nixon",
            activationNodes: { CD: 1.3, TRB: 1.3, COM: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "McGovern",
            activationNodes: { CU: 1.5, MOR: 1.4, ONT_S: 5.4, ONT_H: 1.3 },
            novelty: 1.3,
            threatActivation: { CD: 1.5, MOR: 1.4, TRB: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1976: Carter vs Ford — Watergate, outsider vs. pardon
// ─────────────────────────────────────────────────────────────────────────────
const context1976 = {
    year: 1976,
    zeitgeist: {
        era: "upheaval",
        nodeWeights: { PRO: 2.0, ONT_S: 5.6, PF: 1.3 },
        intensity: 1.1,
        description: "Post-Watergate crisis of trust; voters want honesty and procedural integrity",
    },
    issueLandscape: {
        primaryAxis: ["PRO", "ONT_S", "PF"],
        secondaryAxis: ["MAT", "COM", "CD", "ENG"],
        dormant: ["CU", "MOR", "ZS", "ONT_H", "TRB"],
        description: "Integrity and institutional trust dominate; process and character over policy",
    },
    candidateActivations: [
        {
            candidateName: "Carter",
            activationNodes: { PRO: 1.5, ONT_S: 5.3, PF: 0.7 },
            novelty: 1.3,
        },
        {
            candidateName: "Ford",
            activationNodes: { PRO: 1.3, COM: 1.4 },
            novelty: 0.8,
            threatActivation: { PRO: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1980: Reagan vs Carter vs Anderson — Hostages, stagflation, 'are you better off?'
// ─────────────────────────────────────────────────────────────────────────────
const context1980 = {
    year: 1980,
    zeitgeist: {
        era: "reagan",
        nodeWeights: { MAT: 1.8, ONT_S: 5.8, ZS: 1.5, CU: 1.4, ENG: 1.3 },
        intensity: 1.3,
        description: "Stagflation, Iran hostages, malaise; voters feel system broken; realignment election",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "ZS"],
        secondaryAxis: ["CU", "CD", "ENG", "ONT_H"],
        dormant: ["MOR", "PRO", "COM", "PF", "TRB"],
        description: "Economic crisis + global humiliation; 'are you better off?' frames everything",
    },
    candidateActivations: [
        {
            candidateName: "Reagan",
            activationNodes: { MAT: 1.4, ONT_H: 1.5, ONT_S: 5.3, ENG: 1.3 },
            novelty: 1.5,
            threatActivation: { MAT: 1.2 },
        },
        {
            candidateName: "Carter",
            activationNodes: { PRO: 1.2, CU: 1.2 },
            novelty: 0.8,
            threatActivation: { ONT_S: 5.3, MAT: 1.2 },
        },
        {
            candidateName: "Anderson",
            activationNodes: { PF: 0.7, PRO: 1.3, COM: 1.2 },
            novelty: 1.1,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1984: Reagan vs Mondale — 'Morning in America', Cold War confidence
// ─────────────────────────────────────────────────────────────────────────────
const context1984 = {
    year: 1984,
    zeitgeist: {
        era: "reagan",
        nodeWeights: { ONT_H: 1.4, ZS: 1.3, MAT: 1.2 },
        intensity: 0.9,
        description: "Morning in America; economic recovery; Cold War confidence; low-anxiety landslide",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_H", "ZS"],
        secondaryAxis: ["CU", "CD", "ONT_S"],
        dormant: ["MOR", "PRO", "COM", "PF", "TRB", "ENG"],
        description: "Economic optimism vs. sacrifice; Cold War strength; prosperity election",
    },
    candidateActivations: [
        {
            candidateName: "Reagan",
            activationNodes: { ONT_H: 1.4, MAT: 1.3, ZS: 1.2 },
            novelty: 1.2,
        },
        {
            candidateName: "Mondale",
            activationNodes: { MAT: 1.3, ONT_S: 5.3, PRO: 1.2 },
            novelty: 1.0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1988: Bush vs Dukakis — 'Read my lips', Willie Horton, Cold War ending
// ─────────────────────────────────────────────────────────────────────────────
const context1988 = {
    year: 1988,
    zeitgeist: {
        era: "reagan",
        nodeWeights: { CD: 1.4, MAT: 1.2 },
        intensity: 0.8,
        description: "Prosperity + Cold War winding down; low stakes; culture-war wedge issues emerge",
    },
    issueLandscape: {
        primaryAxis: ["CD", "MAT", "MOR"],
        secondaryAxis: ["CU", "PRO", "ZS"],
        dormant: ["COM", "ONT_H", "ONT_S", "PF", "TRB", "ENG"],
        description: "Willie Horton and culture wedges; 'L-word' liberalism vs. Reagan continuity",
    },
    candidateActivations: [
        {
            candidateName: "Bush",
            activationNodes: { CD: 1.3, MAT: 1.2, MOR: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "Dukakis",
            activationNodes: { PRO: 1.3, ONT_H: 1.2 },
            novelty: 1.0,
            threatActivation: { CD: 1.4, MOR: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1992: Clinton vs Bush vs Perot — 'It's the economy, stupid'
// ─────────────────────────────────────────────────────────────────────────────
const context1992 = {
    year: 1992,
    zeitgeist: {
        era: "reagan",
        nodeWeights: { MAT: 1.8, ONT_S: 5.5, PF: 0.7, CU: 1.3 },
        intensity: 1.1,
        description: "Recession, end of Cold War identity vacuum, generational change; Perot disruption",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "CU"],
        secondaryAxis: ["CD", "COM", "ZS", "ENG"],
        dormant: ["MOR", "PRO", "ONT_H", "PF", "TRB"],
        description: "'It's the economy, stupid' + trade/globalization + generational change; Cold War over",
    },
    candidateActivations: [
        {
            candidateName: "Clinton",
            activationNodes: { MAT: 1.4, COM: 1.3, ONT_H: 1.3, ENG: 1.3 },
            novelty: 1.3,
        },
        {
            candidateName: "Bush",
            activationNodes: { CU: 1.2, PRO: 1.2 },
            novelty: 0.8,
        },
        {
            candidateName: "Perot",
            activationNodes: { MAT: 1.3, ONT_S: 5.5, PF: 0.6, ZS: 1.4 },
            novelty: 1.5,
            threatActivation: { ONT_S: 5.2 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1996: Clinton vs Dole — Dot-com boom, low stakes, Dole's age
// ─────────────────────────────────────────────────────────────────────────────
const context1996 = {
    year: 1996,
    zeitgeist: {
        era: "third-way",
        nodeWeights: { ONT_S: 0.6, ZS: 0.6 },
        intensity: 0.7,
        description: "Dot-com boom, peace, welfare reform done; low-stakes election; Clinton coasts",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "CD", "COM"],
        secondaryAxis: ["CU", "PRO", "ONT_H"],
        dormant: ["MOR", "ZS", "ONT_S", "PF", "TRB", "ENG"],
        description: "Prosperity and centrism; Dole struggles for traction; 'bridge to 21st century'",
    },
    candidateActivations: [
        {
            candidateName: "Clinton",
            activationNodes: { COM: 1.3, MAT: 1.2, ONT_H: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "Dole",
            activationNodes: { PRO: 1.2, CD: 1.2 },
            novelty: 0.8,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2000: Gore vs Bush — Prosperity, 'compassionate conservatism', Florida
// ─────────────────────────────────────────────────────────────────────────────
const context2000 = {
    year: 2000,
    zeitgeist: {
        era: "third-way",
        nodeWeights: { CD: 1.2, MOR: 1.2 },
        intensity: 0.8,
        description: "Peace and prosperity; culture wars simmer; 'people vs. powerful' vs. compassionate conservatism",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "CD", "MOR"],
        secondaryAxis: ["PRO", "COM", "CU", "ONT_H"],
        dormant: ["ZS", "ONT_S", "PF", "TRB", "ENG"],
        description: "Dueling centrisms; emerging culture war on values; policy wonk vs. likability",
    },
    candidateActivations: [
        {
            candidateName: "Gore",
            activationNodes: { MAT: 1.3, ONT_H: 1.2, CU: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "Bush",
            activationNodes: { CD: 1.2, MOR: 1.3, COM: 1.2 },
            novelty: 1.2,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2004: Kerry vs Bush — 9/11 aftermath, Iraq War, 'Swift Boat'
// ─────────────────────────────────────────────────────────────────────────────
const context2004 = {
    year: 2004,
    zeitgeist: {
        era: "third-way",
        nodeWeights: { ZS: 2.0, TRB: 1.8, CD: 1.5, CU: 1.4, ENG: 1.3 },
        intensity: 1.3,
        description: "Post-9/11 security election; Iraq War divides; 'with us or against us' framing",
    },
    issueLandscape: {
        primaryAxis: ["ZS", "TRB", "CU"],
        secondaryAxis: ["CD", "PRO", "MOR", "ENG"],
        dormant: ["MAT", "COM", "ONT_H", "ONT_S", "PF"],
        description: "Security dominates: Iraq, terrorism, patriotism; gay marriage as wedge; faith vs. nuance",
    },
    candidateActivations: [
        {
            candidateName: "Kerry",
            activationNodes: { CU: 1.3, PRO: 1.3, MOR: 1.2 },
            novelty: 1.0,
        },
        {
            candidateName: "Bush",
            activationNodes: { ZS: 1.5, TRB: 1.4, CD: 1.3, ENG: 1.3 },
            novelty: 1.0,
            threatActivation: { CU: 1.3, PRO: 1.2 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2008: Obama vs McCain — FINANCIAL CRISIS, 'Hope and Change', historic
// ─────────────────────────────────────────────────────────────────────────────
const context2008 = {
    year: 2008,
    zeitgeist: {
        era: "polarization",
        nodeWeights: { MAT: 2.2, ONT_S: 4.0, ONT_H: 1.5, ENG: 1.5, ZS: 1.3 },
        intensity: 1.4,
        description: "Financial crisis + Iraq fatigue; historic candidacy; 'hope and change' vs. 'country first'",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "ONT_H"],
        secondaryAxis: ["ENG", "CU", "ZS", "CD"],
        dormant: ["MOR", "PRO", "COM", "PF", "TRB"],
        description: "Economic collapse is THE issue; systemic failure; generational/racial transformation",
    },
    candidateActivations: [
        {
            candidateName: "Obama",
            activationNodes: { ONT_H: 1.5, MAT: 1.3, ONT_S: 5.4, ENG: 1.5 },
            novelty: 1.8,
        },
        {
            candidateName: "McCain",
            activationNodes: { ZS: 1.3, PRO: 1.2, CU: 1.2 },
            novelty: 1.0,
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2012: Obama vs Romney — Slow recovery, '47%', 'you didn't build that'
// ─────────────────────────────────────────────────────────────────────────────
const context2012 = {
    year: 2012,
    zeitgeist: {
        era: "polarization",
        nodeWeights: { MAT: 1.5, ONT_S: 5.4, PF: 1.3, TRB: 1.3 },
        intensity: 1.0,
        description: "Slow recovery; ACA as lightning rod; growing polarization; '47%' crystallizes class divide",
    },
    issueLandscape: {
        primaryAxis: ["MAT", "ONT_S", "PF"],
        secondaryAxis: ["CD", "TRB", "MOR", "COM"],
        dormant: ["CU", "PRO", "ZS", "ONT_H", "ENG"],
        description: "Role of government in recovery; class divide; partisan identity sharpens",
    },
    candidateActivations: [
        {
            candidateName: "Obama",
            activationNodes: { MAT: 1.3, CD: 1.2, PF: 1.3, TRB: 1.2 },
            novelty: 1.1,
        },
        {
            candidateName: "Romney",
            activationNodes: { MAT: 1.4, ONT_S: 5.2 },
            novelty: 1.0,
            threatActivation: { MAT: 1.3, ONT_S: 5.2 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2016: Trump vs Clinton — Populist revolt, emails, 'drain the swamp'
// ─────────────────────────────────────────────────────────────────────────────
const context2016 = {
    year: 2016,
    zeitgeist: {
        era: "polarization",
        nodeWeights: { CD: 2.0, TRB: 2.0, ONT_S: 5.8, ZS: 1.6, PF: 1.4, ENG: 1.4 },
        intensity: 1.4,
        description: "Populist revolt; cultural backlash; institutional distrust; realignment-level disruption",
    },
    issueLandscape: {
        primaryAxis: ["CD", "TRB", "ONT_S"],
        secondaryAxis: ["ZS", "MAT", "PF", "ENG"],
        dormant: ["CU", "MOR", "PRO", "COM", "ONT_H"],
        description: "Cultural identity and system legitimacy; populism vs. establishment; 'drain the swamp'",
    },
    candidateActivations: [
        {
            candidateName: "Trump",
            activationNodes: { CD: 1.6, TRB: 1.6, ONT_S: 5.5, ZS: 1.5, ENG: 1.4 },
            novelty: 1.8,
            threatActivation: { CD: 1.5, PRO: 1.5, MOR: 1.3, ONT_S: 5.3 },
        },
        {
            candidateName: "Clinton",
            activationNodes: { PRO: 1.3, CU: 1.2, MAT: 1.2 },
            novelty: 1.2,
            threatActivation: { CD: 1.3, TRB: 1.2 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2020: Biden vs Trump — COVID-19, George Floyd, 'soul of the nation'
// ─────────────────────────────────────────────────────────────────────────────
const context2020 = {
    year: 2020,
    zeitgeist: {
        era: "polarization",
        nodeWeights: { CD: 2.0, ONT_S: 4.0, PRO: 1.8, TRB: 1.8, MOR: 1.5, ENG: 1.5 },
        intensity: 1.5,
        description: "COVID pandemic + racial justice protests + democratic norms crisis; existential framing on both sides",
    },
    issueLandscape: {
        primaryAxis: ["PRO", "ONT_S", "CD"],
        secondaryAxis: ["TRB", "MOR", "MAT", "ENG"],
        dormant: ["CU", "ZS", "COM", "ONT_H", "PF"],
        description: "Democracy and norms vs. system overhaul; pandemic response; racial justice; unprecedented mobilization",
    },
    candidateActivations: [
        {
            candidateName: "Biden",
            activationNodes: { PRO: 1.5, COM: 1.3, MOR: 1.3 },
            novelty: 1.0,
            threatActivation: { PRO: 1.4, ONT_S: 5.3 },
        },
        {
            candidateName: "Trump",
            activationNodes: { CD: 1.5, TRB: 1.6, ONT_S: 5.5, ENG: 1.4 },
            novelty: 1.2,
            threatActivation: { PRO: 1.6, MOR: 1.4, CD: 1.5, ONT_S: 5.4 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2024: Trump vs Harris — Post-Jan 6, inflation, democracy on ballot
// ─────────────────────────────────────────────────────────────────────────────
const context2024 = {
    year: 2024,
    zeitgeist: {
        era: "polarization",
        nodeWeights: { PRO: 1.8, CD: 1.8, TRB: 1.8, ONT_S: 5.6, MAT: 1.5, ENG: 1.5 },
        intensity: 1.4,
        description: "Post-January 6 democracy fears + inflation + historic candidates on both sides; existential framing",
    },
    issueLandscape: {
        primaryAxis: ["PRO", "CD", "MAT"],
        secondaryAxis: ["TRB", "ONT_S", "MOR", "ENG"],
        dormant: ["CU", "ZS", "COM", "ONT_H", "PF"],
        description: "Democracy vs. authoritarianism framing + economy/inflation + cultural identity war",
    },
    candidateActivations: [
        {
            candidateName: "Trump",
            activationNodes: { CD: 1.5, TRB: 1.6, ONT_S: 5.5, MAT: 1.3, ENG: 1.4 },
            novelty: 1.3,
            threatActivation: { PRO: 1.7, MOR: 1.4, CD: 1.4, ONT_S: 5.4 },
        },
        {
            candidateName: "Harris",
            activationNodes: { PRO: 1.4, MOR: 1.3, CD: 1.3, ENG: 1.3 },
            novelty: 1.4,
            threatActivation: { CD: 1.4, TRB: 1.3 },
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// Export
// ─────────────────────────────────────────────────────────────────────────────
export const CONTEXTS_1920_2024 = [
    context1920,
    context1924,
    context1928,
    context1932,
    context1936,
    context1940,
    context1944,
    context1948,
    context1952,
    context1956,
    context1960,
    context1964,
    context1968,
    context1972,
    context1976,
    context1980,
    context1984,
    context1988,
    context1992,
    context1996,
    context2000,
    context2004,
    context2008,
    context2012,
    context2016,
    context2020,
    context2024,
];
//# sourceMappingURL=contexts-1920-2024.js.map