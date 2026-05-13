// Audits the ~368 regime periods for likely mislabels — regimes whose stated
// label or duration is unlikely to match a coherent political era. Surfaces
// suspects for manual review; does not auto-edit the data.
//
// Premise (per CLAUDE.md conversation 2026-04-26): a regime should capture
// structural continuity that survives leader turnover. A regime named after
// one party/leader that spans periods that party didn't govern (e.g. "PiS
// Poland" 1998–2026, where PiS actually governed ~13 of 28 years) is the
// canonical failure mode this audit targets.
//
// Signals (no external leader-data required):
//   1. MODERN_LONG_SPAN     — span > 25y ending ≥2000 (or > 15y ending ≥2010)
//   2. TRANSITION_LANGUAGE  — description self-confesses within-regime transitions
//   3. PARTY_LABEL_RISK     — label names a single party/leader, span > 12y, ends recently
//   4. CROSSES_WATERSHED    — span crosses 1989, 2008, 2020 inflection points
//   5. ENDS_2026_PARTY_LABEL — ends in current year AND is named after a specific party
import { EUROPE_PART1 } from "../global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../global/jurisdictions-europe2.js";
import { AMERICAS } from "../global/jurisdictions-americas.js";
import { ASIA } from "../global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../global/jurisdictions-mena.js";
import { writeFileSync, mkdirSync } from "node:fs";
const ALL_REGIMES = [
    ...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA,
];
// Tokens that, when found in a regime label, indicate the regime is named after
// a specific party or individual rather than a structural era. Word-boundary
// matched, case-insensitive.
const PARTY_LEADER_TOKENS = [
    // Parties (acronyms first, then spelled out)
    "PiS", "PO", "AKP", "BJP", "INC", "CCP", "PRI", "ANC", "Likud", "MAS",
    "Fidesz", "ÖVP", "OVP", "FPÖ", "FPO", "AfD", "FN", "RN", "Lega", "M5S",
    "SPD", "CDU", "CSU", "Labour", "Tory", "Tories", "Conservative", "Whig",
    "Federalist", "Democrat", "Republican", "Jacobin",
    // Leaders (recent + iconic)
    "Putin", "Trump", "Erdoğan", "Erdogan", "Modi", "Xi Jinping", "Xi",
    "Orbán", "Orban", "Maduro", "Bolsonaro", "Macron", "Meloni", "Netanyahu",
    "Reagan", "Thatcher", "Blair", "Cameron", "Johnson", "Obama", "Biden",
    "Lula", "Kirchner", "Chávez", "Chavez", "Bukele",
    "Mao", "Stalin", "Khrushchev", "Brezhnev", "Yeltsin", "Gorbachev",
    "Tito", "Franco", "Salazar", "Pinochet", "Peron", "Perón",
    "Pilsudski", "Piłsudski", "Atatürk", "Ataturk", "Khomeini",
];
// Phrases that, when present in a regime description, suggest the regime
// description itself is narrating a transition between eras — i.e. the
// description writer felt the need to bridge sub-eras within one label.
const TRANSITION_PHRASES = [
    "transition", "shock therapy", "round table", "perestroika", "glasnost",
    "later", "subsequent", "evolved into", "gave way to", "succeeded by",
    "would later", "ultimately led to", "ushered in", "transformed",
    "negotiated revolution", "regime change",
];
// Two-word ordered patterns: "A ... B" where A appears before B in the text.
const TRANSITION_BIGRAMS = [
    ["before", "after"],
    ["first", "then"],
    ["from", "to"],
    ["initially", "later"],
    ["early", "late"],
];
const WATERSHEDS = [1989, 2008, 2020];
function scoreRegime(r) {
    const span = r.endYear - r.startYear;
    let score = 0;
    const signals = [];
    // 1. MODERN_LONG_SPAN
    if (span > 25 && r.endYear >= 2000) {
        score += 30;
        signals.push(`MODERN_LONG_SPAN(${span}y, ends ${r.endYear})`);
    }
    else if (span > 15 && r.endYear >= 2010) {
        score += 15;
        signals.push(`MODERN_MID_SPAN(${span}y, ends ${r.endYear})`);
    }
    // 2. TRANSITION_LANGUAGE
    const desc = r.description.toLowerCase();
    const matchedPhrases = TRANSITION_PHRASES.filter((p) => desc.includes(p));
    const matchedBigrams = TRANSITION_BIGRAMS.filter(([a, b]) => {
        const ia = desc.indexOf(a);
        if (ia < 0)
            return false;
        const ib = desc.indexOf(b, ia + a.length);
        return ib > ia;
    });
    const totalTransitionHits = matchedPhrases.length + matchedBigrams.length;
    if (totalTransitionHits > 0) {
        const pts = Math.min(25, totalTransitionHits * 8);
        score += pts;
        const labels = [
            ...matchedPhrases,
            ...matchedBigrams.map(([a, b]) => `${a}…${b}`),
        ];
        signals.push(`TRANSITION_LANGUAGE[${labels.join(", ")}](+${pts})`);
    }
    // 3. PARTY_LABEL_RISK
    const matchedTokens = PARTY_LEADER_TOKENS.filter((t) => new RegExp(`\\b${escapeRegex(t)}\\b`, "i").test(r.regime));
    if (matchedTokens.length > 0 && span > 12 && r.endYear >= 2010) {
        score += 25;
        signals.push(`PARTY_LABEL_RISK[${matchedTokens.join(", ")}]`);
    }
    // 4. CROSSES_WATERSHED
    const crossed = WATERSHEDS.filter((y) => r.startYear < y && r.endYear > y);
    if (crossed.length > 0) {
        const pts = crossed.length * 7;
        score += pts;
        signals.push(`CROSSES_WATERSHED[${crossed.join(", ")}](+${pts})`);
    }
    // 5. ENDS_2026_PARTY_LABEL — current era, named after a party
    if (r.endYear >= 2025 && matchedTokens.length > 0) {
        score += 15;
        signals.push(`ENDS_2026_PARTY_LABEL[${matchedTokens.join(", ")}](+15)`);
    }
    return { regime: r, span, score, signals };
}
function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function main() {
    const audit = ALL_REGIMES.map(scoreRegime).sort((a, b) => b.score - a.score);
    const flagged = audit.filter((a) => a.score >= 25);
    let md = `# Regime Mislabel Audit\n\n`;
    md += `Generated: ${new Date().toISOString().slice(0, 10)}\n`;
    md += `Total regimes: ${ALL_REGIMES.length}\n`;
    md += `Flagged (score ≥ 25): ${flagged.length}\n\n`;
    md += `## Methodology\n\n`;
    md += `Heuristic suspicion score per regime, summed across signals (max ~110):\n\n`;
    md += `| Signal | Points | Trigger |\n`;
    md += `|---|---|---|\n`;
    md += `| MODERN_LONG_SPAN | +30 | span > 25y, ends ≥ 2000 |\n`;
    md += `| MODERN_MID_SPAN | +15 | span > 15y, ends ≥ 2010 |\n`;
    md += `| TRANSITION_LANGUAGE | +8 each, cap +25 | description narrates within-regime transitions |\n`;
    md += `| PARTY_LABEL_RISK | +25 | label names party/leader, span > 12y, ends ≥ 2010 |\n`;
    md += `| CROSSES_WATERSHED | +7 each | span crosses 1989, 2008, or 2020 |\n`;
    md += `| ENDS_2026_PARTY_LABEL | +15 | ends ≥ 2025 AND named after specific party/leader |\n\n`;
    md += `**Limitation:** no per-jurisdiction head-of-government timeline. Signals catch `;
    md += `*symptoms* of mislabel (long modern span, party-name attribution, self-narrated `;
    md += `transitions) but cannot directly verify whether a regime's leader-roster matches `;
    md += `its claimed ideological position. Manual review required for every flagged entry.\n\n`;
    md += `## Top Suspects (score ≥ 25)\n\n`;
    for (const a of flagged) {
        const r = a.regime;
        md += `### \`[${a.score}]\` ${r.jurisdiction} — *${r.regime}* (${r.startYear}–${r.endYear}, ${a.span}y)\n\n`;
        md += `**Signals:**\n`;
        for (const s of a.signals)
            md += `- ${s}\n`;
        md += `\n**Description:** ${r.description}\n\n`;
        md += `---\n\n`;
    }
    mkdirSync("results/regime-audit", { recursive: true });
    writeFileSync("results/regime-audit/mislabels.md", md);
    console.log(`Audited ${ALL_REGIMES.length} regimes.`);
    console.log(`Flagged ${flagged.length} with suspicion score ≥ 25.\n`);
    console.log(`Top 15:`);
    for (const a of audit.slice(0, 15)) {
        const tag = `[${String(a.score).padStart(3)}]`;
        const j = a.regime.jurisdiction.padEnd(20);
        const rg = a.regime.regime.padEnd(35);
        const sp = `${a.regime.startYear}–${a.regime.endYear} (${a.span}y)`;
        console.log(`  ${tag} ${j} ${rg} ${sp}`);
    }
    console.log(`\nFull report: results/regime-audit/mislabels.md`);
}
main();
//# sourceMappingURL=auditRegimeMislabels.js.map