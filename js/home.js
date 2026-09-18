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

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    introEl.style.display = 'none';
    document.body.classList.remove('intro-active');
    return;
  }

  // Lock document scroll during 2.5s splash sequence
  document.body.classList.add('intro-active');
  introEl.style.display = 'flex';

  // Animation timeline (~2.5s duration)
  setTimeout(() => {
    introEl.classList.add('phase-logo-in');
  }, 150);

  setTimeout(() => {
    introEl.classList.add('phase-tagline-in');
  }, 600);

  setTimeout(() => {
    introEl.classList.add('phase-line-in');
  }, 1000);

  setTimeout(() => {
    introEl.classList.add('phase-fade-out');
  }, 2000);

  setTimeout(() => {
    introEl.style.display = 'none';
    document.body.classList.remove('intro-active');
  }, 2500);
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
