/**
 * Enumerate every label the composer can produce — for human review.
 *
 * Walks the full token space (12 continuous nodes × {low, mid, high} + EPS 6
 * categories + AES 6 categories + 7 moral-circle adjectives), generates every
 * valid 1/2/3-token combination respecting the mid-rank-1-only rule, and
 * composes a label for each.
 *
 * Output: results/identity/all-label-combinations.csv
 *
 * Columns:
 *   token_count, source (merger-full | merger-partial | lexicon), signature,
 *   label, tokens
 *
 * Run: npx tsx src/identity/enumerateLabels.ts
 */
import { writeFileSync, mkdirSync } from "node:fs";
import { POSITION_LEXICON, EPS_LEXICON, AES_LEXICON, MORAL_CIRCLE_SCOPE_LEXICON, DEFAULT_MERGER_TABLE, COMPRESSION_TABLE, composeLabel, signatureOf, } from "./archetypeLabeler.js";
const EMPTY_MERGER_TABLE = {};
// ──────────────────────────────────────────────────────────────────────────────
// Build the full atomic token set
// ──────────────────────────────────────────────────────────────────────────────
const allTokens = [];
// Continuous nodes: 3 bins each
for (const [node, lex] of Object.entries(POSITION_LEXICON)) {
    allTokens.push({ slot: node, bin: "low", token: lex.low, isMid: false, isCategorical: false });
    allTokens.push({ slot: node, bin: "mid", token: lex.mid, isMid: true, isCategorical: false });
    allTokens.push({ slot: node, bin: "high", token: lex.high, isMid: false, isCategorical: false });
}
// EPS categories
for (const cat of EPS_LEXICON) {
    allTokens.push({ slot: "EPS", bin: cat, token: cat, isMid: false, isCategorical: true });
}
// AES categories
for (const cat of AES_LEXICON) {
    allTokens.push({ slot: "AES", bin: cat, token: cat, isMid: false, isCategorical: true });
}
// Moral-circle: universal + 6 scope adjectives
allTokens.push({ slot: "MORAL_CIRCLE", bin: "universal", token: "Universalist", isMid: false, isCategorical: true });
for (const [scope, adj] of Object.entries(MORAL_CIRCLE_SCOPE_LEXICON)) {
    allTokens.push({ slot: "MORAL_CIRCLE", bin: scope, token: adj, isMid: false, isCategorical: true });
}
console.log(`Atomic token count: ${allTokens.length}`);
console.log(`  Continuous (3 bins × 12 nodes):    ${12 * 3}`);
console.log(`  EPS categoricals:                  ${EPS_LEXICON.length}`);
console.log(`  AES categoricals:                  ${AES_LEXICON.length}`);
console.log(`  Moral-circle scopes + universal:   ${1 + Object.keys(MORAL_CIRCLE_SCOPE_LEXICON).length}`);
// ──────────────────────────────────────────────────────────────────────────────
// Convert a TokenSlot into a TokenEntry the composer expects
// ──────────────────────────────────────────────────────────────────────────────
function toEntry(t, isTop1) {
    // The composer reads bin + node + token. Salience and isCategorical only
    // affect upstream selection, which we're bypassing here. Synthetic
    // salience: top-1 gets 2.95, others get 2.85.
    return {
        node: t.slot,
        bin: t.bin,
        token: t.token,
        salience: isTop1 ? 2.95 : 2.85,
        isCategorical: t.isCategorical,
    };
}
const rows = new Map();
function add(entries) {
    const r = composeLabel(entries, DEFAULT_MERGER_TABLE);
    // Also compute the raw lexicon-only label (no merger, no compression) for
    // comparison. We do this by re-composing with empty merger table — but the
    // current composer still applies compression. So compute by hand.
    const rawLexicon = entries.map(e => e.token).join(" ");
    const sig = signatureOf(entries);
    const key = `${entries.length}|${sig}`;
    if (rows.has(key))
        return;
    rows.set(key, {
        tokenCount: entries.length,
        signature: sig,
        label: r.label,
        source: r.source,
        raw_lexicon: rawLexicon,
        compressed: r.source === "lexicon" && r.label !== rawLexicon,
        tokens: entries.map(e => e.token).join(" + "),
    });
}
// 1-token
for (const t of allTokens) {
    add([toEntry(t, true)]);
}
// 2-token
for (let i = 0; i < allTokens.length; i++) {
    const top1 = allTokens[i];
    for (let j = 0; j < allTokens.length; j++) {
        if (i === j)
            continue;
        const top2 = allTokens[j];
        if (top2.slot === top1.slot)
            continue; // no two tokens from same slot
        if (top2.isMid)
            continue; // mid only at rank-1
        add([toEntry(top1, true), toEntry(top2, false)]);
    }
}
// 3-token
for (let i = 0; i < allTokens.length; i++) {
    const top1 = allTokens[i];
    for (let j = 0; j < allTokens.length; j++) {
        if (i === j)
            continue;
        const top2 = allTokens[j];
        if (top2.slot === top1.slot)
            continue;
        if (top2.isMid)
            continue;
        for (let k = j + 1; k < allTokens.length; k++) {
            const top3 = allTokens[k];
            if (top3.slot === top1.slot || top3.slot === top2.slot)
                continue;
            if (top3.isMid)
                continue;
            add([toEntry(top1, true), toEntry(top2, false), toEntry(top3, false)]);
        }
    }
}
// ──────────────────────────────────────────────────────────────────────────────
// Write CSV
// ──────────────────────────────────────────────────────────────────────────────
function csvCell(s) {
    if (/[",\n]/.test(s))
        return `"${s.replace(/"/g, '""')}"`;
    return s;
}
const sorted = [...rows.values()].sort((a, b) => {
    if (a.tokenCount !== b.tokenCount)
        return a.tokenCount - b.tokenCount;
    return a.signature.localeCompare(b.signature);
});
const csv = ["token_count,source,compressed,signature,label,raw_lexicon,tokens"];
for (const r of sorted) {
    csv.push([
        String(r.tokenCount),
        csvCell(r.source),
        r.compressed ? "yes" : "no",
        csvCell(r.signature),
        csvCell(r.label),
        csvCell(r.raw_lexicon),
        csvCell(r.tokens),
    ].join(","));
}
mkdirSync("results/identity", { recursive: true });
const outPath = "results/identity/all-label-combinations.csv";
writeFileSync(outPath, csv.join("\n"), "utf8");
// ──────────────────────────────────────────────────────────────────────────────
// Summary
// ──────────────────────────────────────────────────────────────────────────────
const by1 = sorted.filter(r => r.tokenCount === 1).length;
const by2 = sorted.filter(r => r.tokenCount === 2).length;
const by3 = sorted.filter(r => r.tokenCount === 3).length;
const mergerFull = sorted.filter(r => r.source === "merger-full").length;
const mergerPartial = sorted.filter(r => r.source === "merger-partial").length;
const compression = sorted.filter(r => r.source === "compression").length;
const lexicon = sorted.filter(r => r.source === "lexicon").length;
const compressed = sorted.filter(r => r.compressed).length;
console.log(`\n=== Label enumeration ===`);
console.log(`1-token rows:     ${by1}`);
console.log(`2-token rows:     ${by2}`);
console.log(`3-token rows:     ${by3}`);
console.log(`Total unique:     ${sorted.length}`);
console.log(`  merger-full:    ${mergerFull}`);
console.log(`  merger-partial: ${mergerPartial}`);
console.log(`  compression:    ${compression} (${COMPRESSION_TABLE && Object.keys(COMPRESSION_TABLE).length} compression entries)`);
console.log(`  lexicon:        ${lexicon}`);
console.log(`  reorder-only:   ${compressed - compression} (POS-reorder changed string but no compression fired)`);
console.log(`Wrote ${outPath}`);
// Sample compression hits
const compressedRows = sorted.filter(r => r.compressed).slice(0, 12);
console.log(`\n=== Sample compression hits ===`);
for (const r of compressedRows) {
    console.log(`  [${r.signature}]`);
    console.log(`    raw lexicon → "${r.raw_lexicon}"`);
    console.log(`    compressed  → "${r.label}"`);
}
// Spot-check: top-10 merger-full rows
const mergerFullRows = sorted.filter(r => r.source === "merger-full").slice(0, 10);
console.log(`\n=== Sample merger-full hits ===`);
for (const r of mergerFullRows) {
    console.log(`  [${r.signature}] → ${r.label}`);
}
//# sourceMappingURL=enumerateLabels.js.map