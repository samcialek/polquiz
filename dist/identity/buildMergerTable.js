/**
 * Build the archetype-label merger table from the existing 121 archetypes.
 *
 * For each archetype:
 *   1. Tokenize via the labeler's archetype path (top-N salient, mid-drop rule).
 *   2. Use its existing canonical name as the merger value.
 *   3. Record the resulting (signature → name) entry.
 *
 * Generates entries at three granularities so respondent lookup can match
 * regardless of how many salient nodes they have:
 *   - exact-3 signatures (the archetype's full top-3)
 *   - top-2 subsets (each 2-subset of the top-3)
 *   - top-1 singletons (the most salient token alone) — only when unambiguous
 *     across the bank (else dropped — too many archetypes share a single token).
 *
 * Conflict resolution: when multiple archetypes produce the same signature,
 * pick by tier (T1 wins over T2/T3) then by archetype ID (lower wins). The
 * tier ordering is a proxy for "which name is more iconic / general." Sam can
 * override by editing the JSON afterwards.
 *
 * Run: npx tsx src/identity/buildMergerTable.ts
 * Writes: src/identity/mergerTable.json
 */
import { writeFileSync } from "node:fs";
import { ARCHETYPES } from "../config/archetypes.js";
import { tokenizeArchetype, signatureOf, } from "./archetypeLabeler.js";
/**
 * Merger-table selection rule (different from runtime):
 *   Take top 3 nodes by salience (ties broken by |pos-3|, then by node order).
 *   No threshold — every archetype contributes a 3-token signature even if its
 *   highest sal is only 2.
 *   Mid-bin tokens at rank 2 or 3 still drop (same as runtime), so an
 *   archetype may end up with 1 or 2 tokens if its top-3 by salience includes
 *   mid-position nodes.
 */
function selectArchetypeMergerTokens(entries) {
    const sorted = [...entries].sort((a, b) => b.salience - a.salience);
    const picked = [];
    for (let i = 0; i < sorted.length && picked.length < 3; i++) {
        const e = sorted[i];
        if (picked.length === 0) {
            picked.push(e);
        }
        else {
            if (!e.isCategorical && e.bin === "mid")
                continue;
            picked.push(e);
        }
    }
    return picked;
}
function tierRank(tier) {
    if (tier === "T1")
        return 1;
    if (tier === "T2")
        return 2;
    return 3;
}
const candidates = [];
for (const arch of ARCHETYPES) {
    const allTokens = tokenizeArchetype(arch);
    const picked = selectArchetypeMergerTokens(allTokens);
    if (picked.length === 0)
        continue;
    const tier = arch.tier ?? "T2";
    // Exact-3 (or however many were picked — could be 1, 2, or 3).
    candidates.push({
        signature: signatureOf(picked),
        name: arch.name,
        archId: arch.id,
        tier,
        granularity: picked.length === 1 ? "1-token" : picked.length === 2 ? "2-token" : "3-token",
    });
    // 2-token subsets when we picked 3.
    if (picked.length === 3) {
        for (const [a, b] of [[0, 1], [0, 2], [1, 2]]) {
            const subset = [picked[a], picked[b]];
            candidates.push({
                signature: signatureOf(subset),
                name: arch.name,
                archId: arch.id,
                tier,
                granularity: "2-token",
            });
        }
    }
}
// Group candidates by signature; resolve collisions.
const grouped = new Map();
for (const c of candidates) {
    if (!grouped.has(c.signature))
        grouped.set(c.signature, []);
    grouped.get(c.signature).push(c);
}
const resolved = {};
const collisions = [];
for (const [signature, cs] of grouped) {
    // Prefer 3-token entries over 2-token (more distinctive).
    const sorted = [...cs].sort((a, b) => {
        const rankGran = (g) => g === "3-token" ? 0 : g === "2-token" ? 1 : 2;
        const granDelta = rankGran(a.granularity) - rankGran(b.granularity);
        if (granDelta !== 0)
            return granDelta;
        const tierDelta = tierRank(a.tier) - tierRank(b.tier);
        if (tierDelta !== 0)
            return tierDelta;
        return a.archId.localeCompare(b.archId);
    });
    const winner = sorted[0];
    resolved[signature] = winner.name;
    const uniqueRunners = [...new Set(sorted.slice(1).map(s => s.name))].filter(n => n !== winner.name);
    if (uniqueRunners.length > 0) {
        collisions.push({
            signature,
            chosen: winner.name,
            runners: uniqueRunners,
        });
    }
}
const outPath = "src/identity/mergerTable.json";
writeFileSync(outPath, JSON.stringify(resolved, null, 2), "utf8");
console.log(`Merger table built: ${Object.keys(resolved).length} entries from ${ARCHETYPES.length} archetypes.`);
console.log(`Collisions: ${collisions.length} signatures had multiple archetypes mapped to them.`);
console.log(`Wrote ${outPath}.`);
if (collisions.length > 0) {
    console.log("\n--- Top 20 collisions (chosen | runners) ---");
    for (const c of collisions.slice(0, 20)) {
        console.log(`  [${c.signature}]`);
        console.log(`    → ${c.chosen}  (chosen)`);
        for (const r of c.runners.slice(0, 4))
            console.log(`    · ${r}`);
    }
}
//# sourceMappingURL=buildMergerTable.js.map