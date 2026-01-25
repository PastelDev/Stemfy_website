/* ============================================
   STEMfy.gr — Common JavaScript
   Shared Utilities
   ============================================ */




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
        formatNumber,
        clamp,
        lerp,
        mapRange,
        degToRad,
        radToDeg,
        getChaosColor,
        debounce,
        throttle
    };
}
