// Prevent double-initializing if script is included twice
if (!window.__esdWidgetInitialized) {
    window.__esdWidgetInitialized = true;

    (function initESDWidget() {
        // Inject CSS for the widget
        (function addWidgetCSS() {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "assets/css/widget.css";
            document.head.appendChild(link);

            // Auto-open widget on each page load
window.addEventListener("load", () => {
    panel.style.display = "block";
    // If user hasn’t started yet, begin at step 0
    if (!state.answers || Object.keys(state.answers).length === 0) {
        state.stepIndex = 0;
        renderStep();
    }
});

        })();

        const STORAGE_KEY = "esdWidgetLastResult";

        // Subtype metadata
        const SUBTYPES = {
            A: {
                id: "A",
                name: "Type A · Emotional Hypo-Empathy",
                short: "cooling or emotionally muted",
                teaching:
                    "This pattern can feel more practical or emotionally distant on the surface, even when you care. It often shows up as focusing on tasks over feelings.",
                practice:
                    "Gently try naming one concrete feeling word and one body sensation you notice, even if they feel small or muted."
            },
            B: {
                id: "B",
                name: "Type B · Emotional Hyper-Empathy",
                short: "flooding or emotional overflow",
                teaching:
                    "This pattern often involves absorbing others’ feelings quickly and intensely, sometimes faster than your system can process.",
                practice:
                    "Try a slow exhale (longer out than in), and remind yourself: \"Their feelings are real, and I don’t have to hold all of them alone.\""
            },
            C: {
                id: "C",
                name: "Type C · Cognitive-Dominant Empathy",
                short: "understanding more than feeling",
                teaching:
                    "This pattern leads with analysis and perspective-taking. You often understand what’s happening, even when your emotional experience stays quieter.",
                practice:
                    "See if you can add one sentence that names emotion, not just facts: \"It sounds like this feels really ____ for you.\""
            },
            D: {
                id: "D",
                name: "Type D · Empathic Dysregulation (Oscillating)",
                short: "swinging between too much and too little",
                teaching:
                    "This pattern moves between intense engagement and sudden shutdown or irritation. It’s often the nervous system trying to find a safe middle.",
                practice:
                    "Pause and notice where you are on the dial right now: closer to flooded or numb? Ask yourself, \"What would a 1% softer step look like?\""
            },
            E: {
                id: "E",
                name: "Type E · Empathic Shutdown (Trauma-Linked)",
                short: "numbing or going offline",
                teaching:
                    "This pattern often reflects a protective response. Your system may go quiet or distant when intensity feels like too much.",
                practice:
                    "Offer yourself gentleness instead of pressure. Try noticing three neutral things you can see, hear, or feel around you to gently come back online."
            },
            F: {
                id: "F",
                name: "Type F · Dark Empathy (Strategic/Instrumental)",
                short: "strategic or selective attunement",
                teaching:
                    "This pattern uses empathy with intention—sometimes to keep peace, sometimes to influence or manage outcomes.",
                practice:
                    "Ask yourself, \"What outcome am I hoping for here?\" and \"Is there one small way I can stay honest and caring while still protecting my energy?\""
            }
        };

        // Step configuration (multi-step, adaptive-ish)
        const STEPS = [
            {
                id: "affect",
                label: "Step 1 of 3",
                question: "Right now, your emotional state feels closest to…",
                multi: false,
                options: [
                    {
                        id: "calm",
                        label: "Mostly calm and steady",
                        adds: { C: 1, A: 0.5 },
                        mini:
                            "Calm states often mean your system has enough capacity to choose how you want to respond."
                    },
                    {
                        id: "flooded",
                        label: "Worried, flooded, or teary",
                        adds: { B: 1, D: 0.5 },
                        mini:
                            "Feeling flooded can be a sign of hyper-empathy or a nervous system working very hard to keep up."
                    },
                    {
                        id: "shutdown",
                        label: "Numb, blank, or checked out",
                        adds: { E: 1, A: 0.5 },
                        mini:
                            "Numbness often shows up as protection, not failure. It’s your system asking for gentleness."
                    },
                    {
                        id: "irritable",
                        label: "Irritable, snappy, or on edge",
                        adds: { D: 1, A: 0.5, F: 0.5 },
                        mini:
                            "Irritation can be a sign that your window of tolerance is narrowing and needs more space or support."
                    },
                    {
                        id: "strategic",
                        label: "Very “in my head” and managing the situation",
                        adds: { C: 1, F: 0.5 },
                        mini:
                            "Leading with strategy isn’t wrong. It just means your cognitive empathy is in the driver’s seat right now."
                    }
                ]
            },
            {
                id: "cues",
                label: "Step 2 of 3",
                question: "What signals are you noticing most in yourself?",
                multi: true,
                options: [
                    {
                        id: "body_amp",
                        label: "Fast heartbeat, tight chest, or shallow breath",
                        adds: { B: 1, D: 0.5 },
                        mini:
                            "These are common signs of activation or emotional flooding. Your system may be trying to move a lot of energy at once."
                    },
                    {
                        id: "body_flat",
                        label: "Heavy body, slowed movement, hard to get going",
                        adds: { E: 1, A: 0.5 },
                        mini:
                            "Heaviness and slowing can signal a shutdown pattern or energy conservation."
                    },
                    {
                        id: "mind_race",
                        label: "Racing thoughts about others’ feelings or reactions",
                        adds: { B: 1, F: 0.5 },
                        mini:
                            "When your mind loops around others’ emotions, it can reflect over-responsibility or strategic empathy."
                    },
                    {
                        id: "mind_blank",
                        label: "Blank, foggy, or “far away” mind",
                        adds: { E: 1, D: 0.5 },
                        mini:
                            "A foggy mind can be your system gently pulling the plug when too much is happening at once."
                    },
                    {
                        id: "analyze_mode",
                        label: "Analyzing what’s happening more than feeling it",
                        adds: { C: 1, A: 0.5 },
                        mini:
                            "This often reflects cognitive-dominant empathy—clear on the picture, quieter on the feelings."
                    },
                    {
                        id: "control_mode",
                        label: "Wanting to manage or steer others’ reactions",
                        adds: { F: 1, C: 0.5 },
                        mini:
                            "Strategic managing can be protective. Noticing it is a powerful first step toward more intentional empathy."
                    }
                ]
            },
            {
                id: "relational",
                label: "Step 3 of 3",
                question: "In this moment, your empathy toward others feels…",
                multi: false,
                options: [
                    {
                        id: "over_merged",
                        label: "Very merged with others; hard to tell what’s mine",
                        adds: { B: 1, D: 0.5 },
                        mini:
                            "Merging often means your boundaries are soft and your system is doing a lot of emotional labor."
                    },
                    {
                        id: "distant",
                        label: "Distant; I care, but feel far away or flat",
                        adds: { A: 1, E: 0.5 },
                        mini:
                            "Distance can be a cooling or protective response, especially if things have felt intense for a while."
                    },
                    {
                        id: "observing",
                        label: "Observing carefully; I “understand” more than I feel",
                        adds: { C: 1, A: 0.5 },
                        mini:
                            "Observing with clarity is a strength. This is classic cognitive-dominant empathy."
                    },
                    {
                        id: "swinging",
                        label: "Swinging between caring a lot and wanting to shut down",
                        adds: { D: 1, B: 0.5, E: 0.5 },
                        mini:
                            "Oscillating states are common when your window of tolerance gets stretched and needs repair."
                    },
                    {
                        id: "selective",
                        label: "Empathic when it serves a goal or keeps things smooth",
                        adds: { F: 1, C: 0.5 },
                        mini:
                            "Selective empathy can reflect strategic or dark empathy—using attunement with intention."
                    }
                ]
            }
        ];

        const state = {
            stepIndex: 0,
            answers: {} // stepId -> string or array of optionIds
        };

        // Create trigger button and panel
        const trigger = document.createElement("div");
        trigger.id = "esd-widget-trigger";
        trigger.textContent = "ESD";

        const panel = document.createElement("div");
        panel.id = "esd-widget-panel";
        panel.innerHTML = `
            <div class="esd-panel-inner">
                <div class="esd-panel-header">
                    <button id="esd-panel-close" aria-label="Close ESD check-in">×</button>
                    <div class="esd-pill">Mini ESD Check-in</div>
                    <div class="esd-panel-title">Empathy Micro-Check</div>
                    <div id="esd-last-result" class="esd-last-result" style="display:none;"></div>
                </div>
                <div id="esd-content"></div>
            </div>
        `;

        document.body.appendChild(trigger);
        document.body.appendChild(panel);

        const contentEl = panel.querySelector("#esd-content");
        const lastResultEl = panel.querySelector("#esd-last-result");
        const closeBtn = panel.querySelector("#esd-panel-close");

        // Load last saved result (if any)
        function loadLastResult() {
            try {
                const raw = localStorage.getItem(STORAGE_KEY);
                if (!raw) return;
                const saved = JSON.parse(raw);
                if (!saved || !saved.primary || !SUBTYPES[saved.primary.id]) return;
                const subtype = SUBTYPES[saved.primary.id];
                lastResultEl.style.display = "block";
                lastResultEl.innerHTML = `
                    Last time, your pattern leaned toward <strong>${subtype.name}</strong>.
                `;
            } catch (e) {
                // fail silently
            }
        }

        function saveResult(scores, primaryId) {
            try {
                const payload = {
                    timestamp: new Date().toISOString(),
                    scores: scores,
                    primary: { id: primaryId }
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
            } catch (e) {
                // ignore storage errors
            }
        }

        // Helpers
        function getCurrentStep() {
            return STEPS[state.stepIndex];
        }

        function getScoresFromAnswers() {
            const scores = { A: 0, B: 0, C: 0, D: 0, E: 0, F: 0 };

            STEPS.forEach(step => {
                const answer = state.answers[step.id];
                if (!answer) return;

                const applyOptionAdds = optionId => {
                    const opt = step.options.find(o => o.id === optionId);
                    if (!opt || !opt.adds) return;
                    Object.keys(opt.adds).forEach(key => {
                        scores[key] += opt.adds[key];
                    });
                };

                if (Array.isArray(answer)) {
                    answer.forEach(id => applyOptionAdds(id));
                } else {
                    applyOptionAdds(answer);
                }
            });

            return scores;
        }

        function computePrimarySubtype(scores) {
            let bestKey = null;
            let bestScore = -Infinity;
            Object.keys(scores).forEach(key => {
                if (scores[key] > bestScore) {
                    bestScore = scores[key];
                    bestKey = key;
                }
            });
            if (!bestKey || bestScore <= 0) return null;
            return bestKey;
        }

        // Rendering

        function renderStep() {
            const step = getCurrentStep();
            const stepAnswer = state.answers[step.id];

            let optionsHTML = step.options
                .map(opt => {
                    const selected =
                        step.multi && Array.isArray(stepAnswer)
                            ? stepAnswer.includes(opt.id)
                            : stepAnswer === opt.id;
                    const selectedClass = selected ? " esd-option--selected" : "";
                    return `
                        <button class="esd-option${selectedClass}" data-opt="${opt.id}">
                            ${opt.label}
                        </button>
                    `;
                })
                .join("");

            contentEl.innerHTML = `
                <div class="esd-step-label">${step.label}</div>
                <div class="esd-question">${step.question}</div>
                <div class="esd-options">
                    ${optionsHTML}
                </div>
                <div id="esd-mini-feedback" class="esd-mini-feedback" style="display:none;"></div>
                <div class="esd-nav-row">
                    <button id="esd-back" class="esd-nav-btn esd-nav-btn--ghost">Back</button>
                    <button id="esd-next" class="esd-nav-btn esd-nav-btn--primary">
                        ${state.stepIndex === STEPS.length - 1 ? "See reflection" : "Next"}
                    </button>
                </div>
            `;

            const miniFeedbackEl = contentEl.querySelector("#esd-mini-feedback");
            const optionButtons = Array.from(contentEl.querySelectorAll(".esd-option"));
            const backBtn = contentEl.querySelector("#esd-back");
            const nextBtn = contentEl.querySelector("#esd-next");

            function updateMiniFeedback(opt) {
                if (!opt.mini) {
                    miniFeedbackEl.style.display = "none";
                    miniFeedbackEl.textContent = "";
                    return;
                }
                miniFeedbackEl.style.display = "block";
                miniFeedbackEl.innerHTML = opt.mini;
            }

            optionButtons.forEach(btn => {
                btn.addEventListener("click", () => {
                    const optId = btn.getAttribute("data-opt");
                    const opt = step.options.find(o => o.id === optId);
                    if (!opt) return;

                    if (step.multi) {
                        let current = Array.isArray(state.answers[step.id])
                            ? [...state.answers[step.id]]
                            : [];
                        if (current.includes(optId)) {
                            current = current.filter(id => id !== optId);
                        } else {
                            current.push(optId);
                        }
                        state.answers[step.id] = current.length ? current : undefined;
                    } else {
                        state.answers[step.id] = optId;
                    }

                    // Update visual selection
                    optionButtons.forEach(b => b.classList.remove("esd-option--selected"));
                    if (step.multi) {
                        const ids = state.answers[step.id] || [];
                        optionButtons.forEach(b => {
                            const id = b.getAttribute("data-opt");
                            if (ids.includes(id)) {
                                b.classList.add("esd-option--selected");
                            }
                        });
                    } else {
                        btn.classList.add("esd-option--selected");
                    }

                    updateMiniFeedback(opt);
                });
            });

            backBtn.addEventListener("click", () => {
                if (state.stepIndex === 0) {
                    // At the first step: gently close
                    panel.style.display = "none";
                    return;
                }
                state.stepIndex -= 1;
                renderStep();
            });

            nextBtn.addEventListener("click", () => {
                const answer = state.answers[step.id];
                if (!answer || (Array.isArray(answer) && answer.length === 0)) {
                    miniFeedbackEl.style.display = "block";
                    miniFeedbackEl.innerHTML =
                        "Choose at least one option to continue. This is a gentle check-in, not a test.";
                    return;
                }

                if (state.stepIndex < STEPS.length - 1) {
                    state.stepIndex += 1;
                    renderStep();
                } else {
                    // Final step → show results
                    const scores = getScoresFromAnswers();
                    const primaryId = computePrimarySubtype(scores);
                    renderResult(scores, primaryId);
                    if (primaryId) {
                        saveResult(scores, primaryId);
                        loadLastResult();
                    }
                }
            });
        }

        function renderResult(scores, primaryId) {
            if (!primaryId || !SUBTYPES[primaryId]) {
                contentEl.innerHTML = `
                    <div class="esd-step-label">Reflection summary</div>
                    <div class="esd-question">
                        Your answers didn’t lean clearly toward one subtype this time, which is completely okay.
                    </div>
                    <div class="esd-result-text">
                        Sometimes a check-in is simply about noticing what’s present without naming it too precisely.
                    </div>
                    <div class="esd-nav-row esd-nav-row--center">
                        <button id="esd-restart" class="esd-nav-btn esd-nav-btn--primary">New check-in</button>
                    </div>
                `;
                const restartBtn = contentEl.querySelector("#esd-restart");
                restartBtn.addEventListener("click", resetAndStart);
                return;
            }

            const subtype = SUBTYPES[primaryId];

            // Build simple score summary (only show non-zero)
            const rows = Object.keys(scores)
                .filter(key => scores[key] > 0)
                .sort((a, b) => scores[b] - scores[a])
                .map(key => {
                    const label = SUBTYPES[key].name;
                    return `<div class="esd-score-row"><strong>${label}:</strong> ${scores[key].toFixed(
                        1
                    )} pattern points</div>`;
                })
                .join("");

            contentEl.innerHTML = `
                <div class="esd-step-label">Reflection summary</div>
                <div class="esd-question">
                    Here’s the empathy pattern that showed up most strongly in this check-in:
                </div>

                <div class="esd-result-chip">
                    <span>${subtype.id}</span>
                    <span>${subtype.name}</span>
                </div>

                <div class="esd-result-text">
                    In light emotional education terms, this is a <strong>${subtype.short}</strong> pattern.
                </div>

                <div class="esd-result-text">
                    ${subtype.teaching}
                </div>

                <div class="esd-mini-feedback">
                    Try this: ${subtype.practice}
                </div>

                <div class="esd-result-text">
                    How your choices mapped across the spectrum:
                </div>
                <div class="esd-score-list">
                    ${rows}
                </div>

                <div class="esd-nav-row esd-nav-row--center">
                    <button id="esd-restart" class="esd-nav-btn esd-nav-btn--primary">New check-in</button>
                </div>
            `;

            const restartBtn = contentEl.querySelector("#esd-restart");
            restartBtn.addEventListener("click", resetAndStart);
        }

        function resetAndStart() {
            state.stepIndex = 0;
            state.answers = {};
            renderStep();
        }

        // Trigger + open/close behavior

// Minimize/expand behavior
trigger.addEventListener("click", () => {
    const isOpen = panel.style.display === "block";

    if (isOpen) {
        // Minimize
        panel.style.display = "none";
    } else {
        // Expand full widget
        panel.style.display = "block";
        // Only rerender if starting fresh (prevents wiping progress)
        if (!state.answers || Object.keys(state.answers).length === 0) {
            state.stepIndex = 0;
            renderStep();
        }
    }
});


        closeBtn.addEventListener("click", () => {
            panel.style.display = "none";
        });

        // Initial load
        loadLastResult();
    })();
}
