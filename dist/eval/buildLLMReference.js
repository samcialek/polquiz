/**
 * Build consolidated LLM-review reference.
 *
 * Emits a single Markdown file and a single JSON file to
 * `results/llm-review/` containing every input another LLM would need
 * to independently audit the PRISM election + regime-alignment outputs:
 *
 *   - 14-node system (cluster, polarity legend, category definitions)
 *   - All 121 archetypes (id, name, tier, node signature, semantic description)
 *   - 60 US presidential elections with candidate node profiles (1789–2024)
 *   - 47 jurisdictions × ~368 regime periods with node profiles (1789–2026)
 *   - PRISM's computed election votes per archetype × year
 *   - PRISM's computed regime alignment scores per archetype × regime
 *   - Scoring-formula notes (enough to reproduce, not the full code)
 *
 * Usage:
 *   npx tsx src/eval/buildLLMReference.ts
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
const LIVE_DIR = path.join(process.cwd(), "output", "live-data");
const archetypesLive = JSON.parse(fs.readFileSync(path.join(LIVE_DIR, "archetypes.json"), "utf8"));
const electionsLive = JSON.parse(fs.readFileSync(path.join(LIVE_DIR, "elections.json"), "utf8"));
const alignmentsLive = JSON.parse(fs.readFileSync(path.join(LIVE_DIR, "alignments.json"), "utf8"));
const liveById = new Map(archetypesLive.map((a) => [a.id, a]));
const CONTINUOUS_IDS = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM",
    "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CATEGORICAL_IDS = ["EPS", "AES"];
// ── Section 1: system ──────────────────────────────────────────────────────
const SYSTEM_MD = `## 1. PRISM node system

PRISM ("Political Refraction and Identity Spectrum Model") assigns each
respondent / candidate / regime a position and salience on 14 latent nodes.

**Continuous nodes (1–5 scale, both position \`pos\` and salience \`sal\`):**

| Node | Cluster | 1 ↔ 5 polarity |
|---|---|---|
| MAT | ENDS | 1 = redistribution/egalitarian ↔ 5 = free-market/laissez-faire (direction only; state scope lives in ONT_S) |
| CD | ENDS | 1 = progressive/liberalizing on reproductive rights, LGBTQ rights, gender, marriage, religious accommodation ↔ 5 = traditional/restorationist |
| CU | ENDS | 1 = uniformity (one religion, language, worldview, conception of good life) ↔ 5 = pluralism (different worldviews, religions, languages, lifestyles coexist as equals) |
| MOR | ENDS | 1 = narrow moral circle (in-group only) ↔ 5 = wide moral circle (universalist) |
| PRO | MEANS | 1 = outcome-focused/anti-procedural ↔ 5 = rules-bound/proceduralist |
| COM | MEANS | 1 = uncompromising/principled ↔ 5 = compromising/consensus-seeking |
| ZS | REALITY | 1 = positive-sum/cooperative (growth mindset, win-win) ↔ 5 = zero-sum/competitive (fixed pie, my gain = your loss) — across economic, political, AND cultural domains |
| ONT_H | REALITY | 1 = humans are fixed; cultivation cannot reshape character or capability ↔ 5 = humans are malleable; education, institutions, modeling, and tradition can substantially reshape them |
| ONT_S | REALITY | 1 = institutional nihilism (libertarian, accelerationist, "rigged forever" populist) — institutions are not the right tool ↔ 5 = institutional capacity belief — well-designed institutions can solve collective problems and produce good outcomes |
| PF | SELF | 1 = independent/non-partisan ↔ 5 = strong partisan identity |
| TRB | SELF | 1 = universalist/low tribal ↔ 5 = tribal/in-group focused |
| ENG | SELF | 1 = apolitical/disengaged ↔ 5 = highly politically engaged |

**Salience** (for archetypes) is 0–3: 0 = irrelevant, 1 = weak, 2 = moderate,
3 = strong. Position says *where* you fall; salience says *how much the node
matters to your identity*. They are independent — someone may be moderate on a
node they care deeply about, or extreme on a node they don't care about.

**Anti flag** (optional, per node): \`"high"\` means the archetype is repelled
by position 5 (penalty if a candidate/regime is near 5); \`"low"\` means
repelled by position 1.

**Categorical nodes (index into 6-item arrays):**

- **EPS** (epistemic style): 0 = empiricist, 1 = institutionalist,
  2 = traditionalist, 3 = intuitionist, 4 = autonomous, 5 = nihilist
- **AES** (aesthetic style): 0 = statesman, 1 = technocrat, 2 = pastoral,
  3 = plainspoken, 4 = fighter, 5 = visionary
  (renamed 2026-04-26 from "authentic" — authenticity is a quality every aesthetic
  can have, not a distinct category. Plainspoken = regular-person directness,
  anti-polish, refuses political theater)

Archetypes store categorical nodes as a 6-element probability distribution
(\`probs\`) plus a salience. Candidates and regimes encode them as a single
category index.

**Populations.** 118 active archetypes (+3 deactivated: 019, 023, 025 — kept
for ID stability). 6 of the 118 are identity-primary archetypes (IDs 141–146):
Black Voter, White Grievance Voter, Evangelical Voter, LGBTQ Voter, Feminist
Voter, Male Grievance Voter.
`;
// ── Section 2: archetypes ──────────────────────────────────────────────────
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
    return `- **${a.id} ${a.name}**${tag} (tier ${a.tier}, pop ${(a.populationWeight * 100).toFixed(2)}%)  \n  ${a.description}  \n  \`${conts}\`  \n  \`${cats}\``;
}
// ── Section 3: candidates ──────────────────────────────────────────────────
function candidateLine(c) {
    const conts = CONTINUOUS_IDS.map((n) => `${n}:${c[n]}`).join(" ");
    const epsName = EPS_CATEGORIES[c.EPS];
    const aesName = AES_CATEGORIES[c.AES];
    return `  - **${c.name}** (${c.party}) — \`${conts} EPS:${epsName} AES:${aesName}\``;
}
// ── Section 4: regimes ─────────────────────────────────────────────────────
function regimeLine(r) {
    const conts = CONTINUOUS_IDS.map((n) => `${n}:${r[n]}`).join(" ");
    const epsName = EPS_CATEGORIES[r.EPS];
    const aesName = AES_CATEGORIES[r.AES];
    return `  - **${r.regime}** (${r.startYear}–${r.endYear}) — \`${conts} EPS:${epsName} AES:${aesName}\`  \n    ${r.description}`;
}
// ── Section 5 + 6: outputs (compact CSV-style) ────────────────────────────
function electionsCsvBlock() {
    const years = Array.from(new Set(Object.values(electionsLive).flat().map((e) => e.y))).sort((a, b) => a - b);
    const header = ["id", "name", ...years.map(String)].join(",");
    const rows = [header];
    for (const a of archetypesLive) {
        const entries = electionsLive[a.id] ?? [];
        const byYear = new Map(entries.map((e) => [e.y, e.c]));
        const cells = [a.id, `"${a.name}"`, ...years.map((y) => byYear.get(y) ?? "")];
        rows.push(cells.join(","));
    }
    return rows.join("\n");
}
function alignmentsCsvBlock() {
    const jurisdictionOrder = Array.from(new Set(ALL_REGIMES.map((r) => r.jurisdiction)));
    const regimeCols = [];
    for (const jur of jurisdictionOrder) {
        for (const r of ALL_REGIMES.filter((x) => x.jurisdiction === jur)) {
            regimeCols.push({ jur, regime: r.regime, start: r.startYear, end: r.endYear });
        }
    }
    const header = [
        "id", "name",
        ...regimeCols.map((c) => `"${c.jur}|${c.regime} (${c.start}-${c.end})"`),
    ].join(",");
    const rows = [header];
    for (const a of archetypesLive) {
        const byJur = alignmentsLive[a.id] ?? {};
        const lookup = (jur, regime) => {
            const list = byJur[jur] ?? [];
            const hit = list.find((x) => x.r === regime);
            return hit ? hit.v.toFixed(3) : "";
        };
        const cells = [
            a.id,
            `"${a.name}"`,
            ...regimeCols.map((c) => lookup(c.jur, c.regime)),
        ];
        rows.push(cells.join(","));
    }
    return rows.join("\n");
}
// ── Scoring notes ──────────────────────────────────────────────────────────
const SCORING_MD = `## Scoring formulas PRISM uses (so you can reproduce)

**Election alignment** (\`src/historical/simulate.ts:205\`): per archetype×candidate
  \`\`\`
  continuous contribution  = sal * activation_weight * (1 - |archPos - candPos|/4)
                             - anti_penalty (if archetype has anti and cand is near the anti)
  categorical contribution = sal * archetype.probs[cand.category]
                             - 0.3 * sal (if cand category ∈ antiCats)
  + partisan override      = 0.5 to 3.0 (if archetype's inferred party == cand.party,
                             scaled by PF position and PF salience)
  + tribal bonus           = 0.5 (if archetype TRB ≥ 4 and cand TRB ≥ 4)
  + era bonus              = ± context-specific (attenuated to 30% if baseline < 0)
  \`\`\`
  Vote goes to the candidate with highest total. Then a turnout gate applies —
  ENG-based probability blended 65/35 with alignment-driven turnout; if below
  0.47 and no excitement override (alignment ≥ 0.92), the archetype abstains.

**Regime alignment** (\`src/global/build-alignment.ts:54\`): per archetype×regime
  on 9 policy-relevant continuous nodes (MAT, CD, CU, MOR, PRO, COM, ZS, ONT_H,
  ONT_S — PF/TRB/ENG excluded as structural, EPS/AES also excluded):
  \`\`\`
  sal_floor  = max(sal, 0.5)
  diff_adj   = |archPos - regimePos| * anti_multiplier   // 1.0, 1.1, or 1.3
  distance   = sqrt( Σ sal_floor * diff_adj² / Σ sal_floor )
  support    = 100 * exp( -(distance / σ)² )             // σ = 2.0
  alignment  = clip( (support/50 - 1) * 3,  -3, +3 )     // maps to -3…+3
  \`\`\`
`;
// ── Main ───────────────────────────────────────────────────────────────────
function main() {
    const outDir = path.join(process.cwd(), "results", "llm-review");
    fs.mkdirSync(outDir, { recursive: true });
    // --- Markdown reference
    const md = [];
    md.push("# PRISM second-opinion reference");
    md.push("");
    md.push(`Single-file snapshot of every input needed to audit PRISM's election and`, `regime-alignment outputs. Built ${new Date().toISOString().slice(0, 10)}.`, ``, `Contents:`, `  1. PRISM node system (14 nodes, clusters, polarity, category defs)`, `  2. 121 archetype signatures + semantic descriptions`, `  3. US presidential candidate profiles (60 elections, 1789–2024)`, `  4. Global regime profiles (${ALL_REGIMES.length} regimes across ${new Set(ALL_REGIMES.map((r) => r.jurisdiction)).size} jurisdictions, 1789–2026)`, `  5. PRISM-computed election outputs (archetype × year → vote or ABSTAIN)`, `  6. PRISM-computed alignment outputs (archetype × regime → −3…+3)`, ``);
    md.push(SYSTEM_MD, "");
    md.push("## 2. Archetype signatures + descriptions");
    md.push("");
    md.push("Compact notation:");
    md.push("- Continuous: `NODE:pos/sal` (e.g. `MAT:2/3` = pos 2, sal 3). Trailing `↑!` = anti-high, `↓!` = anti-low.");
    md.push("- Categorical: `NODE:topCategory(p)/sal` (e.g. `EPS:institutionalist(0.68)/2`). Trailing `!xyz` = anti-categories (first letter of each).");
    md.push("");
    for (const a of archetypesLive)
        md.push(archetypeLine(a));
    md.push("");
    md.push("## 3. US presidential candidate profiles (60 elections)");
    md.push("");
    for (const e of ELECTIONS) {
        md.push(`### ${e.year}`);
        for (const c of e.candidates)
            md.push(candidateLine(c));
        md.push("");
    }
    md.push("## 4. Global regime profiles");
    md.push("");
    const jurisdictions = Array.from(new Set(ALL_REGIMES.map((r) => r.jurisdiction)));
    for (const jur of jurisdictions) {
        md.push(`### ${jur}`);
        for (const r of ALL_REGIMES.filter((x) => x.jurisdiction === jur)) {
            md.push(regimeLine(r));
        }
        md.push("");
    }
    md.push(SCORING_MD, "");
    md.push("## 5. PRISM election outputs (archetype × year)");
    md.push("");
    md.push("CSV. Empty cell = no prediction (shouldn't occur). `ABSTAIN` = turnout gate not met.");
    md.push("");
    md.push("```csv");
    md.push(electionsCsvBlock());
    md.push("```");
    md.push("");
    md.push("## 6. PRISM regime-alignment outputs (archetype × regime)");
    md.push("");
    md.push("CSV. Cell values in [−3, +3]. Positive = archetype aligns with regime, negative = opposes.");
    md.push("Empty cell = no data for that archetype×regime.");
    md.push("");
    md.push("```csv");
    md.push(alignmentsCsvBlock());
    md.push("```");
    md.push("");
    fs.writeFileSync(path.join(outDir, "prism-reference.md"), md.join("\n"));
    // --- JSON reference (same content, machine-readable)
    const archetypeJsonBlock = archetypesLive.map((a) => {
        const active = ARCHETYPES.find((x) => x.id === a.id)?.active !== false;
        return { ...a, active };
    });
    const electionsJsonBlock = ELECTIONS.map((e) => ({
        year: e.year,
        candidates: e.candidates.map((c) => ({
            ...c,
            EPS_name: EPS_CATEGORIES[c.EPS],
            AES_name: AES_CATEGORIES[c.AES],
        })),
    }));
    const regimesJsonBlock = ALL_REGIMES.map((r) => ({
        ...r,
        EPS_name: EPS_CATEGORIES[r.EPS],
        AES_name: AES_CATEGORIES[r.AES],
    }));
    fs.writeFileSync(path.join(outDir, "prism-reference.json"), JSON.stringify({
        built: new Date().toISOString(),
        system: {
            continuousNodes: CONTINUOUS_IDS,
            categoricalNodes: CATEGORICAL_IDS,
            epsCategories: EPS_CATEGORIES,
            aesCategories: AES_CATEGORIES,
        },
        archetypes: archetypeJsonBlock,
        elections: electionsJsonBlock,
        regimes: regimesJsonBlock,
        prismElectionOutputs: electionsLive,
        prismAlignmentOutputs: alignmentsLive,
    }, null, 2));
    const mdSize = fs.statSync(path.join(outDir, "prism-reference.md")).size;
    const jsonSize = fs.statSync(path.join(outDir, "prism-reference.json")).size;
    console.log(`=== LLM reference built ===`);
    console.log(`Archetypes:  ${archetypesLive.length}`);
    console.log(`Elections:   ${ELECTIONS.length} (years ${ELECTIONS[0].year}–${ELECTIONS[ELECTIONS.length - 1].year})`);
    console.log(`Regimes:     ${ALL_REGIMES.length} across ${new Set(ALL_REGIMES.map((r) => r.jurisdiction)).size} jurisdictions`);
    console.log(`Markdown:    ${(mdSize / 1024).toFixed(1)} KB → ${path.join(outDir, "prism-reference.md")}`);
    console.log(`JSON:        ${(jsonSize / 1024).toFixed(1)} KB → ${path.join(outDir, "prism-reference.json")}`);
}
main();
//# sourceMappingURL=buildLLMReference.js.map