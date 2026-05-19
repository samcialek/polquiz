// Per-response evidence audit (HARNESS-HANDOFF §5.5).
//
// For every (question, option/bucket/item, evidence node) row, compute:
//   - what shape the evidence has (pos/sal dist, scalar, anchor keys, moralCircle scope/universal)
//   - whether the evidence's target node is declared in touchProfile (with matching role)
//   - whether the distribution is hollow (within 0.03 of uniform) or sharp (max >= 0.45)
//
// Output: results/diagnostics/per-response-inventory.json (all questions),
//         results/diagnostics/per-response-router-slice.md (15 router questions, human-readable).
//
// This complements scripts/audit-question-signal-extraction.mjs but specifically
// audits moralCircle evidence emission (which the older script doesn't parse)
// and produces a per-row table suited to the SIGN/UNDER-PULL/OVER-PULL/ASYMMETRIC
// annotation pass per §5.5.

import fs from "node:fs";
import path from "node:path";

// Freshness check: refuse to run if the compiled bundle is older than the
// source. The audit reads `dist/config/questions.representative.js` (compiled)
// to avoid needing tsx at runtime, but stale dist will silently audit the
// wrong file. Fail loudly instead.
const SRC = path.join("src", "config", "questions.representative.ts");
const DIST = path.join("dist", "config", "questions.representative.js");
if (!fs.existsSync(DIST)) {
  console.error(`Missing ${DIST}. Run \`npm run build\` first.`);
  process.exit(1);
}
const srcMtime = fs.statSync(SRC).mtimeMs;
const distMtime = fs.statSync(DIST).mtimeMs;
if (distMtime < srcMtime) {
  const lagSec = ((srcMtime - distMtime) / 1000).toFixed(1);
  console.error(`Stale build: ${DIST} is ${lagSec}s older than ${SRC}. Run \`npm run build\` and retry.`);
  process.exit(1);
}

const { REPRESENTATIVE_QUESTIONS } = await import("../dist/config/questions.representative.js");

const OUT_DIR = path.join("results", "diagnostics");
fs.mkdirSync(OUT_DIR, { recursive: true });

const ROUTER_IDS = new Set([200, 103, 97, 60, 89, 218, 211, 212, 93, 102, 209, 210, 214, 8, 229]);

const HOLLOW_EPSILON = 0.03;
const SHARP_PEAK = 0.45;

function isHollowDist(arr) {
  if (!arr || arr.length === 0) return false;
  const uniform = 1 / arr.length;
  return arr.every(v => Math.abs(v - uniform) < HOLLOW_EPSILON);
}

function distSummary(arr) {
  if (!arr || !arr.length) return { peak: null, maxVal: null, sum: null };
  let peakIdx = 0;
  for (let i = 1; i < arr.length; i++) if (arr[i] > arr[peakIdx]) peakIdx = i;
  const sum = arr.reduce((s, v) => s + v, 0);
  return { peak: peakIdx + 1, maxVal: arr[peakIdx], sum }; // 1-indexed
}

function touchDeclares(q, targetNode, targetRole) {
  return q.touchProfile.some(t => {
    if (t.node !== targetNode) return false;
    if (!targetRole) return true; // wildcard
    return t.role === targetRole;
  });
}

function extractRowsForQuestion(q) {
  const rows = [];
  const sources = [
    ["optionEvidence", q.optionEvidence],
    ["sliderMap", q.sliderMap],
    ["allocationMap", q.allocationMap],
    ["rankingMap", q.rankingMap],
    ["bestWorstMap", q.bestWorstMap],
  ];

  // pairMaps and dualAxisMap handled separately (below)
  for (const [shape, map] of sources) {
    if (!map) continue;
    for (const [key, ev] of Object.entries(map)) {
      // continuous
      if (ev.continuous) {
        for (const [node, fields] of Object.entries(ev.continuous)) {
          if (fields && typeof fields === "object" && "pos" in fields) {
            const s = distSummary(fields.pos);
            rows.push({
              source: shape, optionKey: key, evidenceTarget: `${node}.pos`,
              kind: "continuous_pos", dist: fields.pos,
              peak: s.peak, maxVal: s.maxVal, sum: s.sum,
              hollow: isHollowDist(fields.pos),
              sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
              touchDeclared: touchDeclares(q, node, "position"),
            });
          }
          if (fields && typeof fields === "object" && "sal" in fields) {
            const s = distSummary(fields.sal);
            rows.push({
              source: shape, optionKey: key, evidenceTarget: `${node}.sal`,
              kind: "continuous_sal", dist: fields.sal,
              peak: s.peak, maxVal: s.maxVal, sum: s.sum,
              hollow: isHollowDist(fields.sal),
              sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
              touchDeclared: touchDeclares(q, node, "salience"),
            });
          }
          // Scalar shorthand (some maps use plain numbers); flag as scalar.
          if (typeof fields === "number") {
            rows.push({
              source: shape, optionKey: key, evidenceTarget: `${node}.scalar`,
              kind: "continuous_scalar", scalar: fields,
              touchDeclared: touchDeclares(q, node, null),
            });
          }
        }
      }
      // categorical
      if (ev.categorical) {
        for (const [node, fields] of Object.entries(ev.categorical)) {
          if (fields && typeof fields === "object" && "cat" in fields) {
            const s = distSummary(fields.cat);
            rows.push({
              source: shape, optionKey: key, evidenceTarget: `${node}.cat`,
              kind: "categorical_cat", dist: fields.cat,
              peak: s.peak, maxVal: s.maxVal, sum: s.sum,
              hollow: isHollowDist(fields.cat),
              sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
              touchDeclared: touchDeclares(q, node, "category"),
            });
          }
          if (fields && typeof fields === "object" && "probs" in fields) {
            const s = distSummary(fields.probs);
            rows.push({
              source: shape, optionKey: key, evidenceTarget: `${node}.probs`,
              kind: "categorical_probs", dist: fields.probs,
              peak: s.peak, maxVal: s.maxVal, sum: s.sum,
              hollow: isHollowDist(fields.probs),
              sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
              touchDeclared: touchDeclares(q, node, "category"),
            });
          }
          if (fields && typeof fields === "object" && "sal" in fields) {
            const s = distSummary(fields.sal);
            rows.push({
              source: shape, optionKey: key, evidenceTarget: `${node}.sal`,
              kind: "categorical_sal", dist: fields.sal,
              peak: s.peak, maxVal: s.maxVal, sum: s.sum,
              hollow: isHollowDist(fields.sal),
              sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
              touchDeclared: touchDeclares(q, node, "salience"),
            });
          }
        }
      }
      // trbAnchor
      if (ev.trbAnchor) {
        const anchors = Object.keys(ev.trbAnchor);
        rows.push({
          source: shape, optionKey: key, evidenceTarget: `TRB_ANCHOR.anchor`,
          kind: "trb_anchor", anchors: anchors, anchorValues: ev.trbAnchor,
          hollow: anchors.length === 0,
          touchDeclared: touchDeclares(q, "TRB_ANCHOR", null),
        });
      }
      // moralCircle
      if (ev.moralCircle) {
        const mc = ev.moralCircle;
        if (mc.universal !== undefined) {
          rows.push({
            source: shape, optionKey: key, evidenceTarget: `MORAL_CIRCLE.universal`,
            kind: "moralCircle_universal", scalar: mc.universal,
            touchDeclared: touchDeclares(q, "MORAL_CIRCLE", null),
          });
        }
        if (mc.scopedAffinities) {
          for (const [scope, val] of Object.entries(mc.scopedAffinities)) {
            rows.push({
              source: shape, optionKey: key, evidenceTarget: `MORAL_CIRCLE.scoped.${scope}`,
              kind: "moralCircle_scoped", scalar: val,
              touchDeclared: touchDeclares(q, "MORAL_CIRCLE", null),
            });
          }
        }
      }
    }
  }

  // pairMaps — pairwise UI. Shape: { pairId: { sideA: evBlock, sideB: evBlock } }.
  if (q.pairMaps) {
    for (const [pairId, sides] of Object.entries(q.pairMaps)) {
      for (const [side, ev] of Object.entries(sides)) {
        const optionKey = `${pairId}.${side}`;
        if (ev.continuous) {
          for (const [node, fields] of Object.entries(ev.continuous)) {
            if (fields && typeof fields === "object" && "pos" in fields) {
              const s = distSummary(fields.pos);
              rows.push({
                source: "pairMaps", optionKey, evidenceTarget: `${node}.pos`,
                kind: "continuous_pos", dist: fields.pos,
                peak: s.peak, maxVal: s.maxVal, sum: s.sum,
                hollow: isHollowDist(fields.pos),
                sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
                touchDeclared: touchDeclares(q, node, "position"),
              });
            }
            if (fields && typeof fields === "object" && "sal" in fields) {
              const s = distSummary(fields.sal);
              rows.push({
                source: "pairMaps", optionKey, evidenceTarget: `${node}.sal`,
                kind: "continuous_sal", dist: fields.sal,
                peak: s.peak, maxVal: s.maxVal, sum: s.sum,
                hollow: isHollowDist(fields.sal),
                sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
                touchDeclared: touchDeclares(q, node, "salience"),
              });
            }
            if (typeof fields === "number") {
              rows.push({
                source: "pairMaps", optionKey, evidenceTarget: `${node}.scalar`,
                kind: "continuous_scalar", scalar: fields,
                touchDeclared: touchDeclares(q, node, null),
              });
            }
          }
        }
        if (ev.categorical) {
          for (const [node, fields] of Object.entries(ev.categorical)) {
            if (fields && typeof fields === "object" && "cat" in fields) {
              const s = distSummary(fields.cat);
              rows.push({
                source: "pairMaps", optionKey, evidenceTarget: `${node}.cat`,
                kind: "categorical_cat", dist: fields.cat,
                peak: s.peak, maxVal: s.maxVal, sum: s.sum,
                hollow: isHollowDist(fields.cat),
                sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
                touchDeclared: touchDeclares(q, node, "category"),
              });
            }
            if (fields && typeof fields === "object" && "probs" in fields) {
              const s = distSummary(fields.probs);
              rows.push({
                source: "pairMaps", optionKey, evidenceTarget: `${node}.probs`,
                kind: "categorical_probs", dist: fields.probs,
                peak: s.peak, maxVal: s.maxVal, sum: s.sum,
                hollow: isHollowDist(fields.probs),
                sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
                touchDeclared: touchDeclares(q, node, "category"),
              });
            }
            if (fields && typeof fields === "object" && "sal" in fields) {
              const s = distSummary(fields.sal);
              rows.push({
                source: "pairMaps", optionKey, evidenceTarget: `${node}.sal`,
                kind: "categorical_sal", dist: fields.sal,
                peak: s.peak, maxVal: s.maxVal, sum: s.sum,
                hollow: isHollowDist(fields.sal),
                sharp: s.maxVal !== null && s.maxVal >= SHARP_PEAK,
                touchDeclared: touchDeclares(q, node, "salience"),
              });
            }
          }
        }
        if (ev.trbAnchor) {
          const anchors = Object.keys(ev.trbAnchor);
          rows.push({
            source: "pairMaps", optionKey, evidenceTarget: `TRB_ANCHOR.anchor`,
            kind: "trb_anchor", anchors, anchorValues: ev.trbAnchor,
            hollow: anchors.length === 0,
            touchDeclared: touchDeclares(q, "TRB_ANCHOR", null),
          });
        }
        if (ev.moralCircle) {
          const mc = ev.moralCircle;
          if (mc.universal !== undefined) {
            rows.push({
              source: "pairMaps", optionKey, evidenceTarget: `MORAL_CIRCLE.universal`,
              kind: "moralCircle_universal", scalar: mc.universal,
              touchDeclared: touchDeclares(q, "MORAL_CIRCLE", null),
            });
          }
          if (mc.scopedAffinities) {
            for (const [scope, val] of Object.entries(mc.scopedAffinities)) {
              rows.push({
                source: "pairMaps", optionKey, evidenceTarget: `MORAL_CIRCLE.scoped.${scope}`,
                kind: "moralCircle_scoped", scalar: val,
                touchDeclared: touchDeclares(q, "MORAL_CIRCLE", null),
              });
            }
          }
        }
      }
    }
  }

  // dualAxis
  if (q.dualAxisMap) {
    rows.push({
      source: "dualAxisMap", optionKey: "(continuous)",
      evidenceTarget: `${q.dualAxisMap.node}.dual`,
      kind: "dual_axis",
      touchDeclared: touchDeclares(q, q.dualAxisMap.node, null),
    });
  }

  return rows;
}

function computeFlags(rows) {
  const flags = [];
  for (const r of rows) {
    if (r.hollow) {
      flags.push({ severity: "high", code: "HOLLOW_DIST", ...r });
    }
    if (!r.touchDeclared && r.evidenceTarget !== "TRB_ANCHOR.anchor") {
      // TRB_ANCHOR is sometimes touch-declared via TRB_ANCHOR; flag others.
      flags.push({ severity: "high", code: "EVIDENCE_NOT_IN_TOUCHPROFILE", ...r });
    }
    if (!r.touchDeclared && r.evidenceTarget === "TRB_ANCHOR.anchor") {
      flags.push({ severity: "med", code: "TRB_ANCHOR_NOT_IN_TOUCHPROFILE", ...r });
    }
  }
  return flags;
}

const allInventory = [];
const allFlags = [];

for (const q of REPRESENTATIVE_QUESTIONS) {
  const rows = extractRowsForQuestion(q);
  const flags = computeFlags(rows);
  allInventory.push({
    id: q.id,
    promptShort: q.promptShort,
    promptFull: q.promptFull,
    uiType: q.uiType,
    stage: q.stage,
    quality: q.quality,
    touchProfile: q.touchProfile.map(t => ({ node: t.node, role: t.role, weight: t.weight })),
    optionLabels: q.optionLabels ?? null,
    options: q.options ?? null,
    rowCount: rows.length,
    rows,
    flags,
  });
  for (const f of flags) allFlags.push({ qid: q.id, ...f });
}

// Summary across full bank
const summary = {
  questionCount: allInventory.length,
  totalRows: allInventory.reduce((s, q) => s + q.rowCount, 0),
  flagCount: allFlags.length,
  flagsByCode: allFlags.reduce((m, f) => {
    m[f.code] = (m[f.code] || 0) + 1;
    return m;
  }, {}),
  flagsByQuestion: allFlags.reduce((m, f) => {
    m[f.qid] = (m[f.qid] || 0) + 1;
    return m;
  }, {}),
};

fs.writeFileSync(
  path.join(OUT_DIR, "per-response-inventory.json"),
  JSON.stringify({ summary, questions: allInventory }, null, 2)
);

// Router-slice markdown report
const routerQuestions = allInventory.filter(q => ROUTER_IDS.has(q.id));
const routerOrder = [200, 103, 97, 60, 89, 218, 211, 212, 93, 102, 209, 210, 214, 8, 229];
routerQuestions.sort((a, b) => routerOrder.indexOf(a.id) - routerOrder.indexOf(b.id));

function fmtDist(dist) {
  if (!dist) return "—";
  return "[" + dist.map(v => v.toFixed(2)).join(", ") + "]";
}

const lines = [];
lines.push("# Per-Response Evidence Audit — Router Slice");
lines.push("");
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)}.`);
lines.push("");
lines.push(`Slice: the 15 questions in \`SALIENCE_ROUTER_FIXED\` (engine/config.ts). These fire for every respondent, so calibration errors here have maximum impact.`);
lines.push("");
lines.push("Each row reports the mechanical findings only. Manual SIGN / UNDER-PULL / OVER-PULL / ASYMMETRIC judgments are annotated inline as `// audit:` comments.");
lines.push("");

// Top-level summary
lines.push("## Summary");
lines.push("");
const routerFlags = allFlags.filter(f => ROUTER_IDS.has(f.qid));
lines.push(`- Router questions: ${routerQuestions.length}`);
lines.push(`- Total evidence rows in router slice: ${routerQuestions.reduce((s, q) => s + q.rowCount, 0)}`);
lines.push(`- Mechanical flags in router slice: ${routerFlags.length}`);
const routerCodeCounts = routerFlags.reduce((m, f) => { m[f.code] = (m[f.code] || 0) + 1; return m; }, {});
for (const [code, n] of Object.entries(routerCodeCounts)) {
  lines.push(`  - ${code}: ${n}`);
}
lines.push("");
lines.push("**Full-bank totals (for context):**");
lines.push(`- Questions: ${summary.questionCount}`);
lines.push(`- Evidence rows: ${summary.totalRows}`);
lines.push(`- Mechanical flags: ${summary.flagCount}`);
for (const [code, n] of Object.entries(summary.flagsByCode)) {
  lines.push(`  - ${code}: ${n}`);
}
lines.push("");

// Per-question detail
for (const q of routerQuestions) {
  lines.push(`## Q${q.id} — ${q.promptShort}`);
  lines.push("");
  lines.push(`- UI: \`${q.uiType}\` · stage: \`${q.stage}\` · quality: ${q.quality}`);
  lines.push(`- Prompt: ${q.promptFull ? `*${q.promptFull.replace(/\n/g, " ")}*` : "—"}`);
  lines.push(`- touchProfile:`);
  for (const t of q.touchProfile) {
    lines.push(`  - \`${t.node}\` · ${t.role} · w=${t.weight}`);
  }
  if (q.flags.length) {
    lines.push("");
    lines.push(`**Mechanical flags (${q.flags.length}):**`);
    for (const f of q.flags) {
      const target = f.evidenceTarget;
      const opt = f.optionKey;
      const peakInfo = (f.peak != null) ? ` peak=${f.peak}@${f.maxVal?.toFixed(2)}` : "";
      const scalarInfo = (f.scalar !== undefined) ? ` scalar=${f.scalar}` : "";
      lines.push(`- \`${f.code}\` — option \`${opt}\` → ${target}${peakInfo}${scalarInfo}`);
    }
  }
  lines.push("");
  lines.push("**Evidence rows:**");
  lines.push("");
  lines.push("| option/bucket | evidence target | shape | touch declared | flag |");
  lines.push("|---|---|---|---|---|");
  for (const r of q.rows) {
    let shapeCol;
    if (r.dist) {
      const sharp = r.sharp ? " · **sharp**" : "";
      const hollow = r.hollow ? " · **HOLLOW**" : "";
      shapeCol = `peak=${r.peak}@${r.maxVal.toFixed(2)} ${fmtDist(r.dist)}${sharp}${hollow}`;
    } else if (r.scalar !== undefined) {
      shapeCol = `scalar=${r.scalar}`;
    } else if (r.anchors) {
      shapeCol = `anchors=[${r.anchors.join(", ")}]`;
    } else {
      shapeCol = "(other)";
    }
    const declared = r.touchDeclared ? "✓" : "❌";
    const flag = !r.touchDeclared ? "EVIDENCE_NOT_IN_TOUCHPROFILE" : (r.hollow ? "HOLLOW" : "");
    const label = q.optionLabels?.[r.optionKey];
    const labelCol = label ? `\`${r.optionKey}\` — *${label}*` : `\`${r.optionKey}\``;
    lines.push(`| ${labelCol} | \`${r.evidenceTarget}\` | ${shapeCol} | ${declared} | ${flag} |`);
  }
  lines.push("");
}

fs.writeFileSync(path.join(OUT_DIR, "per-response-audit-router-slice.md"), lines.join("\n"));

console.log(JSON.stringify(summary, null, 2));
console.log(`\nRouter-slice flags: ${routerFlags.length}`);
console.log(`Output:`);
console.log(`  - ${path.join(OUT_DIR, "per-response-inventory.json")}`);
console.log(`  - ${path.join(OUT_DIR, "per-response-audit-router-slice.md")}`);
