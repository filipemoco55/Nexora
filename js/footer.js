/**
 * Footer Component (Vanilla JavaScript)
 */

export function initFooter() {
  const footerContainer = document.getElementById('footer-container');
  if (!footerContainer) return;

  const currentYear = new Date().getFullYear();

  const html = `
    <footer class="footer-wrapper">
      <div class="container">
        <div class="footer-grid">
          <!-- Brand Column -->
          <div class="footer-brand-col">
            <a href="index.html" class="footer-brand">
              <div class="footer-brand-icon">
                <i data-lucide="cpu" style="width: 20px; height: 20px;"></i>
              </div>
              <span class="footer-brand-title">NEXORA DIGITAL</span>
            </a>
            
            <p class="footer-slogan">“Tecnologia que faz o seu negócio avançar.”</p>
            <p class="footer-desc">Soluções tecnológicas desenhadas para impulsionar a eficiência e o crescimento real da sua empresa.</p>

            <div class="footer-badge-item">
              <span class="badge badge-purple badge-sm">
                <span class="badge-pulse-dot"></span>
                <span>Engenharia Web & IA</span>
              </span>
            </div>
          </div>

          <!-- Nav Links Column -->
          <div class="footer-col">
            <h4 class="footer-heading">Navegação</h4>
            <ul class="footer-links">
              <li><a href="index.html" class="footer-link">Início</a></li>
              <li><a href="servicos.html" class="footer-link">Serviços</a></li>
              <li><a href="precos.html" class="footer-link">Preços</a></li>
              <li><a href="portfolio.html" class="footer-link">Portfólio</a></li>
              <li><a href="sobre.html" class="footer-link">Sobre nós</a></li>
              <li><a href="contacto.html" class="footer-link">Contacto</a></li>
            </ul>
          </div>

          <!-- Legal & Portal Column -->
          <div class="footer-col">
            <h4 class="footer-heading">Plataforma</h4>
            <ul class="footer-links">
              <li><a href="login.html" class="footer-link">Área de Cliente</a></li>
              <li><a href="privacidade.html" class="footer-link">Política de Privacidade</a></li>
              <li><a href="termos.html" class="footer-link">Termos e Condições</a></li>
            </ul>
          </div>

          <!-- Contact Column -->
          <div class="footer-col">
            <h4 class="footer-heading">Contacto</h4>
            <div class="footer-contact-list">
              <a href="mailto:contacto@nexoradigital.pt" class="contact-item">
                <i data-lucide="mail" class="contact-icon" style="width: 16px; height: 16px;"></i>
                <span>contacto@nexoradigital.pt</span>
              </a>
              <div class="contact-item">
                <i data-lucide="map-pin" class="contact-icon" style="width: 16px; height: 16px;"></i>
                <span>Portugal</span>
              </div>
              <div class="portal-preview-cta">
                <a href="login.html" class="portal-preview-link">
                  <span>Aceder ao Portal do Cliente</span>
                  <i data-lucide="arrow-up-right" style="width: 14px; height: 14px;"></i>
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Bar -->
        <div class="footer-bottom">
          <p class="copyright-text">&copy; ${currentYear} Nexora Digital. Todos os direitos reservados.</p>
          <div class="footer-meta-tags">
            <span>HTML5 + Vanilla JS + Vite Architecture</span>
            <span class="dot-divider">•</span>
            <span>Modular Design Tokens</span>
          </div>
        </div>
      </div>
    </footer>
  `;

  footerContainer.innerHTML = html;
}
