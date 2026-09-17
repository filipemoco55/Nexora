/**
 * Contact Form Controller (Vanilla JavaScript)
 */

export function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  const successView = document.getElementById('contact-success-view');

  if (!contactForm) return;

  // Auto pre-fill selects based on URL query parameters
  const urlParams = new URLSearchParams(window.location.search);
  const serviceParam = urlParams.get('servico');
  const packageParam = urlParams.get('pacote');
  const planParam = urlParams.get('plano');

  const selectService = document.getElementById('select-service');
  const inputDescription = document.getElementById('input-description');

  if (packageParam && inputDescription) {
    inputDescription.value = `Tenho interesse no pacote comercial ${packageParam}.`;
  } else if (planParam && inputDescription) {
    if (selectService) selectService.value = 'Manutenção';
    inputDescription.value = `Tenho interesse no plano de manutenção ${planParam}.`;
  } else if (serviceParam && selectService) {
    // Match service value in dropdown
    const options = Array.from(selectService.options);
    const matchedOption = options.find((opt) => opt.value.toLowerCase().includes(serviceParam.toLowerCase()));
    if (matchedOption) selectService.value = matchedOption.value;
  }

  // Handle Form Submit
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('input-name');
    const emailInput = document.getElementById('input-email');

    const nameVal = nameInput ? nameInput.value : '';
    const emailVal = emailInput ? emailInput.value : '';

    const nameDisplay = document.getElementById('display-user-name');
    const emailDisplay = document.getElementById('display-user-email');

    if (nameDisplay) nameDisplay.textContent = nameVal;
    if (emailDisplay) emailDisplay.textContent = emailVal;

    contactForm.style.display = 'none';
    if (successView) successView.style.display = 'flex';
  });

  // Reset form trigger
  const resetBtn = document.getElementById('reset-contact-form-btn');
  resetBtn?.addEventListener('click', () => {
    contactForm.reset();
    contactForm.style.display = 'flex';
    if (successView) successView.style.display = 'none';
  });
}
