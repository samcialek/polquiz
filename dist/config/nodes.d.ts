import type { NodeDef } from "../types.js";
export declare const NODE_DEFS: NodeDef[];
export declare const CONTINUOUS_NODES: Array<"MAT" | "CD" | "CU" | "MOR" | "PRO" | "COM" | "ZS" | "ONT_H" | "ONT_S" | "PF" | "TRB" | "ENG">;
export declare const CATEGORICAL_NODES: Array<"EPS" | "AES">;
/**
 * SELF-cluster nodes (PF / TRB / ENG). Per ADR-005, these collapse position
 * and salience into a single activation scale: pos=1 means "tuned out / non-
 * partisan / non-tribal," pos=5 means "all in / partisan-fused / tribal."
 * The `sal` field is absent from SELF-node archetype entries; the engine
 * skips salDist reads/writes for these nodes.
 */
export declare const SELF_NODES: readonly ["PF", "TRB", "ENG"];
export declare function isSelfNode(nodeId: string): nodeId is (typeof SELF_NODES)[number];
