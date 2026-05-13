import type { Archetype } from "../types.js";
import type { AvgRespondentState } from "./stateAvg.js";
export declare function archetypeDistanceAvg(state: AvgRespondentState, archetype: Archetype): number;
export declare function viableByDistanceAvg(state: AvgRespondentState, archetypes: Archetype[], ratio?: number): Archetype[];
export declare function topKDistanceWeightsAvg(state: AvgRespondentState, archetypes: Archetype[], k?: number): {
    archetype: Archetype;
    distance: number;
    weight: number;
}[];
export declare function recomputeArchetypeDistancesAvg(state: AvgRespondentState, archetypes: Archetype[]): void;
