/**
 * EIG (Expected Information Gain) selector — post-ADR-003.
 *
 * Archetypes are now just labels for the respondent's final node signature.
 * The selector optimizes for *signature precision* rather than archetype
 * discrimination. Concretely:
 *
 *   1. Active-node filter. A continuous node is "active" when the respondent's
 *      expected salience E[sal] is ≥ 2.0. We only drill position on active
 *      nodes — there's no point pinning down someone's redistribution stance
 *      when they don't care about economics.
 *
 *   2. Per-node convergence. Once a node's position posterior has a dominant
 *      mode (max prob ≥ 0.45) after at least two position touches, or we've
 *      spent the per-node touch budget (3), we stop probing its position.
 *
 *   3. Information-gain scoring. A candidate question's score is the sum over
 *      its touchProfile of weight × entropy(relevant posterior), filtering out
 *      touches on already-converged or inactive targets.
 *
 *   4. Stop rule. Answered questions cap at MAX_QUESTIONS; below MIN_QUESTIONS
 *      we always continue. In the 20–40 band we stop when every active node
 *      has converged (position for continuous, category for categorical) and
 *      the TRB anchor is settled.
 */
import type { CategoricalNodeId, ContinuousNodeId, NodeId, QuestionDef, RespondentState, SalienceDist, TouchTarget } from "../types.js";
declare function entropy(dist: readonly number[]): number;
declare function expectedSal(dist: SalienceDist): number;
declare function isActive(state: RespondentState, nodeId: NodeId): boolean;
declare function roleTouches(state: RespondentState, nodeId: NodeId, role: TouchTarget["role"], questionsById: ReadonlyMap<number, QuestionDef>): number;
declare function posConverged(state: RespondentState, nodeId: ContinuousNodeId, questionsById: ReadonlyMap<number, QuestionDef>): boolean;
declare function salConverged(state: RespondentState, nodeId: NodeId): boolean;
declare function catConverged(state: RespondentState, nodeId: CategoricalNodeId): boolean;
declare function trbConverged(state: RespondentState): boolean;
export declare function selectNextQuestionEIG(state: RespondentState, available: QuestionDef[], questionsById: ReadonlyMap<number, QuestionDef>): QuestionDef | null;
export declare function shouldStopEIG(state: RespondentState, questionsById: ReadonlyMap<number, QuestionDef>): boolean;
export declare const EIG_INTERNALS: {
    ACTIVE_SAL_THRESHOLD: number;
    POS_CONVERGED_MAX_PROB: number;
    SAL_CONVERGED_MAX_PROB: number;
    CAT_CONVERGED_MAX_PROB: number;
    AES_CAT_CONVERGED_MAX_PROB: number;
    TRB_CONVERGED_MAX_PROB: number;
    POS_MIN_TOUCHES_TO_LOCK: number;
    MAX_POSITION_TOUCHES: number;
    MIN_QUESTIONS: number;
    MAX_QUESTIONS: number;
    isActive: typeof isActive;
    roleTouches: typeof roleTouches;
    posConverged: typeof posConverged;
    salConverged: typeof salConverged;
    catConverged: typeof catConverged;
    trbConverged: typeof trbConverged;
    entropy: typeof entropy;
    expectedSal: typeof expectedSal;
};
export {};
