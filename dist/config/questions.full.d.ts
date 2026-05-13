/**
 * QUESTIONS.FULL — METADATA-ONLY CATALOG (NOT A CANONICAL EVIDENCE SOURCE)
 *
 * The `q()` factory below does not accept rankingMap, optionEvidence,
 * sliderMap, allocationMap, pairMaps, or bestWorstMap — so every question
 * here is a touchProfile-only stub describing what the question is *meant*
 * to measure, not how it actually scores. The engine never updates state
 * from this bank.
 *
 * Used only by `src/diagnostics/questionInfo.ts` to enumerate what's in the
 * design at a high level. The live quiz, all simulations, and all evidence
 * scoring read from `src/config/questions.representative.ts`.
 *
 * If you need to wire evidence (rankingMap, moralCircle, trbAnchor, etc.)
 * for a question, edit questions.representative.ts. Editing this file does
 * NOT affect engine behavior in any code path.
 *
 * Q60 specifically: the full-bank entry below is a `ranking` stub. The
 * actual wired Q60 is a `priority_sort` with full trbAnchor + moralCircle
 * evidence in questions.representative.ts (lines ~327-360 as of 2026-05-09).
 */
import type { QuestionDef } from "../types.js";
export declare const FULL_QUESTIONS: QuestionDef[];
export declare const FULL_QUESTIONS_BY_ID: Record<number, QuestionDef>;
