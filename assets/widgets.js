// Create floating button
const esdButton = document.createElement("div");
esdButton.id = "esd-widget-button";
esdButton.textContent = "ESD";
document.body.appendChild(esdButton);

// Create panel
const esdPanel = document.createElement("div");
esdPanel.id = "esd-widget-panel";
esdPanel.innerHTML = `
    <button id="esd-widget-close">×</button>
    <h3>Micro-Feedback Coach</h3>
    <p>How are you feeling right now?</p>

    <button class="button secondary" style="width:100%; margin-bottom:6px;">Calm / Regulated</button>
    <button class="button secondary" style="width:100%; margin-bottom:6px;">Anxious / Overwhelmed</button>
    <button class="button secondary" style="width:100%; margin-bottom:6px;">Shut Down / Numb</button>
    <button class="button secondary" style="width:100%; margin-bottom:6px;">Irritated / On Edge</button>

    <p style="font-size:0.8rem; color:#666; margin-top:12px;">
        This widget offers quick reflection prompts using the ESD framework.
    </p>
`;
document.body.appendChild(esdPanel);

// Toggle open/close
esdButton.addEventListener("click", () => {
    esdPanel.style.display =
        esdPanel.style.display === "block" ? "none" : "block";
});

document.addEventListener("click", (e) => {
    if (e.target.id === "esd-widget-close") {
        esdPanel.style.display = "none";
    }
});
