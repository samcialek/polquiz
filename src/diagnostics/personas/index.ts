// Persona registry — single source of truth for the harness battery.
// Add new personas here as they're written; the harness iterates this list.

import type { Persona } from "../answerEngine.js";

import { abstainToTrumpPersona } from "./abstain-to-trump.js";
import { obamaToTrumpPersona } from "./obama-to-trump.js";
import { trumpMobilizedRepublicanPersona } from "./trump-mobilized-republican.js";
import { urbanProgressiveDemocratPersona } from "./urban-progressive-democrat.js";
import { blackModerateDemocratPersona } from "./black-moderate-democrat.js";
import { magaAllInPersona } from "./maga-all-in.js";

export const ALL_PERSONAS: Persona[] = [
  abstainToTrumpPersona,
  obamaToTrumpPersona,
  trumpMobilizedRepublicanPersona,
  urbanProgressiveDemocratPersona,
  blackModerateDemocratPersona,
  magaAllInPersona,
];

export function getPersonaById(id: string): Persona | undefined {
  return ALL_PERSONAS.find(p => p.id === id);
}
