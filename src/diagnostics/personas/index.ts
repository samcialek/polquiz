// Persona registry — single source of truth for the harness battery.
// Add new personas here as they're written; the harness iterates this list.

import type { Persona } from "../answerEngine.js";

import { abstainToTrumpPersona } from "./abstain-to-trump.js";
import { obamaToTrumpPersona } from "./obama-to-trump.js";
import { trumpMobilizedRepublicanPersona } from "./trump-mobilized-republican.js";
import { urbanProgressiveDemocratPersona } from "./urban-progressive-democrat.js";
import { blackModerateDemocratPersona } from "./black-moderate-democrat.js";
import { magaAllInPersona } from "./maga-all-in.js";
import { hispanicDToTrumpPersona } from "./hispanic-d-to-trump.js";
import { neverTrumpRepublicanPersona } from "./never-trump-republican.js";
import { bernieProgressivePersona } from "./bernie-progressive.js";
import { christianRightTraditionalistPersona } from "./christian-right-traditionalist.js";

export const ALL_PERSONAS: Persona[] = [
  abstainToTrumpPersona,
  obamaToTrumpPersona,
  trumpMobilizedRepublicanPersona,
  urbanProgressiveDemocratPersona,
  blackModerateDemocratPersona,
  magaAllInPersona,
  hispanicDToTrumpPersona,
  neverTrumpRepublicanPersona,
  bernieProgressivePersona,
  christianRightTraditionalistPersona,
];

export function getPersonaById(id: string): Persona | undefined {
  return ALL_PERSONAS.find(p => p.id === id);
}
