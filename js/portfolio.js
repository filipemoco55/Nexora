/**
 * Portfolio Filtering & Modal Details (Vanilla JavaScript)
 */

import { openModal } from './modal.js';

export function initPortfolio() {
  const filterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const projectCards = document.querySelectorAll('.portfolio-card-item');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('filter-active'));
      btn.classList.add('filter-active');

      const filterCategory = btn.getAttribute('data-filter');

      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute('data-category');
        if (filterCategory === 'Todos' || cardCategory === filterCategory) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // Modal Detail View Trigger
  const detailBtns = document.querySelectorAll('[data-open-demo]');
  detailBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-title');
      const category = btn.getAttribute('data-category');
      const tag = btn.getAttribute('data-tag');
      const desc = btn.getAttribute('data-desc');

      const modalTitle = document.getElementById('demo-modal-title');
      const modalSubtitle = document.getElementById('demo-modal-subtitle');
      const modalDesc = document.getElementById('demo-modal-desc');

      if (modalTitle) modalTitle.textContent = title;
      if (modalSubtitle) modalSubtitle.textContent = `${category} • ${tag}`;
      if (modalDesc) modalDesc.textContent = desc;

      openModal('demo-detail-modal');
    });
  });
}
