import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";
import { computeEngagementLabel } from "../engine/engagementLabel.js";
import type {
  RespondentState,
  ContinuousNodeState,
  CategoricalNodeState,
  ContinuousPosDist,
  TrbAnchorDist,
  MorBoundaries,
  MorBoundariesNodeState,
} from "../types.js";

// Delta at position p (1..5) → ContinuousPosDist
function posAt(p: number): ContinuousPosDist {
  const d: number[] = [0, 0, 0, 0, 0];
  d[p - 1] = 1;
  return d as ContinuousPosDist;
}

function makeContinuous(p: number, salTier: 0 | 1 | 2 | 3 = 3): ContinuousNodeState {
  // salTier: 0 = sal-0 dominant (policy-thin), 3 = sal-3 dominant (policy-loud).
  // Identity-primary cases need salTier ≤ 1 on most nodes for the
  // policy-thinness gate to pass.
  const salDist: [number, number, number, number] = [0, 0, 0, 0];
  salDist[salTier] = 1;
  return {
    posDist: posAt(p),
    salDist,
    touches: 1,
    touchTypes: new Set(),
    status: "live_resolved",
  };
}

function makeCategorical(): CategoricalNodeState {
  return {
    catDist: [1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6, 1 / 6],
    salDist: [1, 0, 0, 0],
    touches: 0,
    touchTypes: new Set(),
    status: "unknown",
  };
}

// Anchor order: national, ideological, religious, class, ethnic_racial, gender, sexual, global, mixed_none
function anchorDist(topIdx: number): TrbAnchorDist {
  const d = [0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05, 0.05];
  d[topIdx] = 0.6;
  return d as TrbAnchorDist;
}

// 6.E.2b: Anchor index → MOR boundary key. Mirrors anchorToBoundary() in
// update.ts and matches the resolver's "sexual collapses into gender" rule.
const ANCHOR_IDX_TO_BOUNDARY: Array<keyof MorBoundaries | null> = [
  "national",       // 0
  "ideological",    // 1
  "religious",      // 2
  "class",          // 3
  "ethnic_racial",  // 4
  "gender",         // 5
  "gender",         // 6 sexual → gender (collapsed per resolver design)
  null,             // 7 global → no boundary
  null,             // 8 mixed_none → no boundary
];

/**
 * Build a morBoundaries node state mirroring the test's TRB/PF/anchor inputs.
 * Replaces what the bridge in update.ts would have produced over a quiz walk;
 * here we synthesize directly so unit tests can target specific resolver
 * states (latent / active / dominant / none).
 */
function makeMorBoundaries(
  trbPos: number,
  pfPos: number,
  topAnchorIdx: number,
): MorBoundariesNodeState {
  // Intensity: linear in max(TRB, PF) — 1→0, 5→3. High enough to clear the
  // active gate (≥ 2.25) when both TRB and PF are at 5.
  const intensity = Math.max(0, Math.min(3, ((Math.max(trbPos, pfPos) - 1) / 4) * 3));
  // Default boundaries low so load is driven by the named anchor only.
  const boundaries: MorBoundaries = {
    national: 0.2, ethnic_racial: 0.2, religious: 0.2, class: 0.2,
    ideological: 0.2, gender: 0.2, political_tribe: 0.2,
  };
  const boundaryKey = ANCHOR_IDX_TO_BOUNDARY[topAnchorIdx] ?? null;
  if (boundaryKey) boundaries[boundaryKey] = 0.85; // clears the active load gate (≥ 0.65)
  // PF lifts political_tribe boundary as per the bridge mapping.
  if (pfPos >= 4) boundaries.political_tribe = Math.max(boundaries.political_tribe, 0.6);
  return {
    boundaries,
    intensity,
    touches: {},
    touchTypes: new Set(["test"]),
    status: "live_resolved",
  };
}

// Policy-loud nodes (high salience) vs policy-thin (low salience). The
// identity-primary policy-thinness gate (ADR-009 P3.5) requires most non-SELF
// nodes to be policy-thin; only TRB/PF/ENG and the touched signaling nodes
// should be policy-loud.
const POLICY_NODES_NON_SELF = ["MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S"];
const SELF_NODES = ["PF", "TRB", "ENG"];

function buildState(
  positions: Partial<Record<string, number>>,
  topAnchorIdx: number,
  opts: { policyThin?: boolean } = {}
): RespondentState {
  const continuousIds = [...POLICY_NODES_NON_SELF, ...SELF_NODES];
  const continuous: Record<string, ContinuousNodeState> = {};
  for (const id of continuousIds) {
    const pos = positions[id] ?? 3;
    // Policy-thin: non-SELF nodes mentioned in `positions` (the "loud" signals)
    // get sal-3, all other non-SELF nodes get sal-0. SELF nodes always sal-3.
    let salTier: 0 | 1 | 2 | 3;
    if (SELF_NODES.includes(id)) {
      salTier = 3;
    } else if (opts.policyThin) {
      // Identity-primary requires policy salience to be uniformly low; even
      // policy nodes that carry the "signaling" position evidence stay sal-0
      // because the gate caps highSaliencePolicyCount at 2. Position info
      // alone (without salience) is what makes a Feminist Voter distinct
      // from a Progressive Activist — same MOR position, different MOR salience.
      salTier = 0;
    } else {
      salTier = 3;
    }
    continuous[id] = makeContinuous(pos, salTier);
  }
  const trbPos = positions["TRB"] ?? 3;
  const pfPos = positions["PF"] ?? 3;
  return {
    answers: {},
    continuous: continuous as RespondentState["continuous"],
    categorical: {
      EPS: makeCategorical(),
      AES: makeCategorical(),
    },
    trbAnchor: { dist: anchorDist(topAnchorIdx), touches: 1 },
    morBoundaries: makeMorBoundaries(trbPos, pfPos, topAnchorIdx),
    archetypeDistances: {},
  };
}

interface Case {
  name: string;
  state: RespondentState;
  demographics: Record<string, string>;
  expectLabel: string | undefined;
  expectState: string;
}

const cases: Case[] = [
  {
    name: "LGBTQ Voter — sexual anchor + demo_lgbtq=yes + high TRB/PF/ENG",
    state: buildState({ TRB: 5, PF: 5, ENG: 4 }, 6, { policyThin: true }), // sexual = idx 6
    demographics: { demo_lgbtq: "yes" },
    expectLabel: "LGBTQ Voter",
    expectState: "dominant",
  },
  {
    name: "LGBTQ unresolved — sexual anchor but demo_lgbtq missing",
    state: buildState({ TRB: 5, PF: 5, ENG: 4 }, 6),
    demographics: {},
    expectLabel: undefined,
    expectState: "unresolved",
  },
  {
    name: "Feminist Voter — gender anchor + female + progressive signals",
    state: buildState({ TRB: 5, PF: 5, ENG: 4, CD: 1, MOR: 5, ONT_S: 5 }, 5, { policyThin: true }),
    demographics: { demo_gender: "female" },
    expectLabel: "Feminist Voter",
    expectState: "dominant",
  },
  {
    name: "Feminist unresolved — female but insufficient progressive signals",
    state: buildState({ TRB: 5, PF: 5, ENG: 4, CD: 4, MOR: 2, ONT_S: 2 }, 5),
    demographics: { demo_gender: "female" },
    expectLabel: undefined,
    expectState: "unresolved",
  },
  {
    name: "Male Grievance Voter — gender anchor + male + grievance signals",
    state: buildState({ TRB: 5, PF: 5, ENG: 4, ZS: 5, CD: 5, ONT_S: 1 }, 5, { policyThin: true }),
    demographics: { demo_gender: "male" },
    expectLabel: "Male Grievance Voter",
    expectState: "dominant",
  },
  {
    name: "Male unresolved — male but insufficient grievance signals",
    state: buildState({ TRB: 5, PF: 5, ENG: 4, ZS: 2, CD: 2, ONT_S: 4 }, 5),
    demographics: { demo_gender: "male" },
    expectLabel: undefined,
    expectState: "unresolved",
  },
  {
    name: "Black Voter (regression) — racial anchor + black",
    state: buildState({ TRB: 5, PF: 5, ENG: 4 }, 4, { policyThin: true }), // ethnic_racial = idx 4
    demographics: { demo_ethnicity: "black" },
    expectLabel: "Black Voter",
    expectState: "dominant",
  },
  {
    name: "Gate not met — TRB too low",
    state: buildState({ TRB: 2, PF: 2, ENG: 2 }, 6),
    demographics: { demo_lgbtq: "yes" },
    expectLabel: undefined,
    expectState: "none",
  },
];

let pass = 0;
let fail = 0;
for (const c of cases) {
  const result = resolveIdentityPrimary(c.state, computeEngagementLabel(c.state), c.demographics);
  const ok = result.label === c.expectLabel && result.state === c.expectState;
  if (ok) {
    pass++;
    console.log(`PASS  ${c.name}`);
    console.log(`      → state=${result.state} label=${result.label ?? "(none)"} anchor=${result.anchor} conf=${result.confidence ?? "(n/a)"}`);
  } else {
    fail++;
    console.log(`FAIL  ${c.name}`);
    console.log(`      expected: state=${c.expectState} label=${c.expectLabel ?? "(none)"}`);
    console.log(`      got:      state=${result.state} label=${result.label ?? "(none)"} anchor=${result.anchor} conf=${result.confidence ?? "(n/a)"}`);
    console.log(`      reasons:  ${result.reasonCodes.join(", ")}`);
  }
}
console.log();
console.log(`${pass} passed, ${fail} failed (${cases.length} total)`);
if (fail > 0) process.exit(1);
