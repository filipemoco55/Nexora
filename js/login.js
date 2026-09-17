/**
 * Login / Client Portal Controller (Vanilla JavaScript)
 */

export function initLogin() {
  const loginForm = document.getElementById('login-form');
  const noticeBox = document.getElementById('auth-notice-box');
  const toggleBtn = document.getElementById('toggle-auth-mode-btn');
  const formTitle = document.getElementById('auth-form-title');
  const formSubtitle = document.getElementById('auth-form-subtitle');
  const submitBtn = document.getElementById('auth-submit-btn');

  if (!loginForm) return;

  let isRegisterMode = false;

  toggleBtn?.addEventListener('click', () => {
    isRegisterMode = !isRegisterMode;
    if (isRegisterMode) {
      if (formTitle) formTitle.textContent = 'Criar Conta no Portal';
      if (formSubtitle) formSubtitle.textContent = 'Registe os dados da sua empresa para iniciar a colaboração.';
      if (submitBtn) submitBtn.textContent = 'Criar Conta';
      toggleBtn.textContent = 'Fazer Login';
    } else {
      if (formTitle) formTitle.textContent = 'Aceder à Área de Cliente';
      if (formSubtitle) formSubtitle.textContent = 'Introduza as suas credenciais para aceder ao painel.';
      if (submitBtn) submitBtn.textContent = 'Entrar no Portal';
      toggleBtn.textContent = 'Criar nova conta';
    }
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    loginForm.style.display = 'none';
    if (noticeBox) noticeBox.style.display = 'flex';
  });

  const resetAuthBtn = document.getElementById('reset-auth-btn');
  resetAuthBtn?.addEventListener('click', () => {
    loginForm.style.display = 'flex';
    if (noticeBox) noticeBox.style.display = 'none';
  });
}
