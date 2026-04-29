/**
 * Evaluate candidate PRO direct probes for authoritarian-vs-libertarian
 * discrimination. Per Sam's PR 3 correction: rule-bender authoritarianism
 * (fascist) is not the same as generic anti-proceduralism (libertarian).
 * The right PRO probe should pull PRO toward 1 (rule-bender) when the user
 * answers in an authoritarian-exception-making mode.
 *
 * For each candidate Q, prints:
 *   - Each option's PRO position likelihood mean (lower = closer to PRO=1)
 *   - Each option's MOR/CU/etc. side-effects (signals authoritarian flavor)
 *
 * The probe with the cleanest "authoritarian option pulls PRO low without
 * strong libertarian-coded side effects" wins.
 */
import { REPRESENTATIVE_QUESTIONS } from '../src/config/questions.representative.js';

const CANDIDATES = [85, 25, 30, 41, 207];

function meanPos(dist: number[] | undefined): number {
  if (!dist) return NaN;
  const sum = dist.reduce((s, p) => s + p, 0) || 1;
  return dist.reduce((s, p, i) => s + (p / sum) * (i + 1), 0);
}

function topNodes(catDist: number[] | undefined, names: string[]): string {
  if (!catDist) return '';
  const ranked = catDist.map((p, i) => [p, names[i]] as const).sort((a, b) => b[0] - a[0]);
  return ranked.slice(0, 2).map(([p, n]) => `${n}=${(p * 100).toFixed(0)}%`).join(' ');
}

const EPS_NAMES = ['empiricist', 'institutionalist', 'traditionalist', 'intuitionist', 'autonomous', 'nihilist'];
const AES_NAMES = ['statesman', 'technocrat', 'pastoral', 'plainspoken', 'fighter', 'visionary'];

for (const qid of CANDIDATES) {
  const q = REPRESENTATIVE_QUESTIONS.find(x => x.id === qid);
  if (!q) { console.log(`Q${qid} not found`); continue; }
  console.log('═'.repeat(80));
  console.log(`Q${qid}  ${q.promptShort}  (${q.uiType}, ${q.stage}, quality ${q.quality})`);
  if ((q as any).promptFull) console.log('  prompt: ' + (q as any).promptFull);
  console.log('  touchProfile:');
  for (const t of q.touchProfile) {
    console.log(`    ${t.node}:${t.role}=${t.weight.toFixed(2)} (${t.touchType})`);
  }
  if (!q.optionEvidence) { console.log('  (no optionEvidence)'); continue; }
  console.log('  options:');
  for (const [optKey, ev] of Object.entries(q.optionEvidence)) {
    console.log('    ' + optKey + ':');
    if (ev.continuous) {
      for (const [nid, upd] of Object.entries(ev.continuous)) {
        if (upd?.pos) {
          const m = meanPos(upd.pos);
          const dir = m < 2.5 ? 'low' : m > 3.5 ? 'high' : 'mid';
          console.log(`      ${nid} pos mean=${m.toFixed(2)} (${dir}) raw=[${upd.pos.map(p=>p.toFixed(2)).join(',')}]`);
        }
        if (upd?.sal) {
          console.log(`      ${nid} sal=[${upd.sal.map(p=>p.toFixed(2)).join(',')}]`);
        }
      }
    }
    if (ev.categorical) {
      for (const [nid, upd] of Object.entries(ev.categorical)) {
        if (upd?.cat) {
          const names = nid === 'EPS' ? EPS_NAMES : AES_NAMES;
          console.log(`      ${nid} cat: ${topNodes(upd.cat, names)}`);
        }
      }
    }
  }
  console.log();
}

// Synthetic max-fascist persona — for predicting answers
const FASCIST_PERSONA = {
  MAT: 3.5,   // mixed-economy / national-mobilization (fascist tolerates state economic intervention)
  CD: 5.0,    // max traditionalist
  CU: 1.0,    // max assimilationist
  MOR: 1.0,   // max parochial
  PRO: 1.0,   // max rule-bender (intended)
  COM: 1.0,   // max uncompromising
  ZS: 5.0,    // max zero-sum
  ONT_H: 1.0, // max human-nature-fixed
  ONT_S: 4.0, // institutionalist (fascist builds strong state)
  PF: 5.0,    // max fully-fused
  TRB: 5.0,   // max strong-tribal
  ENG: 5.0,   // max high-engaged
  EPS: 'traditionalist' as string,
  AES: 'fighter' as string,
};

console.log('═'.repeat(80));
console.log('SYNTHETIC FASCIST PERSONA — predicted PRO pulls per candidate Q');
console.log('═'.repeat(80));

function pickFascistOption(q: any): string {
  // Score each option by alignment with fascist persona positions.
  const opts = Object.keys(q.optionEvidence);
  let best = opts[0]!;
  let bestScore = -Infinity;
  for (const o of opts) {
    let score = 0;
    const ev = q.optionEvidence[o];
    if (ev.continuous) {
      for (const [nid, upd] of Object.entries(ev.continuous)) {
        const target = (FASCIST_PERSONA as any)[nid];
        if (typeof target !== 'number') continue;
        const u = upd as any;
        if (u?.pos) {
          // Alignment = mass at the target position
          const idx = Math.min(4, Math.max(0, Math.round(target) - 1));
          score += u.pos[idx] ?? 0;
        }
      }
    }
    if (score > bestScore) { bestScore = score; best = o; }
  }
  return best;
}

for (const qid of CANDIDATES) {
  const q = REPRESENTATIVE_QUESTIONS.find(x => x.id === qid);
  if (!q) continue;
  const pick = pickFascistOption(q);
  const ev = q.optionEvidence?.[pick];
  const proPull = ev?.continuous?.PRO?.pos ? meanPos(ev.continuous.PRO.pos) : NaN;
  const morPull = ev?.continuous?.MOR?.pos ? meanPos(ev.continuous.MOR.pos) : NaN;
  const cuPull = ev?.continuous?.CU?.pos ? meanPos(ev.continuous.CU.pos) : NaN;
  const ontsPull = ev?.continuous?.ONT_S?.pos ? meanPos(ev.continuous.ONT_S.pos) : NaN;
  console.log(`Q${qid}: fascist would pick "${pick}"`);
  console.log(`   → PRO pull mean = ${isNaN(proPull) ? 'n/a' : proPull.toFixed(2)} ${proPull < 2.5 ? '✓ rule-bender' : proPull > 3.5 ? '✗ rule-of-law' : '⚠ mid'}`);
  if (!isNaN(morPull)) console.log(`   side: MOR pull = ${morPull.toFixed(2)}`);
  if (!isNaN(cuPull)) console.log(`   side: CU pull = ${cuPull.toFixed(2)}`);
  if (!isNaN(ontsPull)) console.log(`   side: ONT_S pull = ${ontsPull.toFixed(2)}`);
  console.log();
}
