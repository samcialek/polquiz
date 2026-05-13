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
import eraJson from "./era-activations.json" with { type: "json" };
const CANONICAL_NODES = new Set([
    "MAT", "CD", "CU", "MOR",
    "PRO", "COM", "EPS", "AES",
    "ZS", "ONT_H", "ONT_S",
    "PF", "TRB",
]);
const MIN_YEAR = 1789;
const MAX_YEAR = 2024;
function loadAndValidate() {
    const parsed = eraJson;
    if (!parsed.elections || typeof parsed.elections !== "object") {
        throw new Error("era-activations.json: missing or malformed 'elections' map");
    }
    const out = {};
    for (const [yearStr, entry] of Object.entries(parsed.elections)) {
        if (!/^\d{4}$/.test(yearStr)) {
            throw new Error(`era-activations.json: key ${yearStr} is not a 4-digit year`);
        }
        const year = Number(yearStr);
        if (year < MIN_YEAR || year > MAX_YEAR) {
            throw new Error(`era-activations.json: year ${year} outside [${MIN_YEAR}, ${MAX_YEAR}]`);
        }
        if (!Array.isArray(entry.activated) || !Array.isArray(entry.super_activated)) {
            throw new Error(`era-activations.json: year ${year} missing activated/super_activated arrays`);
        }
        if (!["A", "B", "C"].includes(entry.tier)) {
            throw new Error(`era-activations.json: year ${year} has invalid tier ${entry.tier}`);
        }
        for (const n of entry.activated) {
            if (!CANONICAL_NODES.has(n)) {
                throw new Error(`era-activations.json: year ${year} activated contains non-canonical node '${n}'`);
            }
        }
        for (const n of entry.super_activated) {
            if (!CANONICAL_NODES.has(n)) {
                throw new Error(`era-activations.json: year ${year} super_activated contains non-canonical node '${n}'`);
            }
            if (!entry.activated.includes(n)) {
                throw new Error(`era-activations.json: year ${year} super_activated '${n}' missing from activated`);
            }
        }
        out[year] = entry;
    }
    return out;
}
export const ERA_ACTIVATIONS = loadAndValidate();
export function getActivationMultiplier(year, nodeId) {
    const entry = ERA_ACTIVATIONS[year];
    if (!entry)
        return 1;
    if (entry.super_activated.includes(nodeId))
        return 3;
    if (entry.activated.includes(nodeId))
        return 2;
    return 1;
}
//# sourceMappingURL=era-activations.js.map