// One-shot script: apply user-directed dysfunction demotions for "righteous
// revolution" cases (uprisings/independence/peaceful transitions where the
// dysfunction is bounded and legitimate-cause-driven, not chronic state
// failure). Updates both dysfunction-codes.json (with rationale annotation)
// and regimes.json (engine-facing).

const fs = require("node:fs");
const path = require("node:path");

const DEMOTIONS = [
  { country: "Ukraine", regime_name: "Maidan/War Democracy", start: 2014, to: 2,
    note: "Demoted 4→2 (2026-04-27): wartime democracy under existential threat is not chronic state dysfunction; Maidan was a legitimate popular revolution." },
  { country: "Portugal", regime_name: "Caetano/Revolution", start: 1969, to: 2,
    note: "Demoted 3→2 (2026-04-27): Carnation Revolution was a peaceful military-civilian uprising; bounded transitional period." },
  { country: "Romania", regime_name: "Iliescu Transition", start: 1990, to: 2,
    note: "Demoted 3→2 (2026-04-27): 1989 revolution against Ceaușescu was legitimate; mineriad violence bounded; state functional throughout." },
  { country: "South Korea", regime_name: "Transition", start: 1980, to: 2,
    note: "Demoted 3→2 (2026-04-27): June Democracy Movement 1987 was a successful legitimate democratization; bounded period." },
  { country: "Algeria", regime_name: "Post-Hirak Algeria", start: 2019, to: 2,
    note: "Demoted 3→2 (2026-04-27): Hirak was a peaceful popular uprising forcing Bouteflika out; subsequent state operates ordinarily." },
  { country: "Ireland", regime_name: "Revolution/Free State", start: 1916, to: 2,
    note: "Demoted 3→2 (2026-04-27): Easter Rising + War of Independence + Irish Free State; brief civil war 1922-23 bounded; legitimate self-determination." },
  { country: "Mexico", regime_name: "Late Colonial/Independence", start: 1789, to: 2,
    note: "Demoted 3→2 (2026-04-27): independence movements 1810-21 against Spain; bounded transitional disorder for legitimate self-determination." },
  { country: "Argentina", regime_name: "Independence/Rivadavia", start: 1810, to: 2,
    note: "Demoted 3→2 (2026-04-27): May Revolution and independence wars; bounded transitional disorder for legitimate self-determination." },
  { country: "Colombia", regime_name: "Gran Colombia/Independence", start: 1810, to: 2,
    note: "Demoted 3→2 (2026-04-27): Bolívar's independence movement; bounded transitional disorder for legitimate self-determination." },
  { country: "Chile", regime_name: "Independence/O'Higgins", start: 1810, to: 2,
    note: "Demoted 3→2 (2026-04-27): O'Higgins liberation from Spain; bounded transitional state-building for legitimate self-determination." },
  { country: "Venezuela", regime_name: "Independence/Gran Colombia", start: 1810, to: 2,
    note: "Demoted 3→2 (2026-04-27): Bolívar's independence movement; bounded transitional disorder for legitimate self-determination." },
];

const codesPath = path.resolve(__dirname, "../results/dysfunction-coding/dysfunction-codes.json");
const regimesPath = path.resolve(__dirname, "../output/live-data/regimes.json");

const codes = JSON.parse(fs.readFileSync(codesPath, "utf8"));
const regimes = JSON.parse(fs.readFileSync(regimesPath, "utf8"));

let codeMatched = 0, codeMissed = 0;
let regimeMatched = 0, regimeMissed = 0;

for (const d of DEMOTIONS) {
  const codeEntry = codes.find(c =>
    c.country === d.country && c.regime_name === d.regime_name && c.start === d.start
  );
  if (codeEntry) {
    const oldVal = codeEntry.dysfunction;
    codeEntry.dysfunction = d.to;
    codeEntry.rationale = `${codeEntry.rationale} [${d.note}]`;
    console.log(`codes:    ${d.country} / ${d.regime_name} (${d.start})  ${oldVal} → ${d.to}`);
    codeMatched++;
  } else {
    console.log(`codes:    NOT FOUND  ${d.country} / ${d.regime_name} (${d.start})`);
    codeMissed++;
  }

  const country = regimes[d.country];
  if (country?.eras) {
    const era = country.eras.find(e => e.regime_name === d.regime_name && e.start === d.start);
    if (era) {
      era.dysfunction = d.to;
      regimeMatched++;
    } else {
      console.log(`regimes:  NOT FOUND  ${d.country} / ${d.regime_name} (${d.start})`);
      regimeMissed++;
    }
  } else {
    console.log(`regimes:  COUNTRY NOT FOUND  ${d.country}`);
    regimeMissed++;
  }
}

fs.writeFileSync(codesPath, JSON.stringify(codes, null, 2), "utf8");
fs.writeFileSync(regimesPath, JSON.stringify(regimes), "utf8");

console.log(`\nApplied ${codeMatched}/${DEMOTIONS.length} to dysfunction-codes.json (missed: ${codeMissed})`);
console.log(`Applied ${regimeMatched}/${DEMOTIONS.length} to regimes.json (missed: ${regimeMissed})`);

// Print new distribution.
const dist = {1:0, 2:0, 3:0, 4:0, 5:0};
for (const c of codes) dist[c.dysfunction]++;
console.log("\nNew dysfunction distribution:");
for (const [s, n] of Object.entries(dist)) {
  console.log(`  ${s}: ${n} (${(n/codes.length*100).toFixed(1)}%)`);
}
