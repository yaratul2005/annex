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
  initScrollReveal();
});

/* --------------------------------------------------------------------------
   1. Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-nav-toggle');
  const closeBtn  = document.getElementById('mobile-nav-close');
  const drawer    = document.getElementById('mobile-nav-drawer');
  const links     = document.querySelectorAll('.mobile-nav-link');

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    toggleBtn.setAttribute('aria-expanded', 'true');
    document.body.classList.add('nav-open');
  }

  function closeMenu() {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    toggleBtn.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  links.forEach(link => link.addEventListener('click', closeMenu));

  // Close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeMenu();
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
  const priceRangeEl   = document.getElementById('estimator-price-range');
  const deliverablesEl = document.getElementById('estimator-deliverables');
  const bookBtn        = document.getElementById('estimator-book-btn');

  if (!serviceSelect || !scaleSelect) return;

  const catalog = {
    web_dev: {
      name: 'Website Development',
      scales: {
        starter: {
          timeline: '2–3 weeks',
          price: '$750 – $1,200',
          deliverables: [
            'Bespoke visual architecture & responsive design',
            'Full mobile optimization & Vercel edge deployment',
            'SEO schema hierarchy (Organization, LocalBusiness)',
            'Direct lead capture & WhatsApp integration'
          ]
        },
        growth: {
          timeline: '3–5 weeks',
          price: '$1,500 – $2,800',
          deliverables: [
            'Full e-commerce or institutional portal architecture',
            'Payment gateway integration (bKash, Nagad, Stripe, Card)',
            'Role-based permissions & automated receipts',
            'Performance caching & speed optimization'
          ]
        },
        enterprise: {
          timeline: '5–8 weeks',
          price: '$3,200 – $5,500+',
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
          price: '$450 – $750 / mo',
          deliverables: [
            'Conversions API (CAPI) server-side tracking setup',
            'Audience research & campaign structure',
            'Weekly performance reporting'
          ]
        },
        growth: {
          timeline: '1 week setup + ongoing scale',
          price: '$850 – $1,400 / mo',
          deliverables: [
            'Full-funnel lead generation & retargeting framework',
            'Creative copy testing matrix',
            'Weekly ROAS optimization & ad budget management'
          ]
        },
        enterprise: {
          timeline: 'Immediate onboarding + dedicated management',
          price: '$1,800 – $3,000+ / mo',
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
    if (priceRangeEl) priceRangeEl.textContent = scaleData.price;

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

      if (notesInput && timelineEl && priceRangeEl) {
        notesInput.value =
          `Selected Service: ${serviceName}\n` +
          `Scale: ${scaleText}\n` +
          `Timeline: ${timelineEl.textContent}\n` +
          `Estimated Range: ${priceRangeEl.textContent}`;
      }

      if (modal) openModal(modal);
    });
  }
}

/* --------------------------------------------------------------------------
   4. Booking Modal
   -------------------------------------------------------------------------- */
function openModal(modal) {
  modal.classList.add('is-open');
  document.body.classList.add('nav-open');
  modal.querySelector('.modal-input, .modal-textarea')?.focus();
}

function closeModal(modal) {
  modal.classList.remove('is-open');
  document.body.classList.remove('nav-open');
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
    if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(modal);
  });

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

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

/* --------------------------------------------------------------------------
   5. Scroll Reveal (Intersection Observer)
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReduced) {
    // If user prefers reduced motion, just make everything visible immediately
    document.querySelectorAll('.reveal').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}
