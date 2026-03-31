/**
 * PRISM Quiz V3 Browser Automation — Progressive Civic Nationalist
 * Opens a real Chrome window and clicks through the quiz.
 */
import { chromium } from 'playwright';

const QUIZ_URL = 'https://matricesofconfusion.com/prism-quiz-v3.html';

// Percent sliders keep 0-100; all others use 1-7 Likert
const PERCENT_SLIDERS = new Set([
  'guess_top_marginal_tax_rate', 'preferred_top_marginal_tax_rate',
  'mainstream_media_accuracy_estimate', 'percent_groups_want_best_share_values',
]);

// Likert value (1-7) for non-percent sliders
// Map from our 0-100 conceptual value to 1-7
function to7(val100) {
  // 0→1, 17→2, 33→3, 50→4, 67→5, 83→6, 100→7
  return Math.max(1, Math.min(7, Math.round(val100 / 100 * 6 + 1)));
}

// Answer map: promptShort → answer
// For sliders: value is 0-100 conceptual (converted to Likert or kept as % based on question)
// For choice: value is the option key string
// For allocation: value is {bucket: number} 
// For ranking: value is string[] in desired order
// For best_worst: value is {best, worst}
// For pairwise: value is {pairId: chosenOption}
// For multi: value is string[]
const ANSWERS = {
  political_content_frequency: { t: 'mc', v: 'most_days' },
  political_identity_centrality: { t: 'slider', v: 55 },
  cultural_social_placement: { t: 'slider', v: 25 },
  cultural_social_salience: { t: 'slider', v: 55 },
  nyt_headline_click: { t: 'mc', v: 'weird_science' },
  inequality_causes_allocation: { t: 'alloc', v: { system_advantages: 35, family_background: 25, discrimination_bias: 20, effort_choices: 15, luck_random: 5 } },
  bad_outcomes_blame_allocation: { t: 'alloc', v: { powerful_incompetent: 30, powerful_selfish: 25, complex_forces: 30, random_luck: 10, ordinary_choices: 5 } },
  controversial_speaker: { t: 'mc', v: 'allow_with_counterspeech' },
  who_should_shape_a_law: { t: 'rank', v: ['organized_residents', 'researchers', 'elected_officials', 'community_deliberation', 'elders_religious', 'business_stakeholders'] },
  trade_liberalization_effects: { t: 'mc', v: 'net_positive_but_uneven' },
  opponents_matter_to_identity: { t: 'slider', v: 30 },
  political_conflict_with_close_others: { t: 'mc', v: 'engage_carefully' },
  domestic_vs_abroad_lives: { t: 'slider', v: 65 },
  effective_leader_style: { t: 'mc', v: 'expert_team' },
  politically_important_identities: { t: 'rank', v: ['national_identity', 'class_identity', 'ideological_identity', 'ethnic_racial_identity', 'religious_identity'] },
  best_worst_battery: { t: 'bw', v: { best: 'fairness', worst: 'national_strength' } },
  guess_top_marginal_tax_rate: { t: 'slider', v: 37 },
  preferred_top_marginal_tax_rate: { t: 'slider', v: 55 },
  human_progress_salience: { t: 'slider', v: 70 },
  mainstream_media_accuracy_estimate: { t: 'slider', v: 72 },
  percent_groups_want_best_share_values: { t: 'slider', v: 70 },
  rules_procedures_matter_salience: { t: 'slider', v: 75 },
  social_progress_salience: { t: 'slider', v: 80 },
  immigration_national_identity_salience: { t: 'slider', v: 60 },
  surveillance_enforcement_due_process_bundle: { t: 'mc', v: 'due_process_priority' },
  coalition_vs_principle: { t: 'mc', v: 'depends_on_issue' },
  politics_at_social_gatherings: { t: 'mc', v: 'engage_carefully' },
  climate_energy_bundle: { t: 'mc', v: 'gradual_transition' },
  university_admissions_approach: { t: 'mc', v: 'holistic_review' },
  criminal_justice_bundle: { t: 'mc', v: 'rehabilitation_focus' },
  ceo_worker_pay_ratio: { t: 'slider', v: 25 },
  human_progress_view: { t: 'mc', v: 'gradual_progress' },
  criminal_trial_error_tradeoff: { t: 'mc', v: 'rather_free_guilty' },
  vacation_new_vs_familiar: { t: 'mc', v: 'new_place' },
  welfare_error_tradeoff: { t: 'mc', v: 'rather_help_undeserving' },
  mask_mandate_acceptability: { t: 'mc', v: 'accept_mandate' },
  information_control_error_tradeoff: { t: 'mc', v: 'allow_fully' },
  immigration_enforcement_error_tradeoff: { t: 'mc', v: 'deport_legal' },
  threats_to_america_external_internal: { t: 'mc', v: 'internal' },
  fda_speed_vs_safety: { t: 'mc', v: 'prioritize_speed' },
  stupid_workplace_rule_response: { t: 'mc', v: 'follow_then_advocate' },
  election_access_vs_security: { t: 'mc', v: 'disenfranchise' },
  close_friends_voted_differently: { t: 'mc', v: 'keep_friendship' },
  veil_of_ignorance_society_choice: { t: 'mc', v: 'safety_net_society' },
  what_changed_minds_through_history: { t: 'mc', v: 'evidence_and_argument' },
  social_progress_view: { t: 'mc', v: 'real_contested' },
  political_membership_criterion_rewrite: { t: 'mc', v: 'shared_values' },
  parents_politics_growing_up: { t: 'mc', v: 'some_lib' },
  religion_in_upbringing: { t: 'mc', v: 'moderate' },
  parents_political_engagement: { t: 'mc', v: 'somewhat' },
  caregiver_emotional_availability: { t: 'slider', v: 75 },
  neighborhood_safety_childhood: { t: 'mc', v: 'mostly_safe' },
  what_matters_more_in_leader: { t: 'mc', v: 'competence_record' },
  political_pitch_resonance: { t: 'mc', v: 'data_driven' },
  movement_aesthetics_reaction: { t: 'mc', v: 'sometimes_necessary' },
  engagement_motivations_top2: { t: 'multi', v: ['civic_duty', 'intellectual_challenge'] },
  what_changed_your_mind: { t: 'mc', v: 'data_evidence' },
  factual_estimates_and_confidence: { t: 'slider', v: 50 },
  factory_closure_causes_ranking: { t: 'rank', v: ['global_competition', 'government_policy', 'automation', 'corporate_decisions', 'worker_choices'] },
  integration_expectations_rewrite: { t: 'rank', v: ['learn_language', 'civic_participation', 'follow_laws', 'economic_contribution', 'cultural_customs'] },
  political_frustration: { t: 'mc', v: 'both_sides_broken' },
  party_culture_conflict_response: { t: 'mc', v: 'say_so_publicly' },
  community_fund_allocation: { t: 'alloc', v: { modernize_infrastructure: 25, community_mutual_aid: 30, art_music: 15, market_based_development: 10, preserve_heritage: 20 } },
  universal_vs_local_obligations: { t: 'mc', v: 'global_obligations_first' },
  opponent_success_response: { t: 'mc', v: 'maybe_good_outcome' },
  common_ground_salience: { t: 'slider', v: 80 },
  zero_sum_politics_view: { t: 'slider', v: 35 },
  rhetoric_style_importance: { t: 'slider', v: 55 },
  inequality_solutions_ranking: { t: 'rank', v: ['government_redistribution', 'strong_regulations', 'community_mutual_aid', 'charitable_giving', 'free_market_growth'] },
  culture_vs_diversity_scope: { t: 'mc', v: 'civic_assimilation' },
  cross_party_marriage_comfort: { t: 'slider', v: 80 },
  success_attribution: { t: 'slider', v: 35 },
  decision_making_style: { t: 'slider', v: 30 },
  speaker_appeal: { t: 'mc', v: 'deep_expertise' },
  expert_disagreement_reaction: { t: 'mc', v: 'check_evidence' },
  political_attention_style: { t: 'mc', v: 'look_up_facts' },
  party_vs_cause_loyalty: { t: 'mc', v: 'cause_over_party' },
  openness_assimilation_closure: { t: 'mc', v: 'civic_assimilation' },
  broken_politics_diagnosis: { t: 'mc', v: 'civic_loss' },
  institutions_harden_into_domination: { t: 'slider', v: 55 },
  institutional_legitimacy_source: { t: 'mc', v: 'procedural_rules' },
  views_changed_in_10_years: { t: 'slider', v: 50 },
  child_traits: { t: 'pairwise', v: { 'obedience_vs_self_reliance': 'self_reliance', 'independence_vs_elders': 'independence' } },
  opponent_model_allocation: { t: 'alloc', v: { legitimate_values: 35, misinformed: 30, bad_motives: 10, economic_interests: 25 } },
};

const delay = ms => new Promise(r => setTimeout(r, ms));

async function run() {
  const browser = await chromium.launch({ headless: false, slowMo: 200 });
  const page = await browser.newPage({ viewport: { width: 1200, height: 900 } });
  await page.goto(QUIZ_URL, { waitUntil: 'networkidle' });
  console.log('Quiz loaded.');
  await delay(1500);

  // Click Begin
  await page.click('button.start-btn, .cta-btn', { timeout: 5000 }).catch(() => {});
  await delay(1000);

  for (let step = 0; step < 60; step++) {
    // Check if we redirected to results
    if (page.url().includes('prism-results')) {
      console.log(`\n🏆 Redirected to results page after ${step} questions!`);
      break;
    }

    // Get current question from engine
    const qInfo = await page.evaluate(() => {
      if (typeof PrismEngine === 'undefined') return null;
      if (PrismEngine.isComplete()) return { done: true };
      const q = PrismEngine.getNextQuestion();
      if (!q) return { done: true };
      return { id: q.id, ps: q.promptShort, ui: q.uiType, opts: q.options, bwi: q.bestWorstItems, ri: q.rankingItems, ab: q.allocationBuckets, pi: q.pairIds };
    });

    if (!qInfo || qInfo.done) {
      console.log('Quiz engine says done. Triggering results...');
      await page.evaluate(() => { if (typeof showResults === "function") showResults(); });
      await delay(2000);
      break;
    }

    const ans = ANSWERS[qInfo.ps];
    console.log(`Q${step + 1}: ${qInfo.ps} [${qInfo.ui}] ${ans ? '✓' : '✗ no answer'}`);

    // Pause 2 seconds so viewer can read the question
    await delay(2000);

    try {
      switch (qInfo.ui) {
        case 'single_choice': {
          const key = ans?.v || qInfo.opts?.[0];
          // Find and click the mc-option containing this key
          await page.evaluate((optKey) => {
            const opts = document.querySelectorAll('.mc-option');
            for (const o of opts) {
              if (o.getAttribute('onclick')?.includes("'" + optKey + "'")) {
                o.click();
                return;
              }
            }
            // fallback: click first
            if (opts.length > 0) opts[0].click();
          }, key);
          await delay(600);
          break;
        }

        case 'slider': {
          const isPercent = PERCENT_SLIDERS.has(qInfo.ps);
          const rawVal = ans?.v ?? 50;
          const sliderVal = isPercent ? rawVal : to7(rawVal);
          
          await page.evaluate((val) => {
            const s = document.getElementById('main-slider');
            if (s) {
              s.value = val;
              s.dispatchEvent(new Event('input', { bubbles: true }));
              s.dispatchEvent(new Event('change', { bubbles: true }));
            }
          }, sliderVal);
          await delay(300);
          
          // Click continue
          await page.click('.continue-btn').catch(() => {});
          await delay(600);
          break;
        }

        case 'allocation': {
          const alloc = ans?.v || {};
          await page.evaluate((values) => {
            const sliders = document.querySelectorAll('.allocation-slider');
            sliders.forEach(s => {
              const bucket = s.dataset.bucket;
              if (values[bucket] !== undefined) {
                s.value = values[bucket];
                s.dispatchEvent(new Event('input', { bubbles: true }));
              }
            });
            if (typeof updateAllocDisplay === 'function') updateAllocDisplay();
          }, alloc);
          await delay(400);
          await page.click('.continue-btn').catch(() => {});
          await delay(600);
          break;
        }

        case 'ranking': {
          const order = ans?.v || qInfo.ri || [];
          await page.evaluate((desiredOrder) => {
            const container = document.getElementById('ranking-list');
            if (!container) return;
            // Reorder DOM elements to match desired order
            for (const itemKey of desiredOrder) {
              const el = container.querySelector(`[data-item="${itemKey}"]`);
              if (el) container.appendChild(el);
            }
            // Update numbers
            container.querySelectorAll('.ranking-item').forEach((item, i) => {
              const numEl = item.querySelector('.ranking-number');
              if (numEl) numEl.textContent = i + 1;
            });
          }, order);
          await delay(400);
          await page.click('.continue-btn').catch(() => {});
          await delay(600);
          break;
        }

        case 'best_worst': {
          const bw = ans?.v || { best: qInfo.bwi?.[0], worst: qInfo.bwi?.[qInfo.bwi.length - 1] };
          // Click best button
          await page.evaluate((item) => {
            const row = document.getElementById('bw-row-' + item);
            if (row) row.querySelector('.best-btn')?.click();
          }, bw.best);
          await delay(400);
          // Click worst button
          await page.evaluate((item) => {
            const row = document.getElementById('bw-row-' + item);
            if (row) row.querySelector('.worst-btn')?.click();
          }, bw.worst);
          await delay(800); // auto-submits after 400ms
          break;
        }

        case 'pairwise': {
          // Pairwise rendered as MC in this quiz
          const pairAns = ans?.v || {};
          const chosen = Object.values(pairAns)[0] || qInfo.opts?.[0];
          await page.evaluate((optKey) => {
            const opts = document.querySelectorAll('.mc-option');
            for (const o of opts) {
              if (o.getAttribute('onclick')?.includes("'" + optKey + "'")) {
                o.click();
                return;
              }
            }
            if (opts.length > 0) opts[0].click();
          }, chosen);
          await delay(600);
          break;
        }

        case 'multi': {
          // Multi in this quiz is treated as single_choice (selectMC auto-submits)
          // Just pick the first selection
          const sel = Array.isArray(ans?.v) ? ans.v[0] : (ans?.v || qInfo.opts?.[0]);
          await page.evaluate((optKey) => {
            const opts = document.querySelectorAll('.mc-option');
            for (const o of opts) {
              if (o.getAttribute('onclick')?.includes("'" + optKey + "'")) {
                o.click();
                return;
              }
            }
            // fallback
            if (opts.length > 0) opts[0].click();
          }, sel);
          await delay(600);
          break;
        }

        default: {
          // Unknown type — try clicking first mc-option or continue btn
          console.log(`  ⚠ Unknown UI type: ${qInfo.ui}`);
          await page.click('.mc-option:first-child').catch(() => {});
          await delay(300);
          await page.click('.continue-btn').catch(() => {});
          await delay(600);
        }
      }
    } catch (err) {
      console.log(`  ❌ ${err.message}`);
    }

    // Wait for DOM to settle after question change
    await page.waitForFunction(
      (prevId) => {
        if (typeof PrismEngine === 'undefined') return true;
        if (PrismEngine.isComplete()) return true;
        const q = PrismEngine.getNextQuestion();
        return !q || q.id !== prevId;
      },
      qInfo.id,
      { timeout: 5000 }
    ).catch(() => {});
    await delay(500);
  }

  // Wait for potential redirect
  await delay(3000);
  
  // Screenshot
  await page.screenshot({ path: 'quiz-results-pcn.png', fullPage: true });
  console.log('\n📸 Screenshot saved to quiz-results-pcn.png');
  
  // Try to get page text
  const pageText = await page.evaluate(() => document.body?.innerText?.substring(0, 3000) || '');
  console.log('\n=== PAGE CONTENT ===');
  console.log(pageText);

  console.log('\nBrowser staying open. Press Ctrl+C to close.');
  await new Promise(() => {});
}

run().catch(err => { console.error('Fatal:', err); process.exit(1); });
