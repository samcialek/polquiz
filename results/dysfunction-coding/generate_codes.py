"""Generate dysfunction codes for all 541 regime entries.

Coding rubric: 1=stable+effective, 2=mostly stable, 3=mid-functional with real problems,
4=significant dysfunction, 5=chaotic/predatory/failed.

Distribution targets: ~60% at 1-2, ~30% at 3, ~8% at 4, ~2% at 5.
"""
import json
import os

INPUT = r"C:\Users\Sam\Desktop\polmodel-clean\output\live-data\regimes.json"
OUTPUT = r"C:\Users\Sam\Desktop\polmodel-clean\results\dysfunction-coding\dysfunction-codes.json"

# Codes keyed by (country, regime_name, start) -> (dysfunction, rationale)
# Built by reading every era description and applying the rubric conservatively.
CODES = {
    # === United Kingdom ===
    ("United Kingdom", "Georgian Britain", 1789): (2, "Aristocratic constitutional monarchy with functioning Parliament; harsh repression of radicals (Six Acts) but routine peaceful succession and an effective wartime state."),
    ("United Kingdom", "Reform Era", 1820): (2, "Functioning constitutional monarchy passing major Reform Act (1832) and Corn Law repeal through orderly parliamentary politics; Chartism contained without state collapse."),
    ("United Kingdom", "Victorian Peak", 1849): (1, "Stable constitutional monarchy at the height of British power; competent bureaucracy, peaceful party alternation, no large-scale internal violence."),
    ("United Kingdom", "Late Victorian/Edwardian", 1875): (1, "Mature constitutional democracy with effective state, expanding franchise and welfare politics, peaceful political competition."),
    ("United Kingdom", "WWI & Lloyd George", 1914): (2, "Functioning wartime democracy under enormous strain; Easter Rising and Irish independence war localized; Westminster institutions held."),
    ("United Kingdom", "Interwar", 1923): (2, "Routine democratic alternation, General Strike of 1926 contained, mass unemployment but no breakdown of governance."),
    ("United Kingdom", "WWII Britain", 1939): (2, "Functioning wartime parliamentary democracy with coalition government; total mobilization without authoritarian collapse."),
    ("United Kingdom", "Attlee/Consensus", 1946): (1, "Stable postwar parliamentary democracy building NHS and welfare state through routine elections; 'Butskellite consensus' epitomizes effective governance."),
    ("United Kingdom", "Wilson/Heath", 1965): (2, "Functioning democracy under stagflation and union militancy; Winter of Discontent and Northern Ireland Troubles strained but did not break the state."),
    ("United Kingdom", "Thatcher Era", 1979): (2, "Stable parliamentary democracy through contentious privatization and miners' strike; Falklands War a controlled foreign operation."),
    ("United Kingdom", "New Labour/Blair", 1991): (1, "Stable parliamentary democracy with devolution to Scotland/Wales, Good Friday Agreement, and routine elections."),
    ("United Kingdom", "Coalition Austerity UK", 2010): (2, "Functioning coalition government navigating austerity and 2014 Scottish referendum through routine constitutional politics."),
    ("United Kingdom", "Brexit-era UK", 2016): (3, "Five PMs in eight years, Truss budget crisis (2022), record stagnation, deep partisan disorder; institutions held but frequent leadership chaos."),
    ("United Kingdom", "Starmer Restoration UK", 2024): (2, "Routine post-election Labour government navigating fiscal constraints and Reform UK challenge; Westminster institutions functioning."),

    # === France ===
    ("France", "Ancien Regime remnant", 1789): (3, "Fiscal collapse, fall of the Bastille, dissolution of absolute monarchy; brief constitutional monarchy experiment unstable but bounded transitional period."),
    ("France", "French Revolution", 1792): (5, "Reign of Terror, mass executions, Vendée massacres, government coup cycle, civil war, abolition of feudalism in revolutionary chaos."),
    ("France", "Napoleonic Empire", 1800): (2, "Centralized authoritarian state with Code Napoleon and effective bureaucracy; constant warfare but consistently effective domestic governance."),
    ("France", "Restoration", 1815): (2, "Restored Bourbon constitutional monarchy with limited charter; Ultra-royalist tensions but functioning state."),
    ("France", "July Monarchy", 1830): (2, "Bourgeois constitutional monarchy; narrow franchise but functioning industrial economy and stable governance until 1848."),
    ("France", "Second Republic", 1848): (3, "Brief republic with universal male suffrage interrupted by June Days insurrection; political instability culminating in Louis-Napoleon's coup."),
    ("France", "Second Empire", 1852): (2, "Authoritarian-modernizing empire with effective administration, Haussmann reconstruction; Franco-Prussian defeat ended it but governance was competent."),
    ("France", "Third Republic Early", 1871): (2, "Born of Paris Commune bloodshed; Dreyfus Affair polarization contained within functioning parliamentary republic with effective secular reforms."),
    ("France", "Third Republic Late", 1900): (2, "Functioning democracy with rapid government turnover (interwar), Popular Front polarization; institutions held until 1940 foreign-occupation collapse."),
    ("France", "Vichy France", 1940): (4, "Collaborationist authoritarian regime under foreign occupation, Jewish deportations, severe wartime dysfunction; not state-directed mass killing on Nazi scale."),
    ("France", "Fourth Republic", 1946): (3, "Chronic instability with 21 PMs in 12 years, ending in Algerian crisis collapse; functioning rebuilt economy but governance fragmented."),
    ("France", "Fifth Republic Gaullist", 1958): (1, "Stable presidential republic; May 1968 contained without collapse; effective dirigiste economic governance."),
    ("France", "Mitterrand Era", 1981): (1, "Routine presidential democracy with cohabitations; tournant de la rigueur, Maastricht ratified, normal political competition."),
    ("France", "Chirac-Sarkozy Right", 1995): (2, "Stable democracy navigating euro transition, banlieue riots, EU constitution rejection; functioning institutions throughout."),
    ("France", "Hollande Socialist France", 2012): (2, "Functioning democracy through Charlie Hebdo and Bataclan attacks; low approval but routine governance."),
    ("France", "Macron Centrist Disruption", 2017): (3, "Gilets jaunes, pension protests, 2024 snap-election fragmentation, deep political polarization; institutions functioning but high contention."),

    # === Germany/Prussia ===
    ("Germany/Prussia", "Prussian Reform Era", 1789): (2, "Effective Stein-Hardenberg reforms after Jena defeat; competent state-building under wartime stress."),
    ("Germany/Prussia", "German Confederation", 1815): (2, "Metternich's conservative order with effective administrative state, censorship and surveillance but routine governance and no major violence."),
    ("Germany/Prussia", "1848 Revolution", 1848): (3, "Frankfurt Parliament collapse, military reconquest of revolutionary cities, brief constitutional disorder bounded to two years before Prussian state restored order."),
    ("Germany/Prussia", "Bismarck Era", 1850): (1, "Highly effective Prussian/German state under Bismarck — 'blood and iron' unification, pioneering social insurance, Kulturkampf managed without breakdown."),
    ("Germany/Prussia", "Wilhelmine", 1891): (2, "Effective imperial state with mass SPD politics, rapid industrialization, Weltpolitik; rising tensions but functioning institutions."),
    ("Germany/Prussia", "WWI Germany", 1914): (3, "Hindenburg-Ludendorff military dictatorship, severe home-front deprivation, ending in revolution and Kaiser's abdication."),
    ("Germany/Prussia", "Weimar Republic", 1919): (4, "Hyperinflation 1923, paramilitary street violence, political assassinations, partisan fragmentation, presidential emergency rule, Nazi/Communist insurgency by 1932."),
    ("Germany/Prussia", "Nazi Germany", 1933): (5, "Totalitarian racial state, Holocaust, world war of aggression, complete destruction of democratic institutions, genocidal mass murder."),
    ("Germany/Prussia", "Occupied Germany", 1945): (2, "Postwar zone of occupation under Allied military government effectively rebuilding state from ruins, denazification, Cold War split looming."),
    ("Germany/Prussia", "West Germany/Bonn Republic", 1949): (1, "Exceptionally stable postwar democracy, Wirtschaftswunder, strong constitutional protections, effective consensus governance."),
    ("Germany/Prussia", "East Germany/DDR", 1949): (2, "Soviet-backed authoritarian state with Stasi surveillance and ideological conformity; long stable Soviet-bloc governance with economic stagnation."),
    ("Germany/Prussia", "Kohl-Schröder Reunification", 1990): (1, "Stable reunified democracy absorbing East Germany, anchoring Maastricht, effective Hartz/Agenda 2010 reforms through routine politics."),
    ("Germany/Prussia", "Merkel-era Germany", 2005): (1, "Stable consensus democracy navigating financial, eurozone, refugee crises through grand coalitions; high institutional capacity."),
    ("Germany/Prussia", "Post-Merkel Coalition Germany", 2021): (2, "Traffic-light coalition collapse, AfD surge, energy shock and Zeitenwende, but routine 2025 election and CDU return; institutions functioning."),

    # === Russia/USSR ===
    ("Russia/USSR", "Tsarist Russia Late Catherine/Alexander I", 1789): (2, "Functioning autocracy with serfdom intact, oscillating reform/reaction, effective Napoleonic-era resistance; stable imperial governance."),
    ("Russia/USSR", "Nicholas I", 1826): (2, "Repressive but effective autocracy, Decembrist revolt crushed, censorship and military rule, stable serfdom-based governance."),
    ("Russia/USSR", "Great Reforms", 1856): (2, "Effective top-down reforms — emancipation, zemstva, judiciary; some terrorism but functioning state."),
    ("Russia/USSR", "Reaction/Late Tsarist", 1882): (2, "Reactionary autocracy with Russification, pogroms, rapid industrialization under Witte; effective if illiberal state."),
    ("Russia/USSR", "Revolution Era", 1905): (4, "1905 Revolution forces Duma, WWI catastrophe, regime collapse by 1917; severe instability across the period."),
    ("Russia/USSR", "Soviet Early/Lenin", 1918): (4, "Civil war 1918-21 (millions dead), war communism collapse, mass terror, 1921 famine, then NEP stabilization 1921-28; severe but partial bundled period."),
    ("Russia/USSR", "Stalin", 1929): (4, "Forced collectivization, Holodomor (millions dead), Great Purges, Gulag system, but state was ferociously operational; not collapsed despite massive predation."),
    ("Russia/USSR", "Khrushchev Thaw", 1954): (2, "Functional Soviet state, partial de-Stalinization, space race, Hungary intervention but no internal collapse."),
    ("Russia/USSR", "Brezhnev Stagnation", 1965): (2, "Stable but stagnant Soviet state, dissident movement contained, Afghanistan war and Prague Spring suppression external; internal governance functional."),
    ("Russia/USSR", "Gorbachev/Collapse", 1985): (4, "Glasnost/perestroika unleashing centrifugal forces, ethnic violence in periphery, economic collapse, USSR dissolution by 1991."),
    ("Russia/USSR", "Yeltsin", 1992): (5, "Shock-therapy collapse, oligarchic asset stripping, 1993 constitutional crisis (tanks shell parliament), Chechen wars, 1998 financial collapse — genuinely chaotic state failure."),
    ("Russia/USSR", "Putin Stabilization", 2000): (2, "Managed-democracy authoritarianism, oligarch-taming, Khodorkovsky imprisoned, effective restoration of state capacity; stable if illiberal regime."),
    ("Russia/USSR", "Tandem/Reset Era", 2008): (2, "Continued managed-democracy authoritarianism with Bolotnaya protests; stable if illiberal state."),
    ("Russia/USSR", "Conservative-Authoritarian Turn", 2012): (3, "Crimea annexation, Donbas war, Navalny suppression, Memorial closure, anti-LGBT laws; authoritarian consolidation but state operational."),
    ("Russia/USSR", "Wartime Russia", 2022): (4, "Wartime mobilization state, Wagner mutiny, sanctions, draft, criminalization of dissent, mass emigration — significant dysfunction but state operational."),

    # === Spain ===
    ("Spain", "Bourbon Spain/Napoleonic", 1789): (3, "Napoleonic invasion and guerrilla war; foreign occupation severe but Bourbon order restored 1813-14, transitional rather than collapsed."),
    ("Spain", "Liberal-Absolutist struggle", 1814): (3, "Ferdinand VII's absolutism reversal, Riego revolt, Carlist succession crisis with civil violence; functional but oscillating state."),
    ("Spain", "Isabella/Moderate Monarchy", 1834): (3, "Moderate liberal consolidation through pronunciamientos, desamortización, slow modernization; coup-prone but functional."),
    ("Spain", "Sexenio/Restoration", 1869): (2, "First Republic brief, then Cánovas's 'turno pacífico' managed elections delivering stability through exclusion of workers and regionalists."),
    ("Spain", "Crisis/Primo", 1898): (3, "Restoration system delegitimized, Primo de Rivera dictatorship 1923-30, military interventionism, labor unrest; dysfunction but state continues."),
    ("Spain", "Second Republic", 1931): (3, "Intense polarization, military and clerical opposition, 1934 Asturias revolt; democratic state functioned until 1936 civil war outbreak."),
    ("Spain", "Civil War/Franco", 1936): (4, "Civil war (500,000+ dead), Franco's mass repression, autarkic isolation, postwar famine, brutal early Francoism; state operational but predatory."),
    ("Spain", "Late Franco", 1960): (2, "Stable authoritarian regime with Opus Dei technocrats, economic miracle, gradual opening; effective economic governance, political repression."),
    ("Spain", "Transition", 1976): (2, "Negotiated transition to democracy via consenso, 1978 Constitution, 1981 coup attempt failed; remarkable peaceful democratization."),
    ("Spain", "PSOE/PP Democracy", 1983): (1, "Stable parliamentary democracy, EU accession, rapid growth and modernization through routine elections."),
    ("Spain", "Crisis Spain", 2008): (2, "Financial crisis, 2017 Catalan independence crisis, Indignados protests, two-party fragmentation; institutions held throughout."),

    # === Italy ===
    ("Italy", "Italian States/Napoleonic", 1789): (2, "Napoleonic invasion sweeping away old states, satellite Jacobin republics and kingdoms; functional French-aligned governance."),
    ("Italy", "Restoration/Risorgimento", 1815): (2, "Restoration of Italian states, then Risorgimento culminating in 1861 unification through wars of consolidation; bounded transitional violence within stable states."),
    ("Italy", "Liberal Italy", 1861): (2, "Unified state with Southern Question, mass emigration, transformismo politics, Giolitti-era democratization; functioning democracy."),
    ("Italy", "WWI Italy/Crisis", 1914): (3, "WWI mobilization, mutilated victory, biennio rosso factory occupations, liberal state weakened, ending in 1922 fascist seizure; functional but degrading."),
    ("Italy", "Fascist Italy", 1922): (4, "Totalitarian fascist regime, Ethiopia/Albania aggression, alliance with Nazi Germany, military disaster, civil war by 1943; severe dysfunction."),
    ("Italy", "Post-war Republic", 1946): (2, "Christian Democracy dominance, economic miracle, PCI excluded but functional parliamentary politics; party-stability dysfunction but state worked."),
    ("Italy", "Years of Lead", 1969): (3, "Left-right terrorism, Aldo Moro kidnapping, strategy of tension, political violence; functional democracy under stress."),
    ("Italy", "Craxi/First Republic End", 1984): (2, "Tangentopoli corruption exposed, Mani Pulite destroying party system through judicial process; functional state through legitimacy crisis."),
    ("Italy", "Second Republic", 1994): (2, "Berlusconi-era democracy with low growth, high debt; eurozone membership, routine alternation; functioning but stagnant."),
    ("Italy", "Populist Italy", 2013): (2, "Five Star, League, Brothers of Italy disrupting politics; routine elections, Meloni government 2022; institutions functioning."),

    # === Austria/Austria-Hungary ===
    ("Austria/Austria-Hungary", "Habsburg Enlightened Absolutism", 1789): (2, "Functioning enlightened-absolutist state through Napoleonic Wars; effective wartime mobilization."),
    ("Austria/Austria-Hungary", "Metternich System", 1815): (2, "Effective conservative European order; censorship and secret police but routine multinational governance."),
    ("Austria/Austria-Hungary", "1848/Neo-Absolutism", 1848): (2, "1848 revolution crushed by force, Bach centralized absolutism with effective bureaucratic state-building; defeat at Königgrätz 1866 was external not internal."),
    ("Austria/Austria-Hungary", "Austria-Hungary Dual Monarchy", 1867): (2, "Functioning dual constitutional monarchy managing nationalities, Magyar autonomy, growing Pan-Slavism but routine governance."),
    ("Austria/Austria-Hungary", "WWI/Collapse", 1914): (4, "Multinational empire collapsed in WWI, military defeat, ethnic fragmentation; Habsburg dynasty ended after six centuries."),
    ("Austria/Austria-Hungary", "First Republic", 1919): (3, "Polarized republic with Red Vienna vs Christian Social, paramilitary violence eroding democracy, ending in Austrofascism 1934."),
    ("Austria/Austria-Hungary", "Austrofascism/Anschluss", 1934): (4, "Dollfuss's authoritarian regime, civil war 1934, Nazi Anschluss 1938, participation in Holocaust; severe dysfunction during Nazi period."),
    ("Austria/Austria-Hungary", "Second Republic Consensus", 1945): (1, "Exceptional consensus democracy, Sozialpartnerschaft, neutrality, Proporz; one of Europe's most stable polities."),
    ("Austria/Austria-Hungary", "Grand Coalition Austria", 1987): (1, "Stable grand-coalition democracy through EU accession; routine politics, effective state."),
    ("Austria/Austria-Hungary", "FPÖ Coalition Era", 2000): (2, "Schüssel ÖVP-FPÖ coalition triggered EU sanctions, populist pressure but functional democracy with regular alternation."),
    ("Austria/Austria-Hungary", "Kurz/ÖVP-Green Austria", 2017): (2, "Kurz coalitions, Ibiza scandal, FPÖ rise to first place, three-party firewall; institutions functioning."),

    # === Ottoman Empire/Turkey ===
    ("Ottoman Empire/Turkey", "Late Ottoman", 1789): (3, "Selim III's reforms blocked, Janissary deposing him, mounting Russian pressure; weakening empire."),
    ("Ottoman Empire/Turkey", "Tanzimat", 1808): (2, "Tanzimat reforms modernizing law, administration, education; effective if uneven imperial state-building."),
    ("Ottoman Empire/Turkey", "Hamidian Era", 1877): (3, "Abdul Hamid II's autocracy with Hamidian massacres of Armenians (~100K dead), suspended constitution; effective if repressive long-running governance."),
    ("Ottoman Empire/Turkey", "Young Turks/WWI", 1908): (4, "Authoritarian Turkish nationalism, WWI on losing side, Armenian Genocide 1915 (1.5M+ dead), empire dissolved; severe genocidal predation but state operated through 1918."),
    ("Ottoman Empire/Turkey", "Kemalist Republic", 1919): (2, "Single-party authoritarian modernization, abolished caliphate, top-down westernization; effective revolutionary state-building."),
    ("Ottoman Empire/Turkey", "Multi-party Turkey", 1938): (2, "Transition to multi-party democracy 1950, peaceful Demokrat Party victory; functional state."),
    ("Ottoman Empire/Turkey", "Coup/Instability Era", 1960): (3, "Three coups (1960, 1971, 1980), thousands killed in left-right political violence, military tutelage; coup-prone but state continued."),
    ("Ottoman Empire/Turkey", "Ozal/Secular Republic", 1980): (3, "Özal liberalization, military tutelage continued, Kurdish PKK conflict; functional but coup-shadowed."),
    ("Ottoman Empire/Turkey", "AKP Reformist Period", 2002): (2, "AKP reformist phase, EU-oriented democratization, military subordination via trials, broad coalition; effective governance."),
    ("Ottoman Empire/Turkey", "Authoritarian Consolidation", 2013): (3, "Gezi crackdown, 2016 coup attempt and mass purges, lira crisis by decree, presidential system; authoritarian but functional."),

    # === Poland ===
    ("Poland", "Partition Era", 1789): (3, "Poland erased from map by Third Partition; lands under stable Russian/Prussian/Austrian imperial governance — no sovereign state but no breakdown either."),
    ("Poland", "November/January Uprisings", 1831): (3, "Two crushed national uprisings against Russia, severe imperial repression, exile and martyrdom; lands governed by Russian state."),
    ("Poland", "Organic Work/Positivism", 1864): (2, "No sovereign Polish state; partitioned lands stably governed by three empires with positivist cultural-nationalist resistance."),
    ("Poland", "Second Republic", 1918): (3, "Reborn state integrating three partition zones, Polish-Soviet War, ethnic tensions, intense partisan competition; functional but stressed."),
    ("Poland", "Sanacja/Pilsudski", 1926): (3, "Authoritarian sanation regime hollowing parliamentary forms, becoming more repressive after Piłsudski's death; functional but illiberal."),
    ("Poland", "WWII/Occupation", 1939): (5, "Nazi (and Soviet) occupation destroying Polish statehood, Holocaust eliminating ~3M Polish Jews, ~3M ethnic Poles killed; catastrophic state destruction and genocide."),
    ("Poland", "Stalinist Poland", 1945): (3, "Soviet-imposed Stalinist communism, show trials, suppressed Catholic Church, mass repression; predatory but state operational, no famine or civil war."),
    ("Poland", "Gomulka/Gierek", 1957): (2, "Communist regime with antisemitic 1968 campaign and 1970 worker massacres but largely stable Soviet-bloc governance, consumer-goods-funded prosperity."),
    ("Poland", "Solidarity/Transition", 1981): (2, "Martial law 1981, Round Table negotiations 1989, Balcerowicz shock therapy; remarkable negotiated revolution and effective democratic transition."),
    ("Poland", "EU Accession Poland", 1998): (2, "AWS-UW and SLD governments completing EU accession 2004; pro-EU consensus, effective institution-building."),
    ("Poland", "Tusk-era Civic Liberalism", 2005): (1, "Tusk's Civic Platform: Central Europe's success story, technocratic competence, stable through financial crisis."),
    ("Poland", "PiS Illiberal Consolidation", 2015): (3, "PiS judicial capture, media curbs, expanded social transfers, EU rule-of-law confrontation; democratic backsliding but effective state."),
    ("Poland", "Post-PiS Tusk Coalition", 2023): (2, "Tusk coalition restoring institutions, contested judicial rebuild, frontline NATO state in Ukraine war; functioning democracy."),

    # === Ukraine ===
    ("Ukraine", "Imperial Borderlands", 1789): (2, "Russian/Habsburg imperial borderlands with serfdom, Russification, ethnic complexity; stable imperial governance over the period."),
    ("Ukraine", "Revolution/Soviet Incorporation", 1917): (5, "Multiple competing nationalist/Bolshevik/foreign projects, Holodomor 1932-33 (3-7M starved by Soviet policy), Great Purge; catastrophic state-directed mass starvation."),
    ("Ukraine", "War/Late Soviet Ukraine", 1939): (3, "WWII devastation, Holocaust, partisan war then stable Soviet rule for 45+ years; bundled period averages to functional Soviet republic with severe wartime episode."),
    ("Ukraine", "Oligarchic Independence", 1991): (3, "Oligarchic capture, Orange Revolution, weak institutions, regional divides, ending in Yanukovych ouster 2014; functional but corrupt."),
    ("Ukraine", "Maidan/War Democracy", 2014): (4, "Crimea seized, Donbas war 2014-22, full-scale Russian invasion 2022; mobilized wartime democracy under existential threat."),

    # === Netherlands ===
    ("Netherlands", "Batavian/French Period", 1789): (2, "French satellite state under revolutionary then Napoleonic influence with centralized governance; functional state under foreign hegemony."),
    ("Netherlands", "United Kingdom of Netherlands", 1814): (2, "Merger of northern and southern Netherlands under William I; functioning constitutional monarchy though tensions led to peaceful Belgian secession 1830."),
    ("Netherlands", "Liberal Era", 1831): (1, "Stable constitutional monarchy with parliamentary sovereignty under Thorbecke; effective liberal governance."),
    ("Netherlands", "Pillarization", 1888): (1, "Stable consociational democracy with verzuiling pillars and elite consensus; effective proportional governance."),
    ("Netherlands", "WWII Occupation", 1940): (4, "Nazi occupation, deportation of Dutch Jews (75% killed), forced labor, Hunger Winter 1944-45 starvation; severe foreign-imposed dysfunction over five years."),
    ("Netherlands", "Reconstruction/Consensus", 1946): (1, "Stable postwar reconstruction, Marshall Plan, welfare state buildout, decolonization; effective democratic governance."),
    ("Netherlands", "Cultural Revolution/Progressive", 1966): (1, "Stable consensus democracy through cultural liberalization, polder model effective; high institutional capacity."),
    ("Netherlands", "Populist Turn", 2002): (2, "Fortuyn and Van Gogh assassinations, PVV rise; consensus shaken but institutions functional."),

    # === Sweden ===
    ("Sweden", "Gustavian/Bernadotte Early", 1789): (2, "Transition from Gustavian absolutism toward constitutional monarchy through Bernadotte dynasty; routine governance, lost Finland 1809."),
    ("Sweden", "Liberal Reform Era", 1866): (1, "Functioning constitutional monarchy with industrialization, parliamentary reform abolishing four-estate Riksdag; stable institutions."),
    ("Sweden", "Social Democratic Rise", 1914): (1, "Effective neutral state through both world wars, Saltsjöbaden Agreement institutionalizing labor-capital cooperation."),
    ("Sweden", "Folkhem Peak", 1946): (1, "Folkhem welfare state, unbroken Social Democratic rule, exceptional consensus governance; one of the world's most effective states."),
    ("Sweden", "Neoliberal Turn", 1976): (1, "Functioning democracy through 1990s financial crisis, EU accession, deregulation; consensus model adapted."),
    ("Sweden", "Immigration Debate", 2006): (2, "Stable democracy with Sweden Democrats rise, gang violence pressures, NATO membership 2024; institutions effective."),

    # === Portugal ===
    ("Portugal", "Late Monarchy", 1789): (2, "Maria I and Joao regency, British alliance, traditional monarchy functional through French revolutionary threat."),
    ("Portugal", "Brazilian Exile/Liberalism", 1808): (4, "Royal court fled to Brazil, French occupation, 1820 liberal revolution, decades of civil conflict between absolutists and constitutionalists."),
    ("Portugal", "Constitutional Monarchy", 1834): (2, "Rotativismo of two liberal parties under constitutional monarchy, African colonial expansion; effective if narrow democratic governance."),
    ("Portugal", "First Republic", 1910): (4, "Dozens of governments in 16 years, anticlerical reforms, chronic instability discrediting democracy; ended in coup."),
    ("Portugal", "Estado Novo/Salazar", 1926): (2, "Salazarist corporatist Catholic dictatorship; austere but effective long-running governance, WWII neutrality, repression of dissent."),
    ("Portugal", "Caetano/Revolution", 1969): (3, "Failed liberalization, unwinnable colonial wars, 1974 peaceful Carnation Revolution and revolutionary leftism; bounded transitional period."),
    ("Portugal", "Post-Revolution Consolidation Portugal", 1977): (3, "Chronic minority governments, IMF programs, decolonization absorption; consolidation toward EEC accession 1986."),
    ("Portugal", "EU-Era Modernization Portugal", 1986): (1, "Stable EU democracy with PS/PSD alternation, structural-fund modernization, euro adoption; effective governance."),
    ("Portugal", "Austerity Portugal", 2008): (2, "Eurozone debt crisis with troika austerity, mass emigration, but innovative geringonça coalition; institutions functioning."),

    # === Greece ===
    ("Greece", "Ottoman Rule/Independence", 1789): (3, "Greek War of Independence against Ottomans 1821-32 with significant violence, Great Power intervention; bounded transitional period under Ottoman rule then new state."),
    ("Greece", "Othonian/Early Kingdom", 1833): (3, "Bavarian-imposed king, regional factions, foreign interference, military coup expelling Otto; weak state-building."),
    ("Greece", "Trikoupis/Deliyannis", 1863): (2, "Modernizer-populist Trikoupis-Deliyannis rivalry under constitutional monarchy, Megali Idea, state bankruptcy 1893; functional governance."),
    ("Greece", "Venizelos/National Schism", 1910): (4, "Venizelist-royalist National Schism, Asia Minor Catastrophe (1922 expulsion of 1.5M Greeks); deep political trauma."),
    ("Greece", "Metaxas/WWII/Civil War", 1936): (5, "Metaxas dictatorship, Axis occupation with mass famine, brutal civil war 1946-49 (158,000 dead); catastrophic 13-year period."),
    ("Greece", "Cold War Greece", 1950): (2, "US-backed right-wing governments, NATO integration, suppression of left through certificates of political reliability; functional democracy with restrictions."),
    ("Greece", "Junta", 1967): (3, "Colonels' military dictatorship with censorship, torture, exile; brief 7-year regime collapsed after Cyprus debacle."),
    ("Greece", "Metapolitefsi", 1975): (2, "Stable transitional democracy, EU accession 1981, PASOK/ND alternation, 2004 Olympics; effective governance."),
    ("Greece", "Crisis Greece", 2009): (3, "Sovereign debt crisis with GDP -25%, three bailouts, punishing austerity, Golden Dawn rise then fragile ND-led recovery; severe but bounded crisis."),

    # === Belgium ===
    ("Belgium", "Revolution/Independence", 1830): (2, "Stable constitutional monarchy under Leopold I after 1830 break; progressive constitution, Catholic-Liberal cooperation."),
    ("Belgium", "Liberal/Catholic Rivalry", 1848): (2, "Rapid industrialization, school war between Catholics and Liberals, Leopold II's Congo brutality (foreign-extracted, not domestic dysfunction)."),
    ("Belgium", "WWI/Interwar", 1914): (3, "WWI German occupation, interwar language tensions, Rex fascist movement and Flemish nationalism rising; bundled period with severe wartime episode."),
    ("Belgium", "WWII/Reconstruction", 1940): (3, "Second German occupation, divisive Royal Question, then effective postwar reconstruction with founding role in ECSC; bundled period mostly stable."),
    ("Belgium", "Linguistic Federalization", 1958): (2, "Language border fixed 1962, devolution to communities/regions; complex but effective federal transition."),
    ("Belgium", "Federal Belgium", 1993): (2, "Fully federalized state hosting EU institutions; consociational governance functioning despite complexity."),
    ("Belgium", "Modern Belgium", 2011): (2, "541-day government formation crisis 2010-11, N-VA separatism, persistent fragmentation; functional consociational democracy."),
    ("Belgium", "Austrian/French/Dutch Netherlands", 1789): (3, "Territory under Austrian Habsburg, Brabant Revolution, French annexation, Dutch rule before 1830 independence; sustained transitional instability."),

    # === Switzerland ===
    ("Switzerland", "Helvetic/Mediation", 1789): (2, "Napoleonic-imposed Helvetic Republic, Act of Mediation cantonal restoration, brief Sonderbund War 1847; functional federal transition."),
    ("Switzerland", "Federal State", 1848): (1, "Stable federal democracy from 1848 constitution, pioneering direct democracy, armed neutrality, rapid industrialization."),
    ("Switzerland", "Interwar/WWII", 1914): (1, "Effective armed neutrality through both world wars; banking sector and Geistige Landesverteidigung."),
    ("Switzerland", "Magic Formula Era", 1946): (1, "Magic Formula stable allocation, banking secrecy, Cold War neutrality, prosperity; one of the world's most effective states."),
    ("Switzerland", "SVP Rise", 1991): (1, "SVP nationalist surge, EU bilateral path, but Magic Formula and federal institutions remain effective."),
    ("Switzerland", "Modern Switzerland", 2011): (1, "Stable direct democracy with referendums on minarets/immigration, banking secrecy eroded under international pressure; high state capacity."),

    # === Romania ===
    ("Romania", "Phanariot/Early Principalities", 1789): (2, "Ottoman suzerainty via Greek Phanariot princes, Russian interventions; long stable if loose imperial administration."),
    ("Romania", "Organic Statutes/Union", 1830): (2, "Russian-imposed Organic Statutes modernizing governance, Cuza unifying principalities 1859 then forced to abdicate; effective state-building."),
    ("Romania", "Romanian Kingdom", 1867): (2, "Constitutional monarchy under Carol I, landowning oligarchy, devastating 1907 peasant revolt suppressed; functional governance."),
    ("Romania", "Greater Romania", 1914): (3, "WWI unification of territories, fragile interwar democracy, ethnic tensions, Iron Guard fascism rising before royal dictatorship."),
    ("Romania", "Royal Dictatorship/WWII", 1938): (4, "Carol II's royal dictatorship, Antonescu's Nazi alliance, Holocaust in Transnistria, capitulation 1944; severe wartime dysfunction."),
    ("Romania", "Communist Romania", 1945): (3, "Soviet-backed communism, abolished monarchy, hundreds of thousands in forced labor camps, show trials; predatory but operational state."),
    ("Romania", "Ceausescu", 1965): (4, "Ceausescu's nationalist communist personality cult, devastating austerity to repay debt, abortion ban, systematization demolition; severe dysfunction."),
    ("Romania", "Iliescu Transition", 1990): (3, "Violent 1989 revolution, mineriad violence against students, slow reform, ex-communist FSN/PDSR dominance; transitional disorder bounded, state functional."),
    ("Romania", "EU Accession Romania", 2004): (2, "EU accession 2007, DNA anti-corruption agency, NATO ties, technocratic governance; functional pro-EU democracy."),
    ("Romania", "Iohannis-era Romania", 2014): (2, "Two Iohannis terms, anti-corruption posture, alternating PSD/PNL governments, AUR ultranationalist rise; functioning democracy."),

    # === Hungary ===
    ("Hungary", "Habsburg Hungary", 1789): (2, "Hungarian reform nobles within Habsburg framework, Magyar language rights pushed; functional governance."),
    ("Hungary", "1848/Compromise", 1848): (2, "1848 revolution crushed by Russian intervention, decades of passive resistance under Habsburg rule ending in 1867 Ausgleich; stable imperial governance."),
    ("Hungary", "Dual Monarchy", 1868): (2, "Co-equal partner in Austria-Hungary; Magyarization, Budapest industrialization, functional constitutional governance."),
    ("Hungary", "Horthy Era", 1920): (3, "Horthy regency with Trianon revisionism, White Terror, slide into Nazi orbit, Holocaust, German occupation 1944; long stable until catastrophic late-period."),
    ("Hungary", "Stalinist Hungary", 1945): (4, "Rákosi's Stalinist terror, show trials, forced industrialization, 1956 revolution crushed by Soviet tanks."),
    ("Hungary", "Kadar Era", 1957): (2, "Kádár's goulash communism trading conformity for consumer goods; most liberal Warsaw Pact state, effective stability."),
    ("Hungary", "Post-Communist/Liberal", 1990): (2, "Negotiated transition, EU/NATO accession, multi-party democracy with left-right alternation; functional governance."),
    ("Hungary", "Orban's Hungary", 2010): (3, "Orbán's illiberal democracy with constitutional supermajority capture, media/court takeover, EU rule-of-law confrontation; democratic backsliding but state operational."),

    # === Czech/Czechoslovakia ===
    ("Czech/Czechoslovakia", "Habsburg Bohemia", 1789): (2, "Czech national revival within Habsburg Empire, 1848 Prague uprising; functional imperial governance."),
    ("Czech/Czechoslovakia", "Austria-Hungary/Czech Politics", 1868): (2, "Czech parties flourishing within parliamentary system, Masaryk's Realist movement; functional constitutional politics."),
    ("Czech/Czechoslovakia", "First Republic", 1918): (1, "Interwar Central Europe's only stable democracy under Masaryk; strong industrial base, progressive constitution."),
    ("Czech/Czechoslovakia", "Munich/Protectorate", 1938): (4, "Munich dismemberment, Nazi Protectorate with terror, Lidice destruction, Holocaust, Sudeten German expulsions; severe foreign-imposed dysfunction."),
    ("Czech/Czechoslovakia", "Communist Czechoslovakia", 1948): (2, "Stalinist 1948 coup, show trials, collectivization, heavy industrialization; rigid Warsaw Pact state with effective authoritarian governance."),
    ("Czech/Czechoslovakia", "Prague Spring/Normalization", 1968): (2, "Prague Spring crushed by Warsaw Pact invasion, Husák normalization enforcing conformity; stable if repressive Soviet-bloc state."),
    ("Czech/Czechoslovakia", "Klaus Reform Era", 1993): (2, "Velvet Divorce, Klaus voucher privatization, Havel as conscience-presidency; effective EU pre-accession."),
    ("Czech/Czechoslovakia", "EU Accession Czech Republic", 2004): (1, "Stable EU/NATO multiparty democracy with regular ODS/ČSSD alternation; effective governance."),
    ("Czech/Czechoslovakia", "Babiš-era Czech Republic", 2017): (2, "Babiš's ANO populism, Zeman's Russia-friendly Castle, SPOLU restoration 2021; functioning democracy."),

    # === Denmark ===
    ("Denmark", "Absolutist Denmark-Norway", 1789): (2, "Late absolutist Lutheran monarchy, mercantilist administration, lost Norway in Napoleonic Wars; functioning state."),
    ("Denmark", "Constitutional Denmark", 1815): (2, "Transition from absolutism to 1849 constitutional monarchy; lost Schleswig-Holstein but stable institutional development."),
    ("Denmark", "Postwar Welfare Buildout Denmark", 1945): (1, "NATO membership, 1953 constitution, universal welfare state, social-democratic dominance; high-trust corporatist culture."),
    ("Denmark", "Late Welfare State Denmark", 1973): (1, "1973 earthquake election ending postwar party system, oil shocks, but welfare model adapted; effective governance."),
    ("Denmark", "Contemporary Denmark", 2001): (1, "Stable high-trust welfare democracy with right-populist immigration politics; institutionally strong, socially liberal."),

    # === Finland ===
    ("Finland", "Swedish/Russian Grand Duchy", 1789): (2, "Autonomous grand duchy under Russian Empire from 1809; Lutheran institutions, cautious constitutional nationalism."),
    ("Finland", "Independence/War Finland", 1917): (3, "Independence 1917, brief civil war 1918, Winter War, Continuation War, hard peace with USSR; severe wartime stress but consistently functional democratic state."),
    ("Finland", "Finlandization/Welfare State", 1946): (1, "Cold War balance of democratic capitalism with Soviet neutrality; consensus, social partnership, institutional discipline."),
    ("Finland", "EU-Era Neutral Finland", 1995): (1, "EU membership, Nokia-era growth, high-trust welfare state with consensus politics; effective governance."),
    ("Finland", "NATO Finland", 2022): (1, "NATO membership 2023 with broad consensus, Finland-Russia border closed, defense surge; effective democratic governance."),

    # === Ireland ===
    ("Ireland", "Union Ireland", 1789): (3, "British Union rule with 1798 rebellion, Great Famine (1M dead, 1M emigrated under state inaction), Catholic emancipation, Home Rule politics; functional but very unequal."),
    ("Ireland", "Revolution/Free State", 1916): (3, "Easter Rising, War of Independence, partition, brief civil war 1922-23 then stable Free State; revolutionary state-building bounded period."),
    ("Ireland", "De Valera Republic", 1938): (2, "Sovereign democratic republic with Catholic social teaching, neutrality, economic protectionism; functional but constrained."),
    ("Ireland", "EEC Modernization Ireland", 1973): (2, "EEC membership, Northern Ireland Troubles cross-border, 1980s fiscal crisis, gradual social opening; functional."),
    ("Ireland", "Celtic Tiger Ireland", 1990): (1, "FDI-led boom, social liberalization, Good Friday Agreement 1998, secularization; effective democratic governance."),
    ("Ireland", "Post-Crisis Liberal Ireland", 2009): (2, "Post-crash austerity, marriage equality and abortion referendums, housing pressures; high-trust functional democracy."),

    # === Norway ===
    ("Norway", "Danish/Swedish Union Norway", 1789): (2, "Norway under Danish, then Swedish union with liberal 1814 constitution; Lutheran rural egalitarianism, stable institutions."),
    ("Norway", "Independent Norway", 1905): (2, "Peaceful 1905 separation, parliamentary monarchy buildout, Nazi occupation 1940-45 a contained interruption; mostly stable democratic state."),
    ("Norway", "Labor/Oil Welfare State", 1945): (1, "Labor postwar dominance, NATO, oil discovery, welfare state, corporatist bargaining; one of the world's most effective states."),
    ("Norway", "Contemporary Norway", 1990): (1, "High-trust welfare monarchy with oil-fund capitalism, EEA integration; very high state capacity."),

    # === Bulgaria ===
    ("Bulgaria", "Ottoman Bulgaria", 1789): (2, "Bulgarian lands under stable Ottoman rule with communal Orthodox institutions and national revival; not sovereign but functional imperial governance."),
    ("Bulgaria", "Principality/Kingdom", 1878): (3, "Independent Bulgaria with constitutional monarchy, repeated Balkan wars, oscillation between parliamentary forms and royal authority; functional but coup-prone."),
    ("Bulgaria", "Communist Bulgaria", 1944): (2, "Soviet-aligned one-party state under Zhivkov; bureaucratic stability, assimilation campaigns, economic stagnation but operational."),
    ("Bulgaria", "Post-Communist Transition Bulgaria", 1990): (3, "Transition oscillating BSP/SDS, hyperinflation 1996-97 currency crisis, IMF currency board, EU/NATO accession negotiation; significant transitional dysfunction."),
    ("Bulgaria", "EU-Era Bulgaria", 2007): (3, "EU accession but persistent corruption, oligarchic capture, Borisov dominance then collapse, snap-election cycles; functional but cynical politics."),

    # === Slovakia ===
    ("Slovakia", "Habsburg Upper Hungary", 1789): (2, "Slovak lands inside Hungarian kingdom of Habsburg monarchy under Magyar noble dominance; functional imperial governance."),
    ("Slovakia", "Czechoslovak Slovakia", 1918): (2, "Within democratic Czechoslovakia, infrastructure and education gains; functional democratic governance."),
    ("Slovakia", "Wartime Slovak State", 1939): (4, "Clerical-fascist Tiso regime as Nazi client, antisemitic persecution and deportations, Slovak National Uprising; severe wartime dysfunction."),
    ("Slovakia", "Communist/Federal Slovakia", 1946): (2, "Postwar Czechoslovakia communist rule, industrialization, Prague Spring federalization, normalization; long stable Soviet-bloc state."),
    ("Slovakia", "Mečiar Illiberal Slovakia", 1993): (3, "Mečiar's HZDS patronage, media capture, EU/NATO exclusion, reversed by Dzurinda 1998 reforms; illiberal but functional."),
    ("Slovakia", "EU/NATO Slovakia", 2004): (2, "EU/NATO membership, Dzurinda then Fico social-democratic populism, eurozone 2009; functioning democracy."),
    ("Slovakia", "Fico-era Polarization", 2018): (3, "Kuciak murder forced Fico out, anti-corruption alternation, Russia-friendly populist return, 2024 Fico assassination attempt; high polarization."),

    # === USA ===
    ("USA", "Federalist Era", 1789): (2, "New constitutional governance under Washington/Adams; Alien and Sedition Acts illiberal but routine peaceful transitions."),
    ("USA", "Jeffersonian", 1801): (2, "Republican ascendancy, Louisiana Purchase, War of 1812 stress; functioning federal democracy."),
    ("USA", "Jacksonian Democracy", 1824): (2, "Mass white-male democracy alongside Indian Removal and Manifest Destiny; functional federal democratic state with severe Indigenous violence."),
    ("USA", "Sectional Crisis", 1850): (3, "Escalating slavery conflict, Kansas-Nebraska violence, Dred Scott; functional federal state heading toward institutional failure and civil war."),
    ("USA", "Civil War/Reconstruction", 1861): (4, "Civil war (600,000+ dead), Reconstruction, Southern white violence collapsing it; severe internal warfare and state fracture."),
    ("USA", "Gilded Age", 1877): (2, "Industrial capitalism, Jim Crow disenfranchisement, severe labor unrest contained, federal state functioning effectively."),
    ("USA", "Progressive Era", 1896): (2, "Antitrust regulation, suffrage expansion, WWI mobilization; functional democratic governance."),
    ("USA", "Roaring Twenties/Normalcy", 1920): (2, "Laissez-faire normalcy, Prohibition, ending in Great Depression; functional democracy."),
    ("USA", "New Deal/WWII", 1933): (2, "FDR's New Deal welfare state, WWII mobilization, military desegregation; effective state-building under Depression and war."),
    ("USA", "Cold War Consensus", 1953): (2, "Bipartisan containment, civil rights movement, Vietnam escalation; functioning democracy with institutional capacity."),
    ("USA", "Crisis/Realignment", 1969): (2, "Watergate scandal resolved through institutional process, stagflation, Carter malaise; institutional trust eroded but constitutional democracy functional."),
    ("USA", "Reagan-Clinton", 1981): (2, "Conservative revolution and Third Way centrism, deregulation, Cold War end, unipolar era; functional democratic governance."),
    ("USA", "Polarization Era", 2008): (3, "Financial crisis, hyperpolarization, January 6 Capitol attack, Trump impeachments, institutional trust erosion; democracy stressed but functional."),

    # === Mexico ===
    ("Mexico", "Late Colonial/Independence", 1789): (3, "Bourbon reforms then independence movements 1810-21; transitional disorder bounded, colonial state functional through most of period."),
    ("Mexico", "First Empire/Early Republic", 1822): (4, "Iturbide's brief empire, chronic instability under Santa Anna, lost half territory to US (Mexican-American War); coup-prone failure."),
    ("Mexico", "La Reforma", 1855): (3, "Juárez's Reform Laws, French intervention with Maximilian, civil conflict; bounded state-building war."),
    ("Mexico", "Porfiriato", 1877): (2, "Díaz's long stable dictatorship modernizing infrastructure, attracting foreign investment; deepening inequality but effective governance."),
    ("Mexico", "Revolution", 1911): (5, "Decade of revolutionary upheaval pitting Madero, Zapata, Villa, Carranza against each other; over a million dead."),
    ("Mexico", "Revolutionary State", 1921): (2, "Calles and Cárdenas consolidating post-revolutionary state, oil nationalization, land redistribution; effective state-building."),
    ("Mexico", "PRI Hegemony/Miracle", 1941): (2, "Single-party PRI delivering sustained growth and stability through corporatist control and ISI; effective if illiberal governance."),
    ("Mexico", "PRI Crisis", 1969): (2, "1968 Tlatelolco massacre, oil boom-and-bust, 1982 debt crisis; legitimacy eroded but PRI state operational throughout."),
    ("Mexico", "Democratization", 1989): (3, "NAFTA, PAN 2000 victory ending one-party rule, drug-war escalation killing tens of thousands; functional democracy with severe security crisis."),
    ("Mexico", "AMLO/Morena", 2013): (3, "AMLO's Fourth Transformation with centralized power, austerity for institutions, expanded transfers, continuing security crisis; functioning democracy with institutional erosion."),

    # === Brazil ===
    ("Brazil", "Colonial/Portuguese Court", 1789): (2, "Portuguese colonial Brazil with Inconfidência Mineira failed, court flight to Rio 1808 transforming into seat of empire; effective imperial governance."),
    ("Brazil", "Empire", 1822): (2, "Stable constitutional monarchy under Pedro II sustained by slave labor; functional governance until 1889 republican overthrow."),
    ("Brazil", "Old Republic", 1889): (2, "Coffee oligarchs rotating power through coronelismo and fraudulent elections in decentralized federation; functional if narrow oligarchy."),
    ("Brazil", "Vargas Era", 1930): (2, "Vargas's Estado Novo corporatist dictatorship with state-led industrialization and labor co-optation; effective authoritarian state-building."),
    ("Brazil", "Democratic Experiment", 1946): (2, "Competitive democracy with populist leaders and Kubitschek's modernization; ending in 1964 military coup but functional throughout."),
    ("Brazil", "Military Dictatorship", 1964): (3, "Military generals through repression and economic miracle; effective economic governance, brutal politics, growing debt by late 1970s."),
    ("Brazil", "Redemocratization", 1985): (3, "Hyperinflation crisis (peaked over 80% monthly 1989-94) and 1988 democratic constitution; Real Plan tamed inflation by 1994 within functioning democracy."),
    ("Brazil", "Lula/PT Era", 2003): (2, "PT social programs, Bolsa Família, commodity boom, ending in massive Lava Jato corruption scandals; functional democracy."),
    ("Brazil", "Bolsonaro/Crisis", 2016): (3, "Dilma impeachment, Bolsonaro far-right populism, January 8 2023 Brasília attacks, pandemic mismanagement; institutions held throughout."),

    # === Argentina ===
    ("Argentina", "Independence/Rivadavia", 1810): (3, "May Revolution, independence wars, Rivadavia's short-lived liberal reforms; bounded transitional disorder."),
    ("Argentina", "Rosas", 1830): (2, "Rosas's caudillo rule over Buenos Aires dominating confederation through terror and federalism; effective if brutal long-running authoritarianism."),
    ("Argentina", "Liberal Republic", 1853): (1, "1853 constitution, export-led boom from European immigration, one of the world's wealthiest nations; effective governance."),
    ("Argentina", "Radical/Conservative", 1916): (3, "Yrigoyen's Radical Party democracy, 1930 coup beginning Infamous Decade of conservative fraud; functional but oscillating between democracy and fraud."),
    ("Argentina", "Peronist Era", 1943): (2, "Perón's justicialismo on labor and industrialization; populist mass mobilization, illiberal but state effectively functioning."),
    ("Argentina", "Instability/Coups", 1956): (3, "Cycle of military coups (1955, 1962, 1966, 1970), Peronist proscription, weak civilian governments; coup-prone but state continued."),
    ("Argentina", "Dirty War", 1973): (4, "Perón return chaos, military junta dirty war, 30,000 disappeared, Falklands defeat; severe state predation but state operational."),
    ("Argentina", "Democratic Restoration", 1984): (3, "Alfonsín restoration with junta trials, Menem privatizations, ending in 2001 financial collapse and five presidents in two weeks; functional democracy with severe terminal crisis."),
    ("Argentina", "Kirchner Era Argentina", 2002): (2, "Kirchner stabilization after 2001 default, soybean boom, currency controls, holdouts confrontation; functional democracy with heterodox economics."),
    ("Argentina", "Macri-Fernández Oscillation", 2015): (3, "Macri IMF mega-loan recession, Fernández failed inflation control hitting 100%+ by 2023; severe economic stress but routine democracy."),
    ("Argentina", "Milei Libertarian Argentina", 2023): (3, "Milei shock therapy with peso devaluation and ministry abolitions, inflation collapse but poverty surge; functioning democracy under stress."),
    ("Argentina", "Rio de la Plata Colonial", 1789): (2, "Spanish viceroyalty centered on Buenos Aires, cattle exports, contraband trade, crown bureaucracy; functional colonial governance."),

    # === Canada ===
    ("Canada", "British North America", 1789): (2, "Upper/Lower Canada with rebellions and Durham Report, achieving responsible government within imperial framework; functional governance."),
    ("Canada", "Confederation/Macdonald", 1867): (2, "Confederation under Macdonald's National Policy, tariffs, railways, residential school system; effective state-building (with severe Indigenous policy harm)."),
    ("Canada", "Laurier/Early 20th", 1896): (1, "Laurier's mass immigration boom, WWI conscription crisis but state functional; effective democratic governance."),
    ("Canada", "Depression/War/Postwar", 1930): (2, "Depression stress, WWII mobilization, postwar welfare state expansion; effective parliamentary democracy."),
    ("Canada", "Quiet Revolution/Trudeau Sr.", 1957): (1, "Quebec's Quiet Revolution, Trudeau Sr. bilingualism/multiculturalism/Charter; effective democratic governance."),
    ("Canada", "Mulroney/Chretien", 1984): (1, "Free trade, deficit elimination, two Quebec sovereignty referendums managed peacefully; effective governance."),
    ("Canada", "Harper Conservative Canada", 2006): (1, "Stable Conservative parliamentary government, omnibus bills, oil-sands expansion, Senate scandal but routine democracy."),
    ("Canada", "Trudeau-Carney Liberal Canada", 2015): (2, "Trudeau's progressive branding, SNC-Lavalin and Freedom Convoy stresses, Carney 2025 succession; institutions functioning."),

    # === Colombia ===
    ("Colombia", "Gran Colombia/Independence", 1810): (3, "Bolívar's Gran Colombia liberation, regional rivalries dissolving union within two decades; bounded transitional disorder."),
    ("Colombia", "Conservative Hegemony", 1831): (3, "Recurring civil wars between Liberals and Conservatives, Church central role; functional state but conflict-prone."),
    ("Colombia", "Regeneration/Thousand Days", 1886): (3, "Regeneration centralization with bounded Thousand Days War 1899-1902 (100,000+ dead), Panama secession 1903; mostly stable Conservative governance."),
    ("Colombia", "Liberal Republic/La Violencia", 1930): (4, "La Violencia civil war (200,000+ dead), military dictatorship; severe partisan violence."),
    ("Colombia", "National Front", 1958): (2, "Liberal-Conservative power-alternation pact delivering elite stability after La Violencia, exclusion of left fueling later FARC; effective if narrow democracy."),
    ("Colombia", "Drug War/Constitution", 1974): (3, "Medellín/Cali cartels narco-violence and ongoing guerrilla/paramilitary conflict; severe security crisis but state operational with 1991 constitution."),
    ("Colombia", "Uribe Security Era", 2003): (3, "Plan Colombia weakening FARC, AUC demobilization, extrajudicial killings ('false positives'); functional democracy with severe security operations."),
    ("Colombia", "Santos Peace Process", 2010): (3, "FARC peace deal narrowly defeated by plebiscite then ratified, Santos Nobel; functional democracy with deep polarization."),
    ("Colombia", "Duque-Petro Polarization", 2018): (3, "Duque obstruction, 2021 paro nacional protests, Petro first leftist president, total peace negotiations; functional democracy under stress."),
    ("Colombia", "New Granada Colonial", 1789): (2, "Spanish viceroyalty under Bourbon administration, Catholic corporatism, regionalism; functional pre-independence colonial state."),

    # === Chile ===
    ("Chile", "Independence/O'Higgins", 1810): (3, "O'Higgins liberation from Spain, autocratic republic ending in forced exile; transitional state-building."),
    ("Chile", "Conservative Republic", 1831): (1, "Portales's centralized authoritarian constitution delivered exceptional stability and mining-driven growth; effective governance."),
    ("Chile", "Liberal Republic", 1861): (2, "Parliamentary politics, War of the Pacific securing nitrate territories; functional liberal institutions."),
    ("Chile", "Social Question", 1925): (2, "1925 constitution, Ibáñez interventionism, Popular Front coalitions addressing labor; functional democratic governance."),
    ("Chile", "Christian Democracy/Left", 1959): (3, "Frei's 'Revolution in Liberty' and Allende's Unidad Popular polarization ending in 1973 coup; functional democracy with extreme polarization."),
    ("Chile", "Pinochet", 1973): (3, "Military dictatorship with systematic repression (3,000+ killed/disappeared) and Chicago Boys reforms; effective economic governance, brutal politics."),
    ("Chile", "Concertacion", 1990): (1, "Center-left coalition managing model democratic transition, market continuity, copper stabilization; effective governance."),
    ("Chile", "Estallido/Boric", 2010): (3, "Mass protests 2019, constitutional rewrite process (failed twice), Boric young left government; functioning democracy with high contention."),
    ("Chile", "Kast Conservative Turn", 2026): (2, "Kast's 2026 inauguration with focus on security, fiscal discipline, post-estallido backlash; functioning democracy."),
    ("Chile", "Captaincy of Chile", 1789): (2, "Late colonial Spanish captaincy with frontier militarization, landed estates, Catholic hierarchy; functional Bourbon administration."),

    # === Cuba ===
    ("Cuba", "Spanish Colony", 1789): (2, "Spanish sugar colony with African slavery, periodic independence movements suppressed; long stable colonial governance."),
    ("Cuba", "US Intervention/Platt", 1898): (2, "Platt Amendment US protectorate with nominal independence and sugar dependence; functional state with limited sovereignty."),
    ("Cuba", "Batista/Republic", 1933): (3, "Batista's coups and elections, Havana modernization, Mafia-linked corruption; functional but coup-prone."),
    ("Cuba", "Revolutionary Cuba", 1959): (2, "Castro's revolution, nationalization, Soviet alignment, surviving Bay of Pigs and Missile Crisis; effective Soviet-aligned authoritarian governance."),
    ("Cuba", "Late Castro/Special Period", 1976): (3, "Institutionalized socialism, then Special Period (1991+) catastrophic post-Soviet shortages, limited market experiments; significant economic stress, state continued operating."),
    ("Cuba", "Post-Castro", 2007): (3, "Raúl Castro and Díaz-Canel limited reforms, mass emigration, 2021 protests; functioning authoritarian state under economic stress."),

    # === Peru ===
    ("Peru", "Colonial/Independence", 1789): (3, "Spanish viceroyalty, Túpac Amaru rebellion, Bolívar campaigns ending colonial rule; transitional violence."),
    ("Peru", "Caudillo Era", 1825): (3, "Military strongmen competing through guano boom, disastrous War of the Pacific; coup-prone but state continued."),
    ("Peru", "Aristocratic Republic", 1879): (2, "Coastal oligarchy rebuilding through Civilista Party with export-oriented growth; functional if narrow oligarchy."),
    ("Peru", "Leguia/APRA", 1920): (3, "Leguía's modernizing autocracy, military-civilian oscillation, APRA blocked from power; coup-prone but functional."),
    ("Peru", "Velasco/Military", 1968): (2, "Velasco's left-wing military government with nationalizations and sweeping agrarian reform; effective if revolutionary state-building."),
    ("Peru", "Democracy/Fujimori", 1980): (4, "Sendero Luminoso Maoist insurgency (70,000 killed), Fujimori autogolpe, hyperinflation, authoritarian neoliberalism; severe dysfunction."),
    ("Peru", "Post-Fujimori", 2001): (3, "Chronic presidential instability with multiple impeachments, Castillo's chaotic tenure, Boluarte; functional democracy in deep crisis."),

    # === Venezuela ===
    ("Venezuela", "Independence/Gran Colombia", 1810): (3, "Bolívar's independence movement and Gran Colombia, internal divisions tearing federation apart; bounded transitional disorder."),
    ("Venezuela", "Caudillo Era", 1831): (4, "Decades of caudillo rule and civil conflict, Federal War, minimal institutional development; coup-cycle dysfunction."),
    ("Venezuela", "Gomez/Oil State", 1909): (2, "Gómez long dictatorship coinciding with massive oil discoveries; effective petrostate consolidation under stable military modernizers."),
    ("Venezuela", "Punto Fijo Democracy", 1958): (1, "Stable AD-COPEI two-party democracy funded by oil wealth; model for Latin American governance."),
    ("Venezuela", "Crisis/Caracazo", 1989): (3, "Neoliberal austerity triggering Caracazo riots, two failed Chávez coup attempts; democracy degrading but operational."),
    ("Venezuela", "Chavez", 1999): (3, "Bolivarian Revolution redistributing oil wealth, constitution rewrite, polarization, opposition exclusion; functional if increasingly illiberal democracy."),
    ("Venezuela", "Maduro", 2013): (5, "Hyperinflation peaking 1,000,000%+, mass emigration (8M+ left), economic collapse, authoritarian consolidation, opposition imprisonment; predatory state failure."),
    ("Venezuela", "Captaincy General of Venezuela", 1789): (2, "Spanish captaincy general with cacao plantations, slavery, Caracas creole politics; functional Bourbon colonial governance."),

    # === China ===
    ("China", "Late Qing/Pre-Opium", 1789): (2, "Late Qing dynasty under Confucian bureaucratic order, Qianlong reign, Canton system; functional imperial governance."),
    ("China", "Opium Wars/Taiping", 1840): (5, "First Opium War defeat, Taiping Rebellion (20-30 million dead), unequal treaties; Century of Humiliation begins with catastrophic civil war."),
    ("China", "Self-Strengthening/Reform", 1865): (3, "Tongzhi Restoration, Self-Strengthening, failed Hundred Days Reform, Boxer Rebellion humiliation; weakening but operational late Qing state."),
    ("China", "Republic/Warlords", 1912): (5, "Yuan Shikai autocracy, warlord fragmentation, no central authority, May Fourth ferment; state collapse and territorial fragmentation."),
    ("China", "Nanjing Decade/War", 1928): (4, "KMT state-building amid Communist civil war, Japanese invasion 1937 devastating country, Nanjing Massacre, eight-year war; severe wartime dysfunction."),
    ("China", "Mao Early", 1949): (2, "PRC land reform, collectivization, Korean War, Hundred Flowers; effective revolutionary state-building, brutal politics but cohesive state."),
    ("China", "Mao Radical", 1958): (5, "Great Leap Forward famine (30+ million dead), Cultural Revolution destroying institutions and persecuting intellectuals; mass starvation under state policy."),
    ("China", "Deng Reform", 1977): (2, "Deng's pragmatic reforms with SEZs, opening to West; highly effective economic governance, with Tiananmen 1989 a sharp contained crackdown."),
    ("China", "Jiang/Hu Technocratic", 1990): (2, "Technocratic governance under Jiang/Hu delivering extraordinary growth, WTO accession, harmonious society doctrine; effective if authoritarian."),
    ("China", "Xi Jinping", 2013): (2, "Xi consolidation, term-limit abolition, anti-corruption purges, Belt and Road, Hong Kong/Xinjiang repression; effective state-driven authoritarian governance."),

    # === Taiwan ===
    ("Taiwan", "Dutch-Zheng Frontier", 1624): (3, "Early colonial and Ming-loyalist Taiwan with Dutch-Zheng frontier transition under Ming-Qing change; pre-modern transitional governance."),
    ("Taiwan", "Qing Frontier Taiwan", 1684): (2, "Qing rule on volatile settler frontier with Han migration, Indigenous displacement, repeated uprisings managed; functional Qing administration."),
    ("Taiwan", "Japanese Suppression", 1895): (3, "Early Japanese colonial state with military pacification and Republic of Formosa resistance; bounded violent colonial consolidation."),
    ("Taiwan", "Japanese Assimilation", 1916): (2, "Mid-period developmental and assimilationist colonial rule with infrastructure, education, agriculture; effective colonial governance."),
    ("Taiwan", "Wartime Kominka", 1937): (2, "Wartime kominka mobilization with Shintoization, military labor; effective wartime colonial state."),
    ("Taiwan", "ROC Retrocession/228", 1945): (3, "ROC takeover with inflation, corruption, 228 massacre (10,000-30,000 killed) - brief and contained transitional violence; state functional through transition."),
    ("Taiwan", "KMT Martial Law State", 1949): (2, "KMT martial law authoritarian state with land reform, anti-communist mobilization, White Terror; effective economic and administrative governance."),
    ("Taiwan", "Taiwanization/Liberalizing KMT", 1975): (2, "Chiang Ching-kuo's liberalization, Taiwanization, technocratic development; effective transitional governance."),
    ("Taiwan", "Democratic Transition", 1987): (1, "Martial law lifted, opposition parties, press freedom, direct elections; effective democratic transition."),
    ("Taiwan", "Party Alternation/Cross-Strait Opening", 2000): (1, "Stable party alternation with Chen victory ending KMT rule, deepened pluralism, China economic ties; effective democracy."),
    ("Taiwan", "Sovereignty Democracy", 2016): (1, "Tsai/Lai consolidated democracy under PRC pressure, marriage equality, semiconductor leadership; high state capacity."),

    # === Japan ===
    ("Japan", "Late Tokugawa", 1789): (2, "Sakoku isolation continuing under Tokugawa shogunate; functional feudal governance under stress."),
    ("Japan", "Bakumatsu/Restoration", 1854): (2, "Perry's Black Ships forcing opening, Tokugawa collapse, brief Boshin War, Meiji Restoration; effective transition to centralized state."),
    ("Japan", "Meiji", 1878): (1, "Meiji rapid modernization with Western institutions, Asia's first parliamentary system, rich country/strong army; exceptionally effective state-building."),
    ("Japan", "Taishō Democracy", 1913): (2, "Party government, universal male suffrage, liberal cosmopolitanism; functional democratic governance."),
    ("Japan", "Militarist Japan", 1931): (4, "Manchurian Incident, ultranationalist militarism, Greater East Asia Co-Prosperity Sphere, total war atrocities; severe wartime dysfunction."),
    ("Japan", "Occupation/Recovery", 1946): (2, "American occupation imposing pacifist constitution, land reform, zaibatsu dissolution, women's suffrage; effective democratic reconstruction."),
    ("Japan", "High Growth", 1960): (1, "LDP continuous rule overseeing economic miracle, world's second-largest economy, consensus politics, MITI industrial policy; effective governance."),
    ("Japan", "Lost Decades", 1990): (1, "Bubble collapse, prolonged stagnation, brief DPJ experiment; effective democratic governance despite economic stagnation."),
    ("Japan", "Abe/Modern Japan", 2012): (1, "Abe long premiership with Abenomics, constitutional reinterpretation, demographic crisis; effective governance."),

    # === India ===
    ("India", "Late Mughal/EIC", 1789): (3, "Mughal fragmentation, EIC expansion through subsidiary alliances and conquest; gradual colonial consolidation."),
    ("India", "British Raj", 1858): (2, "British Crown direct rule with bureaucratic apparatus, INC formation 1885; effective colonial state with extraction and famines."),
    ("India", "Nationalist Movement", 1920): (3, "Gandhi's mass nonviolent movement under British rule, ending in Partition violence (1-2M killed) at the close of period."),
    ("India", "Nehruvian India", 1947): (2, "Secular socialist-leaning democracy under Nehru, Five-Year Plans, non-alignment, universal rights; effective democratic state-building."),
    ("India", "Congress Dominance", 1965): (2, "Indira's centralization, bank nationalization, 1971 war, brief Emergency 1975-77; functional democracy with illiberal Emergency phase."),
    ("India", "Coalition Era", 1977): (2, "Post-Emergency coalition politics, Mandal Commission, Babri Masjid demolition, 1991 economic liberalization; functional democracy."),
    ("India", "Vajpayee-Singh Liberalization Era", 1999): (2, "Vajpayee NDA nuclear tests and India Shining, Manmohan Singh UPA welfare expansion; effective democratic governance."),
    ("India", "Modi Era", 2014): (3, "Modi BJP Hindu nationalist consolidation, demonetization, GST, CAA/NRC, 370 abrogation; functioning democracy with illiberal turn."),

    # === Afghanistan ===
    ("Afghanistan", "Durrani/Barakzai Emirate", 1789): (3, "Late Durrani/Barakzai dynastic tribal emirate caught between Persian/Sikh/British/Russian pressure; weak central authority and Anglo-Afghan Wars."),
    ("Afghanistan", "Iron Amir/Protectorate", 1880): (2, "Abdur Rahman's coercive centralization, forced migration, taxation under British protectorate; effective if violent state-building."),
    ("Afghanistan", "Reform/Neutral Monarchy", 1919): (2, "Amanullah's modernization with brief conservative backlash, then long stable Nadir/Zahir Shah modernization; effective neutral monarchy."),
    ("Afghanistan", "Republic/Saur/Soviet War", 1973): (5, "Daoud republic, 1978 PDPA Saur Revolution, Soviet invasion, civil war, mujahideen resistance; catastrophic decade-plus war (1.5-2M dead)."),
    ("Afghanistan", "Mujahideen/Taliban Emirate", 1992): (5, "Communist fall to mujahideen factional war, Kabul destruction, warlord rule, Taliban Deobandi imposition; state collapse and predation."),
    ("Afghanistan", "Islamic Republic/NATO", 2002): (4, "NATO-backed Islamic Republic with elections, urban civil society, but corruption, warlord influence, Taliban insurgency; significant dysfunction."),
    ("Afghanistan", "Taliban Restoration", 2021): (4, "Taliban restored centralized clerical rule, restricted women and girls, suppressed dissent, severe humanitarian crisis; severe but state operational."),

    # === Korea (pre-division) ===
    ("Korea", "Joseon Late", 1789): (2, "Late Joseon Neo-Confucian orthodoxy, isolationist Hermit Kingdom, factional yangban politics; long stable pre-modern monarchy."),
    ("Korea", "Opening/Colonial", 1876): (2, "Treaty of Ganghwa opening, Japanese annexation 1910, 35 years of colonial rule with cultural suppression and forced labor; effective if predatory colonial state."),

    # === South Korea ===
    ("South Korea", "Korean War/Division", 1946): (4, "Liberation, division at 38th, Korean War 1950-53 catastrophic but bounded, Rhee autocracy; bundled period averages to severe but bounded dysfunction."),
    ("South Korea", "Park/Military", 1961): (2, "Park military coup, Miracle on the Han, chaebol formation, Yushin Constitution; highly effective economic governance with authoritarian politics."),
    ("South Korea", "Transition", 1980): (3, "Gwangju Uprising 1980 (200+ killed), student movements, June Democracy Movement 1987; bounded transition ending in democracy."),
    ("South Korea", "Democratic Consolidation", 1993): (1, "Civilian rule consolidation under Kim Young-sam and Kim Dae-jung, Sunshine Policy, IMF crisis recovery; effective democratic governance."),
    ("South Korea", "Polarized Democracy", 2008): (2, "Polarization between progressives and conservatives, Park Geun-hye impeachment via candlelight protests, Yoon martial law attempt 2024; functioning democracy with high contention."),
    ("South Korea", "Late Joseon/Korean Empire", 1789): (2, "Confucian bureaucratic monarchy with yangban hierarchy, agrarian extraction, factional politics; long stable pre-modern monarchy."),
    ("South Korea", "Japanese Korea", 1911): (2, "Japanese colonial Korea with police rule, land surveys, industrial extraction, wartime mobilization; effective if predatory colonial state."),

    # === North Korea ===
    ("North Korea", "Late Joseon/Korean Empire", 1789): (2, "Northern Korean lands sharing late Joseon order; stable pre-modern monarchy."),
    ("North Korea", "Japanese Korea", 1911): (2, "Japanese colonial rule with industrial development, forced assimilation, wartime mobilization; effective if predatory colonial state."),
    ("North Korea", "Soviet North/War Foundation", 1946): (3, "Soviet occupation building DPRK around Kim Il Sung, land reform, security organs, then Korean War aggression and devastation; bundled state-building amid catastrophic war."),
    ("North Korea", "Kim Il Sung Juche State", 1954): (2, "Totalitarian party-state with purges, collectivization, command planning, Juche self-reliance; effective if highly repressive long-running governance."),
    ("North Korea", "Kim Jong Il Songun", 1994): (5, "Kim Jong Il inherited power amid Soviet collapse and Arduous March famine (600,000-2M dead), Songun military-first, illicit networks; mass starvation under state policy."),
    ("North Korea", "Kim Jong Un Nuclear Dynasty", 2012): (3, "Kim Jong Un consolidated dynastic rule with purges, nuclear acceleration, market-tolerating authoritarian survival; predatory but state operational."),

    # === Indonesia ===
    ("Indonesia", "Dutch East Indies", 1789): (2, "Dutch colonial Cultivation System then Ethical Policy with plantation extraction; long stable if extractive colonial state."),
    ("Indonesia", "Japanese Occupation/Revolution", 1942): (3, "Japanese occupation, Sukarno-Hatta independence proclamation, four-year revolution against Dutch return; bounded transitional period."),
    ("Indonesia", "Guided Democracy/Sukarno", 1950): (3, "Sukarno's NASAKOM, Konfrontasi, Guided Democracy replacing parliamentary government, ending in 1965 coup and massacres; functional but increasingly unstable."),
    ("Indonesia", "New Order/Suharto", 1966): (3, "Anti-communist massacres 1965-66 founding regime, then development authoritarianism through oil and FDI; effective long-running but founded on mass killing."),
    ("Indonesia", "Reformasi", 1999): (2, "Asian Financial Crisis Suharto fall, democratic reforms, decentralization, civilian military control; effective democratic transition and consolidation."),
    ("Indonesia", "Jokowi/Modern", 2014): (2, "Jokowi pragmatic infrastructure focus, identity politics around Jakarta, capital relocation; effective democratic governance."),

    # === Philippines ===
    ("Philippines", "Spanish Philippines", 1789): (2, "Spanish colonial rule with friar land estates, ilustrado movement, late-period Katipunan revolution; long stable colonial governance."),
    ("Philippines", "American Period", 1899): (3, "Brutal pacification campaign, then American institutions, Commonwealth, Japanese occupation, Bataan/Manila destruction; bundled period with severe wartime episode."),
    ("Philippines", "Independence/Democratic", 1946): (2, "Oligarchic two-party democracy, unfulfilled land reform, sugar barons and dynasties dominant; functional democratic governance."),
    ("Philippines", "Marcos", 1972): (4, "Marcos martial law, conjugal dictatorship, crony capitalism, debt ballooning, Aquino assassination; severe authoritarian dysfunction."),
    ("Philippines", "Aquino-Ramos Restoration", 1986): (2, "EDSA People Power, Aquino restoration weathering coup attempts, Ramos consolidation with telecoms/energy reforms; effective democratic restoration."),
    ("Philippines", "Arroyo-Aquino III Era", 2001): (3, "Arroyo's contested presidency, Hello Garci scandal, Aquino III anti-corruption agenda; functional but stressed democracy."),
    ("Philippines", "Duterte Populism", 2016): (3, "Duterte drug war killing thousands extrajudicially, China pivot, ICC investigation; significant state violence but state and democracy operational."),
    ("Philippines", "Marcos Jr./UniTeam", 2022): (2, "Marcos Jr.-Sara Duterte UniTeam dynastic restoration, US security pivot, infrastructure focus; functioning democracy."),

    # === Thailand ===
    ("Thailand", "Late Ayutthaya/Early Chakri", 1789): (2, "Early Chakri dynasty consolidating after Ayutthaya destruction, Bangkok capital, Theravada monarchy; functional pre-modern governance."),
    ("Thailand", "Chulalongkorn/Reform", 1851): (2, "Mongkut and Chulalongkorn modernizing Siam through diplomacy preserving independence, slavery abolished; effective governance."),
    ("Thailand", "Constitutional Revolution", 1932): (3, "1932 ending absolute monarchy, Pridi-Phibun rivalry, WWII Japan alliance; coup-prone but functional."),
    ("Thailand", "Military/Development", 1958): (2, "Sarit's authoritarian developmentalism with US alliance and growth, monarchy elevated; effective economic governance."),
    ("Thailand", "Democracy Oscillation", 1973): (3, "1973 student uprising, 1976 Thammasat massacre, cyclic democratic openings and coups; coup-prone but state continued."),
    ("Thailand", "Thaksin/Yellow-Red", 1992): (3, "Thaksin populism polarization, 2006 coup, Yellow-Red Shirt confrontations; functional but high contention."),
    ("Thailand", "Junta/Modern", 2014): (3, "2014 military coup, Prayuth military-drafted constitution, youth protesters challenging monarchy/junta; functional authoritarian-leaning democracy."),

    # === Vietnam ===
    ("Vietnam", "Late Lê/Nguyễn", 1789): (2, "Tây Sơn revolt, then Nguyễn dynasty unification with Confucian orthodoxy, Chinese-style bureaucracy; long stable pre-modern monarchy."),
    ("Vietnam", "French Indochina", 1859): (2, "French colonial transformation through plantation extraction, civilizing mission, late-period resistance movements; long stable colonial state."),
    ("Vietnam", "Independence War", 1946): (3, "Ho Chi Minh independence declaration, First Indochina War with France, land reform; bounded war period before partition."),
    ("Vietnam", "Vietnam War", 1955): (4, "Partition, American escalation, sustained guerrilla and conventional war, Tet Offensive, Saigon fall; catastrophic war (3M+ dead) but Northern state operational."),
    ("Vietnam", "Socialist Republic", 1976): (3, "Forced collectivization of South, re-education camps, Cambodia intervention, China border war, boat people exodus, economic crisis; severe stress but state operational."),
    ("Vietnam", "Đổi Mới", 1986): (2, "Đổi Mới market reforms under one-party rule producing remarkable growth and poverty reduction; effective if authoritarian governance."),

    # === Iran ===
    ("Iran", "Qajar Early", 1789): (3, "Qajar dynasty's weakened Persia, devastating losses to Russia, weak central authority barely beyond capital; functional but degraded."),
    ("Iran", "Qajar Late/Constitutional", 1849): (3, "Tobacco Protest, Constitutional Revolution 1905-11 undermined by Russian intervention, oil discovery; weak Qajar state."),
    ("Iran", "Pahlavi Early", 1925): (2, "Reza Shah forced modernization, secularization, suppression of tribal autonomy; effective state-building, Allied invasion 1941 was external."),
    ("Iran", "Mossadegh/Shah", 1953): (2, "1953 CIA-MI6 coup restoring Shah, White Revolution top-down reforms, SAVAK; effective authoritarian state."),
    ("Iran", "Pahlavi Peak", 1964): (2, "Oil-funded modernization, military buildup, Shah's grandiose ambitions, SAVAK suppression; effective authoritarian governance."),
    ("Iran", "Islamic Revolution", 1979): (4, "Islamic Revolution, theocratic republic founding, hostage crisis, Iran-Iraq War (500,000-1M dead), Cultural Revolution mass executions; severe transitional violence."),
    ("Iran", "Rafsanjani-Khatami Reform", 1989): (2, "Rafsanjani reconstruction, Khatami reformist Dialogue of Civilizations within clerical guardianship; functional theocracy."),
    ("Iran", "Ahmadinejad Hardliner", 2005): (3, "Ahmadinejad nuclear-program confrontation, devastating sanctions, 2009 Green Movement crackdown; functional theocracy under stress."),
    ("Iran", "Rouhani Pragmatist", 2013): (3, "JCPOA 2015, sanctions relief then Trump 2018 withdrawal economic free-fall, 2019 fuel-price protests crackdown; functional theocracy in economic crisis."),
    ("Iran", "Raisi-era Hardliner Restoration", 2021): (3, "Raisi vetting, Mahsa Amini protests crackdown, open Israel-Iran war 2024-25; high security stress but state operational."),

    # === Pakistan ===
    ("Pakistan", "Independence/Early", 1947): (4, "Partition bloodshed (1-2M dead, 14M displaced), Jinnah early death, constitutional crises, Bengali tensions; severe transitional dysfunction."),
    ("Pakistan", "Ayub/Military", 1959): (2, "Ayub military modernization, Decade of Development, Basic Democracies; effective if illiberal authoritarian governance."),
    ("Pakistan", "Bhutto/Zia", 1972): (4, "Bhutto populist socialism, Zia coup and execution, Islamization, Soviet-Afghan war, militancy; severe dysfunction."),
    ("Pakistan", "Democratic Oscillation", 1989): (3, "Bhutto-Sharif alternating dismissals by military, 1999 Musharraf coup, 9/11 alignment; coup-prone but state continued."),
    ("Pakistan", "Modern Pakistan", 2008): (3, "Post-Musharraf democratic restoration with continued military dominance behind the scenes, Imran Khan ouster and imprisonment, terrorism, fiscal crises; functional democracy under stress."),
    ("Pakistan", "Northwest Raj/Frontier", 1789): (2, "Late Mughal successor politics, Sikh and Afghan frontier states, British colonial consolidation; gradually stable colonial governance."),

    # === Australia ===
    ("Australia", "First Nations/Colonial Frontier", 1789): (2, "British penal settlement and settler expansion, with frontier violence against Aboriginals; effective colonial state-building."),
    ("Australia", "Responsible Government/Federation", 1851): (2, "Gold rushes, self-governing colonies, Federation 1901, early mass democracy for white settlers; functional with White Australia exclusion."),
    ("Australia", "White Australia/Wartime State", 1914): (2, "World wars, conscription fights, racial immigration regime; functional democratic governance with exclusionary policies."),
    ("Australia", "Postwar Multicultural Turn", 1946): (1, "Postwar immigration, welfare expansion, end of White Australia, Aboriginal rights, Hawke-Keating restructuring; effective democratic transformation."),
    ("Australia", "Howard Coalition Australia", 1996): (1, "Howard Coalition GST, gun control, Pacific Solution, Iraq War, history wars; effective governance."),
    ("Australia", "Rudd-Gillard Labor", 2007): (1, "Rudd Stolen Generations apology, GFC stimulus, leadership wars, Gillard minority government; effective democratic governance."),
    ("Australia", "Coalition Restoration Australia", 2013): (1, "Abbott carbon repeal, Turnbull SSM, Morrison pandemic management; effective democratic governance."),
    ("Australia", "Albanese Labor Australia", 2022): (1, "Albanese Voice referendum, AUKUS, China relations; effective democratic governance."),

    # === New Zealand ===
    ("New Zealand", "Maori Polities/Contact", 1789): (2, "Pre-British Māori iwi/hapu governance through kinship and mana, with transformative trade and disease impacts; functional traditional governance."),
    ("New Zealand", "Treaty/Settler Colony", 1840): (2, "Treaty of Waitangi sovereignty, NZ Wars dispossessing Māori, Liberal land/labor reforms; effective colonial state."),
    ("New Zealand", "Dominion Welfare Democracy", 1907): (1, "Dominion welfare democracy with Labour reforms, social security, wartime loyalty, Māori urbanization; effective democratic governance."),
    ("New Zealand", "Rogernomics Reform Era", 1984): (1, "Lange-Douglas radical free-market reforms, Bolger continuation; effective if disruptive democratic governance."),
    ("New Zealand", "Mature Liberal Welfare NZ", 1999): (1, "Clark Labour and Key National stable centrist consensus, Treaty settlements maturing; effective democratic governance."),
    ("New Zealand", "Ardern-era New Zealand", 2017): (1, "Ardern coalition responding to Christchurch attacks, COVID elimination, housing crisis, polarization; effective democratic governance."),

    # === Bangladesh ===
    ("Bangladesh", "Bengal Colonial/East Pakistan", 1789): (2, "Eastern Bengal under stable Company/Raj rule, then East Pakistan with growing discrimination; long stable colonial/state period."),
    ("Bangladesh", "Liberation/Mujib State", 1971): (5, "Liberation War (300,000-3M dead), Indian intervention, Mujib state, 1974 Bhola famine; catastrophic founding."),
    ("Bangladesh", "Zia-Ershad Military Bangladesh", 1976): (3, "Ziaur Rahman military rule, Islamization shift, Zia assassination 1981, Ershad's military government; coup-prone but state continued."),
    ("Bangladesh", "BNP-AL Multiparty Bangladesh", 1990): (2, "Bitter BNP-AL rotation under caretaker-government system, garment-industry growth, NGO microfinance; functional democratic governance."),
    ("Bangladesh", "Awami League Dominance", 2009): (3, "Hasina's long rule with growth, infrastructure, war-crimes trials but weakening electoral competition ending in 2024 rupture; functional but increasingly illiberal."),

    # === Myanmar ===
    ("Myanmar", "Konbaung Burma", 1789): (2, "Konbaung Buddhist monarchy with court hierarchy, conquest extraction; long stable pre-modern monarchy gradually undermined by Anglo-Burmese Wars."),
    ("Myanmar", "British Burma/Independence", 1886): (3, "British colonial rice-export economy, ethnic recruitment, parliamentary democracy after 1948 with communist/ethnic insurgencies; functional but increasingly stressed."),
    ("Myanmar", "Ne Win/Burmese Socialism", 1962): (4, "Ne Win's coup, military-socialist isolation, nationalization, ethnic war, censorship, economic collapse, 1988 protests; severe dysfunction."),
    ("Myanmar", "SLORC/SPDC Junta", 1989): (4, "Post-1988 junta crushing democracy, NLD 1990 victory ignored, military capitalism, forced labor; severe dysfunction."),
    ("Myanmar", "Opening/Coup Civil War", 2011): (5, "Partial democratic opening collapsed in 2021 coup; nationwide civil war with ethnic armed organizations, refugee outflows, junta atrocities; state collapse and civil war."),

    # === Malaysia ===
    ("Malaysia", "Malay Sultanates/British Malaya", 1789): (2, "Malay sultanates, Straits Settlements, plural colonial society; long stable colonial state with bounded Emergency 1948-60."),
    ("Malaysia", "Tunku/Razak Alliance", 1957): (2, "Independence, Singapore expulsion 1965, 1969 race riots leading to NEP affirmative action; functional governance with ethnic management."),
    ("Malaysia", "Mahathir Era Malaysia", 1981): (2, "Mahathir's authoritarian developmentalism with Look East and Vision 2020, judiciary sidelined; effective economic governance."),
    ("Malaysia", "Late BN/Najib Era", 2003): (3, "Najib 1MDB sovereign-fund scandal (corruption case), opposition popular vote 2013 without seats; functional but corrupt one-coalition rule."),
    ("Malaysia", "Competitive Coalition Era", 2018): (2, "2018 BN defeat ending six decades of one-coalition rule, unstable coalition realignment, anti-corruption politics; functional democracy."),

    # === Sri Lanka ===
    ("Sri Lanka", "Kandyan/British Ceylon", 1789): (2, "Sri Lanka from Kandyan kingdom to British Ceylon unified 1815, plantation capitalism, constitutional development; functional colonial governance."),
    ("Sri Lanka", "Independent Ceylon/Sinhala Nationalism", 1948): (2, "Westminster forms with Sinhala-Buddhist majoritarianism, Sinhala Only language policy, exclusion of Tamils; functional democracy with growing tensions."),
    ("Sri Lanka", "Civil War Sri Lanka", 1983): (4, "Black July, LTTE insurgency, decades of civil war (100,000+ dead), emergency rule, suicide bombing, brutal 2009 Mullivaikkal end; severe dysfunction."),
    ("Sri Lanka", "Postwar Crisis Sri Lanka", 2010): (3, "Rajapaksa nationalism, Easter bombings, 2022 economic collapse and mass protests, IMF program; severe but state continued."),

    # === Egypt ===
    ("Egypt", "Muhammad Ali Dynasty", 1789): (2, "Muhammad Ali modernization, military reform, cotton monoculture under autonomous Ottoman viceroy; effective state-building."),
    ("Egypt", "Khedivate/British", 1849): (2, "Suez Canal era under khedivate, then British occupation 1882 under Cromer; effective if colonial governance."),
    ("Egypt", "Liberal/Monarchy", 1914): (2, "1919 revolution, Wafd Party, constitutional monarchy with palace-British-Wafd power triangle; functional democracy with constraints."),
    ("Egypt", "Nasser", 1952): (2, "Nasser's Free Officers, Suez nationalization, land reform, pan-Arab leadership; effective state-building."),
    ("Egypt", "Sadat", 1971): (2, "Sadat's Infitah economic opening, Western realignment, Camp David peace; effective governance ending in assassination 1981."),
    ("Egypt", "Mubarak", 1982): (2, "Mubarak police state with crony capitalism, US aid, emergency law; long stable authoritarian governance."),
    ("Egypt", "Arab Spring/Morsi", 2011): (3, "Tahrir revolution, brief democratic opening, Morsi polarization, 2013 Sisi coup with Rabaa massacre; bounded transitional disorder."),
    ("Egypt", "Sisi", 2014): (2, "Sisi militarized state with Brotherhood crushed, mega-projects, IMF programs; effective highly authoritarian governance."),

    # === South Africa ===
    ("South Africa", "Cape Colony/Early", 1789): (2, "Dutch then British colonial rule at Cape with Boer expansion, Xhosa Wars; effective colonial governance with severe Indigenous violence."),
    ("South Africa", "Mineral Revolution/Union", 1870): (2, "Diamond and gold discoveries, Anglo-Boer War (1899-1902), 1910 Union; effective state-building under settler racial hierarchy."),
    ("South Africa", "Segregation Era", 1914): (2, "1913 Natives Land Act, color bar, Hertzog Pact formalizing segregation; effective state for whites with severe exclusion."),
    ("South Africa", "Apartheid", 1948): (3, "National Party apartheid through Bantustans, Group Areas, pass laws; effective state for whites with severe parallel violence and homelands governance failure."),
    ("South Africa", "Transition", 1990): (2, "Mandela release, CODESA negotiations, interim constitution; effective negotiated transition with bounded political violence."),
    ("South Africa", "Mandela/Mbeki", 1995): (2, "Rainbow Nation under Mandela/Mbeki with progressive constitution, GEAR macroeconomics, TRC; effective democratic governance."),
    ("South Africa", "Zuma/Crisis", 2008): (3, "Zuma state capture and institutional decay, EFF emergence, load shedding, 30%+ unemployment; democracy under significant stress."),

    # === Nigeria ===
    ("Nigeria", "Colonial Nigeria", 1789): (2, "Royal Niger Company expansion amalgamating diverse polities; gradually consolidating colonial governance."),
    ("Nigeria", "British Colony", 1914): (2, "Lugard's amalgamation, indirect rule empowering traditional authorities, regional identities hardened; functional colonial state."),
    ("Nigeria", "First Republic/Biafra", 1960): (4, "Independence, ethnic competition, census fraud, military coups, Biafran Civil War (1-3M dead, mass starvation); severe ethnic war."),
    ("Nigeria", "Military Era", 1970): (3, "Three decades of mostly military rule with oil boom petrostate, Gowon through Abacha juntas; corrupt and predatory but state continued."),
    ("Nigeria", "Fourth Republic", 1999): (3, "Obasanjo Fourth Republic with flawed but functional democracy, oil-fueled growth, North-South zoning; functional but stressed."),
    ("Nigeria", "Buhari/Modern", 2015): (3, "First democratic transfer, Boko Haram, recession, herder-farmer conflict, Tinubu fuel/forex liberalization; functional but stressed democracy."),

    # === Saudi Arabia ===
    ("Saudi Arabia", "Pre-Saudi/First State", 1789): (2, "First Saudi-Wahhabi alliance conquering Arabian Peninsula; effective if militant pre-modern state ending in Egyptian destruction 1818."),
    ("Saudi Arabia", "Second Saudi State/Interregnum", 1819): (3, "Second Saudi state rebuilding from Riyadh, eventual eclipse by Rashidi dynasty; weak central authority over period."),
    ("Saudi Arabia", "Ibn Saud/Unification", 1902): (2, "Ibn Saud's reconquest, peninsula unification through tribal warfare, kingdom founding 1932, oil discovery 1938; effective state-building."),
    ("Saudi Arabia", "Faisal/Khalid Oil Boom", 1953): (1, "Saud, Faisal, Khalid building modern petro-state on Wahhabi authority, Aramco revenue, US security; very effective monarchy."),
    ("Saudi Arabia", "Post-Mecca Wahhabi Saudi Arabia", 1979): (1, "Post-1979 deepening Wahhabi authority, oil wealth, US alliance; very effective monarchy with religious turn."),
    ("Saudi Arabia", "Post-9/11 Saudi Arabia", 2001): (1, "Domestic AQAP crackdown effective, Abdullah modest reforms, KAUST establishment; very effective monarchy."),
    ("Saudi Arabia", "MBS/Vision 2030", 2015): (2, "MBS Vision 2030 modernization, women driving, NEOM, Khashoggi murder abroad, Yemen war; effective if increasingly authoritarian monarchy."),

    # === Iraq ===
    ("Iraq", "Ottoman Iraq", 1789): (2, "Ottoman three vilayets with Tanzimat reforms and tribal autonomy; long stable if uneven imperial governance."),
    ("Iraq", "British Mandate/Monarchy", 1918): (3, "British-installed Faisal monarchy over Sunni/Shia/Kurdish populations, oil revenues, 1941 Rashid Ali coup; functional but stressed."),
    ("Iraq", "Revolution/Baath", 1958): (4, "Qasim coup overthrowing monarchy, decade of instability with Baathist/communist/Nasserist competition, multiple coups; severe instability."),
    ("Iraq", "Saddam Hussein", 1969): (4, "Saddam's totalitarian Baathist state, Iran-Iraq War (1M dead), Kuwait invasion 1990, Anfal genocide of Kurds, oil-for-food sanctions; severe predatory governance."),
    ("Iraq", "US Occupation", 2003): (5, "US invasion, sectarian civil war, de-Baathification, Sunni insurgency (hundreds of thousands killed), Bremer CPA; state collapse."),
    ("Iraq", "Maliki/ISIS", 2011): (5, "Maliki sectarian governance enabling ISIS conquest of third of Iraq, caliphate Mosul, Iranian-backed militia mobilization; territorial state collapse."),
    ("Iraq", "Post-ISIS Iraq", 2018): (3, "Reconstruction, Iranian militia influence, 2019 Tishreen protests, Sudani government; functional but fragile."),

    # === Israel ===
    ("Israel", "Yishuv/Mandate", 1920): (2, "Jewish community building proto-state institutions in British Palestine — Histadrut, Haganah, kibbutzim; effective pre-state institution-building."),
    ("Israel", "Labor Zionism", 1948): (2, "Ben-Gurion's Mapai dominance, kibbutzim, mass immigration absorption, Six-Day War transformation; effective state-building."),
    ("Israel", "Likud/Begin", 1978): (2, "Begin Likud revolution, Egypt peace, settlements expansion, Lebanon invasion, first intifada; functional democratic governance."),
    ("Israel", "Oslo/Peace Process", 1993): (2, "Oslo Accords framework, Rabin assassination 1995, Second Intifada outbreak; functional democracy through high-stakes peace process."),
    ("Israel", "Second Intifada Era", 2001): (2, "Sharon and Olmert through Second Intifada, separation barrier, Gaza disengagement, 2006 Lebanon War; functional democracy under security stress."),
    ("Israel", "Netanyahu Hegemony", 2009): (2, "Netanyahu Likud-led coalitions, settlement expansion, Nation-State Law 2018, Iran confrontation, Abraham Accords; effective if illiberal-leaning democracy."),
    ("Israel", "Crisis Israel", 2022): (3, "Most-right cabinet, judicial overhaul, largest protests in history, October 7 attack and Gaza war, regional conflict; severe political-security crisis but functioning state."),
    ("Israel", "Ottoman Palestine", 1789): (2, "Ottoman provincial governance, local notables, religious communities; functional imperial governance."),

    # === Algeria ===
    ("Algeria", "Ottoman/French Conquest", 1789): (3, "Ottoman Dey rule ending with French 1830 invasion, brutal conquest with Abd el-Kader resistance; bounded transitional violence."),
    ("Algeria", "French Algeria", 1848): (2, "Algeria as integral French territory with million pieds-noirs dominating Muslim majority; long stable if predatory colonial governance."),
    ("Algeria", "War of Independence", 1954): (5, "FLN brutal decolonization war, Battle of Algiers, French torture, half a million Muslims killed, settler departure; catastrophic war."),
    ("Algeria", "FLN State", 1963): (2, "Boumediene single-party socialist state with hydrocarbons, heavy industry, Non-Aligned leadership; effective revolutionary state-building."),
    ("Algeria", "Black Decade Algeria", 1989): (5, "1991 FIS election annulment triggering civil war (up to 200,000 killed), GIA/AIS insurgency, economic collapse; catastrophic civil war."),
    ("Algeria", "Bouteflika Reconciliation", 2002): (2, "Bouteflika national reconciliation, Islamist amnesty, oil-funded stability, four terms; effective if authoritarian governance."),
    ("Algeria", "Post-Hirak Algeria", 2019): (3, "Hirak protests forcing Bouteflika out, Tebboune low-turnout election, civil-society crackdown; functional authoritarian governance."),

    # === Ethiopia ===
    ("Ethiopia", "Zemene Mesafint/Tewodros", 1789): (3, "Era of the Princes regional warlord fragmentation, Tewodros II forcible reunification; pre-modern fragmentation rather than collapse."),
    ("Ethiopia", "Menelik/Imperial", 1869): (2, "Menelik II's Adwa victory preserving independence, expansionist campaigns southward, imperial state-building; effective late-imperial governance."),
    ("Ethiopia", "Italian Occupation/Haile Selassie", 1936): (3, "Italian occupation 1936-41, then Haile Selassie modernization, OAU founding, ending in 1973-74 famine and revolution; bundled period mostly stable feudal monarchy."),
    ("Ethiopia", "Derg", 1974): (5, "Derg junta under Mengistu, Marxist-Leninist revolution, Red Terror, forced villagization, 1984 famine (1M dead under state policy); catastrophic predatory state."),
    ("Ethiopia", "EPRDF", 1991): (2, "TPLF-led ethnic federalism, Meles developmental state model achieving rapid growth under one-party control; effective if illiberal governance."),
    ("Ethiopia", "Abiy Ahmed", 2018): (5, "Abiy Nobel-winning reforms then Tigray War (600,000 killed), ethnic violence, Amhara/Oromo conflicts, Eritrea border war; catastrophic civil war."),

    # === Morocco ===
    ("Morocco", "Alawi Sultanate", 1789): (2, "Alawi sultanate balancing makhzen authority, tribal autonomy, Islamic legitimacy under growing European pressure; long stable pre-modern monarchy."),
    ("Morocco", "French/Spanish Protectorate", 1912): (2, "French/Spanish protectorate preserving monarchy, settler agriculture, nationalist movements; effective colonial governance."),
    ("Morocco", "Hassan II Monarchy", 1956): (2, "Mohammed V and Hassan II strong monarchy, surviving coup attempts, Years of Lead repression, Western Sahara campaign; effective if repressive monarchy."),
    ("Morocco", "Mohammed VI Monarchy", 1999): (2, "Mohammed VI social reform, development projects, 2011 constitutional revisions absorbing Arab Spring; effective monarchy."),

    # === Libya ===
    ("Libya", "Ottoman/Sanusi Libya", 1789): (2, "Ottoman provinces and Sanusi religious networks; long stable if loose imperial governance with regional autonomy."),
    ("Libya", "Italian Libya/Allied Administration", 1911): (3, "Italian conquest with brutal colonial violence and concentration camps, then WWII Allied administration; severe but bounded colonial period."),
    ("Libya", "Idris Monarchy", 1951): (2, "Idris conservative federal monarchy on Sanusi legitimacy, Western security ties, growing oil wealth; functional but elite-narrow regime."),
    ("Libya", "Qaddafi Jamahiriya", 1969): (2, "Qaddafi's Green Book revolutionary state with oil redistribution, security repression; effective if eccentric long-running authoritarianism."),
    ("Libya", "Post-Qaddafi Fragmentation", 2011): (5, "2011 uprising and NATO intervention overthrowing Qaddafi, competing governments, militias, foreign patrons fighting; state collapse."),

    # === Tunisia ===
    ("Tunisia", "Husainid Beylicate", 1789): (2, "Husainid beys under Ottoman framework with reformist bureaucracy; functional pre-modern governance with growing European pressure."),
    ("Tunisia", "French Protectorate", 1881): (2, "French protectorate retaining bey, settler agriculture, Neo-Destour nationalism; effective colonial governance."),
    ("Tunisia", "Bourguiba Modernization", 1956): (2, "Bourguiba secular modernization, 1956 Personal Status Code women's rights, mass education, single-party authoritarian; effective state-building."),
    ("Tunisia", "Ben Ali Police State", 1987): (2, "Ben Ali bloodless coup, technocratic police state under RCD, rigged elections, Trabelsi clan corruption; effective if authoritarian governance."),
    ("Tunisia", "Revolution/Constitutional Crisis", 2011): (3, "Arab world's most successful 2011-19 transition through party compromise; Saied 2021 self-coup and judicial dismantling; functioning but backsliding."),

    # === Angola ===
    ("Angola", "Kongo/Portuguese Angola", 1789): (2, "Portuguese colonial enclaves, slave-export networks, late settler/forced-labor economy; long stable colonial governance."),
    ("Angola", "Liberation/Civil War", 1961): (5, "Anti-colonial war then MPLA-UNITA-FNLA civil war 1975-2002 with Cuban/Soviet/SA/US involvement, 500,000+ dead; catastrophic civil war."),
    ("Angola", "MPLA Oil State", 2002): (2, "MPLA centralized oil state under dos Santos then Lourenço, reconstruction, corruption, limited anti-graft reform; functional dominant-party state."),

    # === Ghana ===
    ("Ghana", "Asante/Gold Coast", 1789): (2, "Asante kingdom, coastal trade, missionary education, cocoa farming, British Gold Coast indirect rule; effective late-colonial governance."),
    ("Ghana", "Nkrumah/One-Party State", 1957): (3, "Nkrumah pan-Africanism, state-led development, drift to one-party personalism ending in 1966 coup; functional but degraded over time."),
    ("Ghana", "Coups/Rawlings Transition", 1966): (3, "Multiple military coups, Rawlings's revolutionary populism PNDC, eventual market reform; coup-prone but state continued."),
    ("Ghana", "Fourth Republic Ghana", 1992): (2, "Africa's more stable multiparty democracy with peaceful NDC-NPP alternation, debt and inequality stress; functional democracy."),

    # === Kenya ===
    ("Kenya", "Swahili/Interior Polities", 1789): (2, "Pre-British Kenyan coast in Swahili-Omani Indian Ocean networks, interior pastoral/age-set societies; functional pre-modern governance."),
    ("Kenya", "British Kenya/Mau Mau", 1895): (3, "British settler colony with land alienation and hut taxes; Mau Mau rebellion 1952-60 with brutal counterinsurgency but functional colonial state."),
    ("Kenya", "Kenyatta KANU Kenya", 1963): (2, "Kenyatta KANU single-party effective rule, Kikuyu elite land redistribution, pro-Western alignment; effective if narrow governance."),
    ("Kenya", "Moi Patronage Kenya", 1978): (3, "Moi 24 years shifting patronage to Kalenjin, KANU sole legal party 1982-91, multiparty return 1992; functional but authoritarian-leaning."),
    ("Kenya", "Multiparty Kenya", 2002): (3, "2002 opposition victory, ethnic coalition politics, severe 2007-08 post-election violence (1100+ dead), 2010 constitution; functional but ethnically stressed democracy."),

    # === Dem. Rep. Congo ===
    ("Dem. Rep. Congo", "Kongo/Luba/Lunda Polities", 1789): (2, "Pre-colonial Congo basin with multiple kingdoms — Kongo, Luba, Lunda — and trading systems; functional plural pre-modern governance."),
    ("Dem. Rep. Congo", "Congo Free State/Belgian Congo", 1885): (5, "Leopold II's Congo Free State extractive predation (millions dead), then Belgian Congo with rubber, minerals, forced labor; catastrophic colonial governance."),
    ("Dem. Rep. Congo", "Independence Crisis/Mobutu Zaire", 1960): (4, "Independence with secession, UN intervention, Lumumba murder, Mobutu kleptocratic dictatorship 32 years; severe predatory rule."),
    ("Dem. Rep. Congo", "Congo Wars", 1997): (5, "First and Second Congo Wars (5-6M dead), nine African armies, Africa's deadliest conflict; catastrophic regional war."),
    ("Dem. Rep. Congo", "Kabila Stabilization", 2003): (4, "Sun City peace, Joseph Kabila formal presidency, Eastern Congo chronic conflict (M23, FDLR, Mai-Mai); severe dysfunction with state operating."),
    ("Dem. Rep. Congo", "Tshisekedi DRC", 2018): (3, "Tshisekedi contested transfer, Eastern conflict M23 escalation, Rwanda involvement; functional but fragile state with bounded eastern conflict."),
}


def main():
    with open(INPUT, "r", encoding="utf-8") as f:
        data = json.load(f)

    out = []
    missing = []
    for country, info in data.items():
        for era in info["eras"]:
            key = (country, era["regime_name"], era["start"])
            if key not in CODES:
                missing.append(key)
                continue
            dys, rationale = CODES[key]
            entry = {
                "country": country,
                "regime_name": era["regime_name"],
                "start": era["start"],
                "dysfunction": dys,
                "rationale": rationale,
            }
            if "end" in era:
                entry["end"] = era["end"]
            out.append(entry)

    if missing:
        print(f"MISSING {len(missing)} entries:")
        for k in missing:
            print(f"  {k}")
        return

    os.makedirs(os.path.dirname(OUTPUT), exist_ok=True)
    with open(OUTPUT, "w", encoding="utf-8") as f:
        json.dump(out, f, indent=2, ensure_ascii=False)

    print(f"Wrote {len(out)} entries to {OUTPUT}")

    # Distribution
    from collections import Counter
    counts = Counter(e["dysfunction"] for e in out)
    total = len(out)
    print("\nDistribution:")
    for k in [1, 2, 3, 4, 5]:
        c = counts.get(k, 0)
        print(f"  {k}: {c} ({100*c/total:.1f}%)")


if __name__ == "__main__":
    main()
