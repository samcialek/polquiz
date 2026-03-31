# TASK.md — Current Work

## Active Task
No active task.

## Task History

### 2026-03-26 — Verify 8 Salience Changes in Question Bank
- **Goal:** Implement 8 salience additions across questions.full.ts and questions.representative.ts
- **Scope:** `src/config/questions.full.ts`, `src/config/questions.representative.ts`
- **Constraints:** 124 archetypes, 14 nodes unchanged. Do NOT re-enable Q70.
- **Changes verified (all already present):**
  1. Q15: MAT salience 0.55 + ONT_S salience 0.50, touchType `derived_allocation_concentration`
  2. Q20: ZS salience 0.50 + ONT_S salience 0.55, touchType `derived_allocation_concentration`
  3. Q17: MAT salience 0.85, touchType `checkbox_salience`
  4. Q76: ONT_S salience 0.85, touchType `checkbox_salience`
  5. Q8: MOR salience 0.85, touchType `checkbox_salience`
  6. Q56: AES salience 0.85, touchType `checkbox_salience`
  7. Q61: AES salience 0.80, touchType `checkbox_salience`
  8. Q71: Re-enabled with AES salience 0.90 (Q70 remains disabled)
- **Status:** done — all 8 changes were already present in both files
