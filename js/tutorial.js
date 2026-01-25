/* ============================================
   STEMfy.gr - Tutorial System
   Spotlight-style interactive tutorial
   ============================================ */

// ============================================
// TUTORIAL CONFIGURATION
// ============================================

function t(key, fallback) {
    return window.i18nManager?.t(key) || fallback;
}

function getTutorialSteps() {
    return [
        {
            target: '#pendulum-canvas-container',
            title: t('tutorial_canvas_title', 'Simulation Canvas'),
            text: t('tutorial_canvas_text', 'Watch the double pendulum in motion. The first arm hangs from the pivot, and the second hangs from the first.'),
            position: 'right'
        },
        {
            target: '#play-btn',
            title: t('tutorial_play_title', 'Play / Pause'),
            text: t('tutorial_play_text', 'Start or pause the simulation. You can also press the Space bar.'),
            position: 'bottom',
            requiresPanel: 'controls'
        },
        {
            target: '#reset-btn',
            title: t('tutorial_reset_title', 'Reset'),
            text: t('tutorial_reset_text', 'Reset the pendulum to its initial state. You can also press R.'),
            position: 'bottom',
            requiresPanel: 'controls'
        },
        {
            target: '#speed-control',
            title: t('tutorial_speed_title', 'Speed'),
            text: t('tutorial_speed_text', 'Adjust how fast the simulation runs.'),
            position: 'left',
            requiresPanel: 'controls'
        },
        {
            target: '#section-masses',
            title: t('tutorial_masses_title', 'Masses'),
            text: t('tutorial_masses_text', 'Change the masses to see how the motion evolves and how the two arms interact.'),
            position: 'left',
            requiresPanel: 'controls'
        },
        {
            target: '#section-lengths',
            title: t('tutorial_lengths_title', 'Lengths'),
            text: t('tutorial_lengths_text', 'Adjust the lengths to change how far each arm reaches.'),
            position: 'left',
            requiresPanel: 'controls'
        },
        {
            target: '#section-angles',
            title: t('tutorial_angles_title', 'Initial Angles'),
            text: t('tutorial_angles_text', 'Set the starting angles. 0\u00B0 is straight down, 90\u00B0 is horizontal.'),
            position: 'left',
            requiresPanel: 'controls'
        },
        {
            target: '#section-velocities',
            title: t('tutorial_velocities_title', 'Initial Velocities'),
            text: t('tutorial_velocities_text', 'Give the pendulum an initial push by setting angular velocities.'),
            position: 'left',
            requiresPanel: 'controls'
        },
        {
            target: '#section-damping',
            title: t('tutorial_damping_title', 'Damping'),
            text: t('tutorial_damping_text', 'Enable damping to model friction or air resistance. Higher values remove energy faster, so the motion settles.'),
            position: 'left',
            requiresPanel: 'controls'
        },
        {
            target: '#section-trail',
            title: t('tutorial_trail_title', 'Trail'),
            text: t('tutorial_trail_text', 'Toggle the trail to reveal beautiful patterns of motion.'),
            position: 'left',
            requiresPanel: 'controls'
        },
        {
            target: '#chaos-toggle',
            title: t('tutorial_chaos_toggle_title', 'Chaos Map'),
            text: t('tutorial_chaos_toggle_text', 'Open the chaos map to explore initial conditions.'),
            position: 'left',
            requiresPanel: 'controls'
        },
        {
            target: '#chaos-map-container',
            title: t('tutorial_chaos_panel_title', 'Chaos Map'),
            text: t('tutorial_chaos_panel_text', 'Each point corresponds to a different set of initial conditions. Click a point to see the resulting motion.'),
            position: 'right',
            requiresPanel: 'chaos'
        }
    ];
}

// ============================================
// TUTORIAL STATE
// ============================================

let tutorialState = {
    active: false,
    currentStep: 0,
    steps: [],
    overlay: null,
    highlight: null,
    tooltip: null,
    originalPanelStates: {}
};

const PANEL_TRANSITION_DELAY = 320;

// ============================================
// TUTORIAL FUNCTIONS
// ============================================

function startTutorial() {
    if (tutorialState.active) return;
    tutorialState.active = true;
    tutorialState.currentStep = 0;
    tutorialState.steps = getTutorialSteps();

    tutorialState.originalPanelStates = {
        controlPanel: state.controlPanelOpen,
        chaosPanel: state.chaosPanelOpen
    };

    createTutorialElements();
    showTutorialStep(0);
}

function endTutorial() {
    if (!tutorialState.active) return;
    tutorialState.active = false;

    if (tutorialState.overlay) {
        tutorialState.overlay.classList.remove('active');
        setTimeout(() => {
            tutorialState.overlay.remove();
            tutorialState.overlay = null;
            tutorialState.highlight = null;
            tutorialState.tooltip = null;
        }, 300);
    }

    if (!tutorialState.originalPanelStates.controlPanel) {
        const controlPanel = document.querySelector('.control-panel');
        if (controlPanel) {
            controlPanel.classList.add('collapsed');
            controlPanel.classList.remove('open');
        }
        state.controlPanelOpen = false;
    }

    if (!tutorialState.originalPanelStates.chaosPanel) {
        const chaosPanel = document.querySelector('.chaos-panel');
        if (chaosPanel) {
            chaosPanel.classList.add('collapsed');
            chaosPanel.classList.remove('open');
        }
        state.chaosPanelOpen = false;
    }

    if (typeof syncPanelStateClasses === 'function') {
        syncPanelStateClasses();
    }

    if (typeof resizeCanvas === 'function') {
        resizeCanvas();
    }
}

function createTutorialElements() {
    tutorialState.overlay = document.createElement('div');
    tutorialState.overlay.className = 'tutorial-overlay';

    tutorialState.highlight = document.createElement('div');
    tutorialState.highlight.className = 'tutorial-highlight';

    tutorialState.tooltip = document.createElement('div');
    tutorialState.tooltip.className = 'tutorial-tooltip';

    tutorialState.overlay.appendChild(tutorialState.highlight);
    tutorialState.overlay.appendChild(tutorialState.tooltip);
    document.body.appendChild(tutorialState.overlay);

    requestAnimationFrame(() => {
        tutorialState.overlay.classList.add('active');
    });
}

function showTutorialStep(stepIndex) {
    const step = tutorialState.steps[stepIndex];
    if (!step) {
        endTutorial();
        return;
    }

    tutorialState.currentStep = stepIndex;

    const target = document.querySelector(step.target);
    if (!target) {
        nextTutorialStep();
        return;
    }

    const delay = getPanelTransitionDelay(step);

    const positionStep = () => {
        if (typeof target.scrollIntoView === 'function') {
            target.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
        }

        requestAnimationFrame(() => {
            positionHighlight(target);
            updateTooltip(step, target, stepIndex);
        });
    };

    if (delay > 0) {
        setTimeout(positionStep, delay);
    } else {
        positionStep();
    }
}

function getPanelTransitionDelay(step) {
    if (step.requiresPanel === 'controls') {
        const controlPanel = document.querySelector('.control-panel');
        const wasCollapsed = controlPanel && controlPanel.classList.contains('collapsed');
        openPanel('controls');
        return wasCollapsed ? PANEL_TRANSITION_DELAY : 0;
    }

    if (step.requiresPanel === 'chaos') {
        const chaosPanel = document.querySelector('.chaos-panel');
        const wasCollapsed = chaosPanel && chaosPanel.classList.contains('collapsed');
        openPanel('chaos');
        return wasCollapsed ? PANEL_TRANSITION_DELAY : 0;
    }

    return 0;
}

function openPanel(panel) {
    if (panel === 'controls') {
        const controlPanel = document.querySelector('.control-panel');
        if (controlPanel) {
            controlPanel.classList.remove('collapsed');
            controlPanel.classList.add('open');
        }
        state.controlPanelOpen = true;
        if (typeof syncPanelStateClasses === 'function') {
            syncPanelStateClasses();
        }
        if (typeof resizeCanvas === 'function') {
            resizeCanvas();
        }
        return;
    }

    if (panel === 'chaos') {
        const chaosPanel = document.querySelector('.chaos-panel');
        if (chaosPanel) {
            chaosPanel.classList.remove('collapsed');
            chaosPanel.classList.add('open');
        }
        state.chaosPanelOpen = true;
        if (!state.chaosMapData && typeof computeChaosMap === 'function') {
            computeChaosMap();
        }
        if (typeof syncPanelStateClasses === 'function') {
            syncPanelStateClasses();
        }
        if (typeof resizeCanvas === 'function') {
            resizeCanvas();
        }
    }
}

function positionHighlight(target) {
    const rect = target.getBoundingClientRect();
    const padding = 8;

    tutorialState.highlight.style.top = `${rect.top - padding}px`;
    tutorialState.highlight.style.left = `${rect.left - padding}px`;
    tutorialState.highlight.style.width = `${rect.width + padding * 2}px`;
    tutorialState.highlight.style.height = `${rect.height + padding * 2}px`;
}

function updateTooltip(step, target, stepIndex) {
    const tooltip = tutorialState.tooltip;
    const totalSteps = tutorialState.steps.length;

    tooltip.innerHTML = '';

    const stepEl = document.createElement('div');
    stepEl.className = 'tutorial-tooltip__step';
    stepEl.textContent = (t('tutorial_step_label', 'Step {current} / {total}')
        .replace('{current}', stepIndex + 1)
        .replace('{total}', totalSteps));

    const titleEl = document.createElement('h3');
    titleEl.className = 'tutorial-tooltip__title';
    titleEl.textContent = step.title;

    const textEl = document.createElement('p');
    textEl.className = 'tutorial-tooltip__text';
    textEl.textContent = step.text;

    const actions = document.createElement('div');
    actions.className = 'tutorial-tooltip__actions';

    const skipBtn = document.createElement('button');
    skipBtn.className = 'tutorial-tooltip__btn tutorial-tooltip__btn--skip';
    skipBtn.type = 'button';
    skipBtn.textContent = t('tutorial_skip', 'Skip');
    skipBtn.addEventListener('click', endTutorial);

    const nextBtn = document.createElement('button');
    nextBtn.className = 'tutorial-tooltip__btn tutorial-tooltip__btn--next';
    nextBtn.type = 'button';
    nextBtn.textContent = stepIndex === totalSteps - 1
        ? t('tutorial_finish', 'Finish')
        : t('tutorial_next', 'Next');
    nextBtn.addEventListener('click', nextTutorialStep);

    actions.appendChild(skipBtn);
    actions.appendChild(nextBtn);

    tooltip.appendChild(stepEl);
    tooltip.appendChild(titleEl);
    tooltip.appendChild(textEl);
    tooltip.appendChild(actions);

    positionTooltip(target, step.position);
}

function positionTooltip(target, position) {
    const tooltip = tutorialState.tooltip;
    const rect = target.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();
    const padding = 20;

    let top;
    let left;

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

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < padding) {
        left = padding;
    } else if (left + tooltipRect.width > viewportWidth - padding) {
        left = viewportWidth - tooltipRect.width - padding;
    }

    if (top < padding) {
        top = rect.bottom + padding;
    } else if (top + tooltipRect.height > viewportHeight - padding) {
        top = rect.top - tooltipRect.height - padding;
    }

    tooltip.style.top = `${top}px`;
    tooltip.style.left = `${left}px`;
}

function nextTutorialStep() {
    const nextIndex = tutorialState.currentStep + 1;
    if (nextIndex >= tutorialState.steps.length) {
        endTutorial();
    } else {
        showTutorialStep(nextIndex);
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
}, true);
