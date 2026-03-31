/**
 * Programmatic PRISM Quiz — Progressive Civic Nationalist
 * 
 * Feeds answers through the real engine as a "progressive civic nationalist":
 * - Pro-redistribution, pro-safety-net, but not socialist
 * - Civic nationalist: shared values > ethnic/cultural identity, pro-immigration with integration
 * - Proceduralist: process matters, institutions matter
 * - Engaged, informed, moderate-high salience
 * - Believes in progress, but knows it's fragile
 * - Values expertise and evidence, but also community voice
 * - Moral universalist leaning
 */

// Load the IIFE bundle via vm.createContext so `var PrismEngine` lands in the sandbox
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const bundlePath = path.join(__dirname, 'dist', 'prism-engine-bundle.js');
const bundleCode = fs.readFileSync(bundlePath, 'utf-8');

const ctx = vm.createContext({ console });
vm.runInContext(bundleCode, ctx);

const engine = ctx.PrismEngine;
if (!engine) {
  console.error('Failed to load PrismEngine from bundle');
  process.exit(1);
}

// Initialize
engine.initQuiz();
console.log('=== PRISM Quiz: Progressive Civic Nationalist ===\n');

// Define answers for a progressive civic nationalist persona
const ANSWERS = {
  // Q1: political_content_frequency — engaged but not obsessive
  political_content_frequency: 'most_days',
  
  // Q2: political_identity_centrality — moderately central
  political_identity_centrality: 55,
  
  // Q11: nyt_headline_click — drawn to data/science
  nyt_headline_click: 'weird_science',
  
  // Q3: inequality_causes_allocation — systemic + individual mix, lean systemic
  inequality_causes_allocation: {
    system_advantages: 35,
    family_background: 25,
    discrimination_bias: 20,
    effort_choices: 15,
    luck_random: 5
  },
  
  // Q4: bad_outcomes_blame_allocation
  bad_outcomes_blame_allocation: {
    powerful_incompetent: 30,
    powerful_selfish: 25,
    complex_forces: 30,
    random_luck: 10,
    ordinary_choices: 5
  },
  
  // Q5: controversial_speaker — allow with counterspeech (proceduralist)
  controversial_speaker: 'allow_with_counterspeech',
  
  // Q7: who_should_shape_a_law — ranking
  who_should_shape_a_law: ['organized_residents', 'researchers', 'elected_officials', 'community_deliberation', 'elders_religious', 'business_stakeholders'],
  
  // Q8: child_traits — pairwise
  child_traits: {
    'obedience_vs_self_reliance': 'self_reliance',
    'independence_vs_elders': 'independence'
  },
  
  // Q9: opponent_model_allocation — charitable view of opponents
  opponent_model_allocation: {
    legitimate_values: 35,
    misinformed: 30,
    bad_motives: 10,
    economic_interests: 25
  },
  
  // Q10: effective_leader_style
  effective_leader_style: 'expert_team',
  
  // Q6: politically_important_identities — ranking
  politically_important_identities: ['national_identity', 'class_identity', 'ideological_identity', 'ethnic_racial_identity', 'religious_identity'],
  
  // Q12: cultural_social_placement — progressive
  cultural_social_placement: 25,
  
  // cultural_social_salience — moderately important
  cultural_social_salience: 55,
  
  // domestic_vs_abroad_lives — lean toward more lives saved but conflicted
  domestic_vs_abroad_lives: 65,
  
  // guess_top_marginal_tax_rate
  guess_top_marginal_tax_rate: 37,
  
  // preferred_top_marginal_tax_rate — progressive, wants higher
  preferred_top_marginal_tax_rate: 55,
  
  // human_progress_salience — thinks about it often
  human_progress_salience: 70,
  
  // mainstream_media_accuracy_estimate — trusts mainstream media somewhat
  mainstream_media_accuracy_estimate: 72,
  
  // percent_groups_want_best_share_values — charitable toward fellow citizens
  percent_groups_want_best_share_values: 70,
  
  // rules_procedures_matter_salience — process matters a lot (civic)
  rules_procedures_matter_salience: 75,
  
  // opponents_matter_to_identity — not too tribal
  opponents_matter_to_identity: 30,
  
  // views_changed_in_10_years
  views_changed_in_10_years: 'gradual_progress',
  
  // social_progress_salience — cares deeply
  social_progress_salience: 80,
  
  // immigration_national_identity_salience — moderately important (civic nationalist)
  immigration_national_identity_salience: 60,
  
  // surveillance_enforcement_due_process_bundle — due process
  surveillance_enforcement_due_process_bundle: 'due_process_priority',
  
  // coalition_vs_principle — depends
  coalition_vs_principle: 'depends_on_issue',
  
  // politics_at_social_gatherings
  politics_at_social_gatherings: 'engage_carefully',
  
  // climate_energy_bundle — gradual transition
  climate_energy_bundle: 'gradual_transition',
  
  // university_admissions_approach — holistic
  university_admissions_approach: 'holistic_review',
  
  // criminal_justice_bundle — rehabilitation
  criminal_justice_bundle: 'rehabilitation_focus',
  
  // ceo_worker_pay_ratio — wants it lower (~50:1)
  ceo_worker_pay_ratio: 25,
  
  // human_progress_view — progress is real but fragile
  human_progress_view: 'gradual_progress',
  
  // criminal_trial_error_tradeoff — rather free guilty
  criminal_trial_error_tradeoff: 'rather_free_guilty',
  
  // vacation_new_vs_familiar — new place
  vacation_new_vs_familiar: 'new_place',
  
  // welfare_error_tradeoff — rather help undeserving than miss needy
  welfare_error_tradeoff: 'rather_help_undeserving',
  
  // mask_mandate_acceptability — accept
  mask_mandate_acceptability: 'accept_mandate',
  
  // information_control_error_tradeoff — allow, don't silence
  information_control_error_tradeoff: 'allow_fully',
  
  // trade_liberalization_effects — net positive but uneven
  trade_liberalization_effects: 'net_positive_but_uneven',
  
  // immigration_enforcement_error_tradeoff — rather not deport legal
  immigration_enforcement_error_tradeoff: 'deport_legal',
  
  // threats_to_america_external_internal — internal
  threats_to_america_external_internal: 'internal',
  
  // fda_speed_vs_safety — prioritize safety
  fda_speed_vs_safety: 'prioritize_speed',
  
  // stupid_workplace_rule_response — follow then advocate change
  stupid_workplace_rule_response: 'follow_then_advocate',
  
  // election_access_vs_security — disenfranchisement is worse
  election_access_vs_security: 'disenfranchise',
  
  // close_friends_voted_differently — uncomfortable but keep friendship
  close_friends_voted_differently: 'keep_friendship',
  
  // veil_of_ignorance_society_choice — safety net
  veil_of_ignorance_society_choice: 'safety_net_society',
  
  // what_changed_minds_through_history — evidence and argument
  what_changed_minds_through_history: 'evidence_and_argument',
  
  // political_conflict_with_close_others
  political_conflict_with_close_others: 'engage_carefully',
  
  // social_progress_view — real but contested
  social_progress_view: 'real_contested',
  
  // political_membership_criterion_rewrite — shared values (civic)
  political_membership_criterion_rewrite: 'shared_values',
  
  // parents_politics_growing_up
  parents_politics_growing_up: 'some_lib',
  
  // religion_in_upbringing
  religion_in_upbringing: 'moderate',
  
  // parents_political_engagement
  parents_political_engagement: 'somewhat',
  
  // caregiver_emotional_availability — warm
  caregiver_emotional_availability: 75,
  
  // neighborhood_safety_childhood
  neighborhood_safety_childhood: 'mostly_safe',
  
  // what_matters_more_in_leader — competence
  what_matters_more_in_leader: 'competence_record',
  
  // political_pitch_resonance — data driven
  political_pitch_resonance: 'data_driven',
  
  // movement_aesthetics_reaction — skeptical
  movement_aesthetics_reaction: 'sometimes_necessary',
  
  // engagement_motivations_top2 — civic duty + intellectual challenge
  engagement_motivations_top2: ['civic_duty', 'intellectual_challenge'],
  
  // what_changed_your_mind
  what_changed_your_mind: 'data_evidence',
  
  // factual_estimates_and_confidence — slider, give middle estimate
  factual_estimates_and_confidence: 50,
  
  // factory_closure_causes_ranking
  factory_closure_causes_ranking: ['global_competition', 'government_policy', 'automation', 'corporate_decisions', 'worker_choices'],
  
  // integration_expectations_rewrite — learn language + civic participation (civic nationalist)
  integration_expectations_rewrite: 'civic_participation',
  
  // best_worst_battery
  best_worst_battery: { best: 'fairness', worst: 'national_strength' },
  
  // political_frustration
  political_frustration: 'both_sides_broken',
  
  // party_culture_conflict_response
  party_culture_conflict_response: 'say_so_publicly',
  
  // community_fund_allocation — allocation
  community_fund_allocation: {
    modernize_infrastructure: 25,
    community_mutual_aid: 30,
    art_music: 15,
    market_based_development: 10,
    preserve_heritage: 20
  },
  
  // universal_vs_local_obligations
  universal_vs_local_obligations: 'global_obligations_first',
  
  // opponent_success_response
  opponent_success_response: 'maybe_good_outcome',
  
  // common_ground_salience — very important
  common_ground_salience: 80,
  
  // zero_sum_politics_view — slider, lean disagree
  zero_sum_politics_view: 35,
  
  // rhetoric_style_importance — somewhat important
  rhetoric_style_importance: 55,
  
  // inequality_solutions_ranking
  inequality_solutions_ranking: ['government_redistribution', 'strong_regulations', 'community_mutual_aid', 'charitable_giving', 'free_market_growth'],
  
  // culture_vs_diversity_scope — civic assimilation
  culture_vs_diversity_scope: 'civic_assimilation',
  
  // cross_party_marriage_comfort — comfortable
  cross_party_marriage_comfort: 'no_problem',
  
  // success_attribution — lean circumstances
  success_attribution: 35,
  
  // decision_making_style — slider, lean analysis
  decision_making_style: 30,
  
  // speaker_appeal
  speaker_appeal: 'deep_expertise',
  
  // expert_disagreement_reaction
  expert_disagreement_reaction: 'check_evidence',
  
  // political_attention_style
  political_attention_style: 'look_up_facts',
  
  // party_vs_cause_loyalty
  party_vs_cause_loyalty: 'cause_over_party',
  
  // openness_assimilation_closure — civic assimilation
  openness_assimilation_closure: 'civic_assimilation',
  
  // broken_politics_diagnosis
  broken_politics_diagnosis: 'civic_loss',
  
  // institutions_harden_into_domination — slider, mildly agree
  institutions_harden_into_domination: 55,
  
  // institutional_legitimacy_source — procedural rules
  institutional_legitimacy_source: 'procedural_rules',
};

// Run the quiz
let questionCount = 0;
const answeredIds = new Set();
let question = engine.getNextQuestion();

while (question && !engine.isComplete() && questionCount < 80) {
  // Safety: skip if we already answered this question (engine bug)
  if (answeredIds.has(question.id)) {
    console.log(`  ⚠ Already answered Q${question.id} (${question.promptShort}) — breaking to avoid infinite loop`);
    break;
  }
  
  questionCount++;
  const key = question.promptShort;
  
  // Find our answer
  let answer = ANSWERS[key];
  
  if (answer === undefined) {
    // Default fallbacks by type
    if (question.uiType === 'slider') {
      answer = 50;
    } else if (question.uiType === 'single_choice' && question.options && question.options.length > 0) {
      // Pick first option as fallback
      answer = question.options[0];
    } else if (question.uiType === 'allocation' && question.allocationBuckets) {
      const n = question.allocationBuckets.length;
      const each = Math.floor(100 / n);
      answer = {};
      question.allocationBuckets.forEach((b, i) => {
        answer[b] = i === 0 ? 100 - each * (n - 1) : each;
      });
    } else if (question.uiType === 'ranking' && question.rankingItems) {
      answer = question.rankingItems;
    } else if (question.uiType === 'pairwise' && question.pairIds) {
      answer = {};
      // Default to first option
    } else {
      console.log(`  ⚠ NO ANSWER for Q${question.id} (${key}) [${question.uiType}] — SKIPPING`);
      // Can't skip in engine, use first option
      if (question.options) answer = question.options[0];
      else { question = engine.getNextQuestion(); continue; }
    }
    console.log(`  [FALLBACK] Q${question.id}: ${key} → ${JSON.stringify(answer).substring(0, 60)}`);
  }
  
  // Submit
  try {
    engine.submitAnswer(question.id, answer);
    answeredIds.add(question.id);
  } catch (e) {
    console.log(`  ❌ ERROR on Q${question.id} (${key}): ${e.message}`);
    break;
  }
  
  // Show progress
  const progress = engine.getProgress();
  const top = progress.topArchetypes[0];
  console.log(`Q${questionCount} [${progress.phase}] ${key} → ${JSON.stringify(answer).substring(0, 50)} | Leader: ${top?.name} (${(top?.posterior * 100).toFixed(1)}%)`);
  
  // Get next
  question = engine.getNextQuestion();
}

// Final results
console.log('\n' + '='.repeat(70));
console.log('FINAL RESULTS');
console.log('='.repeat(70));

const results = engine.getResults();
console.log(`\nArchetype: ${results.match.name}`);
console.log(`Tier: ${results.match.tier}`);
console.log(`Confidence: ${(results.match.posterior * 100).toFixed(1)}%`);
console.log(`Questions answered: ${results.questionsAnswered}`);

if (results.family && results.family.isFamily) {
  console.log(`\nFamily: ${results.family.familyLabel}`);
  results.family.members.forEach(m => {
    console.log(`  - ${m.name}: ${(m.posterior * 100).toFixed(1)}%`);
  });
}

console.log('\nTop 5:');
results.top5.forEach((a, i) => {
  console.log(`  ${i + 1}. ${a.name} (${a.tier}) — ${(a.posterior * 100).toFixed(1)}% [dist: ${a.distance.toFixed(4)}]`);
});

// Show node state
const state = engine.getRespondentState();
if (state) {
  console.log('\n' + '-'.repeat(70));
  console.log('RESPONDENT NODE VALUES');
  console.log('-'.repeat(70));
  
  console.log('\nContinuous nodes (1-5 scale):');
  for (const [node, data] of Object.entries(state.continuous)) {
    const d = data;
    console.log(`  ${node}: position=${d.expectedPos.toFixed(2)} salience=${d.salience.toFixed(2)} (${d.touches} touches)`);
  }
  
  console.log('\nCategorical nodes:');
  for (const [node, data] of Object.entries(state.categorical)) {
    const d = data;
    console.log(`  ${node}: [${d.catDist.map(v => v.toFixed(3)).join(', ')}] salience=${d.salience.toFixed(2)} (${d.touches} touches)`);
  }
}
