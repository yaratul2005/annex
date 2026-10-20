/**
 * ANNEX BD — Hand-Crafted Studio Front-End Controller
 * Domain: annexbd.tech
 * Zero Emojis | Respects Reduced Motion | No Gimmicks
 */

document.addEventListener('DOMContentLoaded', () => {
  initFluidLoader();
  initPrivacyChoices();
  initMobileNav();
  initFaqAccordion();
  initEstimator();
  initBookingModal();
});

/* --------------------------------------------------------------------------
   0. Fluid first-paint animation
   -------------------------------------------------------------------------- */
function initFluidLoader() {
  const loader = document.getElementById('site-loader');
  if (!loader) return;

  let dismissed = false;
  const startedAt = performance.now();
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    loader.classList.add('is-hidden');
    window.setTimeout(() => loader.remove(), 380);
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    dismiss();
    return;
  }

  const ready = () => window.setTimeout(dismiss, Math.max(0, 380 - (performance.now() - startedAt)));
  if (document.readyState === 'complete') ready();
  else window.addEventListener('load', ready, { once: true });
  window.setTimeout(dismiss, 1100);
}

/* --------------------------------------------------------------------------
   0. Privacy-first analytics and third-party content consent
   -------------------------------------------------------------------------- */
function initPrivacyChoices() {
  const dialog = document.getElementById('cookie-consent');
  if (!dialog) return;

  const intro = document.getElementById('consent-intro');
  const preferencesPanel = document.getElementById('consent-preferences');
  const description = document.getElementById('consent-description');
  const analyticsToggle = document.getElementById('consent-analytics');
  const externalToggle = document.getElementById('consent-external');
  const settingsButton = document.getElementById('cookie-settings-trigger');
  const storageKey = 'annex-privacy-choices-v1';
  const duration = 180 * 24 * 60 * 60 * 1000;
  const gpcActive = navigator.globalPrivacyControl === true;
  if (gpcActive) {
    description.textContent = 'A Global Privacy Control signal is active. Optional analytics and external review content stay off. Essential storage only remembers your choice.';
  }
  const backgroundRegions = [document.querySelector('.site-header'), document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean);
  let choices = { necessary: true, analytics: false, external: false };
  let previouslyInert = [];
  let returnFocus = null;

  function readChoices() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null');
      if (!saved || saved.version !== 1 || !Number.isFinite(saved.updatedAt) || Date.now() - saved.updatedAt > duration) return null;
      return { necessary: true, analytics: saved.analytics === true, external: saved.external === true };
    } catch (_) {
      return null;
    }
  }

  function persistChoices(next) {
    choices = { necessary: true, analytics: next.analytics === true && !gpcActive, external: next.external === true && !gpcActive };
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, updatedAt: Date.now(), analytics: choices.analytics, external: choices.external }));
    } catch (_) {
      // Keep the selection active for this page even if browser storage is blocked.
    }
    syncAnalytics(choices.analytics);
    syncTrustpilot(choices.external);
    closeDialog();
  }

  function syncAnalytics(enabled) {
    const measurementId = 'G-WLNJ46L9RH';
    const disableKey = `ga-disable-${measurementId}`;
    if (!enabled) {
      window[disableKey] = true;
      if (typeof window.gtag === 'function') window.gtag('consent', 'update', { analytics_storage: 'denied' });
      return;
    }

    window[disableKey] = false;
    if (typeof window.gtag === 'function') {
      window.gtag('consent', 'update', { analytics_storage: 'granted' });
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag(){ window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', { analytics_storage: 'denied' });
    window.gtag('consent', 'update', { analytics_storage: 'granted' });
    window.gtag('js', new Date());
    window.gtag('config', measurementId, { allow_google_signals: false, allow_ad_personalization_signals: false });

    if (!document.getElementById('annex-ga4-script')) {
      const script = document.createElement('script');
      script.id = 'annex-ga4-script';
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
      document.head.appendChild(script);
    }
  }

  function syncTrustpilot(enabled) {
    const widget = document.querySelector('.trustpilot-widget');
    const scriptId = 'annex-trustpilot-script';
    if (enabled) {
      if (!document.getElementById(scriptId)) {
        const script = document.createElement('script');
        script.id = scriptId;
        script.async = true;
        script.src = 'https://widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js';
        script.addEventListener('load', () => {
          if (!choices.external) syncTrustpilot(false);
        }, { once: true });
        document.body.appendChild(script);
      }
      return;
    }

    document.getElementById(scriptId)?.remove();
    if (widget) {
      widget.querySelectorAll('iframe').forEach(frame => frame.remove());
      if (!widget.querySelector('a')) {
        widget.innerHTML = '<a href="https://www.trustpilot.com/review/annexbd.tech" target="_blank" rel="noopener noreferrer">Trustpilot</a>';
      }
    }
  }

  function setPanel(showPreferences) {
    intro.hidden = showPreferences;
    preferencesPanel.hidden = !showPreferences;
    dialog.setAttribute('aria-labelledby', showPreferences ? 'consent-preferences-title' : 'consent-title');
    dialog.setAttribute('aria-describedby', showPreferences ? 'consent-preferences-copy' : 'consent-description');
    if (showPreferences) {
      analyticsToggle.checked = choices.analytics;
      externalToggle.checked = choices.external;
      analyticsToggle.disabled = gpcActive;
      externalToggle.disabled = gpcActive;
      document.getElementById('consent-preferences-copy').textContent = gpcActive
        ? 'A Global Privacy Control signal is active, so optional services remain off for this visit.'
        : 'Choose which optional services may load. You can change this at any time from the footer.';
    }
  }

  function openDialog(showPreferences = false) {
    returnFocus = document.activeElement;
    setPanel(showPreferences);
    previouslyInert = backgroundRegions.map(region => region.inert);
    backgroundRegions.forEach(region => { region.inert = true; });
    dialog.hidden = false;
    dialog.setAttribute('aria-hidden', 'false');
    document.body.classList.add('consent-open');
    (showPreferences ? document.getElementById('consent-save') : document.getElementById('consent-reject')).focus();
  }

  function closeDialog() {
    dialog.hidden = true;
    dialog.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('consent-open');
    backgroundRegions.forEach((region, index) => { region.inert = previouslyInert[index] || false; });
    if (returnFocus instanceof HTMLElement && returnFocus.isConnected) returnFocus.focus();
  }

  function saveToggles() {
    persistChoices({ analytics: analyticsToggle.checked, external: externalToggle.checked });
  }

  document.getElementById('consent-accept').addEventListener('click', () => persistChoices({ analytics: true, external: true }));
  document.getElementById('consent-reject').addEventListener('click', () => persistChoices({ analytics: false, external: false }));
  document.getElementById('consent-manage').addEventListener('click', () => {
    setPanel(true);
    document.getElementById('consent-save').focus();
  });
  document.getElementById('consent-save').addEventListener('click', saveToggles);
  document.getElementById('consent-preferences-reject').addEventListener('click', () => persistChoices({ analytics: false, external: false }));
  document.getElementById('consent-back').addEventListener('click', () => {
    setPanel(false);
    document.getElementById('consent-manage').focus();
  });
  settingsButton?.addEventListener('click', () => openDialog(true));

  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = [...dialog.querySelectorAll('button:not([disabled]), input:not([disabled]), a[href]')].filter(element => !element.hidden && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  const stored = readChoices();
  if (stored) {
    choices = stored;
    if (gpcActive) choices = { necessary: true, analytics: false, external: false };
    syncAnalytics(choices.analytics);
    syncTrustpilot(choices.external);
    if (gpcActive && (stored.analytics || stored.external)) {
      try { localStorage.setItem(storageKey, JSON.stringify({ version: 1, updatedAt: Date.now(), analytics: false, external: false })); } catch (_) {}
    }
  } else {
    openDialog(false);
  }
}

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
            'Full mobile optimization & global edge delivery',
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

      if (modal) {
        openModal(modal);
        trackAnalyticsEvent('booking_modal_open');
      }
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

  openButtons.forEach(btn => btn.addEventListener('click', () => {
    openModal(modal);
    trackAnalyticsEvent('booking_modal_open');
  }));
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
      submitBookingRequest(form, modal);
    });
  }
}

async function submitBookingRequest(form, modal) {
  const name = document.getElementById('booking-name')?.value.trim() || '';
  const email = document.getElementById('booking-email')?.value.trim() || '';
  const notes = document.getElementById('booking-notes')?.value.trim() || '';
  const status = document.getElementById('booking-form-status');
  const fallback = document.getElementById('booking-mailto-fallback');
  const submitButton = form.querySelector('button[type="submit"]');
  const subject = `Consultation Request: 20-Minute Call — ${name}`;
  const body = `Name: ${name}\nEmail: ${email}\n\nProject Notes:\n${notes}\n\nSubmitted via annexbd.tech`;
  const mailto = `mailto:support@annexbd.tech?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (status) {
    status.hidden = false;
    status.dataset.state = 'pending';
    status.textContent = 'Sending your request securely…';
  }
  if (fallback) fallback.hidden = true;
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    submitButton.textContent = 'Sending request…';
  }

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, notes, website: document.getElementById('booking-website')?.value || '' })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok !== true) {
      const message = response.status === 503
        ? 'Secure email delivery is not configured yet. You can send this request directly from your email app.'
        : 'We could not deliver your request right now. Please use the email link below or try again shortly.';
      showBookingFallback(status, fallback, mailto, message);
      return;
    }

    if (status) {
      status.dataset.state = 'success';
      status.textContent = 'Thanks — your project request has been sent. ANNEX will follow up by email.';
      status.focus();
    }
    trackAnalyticsEvent('booking_request_sent');
  } catch (_) {
    showBookingFallback(status, fallback, mailto, 'We could not reach the request service. Please use the email link below to send your request.');
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      submitButton.textContent = 'Book a free 20-minute call';
    }
  }
}

function showBookingFallback(status, fallback, mailto, message) {
  if (status) {
    status.hidden = false;
    status.dataset.state = 'error';
    status.textContent = message;
    status.focus();
  }
  if (fallback) {
    fallback.href = mailto;
    fallback.hidden = false;
  }
}

function trackAnalyticsEvent(eventName) {
  try {
    const consent = JSON.parse(localStorage.getItem('annex-privacy-choices-v1') || 'null');
    if (consent?.analytics === true && typeof window.gtag === 'function') window.gtag('event', eventName);
  } catch (_) {}
}
