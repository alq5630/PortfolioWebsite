// Inject CSS automatically
(function addESDCSS() {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "assets/css/widget.css";
    document.head.appendChild(link);
})();

// -----------------------------------------
// Widget UI Creation
// -----------------------------------------

const widgetBtn = document.createElement("div");
widgetBtn.id = "esd-widget-btn";
widgetBtn.textContent = "ESD";

const panel = document.createElement("div");
panel.id = "esd-widget-panel";
panel.innerHTML = `
    <button id="esd-panel-close">×</button>
    <div class="esd-panel-title">Micro-Feedback Coach</div>
    <div class="esd-panel-text">How are you feeling right now?</div>

    <button class="esd-option" data-type="calm">Calm / Regulated</button>
    <button class="esd-option" data-type="anxious">Anxious / Overwhelmed</button>
    <button class="esd-option" data-type="shutdown">Shut Down / Numb</button>
    <button class="esd-option" data-type="irritated">Irritated / On Edge</button>

    <div id="esd-feedback" style="display:none;"></div>
`;

document.body.appendChild(widgetBtn);
document.body.appendChild(panel);

// -----------------------------------------
// Adaptive Logic
// -----------------------------------------

const feedbackBox = document.getElementById("esd-feedback");

const guidance = {
    calm: `
        <strong>You seem steady.</strong><br>
        Staying regulated strengthens Type C and healthy Type A patterns.
        Notice your breath and keep following what feels clear.
    `,
    anxious: `
        <strong>Your system feels activated.</strong><br>
        This often connects to Type B or Type D patterns.
        Try a slow exhale and orient your eyes to something stable.
    `,
    shutdown: `
        <strong>Your system may be protecting you.</strong><br>
        This aligns with Type E states.
        See if you can bring gentle awareness to your body and soften your shoulders.
    `,
    irritated: `
        <strong>You’re running hot.</strong><br>
        This can reflect Type D oscillation or Type A emotional blunting.
        Try a slow, deep breath and release tension from your jaw.
    `
};

// Button opens/closes panel
widgetBtn.addEventListener("click", () => {
    panel.style.display = panel.style.display === "block" ? "none" : "block";
});
document.getElementById("esd-panel-close").addEventListener("click", () => {
    panel.style.display = "none";
    feedbackBox.style.display = "none";
});

// Handle adaptive responses
document.querySelectorAll(".esd-option").forEach(btn => {
    btn.addEventListener("click", () => {
        const type = btn.dataset.type;
        feedbackBox.innerHTML = guidance[type];
        feedbackBox.style.display = "block";
    });
});
