/**
 * Build & run the global regime alignment pipeline.
 *
 * Usage:
 *   node scripts/build-global.mjs          # esbuild → bundle → run
 *   npx tsx src/global/build-alignment.ts   # direct (dev, no bundle needed)
 */

import * as esbuild from "esbuild";
import { execSync } from "node:child_process";
import { mkdirSync } from "node:fs";

const OUT_DIR = "dist-global";

mkdirSync(OUT_DIR, { recursive: true });

// Bundle the build-alignment script into a single self-contained JS file
await esbuild.build({
  entryPoints: ["src/global/build-alignment.ts"],
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  outfile: `${OUT_DIR}/build-alignment.mjs`,
  banner: { js: "// Auto-generated — do not edit" },
});

console.log(`Bundled → ${OUT_DIR}/build-alignment.mjs`);

// Execute the bundled file
console.log("Running alignment computation...\n");
execSync(`node ${OUT_DIR}/build-alignment.mjs`, { stdio: "inherit" });
