/**
 * Main Application Script (Vanilla JavaScript + Vite)
 */

import { createIcons, icons } from 'lucide';
import { initNavbar } from './navbar.js';
import { initFooter } from './footer.js';
import { initModals } from './modal.js';
import { initPortfolio } from './portfolio.js';
import { initContactForm } from './contact.js';
import { initLogin } from './login.js';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject Navigation & Footer
  initNavbar();
  initFooter();

  // 2. Initialize Modals & Forms
  initModals();
  initPortfolio();
  initContactForm();
  initLogin();

  // 3. Render Lucide SVG Icons for all <i data-lucide="..."></i> elements
  createIcons({ icons });

  // 4. Interactive Platform Preview Tabs on Home Page
  initHomePlatformTabs();
});

function initHomePlatformTabs() {
  const tabBtns = document.querySelectorAll('.platform-tab-btn');
  const displayTitle = document.getElementById('tab-display-title');
  const displayDesc = document.getElementById('tab-display-desc');
  const mockBadge = document.getElementById('mock-card-badge');
  const mockTitle = document.getElementById('mock-card-title');
  const mockStatus = document.getElementById('mock-card-status');
  const mockFill = document.getElementById('mock-progress-fill');
  const mockPercent = document.getElementById('mock-progress-percent');

  if (!tabBtns.length) return;

  const tabData = {
    projects: {
      title: 'Acompanhamento do Projeto em Tempo Real',
      desc: 'Veja o progresso de cada sprint, datas de entrega, tarefas concluídas e revisões sem necessidade de emails longos.',
      badge: 'Em progresso',
      cardTitle: 'PRJ-001 • Portal Web Nexora',
      status: 'Fase de Testes & Ajustes UI',
      progress: 75,
    },
    requests: {
      title: 'Submissão de Novos Pedidos',
      desc: 'Formulário interativo onde pode solicitar novas funcionalidades, alterações no sistema ou orçamentos adicionais.',
      badge: 'Pendente de validação',
      cardTitle: 'REQ-014 • Módulo de Notificações WhatsApp',
      status: 'A aguardar análise técnica',
      progress: 10,
    },
    proposals: {
      title: 'Propostas & Orçamentos Transparentes',
      desc: 'Consulte orçamentos detalhados com discriminação por fases, custos claros e aprovação digital num único clique.',
      badge: 'Aprovado',
      cardTitle: 'PROP-2026 • Integração com Agente de IA',
      status: 'Proposta aceite em 14 Setembro',
      progress: 100,
    },
    invoices: {
      title: 'Faturação & Subscrições',
      desc: 'Aceda a todas as faturas emitidas, recibos e estados de subscrição de suporte técnico de forma centralizada.',
      badge: 'Liquidado',
      cardTitle: 'FAT-2026/049 • Manutenção Mensal & Hosting',
      status: 'Emitida & Paga',
      progress: 100,
    },
    messages: {
      title: 'Centro de Comunicação Direto',
      desc: 'Mensagens diretas com os fundadores e equipa de desenvolvimento com notificações instantâneas.',
      badge: 'Nova Mensagem',
      cardTitle: 'Suporte Técnico Nexora',
      status: '“A nova funcionalidade de automação foi lançada com sucesso.”',
      progress: 50,
    },
  };

  tabBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      tabBtns.forEach((b) => b.classList.remove('tab-active'));
      btn.classList.add('tab-active');

      const tabId = btn.getAttribute('data-tab');
      const data = tabData[tabId];
      if (!data) return;

      if (displayTitle) displayTitle.textContent = data.title;
      if (displayDesc) displayDesc.textContent = data.desc;
      if (mockBadge) mockBadge.textContent = data.badge;
      if (mockTitle) mockTitle.textContent = data.cardTitle;
      if (mockStatus) mockStatus.textContent = data.status;
      if (mockPercent) mockPercent.textContent = `${data.progress}%`;
      if (mockFill) mockFill.style.width = `${data.progress}%`;
    });
  });
}
