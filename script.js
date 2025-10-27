// script.js
document.addEventListener('DOMContentLoaded', () => {

  // -----------------------
  // Utility helpers
  // -----------------------
  function showError(el, msg) {
    if (!el) return;
    el.classList.add('is-invalid');
    const id = el.id + 'Error';
    const err = document.getElementById(id);
    if (err) err.textContent = msg;
  }
  function clearError(el) {
    if (!el) return;
    el.classList.remove('is-invalid');
    const id = el.id + 'Error';
    const err = document.getElementById(id);
    if (err) err.textContent = '';
  }

  // Move focus to first invalid input
  function focusFirstInvalid(form) {
    const first = form.querySelector('.is-invalid, :invalid');
    if (first) first.focus();
  }

  // -----------------------
  // Registration form
  // -----------------------
  const regForm = document.getElementById('registrationForm');
  if (regForm) {
    regForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Clear old states
      [...regForm.querySelectorAll('.is-invalid')].forEach(el => el.classList.remove('is-invalid'));
      let valid = true;

      const fullName = regForm.fullName;
      const email = regForm.email;
      const phone = regForm.phone;
      const program = regForm.program;
      const intake = regForm.intake;
      const pwd = regForm.password;
      const cpwd = regForm.confirmPassword;
      const terms = regForm.terms;
      const honeypot = regForm.website; // hidden honeypot

      if (honeypot && honeypot.value.trim() !== '') {
        document.getElementById('registrationResult').innerHTML = '<div class="alert alert-danger">Обнаружена подозрительная активность.</div>';
        return;
      }

      if (!fullName.value.trim() || fullName.value.trim().length < 2) { showError(fullName, 'Введите ФИО (не менее 2 символов).'); valid = false; } else clearError(fullName);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, 'Введите корректный email.'); valid = false; } else clearError(email);
      if (!/^\+?[0-9\s\-\(\)]{7,20}$/.test(phone.value)) { showError(phone, 'Введите корректный телефон.'); valid = false; } else clearError(phone);
      if (!program.value) { showError(program, 'Выберите программу.'); valid = false; } else clearError(program);
      if (!intake.value) { showError(intake, 'Выберите дату набора.'); valid = false; } else clearError(intake);

      if (!pwd.value || pwd.value.length < 8) { showError(pwd, 'Пароль минимум 8 символов.'); valid = false; } else clearError(pwd);
      if (pwd.value !== cpwd.value) { showError(cpwd, 'Пароли не совпадают.'); valid = false; } else clearError(cpwd);

      const mode = regForm.querySelector('input[name="mode"]:checked');
      if (!mode) {
        const modeError = document.getElementById('modeError');
        if (modeError) modeError.textContent = 'Выберите форму обучения.';
        valid = false;
      } else {
        const modeError = document.getElementById('modeError');
        if (modeError) modeError.textContent = '';
      }

      if (!terms.checked) {
        const termsError = document.getElementById('termsError');
        if (termsError) termsError.textContent = 'Необходимо принять политику.';
        valid = false;
      } else {
        const termsError = document.getElementById('termsError');
        if (termsError) termsError.textContent = '';
      }

      if (!valid) {
        focusFirstInvalid(regForm);
        return;
      }

      // Show confirmation (no backend)
      const res = document.getElementById('registrationResult');
      res.innerHTML = `<div class="alert alert-success">Спасибо, <strong>${fullName.value}</strong>! Ваша заявка на программу <strong>${program.options[program.selectedIndex].text}</strong> принята. Мы свяжемся по адресу <strong>${email.value}</strong>.</div>`;
      regForm.reset();
      regForm.querySelector('button[type="submit"]').focus();
    });
  }

  // -----------------------
  // Contact form
  // -----------------------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      [...contactForm.querySelectorAll('.is-invalid')].forEach(el => el.classList.remove('is-invalid'));
      let valid = true;

      const name = contactForm.contactName;
      const email = contactForm.contactEmail;
      const subject = contactForm.contactSubject;
      const message = contactForm.contactMessage;
      const anti = contactForm.antiSpam;
      const honeypot = contactForm.contact_ref;

      if (honeypot && honeypot.value.trim() !== '') {
        document.getElementById('contactResult').innerHTML = '<div class="alert alert-danger">Обнаружена подозрительная активность.</div>';
        return;
      }

      if (!name.value.trim()) { showError(name, 'Укажите имя.'); valid = false; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) { showError(email, 'Введите корректный email.'); valid = false; }
      if (!subject.value.trim()) { showError(subject, 'Укажите тему сообщения.'); valid = false; }
      if (!message.value.trim()) { showError(message, 'Напишите сообщение.'); valid = false; }
      if (String(anti.value).trim() !== '7') { showError(anti, 'Неверный ответ на простую задачу.'); valid = false; }

      if (!valid) {
        focusFirstInvalid(contactForm);
        return;
      }

      document.getElementById('contactResult').innerHTML = `<div class="alert alert-success">Спасибо, ${name.value.trim()}! Ваше сообщение отправлено. Мы ответим на ${email.value}.</div>`;
      contactForm.reset();
      contactForm.querySelector('button[type="submit"]').focus();
    });
  }

  // -----------------------
  // Program filter (extra interaction)
  // -----------------------
  const pf = document.getElementById('programFilter');
  if (pf) {
    pf.addEventListener('change', (e) => {
      const val = e.target.value;
      document.querySelectorAll('.program-card').forEach(card => {
        if (!val || card.dataset.category === val) {
          card.classList.remove('d-none');
        } else {
          card.classList.add('d-none');
        }
      });
    });
  }

  // -----------------------
  // Small enhancement: visible focus for collapsed navbar links when opened via keyboard
  // -----------------------
  const navbarToggler = document.querySelector('.navbar-toggler');
  if (navbarToggler) {
    navbarToggler.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        navbarToggler.click();
      }
    });
  }

  // -----------------------
  // Progressive FAQ: (Bootstrap accordion is usable without JS but this ensures aria-expanded toggles if needed)
  // -----------------------
  // No extra code required — Bootstrap's accordion handles accessible toggling.

});
