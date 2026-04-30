// PR 6.D injector — reads pr6d derivations and inserts morBoundaries +
// (for candidates only) morMembership fields into the source TypeScript
// files. Strictly additive — keeps all existing fields.
//
// Files modified:
//   - src/historical/candidates.ts
//   - src/historical/elections-1789-1852.ts
//   - src/historical/elections-1856-1888.ts
//   - src/historical/elections-1892-1916.ts
//   - src/historical/elections-1920-1936.ts
//   - src/global/jurisdictions-europe1.ts
//   - src/global/jurisdictions-europe2.ts
//   - src/global/jurisdictions-americas.ts
//   - src/global/jurisdictions-asia.ts
//   - src/global/jurisdictions-mena.ts

import { readFileSync, writeFileSync } from "node:fs";

const DERIVED_PATH = "results/calibration-exceptions/pr6d-mor-boundaries-derived.json";
const derived = JSON.parse(readFileSync(DERIVED_PATH, "utf8"));

const CANDIDATE_FILES = [
  "src/historical/candidates.ts",
  "src/historical/elections-1789-1852.ts",
  "src/historical/elections-1856-1888.ts",
  "src/historical/elections-1892-1916.ts",
  "src/historical/elections-1920-1936.ts",
];

const REGIME_FILES = [
  "src/global/jurisdictions-europe1.ts",
  "src/global/jurisdictions-europe2.ts",
  "src/global/jurisdictions-americas.ts",
  "src/global/jurisdictions-asia.ts",
  "src/global/jurisdictions-mena.ts",
];

// ── Candidate-side formatting ─────────────────────────────────────────────

function formatCandidateFields(entry) {
  const b = entry.boundaries;
  const m = entry.membership;
  const morLine = `morBoundaries: { boundaries: { national: ${b.national}, ethnic_racial: ${b.ethnic_racial}, religious: ${b.religious}, class: ${b.class}, ideological: ${b.ideological}, gender: ${b.gender}, political_tribe: ${b.political_tribe} }, intensity: ${entry.intensity} },`;
  if (!m) {
    return morLine;
  }
  const memParts = [];
  for (const k of ["ethnic_racial","religious","class","gender","political_tribe"]) {
    const v = m[k];
    if (v === null || v === undefined) memParts.push(`${k}: null`);
    else memParts.push(`${k}: ${JSON.stringify(v)}`);
  }
  const memLine = `morMembership: { ${memParts.join(", ")} },`;
  return `${morLine}\n      ${memLine}`;
}

function injectIntoCandidateFile(path) {
  let src = readFileSync(path, "utf8");
  let injected = 0;
  const missed = [];

  for (const [key, entry] of Object.entries(derived.candidates)) {
    const [name, yearStr] = key.split("|");
    const year = parseInt(yearStr);
    // Match: name: "X", followed by party line, followed by year: Y, then everything
    // up through the closing },. Capture the closing brace position so we
    // can inject right before it.
    // Use literal-quoted name to avoid regex metachar issues (names like "T. Roosevelt").
    const nameEsc = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Allow inline comments / trailing whitespace between `AES: N,` and the
    // closing `\n    },` — candidates.ts uses `AES: 0,   // Statesman ...`
    // form; elections-*.ts files don't.
    //
    // NOTE: between anchor segments we use a negative-lookahead to prevent
    // the non-greedy match from spanning across candidate-block boundaries
    // (`\n    },`). Without this, when a candidate name appears in multiple
    // years, the regex anchors on the FIRST occurrence and the captured
    // group spans across intervening entries.
    const SEP = `(?:(?!\\r?\\n    },)[\\s\\S])+?`;
    const pattern = new RegExp(
      `(\\bname:\\s*"${nameEsc}",${SEP}\\byear:\\s*${year},${SEP}\\bAES:\\s*\\d+,?[^\\n]*)\\r?\\n    },`,
      "m"
    );
    const match = src.match(pattern);
    if (!match) continue; // not in this file
    // Idempotence: skip if this candidate already has morBoundaries injected
    // (captured group already contains it).
    if (match[1].includes("morBoundaries:")) continue;

    const fields = formatCandidateFields(entry);
    // Use replacer function so we can:
    //   1. Strip any trailing CR from `captured` — `[^\n]*` matches CR as a
    //      non-newline char on CRLF lines; if we don't strip, our `,\r\n`
    //      concat produces `editor\r,\r\n...` which TS treats as a stray
    //      comma on its own line.
    //   2. Add a trailing comma to $1 only if it doesn't already end with one.
    src = src.replace(pattern, (full, captured) => {
      const cleanCaptured = captured.replace(/\r+$/, "");
      const trimmed = cleanCaptured.replace(/\s+$/, "");
      const needsComma = !trimmed.endsWith(",");
      return `${cleanCaptured}${needsComma ? "," : ""}\r\n      ${fields}\r\n    },`;
    });
    injected++;
  }

  writeFileSync(path, src);
  return { path, injected };
}

// ── Regime-side formatting ────────────────────────────────────────────────

function formatRegimeFields(entry) {
  const b = entry.boundaries;
  return `morBoundaries: { boundaries: { national: ${b.national}, ethnic_racial: ${b.ethnic_racial}, religious: ${b.religious}, class: ${b.class}, ideological: ${b.ideological}, gender: ${b.gender}, political_tribe: ${b.political_tribe} }, intensity: ${entry.intensity} },`;
}

function injectIntoRegimeFile(path) {
  let src = readFileSync(path, "utf8");
  let injected = 0;

  for (const [key, entry] of Object.entries(derived.regimes)) {
    const [jurisdiction, regime, startYearStr] = key.split("|");
    const startYear = parseInt(startYearStr);
    const jurEsc = jurisdiction.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regEsc = regime.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // Match the regime entry block from `jurisdiction: "X",` through the
    // closing `\n  },` of the object literal. Anchor on the unique
    // (jurisdiction, regime, startYear) tuple.
    //
    // NOTE: between anchor segments we use a negative-lookahead to prevent
    // the non-greedy match from spanning across regime-block boundaries
    // (`\n  },`). Without this, when a jurisdiction string appears in
    // multiple regime entries, the regex anchors on the FIRST occurrence
    // and the captured group spans across intervening entries.
    const SEP = `(?:(?!\\r?\\n  },)[\\s\\S])+?`;
    const pattern = new RegExp(
      `(\\bjurisdiction:\\s*"${jurEsc}",${SEP}\\bregime:\\s*"${regEsc}",${SEP}\\bstartYear:\\s*${startYear},${SEP})\\r?\\n  },`,
      "m"
    );
    const match = src.match(pattern);
    if (!match) continue;
    // Idempotence: skip if this regime already has morBoundaries injected.
    if (match[1].includes("morBoundaries:")) continue;

    const fields = formatRegimeFields(entry);
    // Same CRLF + comma handling as the candidate side. See note there.
    src = src.replace(pattern, (full, captured) => {
      const cleanCaptured = captured.replace(/\r+$/, "");
      const trimmed = cleanCaptured.replace(/\s+$/, "");
      const needsComma = !trimmed.endsWith(",");
      return `${cleanCaptured}${needsComma ? "," : ""}\r\n    ${fields}\r\n  },`;
    });
    injected++;
  }

  writeFileSync(path, src);
  return { path, injected };
}

// ── Run ───────────────────────────────────────────────────────────────────

console.log("=== Candidate injection ===");
let totalCand = 0;
for (const f of CANDIDATE_FILES) {
  const result = injectIntoCandidateFile(f);
  console.log(`  ${result.path}: ${result.injected} injected`);
  totalCand += result.injected;
}
console.log(`Total candidates injected: ${totalCand} / ${Object.keys(derived.candidates).length}`);

console.log("\n=== Regime injection ===");
let totalReg = 0;
for (const f of REGIME_FILES) {
  const result = injectIntoRegimeFile(f);
  console.log(`  ${result.path}: ${result.injected} injected`);
  totalReg += result.injected;
}
console.log(`Total regimes injected: ${totalReg} / ${Object.keys(derived.regimes).length}`);
