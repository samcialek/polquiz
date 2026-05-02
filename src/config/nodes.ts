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

/**
 * Two distinctions matter for these three nodes (PF / TRB / ENG):
 *
 * 1. CONCEPTUAL — the salience axis collapse (ADR-005, 2026-04-23).
 *    PF and TRB had their salience axis collapsed because the conceptual
 *    distinction broke down: a person can't coherently be "extremely
 *    partisan but it doesn't matter to them," same for tribal pull. For
 *    these two, position IS activation: pos=1 means non-partisan / non-
 *    tribal, pos=5 means partisan-fused / tribal.
 *
 *    ENG is conceptually a full continuous node with an independent
 *    salience axis. Someone can be highly engaged overall but only on
 *    certain dimensions — engagement is not pure activation.
 *
 *    `SAL_COLLAPSED_NODES` and `isSalCollapsedNode()` express this
 *    conceptual distinction (PF/TRB only).
 *
 * 2. IMPLEMENTATION — what the engine currently does.
 *    Both ENG questions and ENG archetype entries currently lack
 *    salience evidence (questions declare ENG position touches only;
 *    archetypes specify ENG.pos but not ENG.sal). Until that authored
 *    data lands, the engine derives ENG salience from ENG position as a
 *    temporary computational shortcut — same treatment as PF/TRB.
 *
 *    `SELF_NODES` and `isSelfNode()` express this implementation
 *    detail (PF/TRB/ENG, "what the engine currently treats as having
 *    pos-derived sal"). Engine call sites that ask "should I derive sal
 *    from pos?" should keep using `isSelfNode`.
 *
 * To fully promote ENG to first-class continuous-with-independent-sal:
 *   1. Add `sal` field to every archetype's ENG entry in archetypes.ts
 *   2. Author ENG sal touches with sal evidence in questions.full.ts
 *      and questions.representative.ts (~9 ENG-touching questions)
 *   3. Move ENG out of SELF_NODES (leave SAL_COLLAPSED_NODES alone)
 *   4. Engine sites in respondentSignature.ts and archetypeDistance.ts
 *      will then compute ENG sal from salDist like MAT/CD/etc.
 */
export const SAL_COLLAPSED_NODES = ["PF", "TRB"] as const;
export const SELF_NODES = ["PF", "TRB", "ENG"] as const;

export function isSalCollapsedNode(nodeId: string): nodeId is (typeof SAL_COLLAPSED_NODES)[number] {
  return (SAL_COLLAPSED_NODES as readonly string[]).includes(nodeId);
}

export function isSelfNode(nodeId: string): nodeId is (typeof SELF_NODES)[number] {
  return (SELF_NODES as readonly string[]).includes(nodeId);
}
