/**
 * Phase 2.7.8 — Survey-to-PRISM mapper source inventory.
 *
 * Read-only diagnostic. Scans the CCES/CES file headers per year and
 * cross-references them against a curated candidate-source dictionary
 * for each currently-blocked PRISM target. Produces a per-year, per-
 * target inventory of available columns + strength labels (strong /
 * proxy / weak / not_usable) + directionality notes — and a v0.1
 * implementation priority list of the 3-5 safest targets to map first.
 *
 * The mapper itself is NOT modified by this audit. Output is JSON + MD
 * to results/electorate/synthetic-electorate/.
 *
 * Strict scope:
 *   - Read-only — no IO except reading file headers.
 *   - No vote prediction, candidate distance, or scorer fields are
 *     emitted. The audit explicitly tags forbidden columns
 *     (presidential vote choice, House/Senate vote choice, candidate
 *     thermometers, validated-vote-turnout when used as a position
 *     input, pid7 for non-political_camp targets) so the next mapper
 *     pass can avoid them.
 */

import * as fs from "node:fs";
import * as path from "node:path";

// ─── Year config ────────────────────────────────────────────────────────────

interface YearTarget {
  year: 2008 | 2012 | 2016 | 2020 | 2024;
  filePath: string;
  delimiter: "\t" | ",";
}

const YEAR_TARGETS: YearTarget[] = [
  { year: 2008, filePath: "data/cces2008/cces_2008_common.tab",                            delimiter: "\t" },
  { year: 2012, filePath: "data/cces2012/CCES12_Common_VV.tab",                            delimiter: "\t" },
  { year: 2016, filePath: "data/cces2016/CCES16_Common_OUTPUT_Feb2018_VV.tab",             delimiter: "\t" },
  { year: 2020, filePath: "data/cces2020/CES20_Common_OUTPUT_vv.csv",                      delimiter: "," },
  { year: 2024, filePath: "data/cces2024/CCES24_Common_OUTPUT_vv_topost_final.csv",        delimiter: "," },
];

// ─── Currently blocked targets (per the Phase 2.7.7 coverage audit) ────────

/**
 * Targets that the v0 mapper currently fills with a uniform / fallback prior
 * for every modern-cycle row (per the Phase 2.7.7 audit). 2008 has more
 * blockers; those are noted in the inventory but the priority list focuses
 * on modern-cycle blockers since 2008's V### codebook is a separate
 * mapper-revision project.
 */
const BLOCKED_TARGETS = [
  "MAT", "CD", "CU", "MOR", "PRO", "COM", "ZS", "ONT_H", "ONT_S",
  "EPS", "AES",
  "moralBoundaries.national",
  "moralBoundaries.ethnic_racial",
  "moralBoundaries.gender",
] as const;

// ─── Candidate source dictionary ────────────────────────────────────────────

type Strength = "strong" | "proxy" | "weak" | "not_usable";

interface CandidateSpec {
  /**
   * Column name. May contain `{Y2}` which expands to the 2-digit year
   * suffix (e.g., `CC{Y2}_337_1` → `CC12_337_1`, `CC16_337_1`, etc.).
   */
  column: string;
  strength: Strength;
  /** Why this column maps to the target. */
  rationale: string;
  /**
   * Direction-of-effect to verify against the codebook before wiring.
   * Default convention: lower-value answer → lower PRISM position
   * unless noted.
   */
  directionality: string;
  /** Optional cycle filter; defaults to all 5 years where the pattern fits. */
  years?: number[];
}

const TARGET_CANDIDATES: Record<string, CandidateSpec[]> = {
  MAT: [
    { column: "economy_retro",    strength: "proxy", rationale: "Retrospective economic evaluation; correlates with material orientation but also tracks partisan thermometer", directionality: "Worse-economy answer roughly co-moves with redistributionist position; verify per cycle (sign can flip during incumbent-out years)." },
    { column: "faminc",           strength: "weak",  rationale: "Family income — weak correlate of material preferences",                                directionality: "Lower income → MAT 1-2 (redistributionist). Effect is small; not load-bearing alone." },
    { column: "faminc_new",       strength: "weak",  rationale: "Renamed family-income column in some 2020+ releases",                                  directionality: "Same as `faminc`." },
    { column: "investor",         strength: "proxy", rationale: "Stock ownership; correlates with free-market lean",                                    directionality: "Owns stocks → MAT 4-5 (free-market)." },
    { column: "no_healthins",     strength: "proxy", rationale: "Uninsured; correlates with healthcare-expansion preference",                           directionality: "Uninsured → MAT 1-2 (expand gov role)." },
    { column: "union",            strength: "proxy", rationale: "Union household; left-economic correlate (also feeds moralBoundaries.class)",          directionality: "Union member → MAT 1-2." },
    { column: "CC{Y2}_337_1",     strength: "strong", rationale: "Federal-spending battery item 1 (per A2 spec)",                                       directionality: "Support cuts → MAT 4-5." },
    { column: "CC{Y2}_337_2",     strength: "strong", rationale: "Federal-spending battery item 2",                                                     directionality: "Support cuts → MAT 4-5." },
    { column: "CC{Y2}_337_3",     strength: "strong", rationale: "Federal-spending battery item 3",                                                     directionality: "Support cuts → MAT 4-5." },
    { column: "CC{Y2}_337_4",     strength: "strong", rationale: "Federal-spending battery item 4",                                                     directionality: "Support cuts → MAT 4-5." },
    { column: "CC{Y2}_337_5",     strength: "strong", rationale: "Federal-spending battery item 5",                                                     directionality: "Support cuts → MAT 4-5." },
    { column: "CC{Y2}_415r",      strength: "strong", rationale: "Deficit-reduction means (cuts vs taxes vs both)",                                     directionality: "Prefer cuts → MAT 4-5; prefer taxes → MAT 1-2." },
    { column: "CC{Y2}_416r",      strength: "strong", rationale: "Tax-type preference",                                                                 directionality: "Verify codebook." },
    { column: "CC{Y2}_350a",      strength: "strong", rationale: "ACA-related issue item (year-specific position)",                                     directionality: "Repeal → MAT 4-5." },
    { column: "CC{Y2}_351I",      strength: "strong", rationale: "ACA repeal",                                                                          directionality: "Repeal → MAT 4-5." },
    { column: "CC{Y2}_351K",      strength: "strong", rationale: "Minimum wage increase",                                                               directionality: "Raise → MAT 1-2." },
  ],
  CD: [
    { column: "relig_imp",        strength: "weak",  rationale: "Religion importance; weak proxy (also feeds moralBoundaries.religious)",                directionality: "High imp → CD 4-5 (traditionalist)." },
    { column: "CC{Y2}_332a",      strength: "strong", rationale: "Abortion battery — always allow as matter of choice",                                  directionality: "Agree → CD 1-2 (progressive)." },
    { column: "CC{Y2}_332b",      strength: "strong", rationale: "Abortion battery — rape/incest exception",                                              directionality: "Agree → CD 1-2." },
    { column: "CC{Y2}_332c",      strength: "strong", rationale: "Abortion battery — health-of-mother",                                                   directionality: "Agree → CD 1-2." },
    { column: "CC{Y2}_332d",      strength: "strong", rationale: "Abortion battery — restrict after 20 weeks",                                            directionality: "Agree → CD 4-5 (traditionalist)." },
    { column: "CC{Y2}_332e",      strength: "strong", rationale: "Abortion battery — federal funding",                                                   directionality: "Allow funding → CD 1-2." },
    { column: "CC{Y2}_332f",      strength: "strong", rationale: "Abortion battery — total ban",                                                          directionality: "Agree → CD 4-5." },
    { column: "CC{Y2}_335",       strength: "strong", rationale: "Gay-marriage / same-sex-couple item",                                                   directionality: "Allow / support → CD 1-2." },
    { column: "CC{Y2}_322a",      strength: "proxy",  rationale: "LGBT-related items in 2018+ cycles",                                                    directionality: "Pro-rights → CD 1-2." },
    { column: "CC{Y2}_322b",      strength: "proxy",  rationale: "LGBT-related items in 2018+ cycles",                                                    directionality: "Pro-rights → CD 1-2." },
    { column: "CC{Y2}_322c",      strength: "proxy",  rationale: "LGBT-related items in 2018+ cycles",                                                    directionality: "Pro-rights → CD 1-2." },
  ],
  CU: [
    { column: "CC{Y2}_331_1",     strength: "strong", rationale: "Immigration battery item 1 (per A2 spec) — DACA / pathway",                            directionality: "Pluralist answer → CU 4-5; restrictionist → CU 1-2." },
    { column: "CC{Y2}_331_2",     strength: "strong", rationale: "Immigration battery item 2",                                                            directionality: "Same; verify codebook polarity." },
    { column: "CC{Y2}_331_3",     strength: "strong", rationale: "Immigration battery item 3",                                                            directionality: "Same." },
    { column: "CC{Y2}_331_4",     strength: "strong", rationale: "Immigration battery item 4",                                                            directionality: "Same." },
    { column: "CC{Y2}_331_5",     strength: "strong", rationale: "Immigration battery item 5",                                                            directionality: "Same." },
    { column: "CC{Y2}_331_6",     strength: "strong", rationale: "Immigration battery item 6",                                                            directionality: "Same." },
    { column: "CC{Y2}_331_7",     strength: "strong", rationale: "Immigration battery item 7",                                                            directionality: "Same." },
    { column: "CC{Y2}_331_8",     strength: "strong", rationale: "Immigration battery item 8 (varies; e.g., English official language)",                  directionality: "Same; one item may be `English-only` which inverts polarity." },
  ],
  MOR: [
    { column: "CC{Y2}_331_3",     strength: "proxy",  rationale: "Refugee item inside immigration battery (where present)",                              directionality: "Welcome refugees → MOR 4-5 (universal circle)." },
    { column: "CC{Y2}_331_5",     strength: "proxy",  rationale: "Muslim-related item in some cycles' immigration battery",                              directionality: "Anti-Muslim ban → MOR 4-5." },
    { column: "foreign_aid_*",    strength: "weak",   rationale: "Sporadic foreign-aid items",                                                            directionality: "Support aid → MOR 4-5." },
  ],
  PRO: [
    { column: "CC{Y2}_307",       strength: "weak",   rationale: "Approve/disapprove of how Congress is doing — institutional-trust proxy",              directionality: "Reject institutions → PRO 1-2." },
    { column: "CC{Y2}_322",       strength: "weak",   rationale: "Election-integrity items in 2020+",                                                    directionality: "Reject election legitimacy → PRO 1-2." },
    { column: "CC{Y2}_421",       strength: "weak",   rationale: "Voter-ID / ballot-access items",                                                        directionality: "Restrict → PRO 4-5 (rules-prefer)." },
    { column: "CC{Y2}_309a",      strength: "weak",   rationale: "Confidence-in-government items",                                                        directionality: "High confidence → PRO 4-5." },
  ],
  COM: [
    { column: "CC{Y2}_compromise", strength: "weak",  rationale: "Sporadic 'politicians should compromise' items in 2016/2020 (column name varies)",      directionality: "Pro-compromise → COM 4-5." },
    { column: "CC{Y2}_315",        strength: "weak",  rationale: "Where present, a fight-vs-compromise item",                                              directionality: "Pro-compromise → COM 4-5." },
  ],
  ZS: [
    { column: "economy_retro",    strength: "proxy",  rationale: "Pessimistic economic framing correlates with zero-sum lens (weak)",                    directionality: "Worse-economy → ZS 4-5 (zero-sum)." },
    { column: "CC{Y2}_330a",      strength: "weak",   rationale: "Trade items in some cycles ('other countries gain at our expense')",                   directionality: "Trade-zero-sum answer → ZS 4-5." },
    { column: "CC{Y2}_321",       strength: "weak",   rationale: "Immigration-takes-jobs framing where present",                                          directionality: "Takes-jobs → ZS 4-5." },
  ],
  ONT_H: [
    { column: "CC{Y2}_authoritarian_1", strength: "weak", rationale: "Feldman-Stenner child-rearing battery is rare in CCES; mostly ANES",                directionality: "Verify item exists; default ANES path." },
    { column: "CC{Y2}_authoritarian_2", strength: "weak", rationale: "Same",                                                                              directionality: "Same." },
    { column: "CC{Y2}_authoritarian_3", strength: "weak", rationale: "Same",                                                                              directionality: "Same." },
    { column: "CC{Y2}_authoritarian_4", strength: "weak", rationale: "Same",                                                                              directionality: "Same." },
    { column: "ONT_H_proxy_unavailable", strength: "not_usable", rationale: "CCES does not ship the Feldman-Stenner authoritarianism battery in standard form; mapping must wait for ANES integration", directionality: "n/a" },
  ],
  ONT_S: [
    { column: "pew_govrun",       strength: "proxy",  rationale: "'Government for the few or for all' — system-trust proxy",                              directionality: "For-all answer → ONT_S 4-5 (high systemic trust)." },
    { column: "CC{Y2}_309a",      strength: "weak",   rationale: "Trust-in-government items where present",                                                directionality: "Trust answer → ONT_S 4-5." },
    { column: "trust_*",          strength: "weak",   rationale: "Various 'trust in [institution]' items — sporadic",                                      directionality: "High trust → ONT_S 4-5." },
  ],
  EPS: [
    { column: "newsint",          strength: "weak",   rationale: "News-interest level — doesn't directly probe epistemic style but provides a weak engagement-adjacent prior", directionality: "n/a — fallback prior near-uniform is appropriate." },
    { column: "media_news_*",     strength: "weak",   rationale: "News-source items where present (which outlets respondent trusts) — partial signal",     directionality: "Source pattern → empiricist/intuitionist split; needs prototype calibration." },
    { column: "CC{Y2}_300_1",     strength: "weak",   rationale: "Where a 'science-of-X' or 'experts' item exists (rare in CCES standard)",                directionality: "Pro-science → empiricist." },
    { column: "EPS_proxy_unavailable", strength: "not_usable", rationale: "CCES does not directly probe epistemic-style category; surveys would need an EPS-prototype battery to discriminate cleanly", directionality: "n/a" },
  ],
  AES: [
    { column: "AES_proxy_unavailable", strength: "not_usable", rationale: "Surveys do not directly probe aesthetic-style category. Acknowledged in the spec as inherently fallback for the v0/v1 mapper — would need a deliberately-designed AES battery (statesman vs technocrat vs pastoral vs authentic vs fighter vs visionary cues) that does not currently exist in CCES.", directionality: "n/a" },
  ],
  "moralBoundaries.national": [
    { column: "CC{Y2}_331_1",     strength: "strong", rationale: "Immigration restrictiveness composite — direct national-boundary signal",                directionality: "Restrictive → high salience." },
    { column: "CC{Y2}_331_2",     strength: "strong", rationale: "Immigration restrictiveness composite",                                                  directionality: "Restrictive → high salience." },
    { column: "CC{Y2}_331_5",     strength: "strong", rationale: "Anti-Muslim-ban → low salience; pro-ban → high salience",                                directionality: "Restrictive → high salience." },
    { column: "CC{Y2}_331_8",     strength: "proxy",  rationale: "English-only-language item where present — national-identity signal",                    directionality: "English-only → high salience." },
    { column: "CC{Y2}_322_pride", strength: "proxy",  rationale: "American-pride / national-identity items where present",                                  directionality: "Strong-pride → high salience." },
  ],
  "moralBoundaries.ethnic_racial": [
    { column: "CC{Y2}_440a",      strength: "proxy",  rationale: "Race-policy / race-relations items in 2020+ cycles (BLM-era)",                            directionality: "Race-conscious → high salience." },
    { column: "CC{Y2}_440b",      strength: "proxy",  rationale: "Race-policy items",                                                                       directionality: "Same." },
    { column: "CC{Y2}_440c",      strength: "proxy",  rationale: "Race-policy items",                                                                       directionality: "Same." },
    { column: "CC{Y2}_aff_action", strength: "weak",  rationale: "Affirmative-action items where present (column name varies by cycle)",                    directionality: "Pro-AA → high salience for race-conscious respondents." },
  ],
  "moralBoundaries.gender": [
    { column: "CC{Y2}_335",       strength: "weak",   rationale: "Gay-marriage / same-sex item — gender-adjacent",                                          directionality: "Salience proxy via opinion intensity." },
    { column: "CC{Y2}_322a",      strength: "weak",   rationale: "LGBTQ items in 2018+",                                                                    directionality: "Same." },
    { column: "CC{Y2}_metoo",     strength: "weak",   rationale: "Sporadic Me Too / sexual-harassment items in 2018+ (column name varies)",                 directionality: "Engaged → high salience." },
    { column: "CC{Y2}_337_g",     strength: "weak",   rationale: "Equal-pay / women-in-workforce items where present",                                      directionality: "Engaged → high salience." },
  ],
};

// ─── Forbidden columns ─────────────────────────────────────────────────────

/**
 * Columns that must NOT enter any matching, sampling, scoring, or
 * position-mapping path. These are flagged so the next mapper pass
 * does not accidentally pull them in.
 *
 * NB: validated-vote-turnout columns (CL_E2016GVM, CL_2020gvm, vote_gen08)
 * ARE allowed inputs to the engagement scalar per the existing v0 mapper —
 * the rule is that they cannot inform any *position* node or moral-boundary
 * salience, since that would create vote-prediction circularity.
 */
const FORBIDDEN_PATTERNS: Array<{ pattern: string | RegExp; reason: string }> = [
  { pattern: /^CC\d{2}_410[a-z]?$/, reason: "Presidential vote choice (modern cycle convention CC{Y2}_410[a]) — would create vote-prediction circularity" },
  { pattern: "CC410", reason: "Presidential vote choice (2008 V###-era column)" },
  { pattern: "CC410a", reason: "Presidential vote choice (legacy column)" },
  { pattern: /^CC\d{2}_41[1-3][a-z]?$/, reason: "House / Senate vote choice (CC{Y2}_411 / 412 / 413) — same circularity" },
  { pattern: /^CC\d{2}_3(20|30)[a-z]?$/, reason: "Candidate feeling thermometer batteries (CC{Y2}_320*, CC{Y2}_330*) — vote-affect circularity for position nodes" },
  { pattern: "CC{Y2}_310",                  reason: "Candidate evaluations / approval — vote-affect adjacent" },
  { pattern: "intent_turnout_self",         reason: "Pre-election turnout intent — engagement-only input; forbidden as a position-node feature" },
  { pattern: "voted_turnout_self",          reason: "Self-reported turnout — engagement-only input; forbidden for position nodes" },
  { pattern: "CL_E2016GVM",                 reason: "Validated turnout — engagement-only input; forbidden for position nodes (would cross-contaminate vote-prediction backtest)" },
  { pattern: "CL_2020gvm",                  reason: "Validated turnout — engagement-only input; forbidden for position nodes" },
  { pattern: "vote_gen08",                  reason: "Validated turnout — engagement-only input; forbidden for position nodes" },
  { pattern: "pid7",                        reason: "Party ID 7-pt — allowed only as `partyIdDerived: true` input to `moralBoundaries.political_camp` salience per the mapper's design; FORBIDDEN as input to MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S core position nodes (would make vote-prediction circular)" },
  { pattern: "pid3",                        reason: "Party ID 3-pt — same restriction as pid7" },
];

// ─── v0.1 implementation priority list ──────────────────────────────────────

interface PrioritySpec {
  rank: number;
  target: string;
  reason: string;
  required_columns_template: string[];
  cycles_well_covered: number[];
  sequencing_note: string;
}

/**
 * The 5 safest targets to implement first, ordered by:
 * (a) strength of available signal in the modern CCES standard set,
 * (b) clarity of directionality (no per-cycle polarity flips),
 * (c) low risk of partisan-circularity (no pid7 / vote-affect items).
 *
 * Each priority lists the column templates the next mapper PR would
 * consume. Cycles_well_covered reports which years actually contain
 * those columns (cross-checked against the file headers below).
 */
const V0_1_PRIORITY_LIST: PrioritySpec[] = [
  {
    rank: 1,
    target: "CD",
    reason: "Abortion battery (CC{Y2}_332a-f) is well-covered in 2012/2016/2020/2024 with stable directionality across cycles. Direct issue-attitude alignment with PRISM cultural-direction. Low circularity risk.",
    required_columns_template: ["CC{Y2}_332a", "CC{Y2}_332b", "CC{Y2}_332c", "CC{Y2}_332d", "CC{Y2}_332e", "CC{Y2}_332f"],
    cycles_well_covered: [2012, 2016, 2020, 2024],
    sequencing_note: "Ship first because the abortion battery's polarity is the most stable across cycles. Will move CD off uniform-prior fallback to ~5-6 real-signal targets per row. Cross-cycle holdout possible (4 cycles × 6 items).",
  },
  {
    rank: 2,
    target: "CU",
    reason: "Immigration battery (CC{Y2}_331_1..8) is the next-most-covered standard battery. Direct issue-attitude alignment with cultural-uniformity. Mostly stable polarity (one English-only item may flip).",
    required_columns_template: ["CC{Y2}_331_1", "CC{Y2}_331_2", "CC{Y2}_331_3", "CC{Y2}_331_4", "CC{Y2}_331_5", "CC{Y2}_331_6", "CC{Y2}_331_7", "CC{Y2}_331_8"],
    cycles_well_covered: [2012, 2016, 2020, 2024],
    sequencing_note: "Ship together with target #4 (moralBoundaries.national) because both consume the same battery — saves one column-resolver pass.",
  },
  {
    rank: 3,
    target: "MAT",
    reason: "Federal-spending battery (CC{Y2}_337_*) + ACA item (CC{Y2}_351I) + minimum-wage item (CC{Y2}_351K) provide direct issue-attitude alignment with material orientation. Already-mapped weak proxies (faminc, union, investor, no_healthins) can be dropped to secondary support.",
    required_columns_template: ["CC{Y2}_337_1", "CC{Y2}_337_2", "CC{Y2}_337_3", "CC{Y2}_337_4", "CC{Y2}_337_5", "CC{Y2}_351I", "CC{Y2}_351K"],
    cycles_well_covered: [2016, 2020],
    sequencing_note: "Verify column presence per cycle — the spec lists 2016 as the canonical cycle; 2020 likely has a similar battery, 2012/2024 may use different stems. Expect partial coverage outside 2016/2020 and document the per-cycle gap.",
  },
  {
    rank: 4,
    target: "moralBoundaries.national",
    reason: "Same immigration battery as CU but used as a salience composite rather than a position decoder. Co-shipping with CU is efficient. The political_camp boundary is already the only `partyIdDerived: true` channel; this fills another always-fallback boundary slot.",
    required_columns_template: ["CC{Y2}_331_1", "CC{Y2}_331_2", "CC{Y2}_331_5", "CC{Y2}_331_8"],
    cycles_well_covered: [2012, 2016, 2020, 2024],
    sequencing_note: "Ship with #2. Salience composite = `count of restrictionist answers + intensity`. Document that respondents at extreme-pluralist (CU 4-5) also get high national-boundary salience — the boundary measures *engagement with* the dimension, not direction on it.",
  },
  {
    rank: 5,
    target: "ZS",
    reason: "Trade items (CC{Y2}_330a where present) + immigration-takes-jobs items provide a narrow but unambiguous zero-sum signal in 2016/2020. Lower priority because items are sparser; ship as a stretch goal alongside #1-#4.",
    required_columns_template: ["CC{Y2}_330a", "CC{Y2}_321"],
    cycles_well_covered: [2016, 2020],
    sequencing_note: "Optional in v0.1. If column presence checks fail in 2012/2024, document and skip those years rather than block the rollout.",
  },
];

// ─── File-header scanning ──────────────────────────────────────────────────

function readHeader(filePath: string, delimiter: "\t" | ","): string[] {
  // Read first ~128KB (more than enough for any header line).
  const fd = fs.openSync(filePath, "r");
  try {
    const buf = Buffer.alloc(131072);
    fs.readSync(fd, buf, 0, buf.length, 0);
    const text = buf.toString("utf8");
    const newline = text.indexOf("\n");
    const headerLine = newline >= 0 ? text.slice(0, newline) : text;
    return splitHeader(headerLine.replace(/\r$/, ""), delimiter);
  } finally {
    fs.closeSync(fd);
  }
}

function splitHeader(line: string, delimiter: "\t" | ","): string[] {
  if (delimiter === "\t") return line.split("\t");
  // CSV: handle quoted fields.
  const out: string[] = [];
  let buf = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i]!;
    if (inQuotes) {
      if (ch === '"') {
        if (line[i + 1] === '"') { buf += '"'; i++; } else { inQuotes = false; }
      } else { buf += ch; }
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { out.push(buf); buf = ""; }
      else buf += ch;
    }
  }
  out.push(buf);
  return out.map(s => s.trim());
}

function expandTemplate(template: string, year: number): string {
  const y2 = String(year).slice(-2);
  return template.replace(/\{Y2\}/g, y2);
}

// ─── Inventory build ───────────────────────────────────────────────────────

interface CandidateMatch {
  column: string;
  resolved_columns_per_year: Record<string, string | null>; // year → resolved name (null if absent)
  strength: Strength;
  rationale: string;
  directionality: string;
  cycles_with_match: number[];
}

function inventoryTarget(
  candidates: CandidateSpec[],
  yearHeaders: Map<number, Set<string>>,
): CandidateMatch[] {
  const out: CandidateMatch[] = [];
  for (const c of candidates) {
    const resolved: Record<string, string | null> = {};
    const cycles: number[] = [];
    for (const [year, header] of yearHeaders) {
      const expanded = expandTemplate(c.column, year);
      const found = header.has(expanded);
      resolved[String(year)] = found ? expanded : null;
      if (found) cycles.push(year);
    }
    out.push({
      column: c.column,
      resolved_columns_per_year: resolved,
      strength: c.strength,
      rationale: c.rationale,
      directionality: c.directionality,
      cycles_with_match: cycles.sort((a, b) => a - b),
    });
  }
  return out;
}

interface ForbiddenMatch {
  pattern: string;
  reason: string;
  matches_per_year: Record<string, string[]>; // year → matched column names in that header
}

function inventoryForbidden(yearHeaders: Map<number, Set<string>>): ForbiddenMatch[] {
  const out: ForbiddenMatch[] = [];
  for (const f of FORBIDDEN_PATTERNS) {
    const patternStr = f.pattern instanceof RegExp ? f.pattern.toString() : String(f.pattern);
    const matches: Record<string, string[]> = {};
    for (const [year, header] of yearHeaders) {
      const found: string[] = [];
      if (f.pattern instanceof RegExp) {
        for (const col of header) if (f.pattern.test(col)) found.push(col);
      } else {
        const expanded = expandTemplate(String(f.pattern), year);
        if (header.has(expanded)) found.push(expanded);
      }
      matches[String(year)] = found.sort();
    }
    out.push({ pattern: patternStr, reason: f.reason, matches_per_year: matches });
  }
  return out;
}

// ─── Main ──────────────────────────────────────────────────────────────────

interface YearHeaderSummary {
  year: number;
  file: string;
  delimiter: "\t" | ",";
  file_present: boolean;
  column_count: number;
  cc_year_columns_count: number;
  pew_columns_count: number;
  cl_columns_count: number;
}

function summarizeHeader(year: number, file: string, delimiter: "\t" | ",", file_present: boolean, columns: string[]): YearHeaderSummary {
  const y2 = String(year).slice(-2);
  return {
    year, file, delimiter, file_present,
    column_count: columns.length,
    cc_year_columns_count: columns.filter(c => c.startsWith(`CC${y2}_`) || c.startsWith(`CC${y2}`)).length,
    pew_columns_count: columns.filter(c => c.startsWith("pew_")).length,
    cl_columns_count: columns.filter(c => c.startsWith("CL_") || c.startsWith("CL")).length,
  };
}

async function main(): Promise<void> {
  const cwd = process.cwd();
  const outDir = path.join(cwd, "results", "electorate", "synthetic-electorate");
  fs.mkdirSync(outDir, { recursive: true });

  const yearHeaders = new Map<number, Set<string>>();
  const headerSummaries: YearHeaderSummary[] = [];

  for (const target of YEAR_TARGETS) {
    const filePath = path.join(cwd, target.filePath);
    console.log(`\n=== ${target.year} (${target.filePath}) ===`);
    if (!fs.existsSync(filePath)) {
      console.log(`  ✗ file not present — skipping`);
      headerSummaries.push(summarizeHeader(target.year, target.filePath, target.delimiter, false, []));
      continue;
    }
    const cols = readHeader(filePath, target.delimiter);
    yearHeaders.set(target.year, new Set(cols));
    headerSummaries.push(summarizeHeader(target.year, target.filePath, target.delimiter, true, cols));
    console.log(`  columns=${cols.length} (CC${String(target.year).slice(-2)}_*=${cols.filter(c => c.startsWith(`CC${String(target.year).slice(-2)}`)).length} pew_*=${cols.filter(c => c.startsWith("pew_")).length} CL_*=${cols.filter(c => c.startsWith("CL")).length})`);
  }

  // Per-target inventory
  const perTarget: Array<{
    target: string;
    blocked: boolean;
    candidates: CandidateMatch[];
  }> = [];
  for (const target of BLOCKED_TARGETS) {
    const candidates = TARGET_CANDIDATES[target] ?? [];
    perTarget.push({
      target,
      blocked: true,
      candidates: inventoryTarget(candidates, yearHeaders),
    });
  }
  // Forbidden inventory
  const forbidden = inventoryForbidden(yearHeaders);

  // Cross-check the priority list against actual presence
  const priorityWithPresence = V0_1_PRIORITY_LIST.map(p => {
    const presence: Record<string, Record<string, boolean>> = {};
    for (const tmpl of p.required_columns_template) {
      presence[tmpl] = {};
      for (const [year, header] of yearHeaders) {
        presence[tmpl][String(year)] = header.has(expandTemplate(tmpl, year));
      }
    }
    const cyclesActuallyCovered = Array.from(yearHeaders.keys()).filter(y => {
      const headerSet = yearHeaders.get(y)!;
      return p.required_columns_template.every(t => headerSet.has(expandTemplate(t, y)));
    }).sort((a, b) => a - b);
    return {
      ...p,
      column_presence_by_year: presence,
      cycles_actually_fully_covered: cyclesActuallyCovered,
      cycles_partially_covered: Array.from(yearHeaders.keys()).filter(y => {
        const headerSet = yearHeaders.get(y)!;
        const matches = p.required_columns_template.filter(t => headerSet.has(expandTemplate(t, y)));
        return matches.length > 0 && matches.length < p.required_columns_template.length;
      }).sort((a, b) => a - b),
    };
  });

  const jsonOut = {
    schema_version: "v0.1",
    run_at: new Date().toISOString(),
    phase: "2.7.8 — survey-to-PRISM mapper source inventory (read-only)",
    description: "Per-year column-header scan cross-referenced against curated candidate-source dictionary for currently-blocked PRISM targets. Identifies strong / proxy / weak / not_usable column candidates per target × year. Tags forbidden columns. Produces a v0.1 implementation priority list of the 3-5 safest targets to map first. The mapper is NOT modified by this audit.",
    blocked_targets: BLOCKED_TARGETS,
    year_headers: headerSummaries,
    per_target_inventory: perTarget,
    forbidden_columns: forbidden,
    v0_1_implementation_priority_list: priorityWithPresence,
    notes: {
      year_2008_caveat: "2008 uses opaque V### column naming (legacy YouGov scheme). The candidate dictionary's `CC{Y2}_*` patterns therefore expand to `CC08_*` which are absent. 2008 needs a separate per-year resolver pass driven by `data/cces2008/codebook-extracted.txt` to surface candidate columns.",
      AES_acknowledged_fallback: "moralBoundaries-adjacent / AES is documented in the survey-to-prism-v0 spec as inherently fallback (surveys do not directly probe aesthetic preference). v0.1 priority correctly omits AES.",
      EPS_partial_signal: "EPS would benefit from a deliberately-designed prototype battery; standard CCES news-source items provide only weak proxy signal.",
      ONT_H_anes_path: "ONT_H requires the Feldman-Stenner authoritarianism child-rearing battery, which CCES does not ship in standard form. Mapping requires ANES integration (out of v0.1 scope).",
    },
  };
  const jsonPath = path.join(outDir, "survey-mapper-source-inventory.json");
  fs.writeFileSync(jsonPath, JSON.stringify(jsonOut, null, 2));

  // ── Markdown summary
  let md = `# Survey-to-PRISM Mapper Source Inventory (Phase 2.7.8)\n\n`;
  md += `**Run at:** ${new Date().toISOString()}\n`;
  md += `**Status:** Read-only diagnostic. **The mapper is NOT modified by this inventory.**\n\n`;
  md += `## What this answers\n\n`;
  md += `Cross-references actual column-header lists from each year's CCES/CES file against a curated candidate-source dictionary for the targets currently blocked by the v0 mapper (per Phase 2.7.7's coverage audit). Per blocked target: which columns are present in which years, with strength labels (strong / proxy / weak / not_usable), why each maps, and what directionality must be verified before wiring. Plus a v0.1 implementation priority list of the 3-5 safest targets to map first.\n\n`;
  md += `**Forbidden columns** (presidential / House / Senate vote choice, candidate thermometers, validated-vote-turnout for position-node inputs, pid7 / pid3 for non-political_camp targets) are inventoried separately so the next mapper PR knows what NOT to pull in.\n\n`;
  md += `**Not in scope**: actual mapper changes, vote prediction, candidate distance, abstention calibration, scorer wiring.\n\n`;

  md += `## Year header scan\n\n`;
  md += `| Year | File | Columns | CC{Y2}_* count | pew_* count | CL_* count | File present |\n`;
  md += `|---|---|---:|---:|---:|---:|:--:|\n`;
  for (const h of headerSummaries) {
    md += `| ${h.year} | \`${h.file}\` | ${h.column_count} | ${h.cc_year_columns_count} | ${h.pew_columns_count} | ${h.cl_columns_count} | ${h.file_present ? "✓" : "✗"} |\n`;
  }
  md += `\n`;

  md += `## Per-target inventory\n\n`;
  for (const t of perTarget) {
    md += `### ${t.target} (currently blocked)\n\n`;
    if (t.candidates.length === 0) {
      md += `_No candidates curated yet for this target._\n\n`;
      continue;
    }
    md += `| Candidate column | Strength | Years present | Rationale | Directionality |\n`;
    md += `|---|---|---|---|---|\n`;
    for (const c of t.candidates) {
      md += `| \`${c.column}\` | ${c.strength} | ${c.cycles_with_match.length > 0 ? c.cycles_with_match.join(", ") : "(none)"} | ${c.rationale} | ${c.directionality} |\n`;
    }
    md += `\n`;
  }

  md += `## Forbidden columns (must NOT enter matching, sampling, scoring, or position-mapping)\n\n`;
  md += `| Pattern | Reason | Matches per year |\n`;
  md += `|---|---|---|\n`;
  for (const f of forbidden) {
    const perYear = Object.entries(f.matches_per_year)
      .filter(([, m]) => m.length > 0)
      .map(([year, m]) => `${year}: ${m.length === 1 ? `\`${m[0]}\`` : `[${m.slice(0, 3).map(c => "`" + c + "`").join(", ")}${m.length > 3 ? `, … +${m.length - 3} more` : ""}]`}`)
      .join("; ");
    md += `| \`${f.pattern}\` | ${f.reason} | ${perYear || "_no matches in scanned headers_"} |\n`;
  }
  md += `\n`;

  md += `## v0.1 implementation priority list (3-5 safest targets to map first)\n\n`;
  for (const p of priorityWithPresence) {
    md += `### #${p.rank} — \`${p.target}\`\n\n`;
    md += `- **Why first**: ${p.reason}\n`;
    md += `- **Required column templates**: ${p.required_columns_template.map(c => "`" + c + "`").join(", ")}\n`;
    md += `- **Cycles fully covered**: ${p.cycles_actually_fully_covered.length > 0 ? p.cycles_actually_fully_covered.join(", ") : "_(none — verify column presence per cycle before wiring)_"}\n`;
    if (p.cycles_partially_covered.length > 0) {
      md += `- **Cycles partially covered**: ${p.cycles_partially_covered.join(", ")} _(some required columns present, some absent — document the per-cycle gap before merging)_\n`;
    }
    md += `- **Sequencing**: ${p.sequencing_note}\n\n`;
    md += `**Per-template column presence** (column template → year → present?):\n\n`;
    md += `| Template | ${headerSummaries.filter(h => h.file_present).map(h => h.year).join(" | ")} |\n`;
    md += `|---|${headerSummaries.filter(h => h.file_present).map(() => ":--:").join("|")}|\n`;
    for (const tmpl of p.required_columns_template) {
      const cells = headerSummaries.filter(h => h.file_present).map(h => p.column_presence_by_year[tmpl]?.[String(h.year)] ? "✓" : "✗").join(" | ");
      md += `| \`${tmpl}\` | ${cells} |\n`;
    }
    md += `\n`;
  }

  md += `## Caveats\n\n`;
  md += `- **2008**: ${jsonOut.notes.year_2008_caveat}\n`;
  md += `- **AES**: ${jsonOut.notes.AES_acknowledged_fallback}\n`;
  md += `- **EPS**: ${jsonOut.notes.EPS_partial_signal}\n`;
  md += `- **ONT_H**: ${jsonOut.notes.ONT_H_anes_path}\n\n`;

  md += `## Cross-reference\n\n`;
  md += `- The mapper itself: \`src/electorate/surveyToPrismMapper.ts\` (do not edit from this inventory).\n`;
  md += `- Coverage audit (the source of the "blocked targets" list): \`results/electorate/synthetic-electorate/survey-to-prism-mapper-coverage-audit.{md,json}\`.\n`;
  md += `- Mapping spec: \`results/electorate/mapping/survey-to-prism-v0.md\` — the candidate dictionary in this audit is anchored to the spec's per-target rationales.\n`;

  fs.writeFileSync(path.join(outDir, "survey-mapper-source-inventory.md"), md);

  try { JSON.parse(fs.readFileSync(jsonPath, "utf8")); console.log("\nJSON valid"); }
  catch (e) { console.error("JSON did not parse:", e); process.exit(3); }

  console.log(`\nWrote ${jsonPath}`);
  console.log(`Wrote ${path.join(outDir, "survey-mapper-source-inventory.md")}`);
  // Brief summary line
  const candidateMatchCounts = perTarget.map(t => ({
    target: t.target,
    matches: t.candidates.reduce((acc, c) => acc + c.cycles_with_match.length, 0),
  }));
  console.log(`\nPer-target candidate-cycle match counts:`);
  for (const c of candidateMatchCounts) console.log(`  ${c.target}: ${c.matches}`);
  const totalForbidden = forbidden.reduce((acc, f) => acc + Object.values(f.matches_per_year).reduce((a, m) => a + m.length, 0), 0);
  console.log(`\nTotal forbidden-column matches across all years: ${totalForbidden}`);
}

main().catch(err => { console.error(err); process.exit(1); });
