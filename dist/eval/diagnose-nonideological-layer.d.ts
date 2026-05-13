/**
 * Non-ideological modifier layer regression.
 *
 * Runs the 121 archetypes × 60 elections grid four times:
 *   - OFF (baseline — ideological distance only)
 *   - ECON_ONLY (economic component only)
 *   - INCUMB_ONLY (incumbency component only)
 *   - CHARISMA_ONLY (charisma component only)
 *   - ON (all three, weighted and capped per spec)
 *
 * Metrics:
 *   - Top-1 party accuracy (nearest-candidate's party == historical winner)
 *   - Flip count OFF → ON (per-row and per-year)
 *   - Per-component isolation
 *   - 11-sanity-case pass rate (including the 001/Mondale-1984 check)
 *   - Distance distribution
 *
 * Hard stop: if top-1 drops ≥2pp OFF→ON we flag the regression.
 * Red flag: if charisma-alone accuracy > econ-alone accuracy.
 *
 *   npx tsx src/eval/diagnose-nonideological-layer.ts
 */
export {};
