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
    chaosAxisX: 'theta1',
    chaosAxisY: 'theta2',
    chaosGridEnabled: true,
    
    // UI
    controlPanelOpen: true,
    chaosPanelOpen: true
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
    if (effective === VIEW_MODES.mobile && !wasMobile) {
        if (controlPanel) {
            controlPanel.classList.add('collapsed');
            controlPanel.classList.remove('open');
        }
        state.controlPanelOpen = false;
    }

    if (effective === VIEW_MODES.desktop && wasMobile) {
        if (controlPanel) {
            controlPanel.classList.remove('collapsed');
            controlPanel.classList.add('open');
        }
        state.controlPanelOpen = true;
    }

    updateViewToggleLabel(effective);
    updateNavHeightVariable();
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
let elements = {};

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
            ctx.lineWidth = CONFIG.render.trailWidth;
            ctx.lineTo(centerX + point.x, centerY + point.y);
        }
        ctx.stroke();
    }
    
    // Draw rods
    ctx.strokeStyle = CONFIG.colors.rod;
    ctx.lineWidth = CONFIG.render.rodWidth;
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
    ctx.arc(centerX, centerY, CONFIG.render.pivotRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw mass 1
    ctx.fillStyle = CONFIG.colors.mass1;
    ctx.beginPath();
    ctx.arc(
        centerX + pos.x1, 
        centerY + pos.y1, 
        CONFIG.render.mass1Radius * Math.sqrt(state.params.m1 / CONFIG.defaults.m1),
        0, Math.PI * 2
    );
    ctx.fill();
    
    // Draw mass 2
    ctx.fillStyle = CONFIG.colors.mass2;
    ctx.beginPath();
    ctx.arc(
        centerX + pos.x2, 
        centerY + pos.y2,
        CONFIG.render.mass2Radius * Math.sqrt(state.params.m2 / CONFIG.defaults.m2),
        0, Math.PI * 2
    );
    ctx.fill();
    
    // Add glow effect to mass 2
    ctx.shadowColor = CONFIG.colors.mass2;
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(
        centerX + pos.x2, 
        centerY + pos.y2,
        CONFIG.render.mass2Radius * Math.sqrt(state.params.m2 / CONFIG.defaults.m2) * 0.5,
        0, Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
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
    showChaosLoading(true);
    
    // Compute in chunks on the main thread
    computeChaosMapDirect();
}

function computeChaosMapDirect() {
    const resolution = CONFIG.chaosMap.resolution;
    const axisX = state.chaosAxisX;
    const axisY = state.chaosAxisY;
    
    const rangeX = CONFIG.ranges[axisX];
    const rangeY = CONFIG.ranges[axisY];
    
    const values = [];
    let maxLyapunov = 0;
    
    const baseParams = { ...state.params };
    
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
            
            // Set initial conditions
            params.theta1 = params.theta1 !== undefined ? 
                (typeof params.theta1 === 'number' && !axisX.includes('theta') ? degToRad(state.params.theta1) : params.theta1) :
                degToRad(state.params.theta1);
            params.theta2 = params.theta2 !== undefined ?
                (typeof params.theta2 === 'number' && !axisY.includes('theta') ? degToRad(state.params.theta2) : params.theta2) :
                degToRad(state.params.theta2);
            
            const lyapunov = computeLyapunov(params);
            values[y][x] = Math.max(0, lyapunov);
            maxLyapunov = Math.max(maxLyapunov, lyapunov);
        }
        
        computed = endIdx;
        updateChaosProgress(computed / total);
        
        if (computed < total) {
            requestAnimationFrame(computeChunk);
        } else {
            finishChaosMap(values, maxLyapunov, resolution);
        }
    }
    
    requestAnimationFrame(computeChunk);
}


function finishChaosMap(values, maxLyapunov, resolution) {
    state.chaosMapData = {
        values,
        maxLyapunov: maxLyapunov || 1,
        resolution,
        axisX: state.chaosAxisX,
        axisY: state.chaosAxisY
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
    
    // Update parameters
    setParameter(axisX, valueX);
    setParameter(axisY, valueY);
    
    // Update sliders
    const sliderX = document.getElementById(axisX);
    const sliderY = document.getElementById(axisY);
    if (sliderX) sliderX.value = valueX;
    if (sliderY) sliderY.value = valueY;
    
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
    initControls();
    initViewMode();
    initState();
    
    // Initial render
    render();
    updatePlayButton();

    // Ensure chaos panel state on load
    if (state.chaosPanelOpen) {
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
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
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
