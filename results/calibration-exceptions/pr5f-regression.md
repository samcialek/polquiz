# PR 5.F broad regression — current vs Option D

Date: 2026-04-29

Cells: 124 archetypes × 401 regimes = 49724

**Current**: 9 continuous nodes (MAT/CD/CU/MOR/PRO/COM/ZS/ONT_H/ONT_S), σ=2.0, asymmetric dysfunction, anti-multiplier.
**Option D**: 7 continuous (drops ZS/ONT_H) + AES lock-and-key, σ=1.765, AES_SCALE=2, asymmetric dysfunction, anti-multiplier.

## 1. Top-match drift

**Top-1 stability**: 46/124 archetypes keep same top regime (37.1%); 78 change.

**Top-3 overlap**: 3-overlap=16, 2-overlap=54, 1-overlap=38, 0-overlap=16.

**Top-5 overlap**: 5-overlap=7, 4-overlap=26, 3-overlap=41, <3=50.

### Top-1 changes (78)

| arch | name | current best | (cur score) | Option D best | (D score) |
|---|---|---|---|---|---|
| 003 | Consensus Redistributionist | Reconstruction/Consensus | 2.52 | Folkhem Peak | 1.96 |
| 005 | Pluralist Structuralist | Provisional Government / Liberation | 2.25 | Reunified Germany | 2.48 |
| 010 | Bread-and-Butter Progressive | Attlee/Consensus | 1.27 | Lost Decades | 0.99 |
| 013 | Radical Leveler | Late Castro/Special Period | 0.55 | Congress Dominance | 0.26 |
| 014 | Activist Progressive | Kirchnerismo/Crisis | 1.97 | Christian Democracy/Left | 2.04 |
| 015 | Moral Firebrand | Christian Democracy/Left | 0.40 | Late Castro/Special Period | 0.11 |
| 016 | Insurgent Equalizer | Brezhnev Stagnation | 1.54 | Late Castro/Special Period | 1.03 |
| 019 | Anarchist Mutualist | Lula/PT Era | 0.80 | Late Castro/Special Period | 0.53 |
| 020 | Grassroots Autonomist | Caetano/Revolution | 0.91 | Late Castro/Special Period | 0.54 |
| 021 | Principled Cosmopolitan | Quiet Revolution/Trudeau Sr. | 2.16 | Second Republic | 1.51 |
| 023 | Rights Cosmopolitan | Lula/PT Era | 0.91 | Second Republic | 0.94 |
| 025 | World-Minded Reformer | Cultural Revolution/Progressive | 1.96 | Nehruvian India | 1.35 |
| 026 | Cosmopolitan Pragmatist | New Labour/Blair | 1.97 | Modern Canada | 1.40 |
| 028 | Global Caretaker | Cultural Revolution/Progressive | 1.88 | Wilson/Heath | 1.38 |
| 031 | Planetary Steward | Folkhem Peak | 2.05 | Quiet Revolution/Trudeau Sr. | 1.25 |
| 032 | Hamiltonian Technocrat | Hanoverian / Glorious Revolution Settlement | 2.37 | Neoliberal Turn | 2.20 |
| 035 | Administrative Liberal | Quiet Revolution/Trudeau Sr. | 2.59 | Folkhem Peak | 2.10 |
| 036 | Institutional Optimizer | New Labour/Blair | 2.68 | Neoliberal Turn | 2.21 |
| 037 | Fabian Modernizer | Reconstruction/Consensus | 2.38 | Social Democratic Rise | 2.04 |
| 039 | Data-Driven Moderate | Velvet Transition / Federal Republic | 2.71 | Social Democratic Rise | 2.19 |
| 040 | Reform Engineer | Mulroney/Chretien | 2.43 | Neoliberal Turn | 1.99 |
| 045 | Rooted Social Reformer | Attlee/Consensus | 2.18 | Pillarization | 1.63 |
| 050 | Traditionalist Moralist | New Deal/WWII | 1.39 | WWII Britain | 0.83 |
| 051 | Systemic Redistributionist | Kadar Era | 1.88 | Brezhnev Stagnation | 1.40 |
| 053 | Consensus Builder | Second Republic Consensus | 2.84 | West Germany/Bonn Republic | 2.69 |
| 054 | Arbiter Moderate | Second Republic Consensus | 2.39 | Neoliberal Turn | 2.39 |
| 056 | Institutional Leftist | Attlee/Consensus | 2.35 | New Deal/WWII | 2.06 |
| 060 | Hinge Citizen | Democratic Consolidation | 2.66 | Metapolitefsi | 2.44 |
| 061 | Millian Liberal | Velvet Transition / Federal Republic | 1.84 | Post-Communist Romania | 1.57 |
| 062 | Meritocratic Liberal | Mulroney/Chretien | 2.45 | Modern Switzerland | 1.98 |
| 063 | Enterprise Pluralist | Velvet Transition / Federal Republic | 2.20 | Solidarity/Transition | 1.77 |
| 065 | Opportunity Liberal | PSOE/PP Democracy | 2.06 | Mandela/Mbeki | 2.01 |
| 067 | Free-Exchange Modernist | Velvet Transition / Federal Republic | 1.29 | Mulroney/Chretien | 0.67 |
| 069 | Bleeding-Heart Libertarian | Kemalist Republic | 0.54 | Independence/Gran Colombia | 0.75 |
| 070 | Burkean Steward | Frederickian Prussia | 2.49 | Dutch Republic in Crisis | 2.19 |
| 071 | Constitutional Conservative | Bourbon Reform Spain (Carlos III) | 2.46 | Joseon under King Jeongjo | 2.36 |
| 072 | Blackstone Conservative | Late Tokugawa Shogunate (Tanuma–Kansei) | 2.29 | Abe/Modern Japan | 2.09 |
| 073 | Civic Traditionalist | BJP/Shining India | 2.14 | Late Zand Dynasty | 1.89 |
| 074 | Responsible Conservative | Modern Austria | 2.46 | National Front | 2.20 |
| 076 | Fiscal Gradualist | Second Republic | 2.07 | Liberal Reform Era | 1.85 |
| 077 | Ordered Libertarian | Viceroyalty of Río de la Plata | 2.29 | French Indochina | 2.50 |
| 078 | Meritocratic Conservative | Dutch Republic in Crisis | 2.35 | Old Swiss Confederacy | 2.17 |
| 082 | Altar-and-Hearth Conservative | PiS Poland | 2.29 | Late Lê / Trịnh-Nguyễn Division / Tây Sơn | 1.95 |
| 084 | Civilizational Conservative | Fifth Republic Gaullist | 2.35 | Thonburi Kingdom of Taksin / Early Chakri | 2.17 |
| 085 | Customary Localist | Ancien Régime | 2.46 | Reaction/Late Tsarist | 1.98 |
| 086 | Duty Traditionalist | Josephine Habsburg Monarchy | 2.29 | Organic Work/Positivism | 1.93 |
| 087 | Continuity Conservative | Joseon under King Jeongjo | 2.38 | Late Tokugawa Shogunate (Tanuma–Kansei) | 2.04 |
| 088 | Gentle Traditionalist | Uribe/Santos/Peace | 2.41 | Organic Work/Positivism | 1.83 |
| 090 | Hobbesian Guardian | First Saudi State / Diriyah Emirate | 2.20 | Metternich System | 2.37 |
| 091 | Security Paternalist | Fifth Republic Gaullist | 2.08 | Metternich System | 2.00 |
| 092 | Partisan Tribalist | Bismarck Era | 2.35 | Metternich System | 2.31 |
| 097 | Authority Pragmatist | Confederation/Macdonald | 1.97 | German Confederation | 1.79 |
| 099 | Scarcity Populist | Saddam Hussein | 1.18 | Ceausescu | 1.33 |
| 101 | Embattled Majoritarian | Late Lê / Trịnh-Nguyễn Division / Tây Sơn | 2.25 | Military/Development | 1.55 |
| 108 | Passive Cynic | Mubarak | 2.01 | Mamluk Beys under Ottoman Suzerainty | 1.19 |
| 109 | Alienated Outsider | Sisi | 1.69 | Pahlavi Peak | 1.40 |
| 111 | Cosmopolitan Nonconformist | Caetano/Revolution | 1.32 | Lula/PT Era | 0.74 |
| 112 | Engaged Cosmopolitan | Wilson/Heath | 2.43 | Lula/PT Era | 2.34 |
| 113 | Disaffected Contrarian | Mubarak | 1.31 | Military/Development | 1.04 |
| 115 | Quietist | Revolutionary State | 2.14 | Sisi | 1.58 |
| 116 | Quiet Middle | Liberal Reform Era | 2.00 | Crisis/Realignment | 2.67 |
| 117 | Comfortable Bystander | High Growth | 1.89 | Populist Turn | 1.43 |
| 118 | Survival Pragmatist | Bismarck Era | 2.14 | Kadar Era | 1.85 |
| 119 | Apolitical Striver | Gustavian Sweden | 2.26 | Independence/Gran Colombia | 1.61 |
| 120 | Good Neighbor | West Germany/Bonn Republic | 2.26 | Reconstruction/Consensus | 1.94 |
| 121 | Spectator Citizen | PSOE/PP Democracy | 2.41 | Populist Turn | 2.58 |
| 124 | Latent Alarmist | Bismarck Era | 2.54 | Fifth Republic Gaullist | 1.79 |
| 125 | Reluctant Partisan | Laurier/Early 20th | 2.92 | SVP Rise | 2.27 |
| 128 | Loyal Democrat | Congress Dominance | 2.15 | Lula/PT Era | 2.02 |
| 129 | Loyal Republican | Viceroyalty of Río de la Plata | 2.81 | Jacksonian Democracy | 1.96 |
| 131 | Duty Voter | United Kingdom of Netherlands | 2.11 | Meiji | 1.50 |
| 132 | Negative Partisan | Mamluk Beys under Ottoman Suzerainty | 2.13 | Fifth Republic Gaullist | 1.33 |
| 134 | Progressive Civic Nationalist | Attlee/Consensus | 2.52 | Provisional Government / Liberation | 2.27 |
| 136 | Aspirational Traditionalist | Gustavian Sweden | 2.25 | Romanian Kingdom | 2.21 |
| 137 | Moral Crusader | Civil War/Bouteflika | 1.67 | Restoration/Risorgimento | 1.43 |
| 138 | Optimistic Challenger | Revolutionary Cuba | 1.88 | AMLO/Morena | 1.37 |
| 139 | Civic Assimilationist | Late Tokugawa Shogunate (Tanuma–Kansei) | 2.49 | Bourbon Reform Spain (Carlos III) | 2.27 |
| 140 | Market Green Modernist | Reunified Germany | 2.10 | Mulroney/Chretien | 2.14 |

## 2. Score distribution

| stat | current | Option D | delta |
|---|---|---|---|
| mean | -0.369 | -0.834 | -0.465 |
| median | -0.364 | -0.921 | -0.557 |
| p5 | -2.510 | -2.717 | -0.207 |
| p95 | 1.804 | 1.371 | -0.433 |
| min | -2.988 | -2.993 | — |
| max | 3.000 | 2.889 | — |

**Sign-flips:**
- Negative→Positive: 434 cells (0.87%)
- Positive→Negative: 5236 cells (10.53%)
- |Δ| > 1.0: 2102 cells (4.23%)

## 3. Sanity cases

| arch | regime | expected | current | Option D | Δ |
|---|---|---|---|---|---|
| 056 Institutional Leftist | New Deal/WWII (1933) | very positive | 2.17 | 2.06 | -0.11 |
| 056 Institutional Leftist | Folkhem Peak (1946) | very positive | 1.14 | 0.50 | -0.64 |
| 056 Institutional Leftist | Nazi Germany (1933) | very negative | -2.25 | -2.33 | -0.08 |
| 056 Institutional Leftist | Orban's Hungary (2010) | negative | -1.03 | -1.25 | -0.22 |
| 011 Jacobin Egalitarian | Stalin (1929) | positive (revolutionary leftist with Stalin) | -0.79 | -1.69 | -0.90 |
| 011 Jacobin Egalitarian | Mao Radical (1958) | positive | -1.76 | -2.37 | -0.61 |
| 085 Customary Localist | Orban's Hungary (2010) | very positive | 1.11 | 0.98 | -0.14 |
| 085 Customary Localist | Fascist Italy (1922) | positive | 1.09 | 0.94 | -0.15 |
| 085 Customary Localist | Folkhem Peak (1946) | very negative | -2.39 | -2.69 | -0.31 |
| 088 Gentle Traditionalist | West Germany/Bonn Republic (1949) | moderate positive (postwar conservative-friendly) | 1.15 | 0.45 | -0.71 |
| 089 Integral Traditionalist | Vichy France (1940) | positive (catholic traditionalist with Vichy) | 0.38 | 0.21 | -0.17 |
| 022 Pluralist Universalist | Folkhem Peak (1946) | positive | 0.43 | -0.53 | -0.96 |
| 022 Pluralist Universalist | Nazi Germany (1933) | very negative | -2.13 | -2.13 | -0.01 |
| 110 Principled Abstainer | West Germany/Bonn Republic (1949) | positive | -1.98 | -2.57 | -0.59 |
| 134 Progressive Civic Nationalist | Stalin (1929) | negative (tankie name doesn't match Stalin geometry) | -1.31 | -1.67 | -0.36 |
