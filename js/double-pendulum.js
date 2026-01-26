/* ============================================
   STEMfy.gr — Double Pendulum Simulation
   Physics Engine, Rendering, and UI
   ============================================ */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Default parameters
    defaults: {
        m1: 1,      // Mass 1 (kg)
        m2: 1,      // Mass 2 (kg)
        L1: 1,      // Length 1 (m)
        L2: 1,      // Length 2 (m)
        theta1: 90, // Initial angle 1 (degrees)
        theta2: 90, // Initial angle 2 (degrees)
        omega1: 0,  // Initial angular velocity 1 (rad/s)
        omega2: 0,  // Initial angular velocity 2 (rad/s)
        g: 9.81,    // Gravity (m/s²)
        damping: 0  // Damping coefficient
    },
    
    // Parameter ranges
    ranges: {
        m1: { min: 0.1, max: 10, step: 0.1 },
        m2: { min: 0.1, max: 10, step: 0.1 },
        L1: { min: 0.1, max: 2, step: 0.05 },
        L2: { min: 0.1, max: 2, step: 0.05 },
        theta1: { min: -180, max: 180, step: 1 },
        theta2: { min: -180, max: 180, step: 1 },
        omega1: { min: -10, max: 10, step: 0.1 },
        omega2: { min: -10, max: 10, step: 0.1 },
        g: { min: 0, max: 20, step: 0.1 },
        damping: { min: 0, max: 1, step: 0.01 }
    },
    
    // Simulation settings
    simulation: {
        dt: 0.001,          // Time step for physics
        stepsPerFrame: 10,  // Physics steps per render frame
        speedMultiplier: 1  // Playback speed
    },
    
    // Trail settings
    trail: {
        maxLength: 2000,
        fadeStart: 0.3,
        defaultDuration: 5 // seconds
    },
    
    // Rendering
    render: {
        scale: 100,         // Pixels per meter
        pivotRadius: 8,
        mass1Radius: 15,
        mass2Radius: 15,
        rodWidth: 3,
        trailWidth: 2
    },
    
    // Chaos map
    chaosMap: {
        resolution: 100,
        simulationTime: 10,
        dt: 0.01,
        perturbation: 1e-8
    },
    
    // Colors
    colors: {
        pivot: '#b08af0',
        rod: '#6a4a9e',
        mass1: '#d4a0ff',
        mass2: '#ff7aec',
        trail: '#ff7aec',
        trailFade: '#b08af0'
    }
};

const VIEW_STORAGE_KEY = 'pendulumViewPreference';
const VIEW_MODES = {
    auto: 'auto',
    mobile: 'mobile',
    desktop: 'desktop'
};

const CHAOS_WARNING_STORAGE_KEY = 'pendulumChaosWarningDismissed';

// ============================================
// STATE
// ============================================

const state = {
    // Current parameters
    params: { ...CONFIG.defaults },

    // Simulation state
    theta1: 0,
    theta2: 0,
    omega1: 0,
    omega2: 0,

    // Animation state
    isPlaying: false,
    animationId: null,
    lastTime: 0,

    // Trail
    trail: [],
    trailEnabled: true,
    trailInfinite: false,
    trailDuration: CONFIG.trail.defaultDuration,

    // Chaos map
    chaosMapVisible: false,
    chaosMapData: null,
    chaosMapComputing: false,
    chaosMapSignature: null,
    chaosMapSnapshot: null,
    chaosAxisX: 'theta1',
    chaosAxisY: 'theta2',
    chaosGridEnabled: true,

    // UI
    controlPanelOpen: true,
    chaosPanelOpen: true,

    // Mobile UI
    mobileActivePanel: 'simulation', // 'simulation', 'controls', 'chaos'
    mobilePreviewVisible: false,
    mobilePreviewTimeout: null,

    // Preview box drag
    previewDrag: {
        isDragging: false,
        startX: 0,
        startY: 0,
        offsetX: 0,
        offsetY: 0,
        customPosition: false // true if user has dragged to custom position
    }
};

const INFO_CANVAS_SIZES = {
    trajectory: { width: 1400, height: 900 },
    chaos: { width: 1200, height: 820 }
};

const PARAMETER_METADATA = [
    { key: 'm1', labelKey: 'label_m1', unit: 'kg', decimals: 2 },
    { key: 'm2', labelKey: 'label_m2', unit: 'kg', decimals: 2 },
    { key: 'L1', labelKey: 'label_L1', unit: 'm', decimals: 2 },
    { key: 'L2', labelKey: 'label_L2', unit: 'm', decimals: 2 },
    { key: 'theta1', labelKey: 'label_theta1', unit: '\u00B0', decimals: 1 },
    { key: 'theta2', labelKey: 'label_theta2', unit: '\u00B0', decimals: 1 },
    { key: 'omega1', labelKey: 'label_omega1', unit: 'rad/s', decimals: 1 },
    { key: 'omega2', labelKey: 'label_omega2', unit: 'rad/s', decimals: 1 },
    { key: 'g', labelKey: 'label_g', unit: '', decimals: 2 },
    { key: 'damping', labelKey: 'section_damping_title', unit: '', decimals: 2 }
];

const INFO_THEME = {
    backgroundStart: '#0a0812',
    backgroundEnd: '#1a0f2b',
    panel: 'rgba(18, 12, 28, 0.92)',
    border: 'rgba(176, 138, 240, 0.35)',
    accent: '#b08af0',
    text: '#f8f4ff',
    muted: 'rgba(248, 244, 255, 0.7)',
    subtle: 'rgba(248, 244, 255, 0.45)',
    highlight: '#ff7aec'
};

const AXIS_LABEL_KEYS = {
    theta1: 'axis_theta1',
    theta2: 'axis_theta2',
    omega1: 'axis_omega1',
    omega2: 'axis_omega2'
};

// ============================================
// VIEW MODE
// ============================================

function isMobileDevice() {
    if (navigator.userAgentData && typeof navigator.userAgentData.mobile === 'boolean') {
        return navigator.userAgentData.mobile;
    }
    return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function isCompactViewport() {
    return window.innerWidth <= 900 || window.innerHeight <= 700;
}

function prefersMobileLayout() {
    const coarsePointer = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    return isMobileDevice() || coarsePointer || isCompactViewport();
}

function getStoredViewPreference() {
    try {
        return localStorage.getItem(VIEW_STORAGE_KEY) || VIEW_MODES.auto;
    } catch (err) {
        return VIEW_MODES.auto;
    }
}

function getEffectiveViewMode(preference) {
    if (preference === VIEW_MODES.auto) {
        return prefersMobileLayout() ? VIEW_MODES.mobile : VIEW_MODES.desktop;
    }
    return preference;
}

function updateViewToggleLabel(effectiveMode) {
    if (!elements.viewToggleBtn) return;
    const isMobile = effectiveMode === VIEW_MODES.mobile;
    const i18n = window.i18nManager;
    const labelKey = isMobile ? 'view_desktop_label' : 'view_mobile_label';
    const label = i18n?.t(labelKey) || (isMobile ? 'Switch to desktop view' : 'Switch to mobile view');
    elements.viewToggleBtn.setAttribute('aria-label', label);
    elements.viewToggleBtn.setAttribute('title', label);
    elements.viewToggleBtn.setAttribute('data-view', isMobile ? 'mobile' : 'desktop');
}

function updateNavHeightVariable() {
    const nav = document.querySelector('.sim-nav');
    const page = document.querySelector('.simulation-page');
    if (!nav || !page) return;
    const height = nav.getBoundingClientRect().height;
    page.style.setProperty('--sim-nav-height', `${height}px`);
}

function applyViewPreference(preference) {
    const body = document.body;
    if (!body) return;

    const wasMobile = body.classList.contains('sim-view-mobile');
    body.classList.remove('sim-view-mobile', 'sim-view-desktop');

    const effective = getEffectiveViewMode(preference);
    if (effective === VIEW_MODES.mobile) {
        body.classList.add('sim-view-mobile');
    } else if (preference === VIEW_MODES.desktop) {
        body.classList.add('sim-view-desktop');
    }

    const controlPanel = document.querySelector('.control-panel');
    const chaosPanel = document.querySelector('.chaos-panel');
    const simMain = document.querySelector('.sim-main');

    // Handle transition to mobile
    if (effective === VIEW_MODES.mobile && !wasMobile) {
        // Reset to simulation panel view
        state.mobileActivePanel = 'simulation';
        state.controlPanelOpen = false;
        state.chaosPanelOpen = false;

        if (controlPanel) {
            controlPanel.classList.add('collapsed');
            controlPanel.classList.remove('open', 'mobile-active');
        }
        if (chaosPanel) {
            chaosPanel.classList.add('collapsed');
            chaosPanel.classList.remove('open', 'mobile-active');
        }
        if (simMain) {
            simMain.classList.remove('mobile-hidden');
        }

        // Update tabs
        const tabs = document.querySelectorAll('.mobile-tab');
        tabs.forEach(tab => {
            tab.classList.toggle('active', tab.getAttribute('data-panel') === 'simulation');
        });

        // Hide preview
        hideMobilePreview();
    }

    // Handle transition to desktop
    if (effective === VIEW_MODES.desktop && wasMobile) {
        if (controlPanel) {
            controlPanel.classList.remove('collapsed', 'mobile-active');
            controlPanel.classList.add('open');
        }
        if (chaosPanel) {
            chaosPanel.classList.remove('collapsed', 'mobile-active');
            chaosPanel.classList.add('open');
        }
        if (simMain) {
            simMain.classList.remove('mobile-hidden');
        }
        state.controlPanelOpen = true;
        state.chaosPanelOpen = true;
    }

    updateViewToggleLabel(effective);
    updateNavHeightVariable();
    updateViewModeSwitcherIcon();

    if (typeof syncPanelStateClasses === 'function') {
        syncPanelStateClasses();
    }
    if (typeof resizeCanvas === 'function') {
        resizeCanvas();
    }
}

function setViewPreference(preference) {
    try {
        localStorage.setItem(VIEW_STORAGE_KEY, preference);
    } catch (err) {
        // Ignore storage errors (private mode, etc.)
    }
    applyViewPreference(preference);
}

function toggleViewPreference() {
    const currentPreference = getStoredViewPreference();
    const effective = getEffectiveViewMode(currentPreference);
    const next = effective === VIEW_MODES.mobile ? VIEW_MODES.desktop : VIEW_MODES.mobile;
    setViewPreference(next);
}

function initViewMode() {
    const preference = getStoredViewPreference();
    applyViewPreference(preference);

    window.addEventListener('resize', debounce(() => {
        const currentPreference = getStoredViewPreference();
        if (currentPreference === VIEW_MODES.auto) {
            applyViewPreference(currentPreference);
        } else {
            updateNavHeightVariable();
        }
    }, 150));
}

// ============================================
// DOM ELEMENTS
// ============================================

let canvas, ctx;
let chaosCanvas, chaosCtx;
let previewCanvas, previewCtx;
let elements = {};
let chaosWarning = {
    modal: null,
    confirmBtn: null,
    cancelBtn: null,
    closeBtn: null,
    skipCheckbox: null,
    resolver: null,
    isOpen: false
};

// ============================================
// PHYSICS ENGINE
// ============================================

/**
 * Compute accelerations using Lagrangian mechanics
 * Returns [alpha1, alpha2] (angular accelerations)
 */
function computeAccelerations(theta1, theta2, omega1, omega2, params) {
    const { m1, m2, L1, L2, g, damping } = params;
    
    const delta = theta1 - theta2;
    const sinDelta = Math.sin(delta);
    const cosDelta = Math.cos(delta);
    
    const sin1 = Math.sin(theta1);
    const sin2 = Math.sin(theta2);
    
    // Denominator (common to both equations)
    const denom = 2 * m1 + m2 - m2 * Math.cos(2 * delta);
    
    // Angular acceleration of first pendulum
    const num1 = -g * (2 * m1 + m2) * sin1 
                 - m2 * g * Math.sin(theta1 - 2 * theta2)
                 - 2 * sinDelta * m2 * (omega2 * omega2 * L2 + omega1 * omega1 * L1 * cosDelta);
    const alpha1 = num1 / (L1 * denom);
    
    // Angular acceleration of second pendulum
    const num2 = 2 * sinDelta * (
        omega1 * omega1 * L1 * (m1 + m2)
        + g * (m1 + m2) * Math.cos(theta1)
        + omega2 * omega2 * L2 * m2 * cosDelta
    );
    const alpha2 = num2 / (L2 * denom);
    
    // Apply damping
    const dampedAlpha1 = alpha1 - damping * omega1;
    const dampedAlpha2 = alpha2 - damping * omega2;
    
    return [dampedAlpha1, dampedAlpha2];
}

/**
 * RK4 integration step
 */
function rk4Step(theta1, theta2, omega1, omega2, dt, params) {
    // k1
    const [a1_k1, a2_k1] = computeAccelerations(theta1, theta2, omega1, omega2, params);
    const o1_k1 = omega1;
    const o2_k1 = omega2;
    
    // k2
    const [a1_k2, a2_k2] = computeAccelerations(
        theta1 + o1_k1 * dt/2,
        theta2 + o2_k1 * dt/2,
        omega1 + a1_k1 * dt/2,
        omega2 + a2_k1 * dt/2,
        params
    );
    const o1_k2 = omega1 + a1_k1 * dt/2;
    const o2_k2 = omega2 + a2_k1 * dt/2;
    
    // k3
    const [a1_k3, a2_k3] = computeAccelerations(
        theta1 + o1_k2 * dt/2,
        theta2 + o2_k2 * dt/2,
        omega1 + a1_k2 * dt/2,
        omega2 + a2_k2 * dt/2,
        params
    );
    const o1_k3 = omega1 + a1_k2 * dt/2;
    const o2_k3 = omega2 + a2_k2 * dt/2;
    
    // k4
    const [a1_k4, a2_k4] = computeAccelerations(
        theta1 + o1_k3 * dt,
        theta2 + o2_k3 * dt,
        omega1 + a1_k3 * dt,
        omega2 + a2_k3 * dt,
        params
    );
    const o1_k4 = omega1 + a1_k3 * dt;
    const o2_k4 = omega2 + a2_k3 * dt;
    
    // Combine
    const newTheta1 = theta1 + (o1_k1 + 2*o1_k2 + 2*o1_k3 + o1_k4) * dt / 6;
    const newTheta2 = theta2 + (o2_k1 + 2*o2_k2 + 2*o2_k3 + o2_k4) * dt / 6;
    const newOmega1 = omega1 + (a1_k1 + 2*a1_k2 + 2*a1_k3 + a1_k4) * dt / 6;
    const newOmega2 = omega2 + (a2_k1 + 2*a2_k2 + 2*a2_k3 + a2_k4) * dt / 6;
    
    return [newTheta1, newTheta2, newOmega1, newOmega2];
}

/**
 * Compute Lyapunov exponent for given initial conditions
 */
function computeLyapunov(params, time = CONFIG.chaosMap.simulationTime) {
    const dt = CONFIG.chaosMap.dt;
    const steps = Math.floor(time / dt);
    const eps = CONFIG.chaosMap.perturbation;
    
    // Main trajectory
    let t1 = params.theta1;
    let t2 = params.theta2;
    let o1 = params.omega1;
    let o2 = params.omega2;
    
    // Perturbed trajectory
    let pt1 = t1 + eps;
    let pt2 = t2;
    let po1 = o1;
    let po2 = o2;
    
    let lyapunovSum = 0;
    
    for (let i = 0; i < steps; i++) {
        // Evolve both trajectories
        [t1, t2, o1, o2] = rk4Step(t1, t2, o1, o2, dt, params);
        [pt1, pt2, po1, po2] = rk4Step(pt1, pt2, po1, po2, dt, params);
        
        // Compute separation
        const d = Math.sqrt(
            Math.pow(pt1 - t1, 2) + 
            Math.pow(pt2 - t2, 2) +
            Math.pow(po1 - o1, 2) +
            Math.pow(po2 - o2, 2)
        );
        
        if (d > 0 && isFinite(d)) {
            lyapunovSum += Math.log(d / eps);
            
            // Renormalize perturbed trajectory
            const scale = eps / d;
            pt1 = t1 + (pt1 - t1) * scale;
            pt2 = t2 + (pt2 - t2) * scale;
            po1 = o1 + (po1 - o1) * scale;
            po2 = o2 + (po2 - o2) * scale;
        }
    }
    
    return lyapunovSum / time;
}

// ============================================
// RENDERING
// ============================================

/**
 * Get canvas coordinates for pendulum position
 */
function getPosition(theta1, theta2, params) {
    const { L1, L2 } = params;
    const scale = CONFIG.render.scale;
    
    const x1 = L1 * Math.sin(theta1) * scale;
    const y1 = L1 * Math.cos(theta1) * scale;
    
    const x2 = x1 + L2 * Math.sin(theta2) * scale;
    const y2 = y1 + L2 * Math.cos(theta2) * scale;
    
    return { x1, y1, x2, y2 };
}

/**
 * Render the pendulum
 */
function render() {
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height * 0.38;

    // Size-adaptive rendering: scale elements based on canvas size
    // Reference size is 400px - elements scale proportionally
    const referenceSize = 400;
    const canvasSize = Math.min(width, height);
    const sizeRatio = Math.min(1, canvasSize / referenceSize);

    // Calculate adaptive sizes
    const pivotRadius = Math.max(4, CONFIG.render.pivotRadius * sizeRatio);
    const mass1Radius = Math.max(6, CONFIG.render.mass1Radius * sizeRatio);
    const mass2Radius = Math.max(6, CONFIG.render.mass2Radius * sizeRatio);
    const rodWidth = Math.max(2, CONFIG.render.rodWidth * sizeRatio);
    const trailWidth = Math.max(1, CONFIG.render.trailWidth * sizeRatio);
    const glowBlur = Math.max(5, 15 * sizeRatio);

    // Clear canvas
    ctx.fillStyle = 'rgba(10, 8, 18, 0.35)';
    ctx.fillRect(0, 0, width, height);

    // Get positions
    const pos = getPosition(state.theta1, state.theta2, state.params);

    // Draw trail
    if (state.trailEnabled && state.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(centerX + state.trail[0].x, centerY + state.trail[0].y);

        for (let i = 1; i < state.trail.length; i++) {
            const point = state.trail[i];
            const alpha = state.trailInfinite ?
                0.8 :
                mapRange(i, 0, state.trail.length, 0.1, 0.8);

            ctx.strokeStyle = `rgba(255, 107, 157, ${alpha})`;
            ctx.lineWidth = trailWidth;
            ctx.lineTo(centerX + point.x, centerY + point.y);
        }
        ctx.stroke();
    }

    // Draw rods
    ctx.strokeStyle = CONFIG.colors.rod;
    ctx.lineWidth = rodWidth;
    ctx.lineCap = 'round';

    // Rod 1
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(centerX + pos.x1, centerY + pos.y1);
    ctx.stroke();

    // Rod 2
    ctx.beginPath();
    ctx.moveTo(centerX + pos.x1, centerY + pos.y1);
    ctx.lineTo(centerX + pos.x2, centerY + pos.y2);
    ctx.stroke();

    // Draw pivot
    ctx.fillStyle = CONFIG.colors.pivot;
    ctx.beginPath();
    ctx.arc(centerX, centerY, pivotRadius, 0, Math.PI * 2);
    ctx.fill();

    // Draw mass 1
    ctx.fillStyle = CONFIG.colors.mass1;
    ctx.beginPath();
    ctx.arc(
        centerX + pos.x1,
        centerY + pos.y1,
        mass1Radius * Math.sqrt(state.params.m1 / CONFIG.defaults.m1),
        0, Math.PI * 2
    );
    ctx.fill();

    // Draw mass 2
    ctx.fillStyle = CONFIG.colors.mass2;
    ctx.beginPath();
    ctx.arc(
        centerX + pos.x2,
        centerY + pos.y2,
        mass2Radius * Math.sqrt(state.params.m2 / CONFIG.defaults.m2),
        0, Math.PI * 2
    );
    ctx.fill();

    // Add glow effect to mass 2
    ctx.shadowColor = CONFIG.colors.mass2;
    ctx.shadowBlur = glowBlur;
    ctx.beginPath();
    ctx.arc(
        centerX + pos.x2,
        centerY + pos.y2,
        mass2Radius * Math.sqrt(state.params.m2 / CONFIG.defaults.m2) * 0.5,
        0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Also render to preview canvas if visible
    if (state.mobilePreviewVisible) {
        renderPreview();
    }
}

/**
 * Render chaos map
 */
function renderChaosMap() {
    if (!chaosCtx || !state.chaosMapData) return;
    
    const data = state.chaosMapData;
    const resolution = data.resolution;
    const imageData = chaosCtx.createImageData(resolution, resolution);
    
    for (let y = 0; y < resolution; y++) {
        for (let x = 0; x < resolution; x++) {
            const idx = (y * resolution + x) * 4;
            const value = data.values[y][x];
            const color = getChaosColor(value, data.maxLyapunov);
            
            imageData.data[idx] = color.r;
            imageData.data[idx + 1] = color.g;
            imageData.data[idx + 2] = color.b;
            imageData.data[idx + 3] = 255;
        }
    }
    
    chaosCtx.putImageData(imageData, 0, 0);
    drawChaosOverlay(data);
}

// ============================================
// DOWNLOAD SNAPSHOTS
// ============================================

function buildChaosMapSnapshot() {
    return {
        params: { ...state.params },
        axisX: state.chaosAxisX,
        axisY: state.chaosAxisY
    };
}

function normalizeSnapshotValue(value) {
    if (!Number.isFinite(value)) return value;
    return Number(value.toFixed(4));
}

function getChaosMapSignature(snapshot) {
    if (!snapshot) return '';
    const params = {};
    Object.keys(CONFIG.defaults).forEach((key) => {
        params[key] = normalizeSnapshotValue(snapshot.params[key]);
    });
    return JSON.stringify({
        axisX: snapshot.axisX,
        axisY: snapshot.axisY,
        params
    });
}

function waitForChaosMap() {
    return new Promise((resolve) => {
        if (!state.chaosMapComputing) {
            resolve();
            return;
        }

        const check = () => {
            if (!state.chaosMapComputing) {
                resolve();
            } else {
                requestAnimationFrame(check);
            }
        };

        requestAnimationFrame(check);
    });
}

function cloneCanvas(sourceCanvas) {
    if (!sourceCanvas) return null;
    const clone = document.createElement('canvas');
    clone.width = sourceCanvas.width;
    clone.height = sourceCanvas.height;
    const cloneCtx = clone.getContext('2d');
    if (cloneCtx) {
        cloneCtx.drawImage(sourceCanvas, 0, 0);
    }
    return clone;
}

function getInfoText(key, fallback) {
    const i18n = window.i18nManager;
    return i18n?.t(key) || fallback;
}

function getParamLabel(meta) {
    const i18n = window.i18nManager;
    return i18n?.t(meta.labelKey) || meta.labelKey || meta.key;
}

function formatValueWithUnit(value, unit, decimals) {
    const formatted = formatNumber(value, decimals);
    if (!unit) return formatted;
    if (unit === '\u00B0') {
        return `${formatted}${unit}`;
    }
    return `${formatted} ${unit}`;
}

function formatParamValue(meta, params) {
    const value = params[meta.key];
    if (!Number.isFinite(value)) return '--';
    if (meta.key === 'g' && meta.labelKey === 'label_g') {
        return formatNumber(value, meta.decimals);
    }
    return formatValueWithUnit(value, meta.unit, meta.decimals);
}

function formatParamRange(meta) {
    const range = CONFIG.ranges[meta.key];
    if (!range) return '';
    const minText = formatValueWithUnit(range.min, meta.unit, meta.decimals);
    const maxText = formatValueWithUnit(range.max, meta.unit, meta.decimals);
    return `${minText} - ${maxText}`;
}

function getAxisLabel(axisKey) {
    const i18n = window.i18nManager;
    const labelKey = AXIS_LABEL_KEYS[axisKey];
    return i18n?.t(labelKey) || axisKey;
}

function getAxisShortLabel(axisKey) {
    const meta = PARAMETER_METADATA.find((item) => item.key === axisKey);
    if (!meta) return axisKey;
    const i18n = window.i18nManager;
    return i18n?.t(meta.labelKey) || meta.key;
}

function drawInfoBackground(ctx, width, height) {
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, INFO_THEME.backgroundStart);
    gradient.addColorStop(1, INFO_THEME.backgroundEnd);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = 'rgba(176, 138, 240, 0.08)';
    ctx.beginPath();
    ctx.ellipse(width * 0.75, height * 0.2, width * 0.45, height * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawRoundedRect(ctx, x, y, width, height, radius) {
    const r = Math.min(radius, width / 2, height / 2);
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y, x + width, y, r);
    ctx.closePath();
}

function drawCard(ctx, x, y, width, height) {
    drawRoundedRect(ctx, x, y, width, height, 20);
    ctx.fillStyle = INFO_THEME.panel;
    ctx.fill();
    ctx.strokeStyle = INFO_THEME.border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
}

function drawSectionTitle(ctx, text, x, y) {
    ctx.fillStyle = INFO_THEME.accent;
    ctx.font = '600 18px Outfit, sans-serif';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(text, x, y);
}

function drawParamTable(ctx, items, x, y, width, rowHeight, columns = 2) {
    const columnGap = columns > 1 ? 32 : 0;
    const rows = Math.ceil(items.length / columns);
    const columnWidth = (width - columnGap * (columns - 1)) / columns;

    items.forEach((item, index) => {
        const col = Math.floor(index / rows);
        const row = index % rows;
        const rowY = y + row * rowHeight + rowHeight / 2;
        const colX = x + col * (columnWidth + columnGap);

        ctx.textBaseline = 'middle';
        ctx.fillStyle = INFO_THEME.muted;
        ctx.font = '500 16px Outfit, sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(item.label, colX, rowY);

        ctx.fillStyle = INFO_THEME.text;
        ctx.font = '600 16px Outfit, sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(item.value, colX + columnWidth, rowY);
    });
}

function getChaosMapCoordinate(snapshot, chaosData) {
    if (!snapshot || !chaosData) return null;
    const axisX = snapshot.axisX;
    const axisY = snapshot.axisY;
    const rangeX = CONFIG.ranges[axisX];
    const rangeY = CONFIG.ranges[axisY];
    if (!rangeX || !rangeY) return null;

    const resolution = chaosData.resolution;
    const valueX = snapshot.params[axisX];
    const valueY = snapshot.params[axisY];

    const pixelX = clamp(mapRange(valueX, rangeX.min, rangeX.max, 0, resolution - 1), 0, resolution - 1);
    const pixelY = clamp(mapRange(valueY, rangeY.max, rangeY.min, 0, resolution - 1), 0, resolution - 1);

    return { pixelX, pixelY, valueX, valueY };
}

function drawChaosMapPreview(ctx, mapCanvas, x, y, size, coordinate) {
    if (!mapCanvas) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
        ctx.fillRect(x, y, size, size);
        return;
    }

    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(mapCanvas, x, y, size, size);
    ctx.restore();

    ctx.strokeStyle = INFO_THEME.border;
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, size, size);

    if (coordinate) {
        const scale = (size - 1) / (mapCanvas.width - 1);
        const markerX = x + coordinate.pixelX * scale;
        const markerY = y + coordinate.pixelY * scale;

        ctx.beginPath();
        ctx.arc(markerX, markerY, 6, 0, Math.PI * 2);
        ctx.fillStyle = INFO_THEME.highlight;
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = INFO_THEME.text;
        ctx.stroke();
    }
}

function createTrajectoryInfoCanvas(snapshot, mapCanvas) {
    const { width, height } = INFO_CANVAS_SIZES.trajectory;
    const infoCanvas = document.createElement('canvas');
    infoCanvas.width = width;
    infoCanvas.height = height;
    const infoCtx = infoCanvas.getContext('2d');
    if (!infoCtx) return null;

    drawInfoBackground(infoCtx, width, height);

    const title = getInfoText('snapshot_trajectory_title', 'Trajectory Snapshot');
    infoCtx.fillStyle = INFO_THEME.text;
    infoCtx.font = '700 32px Outfit, sans-serif';
    infoCtx.textAlign = 'left';
    infoCtx.textBaseline = 'top';
    infoCtx.fillText(title, 60, 48);

    const paramsTitle = getInfoText('snapshot_parameters_title', 'Parameters');
    const mapTitle = getInfoText('chaos_title', 'Chaos Map');
    const coordinateTitle = getInfoText('snapshot_coordinate_title', 'Selected coordinate');

    const cardTop = 120;
    const cardPadding = 32;
    const cardGap = 40;
    const leftWidth = 740;
    const rightWidth = width - 60 * 2 - cardGap - leftWidth;
    const cardHeight = height - cardTop - 60;
    const leftX = 60;
    const rightX = leftX + leftWidth + cardGap;

    drawCard(infoCtx, leftX, cardTop, leftWidth, cardHeight);
    drawSectionTitle(infoCtx, paramsTitle, leftX + cardPadding, cardTop + cardPadding);

    const paramItems = PARAMETER_METADATA.map((meta) => ({
        label: getParamLabel(meta),
        value: formatParamValue(meta, snapshot.params)
    }));

    drawParamTable(
        infoCtx,
        paramItems,
        leftX + cardPadding,
        cardTop + cardPadding + 40,
        leftWidth - cardPadding * 2,
        40
    );

    drawCard(infoCtx, rightX, cardTop, rightWidth, cardHeight);
    drawSectionTitle(infoCtx, mapTitle, rightX + cardPadding, cardTop + cardPadding);

    const mapSize = Math.min(rightWidth - cardPadding * 2, 360);
    const mapX = rightX + cardPadding;
    const mapY = cardTop + cardPadding + 42;
    const chaosData = state.chaosMapData;
    const coordinate = getChaosMapCoordinate(snapshot, chaosData);

    drawChaosMapPreview(infoCtx, mapCanvas, mapX, mapY, mapSize, coordinate);

    const axisLabelX = `${getInfoText('chaos_axis_x', 'Axis X')}: ${getAxisShortLabel(snapshot.axisX)}`;
    const axisLabelY = `${getInfoText('chaos_axis_y', 'Axis Y')}: ${getAxisShortLabel(snapshot.axisY)}`;
    const axisValueX = formatValueWithUnit(snapshot.params[snapshot.axisX], PARAMETER_METADATA.find((item) => item.key === snapshot.axisX)?.unit || '', PARAMETER_METADATA.find((item) => item.key === snapshot.axisX)?.decimals || 2);
    const axisValueY = formatValueWithUnit(snapshot.params[snapshot.axisY], PARAMETER_METADATA.find((item) => item.key === snapshot.axisY)?.unit || '', PARAMETER_METADATA.find((item) => item.key === snapshot.axisY)?.decimals || 2);

    const infoStartY = mapY + mapSize + 30;
    infoCtx.fillStyle = INFO_THEME.muted;
    infoCtx.font = '600 16px Outfit, sans-serif';
    infoCtx.textAlign = 'left';
    infoCtx.fillText(coordinateTitle, mapX, infoStartY);

    infoCtx.font = '500 15px Outfit, sans-serif';
    infoCtx.fillStyle = INFO_THEME.subtle;
    infoCtx.fillText(axisLabelX, mapX, infoStartY + 28);
    infoCtx.fillText(axisLabelY, mapX, infoStartY + 52);

    infoCtx.textAlign = 'right';
    infoCtx.fillStyle = INFO_THEME.text;
    infoCtx.font = '600 15px Outfit, sans-serif';
    infoCtx.fillText(axisValueX, mapX + mapSize, infoStartY + 28);
    infoCtx.fillText(axisValueY, mapX + mapSize, infoStartY + 52);

    return infoCanvas;
}

function createChaosMapInfoCanvas(snapshot, mapCanvas) {
    const { width, height } = INFO_CANVAS_SIZES.chaos;
    const infoCanvas = document.createElement('canvas');
    infoCanvas.width = width;
    infoCanvas.height = height;
    const infoCtx = infoCanvas.getContext('2d');
    if (!infoCtx) return null;

    drawInfoBackground(infoCtx, width, height);

    const title = getInfoText('snapshot_chaos_title', 'Chaos Map Snapshot');
    infoCtx.fillStyle = INFO_THEME.text;
    infoCtx.font = '700 30px Outfit, sans-serif';
    infoCtx.textAlign = 'left';
    infoCtx.textBaseline = 'top';
    infoCtx.fillText(title, 60, 48);

    const paramsTitle = getInfoText('snapshot_parameters_title', 'Parameters');
    const axesTitle = getInfoText('snapshot_axes_title', 'Axes');

    const cardTop = 120;
    const cardPadding = 28;
    const cardGap = 40;
    const leftWidth = 460;
    const rightWidth = width - 60 * 2 - cardGap - leftWidth;
    const cardHeight = height - cardTop - 60;
    const leftX = 60;
    const rightX = leftX + leftWidth + cardGap;

    drawCard(infoCtx, leftX, cardTop, leftWidth, cardHeight);
    drawSectionTitle(infoCtx, getInfoText('chaos_title', 'Chaos Map'), leftX + cardPadding, cardTop + cardPadding);

    const mapSize = Math.min(leftWidth - cardPadding * 2, 360);
    const mapX = leftX + cardPadding;
    const mapY = cardTop + cardPadding + 42;
    drawChaosMapPreview(infoCtx, mapCanvas, mapX, mapY, mapSize, null);

    drawCard(infoCtx, rightX, cardTop, rightWidth, cardHeight);
    drawSectionTitle(infoCtx, paramsTitle, rightX + cardPadding, cardTop + cardPadding);

    const axisKeys = [snapshot.axisX, snapshot.axisY];
    const paramItems = PARAMETER_METADATA.map((meta) => {
        if (axisKeys.includes(meta.key)) {
            const variesLabel = getInfoText('snapshot_varies', 'varies');
            const rangeLabel = getInfoText('snapshot_range', 'Range');
            const rangeText = formatParamRange(meta);
            return {
                label: getParamLabel(meta),
                value: `${variesLabel} (${rangeLabel}: ${rangeText})`
            };
        }
        return {
            label: getParamLabel(meta),
            value: formatParamValue(meta, snapshot.params)
        };
    });

    drawParamTable(
        infoCtx,
        paramItems,
        rightX + cardPadding,
        cardTop + cardPadding + 40,
        rightWidth - cardPadding * 2,
        36,
        1
    );

    const axisInfoY = cardTop + cardHeight - 96;
    infoCtx.fillStyle = INFO_THEME.accent;
    infoCtx.font = '600 16px Outfit, sans-serif';
    infoCtx.textAlign = 'left';
    infoCtx.fillText(axesTitle, rightX + cardPadding, axisInfoY);

    infoCtx.fillStyle = INFO_THEME.muted;
    infoCtx.font = '500 15px Outfit, sans-serif';
    infoCtx.fillText(`${getInfoText('chaos_axis_x', 'Axis X')}: ${getAxisLabel(snapshot.axisX)}`, rightX + cardPadding, axisInfoY + 26);
    infoCtx.fillText(`${getInfoText('chaos_axis_y', 'Axis Y')}: ${getAxisLabel(snapshot.axisY)}`, rightX + cardPadding, axisInfoY + 50);

    return infoCanvas;
}

function shouldSkipChaosWarning() {
    try {
        return localStorage.getItem(CHAOS_WARNING_STORAGE_KEY) === 'true';
    } catch (err) {
        return false;
    }
}

function setChaosWarningDismissed(value) {
    try {
        localStorage.setItem(CHAOS_WARNING_STORAGE_KEY, value ? 'true' : 'false');
    } catch (err) {
        // Ignore storage errors
    }
}

function openChaosWarningModal() {
    if (!chaosWarning.modal) return Promise.resolve(true);
    chaosWarning.modal.classList.add('active');
    chaosWarning.modal.setAttribute('aria-hidden', 'false');
    chaosWarning.isOpen = true;
    if (chaosWarning.skipCheckbox) {
        chaosWarning.skipCheckbox.checked = false;
    }

    return new Promise((resolve) => {
        chaosWarning.resolver = resolve;
    });
}

function closeChaosWarningModal(result) {
    if (!chaosWarning.modal) return;
    chaosWarning.modal.classList.remove('active');
    chaosWarning.modal.setAttribute('aria-hidden', 'true');
    chaosWarning.isOpen = false;

    if (chaosWarning.skipCheckbox && chaosWarning.skipCheckbox.checked) {
        setChaosWarningDismissed(true);
    }

    if (typeof chaosWarning.resolver === 'function') {
        const resolver = chaosWarning.resolver;
        chaosWarning.resolver = null;
        resolver(result);
    }
}

function confirmChaosMapRefresh() {
    if (shouldSkipChaosWarning()) return Promise.resolve(true);
    return openChaosWarningModal();
}

function initChaosWarningModal() {
    chaosWarning.modal = document.getElementById('chaos-warning-modal');
    if (!chaosWarning.modal) return;

    chaosWarning.confirmBtn = document.getElementById('chaos-warning-confirm');
    chaosWarning.cancelBtn = document.getElementById('chaos-warning-cancel');
    chaosWarning.closeBtn = document.getElementById('chaos-warning-close');
    chaosWarning.skipCheckbox = document.getElementById('chaos-warning-skip');

    if (chaosWarning.confirmBtn) {
        chaosWarning.confirmBtn.addEventListener('click', () => closeChaosWarningModal(true));
    }

    if (chaosWarning.cancelBtn) {
        chaosWarning.cancelBtn.addEventListener('click', () => closeChaosWarningModal(false));
    }

    if (chaosWarning.closeBtn) {
        chaosWarning.closeBtn.addEventListener('click', () => closeChaosWarningModal(false));
    }

    chaosWarning.modal.addEventListener('click', (event) => {
        if (event.target === chaosWarning.modal) {
            closeChaosWarningModal(false);
        }
    });
}

async function prepareTrajectoryInfoDownload() {
    const snapshot = buildChaosMapSnapshot();
    const signature = getChaosMapSignature(snapshot);

    if (state.chaosMapComputing) {
        await waitForChaosMap();
    }

    const hasExistingMap = Boolean(state.chaosMapData);
    const needsRefresh = !state.chaosMapData || state.chaosMapSignature !== signature;

    if (needsRefresh) {
        const shouldWarn = hasExistingMap && state.chaosMapSignature && state.chaosMapSignature !== signature;
        if (shouldWarn) {
            const proceed = await confirmChaosMapRefresh();
            if (!proceed) {
                return { ready: false, snapshot, mapCanvas: null };
            }
        }

        state.chaosMapSnapshot = snapshot;
        state.chaosMapSignature = signature;
        computeChaosMap();
        await waitForChaosMap();
    }

    if (!state.chaosMapData || state.chaosMapSignature !== signature) {
        return { ready: false, snapshot, mapCanvas: null };
    }

    renderChaosMap();
    const mapCanvas = cloneCanvas(chaosCanvas);
    if (!mapCanvas) {
        return { ready: false, snapshot, mapCanvas: null };
    }
    return { ready: true, snapshot, mapCanvas };
}

async function ensureChaosMapAvailable() {
    if (state.chaosMapData) return true;
    if (state.chaosMapComputing) {
        await waitForChaosMap();
        return Boolean(state.chaosMapData);
    }

    state.chaosMapSnapshot = buildChaosMapSnapshot();
    state.chaosMapSignature = getChaosMapSignature(state.chaosMapSnapshot);
    computeChaosMap();
    await waitForChaosMap();
    return Boolean(state.chaosMapData);
}

function formatDownloadTimestamp() {
    const now = new Date();
    return now.toISOString().replace(/[:.]/g, '-').replace('T', '_').replace('Z', '');
}

function downloadCanvasImage(targetCanvas, name) {
    if (!targetCanvas) return;
    const link = document.createElement('a');
    const timestamp = formatDownloadTimestamp();
    link.download = `${name}-${timestamp}.png`;
    link.href = targetCanvas.toDataURL('image/png');
    link.click();
}

async function downloadPendulumImage() {
    render();
    downloadCanvasImage(canvas, 'double-pendulum');

    const info = await prepareTrajectoryInfoDownload();
    if (!info.ready) return;
    const infoCanvas = createTrajectoryInfoCanvas(info.snapshot, info.mapCanvas);
    if (infoCanvas) {
        downloadCanvasImage(infoCanvas, 'double-pendulum-info');
    }
}

async function downloadChaosImage() {
    const hasMap = state.chaosMapData || await ensureChaosMapAvailable();
    if (!hasMap) return;
    renderChaosMap();
    downloadCanvasImage(chaosCanvas, 'chaos-map');

    const snapshot = state.chaosMapSnapshot || {
        params: { ...state.params },
        axisX: state.chaosMapData?.axisX || state.chaosAxisX,
        axisY: state.chaosMapData?.axisY || state.chaosAxisY
    };
    const infoCanvas = createChaosMapInfoCanvas(snapshot, cloneCanvas(chaosCanvas));
    if (infoCanvas) {
        downloadCanvasImage(infoCanvas, 'chaos-map-info');
    }
}

function getSupportedVideoMimeType() {
    if (typeof MediaRecorder === 'undefined') return '';
    const types = [
        'video/webm;codecs=vp9',
        'video/webm;codecs=vp8',
        'video/webm'
    ];
    return types.find((type) => MediaRecorder.isTypeSupported(type)) || '';
}

async function downloadPendulumVideo() {
    const i18n = window.i18nManager;
    if (!canvas || typeof canvas.captureStream !== 'function' || typeof MediaRecorder === 'undefined') {
        alert(i18n?.t('download_video_unsupported') || 'Video recording is not supported in this browser.');
        return;
    }

    const promptText = i18n?.t('download_video_prompt') || 'Enter video duration in seconds (max 15):';
    const input = window.prompt(promptText, '5');
    if (input === null) return;

    const parsed = Number.parseFloat(input);
    if (!Number.isFinite(parsed) || parsed <= 0) {
        alert(i18n?.t('download_video_invalid') || 'Please enter a valid number of seconds (1–15).');
        return;
    }

    const duration = Math.min(parsed, 15);
    const info = await prepareTrajectoryInfoDownload();
    const stream = canvas.captureStream(60);
    const mimeType = getSupportedVideoMimeType();
    let recorder;

    try {
        recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    } catch (err) {
        alert(i18n?.t('download_video_unsupported') || 'Video recording is not supported in this browser.');
        return;
    }

    const chunks = [];
    recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
            chunks.push(event.data);
        }
    };

    recorder.onstop = () => {
        const blob = new Blob(chunks, { type: recorder.mimeType || 'video/webm' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = formatDownloadTimestamp();
        link.href = url;
        link.download = `double-pendulum-${timestamp}.webm`;
        link.click();
        URL.revokeObjectURL(url);

        if (info.ready) {
            const infoCanvas = createTrajectoryInfoCanvas(info.snapshot, info.mapCanvas);
            if (infoCanvas) {
                downloadCanvasImage(infoCanvas, 'double-pendulum-info');
            }
        }
    };

    recorder.start();
    setTimeout(() => {
        if (recorder.state !== 'inactive') {
            recorder.stop();
        }
    }, duration * 1000);
}

function getChaosAxisPixel(range, size, invert) {
    if (!range) return (size - 1) / 2;
    if (range.min <= 0 && range.max >= 0) {
        const t = (0 - range.min) / (range.max - range.min);
        const pos = t * (size - 1);
        return invert ? (size - 1 - pos) : pos;
    }
    return (size - 1) / 2;
}

function drawChaosOverlay(data) {
    if (!state.chaosGridEnabled) return;

    const resolution = data.resolution;
    const rangeX = CONFIG.ranges[data.axisX];
    const rangeY = CONFIG.ranges[data.axisY];

    if (!rangeX || !rangeY) return;

    const snap = (value) => Math.min(resolution - 0.5, Math.max(0.5, Math.round(value) + 0.5));
    const gridDivisions = 4;

    chaosCtx.save();
    chaosCtx.lineWidth = 1;

    // Grid lines
    chaosCtx.strokeStyle = 'rgba(232, 240, 255, 0.12)';
    chaosCtx.beginPath();
    for (let i = 1; i < gridDivisions; i++) {
        const pos = snap((resolution / gridDivisions) * i);
        chaosCtx.moveTo(pos, 0.5);
        chaosCtx.lineTo(pos, resolution - 0.5);
        chaosCtx.moveTo(0.5, pos);
        chaosCtx.lineTo(resolution - 0.5, pos);
    }
    chaosCtx.stroke();

    // Axis lines (zero or midpoint)
    const axisX = snap(getChaosAxisPixel(rangeX, resolution, false));
    const axisY = snap(getChaosAxisPixel(rangeY, resolution, true));

    chaosCtx.strokeStyle = 'rgba(232, 240, 255, 0.35)';
    chaosCtx.beginPath();
    chaosCtx.moveTo(axisX, 0.5);
    chaosCtx.lineTo(axisX, resolution - 0.5);
    chaosCtx.moveTo(0.5, axisY);
    chaosCtx.lineTo(resolution - 0.5, axisY);
    chaosCtx.stroke();

    // Tick marks
    const tickSize = 3;
    chaosCtx.beginPath();
    for (let i = 1; i < gridDivisions; i++) {
        const pos = snap((resolution / gridDivisions) * i);
        chaosCtx.moveTo(axisX - tickSize, pos);
        chaosCtx.lineTo(axisX + tickSize, pos);
        chaosCtx.moveTo(pos, axisY - tickSize);
        chaosCtx.lineTo(pos, axisY + tickSize);
    }
    chaosCtx.stroke();

    chaosCtx.restore();
}

// ============================================
// ANIMATION LOOP
// ============================================

function animate(currentTime) {
    if (!state.isPlaying) return;
    
    const dt = CONFIG.simulation.dt * CONFIG.simulation.speedMultiplier;
    
    // Physics steps
    for (let i = 0; i < CONFIG.simulation.stepsPerFrame; i++) {
        const result = rk4Step(
            state.theta1, state.theta2,
            state.omega1, state.omega2,
            dt, state.params
        );
        
        state.theta1 = result[0];
        state.theta2 = result[1];
        state.omega1 = result[2];
        state.omega2 = result[3];
    }
    
    // Update trail
    const pos = getPosition(state.theta1, state.theta2, state.params);
    state.trail.push({ x: pos.x2, y: pos.y2, time: currentTime });
    
    // Trim trail
    if (!state.trailInfinite) {
        const maxAge = state.trailDuration * 1000;
        while (state.trail.length > 0 && currentTime - state.trail[0].time > maxAge) {
            state.trail.shift();
        }
    }
    
    if (state.trail.length > CONFIG.trail.maxLength) {
        state.trail = state.trail.slice(-CONFIG.trail.maxLength);
    }
    
    // Render
    render();
    
    state.animationId = requestAnimationFrame(animate);
}

// ============================================
// CONTROLS
// ============================================

function play() {
    if (state.isPlaying) return;
    state.isPlaying = true;
    state.animationId = requestAnimationFrame(animate);
    updatePlayButton();
}

function pause() {
    state.isPlaying = false;
    if (state.animationId) {
        cancelAnimationFrame(state.animationId);
        state.animationId = null;
    }
    updatePlayButton();
}

function togglePlay() {
    if (state.isPlaying) {
        pause();
    } else {
        play();
    }
}

function reset() {
    pause();
    
    // Reset to initial conditions
    state.theta1 = degToRad(state.params.theta1);
    state.theta2 = degToRad(state.params.theta2);
    state.omega1 = state.params.omega1;
    state.omega2 = state.params.omega2;
    
    // Clear trail
    state.trail = [];
    
    // Clear and redraw
    if (ctx) {
        ctx.fillStyle = '#0a0812';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    render();
}

function updatePlayButton() {
    const btn = elements.playBtn;
    if (!btn) return;
    const i18n = window.i18nManager;

    if (state.isPlaying) {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
            <rect x="6" y="4" width="4" height="16"/>
            <rect x="14" y="4" width="4" height="16"/>
        </svg>`;
        btn.setAttribute('aria-label', i18n?.t('pause_label') || 'Pause');
    } else {
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5,3 19,12 5,21"/>
        </svg>`;
        btn.setAttribute('aria-label', i18n?.t('play_label') || 'Play');
    }

    // Also update preview play button
    updatePreviewPlayButton();
}

function setParameter(name, value) {
    state.params[name] = value;

    // Update display
    const valueEl = document.getElementById(`${name}-value`);
    if (valueEl) {
        valueEl.textContent = formatNumber(value, name.includes('theta') || name.includes('omega') ? 1 : 2);
    }

    // If changing initial conditions while paused, reset
    if (!state.isPlaying && ['theta1', 'theta2', 'omega1', 'omega2'].includes(name)) {
        reset();
    }

    // Trigger mobile preview when changing visual parameters
    if (isMobileViewActive() && state.mobileActivePanel !== 'simulation') {
        const visualParams = ['theta1', 'theta2', 'omega1', 'omega2', 'L1', 'L2', 'm1', 'm2'];
        if (visualParams.includes(name)) {
            triggerMobilePreview();
        }
    }
}

function setSpeed(multiplier) {
    CONFIG.simulation.speedMultiplier = multiplier;
    const valueEl = document.getElementById('speed-value');
    if (valueEl) {
        valueEl.textContent = `${multiplier}x`;
    }
}

function setTrailDuration(seconds) {
    state.trailDuration = seconds;
    const valueEl = document.getElementById('trail-duration-value');
    if (valueEl) {
        valueEl.textContent = `${seconds}s`;
    }
}

function toggleTrailInfinite(enabled) {
    state.trailInfinite = enabled;
    const durationSlider = document.getElementById('trail-duration');
    if (durationSlider) {
        durationSlider.disabled = enabled;
        durationSlider.parentElement.style.opacity = enabled ? 0.5 : 1;
    }
}

function toggleDamping(enabled) {
    const dampingSlider = document.getElementById('damping');
    if (dampingSlider) {
        dampingSlider.disabled = !enabled;
        dampingSlider.parentElement.style.opacity = enabled ? 1 : 0.5;
    }
    if (!enabled) {
        state.params.damping = 0;
    }
}

// ============================================
// CHAOS MAP
// ============================================

function toggleChaosPanel() {
    state.chaosPanelOpen = !state.chaosPanelOpen;
    const panel = document.querySelector('.chaos-panel');
    if (panel) {
        panel.classList.toggle('collapsed', !state.chaosPanelOpen);
        panel.classList.toggle('open', state.chaosPanelOpen);
    }
    
    if (state.chaosPanelOpen && !state.chaosMapData) {
        computeChaosMap();
    }

    syncPanelStateClasses();
    resizeCanvas();
}

function computeChaosMap() {
    if (state.chaosMapComputing) return;

    state.chaosMapComputing = true;
    state.chaosMapSnapshot = buildChaosMapSnapshot();
    state.chaosMapSignature = getChaosMapSignature(state.chaosMapSnapshot);
    showChaosLoading(true);

    // Compute in chunks on the main thread
    computeChaosMapDirect(state.chaosMapSnapshot);
}

function computeChaosMapDirect(snapshot) {
    const localSnapshot = snapshot || buildChaosMapSnapshot();
    const resolution = CONFIG.chaosMap.resolution;
    const axisX = localSnapshot.axisX;
    const axisY = localSnapshot.axisY;
    
    const rangeX = CONFIG.ranges[axisX];
    const rangeY = CONFIG.ranges[axisY];
    
    const values = [];
    let maxLyapunov = 0;
    
    const baseParams = { ...localSnapshot.params };
    
    let computed = 0;
    const total = resolution * resolution;
    
    function computeChunk() {
        const chunkSize = 100;
        const startIdx = computed;
        const endIdx = Math.min(computed + chunkSize, total);
        
        for (let idx = startIdx; idx < endIdx; idx++) {
            const y = Math.floor(idx / resolution);
            const x = idx % resolution;
            
            if (!values[y]) values[y] = [];
            
            const params = { ...baseParams };
            
            // Map pixel to parameter value
            if (axisX.includes('theta')) {
                params[axisX] = degToRad(mapRange(x, 0, resolution - 1, rangeX.min, rangeX.max));
            } else {
                params[axisX] = mapRange(x, 0, resolution - 1, rangeX.min, rangeX.max);
            }
            
            if (axisY.includes('theta')) {
                params[axisY] = degToRad(mapRange(y, 0, resolution - 1, rangeY.max, rangeY.min));
            } else {
                params[axisY] = mapRange(y, 0, resolution - 1, rangeY.max, rangeY.min);
            }
            
            const theta1IsAxis = axisX === 'theta1' || axisY === 'theta1';
            const theta2IsAxis = axisX === 'theta2' || axisY === 'theta2';

            if (!theta1IsAxis) {
                params.theta1 = degToRad(baseParams.theta1);
            }

            if (!theta2IsAxis) {
                params.theta2 = degToRad(baseParams.theta2);
            }
            
            const lyapunov = computeLyapunov(params);
            values[y][x] = Math.max(0, lyapunov);
            maxLyapunov = Math.max(maxLyapunov, lyapunov);
        }
        
        computed = endIdx;
        updateChaosProgress(computed / total);
        
        if (computed < total) {
            requestAnimationFrame(computeChunk);
        } else {
            finishChaosMap(values, maxLyapunov, resolution, axisX, axisY);
        }
    }
    
    requestAnimationFrame(computeChunk);
}


function finishChaosMap(values, maxLyapunov, resolution, axisX, axisY) {
    state.chaosMapData = {
        values,
        maxLyapunov: maxLyapunov || 1,
        resolution,
        axisX,
        axisY
    };
    
    state.chaosMapComputing = false;
    showChaosLoading(false);
    renderChaosMap();
}

function showChaosLoading(show) {
    const loading = document.querySelector('.chaos-map-loading');
    if (loading) {
        loading.style.display = show ? 'block' : 'none';
    }
}

function updateChaosProgress(progress) {
    const progressText = document.querySelector('.chaos-map-loading span');
    if (progressText) {
        const i18n = window.i18nManager;
        const template = i18n?.t('chaos_loading') || 'Computing... {percent}%';
        progressText.textContent = template.replace('{percent}', Math.round(progress * 100));
    }
}

function handleChaosMapClick(event) {
    if (!state.chaosMapData) return;

    const rect = chaosCanvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const resolution = state.chaosMapData.resolution;
    const pixelX = Math.floor(x / rect.width * resolution);
    const pixelY = Math.floor(y / rect.height * resolution);

    const axisX = state.chaosAxisX;
    const axisY = state.chaosAxisY;
    const rangeX = CONFIG.ranges[axisX];
    const rangeY = CONFIG.ranges[axisY];

    const valueX = mapRange(pixelX, 0, resolution - 1, rangeX.min, rangeX.max);
    const valueY = mapRange(pixelY, 0, resolution - 1, rangeY.max, rangeY.min);

    // Store old values temporarily to avoid double preview trigger
    const oldParamX = state.params[axisX];
    const oldParamY = state.params[axisY];

    // Update parameters directly without triggering preview twice
    state.params[axisX] = valueX;
    state.params[axisY] = valueY;

    // Update displays
    const valueElX = document.getElementById(`${axisX}-value`);
    const valueElY = document.getElementById(`${axisY}-value`);
    if (valueElX) {
        valueElX.textContent = formatNumber(valueX, axisX.includes('theta') || axisX.includes('omega') ? 1 : 2);
    }
    if (valueElY) {
        valueElY.textContent = formatNumber(valueY, axisY.includes('theta') || axisY.includes('omega') ? 1 : 2);
    }

    // Update sliders
    const sliderX = document.getElementById(axisX);
    const sliderY = document.getElementById(axisY);
    if (sliderX) sliderX.value = valueX;
    if (sliderY) sliderY.value = valueY;

    // Trigger mobile preview if in mobile mode
    if (isMobileViewActive() && state.mobileActivePanel === 'chaos') {
        triggerMobilePreview();
    }

    // Reset and optionally start
    reset();
}

function setChaosAxis(axis, param) {
    if (axis === 'x') {
        state.chaosAxisX = param;
    } else {
        state.chaosAxisY = param;
    }
    
    // Recompute map
    state.chaosMapData = null;
    state.chaosMapSignature = null;
    state.chaosMapSnapshot = null;
    if (state.chaosPanelOpen) {
        computeChaosMap();
    }
}

// ============================================
// PANEL TOGGLES
// ============================================

function syncPanelStateClasses() {
    const body = document.body;
    if (!body) return;
    body.classList.toggle('control-panel-open', state.controlPanelOpen);
    body.classList.toggle('chaos-panel-open', state.chaosPanelOpen);
}

function toggleControlPanel() {
    state.controlPanelOpen = !state.controlPanelOpen;
    const panel = document.querySelector('.control-panel');
    if (panel) {
        panel.classList.toggle('collapsed', !state.controlPanelOpen);
        panel.classList.toggle('open', state.controlPanelOpen);
    }
    syncPanelStateClasses();
    resizeCanvas();
}

// ============================================
// MOBILE PANEL NAVIGATION
// ============================================

function isMobileViewActive() {
    return document.body.classList.contains('sim-view-mobile');
}

function setMobileActivePanel(panelName) {
    if (!isMobileViewActive()) return;

    state.mobileActivePanel = panelName;

    const simMain = document.querySelector('.sim-main');
    const controlPanel = document.querySelector('.control-panel');
    const chaosPanel = document.querySelector('.chaos-panel');
    const tabs = document.querySelectorAll('.mobile-tab');

    // Update tab active states
    tabs.forEach(tab => {
        const tabPanel = tab.getAttribute('data-panel');
        tab.classList.toggle('active', tabPanel === panelName);
    });

    // Show/hide panels
    if (simMain) {
        simMain.classList.toggle('mobile-hidden', panelName !== 'simulation');
    }
    if (controlPanel) {
        controlPanel.classList.toggle('mobile-active', panelName === 'controls');
        controlPanel.classList.toggle('collapsed', panelName !== 'controls');
        controlPanel.classList.toggle('open', panelName === 'controls');
    }
    if (chaosPanel) {
        chaosPanel.classList.toggle('mobile-active', panelName === 'chaos');
        chaosPanel.classList.toggle('collapsed', panelName !== 'chaos');
        chaosPanel.classList.toggle('open', panelName === 'chaos');
    }

    // Update state
    state.controlPanelOpen = panelName === 'controls';
    state.chaosPanelOpen = panelName === 'chaos';

    // If switching to chaos panel, compute map if needed
    if (panelName === 'chaos' && !state.chaosMapData && !state.chaosMapComputing) {
        computeChaosMap();
    }

    // Handle preview box based on panel
    if (panelName === 'simulation') {
        // Just hide preview - simulation continues seamlessly on main canvas
        hideMobilePreview();
    } else {
        // Show preview for controls/chaos panels
        showMobilePreview();
    }

    syncPanelStateClasses();
    resizeCanvas();

    // Update preview play button to match current state
    updatePreviewPlayButton();
}

function initMobileTabNavigation() {
    const tabBar = document.getElementById('mobile-tab-bar');
    if (!tabBar) return;

    const tabs = tabBar.querySelectorAll('.mobile-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const panelName = tab.getAttribute('data-panel');
            setMobileActivePanel(panelName);
        });
    });

    // Update tab labels with translations
    updateMobileTabLabels();
}

function updateMobileTabLabels() {
    const i18n = window.i18nManager;
    if (!i18n) return;

    const tabSimLabel = document.getElementById('tab-simulation-label');
    const tabControlsLabel = document.getElementById('tab-controls-label');
    const tabChaosLabel = document.getElementById('tab-chaos-label');

    if (tabSimLabel) tabSimLabel.textContent = i18n.t('mobile_tab_simulation');
    if (tabControlsLabel) tabControlsLabel.textContent = i18n.t('mobile_tab_controls');
    if (tabChaosLabel) tabChaosLabel.textContent = i18n.t('mobile_tab_chaos');
}

// ============================================
// MOBILE PREVIEW BOX (Picture-in-Picture Simulation)
// ============================================

function initPreviewCanvas() {
    previewCanvas = document.getElementById('preview-canvas');
    if (!previewCanvas) return;

    previewCtx = previewCanvas.getContext('2d');
    resizePreviewCanvas();

    // Initialize preview controls
    initPreviewControls();
    initPreviewResize();
}

function initPreviewControls() {
    const playBtn = document.getElementById('preview-play-btn');
    const resetBtn = document.getElementById('preview-reset-btn');

    if (playBtn) {
        playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            togglePlay();
            updatePreviewPlayButton();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            reset();
            renderPreview();
        });
    }
}

function updatePreviewPlayButton() {
    const playIcon = document.querySelector('#preview-play-btn .preview-play-icon');
    const pauseIcon = document.querySelector('#preview-play-btn .preview-pause-icon');

    if (playIcon && pauseIcon) {
        if (state.isPlaying) {
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        } else {
            playIcon.style.display = 'block';
            pauseIcon.style.display = 'none';
        }
    }
}

function initPreviewResize() {
    const resizeHandle = document.getElementById('preview-resize-handle');
    if (!resizeHandle) return;

    let isResizing = false;
    let startX, startY, startWidth, startHeight;

    const handleResizeStart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const box = document.getElementById('mobile-preview-box');
        if (!box) return;

        isResizing = true;
        const rect = box.getBoundingClientRect();
        startWidth = rect.width;
        startHeight = rect.height;
        startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        startY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

        box.style.transition = 'none';
    };

    const handleResizeMove = (e) => {
        if (!isResizing) return;
        e.preventDefault();

        const box = document.getElementById('mobile-preview-box');
        if (!box) return;

        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        const delta = Math.max(deltaX, deltaY);

        // Keep aspect ratio square
        let newSize = startWidth + delta;

        // Constrain size
        const minSize = 100;
        const maxSize = Math.min(window.innerWidth - 48, window.innerHeight - 200);
        newSize = Math.max(minSize, Math.min(maxSize, newSize));

        box.style.width = newSize + 'px';
        box.style.height = newSize + 'px';

        // Resize canvas
        resizePreviewCanvas();
        renderPreview();
    };

    const handleResizeEnd = () => {
        if (!isResizing) return;
        isResizing = false;

        const box = document.getElementById('mobile-preview-box');
        if (box) {
            box.style.transition = '';
        }
    };

    resizeHandle.addEventListener('mousedown', handleResizeStart);
    document.addEventListener('mousemove', handleResizeMove);
    document.addEventListener('mouseup', handleResizeEnd);

    resizeHandle.addEventListener('touchstart', handleResizeStart, { passive: false });
    document.addEventListener('touchmove', handleResizeMove, { passive: false });
    document.addEventListener('touchend', handleResizeEnd);
}

function resizePreviewCanvas() {
    if (!previewCanvas) return;

    const box = document.getElementById('mobile-preview-box');
    if (!box) return;

    const rect = box.getBoundingClientRect();
    const width = rect.width || 120;
    const height = rect.height || 120;

    const dpr = window.devicePixelRatio || 1;
    previewCanvas.width = width * dpr;
    previewCanvas.height = height * dpr;

    if (previewCtx) {
        previewCtx.setTransform(1, 0, 0, 1, 0, 0);
        previewCtx.scale(dpr, dpr);
    }
}

function renderPreview() {
    if (!previewCtx || !previewCanvas || !state.mobilePreviewVisible) return;

    const box = document.getElementById('mobile-preview-box');
    if (!box) return;

    const rect = box.getBoundingClientRect();
    const width = rect.width || 120;
    const height = rect.height || 120;
    const centerX = width / 2;
    const centerY = height * 0.45;

    const dpr = window.devicePixelRatio || 1;

    // Reset transform and clear
    previewCtx.setTransform(1, 0, 0, 1, 0, 0);
    previewCtx.scale(dpr, dpr);

    // Clear canvas
    previewCtx.fillStyle = '#0a0812';
    previewCtx.fillRect(0, 0, width, height);

    // Calculate scale based on pendulum size and box size
    const totalLength = state.params.L1 + state.params.L2;
    const scale = (Math.min(width, height) * 0.35) / totalLength;

    // Use current simulation state (not initial params)
    const theta1 = state.theta1;
    const theta2 = state.theta2;

    const x1 = state.params.L1 * Math.sin(theta1) * scale;
    const y1 = state.params.L1 * Math.cos(theta1) * scale;
    const x2 = x1 + state.params.L2 * Math.sin(theta2) * scale;
    const y2 = y1 + state.params.L2 * Math.cos(theta2) * scale;

    // Adjust sizes based on preview box size
    const sizeRatio = Math.min(width, height) / 120;
    const rodWidth = Math.max(2, CONFIG.render.rodWidth * sizeRatio * 0.6);
    const pivotSize = Math.max(3, 6 * sizeRatio * 0.6);
    const massSize = Math.max(5, 10 * sizeRatio * 0.6);

    // Draw trail if enabled
    if (state.trailEnabled && state.trail.length > 1) {
        previewCtx.lineCap = 'round';
        previewCtx.lineJoin = 'round';

        for (let i = 1; i < state.trail.length; i++) {
            const prev = state.trail[i - 1];
            const curr = state.trail[i];

            const alpha = state.trailInfinite ? 0.6 : (i / state.trail.length) * 0.8;
            previewCtx.strokeStyle = `rgba(255, 122, 236, ${alpha})`;
            previewCtx.lineWidth = Math.max(1, CONFIG.render.trailWidth * sizeRatio * 0.5);

            previewCtx.beginPath();
            previewCtx.moveTo(centerX + prev.x * scale, centerY + prev.y * scale);
            previewCtx.lineTo(centerX + curr.x * scale, centerY + curr.y * scale);
            previewCtx.stroke();
        }
    }

    // Draw rods
    previewCtx.strokeStyle = CONFIG.colors.rod;
    previewCtx.lineWidth = rodWidth;
    previewCtx.lineCap = 'round';

    previewCtx.beginPath();
    previewCtx.moveTo(centerX, centerY);
    previewCtx.lineTo(centerX + x1, centerY + y1);
    previewCtx.stroke();

    previewCtx.beginPath();
    previewCtx.moveTo(centerX + x1, centerY + y1);
    previewCtx.lineTo(centerX + x2, centerY + y2);
    previewCtx.stroke();

    // Draw pivot
    previewCtx.fillStyle = CONFIG.colors.pivot;
    previewCtx.beginPath();
    previewCtx.arc(centerX, centerY, pivotSize, 0, Math.PI * 2);
    previewCtx.fill();

    // Draw mass 1
    previewCtx.fillStyle = CONFIG.colors.mass1;
    previewCtx.beginPath();
    previewCtx.arc(
        centerX + x1,
        centerY + y1,
        massSize * Math.sqrt(state.params.m1 / CONFIG.defaults.m1),
        0, Math.PI * 2
    );
    previewCtx.fill();

    // Draw mass 2 with glow
    previewCtx.shadowColor = CONFIG.colors.mass2;
    previewCtx.shadowBlur = Math.max(4, 12 * sizeRatio * 0.5);
    previewCtx.fillStyle = CONFIG.colors.mass2;
    previewCtx.beginPath();
    previewCtx.arc(
        centerX + x2,
        centerY + y2,
        massSize * Math.sqrt(state.params.m2 / CONFIG.defaults.m2),
        0, Math.PI * 2
    );
    previewCtx.fill();
    previewCtx.shadowBlur = 0;
}

function showMobilePreview() {
    if (!isMobileViewActive()) return;

    const box = document.getElementById('mobile-preview-box');
    if (!box) return;

    // Show when not on simulation tab
    if (state.mobileActivePanel !== 'simulation') {
        // Reset to default position if not custom dragged
        if (!state.previewDrag.customPosition) {
            resetPreviewPosition();
        }

        box.classList.remove('hidden');
        box.classList.add('corner', 'visible');
        state.mobilePreviewVisible = true;

        // Update preview play button state
        updatePreviewPlayButton();

        // Re-init canvas for current size and render
        requestAnimationFrame(() => {
            resizePreviewCanvas();
            renderPreview();
        });
    }
}

function hideMobilePreview() {
    const box = document.getElementById('mobile-preview-box');
    if (box) {
        box.classList.remove('visible', 'corner');
        box.classList.add('hidden');
        state.mobilePreviewVisible = false;
    }
}

function triggerMobilePreview() {
    if (!isMobileViewActive() || state.mobileActivePanel === 'simulation') return;

    showMobilePreview();
}

// ============================================
// PREVIEW BOX DRAG FUNCTIONALITY
// ============================================

function initPreviewDrag() {
    const box = document.getElementById('mobile-preview-box');
    if (!box) return;

    // Mouse events
    box.addEventListener('mousedown', handleDragStart);
    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);

    // Touch events
    box.addEventListener('touchstart', handleDragStart, { passive: false });
    document.addEventListener('touchmove', handleDragMove, { passive: false });
    document.addEventListener('touchend', handleDragEnd);
}

function handleDragStart(e) {
    const box = document.getElementById('mobile-preview-box');
    if (!box) return;

    // Don't start drag if clicking on controls or resize handle
    if (e.target.closest('.mobile-preview-box__controls') ||
        e.target.closest('.mobile-preview-box__resize')) {
        return;
    }

    // Prevent default to avoid text selection and scrolling
    e.preventDefault();

    const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;

    const rect = box.getBoundingClientRect();

    state.previewDrag.isDragging = true;
    state.previewDrag.startX = clientX;
    state.previewDrag.startY = clientY;
    state.previewDrag.offsetX = clientX - rect.left;
    state.previewDrag.offsetY = clientY - rect.top;

    box.style.cursor = 'grabbing';
    box.style.transition = 'none'; // Disable transition during drag
}

function handleDragMove(e) {
    if (!state.previewDrag.isDragging) return;

    const box = document.getElementById('mobile-preview-box');
    if (!box) return;

    e.preventDefault();

    const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
    const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;

    // Calculate new position
    let newX = clientX - state.previewDrag.offsetX;
    let newY = clientY - state.previewDrag.offsetY;

    // Get boundaries
    const boxRect = box.getBoundingClientRect();
    const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sim-nav-height')) || 108;
    const tabBarHeight = 64;

    // Constrain to viewport
    const minX = 8;
    const maxX = window.innerWidth - boxRect.width - 8;
    const minY = navHeight + 8;
    const maxY = window.innerHeight - tabBarHeight - boxRect.height - 8;

    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    // Apply position
    box.style.left = newX + 'px';
    box.style.top = newY + 'px';
    box.style.right = 'auto';
    box.style.transform = 'none';

    state.previewDrag.customPosition = true;
}

function handleDragEnd() {
    if (!state.previewDrag.isDragging) return;

    const box = document.getElementById('mobile-preview-box');
    if (box) {
        box.style.cursor = 'grab';
        // Re-enable transitions but keep custom position
        box.style.transition = '';
    }

    state.previewDrag.isDragging = false;
}

function resetPreviewPosition() {
    const box = document.getElementById('mobile-preview-box');
    if (!box) return;

    // Reset to default corner position
    box.style.left = '';
    box.style.top = '';
    box.style.right = '';
    box.style.transform = '';
    state.previewDrag.customPosition = false;
}

// ============================================
// VIEW MODE SWITCHER
// ============================================

function initViewModeSwitcher() {
    const switcherBtn = document.getElementById('view-mode-switcher-btn');
    if (switcherBtn) {
        switcherBtn.addEventListener('click', toggleViewPreference);
    }

    // Update switcher icon based on current mode
    updateViewModeSwitcherIcon();
}

function updateViewModeSwitcherIcon() {
    const switcherBtn = document.getElementById('view-mode-switcher-btn');
    if (!switcherBtn) return;

    const isMobile = document.body.classList.contains('sim-view-mobile');
    const i18n = window.i18nManager;

    // Desktop icon when in mobile mode, mobile icon when in desktop mode
    if (isMobile) {
        // Show desktop icon
        switcherBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
        </svg>`;
        switcherBtn.setAttribute('aria-label', i18n?.t('view_desktop_label') || 'Switch to desktop view');
        switcherBtn.setAttribute('title', i18n?.t('view_desktop_label') || 'Switch to desktop view');
    } else {
        // Show mobile icon
        switcherBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="7" y="2" width="10" height="20" rx="2"/>
            <line x1="11" y1="18" x2="13" y2="18"/>
        </svg>`;
        switcherBtn.setAttribute('aria-label', i18n?.t('view_mobile_label') || 'Switch to mobile view');
        switcherBtn.setAttribute('title', i18n?.t('view_mobile_label') || 'Switch to mobile view');
    }
}

// ============================================
// INITIALIZATION
// ============================================

function initCanvas() {
    canvas = document.getElementById('pendulum-canvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    // Set canvas size
    resizeCanvas();
    window.addEventListener('resize', debounce(resizeCanvas, 200));
}

function resizeCanvas() {
    if (!canvas) return;

    const main = document.querySelector('.sim-main');
    const nav = document.querySelector('.sim-nav');
    const navHeight = nav ? nav.getBoundingClientRect().height : 0;
    const viewportHeight = Math.max(0, window.innerHeight - navHeight);
    const availableWidth = main ? main.clientWidth : window.innerWidth;
    const availableHeight = Math.min(main ? main.clientHeight : viewportHeight, viewportHeight);
    const padding = 32;

    const maxWidth = Math.max(0, availableWidth - padding);
    const maxHeight = Math.max(0, availableHeight - padding);
    const maxSize = Math.max(0, Math.min(maxWidth, maxHeight, 760));
    const size = Math.max(1, Math.floor(maxSize));

    canvas.width = size;
    canvas.height = size;
    
    // Adjust scale based on canvas size
    const totalLength = state.params.L1 + state.params.L2;
    CONFIG.render.scale = (size * 0.42) / totalLength;
    
    render();
}

function initChaosCanvas() {
    chaosCanvas = document.getElementById('chaos-canvas');
    if (!chaosCanvas) return;
    
    chaosCtx = chaosCanvas.getContext('2d');
    
    const size = CONFIG.chaosMap.resolution;
    chaosCanvas.width = size;
    chaosCanvas.height = size;
    
    // Click handler
    chaosCanvas.addEventListener('click', handleChaosMapClick);
}

function initControls() {
    // Cache element references
    elements.playBtn = document.getElementById('play-btn');
    elements.resetBtn = document.getElementById('reset-btn');
    elements.tutorialBtn = document.getElementById('tutorial-btn');
    elements.viewToggleBtn = document.getElementById('view-toggle-btn');
    elements.downloadPendulumImageBtn = document.getElementById('download-pendulum-image');
    elements.downloadPendulumVideoBtn = document.getElementById('download-pendulum-video');
    elements.downloadChaosImageBtn = document.getElementById('download-chaos-image');
    
    // Play/Pause
    if (elements.playBtn) {
        elements.playBtn.addEventListener('click', togglePlay);
    }
    
    // Reset
    if (elements.resetBtn) {
        elements.resetBtn.addEventListener('click', reset);
    }
    
    // Tutorial
    if (elements.tutorialBtn) {
        elements.tutorialBtn.addEventListener('click', startTutorial);
    }

    // View toggle
    if (elements.viewToggleBtn) {
        elements.viewToggleBtn.addEventListener('click', toggleViewPreference);
    }

    if (elements.downloadPendulumImageBtn) {
        elements.downloadPendulumImageBtn.addEventListener('click', downloadPendulumImage);
    }

    if (elements.downloadPendulumVideoBtn) {
        elements.downloadPendulumVideoBtn.addEventListener('click', downloadPendulumVideo);
    }

    if (elements.downloadChaosImageBtn) {
        elements.downloadChaosImageBtn.addEventListener('click', downloadChaosImage);
    }
    
    // Parameter sliders
    Object.keys(CONFIG.ranges).forEach(param => {
        const slider = document.getElementById(param);
        if (slider) {
            slider.addEventListener('input', (e) => {
                setParameter(param, parseFloat(e.target.value));
            });
        }
    });
    
    // Speed slider
    const speedSlider = document.getElementById('speed');
    if (speedSlider) {
        speedSlider.addEventListener('input', (e) => {
            setSpeed(parseFloat(e.target.value));
        });
    }
    
    // Trail controls
    const trailToggle = document.getElementById('trail-enabled');
    if (trailToggle) {
        trailToggle.addEventListener('change', (e) => {
            state.trailEnabled = e.target.checked;
        });
    }
    
    const trailInfiniteToggle = document.getElementById('trail-infinite');
    if (trailInfiniteToggle) {
        trailInfiniteToggle.addEventListener('change', (e) => {
            toggleTrailInfinite(e.target.checked);
        });
    }
    
    const trailDurationSlider = document.getElementById('trail-duration');
    if (trailDurationSlider) {
        trailDurationSlider.addEventListener('input', (e) => {
            setTrailDuration(parseFloat(e.target.value));
        });
    }
    
    // Damping toggle
    const dampingToggle = document.getElementById('damping-enabled');
    if (dampingToggle) {
        dampingToggle.addEventListener('change', (e) => {
            toggleDamping(e.target.checked);
        });
    }
    
    // Chaos map toggles
    const chaosToggle = document.getElementById('chaos-toggle');
    if (chaosToggle) {
        chaosToggle.addEventListener('click', toggleChaosPanel);
    }
    
    // Chaos axis selectors
    const axisXSelect = document.getElementById('chaos-axis-x');
    const axisYSelect = document.getElementById('chaos-axis-y');
    
    if (axisXSelect) {
        axisXSelect.addEventListener('change', (e) => {
            setChaosAxis('x', e.target.value);
        });
    }
    
    if (axisYSelect) {
        axisYSelect.addEventListener('change', (e) => {
            setChaosAxis('y', e.target.value);
        });
    }

    const chaosGridToggle = document.getElementById('chaos-grid-toggle');
    if (chaosGridToggle) {
        chaosGridToggle.checked = state.chaosGridEnabled;
        chaosGridToggle.addEventListener('change', (e) => {
            state.chaosGridEnabled = e.target.checked;
            if (state.chaosMapData) {
                renderChaosMap();
            }
        });
    }
    
    // Mobile panel toggles
    const controlsToggle = document.querySelector('.panel-toggle--controls');
    const chaosToggleMobile = document.querySelector('.panel-toggle--chaos');
    
    if (controlsToggle) {
        controlsToggle.addEventListener('click', toggleControlPanel);
    }
    
    if (chaosToggleMobile) {
        chaosToggleMobile.addEventListener('click', toggleChaosPanel);
    }
    
    // Recompute chaos map button
    const recomputeBtn = document.getElementById('recompute-chaos');
    if (recomputeBtn) {
        recomputeBtn.addEventListener('click', () => {
            state.chaosMapData = null;
            state.chaosMapSignature = null;
            state.chaosMapSnapshot = null;
            computeChaosMap();
        });
    }
}

function initState() {
    // Set initial state from defaults
    state.theta1 = degToRad(CONFIG.defaults.theta1);
    state.theta2 = degToRad(CONFIG.defaults.theta2);
    state.omega1 = CONFIG.defaults.omega1;
    state.omega2 = CONFIG.defaults.omega2;
    
    // Update all value displays
    Object.keys(CONFIG.defaults).forEach(param => {
        const valueEl = document.getElementById(`${param}-value`);
        if (valueEl) {
            const decimals = param.includes('theta') || param.includes('omega') ? 1 : 2;
            valueEl.textContent = formatNumber(CONFIG.defaults[param], decimals);
        }
    });
}

// Main initialization
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initChaosCanvas();
    initPreviewCanvas();
    initControls();
    initChaosWarningModal();
    initViewMode();
    initMobileTabNavigation();
    initViewModeSwitcher();
    initPreviewDrag();
    initState();

    // Initial render
    render();
    updatePlayButton();
    updateMobileTabLabels();

    // Ensure chaos panel state on load
    if (state.chaosPanelOpen && !isMobileViewActive()) {
        const chaosPanel = document.querySelector('.chaos-panel');
        if (chaosPanel) {
            chaosPanel.classList.remove('collapsed');
            chaosPanel.classList.add('open');
        }
        if (!state.chaosMapData) {
            computeChaosMap();
        }
    }

    // Initialize starfield background
    if (typeof initStarfield === 'function') {
        initStarfield('starfield');
    }

    // Listen for language changes to update mobile tab labels
    window.addEventListener('languageChanged', () => {
        updateMobileTabLabels();
        updateViewModeSwitcherIcon();
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (chaosWarning.isOpen && e.key === 'Escape') {
        e.preventDefault();
        closeChaosWarningModal(false);
        return;
    }

    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    
    switch (e.key) {
        case ' ':
            e.preventDefault();
            togglePlay();
            break;
        case 'r':
        case 'R':
            reset();
            break;
        case 'Escape':
            if (typeof endTutorial === 'function') {
                endTutorial();
            }
            break;
    }
});
