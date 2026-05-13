import { gaussian } from "./rng.js";
// Jitter an archetype's continuous node positions with Gaussian noise.
// sigma = 0 returns a structural clone (deterministic).
// Salience, anti markers, and categorical probs are preserved exactly —
// the noise is strictly in continuous-position space per the eval spec.
export function jitterArchetype(arch, sigma, rng) {
    const nodes = {};
    for (const [nodeId, t] of Object.entries(arch.nodes)) {
        if (t.kind === "continuous") {
            let p = t.pos;
            if (sigma > 0)
                p = Math.round(t.pos + gaussian(rng) * sigma);
            const clamped = Math.max(1, Math.min(5, p));
            nodes[nodeId] = { kind: "continuous", pos: clamped, sal: t.sal, anti: t.anti };
        }
        else {
            nodes[nodeId] = { kind: "categorical", probs: [...t.probs], sal: t.sal, antiCats: t.antiCats };
        }
    }
    return { ...arch, nodes: nodes };
}
//# sourceMappingURL=noise.js.map