// Broad diagnostic: verify the dysfunction multiplier holds up across
// diverse political-type profiles. For each archetype-like profile, report:
//   - Top-5 dampened alignment (where they SHOULD land after multiplier)
//   - Top-5 raw alignment (pre-multiplier — for comparison)
//   - Top-5 attenuated regimes (high raw, biggest dampening from dysfunction)
//   - A plausibility flag if the top dampened picks look implausible
//
// The 9 profiles span the political space deliberately, including some
// adversarial ones (illiberal authoritarian, accelerationist) to test
// whether the multiplier produces sensible behavior even for profiles
// whose ideology happens to align with chaotic regimes.

const fs = require("node:fs");
const path = require("node:path");

const regimes = JSON.parse(fs.readFileSync(
  path.resolve(__dirname, "../output/live-data/regimes.json"), "utf8"));

const NODES = ["MAT","CD","CU","MOR","PRO","COM","ZS","ONT_H","ONT_S"];
const SIGMA = 2.0;
const SAL_FLOOR = 0.5;

function dysfunctionFactor(d) {
  if (d == null || d <= 1) return 1.00;
  if (d <= 2) return 0.92;
  if (d <= 3) return 0.80;
  if (d <= 4) return 0.60;
  return 0.35;
}

function alignment(sig, eraNodes, dysfunction) {
  let sumSq = 0, totalW = 0;
  for (const n of NODES) {
    const e = sig[n];
    if (!e) continue;
    const sal = Math.max(e.sal ?? 0, SAL_FLOOR);
    const regimePos = eraNodes[n];
    if (regimePos == null) continue;
    const diff = Math.abs(e.pos - regimePos);
    sumSq += sal * diff * diff;
    totalW += sal;
  }
  const distance = totalW > 0 ? Math.sqrt(sumSq / totalW) : 4;
  const support = 100 * Math.exp(-Math.pow(distance / SIGMA, 2));
  const raw = (support / 50 - 1) * 3;
  const f = dysfunctionFactor(dysfunction);
  const dampened = raw * f;
  return {
    raw: +Math.max(-3, Math.min(3, raw)).toFixed(3),
    dampened: +Math.max(-3, Math.min(3, dampened)).toFixed(3),
    factor: f,
  };
}

function p(pos, sal) { return { pos, sal }; }

const PROFILES = {
  "Institutional Progressive (Sam)": {
    MAT:p(1.61,2.91), CD:p(2.30,1.67), CU:p(3.00,2.88), MOR:p(4.04,2.08),
    PRO:p(3.56,2.21), COM:p(3.44,1.92), ZS:p(1.94,1.62),
    ONT_H:p(4.00,1.58), ONT_S:p(4.18,2.95),
  },

  "Classical Liberal / Libertarian": {
    MAT:p(4.5,3), CD:p(3,1), CU:p(4,2), MOR:p(3,1),
    PRO:p(5,2), COM:p(4,1), ZS:p(2,2),
    ONT_H:p(3,1), ONT_S:p(2,2),  // small-state, not nihilist
  },

  "Religious Traditionalist": {
    MAT:p(4,1), CD:p(5,3), CU:p(2,3), MOR:p(2,2),
    PRO:p(4,2), COM:p(2,1), ZS:p(3,1),
    ONT_H:p(5,2), ONT_S:p(3,2),
  },

  "Class-War Leftist (Marxist)": {
    MAT:p(1,3), CD:p(2,1), CU:p(3,2), MOR:p(4,2),
    PRO:p(2,1), COM:p(1,2), ZS:p(5,3),
    ONT_H:p(4,2), ONT_S:p(2,2),  // believes capitalist institutions corrupt
  },

  "National-Populist / Strongman": {
    MAT:p(3,1), CD:p(5,2), CU:p(1,3), MOR:p(2,2),
    PRO:p(2,2), COM:p(1,2), ZS:p(5,3),
    ONT_H:p(2,2), ONT_S:p(3,2),
  },

  "Centrist Pragmatist": {
    MAT:p(3,2), CD:p(3,1), CU:p(3,1), MOR:p(3,1),
    PRO:p(4,2), COM:p(4,2), ZS:p(2,1),
    ONT_H:p(3,1), ONT_S:p(4,2),
  },

  "Cosmopolitan Internationalist": {
    MAT:p(2,2), CD:p(2,2), CU:p(5,3), MOR:p(5,3),
    PRO:p(4,2), COM:p(4,2), ZS:p(1,2),
    ONT_H:p(4,1), ONT_S:p(4,2),
  },

  "Anarcho-Capitalist (adversarial test)": {
    // Pure ideological libertarian who SHOULD ideologically match weak/failed
    // states. Tests whether the multiplier prevents them from "loving" failed
    // states they happen to ideologically fit.
    MAT:p(5,3), CD:p(3,1), CU:p(4,1), MOR:p(2,1),
    PRO:p(1,3), COM:p(1,2), ZS:p(2,1),
    ONT_H:p(2,2), ONT_S:p(1,3),  // institutional nihilist
  },

  "Authoritarian Communist (adversarial test)": {
    // Tests whether the multiplier prevents them from "loving" Cultural
    // Revolution / Khmer Rouge / Stalinism just because the ideology
    // ideologically fits.
    MAT:p(1,3), CD:p(1,2), CU:p(2,2), MOR:p(3,2),
    PRO:p(1,2), COM:p(1,3), ZS:p(5,3),
    ONT_H:p(5,3), ONT_S:p(5,3),  // believes state can do anything
  },
};

// Collect all era data once.
const allEras = [];
for (const [country, c] of Object.entries(regimes)) {
  for (const era of c.eras || []) {
    allEras.push({
      country,
      regime: era.regime_name,
      start: era.start,
      end: era.end,
      nodes: era.nodes || {},
      d: era.dysfunction ?? null,
    });
  }
}

console.log("# Dysfunction multiplier broad diagnostic\n");
console.log(`${Object.keys(PROFILES).length} respondent profiles × ${allEras.length} regime eras.\n`);

for (const [name, sig] of Object.entries(PROFILES)) {
  console.log(`\n## ${name}\n`);

  const scored = allEras.map(era => {
    const a = alignment(sig, era.nodes, era.d);
    return { ...era, raw: a.raw, dampened: a.dampened, factor: a.factor };
  });

  // Top 5 by dampened (where they end up after multiplier).
  const byDampened = [...scored].sort((a, b) => b.dampened - a.dampened);
  console.log("**Top 5 after dysfunction multiplier (where they actually align):**\n");
  console.log("| # | Country / Regime | Years | Dys | Raw | Dampened |");
  console.log("|---|---|---|---|---|---|");
  for (const x of byDampened.slice(0, 5)) {
    console.log(`| ${byDampened.indexOf(x)+1} | ${x.country} / ${x.regime} | ${x.start}-${x.end} | d${x.d} | ${x.raw.toFixed(2)} | ${x.dampened.toFixed(2)} |`);
  }

  // Top 5 by raw — for comparison.
  const byRaw = [...scored].sort((a, b) => b.raw - a.raw);
  console.log("\n**Top 5 by raw alignment (pre-multiplier — for comparison):**\n");
  console.log("| # | Country / Regime | Years | Dys | Raw | Dampened |");
  console.log("|---|---|---|---|---|---|");
  for (const x of byRaw.slice(0, 5)) {
    console.log(`| ${byRaw.indexOf(x)+1} | ${x.country} / ${x.regime} | ${x.start}-${x.end} | d${x.d} | ${x.raw.toFixed(2)} | ${x.dampened.toFixed(2)} |`);
  }

  // Top 5 attenuation effects (highest raws that got dampened most).
  const attenuated = scored
    .filter(x => x.raw > 1.0)
    .map(x => ({ ...x, delta: +(x.dampened - x.raw).toFixed(3) }))
    .sort((a, b) => a.delta - b.delta);
  console.log("\n**Top 5 dysfunction attenuations (regimes pulled down):**\n");
  console.log("| # | Country / Regime | Years | Dys | Raw → Dampened | Δ |");
  console.log("|---|---|---|---|---|---|");
  for (const x of attenuated.slice(0, 5)) {
    console.log(`| ${attenuated.indexOf(x)+1} | ${x.country} / ${x.regime} | ${x.start}-${x.end} | d${x.d} | ${x.raw.toFixed(2)} → ${x.dampened.toFixed(2)} | ${x.delta.toFixed(2)} |`);
  }

  // Plausibility flags.
  const top1 = byDampened[0];
  const top5dys = byDampened.slice(0, 5).map(x => x.d);
  const heavyDysfunctionInTop5 = top5dys.filter(d => d >= 4).length;
  if (heavyDysfunctionInTop5 > 0) {
    console.log(`\n⚠ Note: ${heavyDysfunctionInTop5} of top-5 dampened are still d4-5 — multiplier didn't fully suppress chaotic regimes for this profile.`);
  }
}

// Summary across all profiles.
console.log("\n---\n");
console.log("## Cross-profile summary\n");
console.log("Whether the multiplier suppresses chaotic regimes from top-5 across all profiles:\n");
console.log("| Profile | Top-1 Country / Regime | Top-1 Dys | Top-5 has d4+? |");
console.log("|---|---|---|---|");
for (const [name, sig] of Object.entries(PROFILES)) {
  const scored = allEras.map(era => {
    const a = alignment(sig, era.nodes, era.d);
    return { ...era, raw: a.raw, dampened: a.dampened };
  });
  const top5 = [...scored].sort((a, b) => b.dampened - a.dampened).slice(0, 5);
  const top1 = top5[0];
  const heavyDys = top5.filter(x => x.d >= 4).length;
  console.log(`| ${name} | ${top1.country} / ${top1.regime} (${top1.start}-${top1.end}) | d${top1.d} | ${heavyDys > 0 ? "**" + heavyDys + " of 5**" : "no"} |`);
}
