/**
 * Build a compact "sample-pack" file for the biased LLM instance.
 *
 * The full prism-reference.md is too large for some LLM document parsers.
 * This produces a ~20 KB file containing only:
 *   - Reminder of the 9 sample archetype signatures + descriptions
 *   - Section 4 regime profiles for the 20 sampled regimes (covers the
 *     jurisdictions that may have truncated in the full upload — Iran,
 *     Saudi Arabia, South Africa in particular).
 *   - Section 5 filtered to 9 archetypes × 8 elections = 72 rows.
 *   - Section 6 filtered to 9 archetypes × 20 regimes = 180 rows.
 *
 * Usage:
 *   npx tsx src/eval/buildLLMSamplePack.ts
 *
 * Output:
 *   results/llm-review/prism-sample-pack.md
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { ARCHETYPES } from "../config/archetypes.js";
import { EPS_CATEGORIES, AES_CATEGORIES } from "../config/categories.js";
import { ELECTIONS } from "../historical/candidates.js";
import { EUROPE_PART1 } from "../global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../global/jurisdictions-europe2.js";
import { AMERICAS } from "../global/jurisdictions-americas.js";
import { ASIA } from "../global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../global/jurisdictions-mena.js";
const ALL_REGIMES = [
    ...EUROPE_PART1,
    ...EUROPE_PART2,
    ...AMERICAS,
    ...ASIA,
    ...MENA_AFRICA,
];
// Sample definitions — MUST match prompt-biased / prompt-unbiased.
const SAMPLE_ARCHETYPE_IDS = [
    "001", "010", "060", "071", "098", "110", "141", "142", "143",
];
const SAMPLE_ELECTION_YEARS = [1860, 1896, 1932, 1964, 1972, 1980, 2016, 2024];
const SAMPLE_REGIMES = [
    { jurisdiction: "United Kingdom", regime: "Georgian Britain" },
    { jurisdiction: "United Kingdom", regime: "Blair / New Labour" },
    { jurisdiction: "France", regime: "Revolutionary/Napoleonic" },
    { jurisdiction: "France", regime: "Vichy France" },
    { jurisdiction: "Germany/Prussia", regime: "Third Reich" },
    { jurisdiction: "Germany/Prussia", regime: "Weimar Republic" },
    { jurisdiction: "Russia/USSR", regime: "Stalinist USSR" },
    { jurisdiction: "Russia/USSR", regime: "Putin Russia" },
    { jurisdiction: "USA", regime: "Reagan Revolution" },
    { jurisdiction: "USA", regime: "New Deal/WWII" },
    { jurisdiction: "USA", regime: "Jim Crow South" },
    { jurisdiction: "China", regime: "Mao Era" },
    { jurisdiction: "China", regime: "Xi Jinping Era" },
    { jurisdiction: "India", regime: "Gandhi/Nehru Era" },
    { jurisdiction: "Iran", regime: "Islamic Republic (post-1979)" },
    { jurisdiction: "Saudi Arabia", regime: "Ibn Saud Consolidation" },
    { jurisdiction: "Japan", regime: "Imperial Japan (militarist)" },
    { jurisdiction: "Sweden", regime: "Swedish Model / Social Democracy" },
    { jurisdiction: "South Africa", regime: "Apartheid" },
    { jurisdiction: "South Africa", regime: "Post-Apartheid" },
];
const LIVE_DIR = path.join(process.cwd(), "output", "live-data");
const archetypesLive = JSON.parse(fs.readFileSync(path.join(LIVE_DIR, "archetypes.json"), "utf8"));
const electionsLive = JSON.parse(fs.readFileSync(path.join(LIVE_DIR, "elections.json"), "utf8"));
const alignmentsLive = JSON.parse(fs.readFileSync(path.join(LIVE_DIR, "alignments.json"), "utf8"));
const CONTINUOUS_IDS = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM",
    "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CATEGORICAL_IDS = ["EPS", "AES"];
function archetypeLine(a) {
    const conts = CONTINUOUS_IDS.map((n) => {
        const t = a.nodes[n];
        if (!t)
            return `${n}:–`;
        const antiTag = t.anti === "high" ? "↑!" : t.anti === "low" ? "↓!" : "";
        return `${n}:${t.pos}/${t.sal}${antiTag}`;
    }).join(" ");
    const cats = CATEGORICAL_IDS.map((n) => {
        const t = a.nodes[n];
        if (!t || !t.probs)
            return `${n}:–`;
        const top = t.probs
            .map((p, i) => ({ p, i }))
            .sort((x, y) => y.p - x.p)[0];
        const catName = n === "EPS" ? EPS_CATEGORIES[top.i] : AES_CATEGORIES[top.i];
        const antiTag = t.antiCats && t.antiCats.length
            ? "!" + t.antiCats.map((i) => (n === "EPS" ? EPS_CATEGORIES[i] : AES_CATEGORIES[i])[0]).join("")
            : "";
        return `${n}:${catName}(${top.p.toFixed(2)})/${t.sal}${antiTag}`;
    }).join(" ");
    const active = ARCHETYPES.find((x) => x.id === a.id)?.active !== false;
    const tag = active ? "" : " [INACTIVE]";
    return `- **${a.id} ${a.name}**${tag} (tier ${a.tier})  \n  ${a.description}  \n  \`${conts}\`  \n  \`${cats}\``;
}
function regimeLine(r) {
    const conts = CONTINUOUS_IDS.map((n) => `${n}:${r[n]}`).join(" ");
    const epsName = EPS_CATEGORIES[r.EPS];
    const aesName = AES_CATEGORIES[r.AES];
    return `- **${r.jurisdiction} | ${r.regime}** (${r.startYear}–${r.endYear})  \n  \`${conts} EPS:${epsName} AES:${aesName}\`  \n  ${r.description}`;
}
function main() {
    const outDir = path.join(process.cwd(), "results", "llm-review");
    fs.mkdirSync(outDir, { recursive: true });
    const md = [];
    md.push("# PRISM sample-pack — biased condition");
    md.push("");
    md.push(`Supplement to \`prism-reference.md\`. Contains only the cells needed for`);
    md.push(`the stratified sample: **${SAMPLE_ARCHETYPE_IDS.length} archetypes × ${SAMPLE_ELECTION_YEARS.length} elections = ${SAMPLE_ARCHETYPE_IDS.length * SAMPLE_ELECTION_YEARS.length} election rows**`);
    md.push(`and **${SAMPLE_ARCHETYPE_IDS.length} archetypes × ${SAMPLE_REGIMES.length} regimes = ${SAMPLE_ARCHETYPE_IDS.length * SAMPLE_REGIMES.length} alignment rows**`);
    md.push(`(total ${SAMPLE_ARCHETYPE_IDS.length * (SAMPLE_ELECTION_YEARS.length + SAMPLE_REGIMES.length)} cells).`);
    md.push("");
    md.push(`Use this with the \`prompt-biased.md\` instructions. The archetype signatures,`);
    md.push(`candidate profiles, and scoring formulas remain in \`prism-reference.md\` — this`);
    md.push(`pack only adds what your document parser may have truncated plus PRISM's`);
    md.push(`computed outputs for exactly the sampled cells.`);
    md.push("");
    // Section 1: archetype recap (9 sample archetypes, in case main upload truncated)
    md.push("## Sample archetype signatures (recap)");
    md.push("");
    md.push("Notation: `NODE:pos/sal`, `↑!` = anti-high, `↓!` = anti-low. Salience 0–3.");
    md.push("");
    for (const id of SAMPLE_ARCHETYPE_IDS) {
        const a = archetypesLive.find((x) => x.id === id);
        if (a)
            md.push(archetypeLine(a));
    }
    md.push("");
    // Section 2: candidate profiles for the 8 sampled elections (in case main upload truncated)
    md.push("## Sample candidate profiles");
    md.push("");
    md.push("Notation: `NODE:value` for continuous 1–5, plus categorical names.");
    md.push("");
    for (const year of SAMPLE_ELECTION_YEARS) {
        const e = ELECTIONS.find((x) => x.year === year);
        if (!e)
            continue;
        md.push(`### ${year}`);
        for (const c of e.candidates) {
            const conts = CONTINUOUS_IDS.map((n) => `${n}:${c[n]}`).join(" ");
            md.push(`  - **${c.name}** (${c.party}) — \`${conts} EPS:${EPS_CATEGORIES[c.EPS]} AES:${AES_CATEGORIES[c.AES]}\``);
        }
        md.push("");
    }
    // Section 3: regime profiles for the 20 sampled regimes
    md.push("## Sample regime profiles");
    md.push("");
    md.push("(Includes Iran, Saudi Arabia, and South Africa entries that may have been");
    md.push("truncated at the end of the main reference file.)");
    md.push("");
    for (const sr of SAMPLE_REGIMES) {
        const r = ALL_REGIMES.find((x) => x.jurisdiction === sr.jurisdiction && x.regime === sr.regime);
        if (r)
            md.push(regimeLine(r));
        else
            md.push(`- (regime not found: ${sr.jurisdiction} | ${sr.regime})`);
    }
    md.push("");
    // Section 4: PRISM election outputs for 9 × 8 cells
    md.push("## PRISM election outputs — sampled cells (9 archetypes × 8 years = 72 rows)");
    md.push("");
    md.push("```csv");
    md.push("archetype_id,archetype_name,year,prism_vote");
    for (const id of SAMPLE_ARCHETYPE_IDS) {
        const a = archetypesLive.find((x) => x.id === id);
        if (!a)
            continue;
        const entries = electionsLive[id] ?? [];
        const byYear = new Map(entries.map((e) => [e.y, e.c]));
        for (const year of SAMPLE_ELECTION_YEARS) {
            const vote = byYear.get(year) ?? "";
            md.push(`${id},"${a.name}",${year},${vote}`);
        }
    }
    md.push("```");
    md.push("");
    // Section 5: PRISM alignment outputs for 9 × 20 cells
    md.push("## PRISM alignment outputs — sampled cells (9 archetypes × 20 regimes = 180 rows)");
    md.push("");
    md.push("```csv");
    md.push("archetype_id,archetype_name,jurisdiction,regime,start_year,end_year,prism_score");
    for (const id of SAMPLE_ARCHETYPE_IDS) {
        const a = archetypesLive.find((x) => x.id === id);
        if (!a)
            continue;
        const byJur = alignmentsLive[id] ?? {};
        for (const sr of SAMPLE_REGIMES) {
            const list = byJur[sr.jurisdiction] ?? [];
            const hit = list.find((x) => x.r === sr.regime);
            const regimeObj = ALL_REGIMES.find((x) => x.jurisdiction === sr.jurisdiction && x.regime === sr.regime);
            const startYear = regimeObj?.startYear ?? hit?.s ?? "";
            const endYear = regimeObj?.endYear ?? hit?.e ?? "";
            const score = hit ? hit.v.toFixed(3) : "";
            md.push(`${id},"${a.name}","${sr.jurisdiction}","${sr.regime}",${startYear},${endYear},${score}`);
        }
    }
    md.push("```");
    md.push("");
    md.push("## Task reminder");
    md.push("");
    md.push("Evaluate each of the 252 cells above against your independent prediction.");
    md.push("For each cell, give: `my_prediction`, `verdict` (agree/tolerate/disagree),");
    md.push("`confidence`, and `reason`. Use the exact CSV schema from `prompt-biased.md`.");
    md.push("Also produce the **Systematic concerns** and **Calibration notes** sections");
    md.push("at the end as specified in the prompt.");
    md.push("");
    const outPath = path.join(outDir, "prism-sample-pack.md");
    fs.writeFileSync(outPath, md.join("\n"));
    const sizeKb = fs.statSync(outPath).size / 1024;
    console.log(`=== Sample-pack built ===`);
    console.log(`Archetypes:   ${SAMPLE_ARCHETYPE_IDS.length}`);
    console.log(`Elections:    ${SAMPLE_ELECTION_YEARS.length}`);
    console.log(`Regimes:      ${SAMPLE_REGIMES.length}`);
    console.log(`Total cells:  ${SAMPLE_ARCHETYPE_IDS.length * (SAMPLE_ELECTION_YEARS.length + SAMPLE_REGIMES.length)}`);
    console.log(`Output:       ${sizeKb.toFixed(1)} KB → ${outPath}`);
}
main();
//# sourceMappingURL=buildLLMSamplePack.js.map