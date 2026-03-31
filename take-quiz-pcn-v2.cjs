/**
 * PRISM Quiz v2 — Progressive Civic Nationalist
 * Force-feeds all answers through engine by iterating question IDs directly
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const bundleCode = fs.readFileSync(path.join(__dirname, 'dist', 'prism-engine-bundle.js'), 'utf-8');
const ctx = vm.createContext({ console, Set, Map });
vm.runInContext(bundleCode, ctx);
const engine = ctx.PrismEngine;

engine.initQuiz();
console.log('=== PRISM Quiz: Progressive Civic Nationalist ===\n');

// Get all question IDs and their defs
const allIds = engine.getQuestionIds();
console.log(`Engine has ${allIds.length} questions, ${engine.getArchetypeCount()} archetypes\n`);

// Map promptShort → answer for our progressive civic nationalist
const ANSWERS = {
  political_content_frequency: 'most_days',
  political_identity_centrality: 55,
  nyt_headline_click: 'weird_science',
  inequality_causes_allocation: { system_advantages: 35, family_background: 25, discrimination_bias: 20, effort_choices: 15, luck_random: 5 },
  bad_outcomes_blame_allocation: { powerful_incompetent: 30, powerful_selfish: 25, complex_forces: 30, random_luck: 10, ordinary_choices: 5 },
  controversial_speaker: 'allow_with_counterspeech',
  who_should_shape_a_law: ['organized_residents', 'researchers', 'elected_officials', 'community_deliberation', 'elders_religious', 'business_stakeholders'],
  child_traits: { 'obedience_vs_self_reliance': 'self_reliance', 'independence_vs_elders': 'independence' },
  opponent_model_allocation: { legitimate_values: 35, misinformed: 30, bad_motives: 10, economic_interests: 25 },
  effective_leader_style: 'expert_team',
  politically_important_identities: ['national_identity', 'class_identity', 'ideological_identity', 'ethnic_racial_identity', 'religious_identity'],
  cultural_social_placement: 25,
  cultural_social_salience: 55,
  domestic_vs_abroad_lives: 65,
  guess_top_marginal_tax_rate: 37,
  preferred_top_marginal_tax_rate: 55,
  human_progress_salience: 70,
  mainstream_media_accuracy_estimate: 72,
  percent_groups_want_best_share_values: 70,
  rules_procedures_matter_salience: 75,
  opponents_matter_to_identity: 30,
  views_changed_in_10_years: 'gradual_progress',
  social_progress_salience: 80,
  immigration_national_identity_salience: 60,
  surveillance_enforcement_due_process_bundle: 'due_process_priority',
  coalition_vs_principle: 'depends_on_issue',
  politics_at_social_gatherings: 'engage_carefully',
  climate_energy_bundle: 'gradual_transition',
  university_admissions_approach: 'holistic_review',
  criminal_justice_bundle: 'rehabilitation_focus',
  ceo_worker_pay_ratio: 25,
  human_progress_view: 'gradual_progress',
  criminal_trial_error_tradeoff: 'rather_free_guilty',
  vacation_new_vs_familiar: 'new_place',
  welfare_error_tradeoff: 'rather_help_undeserving',
  mask_mandate_acceptability: 'accept_mandate',
  information_control_error_tradeoff: 'allow_fully',
  trade_liberalization_effects: 'net_positive_but_uneven',
  immigration_enforcement_error_tradeoff: 'deport_legal',
  threats_to_america_external_internal: 'internal',
  fda_speed_vs_safety: 'prioritize_speed',
  stupid_workplace_rule_response: 'follow_then_advocate',
  election_access_vs_security: 'disenfranchise',
  close_friends_voted_differently: 'keep_friendship',
  veil_of_ignorance_society_choice: 'safety_net_society',
  what_changed_minds_through_history: 'evidence_and_argument',
  political_conflict_with_close_others: 'engage_carefully',
  social_progress_view: 'real_contested',
  political_membership_criterion_rewrite: 'shared_values',
  parents_politics_growing_up: 'some_lib',
  religion_in_upbringing: 'moderate',
  parents_political_engagement: 'somewhat',
  caregiver_emotional_availability: 75,
  neighborhood_safety_childhood: 'mostly_safe',
  what_matters_more_in_leader: 'competence_record',
  political_pitch_resonance: 'data_driven',
  movement_aesthetics_reaction: 'sometimes_necessary',
  engagement_motivations_top2: ['civic_duty', 'intellectual_challenge'],
  what_changed_your_mind: 'data_evidence',
  factual_estimates_and_confidence: 50,
  factory_closure_causes_ranking: ['global_competition', 'government_policy', 'automation', 'corporate_decisions', 'worker_choices'],
  integration_expectations_rewrite: 'civic_participation',
  best_worst_battery: { best: 'fairness', worst: 'national_strength' },
  political_frustration: 'both_sides_broken',
  party_culture_conflict_response: 'say_so_publicly',
  community_fund_allocation: { modernize_infrastructure: 25, community_mutual_aid: 30, art_music: 15, market_based_development: 10, preserve_heritage: 20 },
  universal_vs_local_obligations: 'global_obligations_first',
  opponent_success_response: 'maybe_good_outcome',
  common_ground_salience: 80,
  zero_sum_politics_view: 35,
  rhetoric_style_importance: 55,
  inequality_solutions_ranking: ['government_redistribution', 'strong_regulations', 'community_mutual_aid', 'charitable_giving', 'free_market_growth'],
  culture_vs_diversity_scope: 'civic_assimilation',
  cross_party_marriage_comfort: 'no_problem',
  success_attribution: 35,
  decision_making_style: 30,
  speaker_appeal: 'deep_expertise',
  expert_disagreement_reaction: 'check_evidence',
  political_attention_style: 'look_up_facts',
  party_vs_cause_loyalty: 'cause_over_party',
  openness_assimilation_closure: 'civic_assimilation',
  broken_politics_diagnosis: 'civic_loss',
  institutions_harden_into_domination: 55,
  institutional_legitimacy_source: 'procedural_rules',
};

// Iterate through ALL questions and submit answers
let answered = 0;
let skipped = 0;

for (const qid of allIds) {
  const qdef = engine.getQuestionDef(qid);
  if (!qdef) continue;
  
  const key = qdef.promptShort;
  let answer = ANSWERS[key];
  
  if (answer === undefined) {
    // Auto-generate fallback by type
    const qq = engine.getNextQuestion(); // just to get the quiz question format
    if (qdef.uiType === 'slider') {
      answer = 50;
    } else if (qdef.uiType === 'single_choice' && qdef.optionEvidence) {
      answer = Object.keys(qdef.optionEvidence)[0];
    } else if (qdef.uiType === 'allocation' && qdef.allocationMap) {
      const buckets = Object.keys(qdef.allocationMap);
      const each = Math.floor(100 / buckets.length);
      answer = {};
      buckets.forEach((b, i) => { answer[b] = i === 0 ? 100 - each * (buckets.length - 1) : each; });
    } else if (qdef.uiType === 'ranking' && qdef.rankingMap) {
      answer = Object.keys(qdef.rankingMap);
    } else if (qdef.uiType === 'pairwise' && qdef.pairMaps) {
      answer = {};
      for (const pairId of Object.keys(qdef.pairMaps)) {
        const opts = Object.keys(qdef.pairMaps[pairId]);
        answer[pairId] = opts[0];
      }
    } else if (qdef.uiType === 'best_worst') {
      const items = qdef.bestWorstMap ? Object.keys(qdef.bestWorstMap) : (qdef.rankingMap ? Object.keys(qdef.rankingMap) : []);
      if (items.length >= 2) answer = { best: items[0], worst: items[items.length - 1] };
    } else if (qdef.uiType === 'multi' && qdef.optionEvidence) {
      const opts = Object.keys(qdef.optionEvidence);
      answer = opts.slice(0, 2);
    }
    
    if (answer === undefined) {
      skipped++;
      continue;
    }
  }
  
  try {
    engine.submitAnswer(qid, answer);
    answered++;
    
    // Progress every 5 questions
    if (answered % 5 === 0 || answered <= 16) {
      const progress = engine.getProgress();
      const top = progress.topArchetypes[0];
      console.log(`Q${answered} [${progress.phase}] ${key} → Leader: ${top?.name} (${(top?.posterior * 100).toFixed(1)}%)`);
    }
  } catch (e) {
    console.log(`  ❌ Q${qid} (${key}): ${e.message}`);
    skipped++;
  }
}

console.log(`\nAnswered: ${answered}, Skipped: ${skipped}`);

// Final results
console.log('\n' + '='.repeat(70));
console.log('FINAL RESULTS');
console.log('='.repeat(70));

const results = engine.getResults();
console.log(`\n🏆 Archetype: ${results.match.name}`);
console.log(`   Tier: ${results.match.tier}`);
console.log(`   Confidence: ${(results.match.posterior * 100).toFixed(1)}%`);
console.log(`   Questions answered: ${results.questionsAnswered}`);

if (results.family && results.family.isFamily) {
  console.log(`\n👥 Family: ${results.family.familyLabel}`);
  results.family.members.forEach(m => {
    console.log(`   - ${m.name}: ${(m.posterior * 100).toFixed(1)}%`);
  });
}

console.log('\n📊 Top 10:');
const sorted = Object.entries(results.top5.length ? {} : {});
// Get top 10 from getResults — but it only gives top 5, so let's show those
results.top5.forEach((a, i) => {
  console.log(`   ${i + 1}. ${a.name} (${a.tier}) — ${(a.posterior * 100).toFixed(1)}% [dist: ${a.distance.toFixed(4)}]`);
});

// Node state
const state = engine.getRespondentState();
if (state) {
  console.log('\n' + '-'.repeat(70));
  console.log('RESPONDENT PROFILE (14 dimensions)');
  console.log('-'.repeat(70));
  
  const nodeNames = {
    MAT: 'Material Distribution',
    CD: 'Cultural Disposition', 
    CU: 'Cultural Universalism',
    MOR: 'Moral Circle',
    PRO: 'Proceduralism',
    COM: 'Compromise',
    ZS: 'Zero-Sum Thinking',
    ONT_H: 'Human Progress',
    ONT_S: 'System Critique',
    PF: 'Partisan Feeling',
    TRB: 'Tribalism',
    ENG: 'Political Engagement',
    EPS: 'Epistemic Style',
    AES: 'Aesthetic Style'
  };
  
  console.log('\nContinuous nodes (1=left pole, 5=right pole):');
  for (const [node, data] of Object.entries(state.continuous)) {
    const d = data;
    const name = nodeNames[node] || node;
    const bar = '█'.repeat(Math.round(d.expectedPos * 4)) + '░'.repeat(20 - Math.round(d.expectedPos * 4));
    console.log(`  ${node.padEnd(6)} ${name.padEnd(25)} ${d.expectedPos.toFixed(2)} ${bar} (sal: ${d.salience.toFixed(1)}, ${d.touches}t)`);
  }
  
  console.log('\nCategorical nodes:');
  for (const [node, data] of Object.entries(state.categorical)) {
    const d = data;
    const name = nodeNames[node] || node;
    const maxIdx = d.catDist.indexOf(Math.max(...d.catDist));
    console.log(`  ${node.padEnd(6)} ${name.padEnd(25)} dominant=#${maxIdx} (${(d.catDist[maxIdx] * 100).toFixed(0)}%) sal: ${d.salience.toFixed(1)} (${d.touches}t)`);
  }
}
