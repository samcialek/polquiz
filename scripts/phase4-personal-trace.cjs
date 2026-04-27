// Phase 5A personal-trace stability check.
// For each of 4 representative respondent profiles, run predictVote across
// all 60 elections and report top-3 candidates per profile per representative
// elections. Look for: implausible matches, profiles converging on same
// candidate, profiles all preferring "winners" (would be a Pattern A regression).

const path = require("node:path");
const { ELECTIONS } = require(path.resolve(__dirname, "../dist/historical/candidates.js"));
const { predictVote } = require(path.resolve(__dirname, "../dist/historical/respondentVoteChoice.js"));
const { getContext } = require(path.resolve(__dirname, "../dist/historical/contexts.js"));

// Build a NodeSignature with pos + sal per node. Using high salience (2-3) for
// nodes that define the profile and lower (0-1) for nodes the profile doesn't care about.
function sig(o) {
  const s = {};
  for (const [k, v] of Object.entries(o)) {
    s[k] = { pos: v[0], sal: v[1] };
  }
  return s;
}

const PROFILES = {
  "Jeffersonian-libertarian": sig({
    MAT:    [4, 3], // hard for limited gov't / low taxes
    CD:     [3, 1],
    CU:     [3, 1],
    MOR:    [3, 1],
    PRO:    [4, 2], // constitutional
    COM:    [3, 1],
    ZS:     [2, 1], // positive-sum free-trade
    ONT_H:  [3, 1],
    ONT_S:  [2, 3], // anti-strong-state, low institutional capacity belief
    PF:     [2, 0], // independent-leaning
    TRB:    [2, 0],
    ENG:    [4, 0],
  }),
  "Left-populist": sig({
    MAT:    [1, 3], // max redistribution
    CD:     [3, 1], // mixed (cultural is not the focus)
    CU:     [3, 1],
    MOR:    [3, 1], // narrow-ish (class focus)
    PRO:    [3, 1],
    COM:    [2, 2], // uncompromising
    ZS:     [4, 3], // class war framing
    ONT_H:  [4, 1],
    ONT_S:  [4, 2], // institutional reformer (post-Phase-4: this is what defines real left-populism vs. anti-systemic nihilism)
    PF:     [3, 0],
    TRB:    [4, 1], // class tribal
    ENG:    [5, 0],
  }),
  "Religious-conservative": sig({
    MAT:    [4, 1],
    CD:     [5, 3], // max-traditional
    CU:     [2, 2], // particularist
    MOR:    [2, 2], // narrow scope (in-faith)
    PRO:    [4, 2], // constitutional originalism
    COM:    [2, 1],
    ZS:     [3, 1],
    ONT_H:  [5, 2], // moral formation tradition
    ONT_S:  [3, 1],
    PF:     [4, 0],
    TRB:    [4, 1], // religious tribal
    ENG:    [4, 0],
  }),
  "Institutional-progressive": sig({
    MAT:    [2, 3], // redistributive lean
    CD:     [2, 2],
    CU:     [4, 2], // pluralist
    MOR:    [4, 3], // wide moral circle
    PRO:    [5, 2], // proceduralist
    COM:    [4, 2],
    ZS:     [2, 1],
    ONT_H:  [4, 1],
    ONT_S:  [5, 3], // max institutional capacity belief
    PF:     [4, 0],
    TRB:    [3, 0],
    ENG:    [5, 0],
  }),
};

// Pick representative elections to display. Mix of each Phase-4-touched era
// plus some pre-/post-correction touchstones for sanity.
const ELECTIONS_TO_TRACE = [
  1808, 1816, 1824, 1864, 1880, 1896, 1900, 1908, 1912, 1920, 1924, 1932, 1948, 1968, 1980, 1984, 2008, 2012, 2016, 2024,
];

console.log("# Phase 5A: Personal-trace stability check\n");

for (const [profileName, signature] of Object.entries(PROFILES)) {
  console.log(`\n## Profile: ${profileName}`);
  console.log(`Top picks per election (lowest ideological distance, before party-loyalty/non-ideo modifiers):`);
  console.log(`year | top-1 (dist) | top-2 (dist) | top-3 (dist) | abstain?`);
  console.log(`-----|--------------|--------------|--------------|--------`);

  for (const year of ELECTIONS_TO_TRACE) {
    const election = ELECTIONS.find(e => e.year === year);
    const ctx = getContext(year);
    if (!election || !ctx) { console.log(`${year} | (no data)`); continue; }
    const pred = predictVote(signature, election.candidates, ctx, "engaged", null, null, null);
    const sorted = [...pred.candidates].sort((a, b) => a.ideologicalDistance - b.ideologicalDistance);
    const t1 = sorted[0], t2 = sorted[1], t3 = sorted[2];
    const fmt = c => c ? `${c.name.slice(0, 11).padEnd(11)} (${c.ideologicalDistance.toFixed(2)})` : "—";
    console.log(`${year} | ${fmt(t1)} | ${fmt(t2)} | ${fmt(t3)} | ${pred.decision === "vote" ? "no" : "ABSTAIN"}`);
  }
}
