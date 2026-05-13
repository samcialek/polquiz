/**
 * Preview: label every archetype using the new salience-driven composer,
 * plus a couple of real respondent dumps Sam has shared.
 *
 * Output: results/identity/label-preview.md
 *
 * Run: npx tsx src/identity/previewLabels.ts
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { ARCHETYPES } from "../config/archetypes.js";
import { labelForArchetype, labelForRespondent, tokenizeArchetype, } from "./archetypeLabeler.js";
const mergerTable = JSON.parse(readFileSync("src/identity/mergerTable.json", "utf8"));
const archRows = [];
let preservedCount = 0;
let mergerHitCount = 0;
for (const arch of ARCHETYPES) {
    const tokensAll = tokenizeArchetype(arch);
    const r = labelForArchetype(arch, mergerTable);
    const preserved = r.label === arch.name;
    if (preserved)
        preservedCount++;
    if (r.source !== "lexicon")
        mergerHitCount++;
    archRows.push({
        id: arch.id,
        oldName: arch.name,
        newLabel: r.label,
        source: r.source,
        signature: r.signature,
        topTokens: tokensAll
            .filter(t => t.salience >= 2)
            .sort((a, b) => b.salience - a.salience)
            .slice(0, 5)
            .map(t => `${t.token}(${t.salience.toFixed(1)})`)
            .join(", "),
        preserved,
    });
}
const samRun1 = {
    label: "Sam — run 95b7ea19 (matched 056)",
    matchedArch: "056 Institutional Leftist",
    state: {
        continuous: {
            MAT: { expectedPos: 1.619, salience: 2.84 },
            CD: { expectedPos: 2.868, salience: 1.91 },
            CU: { expectedPos: 3.226, salience: 2.87 },
            MOR: { expectedPos: 3.703, salience: 2.25 },
            PRO: { expectedPos: 3.728, salience: 2.55 },
            COM: { expectedPos: 2.950, salience: 1.67 },
            ZS: { expectedPos: 2.510, salience: 1.75 },
            ONT_H: { expectedPos: 3.961, salience: 2.16 },
            ONT_S: { expectedPos: 4.485, salience: 2.93 },
            PF: { expectedPos: 4.619, salience: 2.33 },
            ENG: { expectedPos: 4.650, salience: 2.33 },
        },
        categorical: {
            EPS: { catDist: [0.813, 0.094, 0.018, 0.020, 0.047, 0.009], salience: 2.33 },
            AES: { catDist: [0.185, 0.122, 0.085, 0.105, 0.094, 0.410], salience: 2.16 },
        },
        moralCircle: {
            universalAffinity: 69.375,
            scopedAffinities: { national: 60, religious: null, ethnic_racial: null, class: 60, gender: null, ideological: 70 },
            intensity03: 0.019,
        },
    },
};
const samRun2 = {
    label: "Sam — run 3129d6ee (matched 056)",
    matchedArch: "056 Institutional Leftist",
    state: {
        continuous: {
            MAT: { expectedPos: 1.619, salience: 2.84 },
            CD: { expectedPos: 2.325, salience: 2.21 },
            CU: { expectedPos: 3.226, salience: 2.93 },
            MOR: { expectedPos: 3.703, salience: 2.42 },
            PRO: { expectedPos: 3.728, salience: 2.55 },
            COM: { expectedPos: 2.950, salience: 1.67 },
            ZS: { expectedPos: 2.510, salience: 1.75 },
            ONT_H: { expectedPos: 3.961, salience: 2.43 },
            ONT_S: { expectedPos: 4.485, salience: 2.93 },
            PF: { expectedPos: 4.619, salience: 2.33 },
            ENG: { expectedPos: 4.650, salience: 2.33 },
        },
        categorical: {
            EPS: { catDist: [0.813, 0.094, 0.018, 0.020, 0.047, 0.009], salience: 2.33 },
            AES: { catDist: [0.185, 0.122, 0.085, 0.105, 0.094, 0.410], salience: 2.16 },
        },
        moralCircle: {
            universalAffinity: 69.375,
            scopedAffinities: { national: 60, religious: null, ethnic_racial: null, class: 60, gender: null, ideological: 70 },
            intensity03: 0.019,
        },
    },
};
// Synthetic edge cases
const synthCases = [
    {
        label: "Sparse — only ONT_S salient",
        matchedArch: "—",
        state: {
            continuous: {
                ONT_S: { expectedPos: 4.6, salience: 2.8 },
                MAT: { expectedPos: 3.0, salience: 1.5 },
                CD: { expectedPos: 3.0, salience: 1.5 },
            },
        },
    },
    {
        label: "Mid-top-1 — MAT is most salient at mid",
        matchedArch: "—",
        state: {
            continuous: {
                MAT: { expectedPos: 3.0, salience: 2.9 },
                CD: { expectedPos: 1.5, salience: 2.6 },
                ONT_S: { expectedPos: 4.5, salience: 2.7 },
            },
        },
    },
    {
        label: "Statesman-led — AES most salient, then COM-high",
        matchedArch: "—",
        state: {
            continuous: {
                COM: { expectedPos: 4.5, salience: 2.7 },
                ONT_S: { expectedPos: 4.5, salience: 2.6 },
            },
            categorical: {
                EPS: { catDist: [0.2, 0.2, 0.2, 0.2, 0.1, 0.1], salience: 1.5 },
                AES: { catDist: [0.65, 0.10, 0.10, 0.05, 0.05, 0.05], salience: 2.95 }, // statesman top
            },
        },
    },
    {
        label: "Strong universalist with no scope excess",
        matchedArch: "—",
        state: {
            continuous: {
                MAT: { expectedPos: 1.5, salience: 2.8 },
                ONT_S: { expectedPos: 4.5, salience: 2.7 },
            },
            moralCircle: {
                universalAffinity: 90,
                scopedAffinities: { national: 50, religious: null, ethnic_racial: 50, class: 50, gender: null, ideological: 50 },
                intensity03: 0.1,
            },
        },
    },
    {
        label: "Nationalist excess — national scope way above universal",
        matchedArch: "—",
        state: {
            continuous: {
                CD: { expectedPos: 4.6, salience: 2.7 },
                MAT: { expectedPos: 3.8, salience: 2.5 },
            },
            moralCircle: {
                universalAffinity: 40,
                scopedAffinities: { national: 90, religious: null, ethnic_racial: null, class: null, gender: null, ideological: 70 },
                intensity03: 2.5,
            },
        },
    },
    {
        label: "Class-conscious leftist",
        matchedArch: "—",
        state: {
            continuous: {
                MAT: { expectedPos: 1.2, salience: 2.9 },
                CD: { expectedPos: 1.5, salience: 2.6 },
            },
            moralCircle: {
                universalAffinity: 50,
                scopedAffinities: { national: 40, religious: null, ethnic_racial: null, class: 90, gender: null, ideological: 80 },
                intensity03: 2.0,
            },
        },
    },
    {
        label: "Trump-style fighter populist",
        matchedArch: "—",
        state: {
            continuous: {
                MAT: { expectedPos: 3.8, salience: 2.6 },
                CD: { expectedPos: 4.7, salience: 2.9 },
                ZS: { expectedPos: 4.5, salience: 2.7 },
                ONT_S: { expectedPos: 1.5, salience: 2.6 },
            },
            categorical: {
                EPS: { catDist: [0.1, 0.05, 0.15, 0.5, 0.1, 0.1], salience: 2.6 },
                AES: { catDist: [0.05, 0.05, 0.1, 0.1, 0.6, 0.1], salience: 2.8 },
            },
            moralCircle: {
                universalAffinity: 40,
                scopedAffinities: { national: 88, religious: 60, ethnic_racial: null, class: null, gender: null, ideological: 70 },
                intensity03: 2.4,
            },
        },
    },
    {
        label: "Bernie-style class-war",
        matchedArch: "—",
        state: {
            continuous: {
                MAT: { expectedPos: 1.1, salience: 2.95 },
                CD: { expectedPos: 1.5, salience: 2.5 },
                COM: { expectedPos: 1.5, salience: 2.5 },
                PRO: { expectedPos: 1.5, salience: 2.5 },
            },
            categorical: {
                EPS: { catDist: [0.05, 0.05, 0.08, 0.6, 0.18, 0.04], salience: 2.4 },
                AES: { catDist: [0.04, 0.04, 0.04, 0.18, 0.65, 0.05], salience: 2.7 },
            },
            moralCircle: {
                universalAffinity: 70,
                scopedAffinities: { national: 50, religious: null, ethnic_racial: 50, class: 88, gender: 70, ideological: 75 },
                intensity03: 1.8,
            },
        },
    },
];
const personaCases = [samRun1, samRun2, ...synthCases];
// ──────────────────────────────────────────────────────────────────────────────
// Output
// ──────────────────────────────────────────────────────────────────────────────
const lines = [];
lines.push("# Salience-driven label preview");
lines.push("");
lines.push(`Generated from \`src/identity/archetypeLabeler.ts\` + \`mergerTable.json\` against the 121 archetype centroids and a few real/synthetic respondent profiles.`);
lines.push("");
lines.push(`**Archetype preservation:** ${preservedCount} / ${archRows.length} archetypes keep their exact current name. ${mergerHitCount} hit a merger entry; ${archRows.length - mergerHitCount} fall through to lexicon composition.`);
lines.push("");
lines.push("## Archetype centroid pass");
lines.push("");
lines.push("| ID | Old name | New label | Source | Changed? |");
lines.push("|---|---|---|---|---|");
for (const r of archRows) {
    const changedFlag = r.preserved ? "" : "✱";
    lines.push(`| ${r.id} | ${r.oldName} | **${r.newLabel}** | ${r.source} | ${changedFlag} |`);
}
lines.push("");
lines.push("## Respondent / persona pass");
lines.push("");
for (const p of personaCases) {
    const r = labelForRespondent(p.state, mergerTable);
    const salientList = Object.entries(p.state.continuous ?? {})
        .filter(([, v]) => v && (v.salience ?? 0) >= 2.5)
        .sort(([, a], [, b]) => (b?.salience ?? 0) - (a?.salience ?? 0))
        .map(([n, v]) => `${n}(${(v?.salience ?? 0).toFixed(2)}, pos ${(v?.expectedPos ?? 0).toFixed(2)})`)
        .join(", ");
    lines.push(`### ${p.label}`);
    lines.push("");
    lines.push(`- **Engine-matched:** ${p.matchedArch}`);
    lines.push(`- **New label:** \`${r.label}\``);
    lines.push(`- **Source:** ${r.source} (signature \`${r.signature}\`)`);
    if (salientList)
        lines.push(`- Salient continuous nodes (≥2.5): ${salientList}`);
    lines.push("");
}
mkdirSync("results/identity", { recursive: true });
const outPath = "results/identity/label-preview.md";
writeFileSync(outPath, lines.join("\n"), "utf8");
console.log(`Preserved: ${preservedCount}/${archRows.length} archetype names exactly`);
console.log(`Merger-hit: ${mergerHitCount}/${archRows.length} archetypes`);
console.log(`Lexicon-fallback: ${archRows.length - mergerHitCount} archetypes`);
console.log(`Wrote ${outPath}`);
//# sourceMappingURL=previewLabels.js.map