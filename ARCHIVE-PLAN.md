# Archive Plan — Downloads Cleanup

## Summary
~150 loose PRISM/quiz files in `C:\Users\Sam\Downloads\` that are old development artifacts.
The canonical source is now `polmodel-final/prism-quiz-engine/` on laptop.

## ARCHIVE (move to `C:\Users\Sam\Downloads\archive\prism-legacy\`)

### Old Quiz HTML Versions (8 files)
- prism_dense_quiz.html → v7.html (all 8 versions)
- prism_complete_quiz.html
- quiz.html
- quiz-style-*.html (6 style variants)
- quiz-simulation-*.html (3 files)
- quiz-signal-diagnostic.html
- karen-prism-v8.html
- ARCHIVED-prism-comprehensive-quiz-v12.2.html

### Old Scorer Versions (superseded by quiz engine)
- prism_scorer_v153.js → v156.js, v156_sim.js
- prism_quiz_scorer.js

### Old Archetype Versions (superseded by archetypes.ts)
- prism_archetypes_153.js → 157.js
- prism_archetypes_v1_baseline.js → v10_*.js
- prism_archetypes_calibrated.js, _sim.js
- prism_archetypes_156_FORKED.js
- generate_all_archetype_data.js, _FORKED.js
- _generate_archetypes.js, _backup.js

### Fix/Patch Scripts (one-time use, done)
- apply_archetype_fixes.js → fixes9.js (9 files)
- fix_absorbed_archetypes.js
- fix_unreachable_archetypes.js
- rename_archetypes.js
- optimal_new_archetypes.js

### Iterative Create Scripts (26 versions!)
- create_archetype_files.js → v26.js (26 files)
- create_forked_archetypes.js

### Diagnostic Scripts (superseded by quiz engine diagnostics)
- analyze_prism_accuracy.js, _v2.js
- analyze_t2_archetypes.js
- archetype_accuracy_diagnostic.js
- archetype_diagnostic_test.js
- archetype_fidelity_diagnostic.js
- archetype_reachability_report.js
- archetype_state_space_analysis.js
- archetype_validation.js, _v2.js
- audit_archetypes.js
- comprehensive_archetype_analysis.js
- comprehensive_archetype_diagnostic.js
- deep_archetype_diagnostic.js
- manual_archetype_test.js
- validate_archetypes.js
- validate_prism_system.js
- test_quiz_*.js (3 files)
- archetype-responses.js
- quiz-filler.js
- build_quiz_data.js

### Diagnostic Results (output, not source)
- archetype_accuracy_results.json
- archetype_fidelity_diagnostic_results.json
- archetype_validation_results.json, _v2_results.json
- ARCHETYPE_RECOMMENDATIONS.json
- unmatched_archetypes.json
- prism_responses_2026-01-22-01-28-01.json
- PRISM_Full_Export_FORKED.json

### Old Reports & Visualizations
- archetype_diagnostic_report_v157.html, _enhanced.html
- archetype-diagnosis.html
- archetype-atlas-l3.html
- COMPREHENSIVE_ARCHETYPE_ANALYSIS.html
- l4_archetype_refraction.html
- prism_v12_2_atlas.html, _dag.html
- prism_v12_3_atlas.html
- prism_v12_distribution_report.html
- prism_v15_7_atlas.html
- prism_131_engine_report.html
- prism_132_engine_report.html
- prism_133_best_run_report.html
- prism_dense_distribution_report.html, _v2.html
- prism_l3_parentage.html
- prism_results.html
- quiz_simulation_output.html
- quiz_preference_analysis.html
- PRISM_v9_2_*.html (3 files)
- pdm-*.html (4 files)
- vizArchetypes.html
- combined_simulation_viz.html
- population_simulation_viz.html
- l4_visualization.html
- N11_*.html (3 files)
- response-mapping.html
- alignment-map-*.html (2 files)
- NEW_QUIZ_QUESTIONS.html

### Old Data Files
- quiz_l4_data.js
- archetype_behaviors.js
- build_l4_archetype_viz.js
- _export_archetypes_xlsx.js
- generate_archetype_recommendations.js
- generate_archetype_responses.js
- comprehensive_analysis.html

## KEEP (in Downloads, still potentially useful)
- prism_124_archetypes.html (just created today as reference)
- prism-quiz-engine/ folder (has the canonical quiz engine)
- data/quiz_archetype_data.json (reference, 132 version)
- docs/ folder (has some reference material)

## How to Execute
```powershell
# Create archive folder
New-Item -ItemType Directory -Force -Path "C:\Users\Sam\Downloads\archive\prism-legacy"

# Move files (run the move commands after reviewing)
```

Sam: Review this list. I can execute the moves when you say go.
