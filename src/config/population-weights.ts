/**
 * Population weights for 130 PRISM archetypes.
 *
 * Each value is the estimated fraction of the US adult population that falls
 * into that archetype. Weights sum to 1.0 (within rounding tolerance).
 *
 * Design constraints:
 *   - Conservative + moderate archetypes ≈ 55-60% of total
 *   - Progressive / left archetypes ≈ 35-40%
 *   - Fringe / extreme types ≈ 5-10%
 *   - Produces approximately Biden 51% / Trump 47% under equal-turnout
 *   - Reflects US demographics: rural/urban split, education, income, religion
 */

export const POPULATION_WEIGHTS: Record<string, number> = {

  // ===================================================================
  // PROGRESSIVE ECONOMIC REFORMERS (001-010)
  // Mainstream left — economic redistribution + moderate-to-progressive culture
  // ===================================================================
  '001': 0.007,  // Rawlsian Reformer — academic left, small but vocal
  '002': 0.015,  // Independent Social Democrat — sizable, educated progressives
  '003': 0.012,  // Welfare Modernizer — technocratic left, professional class
  '004': 0.010,  // Labor Reformer — union-adjacent workers, declining but real
  '005': 0.015,  // Public Guardian — public-sector workers, teachers, nurses
  '006': 0.018,  // Fairness Pragmatist — pragmatic progressives, suburban professionals
  '007': 0.005,  // Solidarist Reformer — communitarian left, small
  '008': 0.006,  // Municipal Equalizer — local-government progressives
  '009': 0.010,  // Social Stabilizer — stability-oriented left
  '010': 0.038,  // Bread-and-Butter Progressive — LARGE: kitchen-table Dems

  // ===================================================================
  // RADICAL / INSURGENT LEFT (011-020)
  // Fringe left — class war, anarchism, radical egalitarianism
  // ===================================================================
  '011': 0.003,  // Jacobin Egalitarian — hard-left intellectuals
  '012': 0.003,  // Class-War Leftist — Marxist-adjacent, small
  '013': 0.003,  // Radical Leveler — extreme egalitarian, very small
  '014': 0.004,  // Movement Egalitarian — activist left
  '015': 0.004,  // Moral Firebrand — passionate progressive moralists
  '016': 0.002,  // Insurgent Equalizer — radical redistributionist
  '017': 0.002,  // Uncompromising Redistributionist — no-compromise left
  '019': 0.001,  // Anarchist Mutualist — fringe anarchist
  '020': 0.001,  // Horizontalist Dissenter — fringe anti-hierarchy

  // ===================================================================
  // COSMOPOLITAN / UNIVERSALIST LEFT (021-031)
  // Educated, globally-oriented progressives
  // ===================================================================
  '021': 0.005,  // Kantian Cosmopolitan — philosophical universalist
  '022': 0.010,  // Pluralist Universalist — diversity-focused, suburban educated
  '023': 0.007,  // Rights Cosmopolitan — human-rights focused
  '024': 0.005,  // Ethical Internationalist — foreign-policy left
  '025': 0.006,  // World-Minded Reformer — globally-aware reformist
  '026': 0.008,  // Cosmopolitan Pragmatist — practical internationalist
  '027': 0.006,  // Popperian Liberal — open-society liberal
  '028': 0.005,  // Global Caretaker — humanitarian-focused
  '029': 0.005,  // Liberationist Progressive — identity-liberation left
  '030': 0.010,  // Cultural Pluralist — multiculturalism advocate, sizable
  '031': 0.005,  // Planetary Steward — environmental cosmopolitan

  // ===================================================================
  // TECHNOCRATIC / INSTITUTIONAL LEFT-CENTER (032-040)
  // Evidence-based, systems-thinking, often professional class
  // ===================================================================
  '032': 0.007,  // Hamiltonian Technocrat — state-capacity centrist
  '033': 0.005,  // Systems Modernizer — reform-through-efficiency
  '034': 0.008,  // Evidence Reformer — data-driven progressive
  '035': 0.010,  // Administrative Liberal — gov't-trusting moderate-left
  '036': 0.005,  // Institutional Optimizer — efficiency-focused centrist
  '037': 0.006,  // Fabian Modernizer — gradualist left
  '039': 0.012,  // Data-Driven Moderate — evidence-based centrist, growing
  '040': 0.003,  // Reform Engineer — technocratic reformer

  // ===================================================================
  // COMMUNITARIAN / LOCALIST LEFT (042-052)
  // Community-oriented, often religious or rural left
  // ===================================================================
  '042': 0.006,  // Localist Progressive — community-first leftist
  '043': 0.007,  // Neighborly Egalitarian — neighborly, working-class left
  '045': 0.006,  // Rooted Social Reformer — tradition-respecting left
  '046': 0.005,  // Pastoral Leftist — rural-ish progressive
  '047': 0.006,  // Common-Life Reformer — everyday-life focused
  '048': 0.005,  // Solidaristic Localist — local solidarity
  '049': 0.004,  // Paternal Egalitarian — paternalistic left
  '050': 0.009,  // Religious Leftist — faith-based progressives (Black church, Catholic social teaching)
  '051': 0.005,  // Ecological Localist — green localist
  '052': 0.003,  // Distributist Localist — Chestertonian left, very small

  // ===================================================================
  // MODERATES / CENTRISTS (053-060)
  // True middle — swing voters, median Americans
  // ===================================================================
  '053': 0.012,  // Consensus Builder — bridge-builders, sizable moderate
  '054': 0.010,  // Arbiter Moderate — balanced centrist
  '055': 0.008,  // Halifax Moderate — cautious, risk-averse center
  '056': 0.008,  // Institutional Centrist — institution-trusting middle
  '057': 0.010,  // Temperate Pluralist — tolerant moderate
  '059': 0.012,  // Public-Minded Moderate — civic-minded centrist, common
  '060': 0.012,  // Hinge Citizen — true swing voter, large

  // ===================================================================
  // CLASSICAL / MARKET LIBERALS (061-069)
  // Pro-market, socially moderate-to-liberal
  // ===================================================================
  '061': 0.005,  // Millian Liberal — philosophical libertarian-liberal
  '062': 0.008,  // Meritocratic Liberal — achievement-oriented, suburban
  '063': 0.008,  // Enterprise Pluralist — business-friendly moderate
  '064': 0.015,  // Market Optimist — LARGE: pro-business, suburban professional
  '065': 0.012,  // Opportunity Liberal — aspiration + fairness
  '067': 0.004,  // Free-Exchange Modernist — libertarian-leaning cosmopolitan
  '069': 0.005,  // Bleeding-Heart Libertarian — socially liberal, free-market

  // ===================================================================
  // ESTABLISHMENT CONSERVATIVES (070-079)
  // Traditional, institutional, Burkean right
  // ===================================================================
  '070': 0.010,  // Burkean Steward — thoughtful conservative, educated
  '071': 0.010,  // Constitutional Conservative — founding-principles focused
  '072': 0.006,  // Blackstone Conservative — legal-tradition right
  '073': 0.012,  // Civic Traditionalist — mainstream traditionalism, sizable
  '074': 0.015,  // Responsible Conservative — LARGE: pragmatic, duty-bound right
  '075': 0.009,  // Institutional Conservative — institution-preserving right
  '076': 0.007,  // Fiscal Gradualist — deficit hawks, business right
  '077': 0.006,  // Ordered Libertarian — libertarian w/ social order
  '078': 0.008,  // Meritocratic Conservative — achievement-oriented right
  '079': 0.006,  // National Developmentalist — industrial-policy right

  // ===================================================================
  // CULTURAL / RELIGIOUS CONSERVATIVES (080-089)
  // Tradition, faith, heritage — heartland America
  // ===================================================================
  '080': 0.005,  // Chestertonian Traditionalist — intellectual trad
  '081': 0.008,  // Heritage Guardian — heritage-preservation, sizable in rural
  '082': 0.014,  // Altar-and-Hearth Conservative — LARGE: religious, family-values
  '083': 0.008,  // Sacred-Order Defender — religious right, devout
  '084': 0.004,  // Civilizational Conservative — Western-civ focused
  '085': 0.008,  // Customary Localist — rural tradition-keepers
  '086': 0.010,  // Duty Traditionalist — duty-bound, common in heartland
  '087': 0.008,  // Continuity Conservative — status-quo preference
  '088': 0.010,  // Gentle Traditionalist — moderate trad, non-confrontational
  '089': 0.004,  // Integral Traditionalist — hardline trad, small

  // ===================================================================
  // ORDER / SECURITY CONSERVATIVES (090-097)
  // Law-and-order, authority, national security
  // ===================================================================
  '090': 0.004,  // Hobbesian Guardian — security-absolutist
  '091': 0.007,  // Security Paternalist — nanny-state right
  '092': 0.006,  // Disciplined Majoritarian — majority-rule enforcer
  '093': 0.010,  // Stability-First Voter — risk-averse, order-preference
  '094': 0.003,  // Hard-State Manager — authoritarian-leaning, small
  '095': 0.002,  // Emergency Orderist — crisis-authoritarian, fringe
  '096': 0.006,  // Civic Disciplinarian — rules-focused conservative
  '097': 0.007,  // Authority Pragmatist — pragmatic law-and-order

  // ===================================================================
  // RIGHT POPULISTS (098-107)
  // Anti-elite, tribal, grievance-driven
  // ===================================================================
  '098': 0.010,  // Anti-Elite Populist — Trumpian base, suspicious of elites
  '099': 0.008,  // Scarcity Populist — economic anxiety + traditionalism
  '100': 0.003,  // Tribal Insurgent — extreme tribal politics
  '101': 0.008,  // Embattled Majoritarian — feels under siege, sizable
  '102': 0.008,  // Folk Tribune — folk-populist, rural working-class
  '103': 0.005,  // Grievance Mobilizer — grievance-driven activist
  '104': 0.008,  // National Protector — security-patriot populist
  '105': 0.004,  // Combative Populist — confrontational populist
  '106': 0.003,  // Leader-Centered Insurgent — personality-cult follower
  '107': 0.006,  // Resentful Localist — rural resentment, modest size

  // ===================================================================
  // DISENGAGED / ALIENATED (108-112, 115)
  // Low political engagement, cynical, withdrawn
  // ===================================================================
  '108': 0.010,  // Passive Cynic — checked out, distrustful, common
  '109': 0.008,  // Alienated Outsider — feels excluded from system
  '110': 0.005,  // Principled Abstainer — deliberate non-participant
  '111': 0.003,  // Diogenes Independent — philosophical non-joiner
  '112': 0.003,  // Contrarian Intellectual — contrarian for contrarianism
  '115': 0.008,  // Quietist — prefers to stay out of politics

  // ===================================================================
  // LOW-ENGAGEMENT MAINSTREAM (116-124)
  // Apolitical, casual, everyday Americans who don't follow politics closely
  // ===================================================================
  '116': 0.015,  // Quiet Middle — LARGE: silent majority, don't think about politics
  '117': 0.013,  // Comfortable Bystander — doing fine, not engaged
  '118': 0.010,  // Survival Pragmatist — focused on getting by
  '119': 0.008,  // Apolitical Striver — too busy working to care
  '120': 0.011,  // Good Neighbor — community but not political
  '121': 0.008,  // Spectator Citizen — watches but doesn't act
  '122': 0.006,  // Civic Minimalist — minimal political participation
  '124': 0.006,  // Crisis-Activated Sleeper — only engages in emergencies

  // ===================================================================
  // PARTISAN IDENTIFIERS (125-133)
  // Politics as team sport, identity, habit
  // ===================================================================
  '125': 0.010,  // Reluctant Partisan — holds nose, votes party
  '126': 0.008,  // Single-Issue Activator — one issue drives all voting
  '127': 0.009,  // Tribal Loyalist — party-over-everything
  '128': 0.018,  // Loyal Democrat — reliable Dem voter, sizable
  '129': 0.015,  // Loyal Republican — reliable GOP voter, sizable
  '130': 0.008,  // Legacy Partisan — inherited partisanship
  '131': 0.018,  // Duty Voter — LARGE: votes because they should, common
  '132': 0.010,  // Negative Partisan — votes against, not for
  '133': 0.008,  // Sporadic Alarm Voter — votes only when alarmed

  // ===================================================================
  // CROSS-CUTTING / HYBRID (134-140)
  // Don't fit neatly into left-right — cross-pressured types
  // ===================================================================
  '134': 0.008,  // Progressive Civic Nationalist — left-patriot hybrid
  '135': 0.003,  // Disruptive Cosmopolitan — techno-libertarian disruptor
  '136': 0.005,  // Aspirational Traditionalist — upward-mobile social conservative
  '137': 0.004,  // Prophetic Revivalist — religious renewal movement
  '138': 0.004,  // Holistic Dissenter — holistic/alternative politics
  '139': 0.006,  // Civic Assimilationist — assimilation-focused patriot
  '140': 0.004,  // Market Green Modernist — green capitalism
};
