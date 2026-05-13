/**
 * Comprehensive question signal audit.
 *
 * For every question in the representative bank:
 *   1. Cross-check touchProfile declarations against actual evidence maps.
 *      Flag:
 *        - "declared-unused": touchProfile says node is touched but no evidence
 *          map emits anything for it.
 *        - "unused-declared": evidence present but not declared in touchProfile.
 *   2. Compute signal strength per (question × node × role):
 *        - POSITION strength = KL divergence of best option's likelihood
 *          distribution from uniform [0.2,0.2,0.2,0.2,0.2]. 0 = flat (no info).
 *        - SALIENCE strength = KL divergence of best option's sal-likelihood
 *          from uniform [0.25, 0.25, 0.25, 0.25].
 *        - RANGE = difference between max and min E[pos] across options on the
 *          same node (tells us how discriminating the question is).
 *   3. Per-node coverage report:
 *        - Count questions carrying POSITION evidence vs SALIENCE evidence
 *        - Flag nodes with <5 position-emitting questions or <5 salience
 *          emitting questions
 *   4. Per-question "missing salience" report — single_choice and similar
 *      questions that touch a node for position but don't carry salience
 *      evidence on the same node (common pattern — every question ASKING
 *      about a node is implicit salience evidence).
 */
import { REPRESENTATIVE_QUESTIONS } from "../config/questions.representative.js";
import { CONTINUOUS_NODES, CATEGORICAL_NODES, isSelfNode } from "../config/nodes.js";
function klFromUniform5(dist) {
    if (!dist || dist.length !== 5)
        return 0;
    const s = dist.reduce((a, b) => a + b, 0);
    if (s <= 0)
        return 0;
    let kl = 0;
    for (let i = 0; i < 5; i++) {
        const p = dist[i] / s;
        const q = 1 / 5;
        if (p > 0)
            kl += p * Math.log(p / q);
    }
    return kl;
}
function klFromUniform4(dist) {
    if (!dist || dist.length !== 4)
        return 0;
    const s = dist.reduce((a, b) => a + b, 0);
    if (s <= 0)
        return 0;
    let kl = 0;
    for (let i = 0; i < 4; i++) {
        const p = dist[i] / s;
        const q = 1 / 4;
        if (p > 0)
            kl += p * Math.log(p / q);
    }
    return kl;
}
function klFromUniform6(dist) {
    if (!dist || dist.length !== 6)
        return 0;
    const s = dist.reduce((a, b) => a + b, 0);
    if (s <= 0)
        return 0;
    let kl = 0;
    for (let i = 0; i < 6; i++) {
        const p = dist[i] / s;
        const q = 1 / 6;
        if (p > 0)
            kl += p * Math.log(p / q);
    }
    return kl;
}
function ePos(dist) {
    if (!dist || dist.length !== 5)
        return null;
    const s = dist.reduce((a, b) => a + b, 0);
    if (s <= 0)
        return null;
    let e = 0;
    for (let i = 0; i < 5; i++)
        e += (i + 1) * (dist[i] / s);
    return e;
}
function eSal(dist) {
    if (!dist || dist.length !== 4)
        return null;
    const s = dist.reduce((a, b) => a + b, 0);
    if (s <= 0)
        return null;
    let e = 0;
    for (let i = 0; i < 4; i++)
        e += i * (dist[i] / s);
    return e;
}
// Gather evidence for one (question, node) pair
function gatherEvidence(q, nodeId) {
    const out = [];
    const qd = q;
    // optionEvidence
    const oe = qd.optionEvidence;
    if (oe) {
        for (const [key, ev] of Object.entries(oe)) {
            const c = ev.continuous?.[nodeId];
            const cat = ev.categorical?.[nodeId];
            if (!c && !cat)
                continue;
            const posKL = klFromUniform5(c?.pos);
            const salKL = klFromUniform4(c?.sal ?? cat?.sal);
            const catKL = klFromUniform6(cat?.cat ?? cat?.probs);
            out.push({
                optionKey: key, posE: ePos(c?.pos), salE: eSal(c?.sal ?? cat?.sal),
                posKL, salKL, catKL,
                hasPos: !!c?.pos, hasSal: !!(c?.sal ?? cat?.sal), hasCat: !!(cat?.cat ?? cat?.probs)
            });
        }
    }
    // sliderMap
    const sm = qd.sliderMap;
    if (sm) {
        for (const [key, ev] of Object.entries(sm)) {
            const c = ev.continuous?.[nodeId];
            if (!c)
                continue;
            out.push({
                optionKey: `slider:${key}`, posE: ePos(c.pos), salE: eSal(c.sal),
                posKL: klFromUniform5(c.pos), salKL: klFromUniform4(c.sal), catKL: 0,
                hasPos: !!c.pos, hasSal: !!c.sal, hasCat: false,
            });
        }
    }
    // rankingMap (two formats: scalar or likelihood)
    const rm = qd.rankingMap;
    if (rm) {
        for (const [key, ev] of Object.entries(rm)) {
            const val = ev.continuous?.[nodeId];
            if (val == null)
                continue;
            if (typeof val === "number") {
                out.push({
                    optionKey: `rank:${key}`, posE: 3 + val * 2, salE: null,
                    posKL: 0.5, salKL: 0, catKL: 0, // scalar→synthetic likelihood; approx KL
                    hasPos: true, hasSal: false, hasCat: false,
                });
            }
            else {
                out.push({
                    optionKey: `rank:${key}`, posE: ePos(val.pos), salE: eSal(val.sal),
                    posKL: klFromUniform5(val.pos), salKL: klFromUniform4(val.sal), catKL: 0,
                    hasPos: !!val.pos, hasSal: !!val.sal, hasCat: false,
                });
            }
        }
    }
    // allocationMap (scalar)
    const am = qd.allocationMap;
    if (am) {
        for (const [key, ev] of Object.entries(am)) {
            const val = ev.continuous?.[nodeId];
            if (val == null)
                continue;
            out.push({
                optionKey: `alloc:${key}`, posE: 3 + val * 2, salE: null,
                posKL: Math.abs(val) * 0.5, salKL: 0, catKL: 0,
                hasPos: true, hasSal: false, hasCat: false,
            });
        }
    }
    return out;
}
// Check touchProfile against actual evidence
const declaredNodes = new Map();
for (const q of REPRESENTATIVE_QUESTIONS) {
    const pos = new Set();
    const sal = new Set();
    for (const t of q.touchProfile) {
        if (t.role === "position" || t.role === "category")
            pos.add(t.node);
        if (t.role === "salience")
            sal.add(t.node);
    }
    declaredNodes.set(q.id, { pos, sal });
}
// Catalogue actual evidence per (qid, nodeId)
const evidencePerQ = new Map();
for (const q of REPRESENTATIVE_QUESTIONS) {
    const byNode = new Map();
    for (const nodeId of [...CONTINUOUS_NODES, ...CATEGORICAL_NODES]) {
        const ev = gatherEvidence(q, nodeId);
        if (ev.length > 0)
            byNode.set(nodeId, ev);
    }
    evidencePerQ.set(q.id, byNode);
}
// ── REPORT 1: touchProfile/evidence mismatches ────────────────────────────
console.log("=".repeat(80));
console.log("REPORT 1: touchProfile vs actual evidence emissions");
console.log("=".repeat(80));
const mismatches = [];
for (const q of REPRESENTATIVE_QUESTIONS) {
    const declared = declaredNodes.get(q.id);
    const evBy = evidencePerQ.get(q.id);
    // Declared as position but no pos evidence
    for (const n of declared.pos) {
        const ev = evBy.get(n);
        const hasPos = ev?.some((e) => e.hasPos || e.hasCat) ?? false;
        if (!hasPos) {
            mismatches.push({ qid: q.id, type: "declared-no-pos-evidence", node: n,
                detail: `touchProfile declares ${n} pos but no pos/cat likelihoods emitted` });
        }
    }
    // Declared as salience but no sal evidence
    for (const n of declared.sal) {
        const ev = evBy.get(n);
        const hasSal = ev?.some((e) => e.hasSal) ?? false;
        // priority_sort aggregates salience via buckets (not evidence maps) — skip
        if (q.uiType === "priority_sort" || q.uiType === "dual_axis")
            continue;
        if (!hasSal) {
            mismatches.push({ qid: q.id, type: "declared-no-sal-evidence", node: n,
                detail: `touchProfile declares ${n} sal but no sal likelihoods emitted` });
        }
    }
    // Evidence emitted but not declared
    for (const [n] of evBy) {
        if (!declared.pos.has(n) && !declared.sal.has(n)) {
            mismatches.push({ qid: q.id, type: "undeclared-evidence", node: n,
                detail: `${n} evidence emitted but not in touchProfile` });
        }
    }
}
if (mismatches.length === 0) {
    console.log("  (none — touchProfile and evidence are aligned)");
}
else {
    for (const m of mismatches) {
        console.log(`  Q${m.qid.toString().padEnd(4)} [${m.type.padEnd(28)}] ${m.node.padEnd(8)}  ${m.detail}`);
    }
}
// ── REPORT 2: signal strength per question ───────────────────────────────
console.log("\n" + "=".repeat(80));
console.log("REPORT 2: per-question signal strength (KL divergence from uniform)");
console.log("=".repeat(80));
console.log("  posKL: average KL per option on position  (higher = sharper signal)");
console.log("  posRange: max(E[pos]) - min(E[pos]) across options (higher = more discrimination)");
console.log("  salKL: average KL per option on salience");
console.log();
const qStats = [];
for (const q of REPRESENTATIVE_QUESTIONS) {
    const evBy = evidencePerQ.get(q.id);
    let totalPosKL = 0, nPosEv = 0;
    let totalSalKL = 0, nSalEv = 0;
    let maxRange = 0;
    let weakestPos = Infinity;
    let weakestSal = Infinity;
    const nodes = [];
    for (const [nid, evs] of evBy) {
        nodes.push(nid);
        const posEvs = evs.filter((e) => e.hasPos || e.hasCat);
        const salEvs = evs.filter((e) => e.hasSal);
        if (posEvs.length > 0) {
            const avgKL = posEvs.reduce((a, e) => a + (e.posKL || e.catKL), 0) / posEvs.length;
            totalPosKL += avgKL;
            nPosEv++;
            weakestPos = Math.min(weakestPos, avgKL);
            const posEs = posEvs.map((e) => e.posE).filter((x) => x != null);
            if (posEs.length > 1) {
                const range = Math.max(...posEs) - Math.min(...posEs);
                maxRange = Math.max(maxRange, range);
            }
        }
        if (salEvs.length > 0) {
            const avgKL = salEvs.reduce((a, e) => a + e.salKL, 0) / salEvs.length;
            totalSalKL += avgKL;
            nSalEv++;
            weakestSal = Math.min(weakestSal, avgKL);
        }
    }
    qStats.push({
        qid: q.id,
        promptShort: q.promptShort,
        uiType: q.uiType,
        avgPosKL: nPosEv > 0 ? totalPosKL / nPosEv : 0,
        maxPosRange: maxRange,
        avgSalKL: nSalEv > 0 ? totalSalKL / nSalEv : 0,
        nodesTouched: nodes,
        weakestPosKL: weakestPos === Infinity ? 0 : weakestPos,
        weakestSalKL: weakestSal === Infinity ? 0 : weakestSal,
    });
}
// Sort by avgPosKL ascending — weakest questions first
qStats.sort((a, b) => a.avgPosKL - b.avgPosKL);
console.log("  WEAKEST 15 questions by position signal strength:");
console.log("  Qid  ui-type        promptShort                         posKL  posRange  salKL");
for (const s of qStats.slice(0, 15)) {
    console.log(`  ${s.qid.toString().padEnd(4)} ${s.uiType.padEnd(14)} ${s.promptShort.padEnd(40)} ${s.avgPosKL.toFixed(3)}   ${s.maxPosRange.toFixed(2)}     ${s.avgSalKL.toFixed(3)}`);
}
// ── REPORT 3: per-node coverage ────────────────────────────────────────────
console.log("\n" + "=".repeat(80));
console.log("REPORT 3: per-node coverage (questions carrying evidence)");
console.log("=".repeat(80));
console.log("  node    |  pos-evidence Qs  |  sal-evidence Qs  |  mean posKL  |  mean salKL");
const allNodes = [...CONTINUOUS_NODES, ...CATEGORICAL_NODES];
for (const nid of allNodes) {
    let nPos = 0, nSal = 0;
    let sumPosKL = 0, sumSalKL = 0;
    for (const q of REPRESENTATIVE_QUESTIONS) {
        const evs = evidencePerQ.get(q.id).get(nid) ?? [];
        const hasPos = evs.some((e) => e.hasPos || e.hasCat);
        const hasSal = evs.some((e) => e.hasSal);
        if (hasPos) {
            nPos++;
            const posEvs = evs.filter((e) => e.hasPos || e.hasCat);
            sumPosKL += posEvs.reduce((a, e) => a + (e.posKL || e.catKL), 0) / posEvs.length;
        }
        if (hasSal) {
            nSal++;
            const salEvs = evs.filter((e) => e.hasSal);
            sumSalKL += salEvs.reduce((a, e) => a + e.salKL, 0) / salEvs.length;
        }
    }
    const marker = (nPos < 5 || nSal < 5) ? " ⚠" : "";
    console.log(`  ${nid.padEnd(6)} |  ${nPos.toString().padStart(3)}             |  ${nSal.toString().padStart(3)}             |  ${(sumPosKL / Math.max(nPos, 1)).toFixed(3)}      |  ${(sumSalKL / Math.max(nSal, 1)).toFixed(3)}${marker}`);
}
// ── REPORT 4: missing-salience audit ───────────────────────────────────────
console.log("\n" + "=".repeat(80));
console.log("REPORT 4: questions emitting position evidence WITHOUT salience evidence on the same node");
console.log("  Every question asking about node N *is* implicit evidence that N matters to the answerer.");
console.log("  Missing salience leaves this signal on the floor.");
console.log("=".repeat(80));
let missingSalCount = 0;
for (const q of REPRESENTATIVE_QUESTIONS) {
    if (q.uiType === "priority_sort" || q.uiType === "dual_axis")
        continue;
    // SELF nodes: no separate salience axis per ADR-005
    const evBy = evidencePerQ.get(q.id);
    const missing = [];
    for (const [nid, evs] of evBy) {
        if (isSelfNode(nid))
            continue;
        const hasPos = evs.some((e) => e.hasPos || e.hasCat);
        const hasSal = evs.some((e) => e.hasSal);
        if (hasPos && !hasSal)
            missing.push(nid);
    }
    if (missing.length > 0) {
        missingSalCount++;
        if (missingSalCount <= 25) {
            console.log(`  Q${q.id.toString().padEnd(4)} ${q.uiType.padEnd(14)} ${q.promptShort.padEnd(40)}  missing-sal: [${missing.join(", ")}]`);
        }
    }
}
console.log(`\n  Total questions with missing-salience: ${missingSalCount}`);
//# sourceMappingURL=audit-question-signals.js.map