import type { Archetype, QuestionDef, QuestionUiType } from "../types.js";
export interface NodeFinalSnapshot {
    continuous: Record<string, {
        posDist: number[];
        salDist: number[];
        touches: number;
    }>;
    categorical: Record<string, {
        catDist: number[];
        salDist: number[];
        touches: number;
    }>;
    trbAnchor: {
        dist: number[];
        touches: number;
    };
}
export interface NodeDelta {
    nodeId: string;
    kind: "continuous" | "categorical" | "anchor";
    posBefore?: number[];
    posAfter?: number[];
    catBefore?: number[];
    catAfter?: number[];
    salBefore?: number[];
    salAfter?: number[];
    anchorBefore?: number[];
    anchorAfter?: number[];
}
export interface QuestionTrajectory {
    qIdx: number;
    questionId: number;
    uiType: QuestionUiType;
    touchedNodes: NodeDelta[];
}
export interface SimOpts {
    noiseSigma: number;
    seed: number;
    maxQuestions: number;
    captureDistances: boolean;
    captureNodeStates: boolean;
}
export interface SimRun {
    archetypeId: string;
    archetypeName: string;
    noiseSigma: number;
    seed: number;
    resultId: string;
    resultName: string;
    correct: boolean;
    questionsAnswered: number;
    /** Lower = better match. Replaces the pre-Phase-3 `topPosterior`. */
    leaderDistance: number;
    /** (d_second - d_leader) / d_leader. Replaces the pre-Phase-3 posterior `margin`. */
    gapRatio: number;
    rank: number;
    top5: string[];
    stopFired: string;
    /** Detected via the pre-computed family index (runner-up ∈ leader's family set). */
    familyPairDetected: {
        top1: string;
        top2: string;
    } | null;
    distancesFinal?: Record<string, number>;
    nodeTrajectory?: QuestionTrajectory[];
    nodeFinalState?: NodeFinalSnapshot;
}
export declare function simulateOne(target: Archetype, archetypes: Archetype[], questions: QuestionDef[], opts?: Partial<SimOpts>): SimRun;
