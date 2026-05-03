/**
 * Smoke for the synthetic electorate contract.
 *
 * This does not generate a population. It verifies the target row schema that
 * future VEP-universe and imputation code must write.
 */

import { promises as fs } from "node:fs";
import * as path from "node:path";

import {
  CATEGORICAL_NODE_IDS,
  MORAL_BOUNDARY_IDS,
  POSITION_NODE_IDS,
  SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
  makeExampleSyntheticElectorateRow,
  validateSyntheticElectorateRow,
  type SyntheticElectorateManifest,
} from "./syntheticElectorateContract.js";

const OUT_DIR = path.join(process.cwd(), "results/electorate/synthetic-electorate");
const JSON_PATH = path.join(OUT_DIR, "synthetic-electorate-contract.json");
const MD_PATH = path.join(OUT_DIR, "synthetic-electorate-contract.md");

interface Check {
  name: string;
  pass: boolean;
  detail: string;
}

function check(name: string, pass: boolean, detail = ""): Check {
  return { name, pass, detail };
}

function renderMarkdown(checks: Check[], manifest: SyntheticElectorateManifest): string {
  const lines: string[] = [];
  lines.push("# Synthetic Electorate Contract");
  lines.push("");
  lines.push(`**Date:** 2026-05-03`);
  lines.push(`**Schema version:** ${SYNTHETIC_ELECTORATE_SCHEMA_VERSION}`);
  lines.push(`**Status:** Contract and invariant smoke only. No population rows generated yet.`);
  lines.push("");
  lines.push("## Goal");
  lines.push("");
  lines.push("The target artifact is a voting-eligible adult universe where every represented adult or weighted cell carries demographics, geography, and PRISM node-signature posteriors. Vote probabilities, abstention propensity, candidate distances, and counterfactual outputs are downstream projections of this file.");
  lines.push("");
  lines.push("## Physical Representations");
  lines.push("");
  lines.push("- **Weighted cell table:** the canonical first representation. One row represents many eligible adults in the same demographic/geographic/poststratification cell.");
  lines.push("- **Synthetic person table:** optional expansion where each row has `cellWeight = 1`. This is useful for simulation ergonomics but should be derived from weighted cells, not treated as more factual.");
  lines.push("- **Multiple draws:** the final system should write many plausible electorates, not one fake-exact electorate, because node signatures are estimated from survey evidence and imputation.");
  lines.push("");
  lines.push("## Required Row Fields");
  lines.push("");
  lines.push("- `year`, `drawId`, `rowKind`, `cellId`, `cellWeight`, `populationSource`, `signatureSource`");
  lines.push("- demographics: state, age/age bucket, race/ethnicity, sex, education, income bucket where available, eligibility flag");
  lines.push("- position nodes: " + POSITION_NODE_IDS.join(", "));
  lines.push("- categorical nodes: " + CATEGORICAL_NODE_IDS.join(", "));
  lines.push("- moral-boundary loadings: " + MORAL_BOUNDARY_IDS.join(", "));
  lines.push("- engagement: one-dimensional continuous scalar in [0, 10]");
  lines.push("- uncertainty and coverage counters");
  lines.push("");
  lines.push("## Invariants");
  lines.push("");
  for (const invariant of manifest.invariants) lines.push(`- ${invariant}`);
  lines.push("");
  lines.push("## Smoke Checks");
  lines.push("");
  lines.push("| # | Check | Pass | Detail |");
  lines.push("|---:|---|:--:|---|");
  checks.forEach((c, idx) => {
    lines.push(`| ${idx + 1} | ${c.name} | ${c.pass ? "yes" : "no"} | ${c.detail} |`);
  });
  lines.push("");
  lines.push("## Sequencing");
  lines.push("");
  lines.push("1. Survey mapper creates PRISM signatures for CES/CCES rows.");
  lines.push("2. VEP universe loader creates the eligible-adult population skeleton from ACS/IPUMS/PUMS.");
  lines.push("3. Imputation/poststratification maps survey signatures onto VEP cells.");
  lines.push("4. Counterfactual simulator reads the synthetic electorate rows and projects outcomes.");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  await fs.mkdir(OUT_DIR, { recursive: true });
  const row = makeExampleSyntheticElectorateRow();
  const validationErrors = validateSyntheticElectorateRow(row);

  const manifest: SyntheticElectorateManifest = {
    schemaVersion: SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
    created: "2026-05-03",
    years: [2008, 2012, 2016, 2020, 2024],
    rowKind: "weighted_cell",
    draws: 0,
    files: [],
    invariants: [
      "Every row represents a voting-eligible citizen adult or a weighted cell of such adults.",
      "Every row carries all position nodes, categorical nodes, moral-boundary loadings, and engagement.",
      "All posterior distributions are finite and normalized.",
      "Every node has provenance and uncertainty.",
      "Weights are finite and positive.",
      "Vote choice, abstention, candidate distance, and counterfactual outputs are downstream projections, not source fields in the signature contract.",
      "A synthetic-person table is an expansion of weighted cells, not a more exact source of truth.",
    ],
  };

  const checks = [
    check("example row validates", validationErrors.length === 0, validationErrors.join("; ")),
    check("all position nodes listed", POSITION_NODE_IDS.length === 9, POSITION_NODE_IDS.join(",")),
    check("all categorical nodes listed", CATEGORICAL_NODE_IDS.length === 2, CATEGORICAL_NODE_IDS.join(",")),
    check("all moral-boundary loadings listed", MORAL_BOUNDARY_IDS.length === 7, MORAL_BOUNDARY_IDS.join(",")),
    check("manifest covers five election years", manifest.years.length === 5, manifest.years.join(",")),
    check("contract keeps outcomes downstream", !JSON.stringify(row).includes("candidateDistance"), "no candidate-distance field on row"),
  ];

  const payload = {
    schema_version: SYNTHETIC_ELECTORATE_SCHEMA_VERSION,
    created: "2026-05-03",
    doc_type: "synthetic_electorate_contract",
    manifest,
    example_row: row,
    checks,
    overall_pass: checks.every((c) => c.pass),
  };

  await fs.writeFile(JSON_PATH, JSON.stringify(payload, null, 2) + "\n");
  await fs.writeFile(MD_PATH, renderMarkdown(checks, manifest));

  console.log(`Wrote ${JSON_PATH}`);
  console.log(`Wrote ${MD_PATH}`);
  console.log(`Overall: ${payload.overall_pass ? "PASS" : "FAIL"} (${checks.filter(c => c.pass).length}/${checks.length})`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
