/**
 * Homepage Script - Nexora Digital (Vanilla JS ES Module)
 * Cosmos-inspired Editorial Architecture: Splash Intro, 3D WebGL Tech Planet, Projects Carousel, and Bi-Directional Animations.
 */

import { initHeroPlanet } from './planet.js';
import { initProjectsCarousel } from './carousel.js';

export function initHomePage() {
  initBrandIntro();
  initBiDirectionalObserver();
  initHeroPlanet('hero-planet-canvas');
  initProjectsCarousel();
}

/**
 * 1. Brand Splash Intro Controller (~0.9s duration)
 * Saved in sessionStorage (nexoraIntroSeen). Bypassed on page refresh or reduced motion.
 */
function initBrandIntro() {
  const introEl = document.getElementById('nexora-intro');
  if (!introEl) return;

  const hasSeenIntro = sessionStorage.getItem('nexoraIntroSeen');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (hasSeenIntro || prefersReducedMotion) {
    introEl.style.display = 'none';
    document.body.classList.remove('intro-active');
    if (prefersReducedMotion) {
      sessionStorage.setItem('nexoraIntroSeen', 'true');
    }
    return;
  }

  // Lock document scroll during splash sequence
  document.body.classList.add('intro-active');

  // Animation timeline (~0.9s)
  setTimeout(() => {
    introEl.classList.add('phase-logo-in');
  }, 80);

  setTimeout(() => {
    introEl.classList.add('phase-line-in');
  }, 300);

  setTimeout(() => {
    introEl.classList.add('phase-fade-out');
  }, 750);

  setTimeout(() => {
    introEl.style.display = 'none';
    document.body.classList.remove('intro-active');
    sessionStorage.setItem('nexoraIntroSeen', 'true');
  }, 950);
}

/**
 * 2. Bi-Directional Viewport Scroll Observer
 * Adds .is-visible when entering viewport, REMOVES .is-visible when exiting.
 * Repeats every time user scrolls up or down.
 */
function initBiDirectionalObserver() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.15,
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, observerOptions);

  revealElements.forEach((el) => observer.observe(el));
}
