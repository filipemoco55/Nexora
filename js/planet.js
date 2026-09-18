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
 * 2. Three.js WebGL Tech Planet (Refined Scaled & Enhanced Editorial Aesthetics)
 */
function createWebGLPlanet(container) {
  const scene = new THREE.Scene();

  const width = container.clientWidth || 420;
  const height = container.clientHeight || 420;

  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 5.4;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });

  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const planetGroup = new THREE.Group();
  scene.add(planetGroup);

  // A. Atmospheric Red Aura Glow (Sprite Texture behind planet core)
  const glowCanvas = document.createElement('canvas');
  glowCanvas.width = 128;
  glowCanvas.height = 128;
  const glowCtx = glowCanvas.getContext('2d');
  if (glowCtx) {
    const gradient = glowCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(225, 6, 0, 0.35)');
    gradient.addColorStop(0.4, 'rgba(225, 6, 0, 0.12)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
    glowCtx.fillStyle = gradient;
    glowCtx.fillRect(0, 0, 128, 128);
  }
  const glowTexture = new THREE.CanvasTexture(glowCanvas);
  const glowMat = new THREE.SpriteMaterial({
    map: glowTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  });
  const glowSprite = new THREE.Sprite(glowMat);
  glowSprite.scale.set(4.6, 4.6, 1.0);
  planetGroup.add(glowSprite);

  // B. Planet Core Geometry: Radius 1.85 (Proportionate fit)
  const coreGeo = new THREE.SphereGeometry(1.85, 48, 48);
  const coreMat = new THREE.MeshBasicMaterial({
    color: 0x080808,
    transparent: true,
    opacity: 0.96,
  });
  const coreMesh = new THREE.Mesh(coreGeo, coreMat);
  planetGroup.add(coreMesh);

  // C. Structural Wireframe Tech Grid: Radius 1.89
  const wireGeo = new THREE.SphereGeometry(1.89, 28, 28);
  const wireMat = new THREE.MeshBasicMaterial({
    color: 0x262626,
    wireframe: true,
    transparent: true,
    opacity: 0.28,
  });
  const wireMesh = new THREE.Mesh(wireGeo, wireMat);
  planetGroup.add(wireMesh);

  // D. Fibonacci Particle Cloud Matrix: Radius 1.93
  const particleCount = 1600;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);

  const radius = 1.93;
  const colorGrey = new THREE.Color(0x666666);
  const colorRed = new THREE.Color(0xE10600);
  const colorBrightRed = new THREE.Color(0xFF3B30);
  const colorWhite = new THREE.Color(0xF5F5F5);

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
    let pColor = colorGrey;

    if (rand < 0.10) {
      pColor = colorRed;
    } else if (rand < 0.14) {
      pColor = colorBrightRed;
    } else if (rand < 0.32) {
      pColor = colorWhite;
    }

    colors[i * 3] = pColor.r;
    colors[i * 3 + 1] = pColor.g;
    colors[i * 3 + 2] = pColor.b;
  }

  const pointsGeo = new THREE.BufferGeometry();
  pointsGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  pointsGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const pointsMat = new THREE.PointsMaterial({
    size: 0.038,
    vertexColors: true,
    transparent: true,
    opacity: 0.88,
  });

  const pointsMesh = new THREE.Points(pointsGeo, pointsMat);
  planetGroup.add(pointsMesh);

  // E. Primary Red Orbital Line Ring: Radius 2.5
  const ring1Geo = new THREE.BufferGeometry();
  const ring1Segs = 96;
  const ring1Pos = new Float32Array((ring1Segs + 1) * 3);
  const ring1Radius = 2.5;

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
  ring1Line.rotation.x = Math.PI / 2.8;
  ring1Line.rotation.y = Math.PI / 7;
  planetGroup.add(ring1Line);

  // F. Secondary Translucent White Inner Orbital Line Ring: Radius 2.25
  const ring2Geo = new THREE.BufferGeometry();
  const ring2Segs = 80;
  const ring2Pos = new Float32Array((ring2Segs + 1) * 3);
  const ring2Radius = 2.25;

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
    opacity: 0.2,
  });

  const ring2Line = new THREE.Line(ring2Geo, ring2Mat);
  ring2Line.rotation.x = -Math.PI / 3.2;
  ring2Line.rotation.y = -Math.PI / 5;
  planetGroup.add(ring2Line);

  // G. Orbiting Micro-Satellites / Red Tech Nodes
  const satelliteGroup = new THREE.Group();
  planetGroup.add(satelliteGroup);

  const satCount = 4;
  const satMeshes = [];

  for (let s = 0; s < satCount; s++) {
    const satGeo = new THREE.BoxGeometry(0.06, 0.06, 0.06);
    const satMat = new THREE.MeshBasicMaterial({
      color: s === 0 ? 0xFF2A23 : 0xE10600,
    });
    const satMesh = new THREE.Mesh(satGeo, satMat);
    satMesh.userData = {
      angle: (s / satCount) * Math.PI * 2,
      orbitRadius: 2.5,
      speed: 0.006 + s * 0.002,
    };
    satelliteGroup.add(satMesh);
    satMeshes.push(satMesh);
  }

  // Initial planet tilt
  planetGroup.rotation.x = 0.22;
  planetGroup.rotation.z = -0.12;

  // Interaction State (Pointer drag & tilt inertia)
  let mouseX = 0;
  let mouseY = 0;
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  let dragVelocity = { x: 0, y: 0 };

  function onDocumentMouseMove(event) {
    if (isDragging) return;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    mouseX = (event.clientX - windowHalfX) * 0.0002;
    mouseY = (event.clientY - windowHalfY) * 0.0002;
  }

  function onPointerDown(event) {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX || (event.touches && event.touches[0].clientX) || 0,
      y: event.clientY || (event.touches && event.touches[0].clientY) || 0,
    };
  }

  function onPointerMove(event) {
    if (!isDragging) return;

    const currentX = event.clientX || (event.touches && event.touches[0].clientX) || 0;
    const currentY = event.clientY || (event.touches && event.touches[0].clientY) || 0;

    const deltaX = currentX - previousMousePosition.x;
    const deltaY = currentY - previousMousePosition.y;

    dragVelocity.x = deltaX * 0.004;
    dragVelocity.y = deltaY * 0.004;

    planetGroup.rotation.y += dragVelocity.x;
    planetGroup.rotation.x += dragVelocity.y;

    previousMousePosition = { x: currentX, y: currentY };
  }

  function onPointerUp() {
    isDragging = false;
  }

  window.addEventListener('mousemove', onDocumentMouseMove, { passive: true });
  container.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  container.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  function onWindowResize() {
    if (!container) return;
    const newWidth = container.clientWidth || 320;
    const newHeight = container.clientHeight || 320;

    camera.aspect = newWidth / newHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(newWidth, newHeight);
  }

  window.addEventListener('resize', onWindowResize);

  // Render Loop & Layered Rotation Dynamics
  let isAnimating = true;
  let clockTime = 0;

  function animate() {
    if (!isAnimating) return;

    requestAnimationFrame(animate);

    clockTime += 0.016;

    // Layered independent rotations for enhanced 3D visual depth
    coreMesh.rotation.y += 0.001;
    wireMesh.rotation.y += 0.0015;
    pointsMesh.rotation.y -= 0.0008;
    ring1Line.rotation.z += 0.0005;
    ring2Line.rotation.z -= 0.0004;

    // Animate Orbiting Micro-Satellites
    satMeshes.forEach((sat) => {
      sat.userData.angle += sat.userData.speed;
      const a = sat.userData.angle;
      const r = sat.userData.orbitRadius;
      sat.position.x = r * Math.cos(a);
      sat.position.y = r * Math.sin(a);
      sat.position.z = Math.sin(a * 2) * 0.3;
    });

    // Subtle scale pulse (Breathing motion)
    const scaleFactor = 1 + Math.sin(clockTime * 1.5) * 0.012;
    planetGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    if (!isDragging) {
      planetGroup.rotation.y += 0.0012;

      dragVelocity.x *= 0.92;
      dragVelocity.y *= 0.92;
      planetGroup.rotation.y += dragVelocity.x;
      planetGroup.rotation.x += dragVelocity.y;

      planetGroup.rotation.y += (mouseX - planetGroup.rotation.y * 0.03) * 0.012;
    }

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
