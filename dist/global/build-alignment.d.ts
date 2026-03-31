/**
 * Global Regime Alignment Builder
 *
 * Computes alignment scores for all 130 archetypes against all ~370
 * historical regime periods across 47 jurisdictions (1789-2026).
 *
 * Formula (adapted from regime-alignment.ts):
 *   distance  = sqrt( Σ(sal_i × (archPos_i - regimePos_i)²) / Σ(sal_i) )
 *   support   = 100 × exp(-(distance / σ)²)
 *   alignment = (support / 50 - 1) × 3          // Maps to -3 … +3
 *
 * Outputs:
 *   global/regime-profiles.csv   — flat list of all regime periods with node values
 *   global/regime-alignment.csv  — archetype × regime alignment scores
 */
export {};
