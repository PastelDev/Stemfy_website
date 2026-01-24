/* ============================================
   STEMfy.gr — Common JavaScript
   Starfield, Galaxy Logo, and Shared Utilities
   ============================================ */

/**
 * Initialize animated pixel starfield background
 * @param {string} canvasId - Canvas element ID
 */
function initStarfield(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let stars = [];
    let animationId;
    
    // Resize canvas to window
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        generateStars();
    }
    
    // Generate star positions
    function generateStars() {
        stars = [];
        const numStars = Math.floor((canvas.width * canvas.height) / 4000);

        for (let i = 0; i < numStars; i++) {
            // Color distribution: 30% white, 20% pink, 50% purple
            const colorRand = Math.random();
            let hue, saturation;

            if (colorRand < 0.3) {
                // White/lavender pixels
                hue = 270;
                saturation = 10 + Math.random() * 15;
            } else if (colorRand < 0.5) {
                // Pink/magenta pixels (hue 300-320)
                hue = 300 + Math.random() * 20;
                saturation = 40 + Math.random() * 40;
            } else {
                // Purple pixels (hue 260-290)
                hue = 260 + Math.random() * 30;
                saturation = 45 + Math.random() * 40;
            }

            stars.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() < 0.9 ? 1 : Math.random() < 0.95 ? 2 : 3,
                brightness: Math.random(),
                twinkleSpeed: 0.005 + Math.random() * 0.015,
                twinkleOffset: Math.random() * Math.PI * 2,
                hue: hue,
                saturation: saturation
            });
        }
    }
    
    // Draw frame
    function draw(time) {
        ctx.fillStyle = '#0a0812';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        stars.forEach(star => {
            // Twinkle effect
            const twinkle = Math.sin(time * star.twinkleSpeed + star.twinkleOffset);
            const alpha = 0.3 + star.brightness * 0.5 + twinkle * 0.2;
            
            if (star.saturation === 0) {
                ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
            } else {
                ctx.fillStyle = `hsla(${star.hue}, ${star.saturation}%, 80%, ${alpha})`;
            }
            
            // Pixel-perfect rendering
            const x = Math.floor(star.x);
            const y = Math.floor(star.y);
            ctx.fillRect(x, y, star.size, star.size);
        });
        
        animationId = requestAnimationFrame(draw);
    }
    
    // Initialize
    resize();
    window.addEventListener('resize', resize);
    animationId = requestAnimationFrame(draw);
    
    // Cleanup function
    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationId);
    };
}

/**
 * Initialize pixel art galaxy logo
 * @param {string} canvasId - Canvas element ID
 */
function initGalaxyLogo(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const center = size / 2;
    
    // Galaxy parameters
    const arms = 2;
    const pixelSize = 4;
    const numParticles = 800;
    
    let particles = [];
    let animationId;
    let rotation = 0;
    
    // Generate galaxy particles
    function generateGalaxy() {
        particles = [];
        
        for (let i = 0; i < numParticles; i++) {
            // Logarithmic spiral
            const arm = i % arms;
            const armOffset = (arm / arms) * Math.PI * 2;
            
            const t = Math.random();
            const r = t * (size * 0.4);
            const spread = (1 - t) * 0.8 + 0.2;
            
            // Base angle on spiral
            const spiralAngle = armOffset + t * Math.PI * 3;
            
            // Add randomness
            const angle = spiralAngle + (Math.random() - 0.5) * spread;
            const radiusJitter = r + (Math.random() - 0.5) * 20 * spread;
            
            const brightness = 0.3 + Math.random() * 0.7 * (1 - t * 0.5);
            
            particles.push({
                angle: angle,
                radius: Math.max(2, radiusJitter),
                brightness: brightness,
                size: Math.random() < 0.9 ? pixelSize : pixelSize * 1.5,
                // Core particles are brighter and whiter
                isCore: t < 0.15,
                hue: 270 + Math.random() * 30
            });
        }

        // Add central glow particles
        for (let i = 0; i < 50; i++) {
            const r = Math.random() * 15;
            const angle = Math.random() * Math.PI * 2;
            particles.push({
                angle: angle,
                radius: r,
                brightness: 0.8 + Math.random() * 0.2,
                size: pixelSize,
                isCore: true,
                hue: 280
            });
        }
    }
    
    // Draw frame
    function draw() {
        ctx.clearRect(0, 0, size, size);
        
        // Slow rotation
        rotation += 0.002;
        
        particles.forEach(p => {
            const x = center + Math.cos(p.angle + rotation) * p.radius;
            const y = center + Math.sin(p.angle + rotation) * p.radius;
            
            // Pixel-perfect positions
            const px = Math.floor(x / pixelSize) * pixelSize;
            const py = Math.floor(y / pixelSize) * pixelSize;
            
            if (p.isCore) {
                ctx.fillStyle = `rgba(220, 200, 255, ${p.brightness})`;
            } else {
                ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.brightness})`;
            }
            
            ctx.fillRect(px, py, p.size, p.size);
        });
        
        animationId = requestAnimationFrame(draw);
    }
    
    // Initialize
    generateGalaxy();
    animationId = requestAnimationFrame(draw);
    
    // Cleanup function
    return () => {
        cancelAnimationFrame(animationId);
    };
}

/**
 * Format number with specified decimal places
 * @param {number} num - Number to format
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted number
 */
function formatNumber(num, decimals = 2) {
    return num.toFixed(decimals);
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation
 * @param {number} a - Start value
 * @param {number} b - End value
 * @param {number} t - Interpolation factor (0-1)
 * @returns {number} Interpolated value
 */
function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Map a value from one range to another
 * @param {number} value - Input value
 * @param {number} inMin - Input range minimum
 * @param {number} inMax - Input range maximum
 * @param {number} outMin - Output range minimum
 * @param {number} outMax - Output range maximum
 * @returns {number} Mapped value
 */
function mapRange(value, inMin, inMax, outMin, outMax) {
    return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
function degToRad(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Convert radians to degrees
 * @param {number} radians 
 * @returns {number} Degrees
 */
function radToDeg(radians) {
    return radians * 180 / Math.PI;
}

/**
 * HSL to RGB conversion for canvas rendering
 * @param {number} h - Hue (0-360)
 * @param {number} s - Saturation (0-100)
 * @param {number} l - Lightness (0-100)
 * @returns {object} {r, g, b} values 0-255
 */
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r, g, b;
    
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    return {
        r: Math.round((r + m) * 255),
        g: Math.round((g + m) * 255),
        b: Math.round((b + m) * 255)
    };
}

/**
 * Get color for chaos map based on Lyapunov exponent
 * @param {number} lyapunov - Lyapunov exponent value
 * @param {number} maxLyapunov - Maximum expected value for normalization
 * @returns {object} {r, g, b} values 0-255
 */
function getChaosColor(lyapunov, maxLyapunov = 2) {
    // Normalize to 0-1 range
    const normalized = clamp(lyapunov / maxLyapunov, 0, 1);
    
    // Blue (stable) -> Purple (transition) -> Red (chaotic)
    if (normalized < 0.5) {
        // Blue to purple
        const t = normalized * 2;
        return {
            r: Math.round(lerp(26, 138, t)),
            g: Math.round(lerp(74, 74, t)),
            b: Math.round(lerp(138, 138, t))
        };
    } else {
        // Purple to red
        const t = (normalized - 0.5) * 2;
        return {
            r: Math.round(lerp(138, 255, t)),
            g: Math.round(lerp(74, 74, t * 0.3)),
            b: Math.round(lerp(138, 74, t))
        };
    }
}

/**
 * Debounce function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum time between calls in ms
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Export for use in other modules (if using modules)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initStarfield,
        initGalaxyLogo,
        formatNumber,
        clamp,
        lerp,
        mapRange,
        degToRad,
        radToDeg,
        hslToRgb,
        getChaosColor,
        debounce,
        throttle
    };
}
