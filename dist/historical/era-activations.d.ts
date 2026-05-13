/**
 * PRISM era-activation map loader.
 *
 * Canonical data lives in era-activations.json. This module:
 *   - declares the EraActivation type,
 *   - loads + validates the JSON at module-load time,
 *   - exports getActivationMultiplier(year, nodeId) returning 3/2/1.
 *
 * Mechanism: during respondent-to-candidate distance compute, each node's
 * archetype salience is multiplied by getActivationMultiplier(year, node).
 * 3 = super_activated (rare, ~3 elections), 2 = activated, 1 = inactive.
 *
 * Never-activate nodes: six nodes (PF, COM, EPS, AES, ONT_H, ZS) have zero
 * activations across the full 1789-2024 map. This is a deliberate finding
 * from the four-LLM convergence — these nodes are archetype-defining but do
 * not organize US-presidential vote-sorting at the election level. They
 * always get multiplier 1 and still contribute via the archetype's own
 * salience; they just never receive an era-context boost. Do not add them
 * to the map without new evidence and a deliberate human decision.
 */
export type EraActivation = {
    activated: string[];
    super_activated: string[];
    tier: "A" | "B" | "C";
    notes: string;
};
export declare const ERA_ACTIVATIONS: Readonly<Record<number, EraActivation>>;
export declare function getActivationMultiplier(year: number, nodeId: string): number;
