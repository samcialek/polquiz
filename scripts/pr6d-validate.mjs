import { ELECTIONS } from "../dist/historical/candidates.js";
import { EUROPE_PART1 } from "../dist/global/jurisdictions-europe1.js";
import { EUROPE_PART2 } from "../dist/global/jurisdictions-europe2.js";
import { AMERICAS } from "../dist/global/jurisdictions-americas.js";
import { ASIA } from "../dist/global/jurisdictions-asia.js";
import { MENA_AFRICA } from "../dist/global/jurisdictions-mena.js";

let candTotal = 0, candWith = 0, candBad = [], membPresent = 0;
for (const e of ELECTIONS) {
  for (const cand of e.candidates) {
    candTotal++;
    if (!cand.morBoundaries) { candBad.push(`${cand.name}|${cand.year}: missing`); continue; }
    candWith++;
    const b = cand.morBoundaries.boundaries;
    for (const k of Object.keys(b)) {
      if (b[k] < 0 || b[k] > 1) candBad.push(`${cand.name}|${cand.year}:${k}=${b[k]}`);
    }
    const i = cand.morBoundaries.intensity;
    if (i < 0 || i > 3) candBad.push(`${cand.name}|${cand.year}:intensity=${i}`);
    if (cand.morMembership) membPresent++;
  }
}
console.log(`candidates: ${candWith}/${candTotal} with morBoundaries; bad: ${candBad.length}`);
if (candBad.length) console.log("  bad:", candBad.slice(0, 5).join(", "));
console.log(`candidate membership: ${membPresent}/${candTotal} have morMembership`);

const allRegimes = [...EUROPE_PART1, ...EUROPE_PART2, ...AMERICAS, ...ASIA, ...MENA_AFRICA];
let regTotal = 0, regWith = 0, regBad = [], regWithMembership = 0;
for (const r of allRegimes) {
  regTotal++;
  if (!r.morBoundaries) { regBad.push(`${r.jurisdiction}|${r.regime}|${r.startYear}: missing`); continue; }
  regWith++;
  const b = r.morBoundaries.boundaries;
  for (const k of Object.keys(b)) {
    if (b[k] < 0 || b[k] > 1) regBad.push(`${r.jurisdiction}:${k}=${b[k]}`);
  }
  const i = r.morBoundaries.intensity;
  if (i < 0 || i > 3) regBad.push(`${r.jurisdiction}:intensity=${i}`);
  if (r.morMembership) regWithMembership++; // should be 0
}
console.log(`regimes: ${regWith}/${regTotal} with morBoundaries; bad: ${regBad.length}`);
if (regBad.length) console.log("  bad:", regBad.slice(0, 5).join(", "));
console.log(`regimes with membership: ${regWithMembership} (should be 0 — regimes do not get membership per ADR-006)`);
