/**
 * ANNEX BD — Hand-Crafted Studio Front-End Controller
 * Domain: annexbd.tech
 * Zero Emojis | Respects Reduced Motion | No Gimmicks
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initFaqAccordion();
  initEstimator();
  initBookingModal();
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const closeBtn  = document.getElementById('mobile-nav-close');
  const drawer    = document.getElementById('mobile-nav-drawer');
  const links     = document.querySelectorAll('.mobile-nav-link');
  const pageRegions = [document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean);

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.inert = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('nav-open');
    pageRegions.forEach(region => { region.inert = true; });
    closeBtn?.focus();
  }

  function closeMenu(restoreFocus = true) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('nav-open');
    pageRegions.forEach(region => { region.inert = false; });
    if (restoreFocus) toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  links.forEach(link => link.addEventListener('click', () => closeMenu()));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (!drawer.classList.contains('is-open')) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeMenu();
      return;
    }
    if (e.key === 'Tab') {
      const focusable = [...drawer.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])')];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && (document.activeElement === first || !drawer.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !drawer.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* --------------------------------------------------------------------------
   2. Minimal FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const rows = document.querySelectorAll('.faq-row');

  rows.forEach(row => {
    const trigger = row.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isOpen = row.classList.contains('is-open');

      // Close all other rows
      rows.forEach(r => {
        r.classList.remove('is-open');
        const t = r.querySelector('.faq-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        row.classList.add('is-open');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Studio Project Estimator
   -------------------------------------------------------------------------- */
function initEstimator() {
  const serviceSelect  = document.getElementById('estimator-service');
  const scaleSelect    = document.getElementById('estimator-scale');
  const addons         = document.querySelectorAll('.estimator-addon');
  const timelineEl     = document.getElementById('estimator-timeline');
  const deliverablesEl = document.getElementById('estimator-deliverables');
  const bookBtn        = document.getElementById('estimator-book-btn');

  if (!serviceSelect || !scaleSelect) return;

  const catalog = {
    web_dev: {
      name: 'Website Development',
      scales: {
        starter: {
          timeline: '2–3 weeks',
          deliverables: [
            'Bespoke visual architecture & responsive design',
            'Full mobile optimization & Vercel edge deployment',
            'SEO schema hierarchy (Organization, LocalBusiness)',
            'Direct lead capture & WhatsApp integration'
          ]
        },
        growth: {
          timeline: '3–5 weeks',
          deliverables: [
            'Full e-commerce or institutional portal architecture',
            'Payment gateway integration (bKash, Nagad, Stripe, Card)',
            'Role-based permissions & automated receipts',
            'Performance caching & speed optimization'
          ]
        },
        enterprise: {
          timeline: '5–8 weeks',
          deliverables: [
            'Custom web application & database architecture',
            'Bespoke dashboard, reporting & API integration',
            'Security audit, compliance & multi-region CDN',
            'Dedicated hypercare support & onboarding'
          ]
        }
      }
    },
    meta_ads: {
      name: 'Meta Ads Support',
      scales: {
        starter: {
          timeline: '1 week setup + 30 days management',
          deliverables: [
            'Conversions API (CAPI) server-side tracking setup',
            'Audience research & campaign structure',
            'Weekly performance reporting'
          ]
        },
        growth: {
          timeline: '1 week setup + ongoing scale',
          deliverables: [
            'Full-funnel lead generation & retargeting framework',
            'Creative copy testing matrix',
            'Weekly ROAS optimization & ad budget management'
          ]
        },
        enterprise: {
          timeline: 'Immediate onboarding + dedicated management',
          deliverables: [
            'Omnichannel scaling (Meta + supporting acquisition)',
            'Dynamic product catalog ads & server telemetry',
            'Custom CRM automation & dedicated strategist'
          ]
        }
      }
    }
  };

  function update() {
    const serviceKey  = serviceSelect.value;
    const scaleKey    = scaleSelect.value;
    const serviceData = catalog[serviceKey] || catalog.web_dev;
    const scaleData   = serviceData.scales[scaleKey] || serviceData.scales.starter;

    const deliverables = [...scaleData.deliverables];

    addons.forEach(cb => {
      if (cb.checked) deliverables.push(cb.getAttribute('data-title'));
    });

    if (timelineEl)   timelineEl.textContent   = scaleData.timeline;

    if (deliverablesEl) {
      deliverablesEl.innerHTML = '';
      deliverables.forEach(item => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${item}</span>`;
        deliverablesEl.appendChild(li);
      });
    }
  }

  serviceSelect.addEventListener('change', update);
  scaleSelect.addEventListener('change', update);
  addons.forEach(cb => cb.addEventListener('change', update));

  // Initial render
  update();

  if (bookBtn) {
    bookBtn.addEventListener('click', () => {
      const modal       = document.getElementById('booking-modal');
      const notesInput  = document.getElementById('booking-notes');
      const serviceName = (catalog[serviceSelect.value] || catalog.web_dev).name;
      const scaleText   = scaleSelect.options[scaleSelect.selectedIndex].text;

      if (notesInput && timelineEl) {
        notesInput.value =
          `Selected Service: ${serviceName}\n` +
          `Scale: ${scaleText}\n` +
          `Timeline: ${timelineEl.textContent}`;
      }

      if (modal) openModal(modal);
    });
  }
}

/* --------------------------------------------------------------------------
   4. Booking Modal
   -------------------------------------------------------------------------- */
function openModal(modal) {
  modal._returnFocusTo = document.activeElement;
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  modal.inert = false;
  document.body.classList.add('nav-open');
  modal.querySelector('.modal-input, .modal-textarea')?.focus();
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  modal.inert = true;
  document.body.classList.remove('nav-open');
  if (modal._returnFocusTo instanceof HTMLElement) modal._returnFocusTo.focus();
}

function initBookingModal() {
  const modal       = document.getElementById('booking-modal');
  const openButtons = document.querySelectorAll('.open-booking-modal');
  const closeButton = document.getElementById('booking-modal-close');
  const form        = document.getElementById('booking-form');

  if (!modal) return;

  openButtons.forEach(btn => btn.addEventListener('click', () => openModal(modal)));
  if (closeButton) closeButton.addEventListener('click', () => closeModal(modal));

  // Click-outside to close
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal);
  });

  // Escape key
  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('is-open')) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeModal(modal);
      return;
    }

    if (e.key === 'Tab') {
      const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')]
        .filter(el => !el.hidden && el.getClientRects().length);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && (document.activeElement === first || !modal.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !modal.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    }
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.reportValidity()) return;

      const name  = document.getElementById('booking-name')?.value  || 'Client';
      const email = document.getElementById('booking-email')?.value || '';
      const notes = document.getElementById('booking-notes')?.value || '';

      const subject = encodeURIComponent(`Consultation Request: 20-Minute Call — ${name}`);
      const body    = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `Project Notes:\n${notes}\n\n` +
        `Submitted via annexbd.tech`
      );

      window.location.href = `mailto:support@annexbd.tech?subject=${subject}&body=${body}`;
      closeModal(modal);
    });
  }
}
