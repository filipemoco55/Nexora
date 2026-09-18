/**
 * Horizontal Projects Carousel Module - Nexora Digital (Vanilla JS ES Module)
 * Supports mouse drag, touch swipe, keyboard navigation, prev/next arrows, and pagination dots.
 */

export function initProjectsCarousel() {
  const wrapper = document.querySelector('.projects-carousel-wrapper');
  const track = document.querySelector('.projects-carousel-track');
  const slides = document.querySelectorAll('.project-carousel-slide');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const dots = document.querySelectorAll('.carousel-indicator-dot');

  if (!wrapper || !track || !slides.length) return;

  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;

  function updateCarousel() {
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 24; // var(--space-6) gap
    currentTranslate = -currentIndex * (slideWidth + gap);
    prevTranslate = currentTranslate;

    track.style.transform = `translateX(${currentTranslate}px)`;

    // Update dots
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update button states
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex === slides.length - 1;
  }

  function goToSlide(index) {
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    currentIndex = index;
    updateCarousel();
  }

  // Prev / Next Button Listeners
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      goToSlide(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      goToSlide(currentIndex + 1);
    });
  }

  // Dots Listeners
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      goToSlide(index);
    });
  });

  // Touch Swipe Handlers
  function onPointerDown(e) {
    isDragging = true;
    startX = getPositionX(e);
    track.style.transition = 'none';
    wrapper.classList.add('is-dragging');
  }

  function onPointerMove(e) {
    if (!isDragging) return;
    const currentPosition = getPositionX(e);
    const diff = currentPosition - startX;
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 24;
    const currentOffset = -currentIndex * (slideWidth + gap);

    currentTranslate = currentOffset + diff;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }

  function onPointerUp(e) {
    if (!isDragging) return;
    isDragging = false;
    wrapper.classList.remove('is-dragging');
    track.style.transition = 'transform 450ms cubic-bezier(0.16, 1, 0.3, 1)';

    const movedBy = currentTranslate - prevTranslate;

    if (movedBy < -60 && currentIndex < slides.length - 1) {
      currentIndex += 1;
    } else if (movedBy > 60 && currentIndex > 0) {
      currentIndex -= 1;
    }

    updateCarousel();
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  // Touch & Mouse Events
  track.addEventListener('mousedown', onPointerDown);
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', onPointerUp);

  track.addEventListener('touchstart', onPointerDown, { passive: true });
  window.addEventListener('touchmove', onPointerMove, { passive: true });
  window.addEventListener('touchend', onPointerUp);

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    const rect = wrapper.getBoundingClientRect();
    const isVisible = rect.top >= 0 && rect.bottom <= window.innerHeight;

    if (!isVisible) return;

    if (e.key === 'ArrowLeft') {
      goToSlide(currentIndex - 1);
    } else if (e.key === 'ArrowRight') {
      goToSlide(currentIndex + 1);
    }
  });

  // Window Resize
  window.addEventListener('resize', updateCarousel);

  // Initial calculation
  updateCarousel();
}
