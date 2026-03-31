/**
 * Fix all truncated labels (cut at apostrophes) and mismatched keys.
 * Also read V1 for correct text where available.
 */
const fs = require('fs');

let html = fs.readFileSync('prism-quiz-v3.html', 'utf8');
const OPT_LABELS = new Function(html.match(/const OPT_LABELS = \{[\s\S]*?\};/)[0] + '; return OPT_LABELS;')();

// Find all labels that end mid-word (truncated at apostrophe)
const truncated = {};
for (const [key, val] of Object.entries(OPT_LABELS)) {
    // Truncated if ends with: doesn, isn, aren, wasn, won, wouldn, couldn, shouldn, hasn, haven, it, that
    if (/\b(doesn|isn|aren|wasn|won|wouldn|couldn|shouldn|hasn|haven)$/.test(val) ||
        val.endsWith(' it') && val.length < 30 ||
        val.endsWith(' that') && val.length < 30) {
        truncated[key] = val;
    }
}

console.log(`Found ${Object.keys(truncated).length} truncated labels:`);
for (const [k, v] of Object.entries(truncated)) {
    console.log(`  ${k}: "${v}"`);
}

// Corrections map - manually corrected text
const corrections = {
    // Q3 engagement_motivations
    civic_duty: "Civic duty - it's my responsibility as a citizen",
    
    // Q5 coalition_vs_principle
    depends_on_issue: "Depends on the issue - some principles are non-negotiable, others aren't worth splitting over",
    
    // Q12 criminal_justice - FIX: balanced_approach is SHARED KEY used in immigration too!
    // Need separate labels. The criminal justice one should be:
    // (This is the core problem - balanced_approach maps to immigration text)
    
    // Q14 human_progress_view
    decline: "Progress is mostly an illusion - human nature doesn't change",
    
    // Q19 welfare_error
    giving_to_undeserving: "Giving benefits to someone who doesn't need them",
    
    // Q33 close_friends
    no_big_deal: "No big deal - wouldn't affect the friendship at all",
    uncomfortable_but_ok: "A bit uncomfortable but wouldn't change anything",
    
    // Q39 social_progress (these should be DIFFERENT from Q14 human progress)
    // Q39 uses same keys as Q14? Let me check...
    
    // Q46 what_changed_your_mind
    never_changed: "My core views haven't really changed",
    
    // Q51 movement_aesthetics
    neutral_tool: "A neutral tool - depends how it's used",
    
    // Q55 opponent_success_response  
    wait_and_see: "Wait and see - maybe the outcome won't be as good as it looks",
    worried_but_accept: "Worried but accept - that's how democracy works",
    fight_to_reverse: "Fight to reverse it - elections aren't a blank check",
    
    // Q59 cross_party_marriage
    no_problem: "No problem at all - wouldn't affect my feelings about them",
    slight_discomfort: "Slightly uncomfortable but wouldn't say anything",
};

// Apply corrections
for (const [key, newVal] of Object.entries(corrections)) {
    const oldVal = OPT_LABELS[key];
    if (oldVal) {
        const escaped = oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${key}:\\s*")${escaped}"`);
        const newHtml = html.replace(regex, `$1${newVal}"`);
        if (newHtml !== html) {
            html = newHtml;
            console.log(`Fixed: ${key}: "${oldVal}" → "${newVal}"`);
        } else {
            console.log(`COULD NOT FIND: ${key}: "${oldVal}"`);
        }
    } else {
        console.log(`KEY NOT FOUND: ${key}`);
    }
}

// Fix the balanced_approach problem - it's used in 3 questions with immigration text
// Need to check what questions use it and provide context-appropriate labels
// For now, find all occurrences
const baCount = (html.match(/balanced_approach/g) || []).length;
console.log(`\nbalanced_approach appears ${baCount} times in HTML`);

fs.writeFileSync('prism-quiz-v3.html', html);
console.log('\nSaved fixes to prism-quiz-v3.html');
