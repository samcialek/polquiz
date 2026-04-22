/**
 * Build script: bundles the PRISM engine for browser deployment.
 *
 * Outputs:
 *   dist/prism-engine-bundle.js      — readable IIFE
 *   dist/prism-engine-bundle.min.js  — minified IIFE
 *
 * Both expose window.PrismEngine with the full API.
 */

import * as esbuild from "esbuild";
import { readFileSync } from "fs";

const ENTRY = "src/browser/index.ts";
const OUTFILE = "dist/prism-engine-bundle.js";
const OUTFILE_MIN = "dist/prism-engine-bundle.min.js";

/** Shared esbuild options */
const shared = {
  entryPoints: [ENTRY],
  bundle: true,
  format: "iife",
  globalName: "PrismEngine",
  target: "es2020",
  platform: "browser",
  // Tree-shake unused exports from config files
  treeShaking: true,
  // Replace Node.js process.env references for browser compatibility
  define: {
    "process.env.PRISM_NONIDEO": '"1"',
  },
};

async function build() {
  console.log("Building PRISM engine browser bundle...\n");

  // Readable build
  const readable = await esbuild.build({
    ...shared,
    outfile: OUTFILE,
    minify: false,
    sourcemap: true,
  });
  const readableSize = readFileSync(OUTFILE).length;
  console.log(`  ${OUTFILE}  ${(readableSize / 1024).toFixed(1)} KB`);

  // Minified build
  const minified = await esbuild.build({
    ...shared,
    outfile: OUTFILE_MIN,
    minify: true,
    sourcemap: false,
  });
  const minSize = readFileSync(OUTFILE_MIN).length;
  console.log(`  ${OUTFILE_MIN}  ${(minSize / 1024).toFixed(1)} KB`);

  console.log("\nDone.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
