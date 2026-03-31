/**
 * Build regimes.json from alignments.json era data
 * Adds rich metadata: regime_name, description, key_figures, flag_emoji, characteristics
 */
const fs = require('fs');
const path = require('path');

const alignments = JSON.parse(fs.readFileSync(path.join(__dirname, 'output/live-data/alignments.json'), 'utf-8'));

// Get all countries and their eras from first archetype
const firstAid = Object.keys(alignments)[0];
const countries = {};
for (const [country, eras] of Object.entries(alignments[firstAid])) {
  countries[country] = eras.map(e => ({ regime: e.r, start: e.s, end: e.e }));
}

// Metadata database
const FLAGS = {
  'United Kingdom': '🇬🇧', 'France': '🇫🇷', 'Germany/Prussia': '🇩🇪', 'Russia/USSR': '🇷🇺',
  'Spain': '🇪🇸', 'Italy': '🇮🇹', 'Austria/Austria-Hungary': '🇦🇹', 'Ottoman Empire/Turkey': '🇹🇷',
  'Poland': '🇵🇱', 'Netherlands': '🇳🇱', 'Sweden': '🇸🇪', 'Portugal': '🇵🇹', 'Greece': '🇬🇷',
  'Belgium': '🇧🇪', 'Switzerland': '🇨🇭', 'Romania': '🇷🇴', 'Hungary': '🇭🇺',
  'Czech/Czechoslovakia': '🇨🇿', 'USA': '🇺🇸', 'Mexico': '🇲🇽', 'Brazil': '🇧🇷',
  'Argentina': '🇦🇷', 'Canada': '🇨🇦', 'Colombia': '🇨🇴', 'Chile': '🇨🇱', 'Cuba': '🇨🇺',
  'Peru': '🇵🇪', 'Venezuela': '🇻🇪', 'China': '🇨🇳', 'Japan': '🇯🇵', 'India': '🇮🇳',
  'Korea': '🇰🇷', 'South Korea': '🇰🇷', 'Indonesia': '🇮🇩', 'Philippines': '🇵🇭',
  'Thailand': '🇹🇭', 'Vietnam': '🇻🇳', 'Iran': '🇮🇷', 'Pakistan': '🇵🇰', 'Egypt': '🇪🇬',
  'South Africa': '🇿🇦', 'Nigeria': '🇳🇬', 'Saudi Arabia': '🇸🇦', 'Iraq': '🇮🇶',
  'Israel': '🇮🇱', 'Algeria': '🇩🇿', 'Ethiopia': '🇪🇹', 'Taiwan': '🇹🇼',
};

// Regime metadata — keyed by country then regime name
const META = {
  'USA': {
    'Federalist Era': { d: 'Post-revolutionary republic under Washington and Adams. Strong central government, commercial economy, British alignment.', f: ['George Washington', 'John Adams', 'Alexander Hamilton'], c: 'Federal republic, elite governance' },
    'Jeffersonian': { d: 'Democratic-Republican dominance. Agrarian vision, westward expansion, limited government, Louisiana Purchase.', f: ['Thomas Jefferson', 'James Madison', 'James Monroe'], c: 'Agrarian republic, democratic expansion' },
    'Jacksonian Democracy': { d: 'Mass democracy, spoils system, Indian removal, Bank War. Common man populism with racist exclusion.', f: ['Andrew Jackson', 'Martin Van Buren', 'James K. Polk'], c: 'Populist democracy, expansionism' },
    'Sectional Crisis': { d: 'Slavery debate dominates. Compromise of 1850, Kansas-Nebraska, Dred Scott. Union fracturing.', f: ['Abraham Lincoln', 'Stephen Douglas', 'John C. Calhoun'], c: 'Democratic crisis, sectional conflict' },
    'Civil War/Reconstruction': { d: 'Civil War, abolition, Reconstruction amendments. Brief experiment in multiracial democracy before white supremacist backlash.', f: ['Abraham Lincoln', 'Ulysses S. Grant', 'Frederick Douglass'], c: 'Wartime republic, radical democracy attempt' },
    'Gilded Age': { d: 'Industrial capitalism, robber barons, weak government, high tariffs, gold standard. Massive inequality and immigration.', f: ['Grover Cleveland', 'William McKinley', 'J.P. Morgan'], c: 'Laissez-faire capitalism, plutocracy' },
    'Progressive Era': { d: 'Trust-busting, labor regulation, women\'s suffrage, Prohibition. Government as reformer. WWI entry.', f: ['Theodore Roosevelt', 'Woodrow Wilson', 'William Howard Taft'], c: 'Reformist republic, regulatory state' },
    'Roaring Twenties/Normalcy': { d: 'Return to isolationism, business-friendly government, cultural modernization, Prohibition enforcement.', f: ['Warren Harding', 'Calvin Coolidge', 'Herbert Hoover'], c: 'Conservative republic, laissez-faire' },
    'New Deal/WWII': { d: 'FDR\'s social safety net, labor rights, WWII mobilization. Birth of the welfare state and American superpower.', f: ['Franklin Roosevelt', 'Harry Truman', 'Eleanor Roosevelt'], c: 'Social democracy, wartime mobilization' },
    'Cold War Consensus': { d: 'Bipartisan anti-communism, civil rights movement, suburban growth, Great Society, Space Race.', f: ['Dwight Eisenhower', 'John F. Kennedy', 'Lyndon Johnson'], c: 'Liberal consensus, Cold War state' },
    'Crisis/Realignment': { d: 'Vietnam, Watergate, stagflation, Iran hostage crisis. Trust in institutions collapses. Southern strategy realigns parties.', f: ['Richard Nixon', 'Jimmy Carter', 'Gerald Ford'], c: 'Democratic crisis, partisan realignment' },
    'Reagan-Clinton': { d: 'Neoliberal consensus: deregulation, free trade, welfare reform. Culture wars begin. End of Cold War to War on Terror.', f: ['Ronald Reagan', 'Bill Clinton', 'George W. Bush'], c: 'Neoliberal democracy, unipolarity' },
    'Polarization Era': { d: 'Extreme partisan polarization, social media, populist movements left and right, institutional distrust, identity politics.', f: ['Barack Obama', 'Donald Trump', 'Joe Biden'], c: 'Hyperpolarized democracy, populist insurgency' },
  },
  'United Kingdom': {
    'Georgian Britain': { d: 'Post-revolutionary reaction, Napoleonic Wars, industrial revolution begins. Landed aristocracy rules.', f: ['George III', 'William Pitt', 'Duke of Wellington'], c: 'Constitutional monarchy, aristocratic rule' },
    'Reform Era': { d: 'Great Reform Act, Chartism, repeal of Corn Laws. Gradual democratization and free trade.', f: ['Earl Grey', 'Robert Peel', 'Lord Palmerston'], c: 'Reformed monarchy, liberalizing' },
    'Victorian Peak': { d: 'Global empire at zenith. Free trade, industrial supremacy, moral reform, limited franchise expansion.', f: ['Queen Victoria', 'Benjamin Disraeli', 'William Gladstone'], c: 'Imperial constitutional monarchy' },
    'Late Victorian/Edwardian': { d: 'New imperialism, Irish question, Labour movement rises, welfare state beginnings.', f: ['Joseph Chamberlain', 'David Lloyd George', 'H.H. Asquith'], c: 'Late imperial, proto-welfare state' },
    'WWI & Lloyd George': { d: 'Total war, Irish independence, women\'s suffrage, post-war settlement.', f: ['David Lloyd George', 'George V'], c: 'Wartime state, democratic expansion' },
    'Interwar': { d: 'General Strike, Great Depression, appeasement. Decline of empire begins.', f: ['Stanley Baldwin', 'Ramsay MacDonald', 'Neville Chamberlain'], c: 'Constitutional monarchy, managed decline' },
    'WWII Britain': { d: 'Blitz, total mobilization, Beveridge Report. Coalition government, wartime solidarity.', f: ['Winston Churchill', 'Clement Attlee', 'George VI'], c: 'Wartime democracy, national unity' },
    'Attlee/Consensus': { d: 'NHS, welfare state, nationalization, decolonization. Broad bipartisan social-democratic consensus.', f: ['Clement Attlee', 'Harold Macmillan', 'Aneurin Bevan'], c: 'Social democracy, welfare state' },
    'Wilson/Heath': { d: 'Decolonization complete, EEC entry, industrial decline, social liberalization, troubles in Northern Ireland.', f: ['Harold Wilson', 'Edward Heath', 'James Callaghan'], c: 'Managed decline, social liberalization' },
    'Thatcher Era': { d: 'Privatization, deregulation, miners\' strike, Falklands. Neoliberal revolution dismantles postwar consensus.', f: ['Margaret Thatcher', 'John Major'], c: 'Neoliberal democracy, free market' },
    'New Labour/Blair': { d: 'Third Way, devolution, Good Friday Agreement, Iraq War. Market-friendly social democracy.', f: ['Tony Blair', 'Gordon Brown'], c: 'Third Way social democracy' },
    'Austerity/Brexit': { d: 'Financial crisis austerity, Scottish referendum, Brexit, culture wars, institutional strain.', f: ['David Cameron', 'Boris Johnson', 'Theresa May'], c: 'Populist turn, post-EU realignment' },
  },
  'France': {
    'Ancien Regime remnant': { d: 'Final years of absolute monarchy. Estates-General convened, revolution imminent.', f: ['Louis XVI', 'Jacques Necker'], c: 'Absolute monarchy, crisis' },
    'French Revolution': { d: 'Radical republic, Terror, Directory. Universal ideals of liberty, equality, fraternity amid violent upheaval.', f: ['Robespierre', 'Danton', 'Napoleon Bonaparte'], c: 'Revolutionary republic, radical democracy' },
    'Napoleonic Empire': { d: 'Authoritarian modernizer. Civil Code, meritocracy, continental hegemony, military genius.', f: ['Napoleon Bonaparte', 'Talleyrand'], c: 'Authoritarian empire, modernizing' },
    'Restoration': { d: 'Bourbon return, constitutional charter, ultraroyalist reaction, liberal opposition grows.', f: ['Louis XVIII', 'Charles X'], c: 'Constitutional monarchy, reactionary' },
    'July Monarchy': { d: 'Citizen King, bourgeois liberalism, industrialization begins, colonial expansion in Algeria.', f: ['Louis-Philippe', 'François Guizot'], c: 'Liberal monarchy, bourgeois rule' },
    'Second Republic': { d: 'Brief democratic experiment, universal male suffrage, quickly overthrown by Louis-Napoleon.', f: ['Louis-Napoleon Bonaparte', 'Lamartine'], c: 'Democratic republic, unstable' },
    'Second Empire': { d: 'Napoleon III\'s authoritarian modernization, Haussmann\'s Paris, colonial expansion, Franco-Prussian defeat.', f: ['Napoleon III', 'Baron Haussmann'], c: 'Authoritarian empire, modernizing' },
    'Third Republic Early': { d: 'Republic consolidates after Commune. Dreyfus Affair, secularism (laïcité), colonial expansion.', f: ['Léon Gambetta', 'Georges Clemenceau', 'Émile Zola'], c: 'Parliamentary republic, secular' },
    'Third Republic Late': { d: 'WWI victory, interwar instability, Popular Front, appeasement, fall to Germany.', f: ['Georges Clemenceau', 'Léon Blum', 'Philippe Pétain'], c: 'Parliamentary republic, unstable' },
    'Vichy France': { d: 'Collaborationist authoritarian regime under German occupation. National Revolution ideology.', f: ['Philippe Pétain', 'Pierre Laval'], c: 'Authoritarian collaborationist' },
    'Fourth Republic': { d: 'Unstable parliamentary democracy, decolonization wars, Marshall Plan recovery, European integration begins.', f: ['Charles de Gaulle', 'Pierre Mendès France'], c: 'Parliamentary republic, colonial crisis' },
    'Fifth Republic Gaullist': { d: 'Strong presidency, nuclear deterrent, independent foreign policy, dirigiste economy.', f: ['Charles de Gaulle', 'Georges Pompidou', 'Valéry Giscard d\'Estaing'], c: 'Presidential republic, dirigiste' },
    'Fifth Republic Modern': { d: 'Alternation left-right, EU integration, immigration debates, terrorism, Yellow Vests.', f: ['François Mitterrand', 'Jacques Chirac', 'Emmanuel Macron'], c: 'Presidential republic, liberal democracy' },
  },
  'Russia/USSR': {
    'Tsarist Russia Late Catherine/Alexander I': { d: 'Enlightened absolutism, Napoleonic Wars victory, Holy Alliance. Serfdom persists.', f: ['Catherine the Great', 'Alexander I'], c: 'Autocratic empire, conservative' },
    'Nicholas I': { d: 'Reactionary autocracy, Decembrist suppression, "Orthodoxy, Autocracy, Nationality," Crimean defeat.', f: ['Nicholas I'], c: 'Reactionary autocracy' },
    'Great Reforms': { d: 'Emancipation of serfs, judicial reform, zemstvos. Modernization from above while maintaining autocracy.', f: ['Alexander II', 'Alexander III'], c: 'Reform autocracy, modernizing' },
    'Reaction/Late Tsarist': { d: 'Pogroms, Russification, industrialization, revolutionary movements grow, Russo-Japanese defeat.', f: ['Nicholas II', 'Sergei Witte', 'Pyotr Stolypin'], c: 'Declining autocracy, revolutionary pressure' },
    'Revolution Era': { d: '1905 revolution, Duma, WWI, February and October Revolutions. End of 300 years of Romanov rule.', f: ['Nicholas II', 'Alexander Kerensky', 'Vladimir Lenin'], c: 'Revolutionary collapse, dual power' },
    'Soviet Early/Lenin': { d: 'War Communism, NEP, Comintern. Revolutionary state consolidates through civil war and famine.', f: ['Vladimir Lenin', 'Leon Trotsky', 'Felix Dzerzhinsky'], c: 'Revolutionary socialist state' },
    'Stalin': { d: 'Collectivization, industrialization, Great Purge, WWII victory. Totalitarian terror and superpower emergence.', f: ['Joseph Stalin', 'Vyacheslav Molotov', 'Lavrentiy Beria'], c: 'Totalitarian communist state' },
    'Khrushchev Thaw': { d: 'De-Stalinization, space race, Cuban Missile Crisis, "peaceful coexistence." Cultural loosening.', f: ['Nikita Khrushchev', 'Yuri Gagarin'], c: 'Reforming communist state' },
    'Brezhnev Stagnation': { d: 'Détente, arms race, economic stagnation, gerontocracy. Military superpower with sclerotic economy.', f: ['Leonid Brezhnev', 'Alexei Kosygin', 'Yuri Andropov'], c: 'Stagnant communist state' },
    'Gorbachev/Collapse': { d: 'Glasnost, perestroika, democratization, Eastern bloc falls, USSR dissolves.', f: ['Mikhail Gorbachev', 'Boris Yeltsin'], c: 'Reforming communist state, collapse' },
    'Yeltsin': { d: 'Shock therapy, oligarchs, Chechen wars, constitutional crisis, economic collapse.', f: ['Boris Yeltsin', 'Yegor Gaidar'], c: 'Chaotic democracy, oligarchy' },
    'Putin Era': { d: 'Centralized power, resource nationalism, Crimea annexation, Ukraine war. Managed democracy to authoritarianism.', f: ['Vladimir Putin', 'Dmitry Medvedev'], c: 'Authoritarian petrostate' },
  },
  'Germany/Prussia': {
    'Prussian Reform Era': { d: 'Post-Jena reforms, liberation wars against Napoleon, bureaucratic modernization.', f: ['Frederick William III', 'Karl vom Stein', 'Karl August von Hardenberg'], c: 'Reform absolutism, military state' },
    'German Confederation': { d: 'Metternich system, Biedermeier culture, censorship, industrialization begins.', f: ['Klemens von Metternich', 'Frederick William IV'], c: 'Conservative confederation, repressive' },
    '1848 Revolution': { d: 'Frankfurt Parliament, liberal-national revolution fails. "Revolution from below" defeated.', f: ['Friedrich Wilhelm IV', 'Robert Blum'], c: 'Failed liberal revolution' },
    'Bismarck Era': { d: 'Unification by "blood and iron," Kulturkampf, anti-socialist laws, welfare state pioneered.', f: ['Otto von Bismarck', 'Wilhelm I', 'Helmuth von Moltke'], c: 'Authoritarian monarchy, welfare state' },
    'Wilhelmine': { d: 'Weltpolitik, naval race, industrial powerhouse, militarism, social tensions.', f: ['Wilhelm II', 'Alfred von Tirpitz'], c: 'Imperial militarism, industrial power' },
    'WWI Germany': { d: 'Total war, Hindenburg Program, revolution, armistice. Military dictatorship in all but name.', f: ['Wilhelm II', 'Paul von Hindenburg', 'Erich Ludendorff'], c: 'Military autocracy, total war' },
    'Weimar Republic': { d: 'Fragile democracy, hyperinflation, golden twenties, Depression, rise of extremism.', f: ['Friedrich Ebert', 'Gustav Stresemann', 'Paul von Hindenburg'], c: 'Parliamentary democracy, unstable' },
    'Nazi Germany': { d: 'Totalitarian dictatorship, racial state, Holocaust, WWII, total destruction.', f: ['Adolf Hitler', 'Heinrich Himmler', 'Joseph Goebbels'], c: 'Totalitarian fascist state' },
    'Occupied Germany': { d: 'Four-zone occupation, denazification, Berlin Blockade, currency reform.', f: ['Konrad Adenauer', 'Lucius Clay'], c: 'Occupied territory, reconstruction' },
    'West Germany/Bonn Republic': { d: 'Economic miracle, NATO, EU founding, social market economy, Ostpolitik.', f: ['Konrad Adenauer', 'Willy Brandt', 'Helmut Kohl'], c: 'Liberal democracy, social market' },
    'East Germany/DDR': { d: 'Soviet satellite, Berlin Wall, Stasi surveillance, planned economy.', f: ['Walter Ulbricht', 'Erich Honecker'], c: 'Communist dictatorship, Soviet satellite' },
    'Reunified Germany': { d: 'Reunification challenges, EU leadership, refugee crisis, energy transition, Ukraine response.', f: ['Helmut Kohl', 'Angela Merkel', 'Olaf Scholz'], c: 'Federal democracy, EU anchor' },
  },
  'China': {
    'Late Qing/Pre-Opium': { d: 'Qing peak and early decline. Population pressure, corruption, Canton system trade.', f: ['Qianlong Emperor', 'Jiaqing Emperor'], c: 'Imperial dynasty, declining' },
    'Opium Wars/Taiping': { d: 'Western forced opening, unequal treaties, Taiping Rebellion kills 20M+. Dynasty near-collapse.', f: ['Daoguang Emperor', 'Hong Xiuquan', 'Zeng Guofan'], c: 'Imperial crisis, semi-colonial' },
    'Self-Strengthening/Reform': { d: 'Modernization attempts, Sino-Japanese War defeat, Hundred Days Reform, Boxer Rebellion.', f: ['Cixi', 'Li Hongzhang', 'Guangxu Emperor'], c: 'Reform autocracy, semi-colonial' },
    'Republic/Warlords': { d: 'End of 2,000 years of empire. Warlord fragmentation, May Fourth Movement, KMT-CPC founded.', f: ['Sun Yat-sen', 'Yuan Shikai'], c: 'Fragmented republic, warlordism' },
    'Nanjing Decade/War': { d: 'KMT consolidation, modernization, Japanese invasion, civil war with Communists.', f: ['Chiang Kai-shek', 'Mao Zedong', 'Song Meiling'], c: 'Authoritarian republic, wartime' },
    'Mao Early': { d: 'Land reform, Korean War, Hundred Flowers. Revolutionary transformation of society.', f: ['Mao Zedong', 'Zhou Enlai', 'Liu Shaoqi'], c: 'Revolutionary communist state' },
    'Mao Radical': { d: 'Great Leap Forward (famine kills 30M+), Cultural Revolution, personality cult, isolation.', f: ['Mao Zedong', 'Lin Biao', 'Jiang Qing'], c: 'Totalitarian communist, radical' },
    'Deng Reform': { d: 'Market reforms, SEZs, Tiananmen Square massacre. "Socialism with Chinese characteristics."', f: ['Deng Xiaoping', 'Zhao Ziyang', 'Hu Yaobang'], c: 'Authoritarian capitalism, reform' },
    'Jiang/Hu Technocratic': { d: 'WTO entry, economic boom, technocratic governance, harmonious society rhetoric.', f: ['Jiang Zemin', 'Hu Jintao', 'Zhu Rongji'], c: 'Technocratic authoritarianism' },
    'Xi Jinping': { d: 'Anti-corruption, Belt and Road, tech surveillance, wolf warrior diplomacy, COVID zero.', f: ['Xi Jinping', 'Li Keqiang', 'Wang Qishan'], c: 'Centralized authoritarianism, neo-Leninist' },
  },
  'Japan': {
    'Late Tokugawa': { d: 'Sakoku isolation, internal tensions, Dutch learning, pre-Perry stability.', f: ['Tokugawa Ienari', 'Tokugawa Ieyoshi'], c: 'Feudal isolation, shogunate' },
    'Bakumatsu/Restoration': { d: 'Perry\'s arrival, unequal treaties, Meiji Restoration overthrows shogunate.', f: ['Emperor Meiji', 'Saigō Takamori', 'Ōkubo Toshimichi'], c: 'Revolutionary modernization' },
    'Meiji': { d: 'Rapid industrialization, constitutional monarchy, military victories over China and Russia.', f: ['Emperor Meiji', 'Itō Hirobumi', 'Yamagata Aritomo'], c: 'Modernizing monarchy, imperial power' },
    'Taishō Democracy': { d: 'Parliamentary democracy expands, party politics, cultural liberalization, WWI ally.', f: ['Emperor Taishō', 'Hara Takashi'], c: 'Parliamentary monarchy, democratic' },
    'Militarist Japan': { d: 'Manchuria invasion, military dictatorship, Greater East Asia Co-Prosperity Sphere, WWII.', f: ['Hirohito', 'Hideki Tojo', 'Isoroku Yamamoto'], c: 'Military dictatorship, imperial fascism' },
    'Occupation/Recovery': { d: 'American occupation, new constitution, land reform, pacifism, Korean War boom.', f: ['Douglas MacArthur', 'Hirohito', 'Yoshida Shigeru'], c: 'Occupied democracy, reconstruction' },
    'High Growth': { d: 'Economic miracle, MITI-led development, LDP dominance, US security alliance.', f: ['Ikeda Hayato', 'Satō Eisaku', 'Tanaka Kakuei'], c: 'Developmental state, one-party democracy' },
    'Lost Decades': { d: 'Bubble burst, deflation, political instability, Fukushima. Economic stagnation with social stability.', f: ['Junichiro Koizumi', 'Yukio Hatoyama'], c: 'Stagnant democracy, aging society' },
    'Abe/Modern Japan': { d: 'Abenomics, remilitarization debate, demographic crisis, alliance strengthening.', f: ['Shinzo Abe', 'Fumio Kishida'], c: 'Conservative democracy, alliance-focused' },
  },
  'India': {
    'Late Mughal/EIC': { d: 'Mughal decline, East India Company expansion, Battle of Plassey, dual governance.', f: ['Aurangzeb (legacy)', 'Robert Clive', 'Warren Hastings'], c: 'Colonial conquest, Company rule' },
    'British Raj': { d: 'Direct Crown rule after 1857 Mutiny, railways, English education, early nationalism.', f: ['Queen Victoria', 'Lord Curzon', 'Bal Gangadhar Tilak'], c: 'Imperial colony, extractive' },
    'Nationalist Movement': { d: 'Non-cooperation, civil disobedience, Muslim League, path to partition and independence.', f: ['Mahatma Gandhi', 'Jawaharlal Nehru', 'Muhammad Ali Jinnah'], c: 'Colonial, independence movement' },
    'Nehruvian India': { d: 'Non-alignment, mixed economy, democratic socialism, IITs, Hindu-Muslim tensions.', f: ['Jawaharlal Nehru', 'Vallabhbhai Patel', 'B.R. Ambedkar'], c: 'Socialist democracy, non-aligned' },
    'Congress Dominance': { d: 'Green Revolution, Bangladesh War, Emergency, assassination. Congress party hegemony.', f: ['Indira Gandhi', 'Lal Bahadur Shastri'], c: 'Dominant-party democracy, centralized' },
    'Coalition Era': { d: 'Mandal Commission, Janata experiments, regional parties rise, economic liberalization begins.', f: ['Morarji Desai', 'V.P. Singh', 'P.V. Narasimha Rao'], c: 'Coalition democracy, liberalizing' },
    'BJP/Shining India': { d: 'Nuclear tests, IT boom, Gujarat riots, India Shining campaign, UPA coalition.', f: ['Atal Bihari Vajpayee', 'Manmohan Singh', 'Sonia Gandhi'], c: 'Competitive democracy, rising power' },
    'Modi Era': { d: 'Hindu nationalism, demonetization, GST, CAA-NRC, digital governance, democratic backsliding concerns.', f: ['Narendra Modi', 'Amit Shah'], c: 'Majoritarian democracy, Hindu nationalist' },
  },
  'Taiwan': {
    'Japanese Colony': { d: 'Japanese colonial modernization. Infrastructure, education, suppression of local identity.', f: ['Gotō Shinpei', 'Kodama Gentarō'], c: 'Colonial rule, modernizing' },
    'KMT Authoritarian': { d: 'Chiang Kai-shek retreats to Taiwan, White Terror, martial law, economic development.', f: ['Chiang Kai-shek', 'Chiang Ching-kuo'], c: 'Authoritarian one-party state, developmental' },
    'ROC Democracy': { d: 'Democratization, first free elections, cross-strait tensions, semiconductor powerhouse, identity formation.', f: ['Lee Teng-hui', 'Chen Shui-bian', 'Tsai Ing-wen'], c: 'Liberal democracy, contested sovereignty' },
  },
  'South Korea': {
    'Korean War/Division': { d: 'Korean War devastation, Syngman Rhee autocracy, April Revolution, extreme poverty.', f: ['Syngman Rhee', 'Kim Il-sung'], c: 'Authoritarian republic, war-torn' },
    'Park/Military': { d: 'Military coup, export-led industrialization, chaebol system, Yushin constitution, assassination.', f: ['Park Chung-hee', 'Kim Jong-pil'], c: 'Developmental dictatorship' },
    'Transition': { d: 'Gwangju Uprising, democratization movement, 1987 constitution, Olympics.', f: ['Chun Doo-hwan', 'Roh Tae-woo', 'Kim Young-sam'], c: 'Democratizing, transitional' },
    'Democratic Consolidation': { d: 'IMF crisis, Sunshine Policy, tech boom, cultural exports (Hallyu).', f: ['Kim Dae-jung', 'Roh Moo-hyun', 'Lee Myung-bak'], c: 'Liberal democracy, tech powerhouse' },
    'Polarized Democracy': { d: 'Impeachment, MeToo, Moon\'s engagement, Yoon\'s conservative turn, demographic crisis.', f: ['Park Geun-hye', 'Moon Jae-in', 'Yoon Suk-yeol'], c: 'Polarized democracy, aging society' },
  },
  'Israel': {
    'Yishuv/Mandate': { d: 'Jewish immigration waves, British Mandate, Arab-Jewish tensions, Holocaust survivors arrive.', f: ['David Ben-Gurion', 'Chaim Weizmann', 'Ze\'ev Jabotinsky'], c: 'Pre-state community, colonial mandate' },
    'Labor Zionism': { d: 'Independence, kibbutz socialism, 1967 War, occupation begins. Labor dominance, secular nationalism.', f: ['David Ben-Gurion', 'Golda Meir', 'Moshe Dayan'], c: 'Social democracy, settler colonialism' },
    'Likud/Begin': { d: 'Right turn, Camp David with Egypt, Lebanon War, settlement expansion, Mizrahi empowerment.', f: ['Menachem Begin', 'Yitzhak Shamir', 'Ariel Sharon'], c: 'Right-wing democracy, militarist' },
    'Oslo/Peace Process': { d: 'Oslo Accords, Rabin assassination, Camp David collapse, Second Intifada.', f: ['Yitzhak Rabin', 'Shimon Peres', 'Ehud Barak'], c: 'Liberal democracy, peace process' },
    'Netanyahu/Right Turn': { d: 'Permanent right-wing government, settlements, Gaza wars, judicial crisis, Oct 7 and aftermath.', f: ['Benjamin Netanyahu', 'Naftali Bennett'], c: 'Right-wing democracy, ethno-nationalist turn' },
  },
};

// For countries without detailed metadata, generate basic entries
function generateBasicMeta(country, regime, start, end) {
  return {
    regime_name: regime,
    description: `${regime} era of ${country} (${start}-${end}).`,
    key_figures: [],
    flag_emoji: FLAGS[country] || '🏳️',
    characteristics: regime
  };
}

// Build the full regimes.json
const regimes = {};
for (const [country, eras] of Object.entries(countries)) {
  regimes[country] = { flag: FLAGS[country] || '🏳️', eras: [] };
  
  for (const era of eras) {
    const countryMeta = META[country];
    const eraMeta = countryMeta && countryMeta[era.regime];
    
    if (eraMeta) {
      regimes[country].eras.push({
        regime_name: era.regime,
        start: era.start,
        end: era.end,
        description: eraMeta.d,
        key_figures: eraMeta.f,
        characteristics: eraMeta.c,
      });
    } else {
      // Generate basic entry
      regimes[country].eras.push({
        regime_name: era.regime,
        start: era.start,
        end: era.end,
        description: `${era.regime} period of ${country}.`,
        key_figures: [],
        characteristics: era.regime,
      });
    }
  }
}

// Write
const outPath = path.join(__dirname, 'output/live-data/regimes.json');
fs.writeFileSync(outPath, JSON.stringify(regimes, null, 2));

// Stats
let totalEras = 0;
let detailedEras = 0;
for (const [country, data] of Object.entries(regimes)) {
  for (const era of data.eras) {
    totalEras++;
    if (era.key_figures.length > 0) detailedEras++;
  }
}
console.log(`regimes.json written: ${Object.keys(regimes).length} countries, ${totalEras} total eras, ${detailedEras} with detailed metadata`);
