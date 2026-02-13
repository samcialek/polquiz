// PRISM Archetype Behavior Mappings
// Deterministic mapping from archetype to political behavior

const ARCHETYPE_BEHAVIORS = {
  "100": {
    name: "Fully Automated Luxury Communist",
    tier: "T2",
    usPattern: "D",
    taiwan: "SWING",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "001": {
    name: "Hopeful Democrat",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "002": {
    name: "Sunrise Conservative",
    tier: "T1",
    usPattern: "R",
    taiwan: "KMT>DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "003": {
    name: "Heritage Conservative",
    tier: "T1",
    usPattern: "R+64G",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "004": {
    name: "Heritage Fortress Conservative",
    tier: "T1",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "005": {
    name: "Quiet Middle",
    tier: "T1",
    usPattern: "X",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "007": {
    name: "Prosperity Democrat",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "008": {
    name: "Institutional Progressive",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "009": {
    name: "Global Citizen Liberal",
    tier: "T1",
    usPattern: "I",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "010": {
    name: "Full Spectrum Conservative",
    tier: "T1",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "011": {
    name: "Class Conflict Progressive",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "012": {
    name: "Markets-First Conservative",
    tier: "T1",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "013": {
    name: "Statistical Middle",
    tier: "T1",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "016": {
    name: "Evidence-Based Progressive",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP>TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "018": {
    name: "Movement Conservative",
    tier: "T1",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "019": {
    name: "Expanding Pie Moderate",
    tier: "T1",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "D", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "020": {
    name: "Parish Traditionalist",
    tier: "T1",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "022": {
    name: "Identity-Rooted Progressive",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "024": {
    name: "Movement Progressive",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "025": {
    name: "Prophetic Progressive",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP>TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "027": {
    name: "Idealist Progressive",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "028": {
    name: "Entrepreneurial Conservative",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "029": {
    name: "Quiet Conservative",
    tier: "T2",
    usPattern: "R",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "031": {
    name: "Siege Mentality Partisan",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "032": {
    name: "Neighborhood Democrat",
    tier: "T2",
    usPattern: "D",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "R", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "034": {
    name: "Rising Tide Social Democrat",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "035": {
    name: "Free-Thinking Moderate",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "036": {
    name: "Optimistic Progressive",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "037": {
    name: "Deliberative Centrist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "038": {
    name: "Cosmopolitan Centrist",
    tier: "T2",
    usPattern: "I",
    taiwan: "DPP>TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "I", "1984": "D", "1988": "D", "1992": "P", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "040": {
    name: "Win-Win Centrist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "D", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "041": {
    name: "All-In Traditionalist",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "042": {
    name: "Borderless Moderate",
    tier: "T2",
    usPattern: "X",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "043": {
    name: "Common Ground Seeker",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "044": {
    name: "Neoliberal Progressive",
    tier: "T2",
    usPattern: "R",
    taiwan: "DPP>KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "D", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "045": {
    name: "Policy Over Party",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "046": {
    name: "Solutions-Oriented Moderate",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "D", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "047": {
    name: "Hardline Movement Conservative",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "049": {
    name: "Global Markets Libertarian",
    tier: "T2",
    usPattern: "R",
    taiwan: "DPP>KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "050": {
    name: "Data-Driven Democrat",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "051": {
    name: "Working-Class Traditionalist",
    tier: "T2",
    usPattern: "D",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "R", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "052": {
    name: "Cosmopolitan Libertarian",
    tier: "T2",
    usPattern: "R",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "D", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "053": {
    name: "Culturally Cautious Centrist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "055": {
    name: "Conflict-Minded Progressive",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "056": {
    name: "Structure and Community",
    tier: "T2",
    usPattern: "I",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "058": {
    name: "Community-Rooted Progressive",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "DISSIDENT",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "059": {
    name: "Independent Social Democrat",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP>TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "060": {
    name: "Mutual Aid Progressive",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP>TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "061": {
    name: "Neoliberal",
    tier: "T2",
    usPattern: "R",
    taiwan: "DPP>KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "062": {
    name: "Ordoliberal",
    tier: "T2",
    usPattern: "R+20B+PR",
    taiwan: "DPP",
    prc: "DISSIDENT",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "063": {
    name: "Christian Democrat",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "064": {
    name: "Market Socialist",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP>KMT",
    prc: "INCOMPATIBLE",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "065": {
    name: "Georgist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP>DPP",
    prc: "INCOMPATIBLE",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "066": {
    name: "Civic Republican",
    tier: "T2",
    usPattern: "R+20B+PR",
    taiwan: "DPP>KMT",
    prc: "INCOMPATIBLE",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "067": {
    name: "Communitarian Centrist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "068": {
    name: "Third Way Democrat",
    tier: "T2",
    usPattern: "I",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "070": {
    name: "Rockefeller Republican",
    tier: "T2",
    usPattern: "R",
    taiwan: "DPP>KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "D", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "071": {
    name: "Catholic Worker",
    tier: "T2",
    usPattern: "D",
    taiwan: "SWING",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "072": {
    name: "Distributist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "074": {
    name: "Localist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "077": {
    name: "Conservative Socialist",
    tier: "T2",
    usPattern: "D",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "R", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "078": {
    name: "National Conservative",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "079": {
    name: "Civic Nationalist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP>KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "081": {
    name: "Minarchist",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT>TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "082": {
    name: "Anarcho-Communist",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP>KMT",
    prc: "CRITICAL",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "085": {
    name: "Primitivist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "086": {
    name: "Transhumanist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "088": {
    name: "Meritocrat",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT>DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "089": {
    name: "Elitist Democrat",
    tier: "T2",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "091": {
    name: "Fortress Traditionalist",
    tier: "T2",
    usPattern: "I",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "092": {
    name: "National Bolshevik",
    tier: "T2",
    usPattern: "D",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "R", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "093": {
    name: "Traditional Cosmopolitan",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "094": {
    name: "Post-Left Anarchist",
    tier: "T2",
    usPattern: "D",
    taiwan: "SWING",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "095": {
    name: "Dark Enlightenment",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP>KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "096": {
    name: "Radical Centrist",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "097": {
    name: "Anti-Politics",
    tier: "T2",
    usPattern: "I",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "098": {
    name: "Techno-Feudalist",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT>DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "099": {
    name: "Post-Scarcity Utopian",
    tier: "T2",
    usPattern: "D",
    taiwan: "SWING",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M01": {
    name: "Civic Watchdog",
    tier: "MEANS",
    usPattern: "D+PR",
    taiwan: "DPP>TPP",
    prc: "INCOMPATIBLE",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M02": {
    name: "Constitutional Purist",
    tier: "MEANS",
    usPattern: "I+PR",
    taiwan: "TPP",
    prc: "INCOMPATIBLE",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M03": {
    name: "Norm Guardian",
    tier: "MEANS",
    usPattern: "R+20B+PR",
    taiwan: "KMT",
    prc: "INCOMPATIBLE",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "D", "2024": "R" }
  },
  "M04": {
    name: "Procedural Progressive",
    tier: "MEANS",
    usPattern: "D+PR",
    taiwan: "DPP",
    prc: "DISSIDENT",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M05": {
    name: "Deliberative Democrat",
    tier: "MEANS",
    usPattern: "D+PR",
    taiwan: "DPP",
    prc: "DISSIDENT",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M07": {
    name: "Rationalist Technocrat",
    tier: "MEANS",
    usPattern: "R+20B+PR",
    taiwan: "DPP>KMT",
    prc: "INCOMPATIBLE",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "D", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M08": {
    name: "Prophetic Witness",
    tier: "MEANS",
    usPattern: "D",
    taiwan: "TPP>DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M10": {
    name: "Burkean Epistemicist",
    tier: "MEANS",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M11": {
    name: "Armchair Analyst",
    tier: "MEANS",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M12": {
    name: "Deliberative Moderate",
    tier: "MEANS",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M13": {
    name: "Pastoral Moderate",
    tier: "MEANS",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M14": {
    name: "Prophetic Proceduralist",
    tier: "MEANS",
    usPattern: "I+PR",
    taiwan: "TPP",
    prc: "INCOMPATIBLE",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "D", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "M15": {
    name: "Evidence-First Reformer",
    tier: "MEANS",
    usPattern: "D+PR",
    taiwan: "DPP",
    prc: "DISSIDENT",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "G01": {
    name: "Survival Pragmatist",
    tier: "GATE",
    usPattern: "I",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "G02": {
    name: "Cynical Fatalist",
    tier: "GATE",
    usPattern: "I+16T+PP",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "G03": {
    name: "Private-Life Traditionalist",
    tier: "GATE",
    usPattern: "I",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "G04": {
    name: "Private-Life Progressive",
    tier: "GATE",
    usPattern: "D",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "G05": {
    name: "Family-First Quietist",
    tier: "GATE",
    usPattern: "I",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "G06": {
    name: "Identity Networker",
    tier: "GATE",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "G07": {
    name: "Rule-Following Citizen",
    tier: "GATE",
    usPattern: "I+PR",
    taiwan: "TPP>DPP",
    prc: "INCOMPATIBLE",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "G08": {
    name: "Local Problem Solver",
    tier: "GATE",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "G09": {
    name: "Volunteer Helper",
    tier: "GATE",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "G10": {
    name: "Online Spectator",
    tier: "GATE",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "G11": {
    name: "Quiet Dissident",
    tier: "GATE",
    usPattern: "X",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "G12": {
    name: "Identity-First Loyalist",
    tier: "GATE",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "G13": {
    name: "Workplace Organizer",
    tier: "GATE",
    usPattern: "D",
    taiwan: "SWING",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "G14": {
    name: "Service-State Reliant",
    tier: "GATE",
    usPattern: "I+PR",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "G15": {
    name: "Order-Seeking Loyalist",
    tier: "GATE",
    usPattern: "I",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "R01": {
    name: "Grievance-Activated Populist",
    tier: "REALITY",
    usPattern: "I+16T+PP",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "R02": {
    name: "Anti-System Voter",
    tier: "REALITY",
    usPattern: "I+16T+PP",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "R03": {
    name: "Decline-Anxious Swing Voter",
    tier: "REALITY",
    usPattern: "X+PP",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "R04": {
    name: "Activated Fatalist",
    tier: "REALITY",
    usPattern: "I+16T+PP",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "R05": {
    name: "Single-Issue Activator",
    tier: "REALITY",
    usPattern: "I",
    taiwan: "NONE",
    prc: "APOLITICAL",
    votes: { "1964": "NV", "1968": "NV", "1972": "NV", "1976": "NV", "1980": "NV", "1984": "NV", "1988": "NV", "1992": "NV", "1996": "NV", "2000": "NV", "2004": "NV", "2008": "NV", "2012": "NV", "2016": "NV", "2020": "NV", "2024": "NV" }
  },
  "O01": {
    name: "Revolutionary Progressive",
    tier: "ONT",
    usPattern: "I",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O02": {
    name: "Cynical Progressive",
    tier: "ONT",
    usPattern: "I",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O03": {
    name: "Transformational Leftist",
    tier: "ONT",
    usPattern: "I",
    taiwan: "SWING",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O04": {
    name: "Doomer Leftist",
    tier: "ONT",
    usPattern: "I",
    taiwan: "SWING",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O05": {
    name: "Vanguard Paternalist",
    tier: "ONT",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O06": {
    name: "Order-First Redistributionist",
    tier: "ONT",
    usPattern: "I",
    taiwan: "SWING",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O07": {
    name: "Restorationist Conservative",
    tier: "ONT",
    usPattern: "I",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "O08": {
    name: "Decline Manager Conservative",
    tier: "ONT",
    usPattern: "I",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "O09": {
    name: "National Greatness Conservative",
    tier: "ONT",
    usPattern: "I",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "O10": {
    name: "Fortress Conservative",
    tier: "ONT",
    usPattern: "I",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "O11": {
    name: "Transformational Utopian",
    tier: "ONT",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O12": {
    name: "Ethical Incrementalist",
    tier: "ONT",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O13": {
    name: "Rising Tide Progressive",
    tier: "ONT",
    usPattern: "I",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O14": {
    name: "Pragmatic Establishmentarian",
    tier: "ONT",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O15": {
    name: "Crusading Partisan",
    tier: "ONT",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O16": {
    name: "Bunker Partisan",
    tier: "ONT",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O20": {
    name: "Defensive Democrat",
    tier: "ONT",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O21": {
    name: "Opportunity Republican",
    tier: "ONT",
    usPattern: "R",
    taiwan: "KMT>DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O22": {
    name: "Decline-Anxious Republican",
    tier: "ONT",
    usPattern: "R",
    taiwan: "KMT>DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O23": {
    name: "Restorationist Conservative",
    tier: "ONT",
    usPattern: "I",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "O25": {
    name: "Aspirational Kitchen Table Democrat",
    tier: "ONT",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "O26": {
    name: "Anxious Kitchen Table Democrat",
    tier: "ONT",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N03": {
    name: "Civic Engagement Maximalist",
    tier: "T2",
    usPattern: "I",
    taiwan: "DPP>TPP",
    prc: "DISSIDENT",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "I", "1984": "D", "1988": "D", "1992": "P", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N04": {
    name: "Digital Warrior",
    tier: "GATE",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N05": {
    name: "Armchair Combatant",
    tier: "GATE",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N08": {
    name: "Reluctant Partisan",
    tier: "T2",
    usPattern: "I",
    taiwan: "TPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "I", "1984": "R", "1988": "R", "1992": "P", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N10": {
    name: "Social Conservative Moderate",
    tier: "T2",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "N11": {
    name: "Progressive Civic Nationalist",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N12": {
    name: "Social Civic Nationalist",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP>KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N13": {
    name: "Vigilant Democrat",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N14": {
    name: "Fortress Conservative",
    tier: "T1",
    usPattern: "R",
    taiwan: "KMT",
    prc: "PRAGMATIC",
    votes: { "1964": "R", "1968": "R", "1972": "R", "1976": "R", "1980": "R", "1984": "R", "1988": "R", "1992": "R", "1996": "R", "2000": "R", "2004": "R", "2008": "R", "2012": "R", "2016": "R", "2020": "R", "2024": "R" }
  },
  "N15": {
    name: "Fighting-Class Democrat",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  },
  "N16": {
    name: "Social Gospel Voter",
    tier: "T1",
    usPattern: "D",
    taiwan: "DPP",
    prc: "PRAGMATIC",
    votes: { "1964": "D", "1968": "D", "1972": "R", "1976": "D", "1980": "D", "1984": "D", "1988": "D", "1992": "D", "1996": "D", "2000": "D", "2004": "D", "2008": "D", "2012": "D", "2016": "D", "2020": "D", "2024": "D" }
  }
};


// Get behavior for an archetype
function getArchetypeBehavior(archetypeId) {
  return ARCHETYPE_BEHAVIORS[archetypeId];
}

// Get historical vote for archetype in a specific year
function getHistoricalVote(archetypeId, year) {
  const behavior = ARCHETYPE_BEHAVIORS[archetypeId];
  if (!behavior) return null;
  return behavior.votes[year] || null;
}

// Get Taiwan alignment for archetype
function getTaiwanAlignment(archetypeId) {
  const behavior = ARCHETYPE_BEHAVIORS[archetypeId];
  if (!behavior) return null;
  return behavior.taiwan;
}

// Get PRC relationship for archetype
function getPrcRelationship(archetypeId) {
  const behavior = ARCHETYPE_BEHAVIORS[archetypeId];
  if (!behavior) return null;
  return behavior.prc;
}

// Vote code meanings
const VOTE_CODES = {
  "D": "Democratic",
  "R": "Republican",
  "W": "Wallace (1968)",
  "I": "Independent/Anderson",
  "P": "Perot (1992)",
  "N": "Nader (2000)",
  "NV": "Non-Voter"
};

// Taiwan party meanings
const TAIWAN_PARTIES = {
  "DPP": "Democratic Progressive Party",
  "KMT": "Kuomintang",
  "TPP": "Taiwan People's Party",
  "SWING": "Swing voter",
  "NONE": "Non-voter"
};

// PRC relationship meanings
const PRC_STATUSES = {
  "COMPLIANT": "Accepts CCP rule, participates in system",
  "NATIONALIST": "Strong Chinese nationalism, supports party-state",
  "CRITICAL": "Critical but works within system",
  "DISSIDENT": "Actively opposes regime",
  "APOLITICAL": "Avoids politics entirely",
  "EMIGRANT": "Seeks to leave or has left",
  "INCOMPATIBLE": "Worldview fundamentally incompatible with CCP",
  "PRAGMATIC": "Navigates system pragmatically"
};
