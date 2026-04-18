import type { Archetype, ArchetypeNodeTemplate } from "../types.js";
import type { Rng } from "./rng.js";
import { gaussian } from "./rng.js";

// Jitter an archetype's continuous node positions with Gaussian noise.
// sigma = 0 returns a structural clone (deterministic).
// Salience, anti markers, and categorical probs are preserved exactly —
// the noise is strictly in continuous-position space per the eval spec.
export function jitterArchetype(arch: Archetype, sigma: number, rng: Rng): Archetype {
  const nodes: Record<string, ArchetypeNodeTemplate> = {};
  for (const [nodeId, t] of Object.entries(arch.nodes)) {
    if (t.kind === "continuous") {
      let p = t.pos as number;
      if (sigma > 0) p = Math.round(t.pos + gaussian(rng) * sigma);
      const clamped = Math.max(1, Math.min(5, p)) as 1 | 2 | 3 | 4 | 5;
      nodes[nodeId] = { kind: "continuous", pos: clamped, sal: t.sal, anti: t.anti };
    } else {
      nodes[nodeId] = { kind: "categorical", probs: [...t.probs] as typeof t.probs, sal: t.sal, antiCats: t.antiCats };
    }
  }
  return { ...arch, nodes: nodes as Archetype["nodes"] };
}
