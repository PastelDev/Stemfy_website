/* ============================================
   STEMfy.gr — Tutorial System
   Spotlight-style interactive tutorial
   ============================================ */

// ============================================
// TUTORIAL CONFIGURATION
// ============================================

const TUTORIAL_STEPS = [
    {
        target: '#pendulum-canvas',
        title: 'Καμβάς Προσομοίωσης',
        text: 'Εδώ βλέπεις το διπλό εκκρεμές να κινείται. Το πρώτο εκκρεμές κρέμεται από το σταθερό σημείο, και το δεύτερο κρέμεται από το πρώτο.',
        position: 'right'
    },
    {
        target: '#play-btn',
        title: 'Αναπαραγωγή / Παύση',
        text: 'Ξεκίνα ή σταμάτα την προσομοίωση. Μπορείς επίσης να πατήσεις το πλήκτρο Space.',
        position: 'bottom'
    },
    {
        target: '#reset-btn',
        title: 'Επαναφορά',
        text: 'Επανάφερε το εκκρεμές στην αρχική του θέση. Μπορείς επίσης να πατήσεις το πλήκτρο R.',
        position: 'bottom'
    },
    {
        target: '.control-section:nth-child(1)',
        title: 'Μάζες',
        text: 'Οι μάζες (m₁ και m₂) επηρεάζουν πόσο γρήγορα κινείται το εκκρεμές και πώς αλληλεπιδρούν τα δύο μέρη του.',
        position: 'left'
    },
    {
        target: '.control-section:nth-child(2)',
        title: 'Μήκη',
        text: 'Τα μήκη (L₁ και L₂) καθορίζουν πόσο μακριά φτάνει κάθε μέρος του εκκρεμούς.',
        position: 'left'
    },
    {
        target: '.control-section:nth-child(3)',
        title: 'Αρχικές Γωνίες',
        text: 'Οι γωνίες θ₁ και θ₂ καθορίζουν από πού ξεκινάει το εκκρεμές. 0° σημαίνει κάθετα προς τα κάτω, 90° οριζόντια.',
        position: 'left'
    },
    {
        target: '.control-section:nth-child(4)',
        title: 'Αρχικές Ταχύτητες',
        text: 'Οι γωνιακές ταχύτητες ω₁ και ω₂ καθορίζουν με πόση ορμή ξεκινάει κάθε μέρος. Θετικές τιμές = δεξιόστροφα.',
        position: 'left'
    },
    {
        target: '#trail-enabled',
        title: 'Ίχνος Τροχιάς',
        text: 'Ενεργοποίησε για να δεις το ίχνος που αφήνει το δεύτερο βαρίδι καθώς κινείται. Βοηθάει να καταλάβεις το μοτίβο της κίνησης.',
        position: 'left',
        parentSelector: '.control-toggle'
    },
    {
        target: '#chaos-toggle',
        title: 'Χάρτης Χάους',
        text: 'Άνοιξε τον χάρτη χάους για να δεις ποιες αρχικές συνθήκες οδηγούν σε χαοτική κίνηση.',
        position: 'left'
    },
    {
        target: '.chaos-panel',
        title: 'Ο Χάρτης Χάους',
        text: 'Κάθε σημείο αντιστοιχεί σε διαφορετικές αρχικές συνθήκες. Τα μπλε σημεία δείχνουν σταθερή κίνηση, τα κόκκινα χαοτική. Κάνε κλικ σε ένα σημείο για να δεις την αντίστοιχη κίνηση!',
        position: 'right',
        requiresPanel: 'chaos'
    }
];

// ============================================
// TUTORIAL STATE
// ============================================

let tutorialState = {
    active: false,
    currentStep: 0,
    overlay: null,
    highlight: null,
    tooltip: null,
    originalPanelStates: {}
};

// ============================================
// TUTORIAL FUNCTIONS
// ============================================

/**
 * Start the tutorial
 */
function startTutorial() {
    if (tutorialState.active) return;
    
    tutorialState.active = true;
    tutorialState.currentStep = 0;
    
    // Save panel states
    tutorialState.originalPanelStates = {
        controlPanel: state.controlPanelOpen,
        chaosPanel: state.chaosPanelOpen
    };
    
    // Create overlay elements
    createTutorialElements();
    
    // Show first step
    showTutorialStep(0);
}

/**
 * End the tutorial
 */
function endTutorial() {
    if (!tutorialState.active) return;
    
    tutorialState.active = false;
    
    // Remove overlay
    if (tutorialState.overlay) {
        tutorialState.overlay.classList.remove('active');
        setTimeout(() => {
            tutorialState.overlay.remove();
            tutorialState.overlay = null;
            tutorialState.highlight = null;
            tutorialState.tooltip = null;
        }, 300);
    }
    
    // Restore panel states
    if (!tutorialState.originalPanelStates.controlPanel) {
        const controlPanel = document.querySelector('.control-panel');
        if (controlPanel) {
            controlPanel.classList.add('collapsed');
            controlPanel.classList.remove('open');
        }
    }
    
    if (!tutorialState.originalPanelStates.chaosPanel) {
        const chaosPanel = document.querySelector('.chaos-panel');
        if (chaosPanel) {
            chaosPanel.classList.add('collapsed');
            chaosPanel.classList.remove('open');
        }
    }
}

/**
 * Create tutorial overlay elements
 */
function createTutorialElements() {
    // Create overlay
    tutorialState.overlay = document.createElement('div');
    tutorialState.overlay.className = 'tutorial-overlay';
    
    // Create highlight box
    tutorialState.highlight = document.createElement('div');
    tutorialState.highlight.className = 'tutorial-highlight';
    
    // Create tooltip
    tutorialState.tooltip = document.createElement('div');
    tutorialState.tooltip.className = 'tutorial-tooltip';
    
    // Add elements to overlay
    tutorialState.overlay.appendChild(tutorialState.highlight);
    tutorialState.overlay.appendChild(tutorialState.tooltip);
    
    // Add to body
    document.body.appendChild(tutorialState.overlay);
    
    // Activate after a small delay for transition
    requestAnimationFrame(() => {
        tutorialState.overlay.classList.add('active');
    });
}

/**
 * Show a specific tutorial step
 * @param {number} stepIndex - Step index to show
 */
function showTutorialStep(stepIndex) {
    const step = TUTORIAL_STEPS[stepIndex];
    if (!step) {
        endTutorial();
        return;
    }
    
    tutorialState.currentStep = stepIndex;
    
    // Handle required panels
    if (step.requiresPanel === 'chaos') {
        const chaosPanel = document.querySelector('.chaos-panel');
        if (chaosPanel) {
            chaosPanel.classList.remove('collapsed');
            chaosPanel.classList.add('open');
            state.chaosPanelOpen = true;
        }
    }
    
    // Find target element
    let target;
    if (step.parentSelector) {
        // Find parent first, then target within it
        const parent = document.querySelector(step.target)?.closest(step.parentSelector);
        target = parent || document.querySelector(step.target);
    } else {
        target = document.querySelector(step.target);
    }
    
    if (!target) {
        // Skip to next step if target not found
        nextTutorialStep();
        return;
    }
    
    // Position highlight
    positionHighlight(target);
    
    // Update and position tooltip
    updateTooltip(step, target, stepIndex);
}

/**
 * Position the highlight box around target element
 * @param {HTMLElement} target - Target element
 */
function positionHighlight(target) {
    const rect = target.getBoundingClientRect();
    const padding = 8;
    
    tutorialState.highlight.style.top = `${rect.top - padding}px`;
    tutorialState.highlight.style.left = `${rect.left - padding}px`;
    tutorialState.highlight.style.width = `${rect.width + padding * 2}px`;
    tutorialState.highlight.style.height = `${rect.height + padding * 2}px`;
}

/**
 * Update tooltip content and position
 * @param {object} step - Current step data
 * @param {HTMLElement} target - Target element
 * @param {number} stepIndex - Current step index
 */
function updateTooltip(step, target, stepIndex) {
    const tooltip = tutorialState.tooltip;
    const totalSteps = TUTORIAL_STEPS.length;
    
    tooltip.innerHTML = `
        <div class="tutorial-tooltip__step">Βήμα ${stepIndex + 1} / ${totalSteps}</div>
        <h3 class="tutorial-tooltip__title">${step.title}</h3>
        <p class="tutorial-tooltip__text">${step.text}</p>
        <div class="tutorial-tooltip__actions">
            <button class="tutorial-tooltip__btn tutorial-tooltip__btn--skip" onclick="endTutorial()">
                Παράλειψη
            </button>
            <button class="tutorial-tooltip__btn tutorial-tooltip__btn--next" onclick="nextTutorialStep()">
                ${stepIndex === totalSteps - 1 ? 'Τέλος' : 'Επόμενο'}
            </button>
        </div>
    `;
    
    // Position tooltip
    positionTooltip(target, step.position);
}

/**
 * Position tooltip relative to target
 * @param {HTMLElement} target - Target element
 * @param {string} position - Preferred position (top, bottom, left, right)
 */
function positionTooltip(target, position) {
    const tooltip = tutorialState.tooltip;
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 20;
    
    let top, left;
    
    // Calculate position based on preference
    switch (position) {
        case 'top':
            top = rect.top - tooltipRect.height - padding;
            left = rect.left + (rect.width - tooltipRect.width) / 2;
            break;
        case 'bottom':
            top = rect.bottom + padding;
            left = rect.left + (rect.width - tooltipRect.width) / 2;
            break;
        case 'left':
            top = rect.top + (rect.height - tooltipRect.height) / 2;
            left = rect.left - tooltipRect.width - padding;
            break;
        case 'right':
            top = rect.top + (rect.height - tooltipRect.height) / 2;
            left = rect.right + padding;
            break;
        default:
            top = rect.bottom + padding;
            left = rect.left;
    }
    
    // Keep tooltip in viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Horizontal bounds
    if (left < padding) {
        left = padding;
    } else if (left + tooltipRect.width > viewportWidth - padding) {
        left = viewportWidth - tooltipRect.width - padding;
    }
    
    // Vertical bounds
    if (top < padding) {
        top = rect.bottom + padding; // Flip to bottom
    } else if (top + tooltipRect.height > viewportHeight - padding) {
        top = rect.top - tooltipRect.height - padding; // Flip to top
    }
    
    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

/**
 * Go to next tutorial step
 */
function nextTutorialStep() {
    const nextIndex = tutorialState.currentStep + 1;
    
    if (nextIndex >= TUTORIAL_STEPS.length) {
        endTutorial();
    } else {
        showTutorialStep(nextIndex);
    }
}

/**
 * Go to previous tutorial step
 */
function prevTutorialStep() {
    const prevIndex = tutorialState.currentStep - 1;
    
    if (prevIndex >= 0) {
        showTutorialStep(prevIndex);
    }
}

// Handle window resize during tutorial
window.addEventListener('resize', debounce(() => {
    if (tutorialState.active) {
        showTutorialStep(tutorialState.currentStep);
    }
}, 100));

// Handle escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && tutorialState.active) {
        endTutorial();
    }
});
