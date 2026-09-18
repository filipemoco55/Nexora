/**
 * Navbar Component & Controller (Vanilla JavaScript)
 * Fixed class attribute & visual flex alignment
 */

export function initNavbar() {
  const headerContainer = document.getElementById('navbar-container');
  if (!headerContainer) return;

  const currentPath = window.location.pathname.replace(/^\//, '') || 'index.html';

  const navLinks = [
    { name: 'Início', href: 'index.html' },
    { name: 'Serviços', href: 'servicos.html' },
    { name: 'Preços', href: 'precos.html' },
    { name: 'Portfólio', href: 'portfolio.html' },
    { name: 'Sobre', href: 'sobre.html' },
    { name: 'Contacto', href: 'contacto.html' },
  ];

  const html = `
    <header class="navbar-header" id="navbar-header">
      <div class="navbar-container">
        <!-- Zone 1: Left Brand Logo -->
        <a href="index.html" class="navbar-brand" aria-label="Página Inicial Nexora Digital">
          <div class="brand-icon-box">
            <svg class="brand-logo-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 24V8L21 24V8" stroke="#F5F5F5" stroke-width="2.8" stroke-linecap="square" stroke-linejoin="miter"/>
              <path d="M21 8L25 12V24" stroke="#E10600" stroke-width="2.8" stroke-linecap="square"/>
            </svg>
          </div>
          <div class="brand-text">
            <span class="brand-name">NEXORA</span>
            <span class="brand-tag">DIGITAL</span>
          </div>
        </a>

        <!-- Zone 2: Center Navigation Links (Desktop) -->
        <nav class="navbar-nav-desktop" aria-label="Navegação Principal">
          ${navLinks
            .map((link) => {
              const isActive =
                currentPath === link.href ||
                (currentPath === '' && link.href === 'index.html') ||
                (currentPath === '/' && link.href === 'index.html');
              return `<a href="${link.href}" class="nav-link ${isActive ? 'nav-link-active' : ''}">${link.name}</a>`;
            })
            .join('')}
        </nav>

        <!-- Zone 3: Right Action CTAs -->
        <div class="navbar-actions">
          <a href="login.html" class="btn btn-ghost btn-sm btn-client-area-link">
            <i data-lucide="user-check" style="width: 16px; height: 16px;"></i>
            <span>Área de Cliente</span>
          </a>

          <a href="contacto.html" class="btn btn-primary btn-sm btn-quote-link">
            <span>Pedir Orçamento</span>
            <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
          </a>

          <!-- Mobile Hamburger Toggle -->
          <button type="button" class="mobile-toggle-btn" id="mobile-toggle-btn" aria-label="Abrir menu" aria-expanded="false">
            <i data-lucide="menu" id="hamburger-icon"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Navigation Drawer Overlay -->
      <div class="mobile-drawer" id="mobile-drawer">
        <nav class="mobile-nav-list" aria-label="Navegação Mobile">
          ${navLinks
            .map((link) => {
              const isActive = currentPath === link.href;
              return `<a href="${link.href}" class="mobile-nav-item ${isActive ? 'mobile-nav-item-active' : ''}">${link.name}</a>`;
            })
            .join('')}
          <div class="mobile-drawer-cta">
            <a href="login.html" class="btn btn-outline btn-full-width">
              <i data-lucide="user-check" style="width: 16px; height: 16px;"></i>
              <span>Área de Cliente</span>
            </a>
            <a href="contacto.html" class="btn btn-primary btn-full-width">
              <span>Pedir Orçamento</span>
              <i data-lucide="arrow-right" style="width: 16px; height: 16px;"></i>
            </a>
          </div>
        </nav>
      </div>
    </header>
  `;

  headerContainer.innerHTML = html;

  // Header Scroll background glass effect
  const navbarHeader = document.getElementById('navbar-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 15) {
      navbarHeader?.classList.add('navbar-scrolled');
    } else {
      navbarHeader?.classList.remove('navbar-scrolled');
    }
  });

  // Mobile Drawer toggle logic
  const toggleBtn = document.getElementById('mobile-toggle-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');

  toggleBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const isExpanded = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!isExpanded));
    mobileDrawer?.classList.toggle('active');
  });

  // Close mobile drawer when clicking a link or pressing ESC
  mobileDrawer?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      toggleBtn?.setAttribute('aria-expanded', 'false');
      mobileDrawer?.classList.remove('active');
    });
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      toggleBtn?.setAttribute('aria-expanded', 'false');
      mobileDrawer?.classList.remove('active');
    }
  });
}
