/**
 * Historical US Presidential Candidate Profiles (1960-2024)
 *
 * Each candidate is coded on the 14 PRISM nodes representing the political
 * SIGNAL they sent to voters - their platform, rhetoric, and persona - not
 * their private beliefs.
 *
 * Continuous nodes: 1-5 scale (see CLAUDE.md for pole definitions)
 * Categorical nodes (EPS, AES): index into the 6-category arrays
 *   EPS: 0=empiricist, 1=institutionalist, 2=traditionalist, 3=intuitionist, 4=autonomous, 5=nihilist
 *   AES: 0=statesman, 1=technocrat, 2=pastoral, 3=authentic, 4=fighter, 5=visionary
 */
// ─────────────────────────────────────────────────────────────────────────────
// ─────────────────────────────────────────────────────────────────────────────
// 1940: FDR vs Willkie
// ─────────────────────────────────────────────────────────────────────────────
// FDR: Third-term bid. New Deal architect, wartime mobilization beginning,
// interventionist as Europe fell. Maximum institutional confidence.
// Willkie: Corporate lawyer, internationalist Republican who supported Lend-Lease.
// Attacked FDR's third term and bureaucratic overreach, not the New Deal itself.
const election1940 = {
    year: 1940,
    candidates: [
        {
            name: "Roosevelt",
            party: "Democratic",
            year: 1940,
            MAT: 1, // Maximum redistribution - New Deal architect, WPA, Social Security
            CD: 2, // Culturally open - progressive for era, but pre-civil-rights
            CU: 4, // Internationalist - Lend-Lease, Atlantic Charter
            MOR: 4, // Wide moral circle - "four freedoms," refugees (limited in practice)
            PRO: 3, // Mixed - stretched executive power but through institutions
            COM: 4, // Master dealmaker - coalition builder
            ZS: 2, // Positive-sum - "abundance for all," economic expansion
            ONT_H: 4, // Optimistic - "nothing to fear but fear itself"
            ONT_S: 4, // Structuralist - government as solution to systemic failures
            PF: 5, // Maximum partisan - built the New Deal coalition
            TRB: 3, // Moderate tribal - broad coalition, not in-group focused
            ENG: 5, // Maximum engagement - sought unprecedented third term
            EPS: 1, // Institutionalist - trusted government machinery
            AES: 0, // Statesman - patrician, fireside chats, gravitas
        },
        {
            name: "Willkie",
            party: "Republican",
            year: 1940,
            MAT: 5, // Pro-market - opposed New Deal expansion, business freedom
            CD: 4, // Culturally conservative-leaning - business establishment
            CU: 3, // Mixed - internationalist but America-first economics
            MOR: 2, // Narrow - business class, not universalist
            PRO: 5, // Maximum proceduralist - attacked executive overreach, third-term norm
            COM: 3, // Mixed - accepted some New Deal but attacked most
            ZS: 3, // Mixed
            ONT_H: 2, // Skeptical - government can't fix everything
            ONT_S: 1, // System fine - free enterprise works, government is the problem
            PF: 4, // Ran as strong Republican despite being newcomer
            TRB: 3, // Moderate - business coalition identity
            ENG: 4, // Energetic campaign
            EPS: 0, // Empiricist - business pragmatist
            AES: 3, // Authentic - outsider, plain-spoken
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1944: FDR vs Dewey
// ─────────────────────────────────────────────────────────────────────────────
// FDR: Fourth-term wartime president. D-Day, Yalta. Exhausted but iconic.
// Dewey: Young NY governor, prosecutor. Ran on competence and efficiency.
// "Had enough?" campaign against wartime bureaucracy and aging FDR.
const election1944 = {
    year: 1944,
    candidates: [
        {
            name: "Roosevelt",
            party: "Democratic",
            year: 1944,
            MAT: 1, // Same New Deal economics, plus wartime spending
            CD: 2, // Culturally open - but wartime constraints (Japanese internment)
            CU: 5, // Maximum internationalist - UN architect, Allied leader
            MOR: 4, // Wide moral circle - fighting fascism, "four freedoms"
            PRO: 3, // Mixed - wartime executive power, but through institutions
            COM: 4, // Dealmaker - Yalta, Allied coordination
            ZS: 2, // Positive-sum - postwar planning, Bretton Woods
            ONT_H: 4, // Optimistic - victory within reach
            ONT_S: 4, // Structuralist - government as war machine and social safety net
            PF: 5, // Maximum partisan
            TRB: 3, // National unity rhetoric - "our boys"
            ENG: 5, // Maximum - fourth-term bid during world war
            EPS: 1, // Institutionalist
            AES: 0, // Statesman - commander-in-chief gravitas
        },
        {
            name: "Dewey",
            party: "Republican",
            year: 1944,
            MAT: 5, // Pro-market — criticized New Deal spending
            CD: 5, // Maximum conservative — establishment
            CU: 1, // Maximum assimilationist
            MOR: 1, // Maximum narrow
            PRO: 5, // Maximum proceduralist
            COM: 3, // Mixed
            ZS: 3, // Mixed
            ONT_H: 2, // Skeptical
            ONT_S: 1, // System fine
            PF: 5, // Maximum partisan
            TRB: 3, // Moderate
            ENG: 3, // Lower — cautious campaign
            EPS: 0, // Empiricist - prosecutor, facts-based
            AES: 1, // Technocrat - efficient manager image
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1948: Truman vs Dewey vs Thurmond vs Wallace
// ─────────────────────────────────────────────────────────────────────────────
// Truman: Came from behind. Fair Deal, desegregated military, Berlin Airlift.
// "Give 'em hell Harry." Ran against "do-nothing Congress."
// Dewey: Rematch. Ran cautious front-runner campaign. Overconfident.
// Thurmond: Dixiecrat - segregationist revolt against civil rights plank.
// Wallace (Henry): Progressive Party - left-wing, pro-Soviet accommodation.
const election1948 = {
    year: 1948,
    candidates: [
        {
            name: "Truman",
            party: "Democratic",
            year: 1948,
            MAT: 1, // Maximum redistribution - Fair Deal, national healthcare attempt
            CD: 2, // Culturally open - desegregated military, civil rights plank
            CU: 4, // Internationalist - Marshall Plan, NATO, containment
            MOR: 4, // Wide moral circle - civil rights courage, Berlin Airlift
            PRO: 3, // Mixed - strong executive, "the buck stops here"
            COM: 3, // Mixed - fighter, not dealmaker ("do-nothing Congress")
            ZS: 2, // Positive-sum - Marshall Plan, postwar prosperity
            ONT_H: 4, // Optimistic - America can lead the free world
            ONT_S: 3, // Mixed - system needs reform (Fair Deal) but basically sound
            PF: 5, // Maximum partisan - attacked Republican Congress relentlessly
            TRB: 3, // Moderate tribal - working-class identity, "regular guy"
            ENG: 5, // Maximum engagement - whistle-stop tour, never-give-up
            EPS: 1, // Institutionalist - trusted government, Truman Doctrine
            AES: 4, // Fighter - "Give 'em hell Harry"
        },
        {
            name: "Dewey",
            party: "Republican",
            year: 1948,
            MAT: 5, // Pro-market - opposed Fair Deal expansion
            CD: 4, // Culturally conservative - establishment values
            CU: 2, // Assimilationist leaning - America-first
            MOR: 2, // Narrow moral frame - business establishment
            PRO: 5, // Maximum proceduralist - prosecutor, above-the-fray
            COM: 4, // Compromiser - ran cautious, non-confrontational campaign
            ZS: 3, // Mixed
            ONT_H: 2, // Skeptical - government overreach concern
            ONT_S: 1, // System fine - stable management, less government
            PF: 4, // Strong Republican
            TRB: 3, // Moderate tribal
            ENG: 3, // Lower engagement - overconfident, coasted
            EPS: 0, // Empiricist - technocratic
            AES: 0, // Statesman - dignified, above-the-fray
        },
        {
            name: "Thurmond",
            party: "Dixiecrat",
            year: 1948,
            MAT: 3, // Mixed - supported New Deal economics for whites
            CD: 5, // Maximum cultural conservatism - segregation
            CU: 1, // Maximum assimilationist/closed - racial hierarchy, states' rights
            MOR: 1, // Maximum narrow moral circle - whites only
            PRO: 2, // Anti-proceduralist - states' rights to override federal law
            COM: 1, // Never compromise - walked out of convention
            ZS: 5, // Maximum zero-sum - racial competition for resources
            ONT_H: 2, // Pessimistic - feared social change
            ONT_S: 4, // System broken - federal overreach destroying southern way of life
            PF: 3, // Regional partisan - not national party man
            TRB: 5, // Maximum tribal - white southern identity
            ENG: 5, // Maximum engagement - launched entire party over civil rights
            EPS: 2, // Traditionalist - "way things have always been"
            AES: 4, // Fighter - insurgent, defiant
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1952: Eisenhower vs Stevenson
// ─────────────────────────────────────────────────────────────────────────────
// Eisenhower: Supreme Allied Commander. "I like Ike." Moderate Republican,
// military hero, above-party appeal. Promised to end Korean War.
// Stevenson: Illinois governor, intellectual, eloquent. "Egghead" label.
// Ran on New Deal continuation, wit, and policy depth.
const election1952 = {
    year: 1952,
    candidates: [
        {
            name: "Eisenhower",
            party: "Republican",
            year: 1952,
            MAT: 4, // Pro-market lean - balanced budgets, limited government expansion
            CD: 3, // Culturally moderate - not a culture warrior
            CU: 3, // Mixed - NATO but also "America first" resonance with base
            MOR: 3, // Centrist moral frame - duty over ideology
            PRO: 5, // Maximum proceduralist - military institutionalist, chain of command
            COM: 4, // Pragmatic compromiser - "middle way" politics
            ZS: 2, // Positive-sum - postwar prosperity, "peace through strength"
            ONT_H: 3, // Moderate realism - military pragmatist
            ONT_S: 2, // System working - protect and manage it
            PF: 3, // Moderate partisan - ran as Republican, attracted independents
            TRB: 3, // Moderate - military patriotic identity, "our boys"
            ENG: 5, // Maximum engagement - running for president is maximum engagement
            EPS: 0, // Empiricist - military planning, evidence-based
            AES: 0, // Statesman - supreme commander, gravitas
        },
        {
            name: "Stevenson",
            party: "Democratic",
            year: 1952,
            MAT: 1, // Maximum redistributive - full New Deal expansion
            CD: 1, // Culturally open - intellectual, progressive, "egghead"
            CU: 5, // Maximum internationalist - UN, multilateral, cosmopolitan
            MOR: 5, // Maximum universalist - humanitarian concern, broad moral circle
            PRO: 4, // Proceduralist - lawyer, institutional
            COM: 4, // Compromiser - pragmatic liberal
            ZS: 2, // Positive-sum - optimistic liberal
            ONT_H: 5, // Maximum optimistic - believed deeply in human progress
            ONT_S: 4, // System needs big reform - government as instrument of good
            PF: 5, // Maximum Democrat - New Deal heir
            TRB: 3, // Moderate tribal - intellectual elite identity
            ENG: 4, // Engaged but "egghead" aloofness
            EPS: 0, // Empiricist - "the thinking man's candidate"
            AES: 5, // Visionary - eloquent idealist
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1956: Eisenhower vs Stevenson (rematch)
// ─────────────────────────────────────────────────────────────────────────────
// Eisenhower: Incumbent. Interstate Highway System, prosperous peacetime.
// Heart attack in 1955 raised health questions. Still hugely popular.
// Stevenson: Rematch. More forceful this time. Called for nuclear test ban.
// Suez Crisis and Hungarian Revolution boosted Ike's commander image.
const election1956 = {
    year: 1956,
    candidates: [
        {
            name: "Eisenhower",
            party: "Republican",
            year: 1956,
            MAT: 3, // Same centrist economics - highway act, balanced budgets
            CD: 3, // Moderate - sent troops to Little Rock (reluctantly)
            CU: 4, // Internationalist - Suez response, NATO
            MOR: 3, // Centrist
            PRO: 5, // Maximum proceduralist - institutional, rule-of-law (Little Rock)
            COM: 4, // Pragmatic - "middle way"
            ZS: 2, // Positive-sum - peace and prosperity
            ONT_H: 3, // Moderate realism
            ONT_S: 1, // System working well - prosperity, peace, stability
            PF: 2, // Low partisan - above-party, national figure
            TRB: 2, // Low tribal - father figure to nation
            ENG: 4, // Engaged incumbent
            EPS: 0, // Empiricist - military planning background
            AES: 0, // Statesman - beloved grandfather-commander
        },
        {
            name: "Stevenson",
            party: "Democratic",
            year: 1956,
            MAT: 1, // Maximum redistributive - expanded New Deal vision
            CD: 1, // Culturally open - civil rights support, progressive intellectual
            CU: 5, // Maximum internationalist - nuclear test ban, UN
            MOR: 5, // Maximum universalist - humanitarian, nuclear concern
            PRO: 4, // Proceduralist
            COM: 3, // Less compromising this time - sharper attacks
            ZS: 2, // Positive-sum
            ONT_H: 5, // Maximum optimistic - progress narrative
            ONT_S: 4, // System needs big reform - "New America"
            PF: 5, // Maximum partisan - stronger party identity second time
            TRB: 4, // Higher tribal - rallying the base, us-vs-them
            ENG: 5, // Maximum engagement - fighting harder second time
            EPS: 0, // Empiricist
            AES: 5, // Visionary - nuclear test ban, "New America"
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1960: Kennedy vs Nixon
// ─────────────────────────────────────────────────────────────────────────────
// Kennedy: New Frontier liberalism, Catholic, youthful vigor, Cold War hawk,
// pro-civil-rights (cautiously), Keynesian economics. Projected elegance,
// institutional confidence, and optimistic modernism.
// Nixon: Eisenhower's VP, moderate Republican, anti-communist credentials,
// experienced insider, pragmatic centrist. Ran on competence and continuity.
const election1960 = {
    year: 1960,
    candidates: [
        {
            name: "Kennedy",
            party: "Democratic",
            year: 1960,
            MAT: 2, // Mildly redistributive - New Frontier spending, but not radical
            CD: 2, // Culturally open but within Catholic bounds
            CU: 4, // Internationalist - Peace Corps, Alliance for Progress
            MOR: 3, // Center - Catholic traditionalism + secular modernism
            PRO: 4, // Institutionalist - rule of law, Cold War institutions
            COM: 4, // Willing to deal - pragmatic liberal
            ZS: 2, // Mostly positive-sum - "rising tide lifts all boats"
            ONT_H: 4, // Optimistic about human potential - "ask what you can do"
            ONT_S: 3, // Mix of individual initiative and government programs
            PF: 4, // Strong Democrat identity
            TRB: 3, // Moderate tribal - Catholic identity, but broadening coalition
            ENG: 5, // Politics as calling - "ask what you can do for your country"
            EPS: 1, // Institutionalist - trusted expertise and government
            AES: 0, // Statesman - projected elegance and gravitas
        },
        {
            name: "Nixon",
            party: "Republican",
            year: 1960,
            MAT: 4, // Pro-market but accepted New Deal baseline
            CD: 3, // Culturally moderate - suburban middle America
            CU: 3, // Internationalist but America-first undertones
            MOR: 3, // Moderate on morality - not culture warrior
            PRO: 4, // Proceduralist - rule of law, anti-communist legalism
            COM: 4, // Pragmatic dealmaker (pre-Watergate Nixon)
            ZS: 3, // Mixed - Cold War competition but domestic optimism
            ONT_H: 3, // Moderate realism about human nature
            ONT_S: 2, // Individualist-leaning
            PF: 4, // Strong Republican partisan
            TRB: 3, // Middle-class tribal identity
            ENG: 5, // Career politician, deeply engaged
            EPS: 1, // Institutionalist - government experience
            AES: 0, // Statesman - tried to project gravitas (less successfully)
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1964: Johnson vs Goldwater
// ─────────────────────────────────────────────────────────────────────────────
// Johnson: Great Society, War on Poverty, Civil Rights Act, Medicare. Maximum
// New Deal liberalism. Master legislator. "We shall overcome."
// Goldwater: "Extremism in defense of liberty is no vice." Anti-New Deal,
// states' rights, hawkish Cold Warrior. Shattered consensus politics.
const election1964 = {
    year: 1964,
    candidates: [
        {
            name: "Johnson",
            party: "Democratic",
            year: 1964,
            MAT: 1, // Maximum redistribution - Great Society, War on Poverty
            CD: 2, // Culturally open - signed Civil Rights Act
            CU: 4, // Universalist - civil rights, global engagement
            MOR: 3, // Southern traditionalist personally, but signed progressive laws
            PRO: 3, // Ends-oriented - "whatever it takes" legislative arm-twisting
            COM: 4, // Master dealmaker - greatest legislative arm-twister in history
            ZS: 2, // Positive-sum - abundance mentality, Great Society for all
            ONT_H: 4, // Optimistic - believed government could improve society
            ONT_S: 4, // Structuralist - systemic programs
            PF: 5, // Party-is-identity - master Democrat
            TRB: 4, // Strong coalition tribal politics
            ENG: 5, // Politics was his life
            EPS: 1, // Institutionalist - trusted government machinery
            AES: 0, // Statesman (with pastoral southern touches)
        },
        {
            name: "Goldwater",
            party: "Republican",
            year: 1964,
            MAT: 5, // Maximum free-market - wanted to abolish New Deal programs
            CD: 4, // Culturally conservative - states' rights, opposed CRA
            CU: 2, // Particularist - America first, skeptical of UN
            MOR: 3, // Not a moralist - libertarian streak, personal tolerance
            PRO: 4, // Constitutional proceduralist - strict constructionist
            COM: 1, // Never compromise - "extremism in defense of liberty"
            ZS: 3, // Mixed - Cold War zero-sum, domestic freedom
            ONT_H: 2, // Conservative realism - skeptical of social engineering
            ONT_S: 1, // Maximum individualist - minimal government
            PF: 3, // Party loyalist but also insurgent within party
            TRB: 3, // Ideological tribe more than ethnic/class
            ENG: 5, // Deeply engaged - movement conservative
            EPS: 4, // Autonomous - principled first-principles reasoning
            AES: 3, // Authentic - spoke his mind regardless of consequences
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1968: Nixon vs Humphrey vs Wallace
// ─────────────────────────────────────────────────────────────────────────────
// Nixon: "Law and order," Silent Majority, Southern Strategy. More conservative
// than 1960 Nixon. Peace with honor in Vietnam.
// Humphrey: Happy Warrior, LBJ's VP, Great Society defender, civil rights
// champion, hurt by Vietnam association.
// Wallace: Segregationist, populist, "Segregation now, tomorrow, forever."
// Working-class white resentment. Third-party spoiler.
const election1968 = {
    year: 1968,
    candidates: [
        {
            name: "Nixon",
            party: "Republican",
            year: 1968,
            MAT: 4, // Pro-market but accepted welfare state basics
            CD: 4, // Law and order, Silent Majority - culturally conservative signal
            CU: 3, // Internationalist (détente) but America-first undertones
            MOR: 4, // Appealed to traditional values, moral majority
            PRO: 3, // Pragmatic - willing to bend rules (foreshadowing)
            COM: 3, // Dealmaker but hardline rhetoric
            ZS: 3, // Mixed - us vs. them rhetoric, but pragmatic
            ONT_H: 2, // Pessimistic about human nature - realpolitik
            ONT_S: 2, // Individualist - personal responsibility rhetoric
            PF: 4, // Strong Republican
            TRB: 4, // Silent Majority tribal appeal
            ENG: 5, // Career politician
            EPS: 1, // Institutionalist - worked the system
            AES: 0, // Statesman - projected authority
        },
        {
            name: "Humphrey",
            party: "Democratic",
            year: 1968,
            MAT: 2, // Redistributive - Great Society continuation
            CD: 2, // Culturally open - civil rights record
            CU: 4, // Internationalist - UN champion, liberal internationalism
            MOR: 3, // Moderate morality
            PRO: 4, // Proceduralist - institutional liberal
            COM: 5, // Maximum compromiser - "happy warrior," consensus-seeker
            ZS: 2, // Positive-sum - politics of joy
            ONT_H: 4, // Optimistic about human nature
            ONT_S: 4, // Structuralist - government programs
            PF: 5, // Strong Democrat partisan
            TRB: 3, // Coalition builder
            ENG: 5, // Lifelong politician
            EPS: 1, // Institutionalist
            AES: 5, // Visionary - idealistic rhetoric
        },
        {
            name: "Wallace",
            party: "American Independent",
            year: 1968,
            MAT: 2, // Economic populist - pro-worker, anti-elite
            CD: 5, // Maximum cultural closure - segregationist
            CU: 1, // Maximum particularist - white southern identity
            MOR: 5, // Maximum traditional morality
            PRO: 1, // Ends-justify-means - willing to defy courts
            COM: 1, // Never compromise - defiant
            ZS: 5, // Maximum zero-sum - racial/cultural competition
            ONT_H: 1, // Deeply pessimistic - human nature fixed, hierarchical
            ONT_S: 2, // Individualist with paternalist streak
            PF: 1, // Independent - rejected both parties
            TRB: 5, // Maximum tribal - white southern identity
            ENG: 5, // Deeply politically engaged
            EPS: 3, // Intuitionist - gut-level politics
            AES: 4, // Fighter - combative, defiant
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1972: Nixon vs McGovern
// ─────────────────────────────────────────────────────────────────────────────
// Nixon: Now incumbent. Détente with China/USSR, EPA, wage/price controls.
// Pragmatic operator. Landslide winner.
// McGovern: Anti-war, New Left, "acid, amnesty, and abortion" (unfair but
// the perception). Maximum progressive. Lost 49 states.
const election1972 = {
    year: 1972,
    candidates: [
        {
            name: "Nixon",
            party: "Republican",
            year: 1972,
            MAT: 3, // More centrist as president - wage controls, EPA
            CD: 4, // Silent Majority, law and order
            CU: 3, // Détente - pragmatic internationalism
            MOR: 4, // Traditional values appeal
            PRO: 3, // Pragmatic - willing to bend rules
            COM: 4, // Dealmaker - bipartisan governance, EPA, China opening
            ZS: 3, // Mixed - détente positive-sum, domestic messaging mixed
            ONT_H: 3, // Moderate - realpolitik
            ONT_S: 3, // Center - created EPA, but individual responsibility rhetoric
            PF: 4, // Strong Republican
            TRB: 3, // Broad appeal - "Silent Majority" was deliberately broad
            ENG: 5, // Career politician
            EPS: 0, // Empiricist as president - data-driven détente
            AES: 0, // Statesman - presidential, "peace with honor"
        },
        {
            name: "McGovern",
            party: "Democratic",
            year: 1972,
            MAT: 1, // Maximum redistribution - demogrant proposal
            CD: 1, // Maximum cultural openness - counterculture affinity
            CU: 5, // Maximum universalist - anti-war, global peace
            MOR: 1, // Maximum secular progressivism - "acid, amnesty, abortion"
            PRO: 2, // Anti-establishment - challenged party rules
            COM: 1, // Uncompromising on principles - anti-war absolutism
            ZS: 1, // Maximum positive-sum - "come home, America"
            ONT_H: 5, // Maximum perfectibility - believed in transformation
            ONT_S: 5, // Maximum structuralist - systemic change
            PF: 2, // Challenged party establishment - insurgent
            TRB: 2, // New Left - narrow coalition, alienated traditional Dems
            ENG: 5, // Deeply engaged - movement politics
            EPS: 0, // Empiricist - professor, policy wonk
            AES: 5, // Visionary - idealistic moral appeal
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1976: Carter vs Ford
// ─────────────────────────────────────────────────────────────────────────────
// Carter: Post-Watergate outsider, born-again Christian, peanut farmer,
// "I'll never lie to you." Southern moderate Democrat. Human rights focus.
// Ford: Accidental president, healer after Watergate, moderate Republican,
// pardoned Nixon. Steady, uncharismatic, institutional.
const election1976 = {
    year: 1976,
    candidates: [
        {
            name: "Carter",
            party: "Democratic",
            year: 1976,
            MAT: 2, // Mildly redistributive - but fiscally cautious
            CD: 3, // Center - southern Christian but progressive on race
            CU: 4, // Internationalist - human rights foreign policy
            MOR: 4, // Traditional morality - born-again Christian
            PRO: 5, // Maximum proceduralist - "I'll never lie to you," integrity
            COM: 4, // Willing to deal - pragmatic
            ZS: 2, // Positive-sum - optimistic outsider
            ONT_H: 4, // Optimistic - "why not the best?"
            ONT_S: 3, // Mixed - government reform, not expansion
            PF: 3, // Democrat but ran as outsider to party
            TRB: 3, // Southern identity, broad coalition
            ENG: 4, // Engaged but projected citizen-politician
            EPS: 3, // Intuitionist - moral/faith-based reasoning
            AES: 2, // Pastoral - peanut farmer, small-town authenticity
        },
        {
            name: "Ford",
            party: "Republican",
            year: 1976,
            MAT: 5, // Pro-market — Republican economics, vetoed spending bills
            CD: 4, // Conservative — establishment Republican values
            CU: 3, // Mixed
            MOR: 3, // Moderate
            PRO: 5, // Maximum proceduralist — healer, institutional
            COM: 5, // Maximum compromise — "nightmare is over"
            ZS: 2, // Positive-sum
            ONT_H: 3, // Moderate
            ONT_S: 1, // System fine — pardoned Nixon to "move on," nothing broken
            PF: 5, // Maximum partisan — lifelong Republican
            TRB: 2, // Low tribal
            ENG: 3, // Lower — uninspiring campaigner
            EPS: 1, // Institutionalist - congressional creature
            AES: 0, // Statesman - steady, presidential
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1980: Reagan vs Carter vs Anderson
// ─────────────────────────────────────────────────────────────────────────────
// Reagan: "Morning in America" optimism, supply-side economics, strong defense,
// small government, traditional values. Transformative conservative. The Great
// Communicator. Coalition of evangelicals, hawks, and free-marketeers.
// Carter: Incumbent, malaise, hostage crisis, inflation. Ran on competence
// and character but projecting weakness.
// Anderson: Liberal Republican running independent. Fiscally conservative,
// socially liberal. Intellectual, wonkish.
const election1980 = {
    year: 1980,
    candidates: [
        {
            name: "Reagan",
            party: "Republican",
            year: 1980,
            MAT: 4, // Pro-market - supply-side, tax cuts, but not abolishing safety net
            CD: 4, // Culturally conservative - traditional values coalition
            CU: 3, // American exceptionalism - patriotic internationalist, not isolationist
            MOR: 4, // Traditional morality - evangelical alliance, but not fire-and-brimstone
            PRO: 3, // Mixed - respected institutions but anti-government rhetoric
            COM: 4, // Great Communicator - worked across aisle, pragmatic when needed
            ZS: 2, // Positive-sum - "rising tide lifts all boats," optimistic
            ONT_H: 4, // Optimistic about Americans - believed in their potential
            ONT_S: 2, // Individualist - "government IS the problem" but not extreme
            PF: 4, // Strong Republican - transformed the party
            TRB: 4, // Strong tribal - "real Americans" appeal
            ENG: 5, // Deeply engaged - movement leader
            EPS: 3, // Intuitionist - gut conviction, moral clarity
            AES: 5, // Visionary - "morning in America," transformative optimism
        },
        {
            name: "Carter",
            party: "Democratic",
            year: 1980,
            MAT: 2, // Same as 1976 but more cautious
            CD: 3, // Center
            CU: 4, // Internationalist - human rights
            MOR: 4, // Traditional morality - born-again
            PRO: 5, // Maximum proceduralist - integrity
            COM: 3, // Less compromising as incumbent - stubborn
            ZS: 3, // More pessimistic - "malaise" speech
            ONT_H: 3, // Less optimistic - humbled by office
            ONT_S: 3, // Mixed
            PF: 4, // Stronger partisan as incumbent
            TRB: 3, // Moderate tribal
            ENG: 4, // Engaged but exhausted
            EPS: 0, // Empiricist - engineer's mindset, detail-oriented
            AES: 2, // Pastoral - but less effective
        },
        {
            name: "Anderson",
            party: "Independent",
            year: 1980,
            MAT: 4, // Fiscally conservative
            CD: 2, // Socially liberal
            CU: 4, // Internationalist
            MOR: 2, // Secular-leaning despite personal faith
            PRO: 5, // Proceduralist - rule of law, institutional
            COM: 4, // Compromiser - bipartisan appeal
            ZS: 2, // Positive-sum - optimistic moderate
            ONT_H: 4, // Optimistic
            ONT_S: 3, // Mixed
            PF: 1, // Maximum independent - rejected own party
            TRB: 1, // Low tribal - explicitly anti-tribal
            ENG: 4, // Engaged - ran despite impossible odds
            EPS: 0, // Empiricist - policy wonk
            AES: 1, // Technocrat - intellectual, professorial
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1984: Reagan vs Mondale
// ─────────────────────────────────────────────────────────────────────────────
// Reagan: Incumbent, "Morning in America," peak optimism, strong economy,
// Cold War strength. Maximum presidential.
// Mondale: Old-guard liberal, honest about taxes ("I'll raise your taxes"),
// Ferraro VP pick. Traditional New Deal Democrat.
const election1984 = {
    year: 1984,
    candidates: [
        {
            name: "Reagan",
            party: "Republican",
            year: 1984,
            MAT: 4, // Pro-market but governed pragmatically - didn't touch Social Security
            CD: 3, // Broad cultural appeal - optimistic, not punitive
            CU: 3, // American exceptionalism - but "Mr. Gorbachev, tear down this wall" is universalist
            MOR: 4, // Traditional morality - but sunny, not fire-and-brimstone
            PRO: 4, // Worked with Tip O'Neill - respected institutional process
            COM: 4, // Great Communicator - master compromiser in practice
            ZS: 1, // Maximum positive-sum - "it's morning in America"
            ONT_H: 4, // Optimistic about Americans - peak "shining city on a hill"
            ONT_S: 2, // Individualist-leaning - but not extreme
            PF: 5, // Maximum party leader - defined the GOP
            TRB: 3, // Broad appeal - won 49 states by transcending tribes
            ENG: 5, // Maximum engagement - dominant president
            EPS: 3, // Intuitionist - gut conviction, moral clarity
            AES: 5, // Visionary - peak "morning in America"
        },
        {
            name: "Mondale",
            party: "Democratic",
            year: 1984,
            MAT: 1, // Maximum redistribution - old-guard New Deal liberal
            CD: 2, // Culturally open - perceived as liberal
            CU: 4, // Internationalist
            MOR: 2, // Secular-leaning - perceived as permissive by swing voters
            PRO: 4, // Institutionalist - process-oriented
            COM: 4, // Compromiser - coalition politician
            ZS: 3, // "We need to raise taxes" - sacrifice framing
            ONT_H: 3, // Less optimistic - "let's be honest" downer messaging
            ONT_S: 5, // Maximum structuralist - big-government liberal image
            PF: 5, // Maximum Democrat - party creature
            TRB: 4, // Labor/union tribal - narrow coalition
            ENG: 5, // Career politician
            EPS: 1, // Institutionalist - establishment
            AES: 0, // Statesman - tried to project gravitas but lacked charisma
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1988: Bush vs Dukakis
// ─────────────────────────────────────────────────────────────────────────────
// Bush: Reagan's VP, "kinder, gentler nation," Ivy League patrician,
// "read my lips: no new taxes," Willie Horton ad. Competent manager.
// Dukakis: Massachusetts technocrat, "competence not ideology," tank photo,
// famously unemotional. Policy wonk governor.
const election1988 = {
    year: 1988,
    candidates: [
        {
            name: "Bush",
            party: "Republican",
            year: 1988,
            MAT: 4, // Pro-market - "no new taxes" (initially)
            CD: 4, // Culturally conservative - Willie Horton, flag/pledge
            CU: 3, // Internationalist - UN ambassador, CIA director
            MOR: 4, // Traditional values - "thousand points of light"
            PRO: 4, // Proceduralist - institutionalist background
            COM: 4, // Pragmatic - "kinder, gentler"
            ZS: 2, // Positive-sum - "kinder, gentler nation"
            ONT_H: 3, // Moderate
            ONT_S: 2, // Individualist-leaning
            PF: 4, // Strong Republican - Reagan's heir
            TRB: 3, // Patrician - less tribal than Reagan
            ENG: 4, // Career public servant
            EPS: 1, // Institutionalist - foreign policy establishment
            AES: 0, // Statesman - patrician dignity
        },
        {
            name: "Dukakis",
            party: "Democratic",
            year: 1988,
            MAT: 2, // Mildly redistributive - Massachusetts liberal
            CD: 1, // Culturally very open - ACLU member, perceived as too liberal
            CU: 4, // Universalist
            MOR: 1, // Secular progressive - wouldn't say death penalty even for wife's murder
            PRO: 5, // Maximum proceduralist - "competence not ideology"
            COM: 4, // Pragmatic compromiser
            ZS: 2, // Positive-sum - economic manager
            ONT_H: 4, // Optimistic - technocratic confidence
            ONT_S: 4, // Structuralist - government solutions
            PF: 4, // Strong Democrat
            TRB: 2, // Low tribal - technocratic appeal
            ENG: 4, // Engaged - governor/manager
            EPS: 0, // Empiricist - data-driven, technocratic
            AES: 1, // Technocrat - "competence not ideology"
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1992: Clinton vs Bush vs Perot
// ─────────────────────────────────────────────────────────────────────────────
// Clinton: "New Democrat," triangulation, "it's the economy, stupid,"
// "I feel your pain." Third Way - market-friendly liberalism. Charismatic
// baby boomer. DLC movement.
// Bush: Incumbent, broke "no new taxes" promise, Gulf War success but
// "it's the economy, stupid." Seemed out of touch.
// Perot: Self-funded billionaire, deficit hawk, NAFTA opponent, charts
// and graphs, Reform Party precursor. Anti-establishment outsider.
const election1992 = {
    year: 1992,
    candidates: [
        {
            name: "Clinton",
            party: "Democratic",
            year: 1992,
            MAT: 3, // Centrist - "end welfare as we know it," pro-business Democrat
            CD: 2, // Culturally open - boomer, saxophone, Arsenio Hall
            CU: 4, // Internationalist - free trade, global engagement
            MOR: 3, // Center - "safe, legal, and rare" on abortion
            PRO: 3, // Pragmatic - ends-oriented, "whatever works"
            COM: 5, // Maximum compromiser - triangulation, "Third Way"
            ZS: 1, // Maximum positive-sum - "it's the economy" optimism
            ONT_H: 4, // Optimistic - "a place called Hope"
            ONT_S: 3, // Mixed - market solutions + government investment
            PF: 4, // Strong Democrat - but "New Democrat"
            TRB: 3, // Broad coalition - Bubba + professionals
            ENG: 5, // Maximum political animal
            EPS: 0, // Empiricist - policy wonk, "putting people first"
            AES: 3, // Authentic - "I feel your pain," personal connection
        },
        {
            name: "Bush",
            party: "Republican",
            year: 1992,
            MAT: 4, // Pro-market but raised taxes
            CD: 3, // Culturally moderate - patrician, not culture warrior
            CU: 4, // Internationalist - "new world order," Gulf War coalition
            MOR: 3, // Moderate traditional
            PRO: 4, // Institutionalist
            COM: 4, // Pragmatic - broke tax pledge to deal
            ZS: 3, // Mixed
            ONT_H: 3, // Moderate
            ONT_S: 2, // Individualist-leaning
            PF: 4, // Strong Republican
            TRB: 3, // Patrician, low-tribal
            ENG: 4, // Career public servant
            EPS: 1, // Institutionalist
            AES: 0, // Statesman - "résumé candidate"
        },
        {
            name: "Perot",
            party: "Independent",
            year: 1992,
            MAT: 4, // Fiscally conservative - deficit hawk
            CD: 3, // Moderate - populist center
            CU: 2, // Particularist - anti-NAFTA, "giant sucking sound"
            MOR: 3, // Moderate
            PRO: 3, // Mixed - pragmatic businessman
            COM: 2, // Low compromise - outsider, won't play the game
            ZS: 4, // Zero-sum on trade - "they're taking our jobs"
            ONT_H: 3, // Moderate - practical businessman
            ONT_S: 2, // Individualist - business-oriented
            PF: 1, // Maximum independent
            TRB: 2, // Anti-establishment, low tribal
            ENG: 4, // Engaged - ran despite no political background
            EPS: 0, // Empiricist - charts and graphs, data-driven
            AES: 1, // Technocrat - businessman with spreadsheets
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 1996: Clinton vs Dole
// ─────────────────────────────────────────────────────────────────────────────
// Clinton: Incumbent, booming economy, triangulation mastery, "bridge to
// the 21st century." Welfare reform, crime bill, balanced budget.
// Dole: WWII veteran, Senate majority leader, old-guard Republican.
// Tax cuts. "Where's the outrage?" Bob Dole in third person.
const election1996 = {
    year: 1996,
    candidates: [
        {
            name: "Clinton",
            party: "Democratic",
            year: 1996,
            MAT: 3, // Centrist - welfare reform, balanced budget
            CD: 2, // Culturally open - but "V-chip," school uniforms
            CU: 4, // Internationalist - Kosovo, global trade
            MOR: 3, // Center - "bridge to 21st century"
            PRO: 3, // Pragmatic
            COM: 5, // Maximum compromise - triangulation perfected
            ZS: 1, // Maximum positive-sum - booming economy
            ONT_H: 4, // Optimistic
            ONT_S: 3, // Mixed
            PF: 4, // Strong Democrat
            TRB: 3, // Broad coalition
            ENG: 5, // Maximum engagement
            EPS: 0, // Empiricist - "what works"
            AES: 0, // Statesman - presidential incumbent
        },
        {
            name: "Dole",
            party: "Republican",
            year: 1996,
            MAT: 4, // Pro-market - 15% tax cut proposal
            CD: 4, // Culturally conservative - "where's the outrage?"
            CU: 3, // Internationalist - WWII veteran, NATO supporter
            MOR: 4, // Traditional values
            PRO: 4, // Proceduralist - Senate institutionalist
            COM: 4, // Dealmaker - Senate culture
            ZS: 3, // Mixed
            ONT_H: 2, // Conservative realism - WWII generation
            ONT_S: 2, // Individualist-leaning
            PF: 5, // Maximum partisan - career Republican
            TRB: 3, // Moderate tribal - old-guard, not populist
            ENG: 5, // Career politician
            EPS: 1, // Institutionalist - Senate creature
            AES: 0, // Statesman - WWII hero, tried for gravitas
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2000: Gore vs Bush
// ─────────────────────────────────────────────────────────────────────────────
// Gore: VP, "lockbox," climate champion, wonkish, populist turn ("the people
// vs. the powerful"), stiff but substantive. Internet advocate.
// Bush: "Compassionate conservatism," tax cuts, faith-based initiatives,
// "uniter not a divider," "guy you'd have a beer with." MBA president.
const election2000 = {
    year: 2000,
    candidates: [
        {
            name: "Gore",
            party: "Democratic",
            year: 2000,
            MAT: 2, // Mildly redistributive - "people vs. powerful"
            CD: 2, // Culturally open
            CU: 4, // Universalist - climate, global engagement
            MOR: 3, // Center - Tipper's PMRC but personally moderate
            PRO: 4, // Proceduralist - institutions, process
            COM: 4, // Compromiser - centrist Democrat
            ZS: 2, // Positive-sum - technology optimism
            ONT_H: 4, // Optimistic - technology/progress
            ONT_S: 3, // Mixed - government investment but market-friendly
            PF: 4, // Strong Democrat
            TRB: 3, // Moderate tribal
            ENG: 5, // Career politician
            EPS: 0, // Empiricist - data, science, climate expertise
            AES: 1, // Technocrat - wonkish, "lockbox"
        },
        {
            name: "Bush",
            party: "Republican",
            year: 2000,
            MAT: 4, // Pro-market - tax cuts
            CD: 3, // Moderate culturally - "compassionate conservatism"
            CU: 3, // Mixed - internationalist but skeptical of nation-building
            MOR: 4, // Traditional - born-again, faith-based initiatives
            PRO: 3, // Mixed - pragmatic governor
            COM: 4, // "Uniter not a divider" - compromiser signal
            ZS: 2, // Positive-sum - compassionate conservatism
            ONT_H: 3, // Moderate - faith in individual but "soft bigotry of low expectations"
            ONT_S: 2, // Individualist - "ownership society"
            PF: 4, // Strong Republican
            TRB: 3, // Moderate tribal - compassionate conservatism
            ENG: 3, // Projected citizen-politician - rancher, not career pol
            EPS: 3, // Intuitionist - "gut" decision-maker, faith-based
            AES: 2, // Pastoral - ranch, folksy, "guy you'd have a beer with"
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2004: Kerry vs Bush
// ─────────────────────────────────────────────────────────────────────────────
// Bush: Post-9/11 war president, "you're either with us or against us,"
// War on Terror, Patriot Act, Iraq War. Security and moral clarity.
// Kerry: Vietnam veteran, "reporting for duty," nuanced, "I voted for it
// before I voted against it." Swift Boat controversy.
const election2004 = {
    year: 2004,
    candidates: [
        {
            name: "Kerry",
            party: "Democratic",
            year: 2004,
            MAT: 1, // Redistributive signal - opposed Bush tax cuts, healthcare expansion
            CD: 1, // Culturally open - Massachusetts liberal, pro-choice, anti-death-penalty
            CU: 5, // Maximum pluralist - multilateral, UN, "global test"
            MOR: 5, // Maximum universalist - broad moral concern, anti-torture
            PRO: 4, // Proceduralist - rule of law, Geneva Conventions, Senate institutionalist
            COM: 4, // Compromiser - Senate dealmaker
            ZS: 2, // Positive-sum - multilateral cooperation
            ONT_H: 4, // Optimistic about human nature
            ONT_S: 3, // Mixed - criticized Iraq but defended system broadly
            PF: 5, // Maximum Democrat - ran as anti-Bush
            TRB: 4, // Higher tribal - "reporting for duty" military identity, us-vs-them on Iraq
            ENG: 5, // Maximum engagement - war hero running against wartime president
            EPS: 0, // Empiricist - nuanced, "intellectual"
            AES: 0, // Statesman - "reporting for duty," patrician
        },
        {
            name: "Bush",
            party: "Republican",
            year: 2004,
            MAT: 5, // Maximum free-market - ownership society, tax cuts, privatize SS
            CD: 4, // Culturally conservative - gay marriage amendment
            CU: 2, // Assimilationist/closed - American exceptionalism, unilateral (CU low=closed)
            MOR: 2, // Narrow moral circle - evangelical in-group, us-vs-them (MOR low=particularist)
            PRO: 4, // Institutional president - worked through Congress, DOJ, NATO (PRO high=procedural)
            COM: 3, // Mixed - "decider" rhetoric but bipartisan on education, immigration
            ZS: 4, // Zero-sum - "with us or against us"
            ONT_H: 3, // Mixed - "freedom is on the march" but threat-focused
            ONT_S: 2, // System mostly working - defended institutions (ONT_S low=stable)
            PF: 5, // Maximum partisan - Karl Rove base strategy
            TRB: 4, // Highly tribal - post-9/11 patriotic identity, but not max
            ENG: 5, // War president - maximum engagement
            EPS: 3, // Intuitionist - gut decisions, faith-based
            AES: 4, // Fighter - war president, "bring 'em on"
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2008: Obama vs McCain
// ─────────────────────────────────────────────────────────────────────────────
// Obama: "Hope and change," post-racial, post-partisan, community organizer
// turned senator. Historic candidacy. "Yes we can." Professorial but inspiring.
// McCain: "Maverick," war hero, bipartisan dealmaker, immigration reform,
// campaign finance reform. Palin VP pick complicated his moderate image.
const election2008 = {
    year: 2008,
    candidates: [
        {
            name: "Obama",
            party: "Democratic",
            year: 2008,
            MAT: 2, // Mildly redistributive - "spread the wealth" but market-friendly
            CD: 2, // Culturally open - but ran as unifier, not radical
            CU: 4, // Universalist - global citizen, but grounded in American values
            MOR: 3, // Center - referenced faith frequently, "God is in the mix"
            PRO: 4, // Proceduralist - constitutional law professor
            COM: 4, // Compromiser - post-partisan rhetoric, "no red/blue America"
            ZS: 1, // Maximum positive-sum - "hope and change," unity
            ONT_H: 5, // Maximum perfectibility - "yes we can," transformation
            ONT_S: 3, // Mixed - community organizer but "personal responsibility" rhetoric
            PF: 3, // Moderate partisan - post-partisan appeal
            TRB: 2, // Low tribal - explicitly anti-tribal, transcended identity politics
            ENG: 5, // Maximum engagement - movement-building
            EPS: 0, // Empiricist - "what works," pragmatic progressive
            AES: 5, // Visionary - "yes we can," transformative rhetoric
        },
        {
            name: "McCain",
            party: "Republican",
            year: 2008,
            MAT: 4, // Pro-market - but not supply-side ideologue
            CD: 3, // Culturally moderate - immigration reform, "maverick"
            CU: 3, // Internationalist - but American leadership
            MOR: 3, // Moderate morality - not culture warrior (Palin was)
            PRO: 4, // Proceduralist - campaign finance reform, rule of law
            COM: 4, // Compromiser - "maverick," bipartisan deals
            ZS: 3, // Mixed - competition abroad, cooperation at home
            ONT_H: 3, // Moderate
            ONT_S: 2, // Individualist-leaning - personal responsibility
            PF: 3, // Moderate partisan - maverick who bucked party
            TRB: 3, // Mixed - war hero identity + Palin complicated it
            ENG: 5, // Career senator, war hero - deeply engaged
            EPS: 1, // Institutionalist - Senate creature
            AES: 3, // Authentic - straight talk, personal honor
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2012: Obama vs Romney
// ─────────────────────────────────────────────────────────────────────────────
// Obama: Incumbent, ACA passed, bin Laden killed, slower "hope and change,"
// more pragmatic manager. "Forward."
// Romney: Massachusetts governor, businessman, Bain Capital, "47%,"
// competent manager, Mormon, "severely conservative" in primary.
const election2012 = {
    year: 2012,
    candidates: [
        {
            name: "Obama",
            party: "Democratic",
            year: 2012,
            MAT: 2, // Redistributive - ACA, Buffett Rule, "you didn't build that"
            CD: 2, // Culturally open - supported gay marriage
            CU: 4, // Internationalist - but more pragmatic
            MOR: 2, // Progressive morality - evolved on marriage equality
            PRO: 4, // Proceduralist - institutional governance
            COM: 3, // Less compromising - frustrated with Congress
            ZS: 2, // Mostly positive-sum - but "forward" implies work needed
            ONT_H: 4, // Still optimistic but more seasoned
            ONT_S: 3, // Mixed - ACA, but also personal responsibility framing
            PF: 4, // Stronger partisan - election mode
            TRB: 3, // Coalition politics
            ENG: 5, // Maximum engagement - incumbent running
            EPS: 0, // Empiricist - data-driven governance
            AES: 0, // Statesman - presidential, above the fray
        },
        {
            name: "Romney",
            party: "Republican",
            year: 2012,
            MAT: 5, // Maximum free-market - Bain Capital, cut taxes/regulations
            CD: 3, // Moderate culturally - Massachusetts record, Mormon
            CU: 3, // Mixed - internationalist establishment
            MOR: 4, // Traditionally moral - Mormon, family values
            PRO: 4, // Proceduralist - rule of law, business process
            COM: 3, // Mixed - "severely conservative" pivot
            ZS: 3, // Mixed - competitive business worldview
            ONT_H: 3, // Moderate - business pragmatism
            ONT_S: 1, // Maximum individualist - "47%," self-reliance
            PF: 4, // Strong Republican
            TRB: 3, // Moderate tribal - business class
            ENG: 4, // Engaged - but projected competent manager
            EPS: 0, // Empiricist - consulting/business background
            AES: 1, // Technocrat - business turnaround specialist
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2016: Trump vs Clinton
// ─────────────────────────────────────────────────────────────────────────────
// Trump: "Make America Great Again," populist disruption, anti-immigration,
// anti-trade, anti-establishment. "Build the wall." Norm-breaking.
// Clinton: First woman nominee, experienced, policy-heavy, "stronger together,"
// perceived as establishment/insider. "Basket of deplorables."
const election2016 = {
    year: 2016,
    candidates: [
        {
            name: "Trump",
            party: "Republican",
            year: 2016,
            MAT: 3, // Populist economics - protectionist, but tax cuts for rich
            CD: 5, // Maximum cultural closure - "build the wall," immigration
            CU: 1, // Maximum particularist - "America First"
            MOR: 3, // Mixed - evangelicals supported him but not personally moral
            PRO: 1, // Maximum anti-proceduralist - norm-breaking, "drain the swamp"
            COM: 1, // Never compromise - "we're going to win so much"
            ZS: 5, // Maximum zero-sum - "they're taking our jobs," immigration
            ONT_H: 2, // Pessimistic - "American carnage"
            ONT_S: 2, // Individualist - "I alone can fix it"
            PF: 3, // Moderate - hijacked the party, not loyal to it
            TRB: 5, // Maximum tribal - MAGA movement
            ENG: 5, // Maximum engagement - rallies, constant media
            EPS: 3, // Intuitionist - gut instinct, "I have a feeling"
            AES: 4, // Fighter - "counterpuncher," combative, dominant
        },
        {
            name: "Clinton",
            party: "Democratic",
            year: 2016,
            MAT: 2, // Mildly redistributive - but Wall Street ties
            CD: 2, // Culturally open - "stronger together," diversity
            CU: 4, // Universalist - global engagement
            MOR: 2, // Progressive morality
            PRO: 4, // Proceduralist - institutional, rule-following
            COM: 4, // Compromiser - pragmatic, deal-oriented
            ZS: 2, // Positive-sum - "stronger together"
            ONT_H: 4, // Optimistic - "when they go low, we go high" (borrowed)
            ONT_S: 4, // Structuralist - policy proposals, systemic
            PF: 5, // Maximum partisan - career Democrat
            TRB: 3, // Moderate tribal - broad coalition
            ENG: 5, // Career politician - maximum engagement
            EPS: 0, // Empiricist - policy wonk, detailed plans
            AES: 0, // Statesman - projected competence, gravitas
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2020: Biden vs Trump
// ─────────────────────────────────────────────────────────────────────────────
// Biden: "Battle for the soul of the nation," return to normalcy, empathy,
// unity, "Scranton Joe." Ran from center-left, pulled left by Sanders wing.
// Trump: Incumbent, COVID response, "law and order" again, economy pre-COVID,
// more entrenched MAGA. "Keep America Great."
const election2020 = {
    year: 2020,
    candidates: [
        {
            name: "Biden",
            party: "Democratic",
            year: 2020,
            MAT: 2, // Redistributive - COVID spending, expanded safety net
            CD: 2, // Culturally open - but moderate brand
            CU: 4, // Pluralist/open - "America is back," multilateral (CU high=open)
            MOR: 4, // Fairly wide moral circle - empathy-centered (MOR high=universalist)
            PRO: 5, // Maximum proceduralist - "restore norms," rule of law (PRO high=rules-bound)
            COM: 5, // Maximum compromise - "I'll work with anyone"
            ZS: 2, // Positive-sum - unity, "soul of the nation"
            ONT_H: 4, // Optimistic - "America can be defined in one word: possibilities"
            ONT_S: 2, // System mostly working - defender of institutions (ONT_S low=stable)
            PF: 4, // Strong Democrat - but bipartisan rhetoric
            TRB: 2, // Low tribal - broad unity appeal, "president for all Americans"
            ENG: 4, // Engaged - but projected calm
            EPS: 1, // Institutionalist - "trust the institutions"
            AES: 2, // Pastoral - "Scranton Joe," empathy, personal loss
        },
        {
            name: "Trump",
            party: "Republican",
            year: 2020,
            MAT: 3, // Same populist economics - but COVID checks
            CD: 5, // Maximum cultural closure - doubled down
            CU: 1, // Maximum assimilationist/closed (CU low=closed)
            MOR: 2, // Narrow moral circle - in-group focused (MOR low=particularist)
            PRO: 1, // Maximum anti-proceduralist - challenged election results (PRO low=outcome-first)
            COM: 1, // Never compromise - more combative than 2016
            ZS: 5, // Maximum zero-sum
            ONT_H: 2, // Pessimistic - "they're destroying your country"
            ONT_S: 4, // Deep structural critique - "drain the swamp" (ONT_S high=system broken)
            PF: 3, // Moderate partisan - MAGA over GOP
            TRB: 5, // Maximum tribal - MAGA intensified
            ENG: 5, // Maximum engagement
            EPS: 3, // Intuitionist - gut politics
            AES: 4, // Fighter - "counterpuncher," grievance
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// 2024: Trump vs Harris
// ─────────────────────────────────────────────────────────────────────────────
// Trump: Third run, post-indictments, convicted felon, "retribution,"
// Project 2025 (distanced but associated). More authoritarian signaling.
// Harris: VP stepping in for Biden, "joyful warrior," prosecutor background,
// "we're not going back." First woman of color nominee for major party.
const election2024 = {
    year: 2024,
    candidates: [
        {
            name: "Trump",
            party: "Republican",
            year: 2024,
            MAT: 4, // Tax cuts + tariffs - pro-business signal, not populist economics
            CD: 5, // Maximum cultural closure - immigration, "poisoning the blood"
            CU: 1, // Maximum assimilationist/closed - America First extreme
            MOR: 2, // Narrow moral circle - in-group loyalty
            PRO: 2, // Anti-proceduralist but not maximally - still works through courts, Congress
            COM: 2, // Low compromise but deals on infrastructure, budget, criminal justice reform
            ZS: 4, // Zero-sum rhetoric but "economy was great under me" positive framing
            ONT_H: 2, // Pessimistic but "we'll be great again" implies some optimism
            ONT_S: 4, // Deep structural critique - "system is rigged"
            PF: 4, // Party IS now MAGA
            TRB: 5, // Maximum tribal
            ENG: 5, // Maximum engagement
            EPS: 3, // Intuitionist
            AES: 4, // Fighter - "I am your retribution"
        },
        {
            name: "Harris",
            party: "Democratic",
            year: 2024,
            MAT: 1, // Maximum redistributive signal - "opportunity economy," price controls, housing
            CD: 1, // Maximum cultural openness - trans rights, pronouns, DEI
            CU: 5, // Maximum pluralist - diversity as strength, multilateral
            MOR: 5, // Maximum universalist - reproductive rights, global concern
            PRO: 4, // Proceduralist - prosecutor, "rule of law"
            COM: 4, // Compromiser - moderate positioning
            ZS: 2, // Positive-sum - "joyful warrior," optimism
            ONT_H: 4, // Optimistic - "what can be, unburdened by what has been"
            ONT_S: 3, // Mixed systemic critique
            PF: 5, // Maximum partisan - strong Democrat identity signaling
            TRB: 4, // Coalition tribal - identity politics framing
            ENG: 5, // Maximum engagement
            EPS: 1, // Institutionalist - prosecutor, DA, AG
            AES: 1, // Technocrat - policy-focused
        },
    ],
};
// ─────────────────────────────────────────────────────────────────────────────
// Export all elections
// ─────────────────────────────────────────────────────────────────────────────
// Import pre-1940 elections from separate files
import { ELECTIONS_1789_1852 } from "./elections-1789-1852.js";
import { ELECTIONS_1856_1888 } from "./elections-1856-1888.js";
import { ELECTIONS_1892_1916 } from "./elections-1892-1916.js";
import { ELECTIONS_1920_1936 } from "./elections-1920-1936.js";
export const ELECTIONS = [
    ...ELECTIONS_1789_1852,
    ...ELECTIONS_1856_1888,
    ...ELECTIONS_1892_1916,
    ...ELECTIONS_1920_1936,
    election1940,
    election1944,
    election1948,
    election1952,
    election1956,
    election1960,
    election1964,
    election1968,
    election1972,
    election1976,
    election1980,
    election1984,
    election1988,
    election1992,
    election1996,
    election2000,
    election2004,
    election2008,
    election2012,
    election2016,
    election2020,
    election2024,
];
//# sourceMappingURL=candidates.js.map