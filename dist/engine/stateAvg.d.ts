import type { ContinuousNodeId, CategoricalNodeId, NodeId, TrbAnchorDist } from "../types.js";
export interface AvgAccum {
    sum: number;
    count: number;
}
export interface AvgContinuousNodeState {
    pos: AvgAccum;
    sal: AvgAccum;
    touches: number;
    touchTypes: Set<string>;
}
export interface AvgCategoricalNodeState {
    catSum: [number, number, number, number, number, number];
    catCount: number;
    sal: AvgAccum;
    touches: number;
    touchTypes: Set<string>;
}
export interface AvgRespondentState {
    answers: Record<number, unknown>;
    continuous: Record<ContinuousNodeId, AvgContinuousNodeState>;
    categorical: Record<CategoricalNodeId, AvgCategoricalNodeState>;
    trbAnchor: {
        dist: TrbAnchorDist;
        touches: number;
    };
    archetypeDistances: Record<string, number>;
    currentLeader?: string;
    consecutiveLeadCount?: number;
}
export declare function createInitialStateAvg(): AvgRespondentState;
export declare function getPos(state: AvgRespondentState, node: ContinuousNodeId): number;
export declare function getSal(state: AvgRespondentState, node: NodeId): number;
export declare function getCat(state: AvgRespondentState, node: CategoricalNodeId): [number, number, number, number, number, number];
export declare function addPos(state: AvgRespondentState, node: ContinuousNodeId, code: number): void;
export declare function addSal(state: AvgRespondentState, node: NodeId, code: number): void;
export declare function addCat(state: AvgRespondentState, node: CategoricalNodeId, dist: [number, number, number, number, number, number]): void;
export declare function registerTouchAvg(state: AvgRespondentState, node: NodeId, touchType: string): void;
export declare function posCodeFromDist(dist: readonly number[] | undefined): number | null;
export declare function salCodeFromDist(dist: readonly number[] | undefined): number | null;
