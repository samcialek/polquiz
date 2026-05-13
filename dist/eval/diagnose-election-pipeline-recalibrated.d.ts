/**
 * Recalibrated diagnostic pass for the respondent-signature election
 * prediction pipeline. Identical setup to diagnose-election-pipeline.ts,
 * but (a) runs under the new CLEARING_BAR values in
 * respondentVoteChoice.ts and (b) explicitly compares old vs new turnout
 * buckets side-by-side, so the calibration change is auditable.
 *
 *   npx tsx src/eval/diagnose-election-pipeline-recalibrated.ts
 */
export {};
