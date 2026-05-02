import type { NodeDef } from "../types.js";
export declare const NODE_DEFS: NodeDef[];
export declare const CONTINUOUS_NODES: Array<"MAT" | "CD" | "CU" | "MOR" | "PRO" | "COM" | "ZS" | "ONT_H" | "ONT_S" | "PF" | "TRB" | "ENG">;
export declare const CATEGORICAL_NODES: Array<"EPS" | "AES">;
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
export declare const SAL_COLLAPSED_NODES: readonly ["PF", "TRB"];
export declare const SELF_NODES: readonly ["PF", "TRB", "ENG"];
export declare function isSalCollapsedNode(nodeId: string): nodeId is (typeof SAL_COLLAPSED_NODES)[number];
export declare function isSelfNode(nodeId: string): nodeId is (typeof SELF_NODES)[number];
