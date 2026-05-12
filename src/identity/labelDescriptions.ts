/**
 * Label descriptions (2026-05-12).
 *
 * Three-sentence prose descriptions keyed by the iconic label strings the
 * composer can emit. Two tiers:
 *
 *   1. LABEL_DESCRIPTIONS — hand-written entries for the 234 unique labels
 *      that appear in DEFAULT_MERGER_TABLE and COMPRESSION_TABLE.
 *   2. composeAtomFallback() — a one-line "you emphasize X, Y, and Z"
 *      generated from per-token fragments when the label is pure lexicon
 *      composition (no merger or compression fired).
 *
 * Lookup: try the exact composed label first; if missing, peel off a
 * leading "Anti-Institutional " / "Anti-Capitalist " prefix and retry on
 * the iconic tail; if still missing, fall back to per-atom synthesis.
 */
import type { TokenEntry } from "./archetypeLabeler.js";

export const LABEL_DESCRIPTIONS: Record<string, string> = {
  // ────────────────────────────────────────────────────────────────────────
  // Merger labels (full-signature handles — 87 entries)
  // ────────────────────────────────────────────────────────────────────────

  "Anarchist": "You believe legitimate political order has to come from voluntary cooperation, not from hierarchical institutions you didn't choose. Compromise feels like complicity, and you'd rather hold a principled line outside the system than win small concessions inside it. The state isn't a tool to be reformed — it's the structure you ultimately want to dismantle.",
  "Anarcho-Capitalist": "You think free markets and voluntary exchange can replace nearly everything the state currently does, including law and order itself. Your worldview combines deep skepticism of government with a strong faith in private contracting and emergent rules. Where libertarians want a small state, you want no state — only owners, customers, and competing private providers.",
  "Bull Moose Progressive": "You back muscular, energetic government action to break up concentrated power and clean up entrenched corruption. You're a believer in expert administration and aggressive reform, but rooted in a traditional civic patriotism rather than a radical critique. Your spiritual ancestor is Theodore Roosevelt: progressive policy, big-stick temperament, no apologies.",
  "Burkean Steward": "You treat society as a fragile inheritance — built up slowly, easily wrecked, and owed to people who haven't been born yet. Change is sometimes necessary, but it should be gradual, careful, and answerable to lived tradition rather than abstract theory. Reform yes; revolution never.",
  "Christian Democrat": "You believe a faithful religious tradition and a generous social-welfare state belong together, not on opposite sides of politics. You support strong family and community structures alongside redistribution, public services, and worker protection. Markets serve people, not the other way around — and the moral framework that gives that claim teeth is explicitly religious.",
  "Christian Socialist": "You read economic justice as a religious obligation, not a policy preference. The early-church model of shared resources, the prophets' indictment of inequality, and modern liberation theology all point you toward redistribution as a moral act. You're often more comfortable with leftist economics than leftist culture.",
  "Civic Traditionalist": "You believe a healthy political community needs shared rituals, shared symbols, and shared rules of conduct that get passed down rather than reinvented each generation. You're not necessarily religious or partisan — but you do think civic life atrophies when nothing is treated as sacred. Citizenship is something you practice, not just hold.",
  "Civil-Rights Liberal": "You take procedural fairness and equal treatment under law as the moral core of politics. Civil-rights victories — the Reconstruction amendments, Brown, the Civil Rights Act — define what good government looks like to you. Where critics see proceduralism as cold or thin, you see it as the only durable foundation for justice.",
  "Class-War Fighter": "You treat politics as a confrontation between economic classes whose interests genuinely cannot be reconciled. Soft-edged rhetoric about shared prosperity strikes you as either naive or actively misleading. The job of the left is to win the fight, not to host the dialogue.",
  "Class-War Leftist": "Your politics start from the conviction that the economic structure is the underlying story, and that the owning class and working class are in a real, ongoing conflict. Cultural and identity battles matter, but only as they connect back to material power. Class first — and class second.",
  "Classical Liberal": "You believe individual liberty, free exchange, and limited government are the conditions under which societies flourish. You're suspicious of concentrated power whether it sits in a corporate boardroom or a regulatory agency. Your reference points are Locke, Smith, and Mill more than any contemporary party platform.",
  "Combative Conservative": "You're willing to fight hard for traditional values, and you've stopped believing the other side is operating in good faith. Strong moral lines, strong rhetoric, and a willingness to use power when you have it define your political style. Civility matters less to you than victory on the questions you consider non-negotiable.",
  "Combative Leftist": "You believe the left wins when it confronts power directly rather than seeking accommodation. Compromise with the right is, in your view, mostly a way of slowing down progress. You're more invested in moral clarity than in coalition arithmetic.",
  "Combative Populist": "You see politics as a fight between ordinary people and a self-dealing elite that has rigged the system. Polite institutionalism strikes you as the very mechanism the elite uses to keep its grip. You back leaders who name the enemy plainly and don't apologize for breaking the table.",
  "Comfortable Bystander": "You're not actively engaged with politics, but you're also not unhappy with how things are going. You vote sometimes, watch occasionally, and trust that the broader system is more or less sound. Your political identity is mostly low-temperature acceptance.",
  "Communitarian Traditionalist": "You believe people are formed by particular communities — families, faiths, neighborhoods, trades — and that politics should defend those bonds against both atomized individualism and centralized bureaucracy. Cultural continuity matters more to you than free-market efficiency. You're skeptical of any program that asks you to think of yourself as just a generic citizen.",
  "Conservative": "You believe time-tested institutions, traditions, and norms encode hard-won knowledge that planners can't easily replace. You're slower to embrace sweeping change than the average voter, not from hostility but from caution. Stability isn't glamorous, but you think it's underrated.",
  "Constitutional Conservative": "You treat the constitutional framework — separation of powers, enumerated rights, federalism — as the central inheritance of American politics. Substantive disputes should be resolved within those forms, not by sidelining them. Originalist or not, you believe procedural fidelity is itself a moral commitment.",
  "Constructivist Progressive": "You believe political institutions and economic arrangements are human-made and therefore changeable — and you want to rebuild them on more equitable foundations. Tradition has no automatic claim if it can't justify itself. Your motivating intuition: we built this, we can build something better.",
  "Continuity Conservative": "You support the conservative tradition's pragmatic, governance-oriented wing: get reelected, run things, keep the lights on, move the dial slowly. You see the populist insurgent wing as both ineffective and reckless. Boring competence is, in your view, a virtue.",
  "Cosmopolitan Capitalist": "You combine an open-borders, free-trade, internationalist worldview with a strong belief in markets and private enterprise. The global economy is, to you, both a fact and a moral good. You're at home in cities, conferences, and capital flows — and uneasy with the nationalist strain of right-wing politics.",
  "Cosmopolitan Liberal": "You believe individual rights and free-market institutions should travel across borders, and that the long arc bends toward integration rather than separation. National identity matters less to you than membership in a broader liberal order. You're the natural constituency for trade deals, immigration, and international institutions.",
  "Cosmopolitan Progressive": "You want a more equal economy and a more open, pluralistic culture, and you think the two reinforce each other. Borders, in-groups, and inherited identity categories all strike you as worth interrogating. Your reference point is the global liberal-left rather than any single national tradition.",
  "Cosmopolitan Reformer": "You believe reasonable policy can deliver a fairer, more open society — and you're not particularly interested in revolutionary rupture. You're an internationalist at heart but pragmatic in method. Technocracy in service of liberal values is the basic formula.",
  "Culture Warrior": "Cultural and moral questions sit at the center of your political identity. You believe the wrong side winning on those questions does real damage that economics can't undo. You're willing to spend political capital on values fights that pragmatists would skip.",
  "Disaffected Contrarian": "You're checked out from the mainstream of both major coalitions and skeptical of the people running them. You vote, when you vote, against rather than for. Trust in institutions has been low for a long time and isn't coming back soon.",
  "Distributist": "You believe ownership of productive property — land, tools, small businesses — should be widely distributed rather than concentrated in either large corporations or the state. Both big capital and big government make you uneasy. Your sympathies often run through Catholic social teaching, agrarianism, and cooperatives.",
  "Eco-Socialist": "You think the climate crisis and the structure of capitalism are the same problem viewed from different angles. Markets, in your view, can't solve a problem they were partly built to cause. Solving the ecological question requires changing who owns and decides — not just upgrading the technology.",
  "Essentialist Traditionalist": "You believe certain features of human nature, the family, and the moral order are fixed givens rather than malleable social constructs. Politics should work with that grain, not against it. You read most utopian projects as attempts to abolish constraints that can't actually be abolished.",
  "Evidence-Based Institutional Conservative": "You hold conservative values but trust expertise and procedural government over populist instinct. Data, institutions, and durable rules are how you think good policy gets made. Your right-of-center politics looks like a serious think tank rather than a rally.",
  "Evidence-Based Institutional Leftist": "You combine left-of-center values with a strong belief in expert administration, evidence-based policy, and durable institutions. You'd rather grind out incremental wins through agencies and statutes than chase movement-style purity. You want the left to govern well, not just protest loudly.",
  "Evidence-Based Institutionalist": "Your politics centers on competent institutions and policies that survive contact with data. Movement passion and ideological purity tests strike you as obstacles to good governance. You're a process maximalist with reformer instincts.",
  "Evidence-Based Progressive": "You back progressive goals but believe they should be tested empirically and refined as evidence accumulates. Slogans don't move you; randomized trials, longitudinal studies, and well-designed programs do. You're the policy-shop wing of the left.",
  "FDR-Style Statesman": "You believe in active, ambitious government leadership that mobilizes the country around shared projects — and you carry a wartime sense of stakes about the consequences of failure. Markets are tools, not gods. Your touchstones are the New Deal and the postwar liberal order it produced.",
  "Goldwater Conservative": "You're a movement conservative in the 1964 mold: limited government, strong national defense, deep suspicion of federal overreach, a willingness to lose elections rather than dilute principles. You're more comfortable with the libertarian-leaning wing of the right than with the populist or theocratic wings. Compromise on first principles strikes you as how conservatism dies.",
  "Good-Government Reformer": "You're motivated by clean process, professional administration, and the elimination of patronage and graft. Procedural reform — civil service rules, transparency, conflict-of-interest law — is the substantive politics for you. Whatever the party, you want competent and accountable government.",
  "Green Progressive": "Environmental sustainability is your political center of gravity, but it's woven through with broader progressive commitments on inequality and democracy. You don't see the climate crisis as a stand-alone issue. Solving it, for you, requires fairer economics and more responsive politics at the same time.",
  "Gut-Politics Fighter": "You trust instinct, lived experience, and moral conviction over wonk-y analysis or institutional process. When the gut says the system is broken, you don't need a study to confirm it. The fights you pick are visceral and personal rather than abstract.",
  "Hamiltonian": "You believe a strong central government, sound finance, robust commerce, and ambitious public investment are how a country builds lasting power. You're skeptical of small-state purism and agrarian nostalgia. Your reference point is the federalist tradition of state-building from the top down.",
  "Heritage Firebrand": "You're a passionate defender of national or cultural heritage and willing to fight publicly for it. The rhetorical register is fervent rather than reserved. Sentimentality about the past is, in your view, a virtue rather than a weakness.",
  "Heritage Guardian": "You see preserving cultural inheritance — language, custom, identity, place — as a primary political duty. You're not necessarily reactionary, but you do think rapid demographic and cultural change deserves more skepticism than it currently gets. Continuity is the value; assimilation is the mechanism.",
  "Identity-Group Activist": "Your politics is organized around the defense and advancement of a specific identity group whose interests, in your view, the mainstream has neglected. Coalition-building flows from that center. Politics, for you, is partly about visibility and recognition, not just policy.",
  "Institutional Conservative": "You trust slow-moving, rules-based institutions to handle disputes better than charismatic leaders or angry crowds. The job of a conservative is to defend that machinery against both populist and progressive impatience. Process is substance.",
  "Institutional Leftist": "You believe the left wins by working through institutions — agencies, statutes, courts, unions, professional bodies — rather than around them. Movement energy matters, but only if it converts into durable policy. You're the long-game wing of the progressive coalition.",
  "Insurgent Equalizer": "You believe the political system is too captured to deliver equality through normal channels, so you back disruptive, movement-style politics aimed at structural change. Reform from inside hasn't worked; the strategy now has to be pressure from outside. The status quo is not a stable resting point.",
  "Integralist": "You believe political authority should explicitly serve a religious moral order rather than treat all comprehensive worldviews as equally valid. You're skeptical of liberal neutrality on the deepest questions. The state, in your view, has to take a side on what the good life actually is.",
  "Jacksonian": "Your politics is rooted in popular sovereignty, plain-folk loyalty, and a willingness to fight enemies — domestic and foreign — without apology. Elite institutions are objects of suspicion rather than reverence. Honor, loyalty, and the gut sense of who's-us define the coalition.",
  "Jacobin Egalitarian": "You believe in radical, root-and-branch leveling of social hierarchies, and you're not bothered by being called extreme for it. Half-measures preserve the very inequalities they claim to fix. The political tradition you draw on is more revolutionary than reformist.",
  "Liberal Internationalist": "You believe a rules-based international order — alliances, institutions, treaties, trade — is the best framework for durable peace and prosperity. You're skeptical of both isolationism and unilateralism. Hard power matters, but legitimacy multiplied by it is what wins long.",
  "Loyal Democrat": "Whatever the candidate, whatever the cycle, you vote Democratic — and you think party loyalty is itself a civic virtue rather than a default of imagination. Your identity is tied to the coalition, not to any particular faction inside it. Defeat is regrouping; betrayal is splitting the ticket.",
  "Loyal Republican": "Whatever the candidate, whatever the cycle, you vote Republican — and you treat party loyalty as a real political commitment rather than mere habit. You'd rather work to shape the coalition from inside than defect over any single issue. The team is the project.",
  "Marxist": "You read history through the lens of class conflict and the mode of production. Capitalism, in your view, is a specific historical formation that can and will be superseded — and the political question is how. Material structures, not ideas in isolation, drive what's possible.",
  "Militant Partisan": "You bring movement-style intensity to electoral politics. The party isn't a halfway house; it's the vehicle, and the goal is to win and use power. You're impatient with both the high-minded independent center and the purity-testing fringes.",
  "Movement Progressive": "You're closely tied to the progressive movement infrastructure — coalitions, organizing groups, advocacy networks — and you measure progress by movement metrics, not just electoral ones. Building durable people power matters as much as winning the next race. The fight is generational.",
  "National Conservative": "You combine cultural traditionalism with a strong, identity-rooted nationalism and a willingness to use the state to defend both. Free-market orthodoxy doesn't constrain you when national interest is at stake. Family, faith, and country sit at the center of your politics.",
  "National Populist": "You see politics as a defense of ordinary people and the national community against detached elites and unaccountable outside forces. Cultural sovereignty matters as much as economic redistribution. You'd cross old left-right lines to back leaders who name those threats clearly.",
  "Neoliberal": "You believe market mechanisms, open trade, and globalization have generated enormous gains that protectionists and populists badly underestimate. Where markets fail, well-designed regulation should target the failure, not replace the market. Growth, mobility, and competition are first-order goods.",
  "Neoliberal Wonk": "You trust market-friendly policy designed by serious technocrats — congestion pricing, carbon taxes, means-tested transfers, evidence-based regulation. Ideological purity, on left or right, gets in the way of policies that would actually work. Your idea of a productive evening involves a working paper.",
  "New Dealer": "You believe in active government using its full toolkit — public works, social insurance, labor protection, financial regulation — to underwrite a broad middle-class economy. Markets are useful tenants of the polity, not its landlords. Your touchstone is the FDR settlement, not its rollback.",
  "One-Nation Conservative": "You're conservative on culture and tradition but generous on the welfare state and economic policy — a Tory in the Disraeli mold rather than the Thatcher one. Social solidarity, you believe, is what makes a nation worth conserving. Pure market liberalism gets the order of priorities wrong.",
  "Paleoconservative": "You combine cultural traditionalism with foreign-policy restraint, immigration skepticism, and a preference for the old, decentralist American republic over the modern administrative state. Neoconservatives strike you as a wrong turn the right took decades ago. Heritage and locality, not global mission, define the project.",
  "Paternalist Conservative": "You believe the state has a duty to shape moral and social outcomes — not just to protect rights — and that responsible authority is something to embrace rather than apologize for. Free-market individualism is, in your view, insufficient to sustain a healthy society. Order, hierarchy, and care belong together.",
  "Pluralist Structuralist": "You think a healthy polity needs many competing centers of power — civil-society groups, sub-national governments, professional bodies — held in workable tension. Concentration of power, public or private, is the underlying danger. Structural diversity, not ideological uniformity, is the goal.",
  "Pragmatic Institutional Leftist": "You hold left-of-center values but you're more interested in what passes and what works than in maximally pure positions. Marginal gains through normal institutional channels add up. The movement's purity tests strike you as a luxury serious politics can't afford.",
  "Principled Cosmopolitan": "You believe the moral circle extends beyond your nation, your culture, and your kin, and that public policy ought to reflect that. Borders, in your view, are administrative tools, not ethical truths. Your principles are abstract by design — they have to apply to strangers too.",
  "Procedural Institutional Leftist": "You believe the left should win through legitimate, rule-bound institutional channels — courts, statutes, agencies, elections — and not through extralegal pressure. Bending procedure to get faster results corrodes the very system that makes left victories durable. Process and substance aren't opposed; they reinforce each other.",
  "Progressive Civic Nationalist": "You combine progressive economic and cultural commitments with a real, affirmative attachment to your national community. National belonging, for you, is something to expand and democratize, not to abandon. The left, in your view, abandons patriotism at its own electoral peril.",
  "Progressive Leftist": "You sit firmly on the left of contemporary politics — on economics, culture, and identity — and you don't see meaningful daylight between those dimensions. The conservative coalition is the opposition, not a partner. Your political project is to move the center of gravity, decisively and over time.",
  "Quiet Traditionalist": "You hold traditional values without making them a public crusade. Your conservatism is lived rather than performed — visible in habits, families, and communities rather than in rallies or column inches. You wish the loud parts of right-wing politics would calm down.",
  "Rawlsian Reformer": "You believe a just society would be the one we'd choose if we didn't yet know our station in life — and you read that thought experiment as a demanding standard for present-day reform. Inequality is permissible only if it improves the position of the worst-off. Liberal proceduralism, deployed seriously, is more radical than its critics suppose.",
  "Reaganite": "You're a movement conservative in the 1980 mold: smaller government, lower taxes, robust national defense, and an optimistic, sunny rhetorical register. You see the Reagan synthesis as the right combination of pieces and the contemporary right's drift away from it as a mistake. Limited government plus muscular foreign policy plus cultural confidence is the formula.",
  "Religious Right": "Your politics is anchored in a religious tradition and the moral framework it provides, especially on family, life, and culture. You see the secular drift of the larger society as the underlying problem most other issues flow from. Coalition with the secular right is instrumental — the values are the point.",
  "Religious Traditionalist": "You believe inherited religious tradition is the deepest source of moral and political wisdom, more reliable than either secular philosophy or popular instinct. Your politics defers to that tradition where modern preferences conflict with it. Adaptation has limits; some commitments don't update.",
  "Rockefeller Republican": "You're an East-Coast Republican in the moderate mold: comfortable with markets, comfortable with regulation, socially liberal, civically minded. The party's contemporary populist wing strikes you as foreign. Your tradition is country-club governance with a pragmatic streak.",
  "Socialist Feminist": "You see economic structure and gendered power as parts of the same system, and you don't think either can be fixed in isolation. Mainstream liberal feminism, in your view, leaves the wage and care economy intact. The redistribution that actually liberates women has to be material.",
  "Statesman Institutional Conservative": "You're a senior-statesman type within the conservative coalition: respected, institutional, reluctant to break norms even when the base wants them broken. You see protecting durable institutions as a deeper conservative duty than winning any one election. Dignity is part of the job description.",
  "Statesman Institutional Leftist": "You're a senior-statesman type within the progressive coalition: institutional, dignified, reluctant to throw the rules over for short-term wins. You believe the long credibility of the left depends on how its leaders carry themselves under pressure. The grown-up wing of the project.",
  "Statesman Institutionalist": "You believe in institutions, in dignity, and in the slow, accountable practice of government. Hot rhetoric and movement insurgency strike you as undignified at best and corrosive at worst. The bearing of a statesman is itself a political stance.",
  "Syndicalist": "You believe workers organizing through their own unions and federations — not parties, not the state — are the legitimate engine of political and economic change. Centralized state socialism strikes you as nearly as alienating as capitalism. The general strike, not the ballot, is the deeper instrument.",
  "Techno-Libertarian": "You believe technology is the central engine of human progress and that markets, individual builders, and minimal regulation are how that engine keeps running. You're suspicious of bureaucratic constraints on innovation. Silicon Valley libertarianism, in some form, is the natural political home.",
  "Technocratic Optimizer": "You believe well-designed policy — informed by data and run by competent professionals — can deliver enormous gains that ideology routinely sacrifices. Cost-benefit analysis isn't cold; it's how serious people show care. Mood-driven politics is something you'd happily replace.",
  "Utopian Socialist": "You believe a fundamentally different and better society is possible — one organized around cooperation, ecological balance, and human flourishing — and you take seriously that vision even when it's far from current reality. Pragmatism that surrenders the horizon isn't pragmatism; it's resignation. Imagination is a political act.",
  "Vanguardist": "You believe disciplined leadership by a politically conscious minority is sometimes necessary to drive structural change that the majority won't yet support. Pure spontaneity gets co-opted; pure parliamentarism gets neutralized. Leadership, theory, and organization are non-negotiable.",
  "Visionary Insurgent": "You back politicians and movements that paint a different future and disrupt the existing political order to get there. Incrementalism strikes you as imagination-deficient rather than realistic. The energy is forward-leaning, not preservationist.",
  "Visionary Progressive": "You believe progressives win by articulating a compelling positive vision, not just by managing decline or correcting injustice. Imagination is itself a political resource. The future ought to be better than the present, and somebody has to draw the picture.",
  "World-Minded Reformer": "Your moral horizon is global, and you back reform agendas that take international solidarity seriously — humanitarian intervention, refugee protection, development, climate. National-interest framing alone strikes you as morally cramped. The relevant 'us' is wider than the passport.",
  "Yellow Dog Democrat": "You'd vote for a yellow dog before a Republican, and you take that party loyalty as identity rather than mere habit. The Democratic coalition is your political home through every internal disagreement. Coalition discipline, not factional purity, is what wins.",

  // ────────────────────────────────────────────────────────────────────────
  // Compression labels (2-token role-archetypes — 155 entries)
  // ────────────────────────────────────────────────────────────────────────

  "Accelerationist": "You believe the system needs to be pushed past its breaking point rather than slowly reformed. Whether the destination is utopian or unknown, the consensus path is a dead end. Hit the gas.",
  "Activist-Conservative": "You're a movement conservative with high engagement: rallies, candidate work, organizing, advocacy. Conservative politics, in your view, requires the same intensity progressives put into theirs. The age of country-club passivity is over on your side too.",
  "Activist-Leftist": "You're a deeply engaged movement leftist who treats organizing as a vocation. Showing up is the baseline; the question is how skilled and strategic the work gets. Politics happens in the streets, the doors, and the meetings — not just on ballots.",
  "Activist-Partisan": "You combine party loyalty with movement-style energy. Your politics isn't a hobby — it's structured volunteer work, party meetings, candidate operations. The coalition is the vehicle, and you help build it.",
  "Activist-Progressive": "Your progressive politics is high-engagement and movement-flavored: protests, organizing, mutual aid, advocacy. You see activism as the engine that pulls the political center of gravity left. Showing up is the practice.",
  "Agrarian Conservative": "You're rooted in a land-based, traditional, often religious conservatism — small towns, family farms, faith communities. Urban cosmopolitanism is, to you, not just different but slightly disorienting. The rhythms of place and season carry moral weight.",
  "Agrarian Populist": "You believe in the dignity of rural producers and the political alliance of farmers, small-town workers, and the laboring poor against finance, monopolies, and metropolitan elites. The historical lineage runs from the People's Party through the New Deal coalition's rural wing. Land, labor, and locality define the politics.",
  "Alienated Bystander": "You've checked out from politics not because nothing matters but because nothing you do seems to. The institutions strike you as gamed, the parties as theater, the candidates as interchangeable. Disengagement is, for now, a defensible response.",
  "Alienated Voter": "You vote, sometimes, but you don't trust the process or the people running it. The choice on the ballot rarely feels like a real one. Your participation is closer to obligation than to enthusiasm.",
  "Antagonist": "You're naturally oriented against the consensus of the moment, whatever it happens to be. Disagreement isn't a side effect of your politics — it's much of the substance. You'd rather sharpen a fight than dull it.",
  "Anti-Capitalist-Radical": "You believe capitalism is the underlying structure that has to be overcome, not merely regulated. Reformist gestures inside the system don't reach the source. The work is to imagine and build the post-capitalist alternative.",
  "Apolitical Voter": "You show up at the polls because you're supposed to, but politics doesn't otherwise occupy you. You don't follow the coverage, you don't argue about it at parties, and you're fine with that. Civic duty, not civic passion.",
  "Bridge-Builder": "You instinctively look for shared ground across political lines. The escalating polarization of contemporary politics strikes you as both ugly and avoidable. Where others want victory, you want a workable settlement.",
  "Bureaucratic": "You trust formal procedure, written rules, and chain-of-command accountability. Charismatic leadership and movement passion both look like risks rather than assets. Process correctness is itself a value.",
  "Civic Activist": "You're a high-engagement participant in civic life: city council meetings, school boards, volunteer boards, community organizing. The closer to home the politics, the more committed you tend to be. Democracy, in your view, is something you have to keep showing up for.",
  "Civic Bystander": "You believe civic engagement is good and important — for other people. Your participation is mostly aspirational rather than actual. The intent is there; the calendar isn't.",
  "Civic-Nationalist-Left": "You combine left-of-center economics with a genuine civic patriotism. National belonging, to you, is something the left should claim and expand rather than cede to the right. Solidarity has a flag.",
  "Civic-Nationalist-Right": "You combine right-of-center cultural commitments with a civic — rather than ethnic — definition of national belonging. The nation is bounded but joinable. You're patriotic and traditional without being exclusionary on first principles.",
  "Civic-Republican": "You believe self-government requires active, virtuous citizens — not just rights-bearing individuals. A free polity is a practice, not a vending machine. Your reference points run from the classical republicans through the American founders' civic tradition.",
  "Civic-Universalist": "You hold a universalist moral horizon together with a strong civic-republican commitment to public life. The nation is one expression of the universal, not its replacement. Cosmopolitan in principle, civic in practice.",
  "Civil-Libertarian": "You take individual rights — speech, conscience, due process, privacy — as nearly inviolable. You'd accept significant costs in efficiency or security to preserve them. The state's expanding power is the recurring worry.",
  "Civil-Rights Activist": "You're a high-engagement participant in civil-rights organizing and advocacy. The unfinished business of equal protection is your day-to-day project. Procedural fairness, in your view, requires constant defense.",
  "Civil-Rights Firebrand": "You bring movement intensity to civil-rights work — confrontational, public, willing to escalate. Reasoned advocacy alone, in your view, is too slow against entrenched resistance. Pressure is the instrument.",
  "Civil-Rights Progressive": "Your progressive politics is centered on the civil-rights tradition — equal protection, anti-discrimination, voting rights. Material and cultural questions matter, but they thread through this core. The unfinished business is the project.",
  "Class-Fighter": "You see economic class as the real underlying axis of politics and you're ready to fight for it. The other side isn't confused; it's the other side. Class consciousness, applied seriously, is what wins.",
  "Class-Particularist": "You're rooted in a particular class identity — its dignities, its grievances, its political needs — rather than in abstract universalism. Cosmopolitan framings can feel like they erase the people you actually care about. Solidarity starts close to home.",
  "Class-Partisan": "You're a deeply partisan voter whose partisanship is fundamentally about class. The party is the vehicle for a class project, not the other way around. You're loyal to the coalition for material reasons.",
  "Class-Warrior": "You don't believe class conflict is a metaphor. The owning class and the working class have real, opposed interests, and politics is the field on which that struggle plays out. Polite framing of the conflict mostly serves the side that's winning.",
  "Combatant": "You take politics as a fight rather than a deliberation. You're skilled at it, energized by it, and not interested in pretending otherwise. Honest opponents are preferable to comfortable consensus.",
  "Communitarian": "You believe people are formed by particular communities — and that liberal individualism understates how much we owe to those communities. The thin self of rights-talk strikes you as morally incomplete. Belonging is a real political category.",
  "Conciliator": "You're the person trying to lower the temperature in the room. Cross-aisle bargaining is, to you, a craft rather than a betrayal. The deal that holds is worth more than the speech that didn't.",
  "Confessionalist": "You believe a specific religious confession provides the framework for both personal and public life. Religious pluralism is a fact, but neutrality among confessions strikes you as itself a kind of position. Your tradition has substantive content.",
  "Consensus Statesman": "You combine institutional dignity with a real talent for building consensus across factions. The hardest political work, in your view, is keeping a coalition together when its pieces would rather split. Bringing people along is the craft.",
  "Conservative-Pluralist": "You're culturally conservative but genuinely pluralist about how others choose to live. You want to preserve your tradition without using the state to require it of strangers. Live and let live, but mean both halves.",
  "Constitutional Statesman": "You combine the dignified bearing of a senior statesman with deep loyalty to the constitutional order. Norms, not just laws, are part of the inheritance you defend. The form holds because particular people choose to honor it.",
  "Constitutionalist": "You believe the written constitutional framework — and the norms around it — is the foundation that lets everything else operate. Both populists and progressives strike you as too willing to bend the rules for the cause of the day. Rules first, even when inconvenient.",
  "Continuity-Conservative": "You back the conservative tradition's governance-oriented wing: serious people, durable institutions, slow change. The insurgent populist wing strikes you as both reckless and ineffective. Boring is a feature, not a bug.",
  "Cooperator": "You believe most political problems can be solved through cooperation rather than confrontation. Zero-sum framing usually misreads the situation. There's almost always a deal in the room if people will look for it.",
  "Cosmopolitan": "Your moral and political imagination is oriented outward — across borders, across cultures, across in-group lines. Particularist attachments matter, but they don't trump universal claims. The relevant community is bigger than the nearest one.",
  "Cosmopolite": "You're at home in the global liberal-cultural milieu — its cities, its media, its institutions. Your tastes, friendships, and worldview are all transnational. The local is real but not central.",
  "Country Preacher": "You combine a pastoral religious sensibility with a rooted, often rural, sense of place. The pulpit and the porch are both legitimate venues for moral talk. Faith is lived in particular communities, not abstracted away from them.",
  "Crusader": "You bring religious or moral fervor to political causes. The stakes are eternal, not just legislative. Half-measures, by definition, betray the underlying commitment.",
  "Custom-Institutionalist": "You trust the slow accretion of custom, precedent, and institutional habit more than written rules or formal theory. The deep wisdom of working systems isn't articulable in advance. You'd rather not redesign from scratch.",
  "Customary Pragmatist": "You combine respect for inherited custom with a workmanlike pragmatism about getting things done. Tradition is the default, but it bends where necessary. You're not the person who sets fire to the rulebook.",
  "Cynic": "You expect bad faith, self-dealing, and decay as the baseline conditions of political life. Naive idealism strikes you as more dangerous than honest realism. You'd rather know who's lying than be told they aren't.",
  "Direct-Action Activist": "You believe the work of politics is direct, embodied action — strikes, occupations, blockades, mutual aid — rather than electoral mediation. Institutional channels are slow, captured, or both. The point is to do, not to petition.",
  "Disengaged-Progressive": "Your values are progressive but your engagement is low. You agree with the cause in the abstract; you're just not living it. The intent is real even when the schedule isn't.",
  "Doctrinaire Conservative": "You hold conservative positions firmly and aren't interested in trading them for short-term compromise. Principles, in your view, are what they are because they're not negotiable. The drift toward expediency on the right is, to you, the underlying problem.",
  "Doctrinaire Progressive": "You hold progressive positions firmly and aren't inclined to trade them for short-term compromise. Principles, in your view, are what they are because they're not negotiable. The drift toward triangulation on the left is, to you, the underlying problem.",
  "Doctrinaire-Idealist": "You hold your ideals firmly and aren't moved by tactical arguments to soften them. Compromise on principle isn't shrewd; it's surrender. The next election matters less than the long shape of the project.",
  "Establishment": "You're comfortable with the existing institutional order and the people who run it. The system isn't perfect, but it's functional, and most insurgents make it worse. Stability under competent management is what good politics looks like.",
  "Establishmentarian": "You believe the established institutions of public life — civil service, party hierarchies, professional bodies — deserve real loyalty. Reformers underestimate how much the working machinery actually does. The system needs maintenance, not demolition.",
  "Evidence-Institutionalist": "You combine respect for institutions with a strong evidentiary discipline. Policy ought to be informed by what the data actually says, refined by professionals, and made durable through institutional channels. Loud arguments without evidence don't move you much.",
  "Faith Activist": "You're a high-engagement participant in faith-based organizing — congregations, denominational networks, religious advocacy groups. Your faith is, among other things, political in practice. The work and the worship are the same thread.",
  "Feminist": "Gender equality is a central commitment in your political identity rather than a side issue. The unfinished business of feminism — wages, care work, autonomy, representation — defines a real agenda. The framework is structural, not just individual.",
  "Feminist Firebrand": "You bring movement intensity to feminist politics — confrontational, public, willing to escalate. The slower channels of liberal feminism, in your view, leave too much intact. Pressure is the instrument.",
  "Folk-Conservative": "You're conservative in a rooted, folk-cultural register rather than in an ideological or institutional one. Plain talk, plain values, plain people. The intellectual right strikes you as overcomplicated.",
  "Folk-Progressive": "You're progressive in a rooted, folk-cultural register rather than in an academic or technocratic one. Solidarity, fairness, mutual aid — in the idiom of ordinary people. The academic left strikes you as overcomplicated.",
  "Free-Market-Disruptor": "You combine strong faith in markets with skepticism of existing institutions — including regulators, incumbents, and credentialed gatekeepers. Disruption is, on balance, good. The future is more pluralistic and more competitive, not less.",
  "Futurist": "You believe technology, science, and ambitious thinking are going to transform the conditions of human life — and politics ought to be oriented toward that horizon rather than the rear-view. Status-quo defensiveness strikes you as a failure of imagination. The next century is the real subject.",
  "Globalist": "You think tightly integrated trade, migration, and international institutions deliver enormous gains that critics routinely underestimate. National-protectionism strikes you as both economically costly and morally cramped. The world economy is a fact and, mostly, a feature.",
  "Good-Government Technocrat": "You believe well-designed, professionally administered policy is most of what good government looks like — and that ideological framing usually gets in the way. Anti-corruption, transparency, evidence-based regulation are the workhorses. The mood is competent rather than charismatic.",
  "Gut-Outsider": "You trust your gut over expert advice, especially when the experts seem to be circling their own interests. The institutional consensus is, in your view, frequently wrong. You'd rather be outside the room than captured by it.",
  "Hard-Liner": "You hold uncompromising positions and you're suspicious of negotiation. Where others see room for a deal, you see a trap. Holding the line is, in your view, the more important political virtue.",
  "Hard-Realist": "You believe politics is mostly about power and scarce resources, and you're impatient with framings that obscure that. Soft-edged moralism doesn't move you. The unsentimental view is, you suspect, also the more honest one.",
  "Hearth-Conservative": "You're conservative in a domestic, family-rooted register — home, neighborhood, congregation. The political world matters less than the smaller world close to you. You'd just like to be left alone to live it.",
  "Heartland Populist": "Your politics is rooted in the geography and culture of the country's interior — small towns, working communities, the heartland. Coastal-elite framings of national life skip you over. The political project is to make sure that doesn't keep happening.",
  "Hobbesian": "You believe order is the prior political good, because without it nothing else holds. Without a clear authority enforcing rules, you suspect, conditions get bad faster than people think. Idealistic political theory ignores how thin the floor really is.",
  "Humanist": "You believe a shared, generally optimistic view of human capacity should anchor politics. Cynicism is often a self-fulfilling prophecy. The point is to build institutions worthy of better outcomes, not to manage decline.",
  "Idealist": "You hold political ideals firmly and you'd rather lose with them intact than win by softening them. The day-to-day grind of politics matters, but only as it serves the longer-arc project. The dream is the point.",
  "Independent": "You don't belong to either major coalition by identity, and you don't intend to start. You vote on the candidate and the moment rather than on the team. Partisan identity strikes you as a thinking shortcut you'd rather not take.",
  "Institutional-Visionary": "You combine ambition about what the future could look like with a serious commitment to building it through durable institutions. Both naive utopianism and pure institutional caretaking fall short. The vision needs the structure; the structure needs the vision.",
  "Insurgent": "You're not interested in working comfortably inside the existing political order. The incumbents — whichever side — are the problem. The political project is to break the consensus and replace it.",
  "Interfaith-Pluralist": "You believe the public square should genuinely host multiple religious and moral traditions on roughly equal terms. Religious life is important — but no single tradition should set the terms for everyone else. Pluralism is real, not just nominal.",
  "Internationalist": "You believe the international order — alliances, treaties, institutions, trade — is a genuine moral and practical project. Withdrawal and unilateralism, in your view, leave both interests and ideals undefended. The relevant community is the world.",
  "Internationalist-Statesman": "You combine the dignified bearing of a senior statesman with deep loyalty to the international liberal order. Alliances, institutions, and the slow work of multilateral diplomacy are how you measure success. The job, properly done, is unglamorous.",
  "Labor Activist": "You're a high-engagement participant in labor organizing — unions, worker centers, contract fights. Class politics, in your view, is built one workplace at a time. The day-to-day is the work.",
  "Leftist": "You hold positions firmly on the left of contemporary politics, on both economic and cultural questions. The political center, in your view, has drifted in directions that need to be reversed rather than accommodated. The work is to move the whole conversation.",
  "Legalist": "You believe disputes should be resolved through formal legal procedure and reasoned argument rather than political pressure. The rule of law is, in your view, the underlying achievement of a free society. Procedure is substance.",
  "Liberal Pragmatist": "You hold liberal values but you're flexible about means. The point is what passes and what works, not what scores best on a purity test. You'd rather win small and durable than lose loud.",
  "Liberal Statesman": "You combine the bearing of a senior statesman with a liberal political program. Dignity, institutional respect, and serious policy are how you carry the work. The substantive politics is reformist; the manner is not.",
  "Liberation-Theologian": "You read religious tradition as fundamentally committed to the poor, the oppressed, and the marginalized. Faith without that commitment, in your view, isn't faithful. Theology and political economy live in the same conversation.",
  "Libertarian": "You believe individual liberty is the central political value and that government power is the recurring threat to it. Markets, voluntary association, and limited state authority are the building blocks. The default answer to most policy questions is fewer rules, not more.",
  "Loyal-Statesman": "You combine the bearing of a senior statesman with deep party or institutional loyalty. The coalition isn't a hindrance; it's the vehicle. The job is to carry it forward with dignity and skill.",
  "Mandarin": "You're a credentialed, professional, institutional operator. The administrative state — and the people who actually run it — does most of the work the public mistakes for politics. Expertise and procedural skill are underappreciated virtues.",
  "Market Technocrat": "You believe markets, properly designed by serious technocrats, are the most powerful tool politics has. Where markets fail, well-targeted regulation should address the failure rather than replace the market. The work is detail-engineering, not slogans.",
  "Market Wonk": "You're an evidence-driven enthusiast for market mechanisms — pricing externalities, designing incentives, evaluating outcomes. Most policy debates, in your view, would benefit from a quieter and more empirical conversation. Working papers are how you relax.",
  "Market-Fundamentalist": "You believe markets are not just useful but morally central, and that interventions in them tend to do more harm than good. The free-market position isn't one ideology among many; it's the underlying truth other ideologies obscure. Free exchange is the default unless proven otherwise.",
  "Maverick": "You go your own way regardless of party line. Coalition discipline matters less to you than calling things as you see them. You'd rather be wrong on your own than right by team instruction.",
  "Militant": "You bring uncompromising intensity to political work. The other side isn't a misguided neighbor; it's the obstacle. You're willing to escalate where polite politics would back off.",
  "Mogul": "You see private enterprise — at scale, ambitious, unapologetic — as a generative force in the world. Building things is its own kind of public good. You're more comfortable with founders than with regulators.",
  "Moral Idealist": "You take moral intuition seriously as a guide to political action. Cold calculation that ignores the moral picture, in your view, ends up serving the wrong things. The right thing to do is often plainer than the strategists make it sound.",
  "Moral Traditionalist": "You believe moral truths are inherited rather than constructed, and that the tradition's verdict deserves more weight than the moment's preferences. Modern moral reinvention strikes you as overconfident. The old answers were old for reasons.",
  "Movement Activist": "You're a high-engagement participant in movement-style politics — organizing, advocacy, mutual aid. The party system, in your view, is something to pressure rather than rely on. Building independent capacity is the long game.",
  "Movement Conservative": "Your conservatism is movement-flavored rather than country-club. You're in the work — rallies, candidate operations, advocacy, coalition-building. The party is the vehicle, but it needs the movement to drive it.",
  "Mugwump": "You prize independent judgment over party loyalty and you're willing to bolt the coalition over corruption or principle. Reform, not faction, is the through-line. The historical lineage runs through nineteenth-century good-government dissidents.",
  "Multiculturalist": "You believe a healthy polity makes room for many cultural communities — language, religion, custom — on terms that respect their integrity. Assimilation is one possible outcome, not the goal. Pluralism is a substantive achievement.",
  "Negotiator": "You're the person looking for the deal. Confrontation is sometimes necessary, but it's mostly a failure of imagination. Most rooms have a settlement nobody's quite found yet.",
  "Old-Guard": "You're a long-tenured insider in your political tradition, comfortable with its institutions and uncomfortable with its insurgents. The rules of the road are mostly fine; the people questioning them are mostly the problem. Stability is the underrated political asset.",
  "Outsider": "You're not at home in either established coalition and you don't want to be. The system rewards the wrong things and protects the wrong people. Distance is, on balance, a virtue.",
  "Party Loyalist": "You stick with the party through whatever cycle, candidate, or controversy comes along. The coalition is the vehicle, and abandoning it serves the opposition. Loyalty over preference, every time.",
  "Party Regular": "You're an institutional partisan — comfortable inside the party apparatus, fluent in its rituals, patient with its compromises. The party is your political home rather than your political project. You belong to it as much as it belongs to you.",
  "Party Warrior": "You bring high-temperature loyalty to partisan politics. The other coalition isn't a partner; it's the opposition, in something close to a literal sense. You'd rather win loud than win quiet.",
  "Patriot Activist": "You're a high-engagement participant in national-pride and patriotic causes. The work is, in your view, civic and structural — defending and advancing the national project. Patriotism is something you practice, not just feel.",
  "Patriot-Firebrand": "You bring movement intensity to national-pride politics. The country, you believe, has enemies — internal and external — that polite framing won't address. The rhetorical register is fervent rather than reserved.",
  "Patriot-Institutionalist": "You combine deep patriotism with respect for the institutional order — courts, agencies, the constitution itself. Loving the country, in your view, means defending the rules that make it work. Sentiment without structure decays.",
  "Patriot-Partisan": "You combine national patriotism with strong partisan identity. The party, in your view, is the practical vehicle for the country's interests. Loyalty to both reinforces rather than conflicts.",
  "Patriot-Pragmatist": "You're a patriot without being a romantic about it. The country's strength is a working concern that requires deals, alliances, and trade-offs. Sentiment is fine; the budget still has to balance.",
  "Patriotic Statesman": "You combine the dignified bearing of a senior statesman with deep, affirmative patriotism. Public service is its own honor. The flag is something you carry rather than wave.",
  "Plain-Partisan": "You're a partisan in a plain, unfussy register. You don't dress up your politics in elaborate theory — you support your side because they're your side. That's enough.",
  "Plainspoken Patriot": "Your patriotism is direct and unornamented. The high-theory framings — civic-republican, ethno-nationalist, whatever — don't really capture it. The country is the country, and you love it.",
  "Policy Broker": "You're the person who turns competing political demands into workable policy compromises. Skill at structuring the deal matters more, in your view, than rhetorical performance. The trade is the craft.",
  "Policy Optimizer": "You're focused on policy that actually delivers measured outcomes. Performative legislation that doesn't move the dial doesn't impress you. The point is the result, not the press release.",
  "Populist-Left": "You back politics that confronts economic elites directly on behalf of working people. Mainstream center-left technocracy, in your view, has been too friendly to capital for too long. The energy belongs to those willing to name the conflict.",
  "Populist-Right": "You back politics that confronts cultural and political elites directly on behalf of ordinary people. The mainstream right's country-club wing, in your view, has been complicit too long. The energy belongs to the insurgent flank.",
  "Pragmatic-Conservative": "You hold conservative values but you're flexible about means. Doctrinal purity, in your view, often loses ground that pragmatic conservatism would have held. You'd rather win small and durable than lose loud.",
  "Producerist": "You believe political legitimacy belongs to people who actually make things — farmers, workers, builders, small-business owners — and not to those who manipulate paper claims on what they make. Finance and rent-seeking strike you as parasitic on real production. The producer-vs-parasite frame is foundational.",
  "Progressive Firebrand": "You bring movement intensity to progressive politics. Compromise within the coalition strikes you as concession before the fight has even started. The rhetorical register is fervent, the strategy is escalation.",
  "Progressive-Unifier": "You believe the progressive coalition wins by holding its different factions together — class-first, identity-first, climate-first, abundance-first — rather than litigating which is the real left. The big tent is the project. Unity is a political skill, not a betrayal.",
  "Prophet": "You speak from a moral or spiritual conviction that doesn't bend to political calculation. The point isn't to persuade the median voter; it's to name what's wrong and demand better. The role is older than democracy.",
  "Provincial-Pluralist": "You're rooted in a particular place and tradition but open to coexistence with others on similar terms. Cosmopolitanism strikes you as thin; tribalism strikes you as ugly. Local plus pluralist is a coherent position.",
  "Quiet-Conservative": "You hold conservative values without making them a public crusade. Your conservatism is lived rather than performed — visible in family, neighborhood, work — not in rallies. You wish the louder parts of the right would calm down.",
  "Reactionary": "You believe modern political life has taken serious wrong turns and that a meaningful response involves reversing rather than incrementally adjusting. Restoration, not reform, is the relevant frame. You're willing to defend positions most contemporaries treat as closed.",
  "Reactionary-Firebrand": "You bring fervent, movement-style intensity to a reactionary politics. Modernity's wrong turns, in your view, need to be confronted directly rather than wished away. The rhetorical register matches the stakes you perceive.",
  "Reformer": "You believe specific, durable changes to existing institutions can deliver substantial improvements over time. Revolution overpromises and underdelivers; pure preservation accepts too much. Useful reform is patient work.",
  "Religious Progressive": "You read your religious tradition as fundamentally committed to social justice, equality, and care for the marginalized. Conservative co-option of religious vocabulary strikes you as a serious misreading. Faith, properly heard, points left as often as it points right.",
  "Religious-Conservative": "Your conservatism is grounded in religious tradition and the moral framework it provides. Cultural questions — family, life, education — flow from that center. Secular conservatism, by itself, doesn't quite reach the depth of the commitment.",
  "Religious-Firebrand": "You bring fervent, movement-style intensity to religiously grounded politics. The moral and spiritual stakes, in your view, justify a register most polite politics rejects. Prophecy, not policy memo.",
  "Rights Feminist": "Your feminism is organized around equal rights under law — anti-discrimination, reproductive autonomy, equal protection. Procedural fairness is the framework. The political work is the slow institutional grind toward equal treatment in practice.",
  "Rule-of-Law Wonk": "You combine an empiricist disposition with a deep commitment to procedural rule-of-law. Strong, predictable rules, transparently enforced, are the load-bearing achievement of liberal politics. Good government has the receipts.",
  "Sectarian": "You see political life as conflict between distinct moral or religious communities whose claims can't easily be harmonized. Universalist framings, in your view, miss how deep the divisions actually run. You'd rather draw the lines clearly than pretend they aren't there.",
  "Self-Reliant": "You believe the basic political unit is the responsible individual — not the family, the community, or the state. Dependency erodes both character and freedom. The political program is to make space for self-reliance, not to substitute for it.",
  "Skeptic": "You hold most political claims at arm's length until they survive scrutiny. Confident certainty, on either side, makes you reach for the question marks. Your default is doubt, not cynicism.",
  "Social Liberal": "You're a liberal in the modern sense: pro-market broadly, but also pro-redistribution, pro-civil-rights, and pro-public-goods. The free market is one tool among several. The welfare state and civil-rights tradition aren't enemies of liberty — they're conditions for it.",
  "Social Planner": "You believe well-designed public policy — administered by serious professionals — can solve problems markets won't. Where market enthusiasts see government failure, you see opportunity for good design. The planner's mood is constructive, not nostalgic.",
  "Social-Democrat": "You believe robust markets and an active welfare state belong together rather than in opposition. Public services, labor protection, and progressive taxation are how capitalism stays compatible with democracy. The model is Nordic rather than libertarian or revolutionary.",
  "Social-Engineer": "You believe institutions and behaviors can be deliberately designed to produce better outcomes. The political project is, at the deepest level, a problem of mechanism design. Skepticism about that program strikes you as defeatism.",
  "Solidarist": "You believe political life is about the bonds of solidarity that hold communities together — not just rights, transactions, or efficiencies. Atomized liberalism misses what people actually need. Mutual obligation is a feature, not a constraint.",
  "Statesman-Style": "You carry a senior-statesman bearing into political work — dignified, institutional, reluctant to break norms. Style and substance, in your view, aren't separable. How leaders carry themselves matters substantively.",
  "Tech-Visionary": "You combine an empiricist disposition with bold, future-oriented ambition about what technology can do. The work is to keep the engines of innovation running. Status-quo defensiveness, on either side, is the recurring obstacle.",
  "Theocrat": "You believe political authority should explicitly serve a religious moral order rather than treat all comprehensive worldviews as equally valid. Liberal neutrality, in your view, is itself a substantive — and wrong — position. The state can't avoid taking a side on the deepest questions.",
  "Tory": "You sit on the older, governance-oriented wing of the conservative tradition — comfortable with the existing institutional order, suspicious of populist or revolutionary energy. The party's role is to keep the system running responsibly. Conservatism, in your view, is a practice rather than a fervor.",
  "Tribal-Capitalist": "You combine in-group loyalty with a strong commitment to private enterprise. The market is a tool; whose market it is matters too. Cosmopolitan capitalism strikes you as missing half the picture.",
  "Ultra-Nationalist": "Your national identity is the deep organizing center of your politics. The nation comes first in a strong sense — culturally, demographically, strategically. You're impatient with frameworks that treat it as just one membership among many.",
  "Universalist-Progressive": "You combine progressive economic and cultural commitments with a moral horizon that runs past borders, faiths, and in-groups. The relevant 'us' is large. Particularist framings strike you as too small for the project.",
  "Utopian": "You hold a serious vision of how human life could be reorganized for the better, and you don't think pragmatism gets to declare that vision off-limits. The picture matters; pragmatism without horizon is just drift. Imagination is itself political work.",
  "Wonk": "You're driven by the substance of policy itself. Most political debate is downstream of design choices, and you'd rather work on the design. The working paper is the unit of progress.",
};

// ──────────────────────────────────────────────────────────────────────────────
// Atomic fragments for the per-atom fallback path.
// One short, descriptive clause per (node, bin) — assembled into a 1-sentence
// summary when no iconic label matched. Categorical and moral-circle tokens
// have their own clauses keyed by the token literal.
// ──────────────────────────────────────────────────────────────────────────────

interface AtomFragment {
  /** Subject-position phrasing: "redistribution and economic equality" */
  what: string;
}

const POSITION_ATOMS: Record<string, Record<string, AtomFragment>> = {
  MAT: {
    low:  { what: "redistribution and economic equality" },
    mid:  { what: "a mixed economy that balances markets and intervention" },
    high: { what: "free markets and private enterprise" },
  },
  CD: {
    low:  { what: "cultural reform and progressive change" },
    mid:  { what: "incremental cultural change" },
    high: { what: "cultural tradition and continuity" },
  },
  CU: {
    low:  { what: "shared civic culture and assimilation" },
    mid:  { what: "civic pluralism on terms of mutual recognition" },
    high: { what: "cultural pluralism and minority preservation" },
  },
  MOR: {
    low:  { what: "loyalty to particular kin and community" },
    mid:  { what: "civic-scale moral obligation" },
    high: { what: "universal moral concern across borders and groups" },
  },
  PRO: {
    low:  { what: "outcomes over procedure" },
    mid:  { what: "pragmatic balance between procedure and outcome" },
    high: { what: "procedural fairness and rule of law" },
  },
  COM: {
    low:  { what: "principled non-compromise" },
    mid:  { what: "practical negotiation on substance" },
    high: { what: "deal-making and coalition arithmetic" },
  },
  ZS: {
    low:  { what: "the possibility of positive-sum cooperation" },
    mid:  { what: "a clear-eyed mix of cooperation and contest" },
    high: { what: "politics as a zero-sum contest for scarce stakes" },
  },
  ONT_H: {
    low:  { what: "a fixed view of human nature and its limits" },
    mid:  { what: "a tempered view of how much people change" },
    high: { what: "human malleability and the possibility of growth" },
  },
  ONT_S: {
    low:  { what: "skepticism of institutional authority" },
    mid:  { what: "selective reform of working institutions" },
    high: { what: "the legitimacy of long-standing institutions" },
  },
  PF: {
    low:  { what: "independence from party affiliation" },
    mid:  { what: "engaged civic life beyond strict partisanship" },
    high: { what: "strong partisan identity" },
  },
  TRB: {
    low:  { what: "inclusive identity that crosses group lines" },
    mid:  { what: "civic-scale belonging without strong group attachment" },
    high: { what: "loyalty to a particular tribe or community" },
  },
  ENG: {
    low:  { what: "low political engagement" },
    mid:  { what: "casual political engagement" },
    high: { what: "high political engagement and activism" },
  },
};

const EPS_ATOMS: Record<string, AtomFragment> = {
  Empiricist:       { what: "an empiricist, evidence-driven way of forming beliefs" },
  Institutionalist: { what: "trust in established institutions as repositories of knowledge" },
  Traditionalist:   { what: "deference to inherited tradition for moral and practical wisdom" },
  Intuitionist:     { what: "trust in moral and gut intuition" },
  Autonomous:       { what: "independent reasoning over deference to authority" },
  Nihilist:         { what: "skepticism that any system reliably tracks the truth" },
};

const AES_ATOMS: Record<string, AtomFragment> = {
  Statesman:  { what: "the dignified, institutional register of statesmanship" },
  Technocrat: { what: "the competent, evidence-driven register of technocracy" },
  Pastoral:   { what: "a folk, rooted, place-based political register" },
  Authentic:  { what: "plain-talking, unpolished authenticity" },
  Fighter:    { what: "a combative, confrontational political register" },
  Visionary:  { what: "an imaginative, future-oriented political register" },
};

const MORAL_CIRCLE_ATOMS: Record<string, AtomFragment> = {
  Universalist:             { what: "moral concern that extends to all human beings equally" },
  Nationalist:              { what: "elevated moral weight on co-nationals" },
  "Religious-Communitarian": { what: "elevated moral weight on co-religionists" },
  "Ethnic-Communitarian":    { what: "elevated moral weight on shared ethnic or racial community" },
  "Class-Conscious":         { what: "elevated moral weight on shared economic class" },
  "Gender-Identitarian":     { what: "elevated moral weight on shared gender experience" },
  "Partisan-Communitarian":  { what: "elevated moral weight on shared ideological camp" },
};

// ──────────────────────────────────────────────────────────────────────────────
// Lookup helpers
// ──────────────────────────────────────────────────────────────────────────────

/** Peel off a leading adjective prefix like "Anti-Institutional " or "Anti-Capitalist ". */
const STRIP_PREFIXES = [
  "Anti-Institutional ",
  "Anti-Capitalist ",
];

function lookupIconic(label: string): string | undefined {
  if (label in LABEL_DESCRIPTIONS) return LABEL_DESCRIPTIONS[label];
  for (const prefix of STRIP_PREFIXES) {
    if (label.startsWith(prefix)) {
      const tail = label.slice(prefix.length);
      if (tail in LABEL_DESCRIPTIONS) return LABEL_DESCRIPTIONS[tail];
    }
  }
  return undefined;
}

/**
 * Build a per-atom fallback when no iconic description applies.
 * Reads up to 3 tokens; chains them as "Your politics centers on X, with
 * secondary themes of Y and Z."
 */
function atomFragment(t: TokenEntry): AtomFragment | undefined {
  if (t.node === "EPS") return EPS_ATOMS[t.token];
  if (t.node === "AES") return AES_ATOMS[t.token];
  if (t.node === "MORAL_CIRCLE") return MORAL_CIRCLE_ATOMS[t.token];
  const node = POSITION_ATOMS[t.node];
  if (!node) return undefined;
  return node[t.bin];
}

export function composeAtomFallback(tokens: TokenEntry[]): string {
  const frags = tokens.map(atomFragment).filter((f): f is AtomFragment => !!f);
  if (frags.length === 0) {
    return "Your political identity didn't concentrate strongly on any single dimension; this respondent profile averages across the available axes.";
  }
  if (frags.length === 1) {
    return `Your political identity centers on ${frags[0]!.what}.`;
  }
  if (frags.length === 2) {
    return `Your political identity centers on ${frags[0]!.what}, with a secondary theme of ${frags[1]!.what}.`;
  }
  return `Your political identity centers on ${frags[0]!.what}, with secondary themes of ${frags[1]!.what} and ${frags[2]!.what}.`;
}

/**
 * Top-level composer. Returns a 3-sentence iconic description when one
 * matches the label; otherwise returns a 1-sentence atom-fallback summary.
 */
export function composeArchetypeDescription(label: string, tokens: TokenEntry[]): string {
  const iconic = lookupIconic(label);
  if (iconic) return iconic;
  return composeAtomFallback(tokens);
}
