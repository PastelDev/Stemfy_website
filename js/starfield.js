/* ============================================
   STEMfy.gr - Starfield (drift + gamma sizing)
   Inspired by assets/starfield.html
   ============================================ */

(function() {
  'use strict';

  const canvas = document.getElementById('starfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  const PARAMS = {
    background: '#080a14',
    starColors: [
      '#1a1a3a', '#2a1a4a', '#1a2a5a',
      '#3a2a5a', '#2a3a6a', '#3a3a7a',
      '#4a3a8a', '#3a4a9a', '#5a4a9e',
      '#4a6aba', '#6a5aba', '#5a7aca',
      '#7a8ada', '#8a7aea', '#6a9aea',
      '#9aaaff', '#aab0ff', '#b0c0ff',
      '#c0d0ff', '#d4d8ff', '#e8f0ff'
    ],
    starDensity: 2.0,
    minStars: 260,
    maxStars: 1100,
    baseSpeed: 0.35,
    minSize: 0.5,
    maxSize: 4.5,
    sizeGamma: 2.0
  };

  let stars = [];
  let time = 0;
  let lastFrame = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateStars();
  }

  function hexToRgb(hex) {
    const clean = hex.replace('#', '');
    return {
      r: parseInt(clean.substring(0, 2), 16),
      g: parseInt(clean.substring(2, 4), 16),
      b: parseInt(clean.substring(4, 6), 16)
    };
  }

  function generateStars() {
    stars = [];
    const area = canvas.width * canvas.height;
    let count = Math.round((area / 10000) * PARAMS.starDensity);
    count = Math.max(PARAMS.minStars, Math.min(PARAMS.maxStars, count));

    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;

      const sizeRand = Math.pow(Math.random(), PARAMS.sizeGamma);
      const size = PARAMS.minSize + sizeRand * (PARAMS.maxSize - PARAMS.minSize);
      const dist = (size - PARAMS.minSize) / (PARAMS.maxSize - PARAMS.minSize);

      const colorVariation = (Math.random() - 0.5) * 0.2;
      const colorIdx = Math.min(
        Math.max(0, Math.floor((dist + colorVariation) * (PARAMS.starColors.length - 1))),
        PARAMS.starColors.length - 1
      );

      const baseOpacity = 0.2 + Math.random() * 0.3;
      const sizeOpacity = dist * 0.5;
      const opacity = Math.min(1, baseOpacity + sizeOpacity);

      stars.push({
        baseX: x,
        baseY: y,
        size,
        opacity,
        color: hexToRgb(PARAMS.starColors[colorIdx]),
        velocity: PARAMS.baseSpeed * (0.3 + dist * 0.7)
      });
    }
  }

  function render(timestamp) {
    const delta = lastFrame ? (timestamp - lastFrame) : 16.67;
    lastFrame = timestamp;
    time += delta;

    ctx.fillStyle = PARAMS.background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (const s of stars) {
      const x = (s.baseX + time * s.velocity * 0.025) % canvas.width;
      const y = (s.baseY + time * s.velocity * 0.012) % canvas.height;

      ctx.fillStyle = `rgba(${s.color.r}, ${s.color.g}, ${s.color.b}, ${s.opacity})`;
      ctx.fillRect(x, y, s.size, s.size);
    }

    requestAnimationFrame(render);
  }

  window.addEventListener('resize', resize);
  resize();
  requestAnimationFrame(render);
})();
