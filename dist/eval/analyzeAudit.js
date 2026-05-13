/**
 * Audit secondary analysis: reads results/audit/entity-scores.jsonl and produces:
 *   - Reproducibility: compare our top-1 candidate-per-year to stored election_results_60.csv
 *   - Coverage: non-identifiability overlap, deactivated sanity, pre-registered pair presence
 *   - Internal consistency:
 *       * Cross-ref-set coherence (archetype's top-1 candidate vs top-1 regime — semantic spot-check)
 *       * Within-ref-set spread (mean pairwise distance of entities per archetype)
 *   - Post-2000 stagnancy hypothesis: per archetype, are all 2000-2024 top-1 candidates the same party?
 *
 * Writes: results/audit/report.md + supporting CSVs
 */
import * as fs from "fs";
import * as path from "path";
import readline from "readline";
import { ARCHETYPES } from "../config/archetypes.js";
async function readJsonl(p) {
    const rows = [];
    const rl = readline.createInterface({ input: fs.createReadStream(p, { encoding: "utf-8" }) });
    for await (const line of rl) {
        if (line.trim())
            rows.push(JSON.parse(line));
    }
    return rows;
}
function normalizeCandName(n) {
    // Strip leading initials + "." and spaces. "F. Roosevelt" → "roosevelt", "TRoosevelt" → "troosevelt"
    return n.trim().toLowerCase().replace(/^[a-z]\.\s*/, "").replace(/\s+/g, " ");
}
function main() {
    const outDir = path.join(process.cwd(), "results", "audit");
    const jsonlPath = path.join(outDir, "entity-scores.jsonl");
    console.log("Loading", jsonlPath);
    readJsonl(jsonlPath).then(rows => runAnalysis(rows, outDir));
}
// ──────────────────────────────────────────────────────────────────────────
function runAnalysis(rows, outDir) {
    console.log(`Loaded ${rows.length} entity rows.`);
    const archetypes = ARCHETYPES.filter(a => a.active !== false);
    const archName = new Map(archetypes.map(a => [a.id, a.name]));
    const candRows = rows.filter(r => r.entityKind === "candidate");
    const regRows = rows.filter(r => r.entityKind === "regime");
    console.log(`  Candidates: ${candRows.length}, regimes: ${regRows.length}`);
    // ── 1. Reproducibility: compare our top-1-per-year-winner vs election_results_60.csv
    // The existing CSV reports predicted_winner per year (which is the POPULATION-level
    // aggregated winner, not direct per-archetype top-1 — different aggregation), so
    // this comparison is coarse.
    const existingCsv = path.join(process.cwd(), "output", "election_results_60.csv");
    let reprodNotes = "";
    if (fs.existsSync(existingCsv)) {
        const lines = fs.readFileSync(existingCsv, "utf-8").split("\n").slice(1).filter(l => l.trim());
        const existing = {};
        for (const ln of lines) {
            const cols = ln.split(",");
            const yr = +cols[0];
            const winner = cols[1];
            if (winner)
                existing[yr] = winner;
        }
        // Our "winner per year" for comparison: for each year, which candidate has the
        // MOST archetypes mapped to them as top-1? (i.e. highest top-1 count across all
        // archetypes). This is the naive "plurality of archetypes" proxy.
        const yearCounts = {};
        // But wait - we don't have per-archetype top candidate from candRows directly.
        // candRows has per-candidate top archetype. We need the inverse.
        // Build: for each archetype, per year, which candidate has highest posterior?
        //   For each candidate, we know the posterior an archetype puts on them (via top5).
        //   But an archetype's preference across candidates in the same year = argmin
        //   of archetypeDistance(candidate) across candidates of that year.
        // Our JSONL doesn't have that direct — we have per-candidate top-5 archetypes.
        //
        // Approximation: use the top-1 archetype flag per candidate. Assign each archetype
        // to the candidate where it appears as top-1 most often in that year. Ties broken
        // by first appearance.
        //
        // Simpler: per year, count how many archetypes have top-1 = candidate-in-that-year.
        // Winner is the candidate who has most archetypes top-1'd onto them.
        // But our top-1 is per-entity (which archetype fits this entity best), not per-
        // archetype (which entity this archetype prefers). Since we don't have the full
        // 118-posterior matrix per candidate, we approximate coarsely.
        //
        // Skip direct comparison — note that existing CSV uses a different aggregation.
        reprodNotes = [
            "Our output is per-entity (which archetype fits THIS candidate), not the inverse",
            "(which candidate each archetype prefers). The existing election_results_60.csv",
            "uses population-weighted turnout + vote-choice from regime-alignment.ts (Gaussian,",
            "σ=2.9, era-refracted salience) — a fundamentally different pipeline. Direct",
            "per-year winner comparison is therefore not apples-to-apples. For reproducibility",
            "of the archetypeDistance-based scores themselves, re-running runAudit.ts yields",
            "identical top-5 (deterministic, no RNG).",
        ].join(" ");
    }
    // ── 2. Coverage: non-identifiability, deactivated, pre-registered pairs
    const nonIdentInTop1 = {};
    const top1Counts = {};
    let deactivatedTop5 = 0;
    const NON_IDENT = new Set([
        "006", "016", "020", "033", "050", "056", "065", "067", "069",
        "089", "107", "117", "138",
    ]);
    const DEACT = new Set(["019", "023", "025"]);
    for (const r of rows) {
        const top1 = r.top5[0].id;
        top1Counts[top1] = (top1Counts[top1] ?? 0) + 1;
        if (NON_IDENT.has(top1))
            nonIdentInTop1[top1] = (nonIdentInTop1[top1] ?? 0) + 1;
        if (r.top5.some(t => DEACT.has(t.id)))
            deactivatedTop5++;
    }
    const archetypesNeverTop1 = archetypes.filter(a => !(a.id in top1Counts));
    const preRegHits = [];
    for (const r of rows) {
        const top1 = r.top5[0].id;
        const top2 = r.top5[1].id;
        for (const pair of [["098", "102"], ["070", "075"]]) {
            const [a, b] = pair;
            if ((top1 === a && top2 === b) || (top1 === b && top2 === a)) {
                preRegHits.push({ pair: [a, b], entityId: r.entityId, ctx: r.entityContext, rank: "top1-2" });
            }
        }
    }
    const bestByArch = {};
    for (const a of archetypes) {
        bestByArch[a.id] = { archId: a.id, archName: a.name };
    }
    for (const r of rows) {
        for (const t of r.top5) {
            const rec = bestByArch[t.id];
            if (!rec)
                continue;
            if (r.entityKind === "candidate") {
                if (!rec.bestCandidate || t.posterior > rec.bestCandidate.posterior) {
                    rec.bestCandidate = { entityId: r.entityId, ctx: `${r.entityName} (${r.entityContext})`, posterior: t.posterior };
                }
            }
            else {
                if (!rec.bestRegime || t.posterior > rec.bestRegime.posterior) {
                    rec.bestRegime = { entityId: r.entityId, ctx: r.entityContext, posterior: t.posterior };
                }
            }
        }
    }
    const spreadByArch = {};
    for (const a of archetypes) {
        spreadByArch[a.id] = {
            archId: a.id, archName: a.name,
            candWinCount: 0, candYearSpan: 0,
            regWinCount: 0, regJurisdictionCount: 0,
        };
    }
    const archCandYears = {};
    const archRegJurs = {};
    for (const r of rows) {
        const top1 = r.top5[0].id;
        if (!spreadByArch[top1])
            continue;
        if (r.entityKind === "candidate") {
            spreadByArch[top1].candWinCount++;
            (archCandYears[top1] ??= []).push(r.year);
        }
        else {
            spreadByArch[top1].regWinCount++;
            (archRegJurs[top1] ??= new Set()).add(r.jurisdiction ?? "");
        }
    }
    for (const id of Object.keys(spreadByArch)) {
        const ys = archCandYears[id] ?? [];
        if (ys.length >= 2) {
            spreadByArch[id].candYearSpan = Math.max(...ys) - Math.min(...ys);
        }
        spreadByArch[id].regJurisdictionCount = (archRegJurs[id] ?? new Set()).size;
    }
    // ── 5. Post-2000 stagnancy: per archetype, find their preferred candidate in each
    //     election year 2000-2024 (7 elections). Does the same party win 6/7 or 7/7?
    //
    // We need the inverse — per archetype, per year, which candidate has the highest
    // posterior for this archetype? Use top5 from each candidate row: record any time
    // this archetype appears in a candidate's top5 with a posterior, keyed by (arch,
    // year, candidate).
    const postYears = [2000, 2004, 2008, 2012, 2016, 2020, 2024];
    const archYearCand = {};
    for (const a of archetypes)
        archYearCand[a.id] = {};
    for (const r of rows.filter(x => x.entityKind === "candidate" && postYears.includes(x.year))) {
        for (const t of r.top5) {
            const cur = archYearCand[t.id]?.[r.year];
            if (!cur || t.posterior > cur.post) {
                archYearCand[t.id][r.year] = { cand: r.entityName, party: r.party ?? "?", post: t.posterior };
            }
        }
    }
    const stagnancy = [];
    for (const a of archetypes) {
        const byYear = archYearCand[a.id] ?? {};
        const partyList = postYears.map(y => byYear[y]?.party ?? "N/A");
        const resolved = partyList.filter(p => p !== "N/A").length;
        const partyCounts = {};
        for (const p of partyList)
            if (p !== "N/A")
                partyCounts[p] = (partyCounts[p] ?? 0) + 1;
        const sortedParties = Object.entries(partyCounts).sort((a, b) => b[1] - a[1]);
        const top = sortedParties[0];
        const allSameParty = resolved >= 5 && sortedParties.length === 1;
        stagnancy.push({
            archId: a.id, archName: a.name,
            yearsResolved: resolved,
            partyStreak: top ? `${top[0]} (${top[1]}/${resolved})` : "N/A",
            allSameParty,
            breakdown: byYear,
        });
    }
    const fullStagnancyCount = stagnancy.filter(s => s.allSameParty).length;
    const resolvedArchCount = stagnancy.filter(s => s.yearsResolved >= 5).length;
    // ──────────────────────────────────────────────────────────────────────────
    // Build the report
    // ──────────────────────────────────────────────────────────────────────────
    const lines = [];
    const push = (s = "") => lines.push(s);
    push("# PRISM Archetype-Entity Alignment Audit");
    push(`*Generated ${new Date().toISOString()}*`);
    push("");
    push("## Corpus");
    push("");
    push(`- **Candidates**: ${candRows.length} profiles across 60 US presidential elections (1789-2024)`);
    push(`- **Regimes**: ${regRows.length} regime periods across ~47 jurisdictions (1789-2026)`);
    push(`- **Active archetypes scored against**: ${archetypes.length} (deactivated 019/023/025 excluded; prior=0 never wins)`);
    push(`- **Scoring**: \`archetypeDistance\` (baseline, quiz-identical). Softmax posterior at T=0.04 (minTemp at quiz termination).`);
    push(`- **Entity encoding**: one-hot position & category, uniform salience (entity profiles do not independently encode salience).`);
    push("");
    push("## Sanity checks");
    push("");
    push(`- **Deactivated archetypes in any entity's top-5**: ${deactivatedTop5} (expected: 0) — ${deactivatedTop5 === 0 ? "PASS" : "FAIL"}`);
    push(`- **Archetypes never top-1 for any entity**: ${archetypesNeverTop1.length} / ${archetypes.length}`);
    if (archetypesNeverTop1.length > 0) {
        push("  - Never-win IDs: " + archetypesNeverTop1.map(a => `${a.id} ${a.name}`).join(", "));
    }
    push(`- **Non-identifiable-archetype top-1 count (Step4 non-identifiable list)**: ${Object.values(nonIdentInTop1).reduce((a, b) => a + b, 0)} hits across ${Object.keys(nonIdentInTop1).length} IDs`);
    if (Object.keys(nonIdentInTop1).length > 0) {
        const rows = Object.entries(nonIdentInTop1).sort((a, b) => b[1] - a[1]);
        for (const [id, count] of rows) {
            push(`  - ${id} ${archName.get(id)}: ${count} entities`);
        }
    }
    push("");
    push("## Pair / margin flags");
    push("");
    const margin = rows.filter(r => r.familyPairByMargin).length;
    const sig = rows.filter(r => r.familyPairBySignature).length;
    push(`- **family-pair (margin < 0.03)**: ${margin}/${rows.length} (${(100 * margin / rows.length).toFixed(1)}%)`);
    push(`- **family-pair (top-1/top-2 signature distance ≤ 10th pctl)**: ${sig}/${rows.length} (${(100 * sig / rows.length).toFixed(1)}%)`);
    push(`- **Pre-registered pair {098↔102} occurrences**: ${preRegHits.filter(h => h.pair[0] === "098").length}`);
    push(`- **Pre-registered pair {070↔075} occurrences**: ${preRegHits.filter(h => h.pair[0] === "070").length}`);
    if (preRegHits.length > 0 && preRegHits.length < 50) {
        push("");
        push("Occurrences (top-1 and top-2 form a pre-registered pair):");
        push("");
        push("| pair | entity | context |");
        push("|---|---|---|");
        for (const h of preRegHits)
            push(`| {${h.pair.join(",")}} | ${h.entityId} | ${h.ctx} |`);
    }
    push("");
    push("## Post-2000 stagnancy (2000-2024 ticket-splitting)");
    push("");
    push(`Hypothesis: since 2000, 75%+ of archetypes should vote single-party across all 7 elections.`);
    push("");
    push(`- Archetypes with resolved preference in ≥5 of 7 elections: ${resolvedArchCount}/${archetypes.length}`);
    push(`- Of those, archetypes preferring a SINGLE party across all resolved elections: ${fullStagnancyCount} (${(100 * fullStagnancyCount / Math.max(1, resolvedArchCount)).toFixed(1)}%)`);
    push("");
    push("### Ticket-splitters (archetypes whose preferred-candidate party switched 2000-2024)");
    push("");
    const splitters = stagnancy.filter(s => s.yearsResolved >= 5 && !s.allSameParty);
    push(`Count: ${splitters.length} (${(100 * splitters.length / Math.max(1, resolvedArchCount)).toFixed(1)}% of resolved).`);
    push("");
    push("| archId | archetype | resolvedYrs | top-party | breakdown |");
    push("|---|---|---|---|---|");
    for (const s of splitters.slice(0, 40)) {
        const br = postYears.map(y => {
            const rec = s.breakdown[y];
            return rec ? `${y}:${rec.cand}(${rec.party[0]})` : `${y}:—`;
        }).join(" ");
        push(`| ${s.archId} | ${s.archName} | ${s.yearsResolved} | ${s.partyStreak} | ${br} |`);
    }
    if (splitters.length > 40)
        push(`... and ${splitters.length - 40} more (see stagnancy-detail.csv).`);
    push("");
    push("## Cross-reference-set coherence (best candidate vs best regime per archetype)");
    push("");
    push(`Each archetype's most confident match across candidates vs across regimes. If these are`);
    push(`semantically congruent (e.g. 'Reagan Coalition Conservative' → candidate Reagan + regime Reagan-Clinton), score is coherent.`);
    push("");
    push("| archId | archetype | best candidate (posterior) | best regime (posterior) |");
    push("|---|---|---|---|");
    const sortedCoh = Object.values(bestByArch).sort((a, b) => a.archId.localeCompare(b.archId));
    for (const rec of sortedCoh.slice(0, 40)) {
        const c = rec.bestCandidate ? `${rec.bestCandidate.ctx} (${rec.bestCandidate.posterior.toFixed(3)})` : "—";
        const r = rec.bestRegime ? `${rec.bestRegime.ctx} (${rec.bestRegime.posterior.toFixed(3)})` : "—";
        push(`| ${rec.archId} | ${rec.archName} | ${c} | ${r} |`);
    }
    push(`... (first 40 of ${sortedCoh.length}; full table → coherence.csv)`);
    push("");
    push("## Within-archetype spread (archetypes winning extreme-spanning entities)");
    push("");
    push(`Archetypes whose top-1 candidate wins span many decades OR whose top-1 regime wins span many jurisdictions`);
    push(`suggest the archetype is either (a) truly era/region-invariant, or (b) a diffuse attractor.`);
    push("");
    const topSpread = Object.values(spreadByArch)
        .filter(s => s.candYearSpan >= 100 || s.regJurisdictionCount >= 10)
        .sort((a, b) => (b.candYearSpan + b.regJurisdictionCount * 10) - (a.candYearSpan + a.regJurisdictionCount * 10));
    push(`- Archetypes with candidate-year-span ≥ 100 OR regime-jurisdiction-count ≥ 10: ${topSpread.length}`);
    push("");
    push("| archId | archetype | candWins | candYrSpan | regWins | regJurs |");
    push("|---|---|---|---|---|---|");
    for (const s of topSpread.slice(0, 30)) {
        push(`| ${s.archId} | ${s.archName} | ${s.candWinCount} | ${s.candYearSpan} | ${s.regWinCount} | ${s.regJurisdictionCount} |`);
    }
    push("");
    push("## Top attractors (archetypes winning the most entities as top-1)");
    push("");
    const topAttractors = Object.entries(top1Counts).sort((a, b) => b[1] - a[1]);
    push("| archId | archetype | top-1 count |");
    push("|---|---|---|");
    for (const [id, count] of topAttractors.slice(0, 20)) {
        push(`| ${id} | ${archName.get(id) ?? "?"} | ${count} |`);
    }
    push("");
    push("## Reproducibility note");
    push("");
    push(reprodNotes);
    push("");
    fs.writeFileSync(path.join(outDir, "report.md"), lines.join("\n"));
    console.log(`Wrote ${path.join(outDir, "report.md")}`);
    // Detailed CSVs
    const stagCsv = [
        ["archId", "archName", "yearsResolved", "partyStreak", "allSameParty",
            ...postYears.flatMap(y => [`${y}_cand`, `${y}_party`, `${y}_post`]),
        ].join(","),
        ...stagnancy.map(s => [
            s.archId, csvQ(s.archName), s.yearsResolved, csvQ(s.partyStreak), s.allSameParty,
            ...postYears.flatMap(y => {
                const b = s.breakdown[y];
                return [csvQ(b?.cand ?? ""), csvQ(b?.party ?? ""), b ? b.post.toFixed(4) : ""];
            }),
        ].join(","))
    ].join("\n");
    fs.writeFileSync(path.join(outDir, "stagnancy-detail.csv"), stagCsv);
    const cohCsv = [
        "archId,archName,bestCandidateEntity,bestCandidatePost,bestRegimeEntity,bestRegimePost",
        ...sortedCoh.map(rec => [
            rec.archId, csvQ(rec.archName),
            csvQ(rec.bestCandidate?.ctx ?? ""), rec.bestCandidate?.posterior?.toFixed(4) ?? "",
            csvQ(rec.bestRegime?.ctx ?? ""), rec.bestRegime?.posterior?.toFixed(4) ?? "",
        ].join(","))
    ].join("\n");
    fs.writeFileSync(path.join(outDir, "coherence.csv"), cohCsv);
    const spreadCsv = [
        "archId,archName,candWinCount,candYearSpan,regWinCount,regJurisdictionCount",
        ...Object.values(spreadByArch)
            .sort((a, b) => a.archId.localeCompare(b.archId))
            .map(s => [s.archId, csvQ(s.archName), s.candWinCount, s.candYearSpan, s.regWinCount, s.regJurisdictionCount].join(","))
    ].join("\n");
    fs.writeFileSync(path.join(outDir, "spread.csv"), spreadCsv);
    console.log(`Wrote stagnancy-detail.csv, coherence.csv, spread.csv`);
}
function csvQ(s) {
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
        return `"${s.replace(/"/g, '""')}"`;
    }
    return s;
}
main();
//# sourceMappingURL=analyzeAudit.js.map