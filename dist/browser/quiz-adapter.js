/**
 * PRISM Quiz Adapter — DOM integration layer
 *
 * Renders engine questions one at a time into the page,
 * handles user input, routes answers to the engine,
 * and shows progress + results.
 *
 * Usage:
 *   <div id="prism-quiz"></div>
 *   <script src="prism-engine-bundle.min.js"></script>
 *   <script>
 *     PrismEngine.initQuiz();
 *     PrismEngine.mountQuiz(document.getElementById('prism-quiz'));
 *   </script>
 *
 * Or for existing quiz HTML with data-q attributes:
 *   PrismEngine.initQuiz();
 *   PrismEngine.attachToExistingQuiz({ container: document.querySelector('.container') });
 */
import { getNextQuestion, submitAnswer, getProgress, getResults, isComplete, } from "./api.js";
let _quiz = null;
/**
 * Mount the quiz into a container element.
 * Renders one question at a time with progress bar.
 */
export function mountQuiz(container, options = {}) {
    _quiz = { container, options, currentQuestion: null };
    // Inject base styles
    injectStyles();
    // Render first question
    showNextQuestion();
}
function injectStyles() {
    if (document.getElementById("prism-quiz-styles"))
        return;
    const style = document.createElement("style");
    style.id = "prism-quiz-styles";
    style.textContent = `
    .prism-quiz { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 640px; margin: 0 auto; padding: 20px; }
    .prism-progress { margin-bottom: 24px; }
    .prism-progress-bar { height: 6px; background: #e0e0e0; border-radius: 3px; overflow: hidden; }
    .prism-progress-fill { height: 100%; background: #4a6fa5; border-radius: 3px; transition: width 0.3s ease; }
    .prism-progress-text { font-size: 13px; color: #666; margin-top: 6px; display: flex; justify-content: space-between; }
    .prism-question { margin-bottom: 32px; }
    .prism-question-text { font-size: 18px; line-height: 1.5; margin-bottom: 20px; color: #1a1a1a; }
    .prism-question-number { font-size: 13px; color: #999; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .prism-options { display: flex; flex-direction: column; gap: 10px; }
    .prism-option { padding: 14px 18px; border: 2px solid #e0e0e0; border-radius: 8px; cursor: pointer; font-size: 15px; transition: all 0.15s ease; background: white; text-align: left; }
    .prism-option:hover { border-color: #4a6fa5; background: #f5f8fc; }
    .prism-option.selected { border-color: #4a6fa5; background: #eef3fa; }
    .prism-slider-container { padding: 20px 0; }
    .prism-slider { width: 100%; -webkit-appearance: none; height: 8px; border-radius: 4px; background: #e0e0e0; outline: none; }
    .prism-slider::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; border-radius: 50%; background: #4a6fa5; cursor: pointer; }
    .prism-slider::-moz-range-thumb { width: 22px; height: 22px; border-radius: 50%; background: #4a6fa5; cursor: pointer; border: none; }
    .prism-slider-labels { display: flex; justify-content: space-between; font-size: 13px; color: #666; margin-top: 8px; }
    .prism-slider-value { text-align: center; font-size: 24px; font-weight: 600; color: #4a6fa5; margin-top: 12px; }
    .prism-btn { padding: 12px 32px; border: none; border-radius: 8px; font-size: 15px; font-weight: 600; cursor: pointer; transition: all 0.15s ease; }
    .prism-btn-primary { background: #4a6fa5; color: white; }
    .prism-btn-primary:hover { background: #3d5d8a; }
    .prism-btn-primary:disabled { background: #b0c4de; cursor: not-allowed; }
    .prism-actions { display: flex; justify-content: flex-end; margin-top: 24px; }
    .prism-results { text-align: center; }
    .prism-results h2 { font-size: 24px; margin-bottom: 8px; color: #1a1a1a; }
    .prism-results .prism-match-name { font-size: 32px; font-weight: 700; color: #4a6fa5; margin: 16px 0; }
    .prism-results .prism-confidence { font-size: 14px; color: #666; margin-bottom: 24px; }
    .prism-top5 { text-align: left; margin-top: 24px; }
    .prism-top5 h3 { font-size: 16px; margin-bottom: 12px; color: #333; }
    .prism-top5-item { display: flex; justify-content: space-between; align-items: center; padding: 10px 0; border-bottom: 1px solid #eee; }
    .prism-top5-name { font-weight: 500; }
    .prism-top5-score { font-size: 13px; color: #666; }
    .prism-top5-bar { height: 4px; background: #e0e0e0; border-radius: 2px; margin-top: 4px; overflow: hidden; }
    .prism-top5-bar-fill { height: 100%; background: #4a6fa5; border-radius: 2px; }
    .prism-debug { font-size: 11px; color: #999; margin-top: 24px; padding: 12px; background: #f5f5f5; border-radius: 6px; font-family: monospace; white-space: pre-wrap; }
    .prism-ranking-list { list-style: none; padding: 0; margin: 0; }
    .prism-ranking-item { padding: 12px 16px; margin: 6px 0; border: 2px solid #e0e0e0; border-radius: 8px; cursor: grab; background: white; display: flex; align-items: center; gap: 12px; user-select: none; }
    .prism-ranking-item:active { cursor: grabbing; }
    .prism-ranking-item.dragging { opacity: 0.5; }
    .prism-ranking-handle { color: #999; font-size: 18px; }
    .prism-ranking-rank { font-weight: 600; color: #4a6fa5; min-width: 24px; }
    .prism-alloc-container { display: flex; flex-direction: column; gap: 16px; }
    .prism-alloc-item { display: flex; align-items: center; gap: 12px; }
    .prism-alloc-label { flex: 1; font-size: 14px; }
    .prism-alloc-slider { flex: 2; }
    .prism-alloc-value { min-width: 40px; text-align: right; font-weight: 600; font-size: 14px; }
    .prism-bw-container { display: flex; flex-direction: column; gap: 8px; }
    .prism-bw-row { display: flex; align-items: center; gap: 12px; padding: 10px; border: 1px solid #eee; border-radius: 6px; }
    .prism-bw-row label { flex: 1; font-size: 14px; }
    .prism-bw-btn { padding: 6px 14px; border: 2px solid #e0e0e0; border-radius: 6px; background: white; cursor: pointer; font-size: 12px; font-weight: 600; transition: all 0.15s; }
    .prism-bw-btn:hover { border-color: #4a6fa5; }
    .prism-bw-btn.best-selected { border-color: #2e7d32; background: #e8f5e9; color: #2e7d32; }
    .prism-bw-btn.worst-selected { border-color: #c62828; background: #ffebee; color: #c62828; }
  `;
    document.head.appendChild(style);
}
function getQuestionText(q) {
    if (_quiz?.options.questionText?.[q.promptShort]) {
        return _quiz.options.questionText[q.promptShort];
    }
    return q.promptFull ?? q.promptShort.replace(/_/g, " ");
}
function showNextQuestion() {
    if (!_quiz)
        return;
    // Check if complete
    if (isComplete()) {
        showResults();
        return;
    }
    const q = getNextQuestion();
    if (!q) {
        showResults();
        return;
    }
    _quiz.currentQuestion = q;
    const progress = getProgress();
    _quiz.container.innerHTML = "";
    _quiz.container.className = "prism-quiz";
    // Progress bar
    const progressEl = renderProgress(progress);
    _quiz.container.appendChild(progressEl);
    // Question
    const questionEl = document.createElement("div");
    questionEl.className = "prism-question";
    const numEl = document.createElement("div");
    numEl.className = "prism-question-number";
    numEl.textContent = `Question ${progress.questionsAnswered + 1}`;
    questionEl.appendChild(numEl);
    const textEl = document.createElement("div");
    textEl.className = "prism-question-text";
    textEl.textContent = getQuestionText(q);
    questionEl.appendChild(textEl);
    // Input UI based on type
    switch (q.uiType) {
        case "single_choice":
        case "multi":
            questionEl.appendChild(renderSingleChoice(q));
            break;
        case "slider":
            questionEl.appendChild(renderSlider(q));
            break;
        case "allocation":
            questionEl.appendChild(renderAllocation(q));
            break;
        case "ranking":
            questionEl.appendChild(renderRanking(q));
            break;
        case "best_worst":
            questionEl.appendChild(renderBestWorst(q));
            break;
        case "pairwise":
            questionEl.appendChild(renderPairwise(q));
            break;
        default:
            // Fallback: show as single choice if options exist
            if (q.options) {
                questionEl.appendChild(renderSingleChoice(q));
            }
    }
    _quiz.container.appendChild(questionEl);
    // Debug panel
    if (_quiz.options.debug) {
        const debugEl = document.createElement("div");
        debugEl.className = "prism-debug";
        debugEl.textContent = JSON.stringify(progress, null, 2);
        _quiz.container.appendChild(debugEl);
    }
}
// ---------------------------------------------------------------------------
// Input renderers
// ---------------------------------------------------------------------------
function renderProgress(progress) {
    const el = document.createElement("div");
    el.className = "prism-progress";
    const pct = Math.min(100, Math.round((progress.questionsAnswered / progress.estimatedTotal) * 100));
    el.innerHTML = `
    <div class="prism-progress-bar">
      <div class="prism-progress-fill" style="width: ${pct}%"></div>
    </div>
    <div class="prism-progress-text">
      <span>${progress.questionsAnswered} answered</span>
      <span>~${progress.estimatedTotal - progress.questionsAnswered} remaining</span>
    </div>
  `;
    return el;
}
function renderSingleChoice(q) {
    const container = document.createElement("div");
    container.className = "prism-options";
    let selected = null;
    for (const opt of q.options ?? []) {
        const btn = document.createElement("button");
        btn.className = "prism-option";
        btn.textContent = q.optionLabels?.[opt] ?? opt.replace(/_/g, " ");
        btn.type = "button";
        btn.addEventListener("click", () => {
            selected = opt;
            container.querySelectorAll(".prism-option").forEach(b => b.classList.remove("selected"));
            btn.classList.add("selected");
            // Auto-advance after brief delay
            setTimeout(() => {
                submitAnswer(q.id, opt);
                showNextQuestion();
            }, 250);
        });
        container.appendChild(btn);
    }
    return container;
}
function renderSlider(q) {
    const container = document.createElement("div");
    container.className = "prism-slider-container";
    const min = q.slider?.min ?? 0;
    const max = q.slider?.max ?? 100;
    const mid = Math.round((min + max) / 2);
    const slider = document.createElement("input");
    slider.type = "range";
    slider.className = "prism-slider";
    slider.min = String(min);
    slider.max = String(max);
    slider.value = String(mid);
    const valueDisplay = document.createElement("div");
    valueDisplay.className = "prism-slider-value";
    valueDisplay.textContent = String(mid);
    slider.addEventListener("input", () => {
        valueDisplay.textContent = slider.value;
    });
    const labels = document.createElement("div");
    labels.className = "prism-slider-labels";
    labels.innerHTML = `<span>${min}</span><span>${max}</span>`;
    container.appendChild(slider);
    container.appendChild(valueDisplay);
    container.appendChild(labels);
    // Submit button
    const actions = document.createElement("div");
    actions.className = "prism-actions";
    const btn = document.createElement("button");
    btn.className = "prism-btn prism-btn-primary";
    btn.textContent = "Continue";
    btn.type = "button";
    btn.addEventListener("click", () => {
        submitAnswer(q.id, Number(slider.value));
        showNextQuestion();
    });
    actions.appendChild(btn);
    container.appendChild(actions);
    return container;
}
function renderAllocation(q) {
    const container = document.createElement("div");
    const buckets = q.allocationBuckets ?? [];
    const allocContainer = document.createElement("div");
    allocContainer.className = "prism-alloc-container";
    const values = {};
    for (const b of buckets) {
        values[b] = Math.round(100 / buckets.length);
    }
    function renderItems() {
        allocContainer.innerHTML = "";
        for (const bucket of buckets) {
            const item = document.createElement("div");
            item.className = "prism-alloc-item";
            const label = document.createElement("span");
            label.className = "prism-alloc-label";
            label.textContent = q.optionLabels?.[bucket] ?? bucket.replace(/_/g, " ");
            const slider = document.createElement("input");
            slider.type = "range";
            slider.className = "prism-slider prism-alloc-slider";
            slider.min = "0";
            slider.max = "100";
            slider.value = String(values[bucket]);
            const val = document.createElement("span");
            val.className = "prism-alloc-value";
            val.textContent = String(values[bucket]);
            slider.addEventListener("input", () => {
                values[bucket] = Number(slider.value);
                val.textContent = slider.value;
            });
            item.appendChild(label);
            item.appendChild(slider);
            item.appendChild(val);
            allocContainer.appendChild(item);
        }
    }
    renderItems();
    container.appendChild(allocContainer);
    const actions = document.createElement("div");
    actions.className = "prism-actions";
    const btn = document.createElement("button");
    btn.className = "prism-btn prism-btn-primary";
    btn.textContent = "Continue";
    btn.type = "button";
    btn.addEventListener("click", () => {
        submitAnswer(q.id, values);
        showNextQuestion();
    });
    actions.appendChild(btn);
    container.appendChild(actions);
    return container;
}
function renderRanking(q) {
    const container = document.createElement("div");
    const items = [...(q.rankingItems ?? [])];
    const list = document.createElement("ul");
    list.className = "prism-ranking-list";
    function renderList() {
        list.innerHTML = "";
        items.forEach((item, idx) => {
            const li = document.createElement("li");
            li.className = "prism-ranking-item";
            li.draggable = true;
            li.dataset.index = String(idx);
            li.innerHTML = `
        <span class="prism-ranking-handle">&#x2630;</span>
        <span class="prism-ranking-rank">${idx + 1}</span>
        <span>${q.optionLabels?.[item] ?? item.replace(/_/g, " ")}</span>
      `;
            li.addEventListener("dragstart", (e) => {
                li.classList.add("dragging");
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(idx));
            });
            li.addEventListener("dragend", () => {
                li.classList.remove("dragging");
            });
            li.addEventListener("dragover", (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = "move";
            });
            li.addEventListener("drop", (e) => {
                e.preventDefault();
                const fromIdx = Number(e.dataTransfer.getData("text/plain"));
                const toIdx = idx;
                if (fromIdx !== toIdx) {
                    const [moved] = items.splice(fromIdx, 1);
                    items.splice(toIdx, 0, moved);
                    renderList();
                }
            });
            list.appendChild(li);
        });
    }
    renderList();
    container.appendChild(list);
    const actions = document.createElement("div");
    actions.className = "prism-actions";
    const btn = document.createElement("button");
    btn.className = "prism-btn prism-btn-primary";
    btn.textContent = "Continue";
    btn.type = "button";
    btn.addEventListener("click", () => {
        submitAnswer(q.id, items);
        showNextQuestion();
    });
    actions.appendChild(btn);
    container.appendChild(actions);
    return container;
}
function renderBestWorst(q) {
    const container = document.createElement("div");
    container.className = "prism-bw-container";
    const items = q.bestWorstItems ?? [];
    let best = null;
    let worst = null;
    function renderItems() {
        container.innerHTML = "";
        for (const item of items) {
            const row = document.createElement("div");
            row.className = "prism-bw-row";
            const bestBtn = document.createElement("button");
            bestBtn.className = "prism-bw-btn" + (best === item ? " best-selected" : "");
            bestBtn.textContent = "Best";
            bestBtn.type = "button";
            bestBtn.addEventListener("click", () => {
                best = item;
                if (worst === item)
                    worst = null;
                renderItems();
                trySubmitBW();
            });
            const label = document.createElement("label");
            label.textContent = q.optionLabels?.[item] ?? item.replace(/_/g, " ");
            const worstBtn = document.createElement("button");
            worstBtn.className = "prism-bw-btn" + (worst === item ? " worst-selected" : "");
            worstBtn.textContent = "Worst";
            worstBtn.type = "button";
            worstBtn.addEventListener("click", () => {
                worst = item;
                if (best === item)
                    best = null;
                renderItems();
                trySubmitBW();
            });
            row.appendChild(bestBtn);
            row.appendChild(label);
            row.appendChild(worstBtn);
            container.appendChild(row);
        }
    }
    function trySubmitBW() {
        if (best && worst) {
            // Narrow off the nullable type for the closure-captured submit call.
            const b = best;
            const w = worst;
            setTimeout(() => {
                submitAnswer(q.id, { best: b, worst: w });
                showNextQuestion();
            }, 300);
        }
    }
    renderItems();
    return container;
}
function renderPairwise(q) {
    const container = document.createElement("div");
    const pairIds = q.pairIds ?? [];
    const answers = {};
    let currentPairIdx = 0;
    function showPair() {
        container.innerHTML = "";
        if (currentPairIdx >= pairIds.length) {
            submitAnswer(q.id, answers);
            showNextQuestion();
            return;
        }
        const pairId = pairIds[currentPairIdx];
        const subLabel = document.createElement("div");
        subLabel.style.cssText = "font-size:13px;color:#999;margin-bottom:12px;";
        subLabel.textContent = `Pair ${currentPairIdx + 1} of ${pairIds.length}`;
        container.appendChild(subLabel);
        const opts = document.createElement("div");
        opts.className = "prism-options";
        // Pairwise pairs typically have "A" and "B" as options
        for (const choice of ["A", "B"]) {
            const btn = document.createElement("button");
            btn.className = "prism-option";
            btn.textContent = `Option ${choice}`;
            btn.type = "button";
            btn.addEventListener("click", () => {
                answers[pairId] = choice;
                currentPairIdx++;
                showPair();
            });
            opts.appendChild(btn);
        }
        container.appendChild(opts);
    }
    showPair();
    return container;
}
// ---------------------------------------------------------------------------
// Results renderer
// ---------------------------------------------------------------------------
function showResults() {
    if (!_quiz)
        return;
    const results = getResults();
    _quiz.container.innerHTML = "";
    _quiz.container.className = "prism-quiz";
    const el = document.createElement("div");
    el.className = "prism-results";
    const distances = results.top3.map((r) => r.distance);
    const dMin = Math.min(...distances);
    const dMax = Math.max(...distances);
    const span = dMax - dMin + 1e-6;
    const matchScore = (d) => (dMax - d) / span;
    el.innerHTML = `
    <h2>Your Political Archetype</h2>
    <div class="prism-match-name">${results.match.name}</div>
    <div class="prism-confidence">
      Confidence: ${(results.confidence * 100).toFixed(1)}% |
      ${results.questionsAnswered} questions answered
    </div>
    <div class="prism-top5">
      <h3>Top 3 Matches</h3>
      ${results.top3.map((r, i) => `
        <div class="prism-top5-item">
          <div>
            <div class="prism-top5-name">${i + 1}. ${r.name}</div>
            <div class="prism-top5-bar">
              <div class="prism-top5-bar-fill" style="width: ${(matchScore(r.distance) * 100).toFixed(1)}%"></div>
            </div>
          </div>
          <div class="prism-top5-score">d=${r.distance.toFixed(2)}</div>
        </div>
      `).join("")}
    </div>
  `;
    _quiz.container.appendChild(el);
    if (_quiz.options.onComplete) {
        _quiz.options.onComplete(results);
    }
}
/**
 * Attach to an existing quiz HTML structure.
 *
 * This hides all quiz pages and shows questions one at a time,
 * mapping between the existing DOM question IDs and the engine's
 * question IDs using the provided mapping or auto-detection.
 */
export function attachToExistingQuiz(options) {
    const { container, onComplete } = options;
    // Hide all pages
    container.querySelectorAll(".quiz-page").forEach(page => {
        page.style.display = "none";
    });
    // Create a dynamic question display area
    const dynamicArea = document.createElement("div");
    dynamicArea.className = "prism-quiz";
    container.prepend(dynamicArea);
    // Inject styles
    injectStyles();
    // Mount into the dynamic area
    mountQuiz(dynamicArea, {
        onComplete: (results) => {
            // Remove dynamic area
            dynamicArea.remove();
            // Show results in the container
            const resultsArea = document.createElement("div");
            resultsArea.className = "prism-quiz";
            container.prepend(resultsArea);
            _quiz = { container: resultsArea, options: { onComplete }, currentQuestion: null };
            showResults();
            if (onComplete)
                onComplete(results);
        }
    });
}
//# sourceMappingURL=quiz-adapter.js.map