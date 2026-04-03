import type { NodeDef } from "../types.js";

// ── CANONICAL POLARITY LEGEND (verified against archetype atlas 2026-03-28) ──
//
// ENDS:
//   MAT: 1 = redistribution / egalitarian,          5 = free market / laissez-faire
//   CD:  1 = culturally progressive / open,          5 = culturally traditional / conservative
//   CU:  1 = assimilationist / closed / particularist, 5 = pluralist / open / universalist
//   MOR: 1 = narrow moral circle / particularist,    5 = wide moral circle / universalist
//
// MEANS:
//   PRO: 1 = outcome-focused / anti-procedural,      5 = rules-bound / procedural
//   COM: 1 = uncompromising / principled,             5 = compromising / consensus-seeking
//   EPS: categorical (empiricist, institutionalist, traditionalist, intuitionist, autonomous, nihilist)
//   AES: categorical (statesman, technocrat, pastoral, authentic, fighter, visionary)
//
// REALITY:
//   ZS:    1 = positive-sum / cooperative,            5 = zero-sum / competitive
//   ONT_H: 1 = pessimistic about human nature,       5 = optimistic / perfectible
//   ONT_S: 1 = system broken / deep structural critique, 5 = system working / stable
//
// SELF:
//   PF:  1 = independent / non-partisan,              5 = strong partisan identity
//   TRB: 1 = universalist / low tribal,               5 = tribal / in-group focused
//   ENG: 1 = apolitical / disengaged,                 5 = highly politically engaged

export const NODE_DEFS: NodeDef[] = [
  { id: "MAT", type: "continuous", cluster: "ENDS" },
  { id: "CD", type: "continuous", cluster: "ENDS" },
  { id: "CU", type: "continuous", cluster: "ENDS" },
  { id: "MOR", type: "continuous", cluster: "ENDS" },

  { id: "PRO", type: "continuous", cluster: "MEANS" },
  { id: "EPS", type: "categorical", cluster: "MEANS" },
  { id: "AES", type: "categorical", cluster: "MEANS" },
  { id: "COM", type: "continuous", cluster: "MEANS" },

  { id: "ZS", type: "continuous", cluster: "REALITY" },
  { id: "ONT_H", type: "continuous", cluster: "REALITY" },
  { id: "ONT_S", type: "continuous", cluster: "REALITY" },

  { id: "PF", type: "continuous", cluster: "SELF" },
  { id: "TRB", type: "continuous", cluster: "SELF" },
  { id: "ENG", type: "continuous", cluster: "SELF" }
];

export const CONTINUOUS_NODES = NODE_DEFS.filter(
  (n) => n.type === "continuous"
).map((n) => n.id) as Array<
  | "MAT"
  | "CD"
  | "CU"
  | "MOR"
  | "PRO"
  | "COM"
  | "ZS"
  | "ONT_H"
  | "ONT_S"
  | "PF"
  | "TRB"
  | "ENG"
>;

export const CATEGORICAL_NODES = NODE_DEFS.filter(
  (n) => n.type === "categorical"
).map((n) => n.id) as Array<"EPS" | "AES">;
