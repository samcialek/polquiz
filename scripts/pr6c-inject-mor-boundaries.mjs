// PR 6.C inject — reads the derived MOR_BOUNDARIES JSON and inserts a
// `morBoundaries` field on each archetype literal in src/config/archetypes.ts.
//
// Strategy: per-archetype regex match anchored on `id: "XXX"`, finds the
// closing `}` of the nodes block, replaces the `}\n  },` archetype-end
// pattern with `},\n    morBoundaries: {...}\n  },`.
//
// Additive: keeps all existing fields. Only adds the new morBoundaries
// field per ADR-006 PR 6.C.

import { readFileSync, writeFileSync } from "node:fs";

const SRC_PATH = "src/config/archetypes.ts";
const DERIVED_PATH = "results/calibration-exceptions/pr6c-mor-boundaries-derived.json";

const derived = JSON.parse(readFileSync(DERIVED_PATH, "utf8"));
let src = readFileSync(SRC_PATH, "utf8");

function formatMorBoundaries(d) {
  const b = d.boundaries;
  return `morBoundaries: { boundaries: { national: ${b.national}, ethnic_racial: ${b.ethnic_racial}, religious: ${b.religious}, class: ${b.class}, ideological: ${b.ideological}, gender: ${b.gender}, political_tribe: ${b.political_tribe} }, intensity: ${d.intensity} },`;
}

let injected = 0;
let missed = [];

for (const [id, d] of Object.entries(derived)) {
  const morLine = formatMorBoundaries(d);
  // Find this archetype's block: from `id: "XXX",` through the first
  // `\n    }\n  },` after it. Non-greedy match across nodes block.
  const pattern = new RegExp(
    `(\\bid:\\s*"${id}"[\\s\\S]+?\\r?\\n    })\\r?\\n  },`,
    "m"
  );
  const match = src.match(pattern);
  if (!match) {
    missed.push(id);
    continue;
  }
  // Replace `}\r?\n  },` with `},\r\n    morBoundaries: {...}\r\n  },`.
  // The captured group $1 already includes the nodes-closing `}` at indent 4.
  // Preserve CRLF line endings — file is CRLF on Windows.
  const replacement = `$1,\r\n    ${morLine}\r\n  },`;
  src = src.replace(pattern, replacement);
  injected++;
}

writeFileSync(SRC_PATH, src);

console.log(`Injected morBoundaries field on ${injected} archetypes.`);
if (missed.length > 0) {
  console.log(`MISSED ${missed.length} archetypes (no regex match):`, missed.slice(0, 20).join(", "));
}
