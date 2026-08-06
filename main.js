/**
 * Psychosomatyka w Praktyce - Main Interactive Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const header = document.getElementById('site-header');
  const mobileToggle = document.getElementById('mobile-toggle');
  const mainNav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');
  const contactForm = document.getElementById('contact-form');
  const serviceSelect = document.getElementById('service');
  const selectServiceBtns = document.querySelectorAll('.select-service-btn');
  const toastNotification = document.getElementById('toast-notification');
  const toastClose = document.getElementById('toast-close');
  const toastTitle = document.getElementById('toast-title');
  const toastMessage = document.getElementById('toast-message');

  /* ------------------------------------------------------------------------
     1. Sticky Header Scroll Effect
     ------------------------------------------------------------------------ */
  const handleScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  /* ------------------------------------------------------------------------
     2. Mobile Hamburger Navigation
     ------------------------------------------------------------------------ */
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
      mobileToggle.setAttribute('aria-expanded', !isExpanded);
      mobileToggle.classList.toggle('active');
      mainNav.classList.toggle('active');
    });

    // Close menu when clicking nav link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('active');
      });
    });
  }

  /* ------------------------------------------------------------------------
     3. Scroll Active Link Highlighting (IntersectionObserver)
     ------------------------------------------------------------------------ */
  const sections = document.querySelectorAll('section[id]');
  
  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));

  /* ------------------------------------------------------------------------
     4. Package Card CTA Selection (Pre-fill Select Input)
     ------------------------------------------------------------------------ */
  selectServiceBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const targetService = btn.getAttribute('data-service');
      if (targetService && serviceSelect) {
        // Find matching option or set value
        for (let i = 0; i < serviceSelect.options.length; i++) {
          if (serviceSelect.options[i].value.includes(targetService) || serviceSelect.options[i].text.includes(targetService)) {
            serviceSelect.selectedIndex = i;
            break;
          }
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     5. Contact Form Validation & Toast Notification
     ------------------------------------------------------------------------ */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      const serviceInput = document.getElementById('service');
      const messageInput = document.getElementById('message');
      const submitBtn = document.getElementById('submit-btn');
      const formFeedback = document.getElementById('form-feedback');

      // Simple HTML5 validity check
      if (!nameInput.value.trim() || !emailInput.value.trim() || !serviceInput.value || !messageInput.value.trim()) {
        showFormFeedback(formFeedback, 'Wypełnij wszystkie wymagane pola przed wysłaniem.', 'error');
        return;
      }

      // Simulate sending
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Wysyłanie...</span> <i class="fa-solid fa-spinner fa-spin"></i>`;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Wyślij zapytanie</span> <i class="fa-solid fa-paper-plane"></i>`;

        // Success state
        contactForm.reset();
        showFormFeedback(formFeedback, 'Dziękuję! Twoja wiadomość została wysłana. Odpowiem wkrótce.', 'success');
        showToast('Wiadomość wysłana!', 'Dziękuję za kontakt. Otrzymasz odpowiedź w ciągu 24h.');
      }, 1000);
    });
  }

  function showFormFeedback(el, msg, type) {
    if (!el) return;
    el.textContent = msg;
    el.className = `form-feedback ${type}`;
    setTimeout(() => {
      el.className = 'form-feedback';
    }, 6000);
  }

  function showToast(title, message) {
    if (!toastNotification) return;
    toastTitle.textContent = title;
    toastMessage.textContent = message;
    toastNotification.classList.add('active');
    toastNotification.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      closeToast();
    }, 5000);
  }

  function closeToast() {
    if (!toastNotification) return;
    toastNotification.classList.remove('active');
    toastNotification.setAttribute('aria-hidden', 'true');
  }

  if (toastClose) {
    toastClose.addEventListener('click', closeToast);
  }
});
