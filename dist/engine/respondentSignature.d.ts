import type { RespondentState, NodeId } from "../types.js";
/**
 * Respondent's per-node expected position and salience, derived from the
 * posterior state at quiz end. Shape mirrors the {pos, sal} fields on an
 * archetype so downstream distance code can consume either.
 *
 * Scale matches candidate/archetype encoding:
 *   - continuous nodes: pos on the 1-5 scale
 *   - categorical nodes (EPS/AES): pos as 0-5 expected index
 *   - salience on the 0-3 scale
 */
export interface NodeSignatureEntry {
    pos: number;
    sal: number;
    /** Full categorical distribution for EPS/AES (added 2026-04-25 for vote
     *  alignment via per-category match rather than expected-index proxy).
     *  Undefined for continuous nodes. */
    catDist?: number[];
}
export type NodeSignature = Partial<Record<NodeId, NodeSignatureEntry>>;
export declare function respondentSignatureFromState(state: RespondentState): NodeSignature;
