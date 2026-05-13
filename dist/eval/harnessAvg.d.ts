import type { Archetype, QuestionDef } from "../types.js";
export interface CompareRun {
    archetypeId: string;
    archetypeName: string;
    noiseSigma: number;
    seed: number;
    questionsAnswered: number;
    /** Bayesian engine result */
    bayes: {
        top1: string;
        top3: string[];
        top5: string[];
        correct1: boolean;
        correct3: boolean;
        correct5: boolean;
        leaderDist: number;
        gapRatio: number;
        targetRank: number;
    };
    /** Averaging engine result */
    avg: {
        top1: string;
        top3: string[];
        top5: string[];
        correct1: boolean;
        correct3: boolean;
        correct5: boolean;
        leaderDist: number;
        gapRatio: number;
        targetRank: number;
    };
    /** Did the two engines agree on top-1? */
    agree1: boolean;
    agree3: boolean;
    agree5: boolean;
}
export interface CompareOpts {
    noiseSigma: number;
    seed: number;
    maxQuestions: number;
}
export declare function simulateCompared(target: Archetype, archetypes: Archetype[], questions: QuestionDef[], opts?: Partial<CompareOpts>): CompareRun;
