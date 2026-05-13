import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { POPULATION_WEIGHTS as TS_POPULATION_WEIGHTS } from "../config/population-weights.js";
import { isSelfNode } from "../config/nodes.js";
export const IDENTITY_PRIMARY_IDS = new Set(["141", "142", "143", "144", "145", "146"]);
export const POPULATION_ADAPTER_VARIANTS = [
    "raw_current",
    "base_only",
    "redistribute_identity_overlay",
    "identity_coalition_proxy",
];
export const POPULATION_WEIGHT_SOURCE_IDS = [
    "auto",
    "ts_static",
    "live_output",
];
const CONTINUOUS_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM",
    "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CATEGORICAL_NODES = ["EPS", "AES"];
const IDENTITY_PARTY = {
    "141": "D", // Black Voter
    "142": "R", // White Grievance Voter
    "143": "R", // Evangelical Voter
    "144": "D", // LGBTQ Voter
    "145": "D", // Feminist Voter
    "146": "R", // Male Grievance Voter
};
const IDENTITY_COALITION_PROXY_IDS = ["010", "005", "045", "048", "088"];
function round(value, digits = 8) {
    const k = 10 ** digits;
    return Math.round(value * k) / k;
}
function activeArchetypes() {
    return ARCHETYPES.filter((a) => a.active !== false);
}
function loadJsonWeights() {
    const p = join("output", "live-data", "population-weights.json");
    if (!existsSync(p))
        return null;
    return JSON.parse(readFileSync(p, "utf-8"));
}
export function loadPopulationWeightSource(sourceId = "auto") {
    const active = activeArchetypes();
    const jsonWeights = loadJsonWeights();
    const audits = [
        auditWeightSource("src/config/population-weights.ts", TS_POPULATION_WEIGHTS, active),
    ];
    if (jsonWeights)
        audits.push(auditWeightSource("output/live-data/population-weights.json", jsonWeights, active));
    if (sourceId === "ts_static") {
        return {
            source: "src/config/population-weights.ts",
            weights: TS_POPULATION_WEIGHTS,
            audits,
        };
    }
    if (sourceId === "live_output") {
        if (!jsonWeights)
            throw new Error("Requested live_output population weights, but output/live-data/population-weights.json was not found.");
        return {
            source: "output/live-data/population-weights.json",
            weights: jsonWeights,
            audits,
        };
    }
    return {
        source: jsonWeights ? "output/live-data/population-weights.json" : "src/config/population-weights.ts",
        weights: jsonWeights ?? TS_POPULATION_WEIGHTS,
        audits,
    };
}
function auditWeightSource(label, weights, active) {
    const activeIds = new Set(active.map((a) => a.id));
    const archetypeIds = new Set(ARCHETYPES.map((a) => a.id));
    const keys = Object.keys(weights);
    const missingActive = active.filter((a) => weights[a.id] == null).map((a) => a.id);
    const inactiveWeighted = ARCHETYPES
        .filter((a) => a.active === false && weights[a.id] != null)
        .map((a) => a.id);
    const unknownKeys = keys.filter((k) => !archetypeIds.has(k));
    const inactiveOrUnknownMass = keys
        .filter((k) => !activeIds.has(k))
        .reduce((sum, k) => sum + (weights[k] ?? 0), 0);
    const activeMass = active.reduce((sum, a) => sum + (weights[a.id] ?? 0), 0);
    const totalMass = keys.reduce((sum, k) => sum + (weights[k] ?? 0), 0);
    return {
        label,
        weightKeys: keys.length,
        totalMass: round(totalMass),
        activeMass: round(activeMass),
        inactiveOrUnknownMass: round(inactiveOrUnknownMass),
        missingActive,
        inactiveWeighted,
        unknownKeys,
    };
}
function categoricalPos(probs) {
    return probs.reduce((sum, p, i) => sum + p * i, 0);
}
export function archetypeSignature(arch) {
    const sig = {};
    for (const node of CONTINUOUS_NODES) {
        const template = arch.nodes[node];
        if (!template || template.kind !== "continuous")
            continue;
        const ct = template;
        sig[node] = {
            pos: ct.pos,
            sal: isSelfNode(node) ? ((ct.pos - 1) / 4) * 3 : (ct.sal ?? 0),
        };
    }
    for (const node of CATEGORICAL_NODES) {
        const template = arch.nodes[node];
        if (!template || template.kind !== "categorical")
            continue;
        const ct = template;
        sig[node] = {
            pos: categoricalPos(ct.probs),
            sal: ct.sal,
            catDist: [...ct.probs],
        };
    }
    return sig;
}
export function continuousPos(arch, node, fallback = 3) {
    const template = arch.nodes[node];
    return template?.kind === "continuous" ? template.pos : fallback;
}
export function engagementFromArch(arch) {
    const eng = continuousPos(arch, "ENG", 3);
    if (eng < 2)
        return "apolitical";
    if (eng < 3)
        return "casual";
    if (eng < 4)
        return "engaged";
    return "highly-engaged";
}
export function inferPartyID(arch) {
    if (IDENTITY_PARTY[arch.id])
        return IDENTITY_PARTY[arch.id];
    if (/democrat/i.test(arch.name))
        return "D";
    if (/republican|conservative|evangelical|white grievance|male grievance/i.test(arch.name))
        return "R";
    const mat = continuousPos(arch, "MAT");
    const cd = continuousPos(arch, "CD");
    const cu = continuousPos(arch, "CU");
    const mor = continuousPos(arch, "MOR");
    const onts = continuousPos(arch, "ONT_S");
    const trb = continuousPos(arch, "TRB");
    let d = 0;
    let r = 0;
    if (mat <= 2)
        d += 2;
    if (mat >= 4)
        r += 2;
    if (cd <= 2)
        d += 1;
    if (cd >= 4)
        r += 1;
    if (cu >= 4)
        d += 1;
    if (cu <= 2)
        r += 1;
    if (mor <= 2)
        d += 1;
    if (mor >= 4)
        r += 1;
    if (onts >= 4)
        d += 1;
    if (onts <= 2)
        r += 1;
    if (trb >= 4 && cd >= 4)
        r += 1;
    if (d >= r + 2)
        return "D";
    if (r >= d + 2)
        return "R";
    return null;
}
function normalizedWeightsForVariant(variant, sourceWeights) {
    const active = activeArchetypes();
    const activeIds = new Set(active.map((a) => a.id));
    const weights = {};
    let excludedIdentityMass = 0;
    let redistributedIdentityMass = 0;
    for (const arch of active) {
        const w = sourceWeights[arch.id] ?? 0;
        if (variant !== "raw_current" && IDENTITY_PRIMARY_IDS.has(arch.id)) {
            excludedIdentityMass += w;
            continue;
        }
        weights[arch.id] = w;
    }
    if (variant === "redistribute_identity_overlay") {
        const base = active.filter((a) => !IDENTITY_PRIMARY_IDS.has(a.id));
        for (const identityId of IDENTITY_PRIMARY_IDS) {
            const identityMass = sourceWeights[identityId] ?? 0;
            if (identityMass <= 0)
                continue;
            const party = IDENTITY_PARTY[identityId];
            const recipients = base.filter((a) => inferPartyID(a) === party);
            const denom = recipients.reduce((sum, a) => sum + (sourceWeights[a.id] ?? 0), 0);
            const fallbackDenom = base.reduce((sum, a) => sum + (sourceWeights[a.id] ?? 0), 0);
            const actualRecipients = denom > 0 ? recipients : base;
            const actualDenom = denom > 0 ? denom : fallbackDenom;
            for (const recipient of actualRecipients) {
                const share = actualDenom > 0 ? (sourceWeights[recipient.id] ?? 0) / actualDenom : 1 / actualRecipients.length;
                weights[recipient.id] = (weights[recipient.id] ?? 0) + identityMass * share;
            }
            redistributedIdentityMass += identityMass;
        }
    }
    if (variant === "identity_coalition_proxy") {
        const recipients = active.filter((a) => IDENTITY_COALITION_PROXY_IDS.includes(a.id));
        const denom = recipients.reduce((sum, a) => sum + (sourceWeights[a.id] ?? 0), 0);
        for (const recipient of recipients) {
            const share = denom > 0 ? (sourceWeights[recipient.id] ?? 0) / denom : 1 / recipients.length;
            weights[recipient.id] = (weights[recipient.id] ?? 0) + excludedIdentityMass * share;
        }
        redistributedIdentityMass = excludedIdentityMass;
    }
    const total = Object.entries(weights)
        .filter(([id]) => activeIds.has(id))
        .reduce((sum, [, w]) => sum + w, 0);
    if (total > 0) {
        for (const id of Object.keys(weights))
            weights[id] = weights[id] / total;
    }
    return { weights, excludedIdentityMass, redistributedIdentityMass };
}
export function buildPopulationRuntimes(variant, sourceId = "auto") {
    const active = activeArchetypes();
    const { weights: sourceWeights } = loadPopulationWeightSource(sourceId);
    const { weights } = normalizedWeightsForVariant(variant, sourceWeights);
    return active
        .filter((arch) => weights[arch.id] != null && weights[arch.id] > 0)
        .map((archetype) => ({
        archetype,
        weight: weights[archetype.id] ?? 0,
        sig: archetypeSignature(archetype),
        engagement: engagementFromArch(archetype),
        partyID: inferPartyID(archetype),
        variant,
    }));
}
function weightedMean(runtimes, node) {
    let sum = 0;
    let mass = 0;
    for (const rt of runtimes) {
        const entry = rt.sig[node];
        if (!entry)
            continue;
        sum += rt.weight * entry.pos;
        mass += rt.weight;
    }
    return mass > 0 ? sum / mass : 0;
}
export function auditPopulationAdapter(variant, sourceId = "auto") {
    const active = activeArchetypes();
    const { source, weights: sourceWeights, audits } = loadPopulationWeightSource(sourceId);
    const { excludedIdentityMass, redistributedIdentityMass } = normalizedWeightsForVariant(variant, sourceWeights);
    const runtimes = buildPopulationRuntimes(variant, sourceId);
    const partyMix = {};
    const engagementMix = {};
    for (const rt of runtimes) {
        partyMix[rt.partyID ?? "none"] = (partyMix[rt.partyID ?? "none"] ?? 0) + rt.weight;
        engagementMix[rt.engagement] = (engagementMix[rt.engagement] ?? 0) + rt.weight;
    }
    for (const key of Object.keys(partyMix))
        partyMix[key] = round(partyMix[key]);
    for (const key of Object.keys(engagementMix))
        engagementMix[key] = round(engagementMix[key]);
    const nodeMeans = {};
    for (const node of [...CONTINUOUS_NODES, ...CATEGORICAL_NODES]) {
        nodeMeans[node] = round(weightedMean(runtimes, node), 4);
    }
    return {
        variant,
        source,
        totalArchetypes: ARCHETYPES.length,
        activeArchetypes: active.length,
        includedArchetypes: runtimes.length,
        excludedIdentityPrimaryIds: variant === "raw_current" ? [] : [...IDENTITY_PRIMARY_IDS],
        excludedIdentityPrimaryMass: round(excludedIdentityMass),
        redistributedIdentityPrimaryMass: round(redistributedIdentityMass),
        normalizedIncludedWeight: round(runtimes.reduce((sum, rt) => sum + rt.weight, 0)),
        partyMix,
        engagementMix,
        nodeMeans,
        topIncluded: runtimes
            .slice()
            .sort((a, b) => b.weight - a.weight)
            .slice(0, 25)
            .map((rt) => ({
            id: rt.archetype.id,
            name: rt.archetype.name,
            weight: round(rt.weight, 6),
            partyID: rt.partyID ?? "none",
            engagement: rt.engagement,
        })),
        sourceAudits: audits,
    };
}
export function writePopulationAdapterAudit(path, sourceIds = ["auto"]) {
    const audits = sourceIds.flatMap((sourceId) => POPULATION_ADAPTER_VARIANTS.map((variant) => auditPopulationAdapter(variant, sourceId)));
    writeFileSync(path, JSON.stringify(audits, null, 2), "utf-8");
    return audits;
}
//# sourceMappingURL=populationAdapter.js.map