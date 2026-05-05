/**
 * Train the demographic turnout model from CCES 2008 and dump a quick
 * summary. Writes data/turnout-model/turnout-lookup-2008.json.
 *
 * Usage: npx tsx src/electorate/turnoutModelTrainSmoke.ts
 */

import { loadSurveyRespondents } from "./cesBacktestLoader.js";
import { trainTurnoutModel, predictTurnoutProbability } from "./turnoutModel.js";

async function main() {
  const t0 = Date.now();
  const { respondents } = await loadSurveyRespondents({
    filePath: "data/cces2008/cces_2008_common.tab",
    year: 2008,
    keepRawVarPayload: false,
  });
  console.log(`Loaded ${respondents.length} CCES 2008 respondents in ${((Date.now() - t0)/1000).toFixed(1)}s`);

  const lookup = trainTurnoutModel(respondents, 2008);
  console.log(`Trained: validated subset n=${lookup.trained_from.n_respondents}, overall turnout rate=${(lookup.trained_from.weighted_turnout_rate*100).toFixed(1)}%`);
  console.log(`Joint cells (>=30 wt-N): ${Object.values(lookup.joint).filter(c => c.weighted_n >= 30).length}/${Object.keys(lookup.joint).length}`);

  // Sanity prediction examples
  const examples: Array<{ desc: string; demo: any }> = [
    { desc: "young Hispanic HS-or-less", demo: { birthyr: 1995, educ: "2", race: "3" } },
    { desc: "65+ White college",        demo: { birthyr: 1955, educ: "5", race: "1" } },
    { desc: "30-44 Black post-grad",    demo: { birthyr: 1985, educ: "6", race: "2" } },
    { desc: "Asian 18-29 some-college", demo: { birthyr: 2002, educ: "3", race: "4" } },
    { desc: "unknown all",              demo: {} },
  ];
  console.log("\nExample predictions (year 2020):");
  for (const ex of examples) {
    const p = predictTurnoutProbability(ex.demo, 2020, lookup);
    console.log(`  ${ex.desc.padEnd(35)} → p_turnout=${(p.probability*100).toFixed(1)}%  cell=${p.cell.padEnd(34)}  tier=${p.tier}`);
  }

  console.log("\nDone.");
}

main().catch(err => { console.error(err); process.exit(1); });
