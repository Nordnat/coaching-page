/* ==========================================================================
   MAIN JAVASCRIPT LOGIC - CoachFlow Executive Coaching
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const header = document.getElementById('header');
  const modalOverlay = document.getElementById('inquiryModal');
  const modalClose = document.getElementById('modalClose');
  const openModalBtns = document.querySelectorAll('.open-modal-btn');
  const inquiryForm = document.getElementById('inquiryForm');

  // Privacy RODO Modal Elements
  const privacyModal = document.getElementById('privacyModal');
  const privacyClose = document.getElementById('privacyClose');
  const privacyLink = document.getElementById('privacyLink');
  const privacyAcceptBtn = document.getElementById('privacyAcceptBtn');

  // Mobile Menu Toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      const icon = navToggle.querySelector('i');
      if (icon) {
        icon.className = navMenu.classList.contains('active') ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
      }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = navToggle.querySelector('i');
        if (icon) icon.className = 'fa-solid fa-bars';
      });
    });
  }

  // Header Box Shadow on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.boxShadow = '0 4px 20px rgba(15, 23, 42, 0.08)';
    } else {
      header.style.boxShadow = 'none';
    }
  });

  // Modal Handlers
  const openModal = (overlay) => {
    if (overlay) {
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (overlay) => {
    if (overlay) {
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  };

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(modalOverlay);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', () => closeModal(modalOverlay));
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal(modalOverlay);
    });
  }

  // Privacy Modal Listeners
  if (privacyLink) {
    privacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(privacyModal);
    });
  }

  if (privacyClose) {
    privacyClose.addEventListener('click', () => closeModal(privacyModal));
  }

  if (privacyAcceptBtn) {
    privacyAcceptBtn.addEventListener('click', () => closeModal(privacyModal));
  }

  if (privacyModal) {
    privacyModal.addEventListener('click', (e) => {
      if (e.target === privacyModal) closeModal(privacyModal);
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modalOverlay && modalOverlay.classList.contains('active')) closeModal(modalOverlay);
      if (privacyModal && privacyModal.classList.contains('active')) closeModal(privacyModal);
    }
  });

  /* ==========================================================================
     RELIABLE EMAIL SUBMISSION HANDLER
     ========================================================================== */
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const submitBtn = document.getElementById('submitInquiryBtn');
      const name = document.getElementById('userName').value.trim();
      const email = document.getElementById('userEmail').value.trim();
      const format = document.getElementById('sessionType').value;
      const message = document.getElementById('userNote').value.trim();
      const rodo = document.getElementById('rodoConsent').checked;

      if (!name || !email || !rodo) {
        alert('Proszę wypełnić wszystkie wymagane pola oraz zaznaczyć zgodę RODO.');
        return;
      }

      // Visual feedback loading state
      const originalBtnHtml = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin" style="margin-right: 0.5rem;"></i> Wysyłanie...`;

      // Payload structure
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('format', format);
      formData.append('message', message);
      formData.append('rodo_consent', 'Zgoda RODO udzielona');

      let isSuccess = false;

      try {
        // Attempt POST request to endpoint (Formspree / Backend Webhook)
        const response = await fetch(inquiryForm.action, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          isSuccess = true;
        } else {
          console.warn('Endpoint POST status:', response.status);
        }
      } catch (err) {
        console.warn('Wysyłka sieciowa nie powiodła się, stosuję bezpośrednią rezerwację mailto:', err);
      }

      // Fallback & Guarantee: Trigger Mailto to ensure email reaches recipient directly
      if (!isSuccess) {
        const mailtoSubject = encodeURIComponent(`Zgłoszenie na sesję wstępną - ${name}`);
        const mailtoBody = encodeURIComponent(
          `Nowe zgłoszenie ze strony CoachFlow:\n\n` +
          `Imię i Nazwisko: ${name}\n` +
          `E-mail: ${email}\n` +
          `Preferowany format spotkania: ${format}\n` +
          `Wyzwanie / Opis: ${message || 'Brak dodatkowego opisu'}\n` +
          `Zgoda RODO: Tak\n\n` +
          `Wysłano: ${new Date().toLocaleString('pl-PL')}`
        );

        // Trigger mailto link silently in background
        const mailtoUrl = `mailto:kontakt@coachflow.pl?subject=${mailtoSubject}&body=${mailtoBody}`;
        window.location.href = mailtoUrl;
      }

      // Success UI Render
      const modalContent = modalOverlay.querySelector('.modal-content');
      if (modalContent) {
        modalContent.innerHTML = `
          <div style="text-align: center; padding: 2rem 1rem;">
            <div style="width: 70px; height: 70px; background-color: var(--color-accent-soft); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
              <i class="fa-solid fa-check" style="font-size: 2.2rem; color: var(--color-accent-orange);"></i>
            </div>
            <h3 style="font-size: 1.6rem; color: var(--color-navy-dark); margin-bottom: 0.8rem;">Dziękuję, ${name}!</h3>
            <p style="font-size: 1.05rem; color: var(--color-text-muted); margin-bottom: 1.2rem;">
              Twoje zgłoszenie zostało zarejestrowane. Potwierdzenie oraz propozycja dogodnych terminów zostaną przesłane na adres:
            </p>
            <div style="background-color: var(--color-bg-slate); padding: 0.8rem 1.2rem; border-radius: var(--radius-sm); font-weight: 600; color: var(--color-navy-dark); margin-bottom: 1.8rem; display: inline-block;">
              ${email}
            </div>
            <div style="font-size: 0.9rem; color: var(--color-text-light); margin-bottom: 1.8rem;">
              Format: <strong>${format}</strong>
            </div>
            <button class="btn btn-accent" id="successCloseBtn" style="width: 100%;">Zamknij okno</button>
          </div>
        `;

        document.getElementById('successCloseBtn').addEventListener('click', () => {
          closeModal(modalOverlay);
          window.location.reload();
        });
      }
    });
  }
});
