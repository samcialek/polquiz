import type { RespondentState } from "../types.js";
import { resolveIdentityPrimary } from "../identity/resolveIdentityPrimary.js";

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

function makeState(anchor: "ethnic_racial" | "religious" | "global"): RespondentState {
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
      dist: [
        anchor === "global" ? 0 : 0,
        0,
        anchor === "religious" ? 1 : 0,
        0,
        anchor === "ethnic_racial" ? 1 : 0,
        anchor === "global" ? 1 : 0,
        0,
      ] as any,
      touches: 1,
    },
    archetypePosterior: {},
  };
}

const black = resolveIdentityPrimary(makeState("ethnic_racial"), { demo_ethnicity: "black" });
assert(black.label === "Black Voter", `expected Black Voter, got ${JSON.stringify(black)}`);

const white = resolveIdentityPrimary(makeState("ethnic_racial"), { demo_ethnicity: "white" });
assert(white.label === "White Grievance Voter", `expected White Grievance Voter, got ${JSON.stringify(white)}`);

const evangelical = resolveIdentityPrimary(makeState("religious"), { demo_religion: "christian" });
assert(evangelical.label === "Evangelical Voter", `expected Evangelical Voter, got ${JSON.stringify(evangelical)}`);

const unresolved = resolveIdentityPrimary(makeState("global"), {});
assert(unresolved.state === "unresolved", `expected unresolved, got ${JSON.stringify(unresolved)}`);

console.log("identity-primary smoke: ok");
