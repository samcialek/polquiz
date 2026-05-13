import type { Archetype, ContinuousNodeId, PartyID } from "../types.js";
import type { NodeSignature } from "../engine/respondentSignature.js";
import type { EngagementLevel } from "../engine/engagementLabel.js";
export declare const IDENTITY_PRIMARY_IDS: Set<string>;
export declare const POPULATION_ADAPTER_VARIANTS: readonly ["raw_current", "base_only", "redistribute_identity_overlay", "identity_coalition_proxy"];
export type PopulationAdapterVariant = typeof POPULATION_ADAPTER_VARIANTS[number];
export declare const POPULATION_WEIGHT_SOURCE_IDS: readonly ["auto", "ts_static", "live_output"];
export type PopulationWeightSourceId = typeof POPULATION_WEIGHT_SOURCE_IDS[number];
export interface PopulationRuntime {
    archetype: Archetype;
    weight: number;
    sig: NodeSignature;
    engagement: EngagementLevel;
    partyID: PartyID | null;
    variant: PopulationAdapterVariant;
}
export interface WeightSourceAudit {
    label: string;
    weightKeys: number;
    totalMass: number;
    activeMass: number;
    inactiveOrUnknownMass: number;
    missingActive: string[];
    inactiveWeighted: string[];
    unknownKeys: string[];
}
export interface PopulationAdapterAudit {
    variant: PopulationAdapterVariant;
    source: string;
    totalArchetypes: number;
    activeArchetypes: number;
    includedArchetypes: number;
    excludedIdentityPrimaryIds: string[];
    excludedIdentityPrimaryMass: number;
    redistributedIdentityPrimaryMass: number;
    normalizedIncludedWeight: number;
    partyMix: Record<string, number>;
    engagementMix: Record<string, number>;
    nodeMeans: Record<string, number>;
    topIncluded: Array<{
        id: string;
        name: string;
        weight: number;
        partyID: string;
        engagement: string;
    }>;
    sourceAudits: WeightSourceAudit[];
}
export declare function loadPopulationWeightSource(sourceId?: PopulationWeightSourceId): {
    source: string;
    weights: Record<string, number>;
    audits: WeightSourceAudit[];
};
export declare function archetypeSignature(arch: Archetype): NodeSignature;
export declare function continuousPos(arch: Archetype, node: ContinuousNodeId, fallback?: number): number;
export declare function engagementFromArch(arch: Archetype): EngagementLevel;
export declare function inferPartyID(arch: Archetype): PartyID | null;
export declare function buildPopulationRuntimes(variant: PopulationAdapterVariant, sourceId?: PopulationWeightSourceId): PopulationRuntime[];
export declare function auditPopulationAdapter(variant: PopulationAdapterVariant, sourceId?: PopulationWeightSourceId): PopulationAdapterAudit;
export declare function writePopulationAdapterAudit(path: string, sourceIds?: PopulationWeightSourceId[]): PopulationAdapterAudit[];
