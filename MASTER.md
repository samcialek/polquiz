# MASTER.md — Project Map

## Directory Structure
```
polmodel-final/
├── prism-quiz-engine/          ← THE quiz engine (TypeScript)
│   ├── src/
│   │   ├── config/
│   │   │   ├── archetypes.ts       ← 124 archetype definitions (CANONICAL)
│   │   │   ├── nodes.ts            ← 14 node definitions
│   │   │   ├── categories.ts       ← EPS/AES categories
│   │   │   ├── questions.full.ts   ← Full question bank (~65 questions)
│   │   │   └── questions.representative.ts
│   │   ├── engine/
│   │   │   ├── nextQuestion.ts     ← Dynamic question selection (info gain)
│   │   │   ├── update.ts           ← Bayesian posterior update
│   │   │   ├── stopRule.ts         ← When to stop asking
│   │   │   ├── nodeStatus.ts       ← Per-node convergence tracking
│   │   │   ├── archetypeDistance.ts ← Distance between archetype signatures
│   │   │   ├── config.ts           ← Engine parameters
│   │   │   └── math.ts             ← Math utilities
│   │   ├── optimize/               ← Optimization & simulation tools
│   │   ├── state/
│   │   │   └── initialState.ts     ← Starting state factory
│   │   ├── types.ts                ← All type definitions
│   │   ├── browser.ts              ← Browser bundle entry
│   │   └── *Diagnostic.ts          ← Various diagnostic tools
│   ├── dist/                       ← Compiled output
│   ├── node_signatures.txt         ← Compact archetype signatures
│   └── package.json
├── gh-dashboard/                   ← Built dashboard/quiz HTML (OUTPUT, not source)
│   ├── prism-quiz.html             ← Quiz frontend
│   └── ...
├── docs/quiz/                      ← Older quiz versions & reference data
├── data/                           ← Data files
│   └── quiz_archetype_data.json    ← 132-archetype JSON (OLDER VERSION)
└── archive/                        ← Old versions, DO NOT USE as source of truth
```

## Quiz Flow
1. Initialize uniform priors over 124 archetypes
2. Ask 12 fixed screening questions (touch all clusters)
3. Score information gain for remaining questions
4. Select highest-gain question dynamically
5. User answers → Bayesian update of all 124 posteriors
6. Check stop rule (posterior concentration threshold)
7. Repeat 4-6 until stopped or budget exhausted (~65 questions max)
8. Report top archetype(s) with confidence

## Related Files (Outside This Repo)
- Full PRISM architecture doc: 5-layer model with 3 exogenous refraction layers
- Layer 1: Innate Temperament (6 nodes, latent)
- Layer 2: Crystallized Personality (6 nodes, observable)
- Layer 3: Political Disposition (14 nodes — THIS IS WHAT THE QUIZ MEASURES)
- Layer 4: Political Behavior (vote choice / regime compliance)
- Exogenous layers: F (formative), E (economic/political conditions), P (political architecture)
