/* -----------------------------------------------------------
   ESD MICRO-CHECK WIDGET 
   Auto-opens on page load, minimizes on user choice,
   adaptive scoring, smooth animations, glass UI compatible.
--------------------------------------------------------------*/

// Prevent double-initialization
if (!window.__esdWidgetInitialized) {
window.__esdWidgetInitialized = true;

(function initESDWidget() {

/* -------------------------------
   1. Inject CSS
--------------------------------*/
const css = document.createElement("link");
css.rel = "stylesheet";
css.href = "assets/css/esd-widget.css";
document.head.appendChild(css);

/* -------------------------------
   2. CONSTANTS
--------------------------------*/
const STORAGE_KEY = "esdWidgetLastResult";

const SUBTYPES = {
A: { id:"A", name:"Type A · Emotional Hypo-Empathy",
    short:"cooling or emotionally muted",
    teaching:"This pattern can feel practical or distant...",
    practice:"Try naming one concrete feeling + one body sensation." },

B: { id:"B", name:"Type B · Emotional Hyper-Empathy",
    short:"flooding or emotional overflow",
    teaching:"This pattern absorbs others’ emotions very quickly...",
    practice:"Slow exhale. Longer out than in. Remind yourself you don’t have to hold everything." },

C: { id:"C", name:"Type C · Cognitive-Dominant Empathy",
    short:"understanding more than feeling",
    teaching:"You lead with analysis and clarity of perspective...",
    practice:"Add an emotion sentence: 'It sounds like this feels ____.'" },

D: { id:"D", name:"Type D · Empathic Dysregulation (Oscillating)",
    short:"swinging between too much and too little",
    teaching:"You may flip between intense caring + sudden shutdowns...",
    practice:"Ask: 'Am I closer to flooded or numb right now? What is a 1% softer step?'" },

E: { id:"E", name:"Type E · Empathic Shutdown",
    short:"numbing or going offline",
    teaching:"Your system may be protecting you by dimming down...",
    practice:"Notice 3 neutral sensations around you to come back online gently." },

F: { id:"F", name:"Type F · Dark Empathy (Strategic)",
    short:"selective or instrumental attunement",
    teaching:"You use empathy purposefully—often strategically...",
    practice:"Ask: 'What outcome am I aiming for? How can I stay honest and caring?'" }
};

const STEPS = [
{
    id:"affect",
    label:"Step 1 of 3",
    question:"Right now, your emotional state feels closest to…",
    multi:false,
    options:[
        { id:"calm", label:"Mostly calm and steady", adds:{C:1,A:0.5},
          mini:"Calm states often mean your system has enough capacity." },

        { id:"flooded", label:"Worried, flooded, or teary", adds:{B:1,D:0.5},
          mini:"Flooding can signal hyper-empathy or fast activation." },

        { id:"shutdown", label:"Numb, blank, or checked out", adds:{E:1,A:0.5},
          mini:"Numbness shows up as protection, not failure." },

        { id:"irritable", label:"Irritable, snappy, or on edge", adds:{D:1,A:0.5,F:0.5},
          mini:"Irritation often means your window of tolerance is narrowing." },

        { id:"strategic", label:"In my head + managing the situation", adds:{C:1,F:0.5},
          mini:"Leading with strategy means cognitive empathy is driving." }
    ]
},
{
    id:"cues",
    label:"Step 2 of 3",
    question:"What signals are you noticing most in yourself?",
    multi:true,
    options:[
        { id:"body_amp", label:"Fast heartbeat / tight chest", adds:{B:1,D:0.5},
          mini:"Common activation signs—your system is moving quickly." },

        { id:"body_flat", label:"Heavy / slowed movement", adds:{E:1,A:0.5},
          mini:"Heaviness signals shutdown or low-energy protection." },

        { id:"mind_race", label:"Racing thoughts about others", adds:{B:1,F:0.5},
          mini:"Your mind may be looping around others' emotions." },

        { id:"mind_blank", label:"Blank / foggy mind", adds:{E:1,D:0.5},
          mini:"A foggy mind gently pulls the plug when overloaded." },

        { id:"analyze_mode", label:"Analyzing more than feeling", adds:{C:1,A:0.5},
          mini:"Classic C-type cognitive empathy." },

        { id:"control_mode", label:"Wanting to manage others' reactions", adds:{F:1,C:0.5},
          mini:"Strategic management is protective and intentional." }
    ]
},
{
    id:"relational",
    label:"Step 3 of 3",
    question:"Your empathy toward others feels…",
    multi:false,
    options:[
        { id:"over_merged", label:"Very merged; hard to tell what's mine",
          adds:{B:1,D:0.5},
          mini:"Merging = soft boundaries + emotional labor." },

        { id:"distant", label:"I care but feel flat or far away", adds:{A:1,E:0.5},
          mini:"Distance can be cooling or protective." },

        { id:"observing", label:"Observing more than feeling", adds:{C:1,A:0.5},
          mini:"Clear understanding, quieter emotion—C-type." },

        { id:"swinging", label:"Swinging between caring + shutting down",
          adds:{D:1,B:0.5,E:0.5},
          mini:"Oscillation = window of tolerance stress." },

        { id:"selective", label:"Empathic when it serves a goal",
          adds:{F:1,C:0.5},
          mini:"Intentional attunement = strategic empathy." }
    ]
}
];

/* -------------------------------
   3. STATE
--------------------------------*/
const state = {
step:0,
answers:{} // stepId -> string or array
};

/* -------------------------------
   4. CREATE DOM ELEMENTS
--------------------------------*/

// Floating circle trigger
const trigger = document.createElement("div");
trigger.id = "esd-widget-trigger";
trigger.textContent = "Check";

// Main panel
const panel = document.createElement("div");
panel.id = "esd-widget-panel";
panel.innerHTML = `
<div class="esd-panel-inner">
    <div class="esd-panel-header">
        <button id="esd-close" aria-label="Close widget">×</button>
        <div class="esd-pill">Mini ESD Check-in</div>
        <div class="esd-panel-title">Empathy Micro-Check</div>
        <div id="esd-last" class="esd-last" style="display:none;"></div>
    </div>
    <div id="esd-content"></div>
</div>
`;

document.body.appendChild(trigger);
document.body.appendChild(panel);

const content = panel.querySelector("#esd-content");
const closeBtn = panel.querySelector("#esd-close");
const lastResultEl = panel.querySelector("#esd-last");

/* -------------------------------
   5. MEMORY LOADING
--------------------------------*/
function loadLastResult() {
try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!data || !data.primary) return;

    const type = SUBTYPES[data.primary.id];
    if (!type) return;

    lastResultEl.style.display = "block";
    lastResultEl.innerHTML = `
        Last time your pattern leaned toward <strong>${type.name}</strong>.
    `;
} catch {}
}

function saveResult(scores, id) {
try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        timestamp:new Date().toISOString(),
        scores:scores,
        primary:{id}
    }));
} catch {}
}

/* -------------------------------
   6. SCORING
--------------------------------*/
function computeScores() {
const totals = {A:0,B:0,C:0,D:0,E:0,F:0};

STEPS.forEach(step => {
    const val = state.answers[step.id];
    if (!val) return;

    const apply = id => {
        const opt = step.options.find(o => o.id === id);
        if (!opt?.adds) return;
        Object.entries(opt.adds).forEach(([k,v]) => totals[k]+=v);
    };

    Array.isArray(val) ? val.forEach(apply) : apply(val);
});

return totals;
}

function getPrimary(scores) {
let best=null,score=-1;
for (const key in scores) {
    if (scores[key] > score) {
        score = scores[key];
        best = key;
    }
}
return score > 0 ? best : null;
}

/* -------------------------------
   7. RENDER FUNCTIONS
--------------------------------*/

function renderStep() {
const step = STEPS[state.step];
const stored = state.answers[step.id];

content.innerHTML = `
    <div class="esd-step-label">${step.label}</div>
    <div class="esd-question">${step.question}</div>

    <div class="esd-options">
        ${step.options.map(opt => {
            const selected = step.multi
                ? (Array.isArray(stored) && stored.includes(opt.id))
                : stored === opt.id;

            return `
                <button class="esd-option ${selected?'esd-option--selected':''}"
                    data-id="${opt.id}">${opt.label}</button>
            `;
        }).join('')}
    </div>

    <div id="esd-mini" class="esd-mini" style="display:none;"></div>

    <div class="esd-nav-row">
        <button id="esd-back" class="ghost">Back</button>
        <button id="esd-next" class="primary">
            ${state.step === STEPS.length-1 ? "See Reflection" : "Next"}
        </button>
    </div>
`;

const mini = content.querySelector("#esd-mini");
const options = content.querySelectorAll(".esd-option");

// Option click behavior
options.forEach(btn => {
    btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const opt = step.options.find(o=>o.id===id);

        if (step.multi) {
            let arr = Array.isArray(stored) ? [...stored] : [];
            arr.includes(id)
                ? arr = arr.filter(x=>x!==id)
                : arr.push(id);
            state.answers[step.id] = arr.length ? arr : undefined;
        } else {
            state.answers[step.id] = id;
        }

        // update selection visuals
        options.forEach(b => b.classList.remove("esd-option--selected"));
        if (step.multi) {
            const active = state.answers[step.id] || [];
            options.forEach(b => active.includes(b.dataset.id)
                && b.classList.add("esd-option--selected"));
        } else {
            btn.classList.add("esd-option--selected");
        }

        // mini feedback
        mini.style.display = opt.mini ? "block" : "none";
        mini.innerHTML = opt.mini ?? "";
    });
});

// Back button
content.querySelector("#esd-back").addEventListener("click", () => {
    if (state.step === 0) {
        panel.style.display = "none";
        return;
    }
    state.step--;
    renderStep();
});

// Next button
content.querySelector("#esd-next").addEventListener("click", () => {
    const ans = state.answers[step.id];
    if (!ans || (Array.isArray(ans) && ans.length===0)) {
        mini.style.display = "block";
        mini.innerHTML = "Choose at least one option to continue.";
        return;
    }

    if (state.step < STEPS.length-1) {
        state.step++;
        renderStep();
    } else {
        renderResults();
    }
});
}

function renderResults() {
const scores = computeScores();
const primary = getPrimary(scores);

if (!primary) {
    content.innerHTML = `
        <div class="esd-step-label">Reflection Summary</div>
        <p>No subtype stood out clearly this time — which is completely okay.</p>
        <div class="esd-nav-row esd-nav-row--center">
            <button id="esd-restart" class="primary">New Check-in</button>
        </div>
    `;
    content.querySelector("#esd-restart").addEventListener("click", restart);
    return;
}

const subtype = SUBTYPES[primary];

// Score rows
const rows = Object.entries(scores)
.filter(([k,v]) => v>0)
.sort((a,b)=>b[1]-a[1])
.map(([k,v]) => `
    <div class="esd-score-row">
        <strong>${SUBTYPES[k].name}:</strong> ${v.toFixed(1)}
    </div>
`).join("");

content.innerHTML = `
    <div class="esd-step-label">Reflection Summary</div>

    <div class="esd-result-chip">
        <span>${subtype.id}</span>
        <span>${subtype.name}</span>
    </div>

    <p class="esd-result-text">In emotional education terms, this reflects a <strong>${subtype.short}</strong> pattern.</p>
    <p class="esd-result-text">${subtype.teaching}</p>

    <div class="esd-mini">Try this: ${subtype.practice}</div>

    <p class="esd-result-text">Your pattern distribution:</p>
    <div class="esd-score-list">${rows}</div>

    <div class="esd-nav-row esd-nav-row--center">
        <button id="esd-restart" class="primary">New Check-in</button>
    </div>
`;

content.querySelector("#esd-restart").addEventListener("click", restart);

saveResult(scores, primary);
loadLastResult();
}

/* -------------------------------
   8. RESTART
--------------------------------*/
function restart() {
state.step = 0;
state.answers = {};
renderStep();
}

/* -------------------------------
   9. TRIGGER + PANEL BEHAVIOR
--------------------------------*/

trigger.addEventListener("click", () => {
const open = panel.style.display === "block";
panel.style.display = open ? "none" : "block";

if (!open && Object.keys(state.answers).length===0) {
    renderStep();
}
});

closeBtn.addEventListener("click", () => {
panel.style.display = "none";
});

/* -------------------------------
   10. AUTO-OPEN ON PAGE LOAD 
   Desktop: open
   Mobile: closed
--------------------------------*/
window.addEventListener("load", () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;

    if (isMobile) {
        // Mobile default collapsed
        panel.style.display = "none";
        trigger.style.display = "flex";
    } else {
        // Desktop default open
        panel.style.display = "block";
        trigger.style.display = "flex";

        // Start fresh check if no answers stored
        if (!state.answers || Object.keys(state.answers).length === 0) {
            state.step = 0;
            renderStep();
        }
    }

    loadLastResult();
});
}
