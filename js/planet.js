/**
 * WebGL 3D Tech Planet & Background Pixel Matrix - Nexora Digital (Three.js + Canvas 2D)
 * Large interactive WebGL planet (+40% scale) with drag controls, tilt response, inertia, and CPU-saving viewport pause.
 */

import * as THREE from 'three';

export function initHeroPlanet(containerId = 'hero-planet-canvas') {
  const container = document.getElementById(containerId);
  if (!container) return;

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize Background Pixel Matrix Layer
  initBackgroundParticles('bg-particles-canvas', prefersReducedMotion);

  // Check WebGL availability & reduced motion for 3D planet
  if (prefersReducedMotion || !isWebGLAvailable()) {
    renderFallback(container);
    return;
  }

  try {
    createWebGLPlanet(container);
  } catch (err) {
    console.warn('WebGL planet initialization fallback:', err);
    renderFallback(container);
  }
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

function renderFallback(container) {
  container.innerHTML = `
    <div class="planet-fallback-box">
      <div class="fallback-ring ring-1"></div>
      <div class="fallback-ring ring-2"></div>
      <div class="fallback-core-dot"></div>
      <span class="fallback-label">NEXORA WEBGL CORE</span>
    </div>
  `;
}

/**
 * 1. Background Pixel Matrix Canvas System
 */
function initBackgroundParticles(canvasId, reducedMotion) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
  let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

  const isMobile = window.innerWidth < 768;
  const particleCount = isMobile ? 25 : 65;

  const particles = [];
  let mouseX = width / 2;
  let mouseY = height / 2;

  // Particle constructor
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      size: Math.random() > 0.85 ? 2.5 : 1.5,
      isRed: Math.random() < 0.08, // Rare red accent particles
      alpha: Math.random() * 0.06 + 0.04,
    });
  }

  function handleResize() {
    width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
    height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
  }

  window.addEventListener('resize', handleResize, { passive: true });

  window.addEventListener(
    'mousemove',
    (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    },
    { passive: true }
  );

  let isParticlesAnimating = true;

  function renderParticles() {
    if (!isParticlesAnimating || reducedMotion) return;

    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      // Wrap boundaries
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Mouse proximity repulsion influence
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 100) {
        p.x -= (dx / dist) * 0.4;
        p.y -= (dy / dist) * 0.4;
      }

      ctx.fillStyle = p.isRed ? `rgba(225, 6, 0, ${p.alpha + 0.3})` : `rgba(245, 245, 245, ${p.alpha})`;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(renderParticles);
  }

  // CPU pause observer
  const particleObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        if (!isParticlesAnimating) {
          isParticlesAnimating = true;
          renderParticles();
        }
      } else {
        isParticlesAnimating = false;
      }
    });
  });

  particleObserver.observe(canvas.parentElement || canvas);

  if (!reducedMotion) {
    renderParticles();
  }
}

/**
 * 2. Three.js WebGL Tech Planet (Cosmos-Style Hollow Semi-Transparent Dot Sphere with Red Orbital Ring)
 */
function createWebGLPlanet(container) {
  const scene = new THREE.Scene();

  const width = container.clientWidth || 480;
  const height = container.clientHeight || 480;

  // Camera positioned at z = 6.4 for perfect framing with zero visual clipping
  const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
  camera.position.z = 6.4;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  const planetGroup = new THREE.Group();
  scene.add(planetGroup);

  // A. Faint Latitudinal/Longitudinal Tech Wireframe Grid (Very Soft)
  const wireGeo = new THREE.SphereGeometry(1.74, 32, 32);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true,
    transparent: true,
    opacity: 0.04,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  planetGroup.add(wireMesh);

  // B. Delicate Hollow Semi-Transparent Dot Matrix Sphere (2600 Points)
  const particleCount = 2600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const radius = 1.75;
  const colorAccentWhite = new THREE.Color(0xF5F5F5);
  const colorSoftGrey = new THREE.Color(0x788292);
  const colorDarkGrey = new THREE.Color(0x282e3c);

  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const rand = Math.random();
    let pColor = colorDarkGrey;

    if (rand < 0.12) {
      pColor = colorAccentWhite;   // Soft accent white dot
    } else if (rand < 0.50) {
      pColor = colorSoftGrey;      // Muted grey-blue dot
    }

    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pointsMat = new THREE.PointsMaterial({
    size: 0.026,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
  });

  const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
  planetGroup.add(pointsMesh);

  // C. Signature Red Orbital Line Ring: Radius 2.22
  const ring1Geo = new THREE.BufferGeometry();
  const ring1Segs = 96;
  const ring1Pos = new Float32Array((ring1Segs + 1) * 3);
  const ring1Radius = 2.22;

  for (let i = 0; i <= ring1Segs; i++) {
    const theta = (i / ring1Segs) * Math.PI * 2;
    ring1Pos[i * 3] = ring1Radius * Math.cos(theta);
    ring1Pos[i * 3 + 1] = ring1Radius * Math.sin(theta);
    ring1Pos[i * 3 + 2] = 0;
  }

  ring1Geo.setAttribute('position', new THREE.BufferAttribute(ring1Pos, 3));
  const ring1Mat = new THREE.LineBasicMaterial({
    color: 0xE10600,
    transparent: true,
    opacity: 0.55,
  });

  const ring1Line = new THREE.Line(ring1Geo, ring1Mat);
  ring1Line.rotation.x = Math.PI / 2.7;
  ring1Line.rotation.y = Math.PI / 8;
  planetGroup.add(ring1Line);

  // D. Secondary Translucent White Orbital Line Ring: Radius 2.02
  const ring2Geo = new THREE.BufferGeometry();
  const ring2Segs = 80;
  const ring2Pos = new Float32Array((ring2Segs + 1) * 3);
  const ring2Radius = 2.02;

  for (let i = 0; i <= ring2Segs; i++) {
    const theta = (i / ring2Segs) * Math.PI * 2;
    ring2Pos[i * 3] = ring2Radius * Math.cos(theta);
    ring2Pos[i * 3 + 1] = ring2Radius * Math.sin(theta);
    ring2Pos[i * 3 + 2] = 0;
  }

  ring2Geo.setAttribute('position', new THREE.BufferAttribute(ring2Pos, 3));
  const ring2Mat = new THREE.LineBasicMaterial({
    color: 0xF5F5F5,
    transparent: true,
    opacity: 0.15,
  });

  const ring2Line = new THREE.Line(ring2Geo, ring2Mat);
  ring2Line.rotation.x = -Math.PI / 3.2;
  ring2Line.rotation.y = -Math.PI / 6;
  planetGroup.add(ring2Line);

  // Initial Tilt & Smooth Mouse Cursor Tilt Tracking
  let currentTiltX = 0;
  let currentTiltY = 0;
  let targetTiltX = 0;
  let targetTiltY = 0;
  let autoRotationY = 0;

  function onMouseMove(event) {
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const normX = (event.clientX - windowHalfX) / windowHalfX;
    const normY = (event.clientY - windowHalfY) / windowHalfY;

    // Smooth tilt limit: ±0.45 radians
    targetTiltY = normX * 0.45;
    targetTiltX = normY * 0.45;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function onTouchMove(event) {
    if (!event.touches.length) return;
    const touch = event.touches[0];
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    const normX = (touch.clientX - windowHalfX) / windowHalfX;
    const normY = (touch.clientY - windowHalfY) / windowHalfY;

    targetTiltY = normX * 0.4;
    targetTiltX = normY * 0.4;
  }

  window.addEventListener('touchmove', onTouchMove, { passive: true });

  function onWindowResize() {
    if (!container) return;
    const newWidth = container.clientWidth || 320;
    const newHeight = container.clientHeight || 320;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
  }

  window.addEventListener('resize', onWindowResize);

  // Render Loop: Slower smooth auto-rotation (0.0005 rad/frame) + Lerped Cursor Tilt
  let isAnimating = true;

  function animate() {
    if (!isAnimating) return;

    requestAnimationFrame(animate);

    // Very slow continuous rotation around Y axis
    autoRotationY += 0.0005;

    // Smooth lerp following mouse cursor
    currentTiltX += (targetTiltX - currentTiltX) * 0.04;
    currentTiltY += (targetTiltY - currentTiltY) * 0.04;

    planetGroup.rotation.x = 0.2 + currentTiltX;
    planetGroup.rotation.y = autoRotationY + currentTiltY;

    // Independent subtle ring rotation
    ring1Line.rotation.z += 0.0002;
    ring2Line.rotation.z -= 0.00015;

    renderer.render(scene, camera);
  }

  const viewportObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isAnimating) {
            isAnimating = true;
            animate();
          }
        } else {
          isAnimating = false;
        }
      });
    },
    { threshold: 0.05 }
  );

  viewportObserver.observe(container);

  animate();
}
