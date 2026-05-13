import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { AMERICAS } from "../global/jurisdictions-americas.js";
import { ASIA } from "../global/jurisdictions-asia.js";
import { EUROPE_PART1 } from "../global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../global/jurisdictions-europe2.js";
import { MENA_AFRICA } from "../global/jurisdictions-mena.js";
const ALL_REGIMES = [
    ...EUROPE_PART1,
    ...EUROPE_PART2,
    ...AMERICAS,
    ...ASIA,
    ...MENA_AFRICA,
];
const POSITION_NODES = [
    "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S", "PF", "TRB", "ENG",
];
const CATEGORY_NODES = ["EPS", "AES"];
const EXPANSION_BACKLOG = {
    "Algeria": {
        priority: "P1",
        proposedBackfill: "Maghrebi regencies/Ottoman Algiers (1516-1830)",
        rationale: "Current coverage starts with French conquest; Ottoman Algiers supplies the needed precolonial baseline.",
        confidence: "medium",
    },
    "Argentina": {
        priority: "P1",
        proposedBackfill: "Rio de la Plata colonial frontier (1580-1810)",
        rationale: "Needed to distinguish Spanish imperial institutions, Buenos Aires commerce, and frontier society before independence.",
        confidence: "medium",
    },
    "Austria/Austria-Hungary": {
        priority: "P1",
        proposedBackfill: "Habsburg composite monarchy (1526-1740); enlightened absolutism (1740-1789)",
        rationale: "The post-1789 Habsburg line lacks the pre-revolutionary dynastic-bureaucratic baseline.",
        confidence: "high",
    },
    "Belgium": {
        priority: "P2",
        proposedBackfill: "Spanish/Austrian Netherlands (1556-1794)",
        rationale: "Backfill should represent Catholic corporatist Habsburg rule before French and Dutch interludes.",
        confidence: "medium",
    },
    "Brazil": {
        priority: "P1",
        proposedBackfill: "Portuguese Brazil/sugar-slave order (1500-1695); gold-cycle Brazil (1695-1808)",
        rationale: "The map currently starts after colonial society and slavery were already deeply institutionalized.",
        confidence: "high",
    },
    "Canada": {
        priority: "P1",
        proposedBackfill: "New France (1608-1763); British North America/Quebec Act (1763-1791)",
        rationale: "French Catholic seigneurial and post-conquest British imperial periods are distinct enough to score separately.",
        confidence: "high",
    },
    "Chile": {
        priority: "P2",
        proposedBackfill: "Captaincy of Chile/Mapuche frontier (1541-1810)",
        rationale: "Adds the colonial frontier-military baseline before independence.",
        confidence: "medium",
    },
    "China": {
        priority: "P0",
        proposedBackfill: "Song commercial-bureaucratic order (960-1279); Yuan conquest dynasty (1271-1368); Ming restoration (1368-1644); High Qing (1644-1788)",
        rationale: "China is a civilizational anchor for the map; pre-1789 regimes should not be collapsed into late Qing.",
        confidence: "high",
    },
    "Colombia": {
        priority: "P2",
        proposedBackfill: "New Kingdom of Granada (1538-1810)",
        rationale: "Needed to ground post-independence fragmentation against Spanish colonial administration.",
        confidence: "medium",
    },
    "Cuba": {
        priority: "P1",
        proposedBackfill: "Spanish plantation colony (1511-1868)",
        rationale: "Slavery, sugar, and late Spanish rule are essential for interpreting later revolutionary regimes.",
        confidence: "high",
    },
    "Czech/Czechoslovakia": {
        priority: "P2",
        proposedBackfill: "Bohemian crown lands under Habsburg rule (1526-1789)",
        rationale: "Backfill should capture Catholic recatholicization, estates, and imperial administration.",
        confidence: "medium",
    },
    "Egypt": {
        priority: "P1",
        proposedBackfill: "Mamluk-Ottoman Egypt (1517-1798)",
        rationale: "Current coverage starts at the Napoleonic break; Ottoman-Mamluk local power needs a baseline.",
        confidence: "high",
    },
    "Ethiopia": {
        priority: "P1",
        proposedBackfill: "Solomonic highland empire/Zemene Mesafint onset (1270-1855)",
        rationale: "Ethiopia is one of the few tracked countries with deep state continuity before European imperialism.",
        confidence: "medium",
    },
    "France": {
        priority: "P0",
        proposedBackfill: "Bourbon absolutism/Ancien Regime (1589-1788)",
        rationale: "France is central to the 1789 pivot; the map needs the regime the revolution replaced.",
        confidence: "high",
    },
    "Germany/Prussia": {
        priority: "P0",
        proposedBackfill: "Holy Roman Empire/territorial states (1648-1701); Prussian absolutism (1701-1788)",
        rationale: "The Prussian path into modern Germany requires a pre-1789 state-building baseline.",
        confidence: "high",
    },
    "Greece": {
        priority: "P2",
        proposedBackfill: "Ottoman Greek lands/Phanariot order (1453-1821)",
        rationale: "Useful as a baseline for independence nationalism and Orthodox communal institutions.",
        confidence: "medium",
    },
    "Hungary": {
        priority: "P2",
        proposedBackfill: "Habsburg Hungary after Ottoman wars (1699-1789)",
        rationale: "Backfill should capture estates, Magyar nobility, and Habsburg integration.",
        confidence: "medium",
    },
    "India": {
        priority: "P0",
        proposedBackfill: "Delhi Sultanate (1206-1526); Mughal Empire (1526-1707); regional successor states/EIC expansion (1707-1788)",
        rationale: "India's modern map cannot be grounded without Mughal and early Company transition periods.",
        confidence: "high",
    },
    "Indonesia": {
        priority: "P1",
        proposedBackfill: "VOC archipelago rule (1602-1799)",
        rationale: "Adds the colonial-commercial order before formal Dutch East Indies state consolidation.",
        confidence: "high",
    },
    "Iran": {
        priority: "P0",
        proposedBackfill: "Safavid Iran (1501-1736); Afsharid/Zand transition (1736-1794)",
        rationale: "Iran's Shi'a imperial and post-Safavid transition are too important to start only in Qajar-era modernity.",
        confidence: "high",
    },
    "Iraq": {
        priority: "P2",
        proposedBackfill: "Ottoman Iraq/Mamluk Baghdad (1534-1831)",
        rationale: "Backfill should represent Ottoman provincial and local Mamluk governance before British state formation.",
        confidence: "medium",
    },
    "Israel": {
        priority: "P2",
        proposedBackfill: "Ottoman Palestine (1517-1917)",
        rationale: "Useful for geographic continuity, but modern Israel's regime sequence begins much later.",
        confidence: "medium",
    },
    "Italy": {
        priority: "P1",
        proposedBackfill: "Italian regional states (1559-1796)",
        rationale: "Venice, Papal States, Savoy, Naples, and Austrian Lombardy should precede unification-era scoring.",
        confidence: "medium",
    },
    "Japan": {
        priority: "P0",
        proposedBackfill: "Sengoku unification (1467-1603); early/mid Tokugawa bakufu (1603-1788)",
        rationale: "Tokugawa political order is essential for interpreting the Meiji rupture.",
        confidence: "high",
    },
    "Korea": {
        priority: "P0",
        proposedBackfill: "Joseon dynasty (1392-1788)",
        rationale: "Joseon Confucian bureaucracy is the obvious premodern baseline for both Koreas.",
        confidence: "high",
    },
    "Mexico": {
        priority: "P1",
        proposedBackfill: "Aztec/Triple Alliance context (1428-1521); New Spain (1521-1810)",
        rationale: "The colonial caste, silver, church, and crown order strongly shape post-independence Mexico.",
        confidence: "high",
    },
    "Netherlands": {
        priority: "P1",
        proposedBackfill: "Dutch Republic/Golden Age and stadholderate (1581-1795)",
        rationale: "The current map should include the commercial republican model before Batavian/French disruption.",
        confidence: "high",
    },
    "Nigeria": {
        priority: "P1",
        proposedBackfill: "Oyo/Benin/Borno/Sokoto regional polities (pre-1861); British conquest transition (1861-1914)",
        rationale: "Nigeria requires regional precolonial placeholders before colonial amalgamation.",
        confidence: "low",
    },
    "Ottoman Empire/Turkey": {
        priority: "P0",
        proposedBackfill: "Ottoman rise/classical empire (1299-1566); post-classical Ottoman order (1566-1788)",
        rationale: "The current Tanzimat-and-after story needs the empire's earlier institutional baseline.",
        confidence: "high",
    },
    "Pakistan": {
        priority: "P1",
        proposedBackfill: "Indus/Sultanate-Mughal regional baseline; Sikh/Durrani frontier transition (1707-1849)",
        rationale: "Pakistan should inherit a South Asian Muslim, Sikh, and frontier-state baseline before British India.",
        confidence: "medium",
    },
    "Peru": {
        priority: "P1",
        proposedBackfill: "Inca Empire (1438-1533); Viceroyalty of Peru (1542-1821)",
        rationale: "The Andes need both Inca imperial and Spanish viceregal data points.",
        confidence: "high",
    },
    "Philippines": {
        priority: "P1",
        proposedBackfill: "Spanish Philippines (1565-1898)",
        rationale: "Spanish Catholic colonial rule is the needed baseline before American rule and independence.",
        confidence: "high",
    },
    "Poland": {
        priority: "P1",
        proposedBackfill: "Polish-Lithuanian Commonwealth (1569-1795)",
        rationale: "The elective noble republic and partition crisis are essential for Polish political continuity.",
        confidence: "high",
    },
    "Portugal": {
        priority: "P1",
        proposedBackfill: "Portuguese Restoration/Braganza monarchy (1640-1755); Pombaline reforms (1755-1777); late ancien regime (1777-1820)",
        rationale: "Portuguese imperial monarchy and enlightened absolutism anchor later liberal conflict.",
        confidence: "high",
    },
    "Romania": {
        priority: "P2",
        proposedBackfill: "Danubian principalities under Ottoman suzerainty (1600-1859)",
        rationale: "Needed to ground later national consolidation and foreign suzerainty.",
        confidence: "medium",
    },
    "Russia/USSR": {
        priority: "P0",
        proposedBackfill: "Muscovy/Tsarist centralization (1547-1682); Petrine imperial Russia (1682-1762); Catherinean imperial Russia (1762-1796)",
        rationale: "Russia is a core world-alignment case and needs pre-1789 imperial-autocratic baselines.",
        confidence: "high",
    },
    "Saudi Arabia": {
        priority: "P1",
        proposedBackfill: "First Saudi state/Wahhabi alliance (1727-1818); Ottoman-Hejazi and tribal Arabia context",
        rationale: "The Saudi-Wahhabi state-forming baseline should precede modern kingdom rows.",
        confidence: "medium",
    },
    "South Africa": {
        priority: "P1",
        proposedBackfill: "Khoisan/Bantu polities; Dutch Cape Colony (1652-1795); British Cape transition (1795-1910)",
        rationale: "Colonial settler, slavery, and frontier structures predate Union and apartheid.",
        confidence: "medium",
    },
    "South Korea": {
        priority: "P0",
        proposedBackfill: "Joseon dynasty (1392-1897); Korean Empire/Japanese protectorate (1897-1910)",
        rationale: "South Korea should share the Joseon baseline with Korea before the post-1945 split.",
        confidence: "high",
    },
    "Spain": {
        priority: "P1",
        proposedBackfill: "Habsburg Spain (1516-1700); Bourbon reform monarchy (1700-1788)",
        rationale: "Adds the imperial Catholic monarchy and Bourbon reform baseline.",
        confidence: "high",
    },
    "Sweden": {
        priority: "P2",
        proposedBackfill: "Swedish great-power era (1611-1721); Age of Liberty/Gustavian monarchy (1721-1789)",
        rationale: "Useful to anchor later Scandinavian constitutional and social-democratic development.",
        confidence: "high",
    },
    "Switzerland": {
        priority: "P2",
        proposedBackfill: "Old Swiss Confederacy (1291-1798)",
        rationale: "The confederal, cantonal baseline is central to Swiss continuity.",
        confidence: "high",
    },
    "Taiwan": {
        priority: "P0",
        proposedBackfill: "Dutch-Zheng Taiwan (1624-1683); Qing Taiwan (1684-1894); Japanese colony (1895-1945); ROC/KMT authoritarianism and democracy (1945-present)",
        rationale: "Taiwan/Republic of China was missing entirely after 1949 and should remain separate from PRC China.",
        confidence: "high",
    },
    "Thailand": {
        priority: "P0",
        proposedBackfill: "Ayutthaya kingdom (1351-1767); Thonburi/Rattanakosin founding (1767-1788)",
        rationale: "Siam's continuity is central because it avoided formal colonization.",
        confidence: "high",
    },
    "USA": {
        priority: "P0",
        proposedBackfill: "British colonial America (1607-1763); revolutionary-confederation period (1763-1788)",
        rationale: "The U.S. map currently starts at the constitutional regime and lacks colonial/revolutionary foundations.",
        confidence: "high",
    },
    "United Kingdom": {
        priority: "P0",
        proposedBackfill: "Tudor/Stuart monarchy (1485-1642); Civil War/Commonwealth (1642-1660); Restoration/Glorious Revolution settlement (1660-1714); Hanoverian oligarchy (1714-1788)",
        rationale: "The current UK sequence begins after the long constitutional settlement was already formed.",
        confidence: "high",
    },
    "Venezuela": {
        priority: "P2",
        proposedBackfill: "Spanish Venezuela/Captaincy General (1528-1810)",
        rationale: "Adds colonial cacao, slavery, and regional elite context before independence and caudillismo.",
        confidence: "medium",
    },
    "Vietnam": {
        priority: "P0",
        proposedBackfill: "Le/Trinh-Nguyen division (1428-1802); Nguyen dynasty before French conquest (1802-1858)",
        rationale: "Vietnam needs a precolonial state baseline before French Indochina and revolutionary modernity.",
        confidence: "high",
    },
};
function main() {
    const outDir = join(process.cwd(), "results", "world-alignment-audit");
    mkdirSync(outDir, { recursive: true });
    const issues = [];
    for (const regime of ALL_REGIMES) {
        auditRegimeValues(regime, issues);
        auditText(regime, issues);
    }
    const byJurisdiction = groupByJurisdiction(ALL_REGIMES);
    const coverageRows = [];
    for (const [jurisdiction, regimes] of byJurisdiction) {
        const sorted = [...regimes].sort((a, b) => a.startYear - b.startYear || a.endYear - b.endYear);
        auditTimeline(jurisdiction, sorted, issues);
        coverageRows.push(buildCoverageRow(jurisdiction, sorted, issues));
    }
    const trackedJurisdictions = [...byJurisdiction.keys()].sort((a, b) => a.localeCompare(b));
    const expansionRows = trackedJurisdictions.map(jurisdiction => {
        const plan = EXPANSION_BACKLOG[jurisdiction] ?? {
            priority: "P2",
            proposedBackfill: "Pre-1789 baseline period to be specified",
            rationale: "No bespoke backfill row has been drafted yet.",
            confidence: "low",
        };
        const regimes = byJurisdiction.get(jurisdiction) ?? [];
        const firstYear = Math.min(...regimes.map(r => r.startYear));
        return {
            jurisdiction,
            firstCurrentYear: firstYear,
            alreadyHasPre1789: firstYear < 1789,
            ...plan,
        };
    });
    const sortedIssues = [...issues].sort(compareIssues);
    writeFileSync(join(outDir, "sanity-issues.csv"), toCsv(["severity", "jurisdiction", "type", "regime", "years", "detail"], sortedIssues.map(i => [i.severity, i.jurisdiction, i.type, i.regime, i.years, i.detail])));
    writeFileSync(join(outDir, "coverage.csv"), toCsv(["jurisdiction", "regimeCount", "firstYear", "lastYear", "hasPre1789", "p0", "p1", "p2", "info"], [...coverageRows]
        .sort((a, b) => a.jurisdiction.localeCompare(b.jurisdiction))
        .map((r) => [r.jurisdiction, r.regimeCount, r.firstYear, r.lastYear, r.hasPre1789, r.p0, r.p1, r.p2, r.info])));
    writeFileSync(join(outDir, "pre1789-expansion-plan.csv"), toCsv(["jurisdiction", "firstCurrentYear", "alreadyHasPre1789", "priority", "proposedBackfill", "rationale", "confidence"], expansionRows.map(r => [
        r.jurisdiction,
        r.firstCurrentYear,
        r.alreadyHasPre1789,
        r.priority,
        r.proposedBackfill,
        r.rationale,
        r.confidence,
    ])));
    writeFileSync(join(outDir, "report.md"), buildReport(coverageRows, sortedIssues, expansionRows));
    console.log(`World alignment audit complete: ${ALL_REGIMES.length} regimes, ${trackedJurisdictions.length} jurisdictions`);
    console.log(`Issues: ${sortedIssues.length} (${countSeverity(sortedIssues, "P0")} P0, ${countSeverity(sortedIssues, "P1")} P1, ${countSeverity(sortedIssues, "P2")} P2)`);
    console.log(`Outputs written to ${outDir}`);
}
function auditRegimeValues(regime, issues) {
    if (regime.startYear > regime.endYear) {
        addIssue(issues, "P0", regime, "invalid_range", `startYear ${regime.startYear} is after endYear ${regime.endYear}`);
    }
    for (const node of POSITION_NODES) {
        const value = regime[node];
        if (!Number.isFinite(value) || value < 1 || value > 5) {
            addIssue(issues, "P0", regime, "node_out_of_bounds", `${node}=${value}; expected 1-5`);
        }
    }
    for (const node of CATEGORY_NODES) {
        const value = regime[node];
        if (!Number.isFinite(value) || value < 0 || value > 5) {
            addIssue(issues, "P0", regime, "category_out_of_bounds", `${node}=${value}; expected 0-5`);
        }
    }
}
function auditText(regime, issues) {
    const text = `${regime.regime} ${regime.description}`;
    if (/[ÃÅâ�]/.test(text)) {
        addIssue(issues, "P1", regime, "mojibake_suspect", "Text contains mojibake-looking characters; inspect encoding/display.");
    }
    if (regime.description.trim().length < 80) {
        addIssue(issues, "P2", regime, "thin_description", "Description is shorter than 80 characters; tooltip context may be weak.");
    }
}
function auditTimeline(jurisdiction, regimes, issues) {
    for (let i = 1; i < regimes.length; i++) {
        const prev = regimes[i - 1];
        const next = regimes[i];
        if (!prev || !next)
            continue;
        if (next.startYear < prev.endYear) {
            addIssue(issues, "P1", next, "timeline_overlap", `${prev.regime} ends ${prev.endYear}, but ${next.regime} starts ${next.startYear}`);
        }
        else if (next.startYear === prev.endYear) {
            addIssue(issues, "P2", next, "same_year_boundary", `${prev.regime} and ${next.regime} share boundary year ${next.startYear}; clarify inclusive/exclusive convention.`);
        }
        else if (next.startYear === prev.endYear + 1) {
            addIssue(issues, "info", next, "exclusive_renderer_boundary_gap", `${prev.regime} ends ${prev.endYear} and ${next.regime} starts ${next.startYear}; end-exclusive renderers will omit ${prev.endYear}.`);
        }
        else if (next.startYear > prev.endYear + 1) {
            addIssue(issues, "P1", next, "timeline_gap", `${prev.regime} ends ${prev.endYear}, next starts ${next.startYear}; missing ${prev.endYear + 1}-${next.startYear - 1}.`);
        }
        const jump = largestAdjacentJump(prev, next);
        if (jump.maxDelta >= 4 || jump.rmsDelta >= 2.35) {
            addIssue(issues, "P2", next, "large_node_jump", `${prev.regime} -> ${next.regime}: largest ${jump.node} delta ${jump.maxDelta.toFixed(1)}, RMS ${jump.rmsDelta.toFixed(2)}.`);
        }
    }
    const first = regimes[0];
    if (first && first.startYear > 1789) {
        issues.push({
            severity: "P2",
            jurisdiction,
            type: "late_start",
            regime: first.regime,
            years: `${first.startYear}-${first.endYear}`,
            detail: `Coverage starts in ${first.startYear}; add pre-1789 or pre-modern baseline if the map supports earlier sliders.`,
        });
    }
}
function largestAdjacentJump(prev, next) {
    let node = "";
    let maxDelta = -Infinity;
    let sumSq = 0;
    let count = 0;
    for (const key of [...POSITION_NODES, ...CATEGORY_NODES]) {
        const delta = Math.abs(next[key] - prev[key]);
        if (delta > maxDelta) {
            maxDelta = delta;
            node = key;
        }
        sumSq += delta * delta;
        count += 1;
    }
    return {
        node,
        maxDelta,
        rmsDelta: Math.sqrt(sumSq / count),
    };
}
function buildCoverageRow(jurisdiction, regimes, issues) {
    const relevant = issues.filter(i => i.jurisdiction === jurisdiction);
    return {
        jurisdiction,
        regimeCount: regimes.length,
        firstYear: Math.min(...regimes.map(r => r.startYear)),
        lastYear: Math.max(...regimes.map(r => r.endYear)),
        hasPre1789: regimes.some(r => r.startYear < 1789),
        p0: countSeverity(relevant, "P0"),
        p1: countSeverity(relevant, "P1"),
        p2: countSeverity(relevant, "P2"),
        info: countSeverity(relevant, "info"),
    };
}
function groupByJurisdiction(regimes) {
    const map = new Map();
    for (const regime of regimes) {
        const existing = map.get(regime.jurisdiction);
        if (existing)
            existing.push(regime);
        else
            map.set(regime.jurisdiction, [regime]);
    }
    return map;
}
function addIssue(issues, severity, regime, type, detail) {
    issues.push({
        severity,
        jurisdiction: regime.jurisdiction,
        type,
        regime: regime.regime,
        years: `${regime.startYear}-${regime.endYear}`,
        detail,
    });
}
function compareIssues(a, b) {
    const rank = { P0: 0, P1: 1, P2: 2, info: 3 };
    return (rank[a.severity] - rank[b.severity] ||
        a.jurisdiction.localeCompare(b.jurisdiction) ||
        a.type.localeCompare(b.type) ||
        a.years.localeCompare(b.years));
}
function countSeverity(issues, severity) {
    return issues.filter(i => i.severity === severity).length;
}
function buildReport(coverageRows, issues, expansionRows) {
    const p0 = issues.filter(i => i.severity === "P0");
    const p1 = issues.filter(i => i.severity === "P1");
    const p2 = issues.filter(i => i.severity === "P2");
    const info = issues.filter(i => i.severity === "info");
    const pre1789 = coverageRows.filter(r => r.hasPre1789).length;
    const lateStarts = issues.filter(i => i.type === "late_start").length;
    const topP1 = p1.slice(0, 20);
    const highPriorityBackfills = expansionRows.filter(r => r.priority === "P0");
    return [
        "# World Alignment Audit",
        "",
        `Generated: ${new Date().toISOString()}`,
        "",
        "## Summary",
        "",
        `- Regime periods: ${ALL_REGIMES.length}`,
        `- Jurisdictions: ${coverageRows.length}`,
        `- Jurisdictions with at least one pre-1789 row: ${pre1789}/${coverageRows.length}`,
        `- Jurisdictions whose current coverage still starts after 1789: ${lateStarts}`,
        `- Issues: ${issues.length} total (${p0.length} P0, ${p1.length} P1, ${p2.length} P2, ${info.length} info)`,
        "",
        "## Interpretation",
        "",
        "- P0 means structurally invalid data, such as out-of-range node values.",
        "- P1 means a sanity-check problem worth reviewing before treating the map as canonical.",
        "- P2 means plausible but review-worthy, often because the periodization is coarse or a boundary convention is ambiguous.",
        "- `exclusive_renderer_boundary_gap` is informational: the source table often uses inclusive-looking year ranges, while the live map lookup treats `endYear` as exclusive.",
        "",
        "## Highest-Priority Backfills",
        "",
        ...highPriorityBackfills.map(r => `- ${r.jurisdiction}: ${r.proposedBackfill}`),
        "",
        "## P1 Issues To Review First",
        "",
        ...(topP1.length > 0
            ? topP1.map(i => `- ${i.jurisdiction} ${i.years} ${i.type}: ${i.detail}`)
            : ["- None"]),
        "",
        "## Output Files",
        "",
        "- `coverage.csv`",
        "- `sanity-issues.csv`",
        "- `pre1789-expansion-plan.csv`",
        "",
    ].join("\n");
}
function toCsv(header, rows) {
    return [
        header.map(csvQuote).join(","),
        ...rows.map(row => row.map(value => csvQuote(String(value))).join(",")),
    ].join("\n");
}
function csvQuote(value) {
    if (/[",\n]/.test(value)) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
}
main();
//# sourceMappingURL=world-alignment-audit.js.map