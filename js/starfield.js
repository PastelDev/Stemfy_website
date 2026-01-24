/* ============================================
   STEMfy.gr — Enhanced Starfield
   Dense, diverse stars with realistic lighting
   ============================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Enhanced configuration
  const CONFIG = {
    background: '#0a0812',
    // Star density: stars per 10000 pixels
    density: 0.015,
    minStars: 400,
    maxStars: 2000,
    // Star layers for parallax (distance from viewer)
    layers: [
      { depth: 0.1, count: 0.5, sizeRange: [0.3, 0.8], speedMult: 0.2, glowMult: 0 },      // Far distant
      { depth: 0.25, count: 0.25, sizeRange: [0.5, 1.2], speedMult: 0.4, glowMult: 0.1 },  // Distant
      { depth: 0.5, count: 0.15, sizeRange: [1, 2], speedMult: 0.7, glowMult: 0.3 },       // Medium
      { depth: 0.75, count: 0.07, sizeRange: [1.5, 3], speedMult: 1.0, glowMult: 0.5 },    // Close
      { depth: 1.0, count: 0.03, sizeRange: [2.5, 4.5], speedMult: 1.5, glowMult: 0.8 }    // Very close (bright)
    ],
    // Color palette - from dim purple to bright white
    colors: {
      far: [
        { r: 42, g: 26, b: 74 },    // #2a1a4a - very dim purple
        { r: 58, g: 42, b: 90 },    // #3a2a5a
        { r: 74, g: 58, b: 106 },   // #4a3a6a
      ],
      mid: [
        { r: 90, g: 74, b: 138 },   // #5a4a8a
        { r: 106, g: 74, b: 158 },  // #6a4a9e
        { r: 138, g: 106, b: 186 }, // #8a6aba
        { r: 154, g: 122, b: 202 }, // #9a7aca
      ],
      close: [
        { r: 176, g: 138, b: 240 }, // #b08af0 - bright purple
        { r: 192, g: 160, b: 248 }, // #c0a0f8
        { r: 212, g: 160, b: 255 }, // #d4a0ff
        { r: 232, g: 200, b: 255 }, // #e8c8ff
        { r: 244, g: 232, b: 255 }, // #f4e8ff - near white
        { r: 255, g: 250, b: 255 }, // white with purple tint
      ],
      // Special accent colors for variety
      accent: [
        { r: 255, g: 122, b: 236 }, // #ff7aec - pink
        { r: 107, g: 255, b: 240 }, // #6bfff0 - cyan
        { r: 255, g: 200, b: 150 }, // warm white
      ]
    },
    baseSpeed: 0.3,
    twinkleSpeed: 0.002
  };

  let stars = [];
  let time = 0;
  let lastFrame = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
  }

  function getStarColor(layer, isAccent) {
    if (isAccent) {
      return CONFIG.colors.accent[Math.floor(Math.random() * CONFIG.colors.accent.length)];
    }

    if (layer.depth <= 0.25) {
      return CONFIG.colors.far[Math.floor(Math.random() * CONFIG.colors.far.length)];
    } else if (layer.depth <= 0.6) {
      return CONFIG.colors.mid[Math.floor(Math.random() * CONFIG.colors.mid.length)];
    } else {
      return CONFIG.colors.close[Math.floor(Math.random() * CONFIG.colors.close.length)];
    }
  }

  function generateStars() {
    stars = [];
    const area = canvas.width * canvas.height;
    let totalStars = Math.floor(area * CONFIG.density);
    totalStars = Math.max(CONFIG.minStars, Math.min(CONFIG.maxStars, totalStars));

    CONFIG.layers.forEach(layer => {
      const layerStarCount = Math.floor(totalStars * layer.count);

      for (let i = 0; i < layerStarCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;

        // Size based on layer (closer = bigger)
        const size = layer.sizeRange[0] + Math.random() * (layer.sizeRange[1] - layer.sizeRange[0]);

        // Brightness correlates with size and depth
        const baseBrightness = 0.2 + layer.depth * 0.8;

        // 3% chance for accent colored stars
        const isAccent = Math.random() < 0.03;
        const color = getStarColor(layer, isAccent);

        // Shape variety: 0 = circle, 1 = soft glow, 2 = sharp point
        const shape = Math.random() < 0.7 ? 0 : (Math.random() < 0.5 ? 1 : 2);

        stars.push({
          x,
          y,
          baseX: x,
          baseY: y,
          size,
          baseBrightness,
          brightness: baseBrightness,
          color,
          isAccent,
          // Velocity: bigger/closer stars move faster (parallax)
          velocityX: CONFIG.baseSpeed * layer.speedMult * (0.8 + Math.random() * 0.4),
          velocityY: CONFIG.baseSpeed * layer.speedMult * 0.5 * (0.8 + Math.random() * 0.4),
          // Glow radius correlates with size/depth
          glowRadius: size * (1.5 + layer.glowMult * 3),
          glowIntensity: layer.glowMult,
          // Twinkle parameters
          twinklePhase: Math.random() * Math.PI * 2,
          twinkleSpeed: CONFIG.twinkleSpeed * (0.5 + Math.random()),
          twinkleAmount: 0.1 + layer.depth * 0.3,
          // Shape
          shape,
          depth: layer.depth
        });
      }
    });

    // Sort by depth (far stars first, close stars last for proper layering)
    stars.sort((a, b) => a.depth - b.depth);
  }

  function drawStar(star, x, y) {
    const { size, brightness, color, glowRadius, glowIntensity, shape } = star;

    // Draw glow for brighter/closer stars
    if (glowIntensity > 0.1) {
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, glowRadius);
      gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, ${brightness * glowIntensity * 0.4})`);
      gradient.addColorStop(0.4, `rgba(${color.r}, ${color.g}, ${color.b}, ${brightness * glowIntensity * 0.15})`);
      gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, glowRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw star core
    ctx.fillStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${brightness})`;

    if (shape === 0) {
      // Circle
      ctx.beginPath();
      ctx.arc(x, y, size / 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (shape === 1) {
      // Soft square (for distant pixel-like stars)
      ctx.fillRect(x - size / 2, y - size / 2, size, size);
    } else {
      // Four-point star shape for bright stars
      const halfSize = size / 2;
      const innerSize = size / 4;

      ctx.beginPath();
      ctx.moveTo(x, y - halfSize);
      ctx.lineTo(x + innerSize, y - innerSize);
      ctx.lineTo(x + halfSize, y);
      ctx.lineTo(x + innerSize, y + innerSize);
      ctx.lineTo(x, y + halfSize);
      ctx.lineTo(x - innerSize, y + innerSize);
      ctx.lineTo(x - halfSize, y);
      ctx.lineTo(x - innerSize, y - innerSize);
      ctx.closePath();
      ctx.fill();
    }
  }

  function render(timestamp) {
    // Calculate delta time for smooth animation
    const deltaTime = lastFrame ? (timestamp - lastFrame) : 16.67;
    lastFrame = timestamp;
    time += deltaTime;

    // Clear canvas
    ctx.fillStyle = CONFIG.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw each star
    for (const star of stars) {
      // Calculate position with wrapping
      let x = (star.baseX + time * star.velocityX * 0.01) % (canvas.width + star.glowRadius * 2);
      let y = (star.baseY + time * star.velocityY * 0.01) % (canvas.height + star.glowRadius * 2);

      // Handle negative wrap
      if (x < -star.glowRadius) x += canvas.width + star.glowRadius * 2;
      if (y < -star.glowRadius) y += canvas.height + star.glowRadius * 2;

      // Twinkle effect
      const twinkle = Math.sin(time * star.twinkleSpeed + star.twinklePhase);
      star.brightness = star.baseBrightness * (1 + twinkle * star.twinkleAmount);

      drawStar(star, x, y);
    }

    requestAnimationFrame(render);
  }

  // Initialize
  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(render);
})();
