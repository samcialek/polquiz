#!/usr/bin/env node
/**
 * PR 1 — Trace reliability: dump validator.
 *
 * Static checks on a prism-dump JSON file. Surfaces the reliability classes
 * the three-dump review session identified:
 *   - Duplicate qId in trace (Dump 1 had Q6 fire twice — PR 1 dedupe should
 *     prevent this for new runs but historical dumps stay flagged)
 *   - Missing election metadata when Q200/Q211/Q212 fired (the bug Sam fixed
 *     offline with applyMetadataAnswer)
 *   - Missing diagnostics field (PR 1 export change)
 *   - Missing bundleVersion (PR 1 export change — flags pre-PR-1 dumps stale)
 *   - Election reroute count and gold-outline-on-abstain candidates
 *
 * Output: human-readable report with PASS/FAIL/WARN per check.
 *
 * Usage:
 *   node scripts/validate-dump.cjs <path/to/dump.json> [...more dumps]
 *   node scripts/validate-dump.cjs --all   # validates every prism-dump-*.json in repo root
 */
const fs = require('fs');
const path = require('path');

const RESET = '\x1b[0m', RED = '\x1b[31m', GREEN = '\x1b[32m', YELLOW = '\x1b[33m', DIM = '\x1b[2m';

function pass(msg) { console.log(`  ${GREEN}✓${RESET} ${msg}`); return true; }
function fail(msg) { console.log(`  ${RED}✗ FAIL${RESET} ${msg}`); return false; }
function warn(msg) { console.log(`  ${YELLOW}⚠ WARN${RESET} ${msg}`); return null; }
function info(msg) { console.log(`  ${DIM}·${RESET} ${msg}`); }

function checkDump(dumpPath) {
  console.log();
  console.log(`══ ${dumpPath}`);
  let raw;
  try {
    raw = fs.readFileSync(dumpPath, 'utf8');
  } catch (e) {
    fail(`Could not read file: ${e.message}`);
    return { pass: 0, fail: 1, warn: 0 };
  }
  let dump;
  try {
    dump = JSON.parse(raw);
  } catch (e) {
    fail(`Invalid JSON: ${e.message}`);
    return { pass: 0, fail: 1, warn: 0 };
  }

  const results = { pass: 0, fail: 0, warn: 0 };
  function tally(r) {
    if (r === true) results.pass++;
    else if (r === false) results.fail++;
    else if (r === null) results.warn++;
  }

  // ─ structure ────────────────────────────────────────────────────────────
  const r = dump.results || {};
  const trace = Array.isArray(dump.trace) ? dump.trace : [];
  const election = Array.isArray(dump.election) ? dump.election : [];

  if (!r.archetypeId) { tally(fail('Missing results.archetypeId')); return results; }
  info(`runId=${dump.runId || '(none)'} · archetype=${r.archetypeId} ${r.archetypeName} · questions=${r.questionsAnswered}`);

  // ─ bundleVersion (PR 1) ─────────────────────────────────────────────────
  if (r.bundleVersion) {
    tally(pass(`bundleVersion: ${r.bundleVersion}`));
  } else {
    tally(warn(`bundleVersion missing — pre-PR-1 dump; treat election + trbAnchor data as potentially stale`));
  }

  // ─ duplicate qId in trace ───────────────────────────────────────────────
  const seen = new Map();
  const duplicates = [];
  for (const entry of trace) {
    if (seen.has(entry.qId)) {
      duplicates.push({ qId: entry.qId, firstIdx: seen.get(entry.qId), dupIdx: entry.idx });
    } else {
      seen.set(entry.qId, entry.idx);
    }
  }
  if (duplicates.length === 0) {
    tally(pass(`No duplicate qId in trace (${trace.length} entries)`));
  } else {
    duplicates.forEach(d => tally(fail(`Duplicate qId Q${d.qId} fired at trace idx ${d.firstIdx} AND ${d.dupIdx}`)));
  }

  // ─ trace length vs questionsAnswered ────────────────────────────────────
  if (trace.length === r.questionsAnswered) {
    tally(pass(`trace.length matches questionsAnswered (${r.questionsAnswered})`));
  } else if (trace.length === r.questionsAnswered + duplicates.length) {
    tally(warn(`trace.length=${trace.length} > questionsAnswered=${r.questionsAnswered} (accounted for by ${duplicates.length} duplicate(s))`));
  } else {
    tally(fail(`trace.length=${trace.length} != questionsAnswered=${r.questionsAnswered} (and not accounted for by duplicates)`));
  }

  // ─ Q200/Q211/Q212 metadata propagation ──────────────────────────────────
  const stateMeta = (r.respondentState || {});
  const q200Entry = trace.find(t => t.qId === 200);
  const q211Entry = trace.find(t => t.qId === 211);
  const q212Entry = trace.find(t => t.qId === 212);

  if (q200Entry) {
    const ans = q200Entry.answer;
    const expectedPid = ans === 'dem' ? 'D' : ans === 'rep' ? 'R' : ans === 'ind' ? 'I' : ans === 'third' ? 'T' : ans === 'none' ? 'N' : null;
    if (stateMeta.partyID === expectedPid) {
      tally(pass(`Q200 → state.partyID = ${stateMeta.partyID} (matches answer "${ans}")`));
    } else if (stateMeta.partyID == null && expectedPid != null) {
      tally(fail(`Q200 answered "${ans}" but state.partyID is ${stateMeta.partyID === undefined ? 'undefined' : 'null'} — metadata hook not firing (pre-fix dump)`));
    } else {
      tally(warn(`Q200 answered "${ans}" but state.partyID = ${stateMeta.partyID} (expected ${expectedPid})`));
    }
  } else {
    info('Q200 not in trace — no partyID check applicable');
  }

  if (q211Entry) {
    const ans = q211Entry.answer;
    const expectedSV = ans === 'strategic_lesser_evil';
    if (stateMeta.strategicVoting === expectedSV) {
      tally(pass(`Q211 → state.strategicVoting = ${stateMeta.strategicVoting} (matches answer "${ans}")`));
    } else if (stateMeta.strategicVoting == null) {
      tally(fail(`Q211 answered "${ans}" but state.strategicVoting is ${stateMeta.strategicVoting === undefined ? 'undefined' : 'null'} — metadata hook not firing`));
    } else {
      tally(warn(`Q211 answered "${ans}" but state.strategicVoting = ${stateMeta.strategicVoting} (expected ${expectedSV})`));
    }
  }

  if (q212Entry) {
    const ans = q212Entry.answer;
    const np = stateMeta.negativeParties;
    if (np && (Array.isArray(np) ? np.length : (typeof np === 'object' ? Object.keys(np).length : 0)) > 0) {
      tally(pass(`Q212 → state.negativeParties populated (${JSON.stringify(np)})`));
    } else if (ans === 'consider_all') {
      tally(pass(`Q212 = "consider_all" → no negative-parties expected`));
    } else {
      tally(fail(`Q212 answered "${ans}" but state.negativeParties is empty/missing`));
    }
  }

  // ─ diagnostics field (PR 1) ─────────────────────────────────────────────
  if (r.diagnostics && typeof r.diagnostics === 'object') {
    const d = r.diagnostics;
    const checks = [];
    if (Array.isArray(d.pullingTowardWinner)) checks.push(`pullingTowardWinner=${d.pullingTowardWinner.length}`);
    if (Array.isArray(d.pushingAwayFromWinner)) checks.push(`pushingAwayFromWinner=${d.pushingAwayFromWinner.length}`);
    if (typeof d.marginToRunnerUp === 'number') checks.push(`marginToRunnerUp=${d.marginToRunnerUp.toFixed(4)}`);
    if (checks.length >= 2) {
      tally(pass(`diagnostics present (${checks.join(' · ')})`));
    } else {
      tally(warn(`diagnostics field present but incomplete (${checks.join(' · ') || 'empty object'})`));
    }
  } else {
    tally(warn(`diagnostics missing — pre-PR-1 dump; debugging requires reconstruction from pre/post state`));
  }

  // ─ engagement field ────────────────────────────────────────────────────
  if (r.engagement && r.engagement.label) {
    tally(pass(`engagement label: ${r.engagement.label}`));
  } else {
    info(`engagement field missing or unset`);
  }

  // ─ confidence band ──────────────────────────────────────────────────────
  if (typeof r.confidence === 'number') {
    info(`confidence: ${(r.confidence * 100).toFixed(2)}% (${r.confidenceBand || '(band missing)'})`);
  }

  // ─ election checks ──────────────────────────────────────────────────────
  if (election.length > 0) {
    let abstainGoldCount = 0;
    let modernRerouteCount = 0;
    let modernPartisanMultUnity = 0;
    for (const p of election) {
      if (!p || !p.year) continue;
      const isReroute = p.nearest && p.nearestByValues && p.nearest.name !== p.nearestByValues.name;
      const isAbstain = p.decision === 'abstain';
      if (isReroute && isAbstain) abstainGoldCount++;
      if (isReroute && p.decision === 'vote') modernRerouteCount++;
      if (p.year >= 1932 && p.candidates) {
        for (const c of p.candidates) {
          if (typeof c.partisanMultiplier === 'number' && c.partisanMultiplier === 1.0 && stateMeta.partyID && stateMeta.partyID !== 'I' && stateMeta.partyID !== 'N') {
            // Out-of-party candidate should have partisanMultiplier > 1
            const cp = c.party === 'Democratic' || c.party === 'Democratic-Republican' ? 'D'
              : c.party === 'Republican' || c.party === 'Whig' || c.party === 'Federalist' ? 'R' : 'O';
            if (cp !== stateMeta.partyID && cp !== 'O') {
              modernPartisanMultUnity++;
            }
          }
        }
      }
    }
    info(`elections: ${election.length} · reroutes (vote): ${modernRerouteCount} · abstain-gold candidates: ${abstainGoldCount}`);
    if (abstainGoldCount > 0) {
      tally(warn(`${abstainGoldCount} abstain elections have nearest != nearestByValues — these would render gold-outlined under current UI (PR 5 fix pending)`));
    } else {
      tally(pass(`No abstain-gold-outline candidates`));
    }
    if (modernPartisanMultUnity > 0 && stateMeta.partyID && stateMeta.partyID !== 'I' && stateMeta.partyID !== 'N') {
      tally(fail(`${modernPartisanMultUnity} post-1932 out-party candidates have partisanMultiplier=1.0 (party-loyalty modifier not applied — pre-fix dump)`));
    }
  } else {
    info('No election predictions in dump');
  }

  // ─ summary line ─────────────────────────────────────────────────────────
  const total = results.pass + results.fail + results.warn;
  const verdict = results.fail > 0 ? `${RED}FAIL${RESET}` : results.warn > 0 ? `${YELLOW}WARN${RESET}` : `${GREEN}PASS${RESET}`;
  console.log(`  ─── ${verdict}: ${results.pass} pass, ${results.fail} fail, ${results.warn} warn (${total} checks)`);
  return results;
}

// ─ CLI ────────────────────────────────────────────────────────────────────
function main() {
  const args = process.argv.slice(2);
  let paths;
  if (args.length === 0 || args.includes('--all')) {
    paths = fs.readdirSync(process.cwd()).filter(f => /^prism-dump-.*\.json$/.test(f)).map(f => path.join(process.cwd(), f));
    if (paths.length === 0) {
      console.error('No prism-dump-*.json files found in current directory.');
      console.error('Usage: node scripts/validate-dump.cjs [--all | <path>...]');
      process.exit(2);
    }
  } else {
    paths = args.filter(a => !a.startsWith('--'));
  }

  const totals = { pass: 0, fail: 0, warn: 0, dumps: paths.length, dumpsFailed: 0 };
  for (const p of paths) {
    const r = checkDump(p);
    totals.pass += r.pass;
    totals.fail += r.fail;
    totals.warn += r.warn;
    if (r.fail > 0) totals.dumpsFailed++;
  }

  console.log();
  console.log('═'.repeat(60));
  console.log(`SUMMARY: ${totals.dumps} dumps validated`);
  console.log(`  ${GREEN}${totals.pass} checks passed${RESET}`);
  console.log(`  ${YELLOW}${totals.warn} warnings${RESET}`);
  console.log(`  ${RED}${totals.fail} failures${RESET}`);
  console.log(`  ${totals.dumpsFailed}/${totals.dumps} dumps with at least one FAIL`);
  process.exit(totals.fail > 0 ? 1 : 0);
}

main();
