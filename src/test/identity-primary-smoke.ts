import type { RespondentState } from "../types.js";
import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";
import { computeEngagementLabel } from "../engine/engagementLabel.js";

function resolve(state: RespondentState, demographics: Parameters<typeof resolveIdentityPrimary>[2]) {
  return resolveIdentityPrimary(state, computeEngagementLabel(state), demographics);
}

function assert(condition: unknown, message: string): void {
  if (!condition) throw new Error(message);
}

function pointDist5(v: number): [number, number, number, number, number] {
  const idx = Math.max(0, Math.min(4, Math.round(v) - 1));
  const out: [number, number, number, number, number] = [0, 0, 0, 0, 0];
  out[idx] = 1;
  return out;
}

function zeroSal(): [number, number, number, number] {
  return [1, 0, 0, 0];
}

type AnchorKind = "ethnic_racial" | "religious" | "global";

/**
 * Build a respondent state with materialized moralCircle affinity that
 * exceeds the ADR-007 gate thresholds on the requested scope. Used to
 * exercise the ADR-007 IDP resolver path (T6).
 */
function makeState(anchor: AnchorKind): RespondentState {
  const universalAffinity = anchor === "global" ? 90 : 40;
  const scopedAffinities = {
    national: anchor === "global" ? 30 : 30,
    religious: anchor === "religious" ? 90 : 30,
    ethnic_racial: anchor === "ethnic_racial" ? 90 : 25,
    class: 30,
    gender: 25,
    ideological: 35,
  };
  // Compute excess and intensity inline to materialize a valid affinity.
  // 6-scope model (2026-05-07): sexual + political_camp removed.
  const SCOPES = ["national","religious","ethnic_racial","class","gender","ideological"] as const;
  const excess = {} as Record<typeof SCOPES[number], number>;
  let sumSq = 0;
  for (const s of SCOPES) {
    const e = Math.max(0, scopedAffinities[s] - universalAffinity);
    excess[s] = e;
    sumSq += e * e;
  }
  const intensity01 = Math.min(1, Math.sqrt(sumSq) / 100);
  const active = SCOPES.filter(s => excess[s] > 0);

  return {
    answers: {},
    continuous: {
      MAT: { posDist: pointDist5(3), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      CD: { posDist: pointDist5(5), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      CU: { posDist: pointDist5(3), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      MOR: { posDist: pointDist5(3), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      PRO: { posDist: pointDist5(3), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      COM: { posDist: pointDist5(3), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      ZS: { posDist: pointDist5(5), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      ONT_H: { posDist: pointDist5(3), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      ONT_S: { posDist: pointDist5(2), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      PF: { posDist: pointDist5(5), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      TRB: { posDist: pointDist5(5), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      ENG: { posDist: pointDist5(4), salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
    },
    categorical: {
      EPS: { catDist: [1, 0, 0, 0, 0, 0], salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
      AES: { catDist: [1, 0, 0, 0, 0, 0], salDist: zeroSal(), touches: 0, touchTypes: new Set(), status: "unknown" },
    },
    trbAnchor: {
      // Legacy ADR-006 anchor distribution; kept for compatibility with
      // any code that still reads it. ADR-007 IDP path reads moralCircle
      // below directly.
      dist: [
        0,
        0,
        anchor === "religious" ? 1 : 0,
        0,
        anchor === "ethnic_racial" ? 1 : 0,
        0,
        0,
        anchor === "global" ? 1 : 0,
        0,
      ] as any,
      touches: 1,
    },
    moralCircle: {
      affinity: {
        universalAffinity,
        scopedAffinities,
        excessAffinities: excess,
        activeBoundaries: [...active],
        intensity01,
        intensity03: 3 * intensity01,
      },
      touchCount: 1,
      accumulator: { universalSum: universalAffinity, universalCount: 1, scopedSums: scopedAffinities, scopedCounts: Object.fromEntries(SCOPES.map(s => [s, 1])) as any },
    },
    archetypeDistances: {},
  };
}

const black = resolve(makeState("ethnic_racial"), { demo_ethnicity: "black" });
assert(black.label === "Black Voter", `expected Black Voter, got ${JSON.stringify(black)}`);

const white = resolve(makeState("ethnic_racial"), { demo_ethnicity: "white" });
assert(white.label === "White Grievance Voter", `expected White Grievance Voter, got ${JSON.stringify(white)}`);

const evangelical = resolve(makeState("religious"), { demo_religion: "christian" });
assert(evangelical.label === "Evangelical Voter", `expected Evangelical Voter, got ${JSON.stringify(evangelical)}`);

// Universalist profile (high universal, no scoped excess) → state="none"
// because no scope has positive excess. Pre-ADR-007 returned "unresolved"
// (legacy path treated `global` as a valid anchor); ADR-007 §"Active
// Boundary Rule" says only excess > 0 is active, so a pure universalist
// has no IDP overlay regardless of demographics. Both states are valid
// "no IDP overlay" outcomes; assertion accepts either.
const unresolved = resolve(makeState("global"), {});
assert(
  unresolved.state === "unresolved" || unresolved.state === "none",
  `expected no-IDP outcome, got ${JSON.stringify(unresolved)}`,
);
assert(
  unresolved.label === undefined,
  `expected no IDP label for universalist, got ${unresolved.label}`,
);

console.log("identity-primary smoke: ok");
