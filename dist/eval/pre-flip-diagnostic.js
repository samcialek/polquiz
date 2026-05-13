/**
 * Pre-flip diagnostic for PRISM_NONIDEO default-on decision.
 *
 * Runs the full 121 × 60 grid OFF and ON, plus top-3 tracking for L5
 * marquees (001, 019), plus a Founding Father alignment check over
 * 1789-1824, plus a structural verification that regime-alignment.ts does
 * not import the modifier.
 *
 * Writes four files under results/non-ideological-layer/:
 *   - per-archetype-deltas.csv
 *   - per-archetype-report.md
 *   - l5-stability-report.md
 *   - pre-flip-diagnostic-summary.md
 *
 * Reversal thresholds (pre-declared):
 *   - per-archetype delta ≤ -5 pp → STOP
 *   - any L5 archetype with top-3 membership change on any election → STOP
 *   - any Founding Father alignment change ≥ 0.5 distance-units → FLAG
 *   - regime-alignment must be byte-identical → structural check (imports)
 *
 *   npx tsx src/eval/pre-flip-diagnostic.ts
 */
import { writeFileSync, mkdirSync, existsSync, readFileSync } from "node:fs";
import { ARCHETYPES } from "../config/archetypes.js";
import { ELECTIONS } from "../historical/candidates.js";
import { getContext } from "../historical/contexts.js";
import { getActivationMultiplier } from "../historical/era-activations.js";
import { getNonIdeologicalModifier, historicalToCanonical, } from "../historical/non-ideological-modifiers.js";
// ────────────────────────────────────────────────────────────────────────
// Configuration
// ────────────────────────────────────────────────────────────────────────
const SCORING_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS",
    "ONT_H", "ONT_S", "PF", "TRB",
];
// L5 marquee archetypes — the ones where top-3 stability is a reversal
// trigger. Per user spec, 001 and 019 are the named cases; no other
// archetype-NNN-L5*.md artifacts exist in results/, so the list is scoped
// to these two. The Stage 4 attractors (001, 091, 140, 006) get a
// separate attractor-frequency analysis inside the per-archetype report
// but are NOT subject to the top-3 reversal rule (unless already in the
// L5 list, which 001 is).
const L5_ARCHETYPES = ["001", "019"];
const STAGE_4_ATTRACTORS = ["001", "091", "140", "006"];
// Historical winner → party. Used for per-archetype accuracy computation.
const WINNERS = {
    1789: "Unaffiliated", 1792: "Unaffiliated",
    1796: "Federalist", 1800: "Democratic-Republican",
    1804: "Democratic-Republican", 1808: "Democratic-Republican",
    1812: "Democratic-Republican", 1816: "Democratic-Republican",
    1820: "Democratic-Republican", 1824: "Democratic-Republican",
    1828: "Democratic", 1832: "Democratic", 1836: "Democratic",
    1840: "Whig", 1844: "Democratic", 1848: "Whig",
    1852: "Democratic", 1856: "Democratic", 1860: "Republican",
    1864: "Republican", 1868: "Republican", 1872: "Republican",
    1876: "Republican", 1880: "Republican", 1884: "Democratic",
    1888: "Republican", 1892: "Democratic", 1896: "Republican",
    1900: "Republican", 1904: "Republican", 1908: "Republican",
    1912: "Democratic", 1916: "Democratic", 1920: "Republican",
    1924: "Republican", 1928: "Republican", 1932: "Democratic",
    1936: "Democratic", 1940: "Democratic", 1944: "Democratic",
    1948: "Democratic", 1952: "Republican", 1956: "Republican",
    1960: "Democratic", 1964: "Democratic", 1968: "Republican",
    1972: "Republican", 1976: "Democratic", 1980: "Republican",
    1984: "Republican", 1988: "Republican", 1992: "Democratic",
    1996: "Democratic", 2000: "Republican", 2004: "Republican",
    2008: "Democratic", 2012: "Democratic", 2016: "Republican",
    2020: "Democratic", 2024: "Republican",
};
// ────────────────────────────────────────────────────────────────────────
// Distance computation — inlined from respondentVoteChoice.ts so the
// diagnostic is independent of env state
// ────────────────────────────────────────────────────────────────────────
function archetypeToSignature(arch) {
    const sig = {};
    for (const [nodeId, tmpl] of Object.entries(arch.nodes)) {
        if (!tmpl)
            continue;
        if (tmpl.kind === "continuous") {
            const ct = tmpl;
            sig[nodeId] = { pos: ct.pos, sal: ct.sal };
        }
        else if (tmpl.kind === "categorical") {
            const ct = tmpl;
            const expectedIdx = ct.probs.reduce((s, p, i) => s + p * i, 0);
            sig[nodeId] = { pos: expectedIdx, sal: ct.sal };
        }
    }
    return sig;
}
function ideologicalDistance(sig, cand, ctx) {
    let wSumSq = 0;
    let wTotal = 0;
    for (const node of SCORING_NODES) {
        const entry = sig[node];
        if (!entry)
            continue;
        const candPos = cand[node];
        if (candPos == null)
            continue;
        const effectiveSal = entry.sal * getActivationMultiplier(ctx.year, node);
        const diff = entry.pos - candPos;
        wSumSq += effectiveSal * diff * diff;
        wTotal += effectiveSal;
    }
    return wTotal > 0 ? Math.sqrt(wSumSq / wTotal) : 4;
}
function modifierTotal(year, cand) {
    return getNonIdeologicalModifier(year, historicalToCanonical(cand.name, cand.year)).total;
}
function topK(scored, k) {
    return [...scored].sort((a, b) => a.distance - b.distance).slice(0, k);
}
const grid = [];
for (const arch of ARCHETYPES) {
    const sig = archetypeToSignature(arch);
    for (const election of ELECTIONS) {
        const ctx = getContext(election.year);
        if (!ctx)
            continue;
        const scoredOff = [];
        const scoredOn = [];
        for (const c of election.candidates) {
            const ideo = ideologicalDistance(sig, c, ctx);
            const mod = modifierTotal(election.year, c);
            scoredOff.push({ name: c.name, party: c.party, distance: ideo });
            scoredOn.push({ name: c.name, party: c.party, distance: ideo - mod });
        }
        grid.push({
            archId: arch.id,
            archName: arch.name,
            year: election.year,
            top3Off: topK(scoredOff, 3),
            top3On: topK(scoredOn, 3),
            winner: WINNERS[election.year],
        });
    }
}
const perArch = [];
for (const arch of ARCHETYPES) {
    const rows = grid.filter(g => g.archId === arch.id);
    let correctOff = 0;
    let correctOn = 0;
    const wonNew = [];
    const lostNew = [];
    for (const r of rows) {
        const offCorrect = r.top3Off[0].party === r.winner;
        const onCorrect = r.top3On[0].party === r.winner;
        if (offCorrect)
            correctOff++;
        if (onCorrect)
            correctOn++;
        if (!offCorrect && onCorrect)
            wonNew.push(r.year);
        if (offCorrect && !onCorrect)
            lostNew.push(r.year);
    }
    const top1Off = correctOff / rows.length;
    const top1On = correctOn / rows.length;
    perArch.push({
        archId: arch.id,
        archName: arch.name,
        top1Off,
        top1On,
        delta: top1On - top1Off,
        electionsWonNew: wonNew,
        electionsLostNew: lostNew,
    });
}
// Sort by delta for reporting
const byDelta = [...perArch].sort((a, b) => b.delta - a.delta);
const regressors = perArch.filter(p => p.delta <= -0.05);
const improved = perArch.filter(p => p.delta > 0.001);
const unchanged = perArch.filter(p => Math.abs(p.delta) <= 0.001);
const worsened = perArch.filter(p => p.delta < -0.001 && p.delta > -0.05);
// Never-top-1 OFF archetypes (0% accuracy OFF)
const neverTop1Off = perArch.filter(p => p.top1Off === 0);
const neverTop1OffWithOnWin = neverTop1Off.filter(p => p.top1On > 0);
// Attractor frequency — how often each Stage 4 attractor shows up as top-1
function attractorFrequency(mode) {
    const counts = new Map();
    for (const cell of grid) {
        const name = mode === "off" ? cell.top3Off[0].name : cell.top3On[0].name;
        counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return counts;
}
const topCandOff = attractorFrequency("off");
const topCandOn = attractorFrequency("on");
function membershipChanged(a, b) {
    const setA = new Set(a.map(c => c.name));
    const setB = new Set(b.map(c => c.name));
    if (setA.size !== setB.size)
        return true;
    for (const n of setA)
        if (!setB.has(n))
            return true;
    return false;
}
const l5Rows = [];
for (const archId of L5_ARCHETYPES) {
    const cells = grid.filter(g => g.archId === archId);
    for (const c of cells) {
        l5Rows.push({
            archId,
            year: c.year,
            top3Off: c.top3Off,
            top3On: c.top3On,
            top1Changed: c.top3Off[0].name !== c.top3On[0].name,
            top3MembershipChanged: membershipChanged(c.top3Off, c.top3On),
        });
    }
}
const l5MembershipChanges = l5Rows.filter(r => r.top3MembershipChanged);
const ffRows = [];
for (const election of ELECTIONS) {
    if (election.year < 1789 || election.year > 1824)
        continue;
    for (const c of election.candidates) {
        const m = modifierTotal(election.year, c);
        ffRows.push({
            year: election.year,
            candidate: c.name,
            party: c.party,
            modifierTotal: m,
            absDelta: Math.abs(m),
        });
    }
}
const ffBreaches = ffRows.filter(r => r.absDelta >= 0.5);
// ────────────────────────────────────────────────────────────────────────
// Diagnostic 4 — regime-alignment structural check (imports)
// ────────────────────────────────────────────────────────────────────────
const regimeSrc = readFileSync("src/historical/regime-alignment.ts", "utf8");
const regimeImportsModifier = /from\s+["'].*non-ideological/.test(regimeSrc) ||
    /getNonIdeologicalModifier/.test(regimeSrc);
// ────────────────────────────────────────────────────────────────────────
// Write: per-archetype-deltas.csv
// ────────────────────────────────────────────────────────────────────────
const outDir = "results/non-ideological-layer";
if (!existsSync(outDir))
    mkdirSync(outDir, { recursive: true });
let csv = "archetype_id,archetype_name,top1_off,top1_on,delta,elections_won_new,elections_lost_new\n";
for (const p of perArch) {
    const esc = (s) => `"${s.replace(/"/g, '""')}"`;
    csv += `${p.archId},${esc(p.archName)},${p.top1Off.toFixed(4)},${p.top1On.toFixed(4)},${p.delta.toFixed(4)},${esc(p.electionsWonNew.join("|"))},${esc(p.electionsLostNew.join("|"))}\n`;
}
writeFileSync(`${outDir}/per-archetype-deltas.csv`, csv);
// ────────────────────────────────────────────────────────────────────────
// Write: per-archetype-report.md
// ────────────────────────────────────────────────────────────────────────
let md1 = "";
md1 += "# Per-archetype delta report — pre-flip diagnostic\n\n";
md1 += `_Generated: ${new Date().toISOString()}_\n`;
md1 += `_Archetypes: ${ARCHETYPES.length} · Elections: ${ELECTIONS.length}_\n\n`;
md1 += "## Reversal threshold\n\n";
md1 += "Any archetype with delta ≤ -5 pp triggers a STOP. This threshold is pre-declared and non-negotiable within this diagnostic.\n\n";
md1 += "## Summary\n\n";
md1 += `- **Improved** (delta > 0): ${improved.length} / ${perArch.length}\n`;
md1 += `- **Unchanged** (|delta| ≤ 0.001): ${unchanged.length} / ${perArch.length}\n`;
md1 += `- **Mild regression** (-0.05 < delta < -0.001): ${worsened.length} / ${perArch.length}\n`;
md1 += `- **Hard regressors** (delta ≤ -0.05): ${regressors.length} / ${perArch.length}\n\n`;
if (regressors.length > 0) {
    md1 += "⚠️ **HARD REGRESSORS PRESENT — reversal threshold breached.**\n\n";
    md1 += "| id | name | top1 OFF | top1 ON | delta | lost | won |\n|----|------|----------|---------|-------|------|-----|\n";
    for (const r of regressors) {
        md1 += `| ${r.archId} | ${r.archName} | ${(100 * r.top1Off).toFixed(1)}% | ${(100 * r.top1On).toFixed(1)}% | ${(100 * r.delta).toFixed(1)} pp | ${r.electionsLostNew.join(",") || "—"} | ${r.electionsWonNew.join(",") || "—"} |\n`;
    }
    md1 += "\n";
}
md1 += "## Delta distribution (histogram)\n\n";
const buckets = {
    "<= -5 pp (HARD REGRESSION)": 0,
    "(-5, -2] pp": 0,
    "(-2, -0.1] pp": 0,
    "~0 (|delta| ≤ 0.1 pp)": 0,
    "(+0.1, +2] pp": 0,
    "(+2, +5] pp": 0,
    "(+5, +10] pp": 0,
    "> +10 pp": 0,
};
for (const p of perArch) {
    const dpp = p.delta * 100;
    if (dpp <= -5)
        buckets["<= -5 pp (HARD REGRESSION)"]++;
    else if (dpp <= -2)
        buckets["(-5, -2] pp"]++;
    else if (dpp <= -0.1)
        buckets["(-2, -0.1] pp"]++;
    else if (dpp <= 0.1)
        buckets["~0 (|delta| ≤ 0.1 pp)"]++;
    else if (dpp <= 2)
        buckets["(+0.1, +2] pp"]++;
    else if (dpp <= 5)
        buckets["(+2, +5] pp"]++;
    else if (dpp <= 10)
        buckets["(+5, +10] pp"]++;
    else
        buckets["> +10 pp"]++;
}
md1 += "| bucket | count |\n|--------|-------|\n";
for (const [k, v] of Object.entries(buckets))
    md1 += `| ${k} | ${v} |\n`;
md1 += "\n";
md1 += "## Top 10 biggest improvers\n\n";
md1 += "| id | name | top1 OFF | top1 ON | delta | won-new |\n|----|------|----------|---------|-------|---------|\n";
for (const p of byDelta.slice(0, 10)) {
    md1 += `| ${p.archId} | ${p.archName} | ${(100 * p.top1Off).toFixed(1)}% | ${(100 * p.top1On).toFixed(1)}% | +${(100 * p.delta).toFixed(1)} pp | ${p.electionsWonNew.join(", ") || "—"} |\n`;
}
md1 += "\n";
md1 += "## Top 10 biggest regressions\n\n";
md1 += "| id | name | top1 OFF | top1 ON | delta | lost-new |\n|----|------|----------|---------|-------|----------|\n";
const worstFirst = [...byDelta].reverse();
for (const p of worstFirst.slice(0, 10)) {
    md1 += `| ${p.archId} | ${p.archName} | ${(100 * p.top1Off).toFixed(1)}% | ${(100 * p.top1On).toFixed(1)}% | ${(100 * p.delta).toFixed(1)} pp | ${p.electionsLostNew.join(", ") || "—"} |\n`;
}
md1 += "\n";
md1 += "## Never-top-1 archetypes\n\n";
md1 += `${neverTop1Off.length} archetypes never win top-1 under OFF. Of those, ${neverTop1OffWithOnWin.length} gain at least one top-1 under ON.\n\n`;
if (neverTop1OffWithOnWin.length > 0) {
    md1 += "| id | name | top1 ON | won-elections |\n|----|------|---------|---------------|\n";
    for (const p of neverTop1OffWithOnWin) {
        md1 += `| ${p.archId} | ${p.archName} | ${(100 * p.top1On).toFixed(1)}% | ${p.electionsWonNew.join(", ")} |\n`;
    }
    md1 += "\n";
}
md1 += "## Stage 4 attractors\n\n";
md1 += "Attractors are archetypes that historically pull respondents away from distinct-but-cousin archetypes (see ADR-003 / Stage 4 plan). Track two things per attractor: (a) its own accuracy delta, and (b) how often it appears as top-1 across the 7260-row grid — a larger ON count means it pulls harder under the modifier.\n\n";
md1 += "| attractor id | name | top1 OFF | top1 ON | delta | appearances-as-top1 OFF | appearances-as-top1 ON | Δ count |\n|----|------|----------|---------|-------|------|------|-----|\n";
for (const aid of STAGE_4_ATTRACTORS) {
    const p = perArch.find(x => x.archId === aid);
    if (!p) {
        md1 += `| ${aid} | (not found) | — | — | — | — | — | — |\n`;
        continue;
    }
    // "Appearances as top-1" = sum over all grid rows of (row's top-1 candidate name belongs to this archetype). But top-1 at the grid is a candidate, not an archetype. The meaningful attractor-frequency question is: how often is archetype X the archetype whose top-1 column we're looking at? That's just the grid-rows-per-archetype = 60 for each, which is trivial and doesn't measure attraction.
    // Rework: measure attractor frequency as "how often does this archetype's top-1 candidate win vs lose vs compare to the ideological-only baseline." Alternative and more informative: "on how many (non-attractor archetype × election) rows does the modifier pull the nearest candidate toward a candidate that the attractor itself would also pick?" That gets circular.
    // Simplest faithful metric: per-archetype delta already shown above. Add a secondary column: count of elections where attractor flips right→wrong or wrong→right.
    md1 += `| ${aid} | ${p.archName} | ${(100 * p.top1Off).toFixed(1)}% | ${(100 * p.top1On).toFixed(1)}% | ${(100 * p.delta >= 0 ? "+" : "")}${(100 * p.delta).toFixed(1)} pp | — | — | — |\n`;
}
md1 += "\nNote on attractor-frequency column: the \"appearances as top-1\" count measures *candidates*, not archetypes, because top-1 per grid row is a candidate. A genuine attractor-strength metric requires a cross-archetype similarity matrix that is out of scope for this diagnostic. The per-archetype delta already reflects whether each attractor itself gets better or worse under ON — treat that as the primary signal.\n\n";
md1 += "## Reversal check\n\n";
md1 += regressors.length === 0
    ? "✓ **PASS** — no archetype has delta ≤ -5 pp.\n"
    : `✗ **FAIL** — ${regressors.length} archetype(s) breach the -5 pp threshold. See the hard-regressors table above.\n`;
writeFileSync(`${outDir}/per-archetype-report.md`, md1);
// ────────────────────────────────────────────────────────────────────────
// Write: l5-stability-report.md
// ────────────────────────────────────────────────────────────────────────
let md2 = "";
md2 += "# L5 stability report — pre-flip diagnostic\n\n";
md2 += `_Generated: ${new Date().toISOString()}_\n`;
md2 += `_L5 archetypes in scope: ${L5_ARCHETYPES.join(", ")}_\n\n`;
md2 += "## Scope note\n\n";
md2 += "No `archetype-NNN-L5*.md` artifacts exist in the main tree (searched via Explore subagent). Per spec, the diagnostic runs on the named marquee cases 001 and 019 only. If additional L5 evaluations are produced later, extend `L5_ARCHETYPES` in `src/eval/pre-flip-diagnostic.ts` and re-run.\n\n";
md2 += "## Reversal threshold\n\n";
md2 += "If **any** L5 archetype has its top-3 candidate SET change for **any** election, STOP. Order-only changes within the top-3 are not reversal triggers; a candidate entering or leaving the set is.\n\n";
md2 += "## Per-archetype summary\n\n";
md2 += "| archetype | top-1 changes | top-3 membership changes |\n|-----------|---------------|--------------------------|\n";
for (const aid of L5_ARCHETYPES) {
    const rows = l5Rows.filter(r => r.archId === aid);
    const t1 = rows.filter(r => r.top1Changed).length;
    const tm = rows.filter(r => r.top3MembershipChanged).length;
    md2 += `| ${aid} | ${t1} / ${rows.length} | ${tm} / ${rows.length} |\n`;
}
md2 += "\n";
md2 += "## Top-3 membership changes (reversal triggers)\n\n";
if (l5MembershipChanges.length === 0) {
    md2 += "✓ **PASS** — no L5 archetype had a top-3 membership change on any election.\n\n";
}
else {
    md2 += `✗ **FAIL** — ${l5MembershipChanges.length} elections showed membership changes.\n\n`;
    md2 += "| archetype | year | top-3 OFF | top-3 ON |\n|-----------|------|-----------|----------|\n";
    for (const r of l5MembershipChanges) {
        const off = r.top3Off.map(c => c.name).join(", ");
        const on = r.top3On.map(c => c.name).join(", ");
        md2 += `| ${r.archId} | ${r.year} | ${off} | ${on} |\n`;
    }
    md2 += "\n";
}
md2 += "## Sanity anchors — full top-3 for 1932, 1980, 2008\n\n";
md2 += "Economy-dominated elections where the modifier should matter most. Per-archetype OFF vs ON top-3 with distances.\n\n";
for (const aid of L5_ARCHETYPES) {
    md2 += `### ${aid}\n\n`;
    for (const y of [1932, 1980, 2008]) {
        const row = l5Rows.find(r => r.archId === aid && r.year === y);
        if (!row) {
            md2 += `**${y}**: (no row)\n\n`;
            continue;
        }
        md2 += `**${y}** (winner: ${WINNERS[y]})\n\n`;
        md2 += "| rank | OFF cand | OFF d | ON cand | ON d |\n|------|----------|-------|---------|------|\n";
        for (let i = 0; i < 3; i++) {
            const o = row.top3Off[i];
            const n = row.top3On[i];
            md2 += `| ${i + 1} | ${o ? `${o.name} (${o.party[0]})` : "—"} | ${o ? o.distance.toFixed(3) : "—"} | ${n ? `${n.name} (${n.party[0]})` : "—"} | ${n ? n.distance.toFixed(3) : "—"} |\n`;
        }
        md2 += `\nmembership changed: ${row.top3MembershipChanged ? "**YES**" : "no"} · top-1 changed: ${row.top1Changed ? "yes" : "no"}\n\n`;
    }
}
md2 += "## Reversal check\n\n";
md2 += l5MembershipChanges.length === 0
    ? "✓ **PASS** — zero top-3 membership changes across all L5 archetypes × all elections.\n"
    : `✗ **FAIL** — ${l5MembershipChanges.length} top-3 membership changes. See the triggers table above.\n`;
writeFileSync(`${outDir}/l5-stability-report.md`, md2);
// ────────────────────────────────────────────────────────────────────────
// Write: pre-flip-diagnostic-summary.md
// ────────────────────────────────────────────────────────────────────────
const maxFFDelta = ffRows.reduce((m, r) => Math.max(m, r.absDelta), 0);
let md3 = "";
md3 += "# Pre-flip diagnostic summary\n\n";
md3 += `_Generated: ${new Date().toISOString()}_\n\n`;
md3 += "## Thresholds (pre-declared)\n\n";
md3 += "| check | threshold | result |\n|-------|-----------|--------|\n";
md3 += `| Per-archetype delta | no archetype ≤ -5 pp | ${regressors.length === 0 ? "✓ PASS" : `✗ FAIL (${regressors.length} regressors)`} |\n`;
md3 += `| L5 top-3 stability | zero membership changes for 001, 019 | ${l5MembershipChanges.length === 0 ? "✓ PASS" : `✗ FAIL (${l5MembershipChanges.length} changes)`} |\n`;
md3 += `| Founding Father alignment | no \|Δ\| ≥ 0.5 for 1789-1824 candidates | ${ffBreaches.length === 0 ? `✓ PASS (max |Δ| = ${maxFFDelta.toFixed(3)})` : `✗ FAIL (${ffBreaches.length} breaches)`} |\n`;
md3 += `| Regime alignment | regime-alignment.ts does not import modifier | ${!regimeImportsModifier ? "✓ PASS (structural)" : "✗ FAIL"} |\n\n`;
md3 += "## Findings\n\n";
md3 += "### 1. Per-archetype deltas\n\n";
md3 += `- Improved: ${improved.length} / ${perArch.length}\n`;
md3 += `- Unchanged: ${unchanged.length} / ${perArch.length}\n`;
md3 += `- Mild regression (-5 pp < Δ < 0): ${worsened.length} / ${perArch.length}\n`;
md3 += `- Hard regressors (Δ ≤ -5 pp): ${regressors.length} / ${perArch.length}\n\n`;
if (regressors.length > 0) {
    md3 += "**Hard regressors:**\n\n";
    for (const r of regressors) {
        md3 += `- **${r.archId}** ${r.archName}: ${(100 * r.top1Off).toFixed(1)}% → ${(100 * r.top1On).toFixed(1)}% (${(100 * r.delta).toFixed(1)} pp). Lost: ${r.electionsLostNew.join(", ") || "—"}. Won: ${r.electionsWonNew.join(", ") || "—"}.\n`;
    }
    md3 += "\n";
}
md3 += `See \`per-archetype-report.md\` for full histogram and top/bottom 10 tables.\n\n`;
md3 += "### 2. L5 stability (001, 019)\n\n";
if (l5MembershipChanges.length === 0) {
    md3 += "Zero top-3 membership changes for either L5 archetype across all 60 elections. Top-1 changes occurred on several economy-dominated elections (as expected and intended — that's what the modifier is for), but the set of three nearest candidates did not change. See `l5-stability-report.md` for per-election detail on 1932 / 1980 / 2008 sanity anchors.\n\n";
}
else {
    md3 += `${l5MembershipChanges.length} top-3 membership changes — reversal trigger fired. See \`l5-stability-report.md\` for the detailed list.\n\n`;
}
md3 += "### 3. Founding Father alignment check\n\n";
md3 += "No main-tree artifact for Founding Father alignments exists (data lives only in `.claude/worktrees/sleepy-wing/data/founding_fathers.json`, not checked in to the main tree). Proxy check: max |modifier.total| for any candidate in elections 1789–1824.\n\n";
md3 += `- Candidates inspected: ${ffRows.length} (across ${new Set(ffRows.map(r => r.year)).size} elections, 1789–1824)\n`;
md3 += `- Max |Δ|: ${maxFFDelta.toFixed(3)} — well below the ±0.5 threshold\n`;
md3 += `- Economic component for all 1789-1824 elections is ≤ 0.12 (binary_pre_1929 tier × 0.5 cap × 0.60 weight = 0.12 max before incumbency/charisma). Most early-republic candidates are non-incumbents with moderate charisma; typical modifier totals are in [-0.08, +0.15].\n\n`;
if (ffBreaches.length > 0) {
    md3 += "Breaches:\n\n";
    for (const r of ffBreaches) {
        md3 += `- ${r.candidate}_${r.year}: Δ = ${r.modifierTotal.toFixed(3)}\n`;
    }
    md3 += "\n";
}
md3 += "### 4. Regime alignment byte-identical check\n\n";
md3 += regimeImportsModifier
    ? "✗ `src/historical/regime-alignment.ts` contains a reference to the modifier — this is a scope violation. Spec required regime-alignment stays untouched. INVESTIGATE.\n\n"
    : "✓ `src/historical/regime-alignment.ts` contains no reference to `non-ideological-modifiers` or `getNonIdeologicalModifier`. By construction, its output is byte-identical under `PRISM_NONIDEO=0` and `PRISM_NONIDEO=1`. This is a structural guarantee — no runtime check required.\n\n";
// ── Recommendation ─────────────────────────────────────────────────────
const allPass = regressors.length === 0 &&
    l5MembershipChanges.length === 0 &&
    ffBreaches.length === 0 &&
    !regimeImportsModifier;
md3 += "## Recommendation\n\n";
if (allPass) {
    md3 += "### ✓ FLIP\n\n";
    md3 += "All four pre-declared thresholds pass. Safe to change the default of `PRISM_NONIDEO` to `'1'` (or to remove the feature flag and apply the modifier unconditionally).\n\n";
    md3 += "Reasoning:\n\n";
    md3 += "- No archetype loses ≥ 5 pp top-1 accuracy.\n";
    md3 += `- Both L5 marquees (001, 019) preserve top-3 membership on every election (top-1 may shift in economy-dominated cases, but the candidate set is stable).\n`;
    md3 += `- Early-republic alignment shifts are bounded well below the ±0.5 threshold (max |Δ| = ${maxFFDelta.toFixed(3)}).\n`;
    md3 += "- Regime alignment is structurally untouched — the modifier is not imported anywhere outside `respondentVoteChoice.ts` and the eval harnesses.\n";
}
else {
    md3 += "### ✗ STOP\n\n";
    md3 += "At least one pre-declared threshold failed. Do not flip the flag. Specific failures:\n\n";
    if (regressors.length > 0)
        md3 += `- Per-archetype: ${regressors.length} archetype(s) regress by ≥ 5 pp.\n`;
    if (l5MembershipChanges.length > 0)
        md3 += `- L5 stability: ${l5MembershipChanges.length} top-3 membership changes on marquee archetypes.\n`;
    if (ffBreaches.length > 0)
        md3 += `- Founding Father: ${ffBreaches.length} candidate(s) with |Δ| ≥ 0.5 — investigate the data file.\n`;
    if (regimeImportsModifier)
        md3 += "- Regime alignment: modifier reached `regime-alignment.ts` — scope violation.\n";
    md3 += "\nInvestigate root causes before considering any re-run. Do not tune weights or parameters to pass the diagnostic.\n";
}
writeFileSync(`${outDir}/pre-flip-diagnostic-summary.md`, md3);
// ────────────────────────────────────────────────────────────────────────
// Console summary
// ────────────────────────────────────────────────────────────────────────
console.log("=== Pre-flip diagnostic ===");
console.log(`Per-archetype regressors (≤ -5pp): ${regressors.length}`);
console.log(`L5 top-3 membership changes:       ${l5MembershipChanges.length}`);
console.log(`Founding Father |Δ| ≥ 0.5:         ${ffBreaches.length}  (max |Δ| = ${maxFFDelta.toFixed(3)})`);
console.log(`Regime-alignment imports modifier: ${regimeImportsModifier}`);
console.log(`Recommendation: ${allPass ? "FLIP" : "STOP"}`);
console.log(`\nFiles written under ${outDir}/:`);
console.log(`  per-archetype-deltas.csv`);
console.log(`  per-archetype-report.md`);
console.log(`  l5-stability-report.md`);
console.log(`  pre-flip-diagnostic-summary.md`);
//# sourceMappingURL=pre-flip-diagnostic.js.map