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
  initBookingModal();
  initServiceSlider();
});

/* --------------------------------------------------------------------------
   Website development service showcase
   -------------------------------------------------------------------------- */
function initServiceSlider() {
  const slider = document.querySelector('[data-service-slider]');
  if (!slider) return;

  const slides = [...slider.querySelectorAll('[data-slide]')];
  const progress = [...slider.querySelectorAll('.service-slider-progress span')];
  const title = document.querySelector('[data-slider-title]');
  const description = document.querySelector('[data-slider-description]');
  const content = [
    ['Portfolio websites', 'A distinctive home for your work, point of view, and next opportunity.'],
    ['E-commerce websites', 'A smooth storefront built to make discovery, checkout, and repeat orders feel effortless.'],
    ['School & college websites', 'A helpful digital campus for admissions, announcements, and the whole learning community.'],
    ['Corporate & private company websites', 'A credible platform that brings your capabilities, people, and business goals together.']
  ];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let timer;
  let hovered = false;

  const show = index => {
    active = (index + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      const selected = i === active;
      slide.classList.toggle('is-active', selected);
      slide.setAttribute('aria-hidden', String(!selected));
    });
    progress.forEach((segment, i) => {
      segment.classList.toggle('is-active', i === active);
      segment.classList.toggle('is-complete', i < active);
    });
    title.textContent = content[active][0];
    description.textContent = content[active][1];
  };

  const stop = () => {
    window.clearInterval(timer);
    progress[active]?.classList.remove('is-running');
  };
  const start = () => {
    stop();
    if (hovered || reducedMotion.matches || document.hidden) return;
    progress[active]?.classList.add('is-running');
    timer = window.setInterval(() => {
      stop();
      show(active + 1);
      start();
    }, 6500);
  };

  slider.addEventListener('mouseenter', () => { hovered = true; stop(); });
  slider.addEventListener('mouseleave', () => { hovered = false; start(); });
  document.addEventListener('visibilitychange', start);
  reducedMotion.addEventListener?.('change', start);
  show(0);
  start();
}

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
  const backdrop  = document.getElementById('mobile-nav-backdrop');
  const links     = document.querySelectorAll('.mobile-nav-link');
  const pageRegions = [document.querySelector('.site-header'), document.querySelector('main'), document.querySelector('.site-footer')].filter(Boolean);

  if (!toggleBtn || !drawer) return;

  function openMenu() {
    drawer.classList.add('is-open');
    drawer.setAttribute('aria-hidden', 'false');
    drawer.inert = false;
    if (backdrop) {
      backdrop.setAttribute('aria-hidden', 'false');
      backdrop.inert = false;
    }
    toggleBtn.setAttribute('aria-expanded', 'true');
    toggleBtn.setAttribute('aria-label', 'Close navigation menu');
    document.body.classList.add('nav-open');
    document.body.classList.add('mobile-nav-open');
    pageRegions.forEach(region => { region.inert = true; });
    closeBtn?.focus();
  }

  function closeMenu(restoreFocus = true) {
    drawer.classList.remove('is-open');
    drawer.setAttribute('aria-hidden', 'true');
    drawer.inert = true;
    if (backdrop) {
      backdrop.setAttribute('aria-hidden', 'true');
      backdrop.inert = true;
    }
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.setAttribute('aria-label', 'Open navigation menu');
    document.body.classList.remove('nav-open');
    document.body.classList.remove('mobile-nav-open');
    pageRegions.forEach(region => { region.inert = false; });
    if (restoreFocus) toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);
  backdrop?.addEventListener('click', () => closeMenu());
  drawer.querySelectorAll('.open-booking-modal').forEach(button => {
    button.addEventListener('click', () => closeMenu(false));
  });

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
   3. Booking Modal
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
    resetBookingForm(form);
    openModal(modal);
    warmContactRecaptcha();
    trackAnalyticsEvent('booking_modal_open');
  }));
  if (closeButton) closeButton.addEventListener('click', () => closeModal(modal));

  const contactMethodInputs = form?.querySelectorAll('input[name="contactMethod"]') || [];
  contactMethodInputs.forEach(input => input.addEventListener('change', () => updateBookingContactFields(form)));
  updateBookingContactFields(form);

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
      submitBookingRequest(form);
    });
  }
}

function updateBookingContactFields(form) {
  if (!form) return;
  const method = form.querySelector('input[name="contactMethod"]:checked')?.value || 'email';
  const usePhone = method === 'phone';
  const emailField = document.getElementById('booking-email-field');
  const emailInput = document.getElementById('booking-email');
  const phoneField = document.getElementById('booking-phone-field');
  const phoneInput = document.getElementById('booking-phone');
  const countryCode = document.getElementById('booking-phone-country');

  if (emailField) emailField.hidden = usePhone;
  if (emailInput) {
    emailInput.required = !usePhone;
    emailInput.disabled = usePhone;
  }
  if (phoneField) phoneField.hidden = !usePhone;
  if (phoneInput) {
    phoneInput.required = usePhone;
    phoneInput.disabled = !usePhone;
  }
  if (countryCode) countryCode.disabled = !usePhone;
}

function resetBookingForm(form) {
  if (!form) return;
  form.reset();
  form.hidden = false;
  const success = document.getElementById('booking-success');
  const status = document.getElementById('booking-form-status');
  const progress = document.getElementById('booking-progress');
  if (success) success.hidden = true;
  if (status) {
    status.hidden = true;
    status.textContent = '';
    delete status.dataset.state;
  }
  if (progress) {
    progress.hidden = true;
    progress.classList.remove('is-complete');
    progress.setAttribute('aria-valuenow', '0');
  }
  updateBookingContactFields(form);
}

async function loadContactRecaptcha() {
  if (!window.__annexRecaptchaConfigPromise) {
    window.__annexRecaptchaConfigPromise = fetch('/api/recaptcha-config', { headers: { Accept: 'application/json' } })
      .then(async response => {
        const config = await response.json().catch(() => ({}));
        if (!response.ok || config.ok !== true || typeof config.siteKey !== 'string' || !config.siteKey) {
          throw new Error('reCAPTCHA is not configured.');
        }
        return config.siteKey;
      })
      .catch(error => {
        delete window.__annexRecaptchaConfigPromise;
        throw error;
      });
  }

  const siteKey = await window.__annexRecaptchaConfigPromise;
  if (!window.grecaptcha?.execute) {
    if (!window.__annexRecaptchaScriptPromise) {
      window.__annexRecaptchaScriptPromise = new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
        script.async = true;
        script.defer = true;
        script.onload = resolve;
        script.onerror = () => reject(new Error('Could not load reCAPTCHA.'));
        document.head.appendChild(script);
      }).catch(error => {
        delete window.__annexRecaptchaScriptPromise;
        throw error;
      });
    }
    await window.__annexRecaptchaScriptPromise;
  }

  if (!window.grecaptcha?.ready || !window.grecaptcha?.execute) throw new Error('reCAPTCHA did not initialize.');
  await new Promise(resolve => window.grecaptcha.ready(resolve));
  return siteKey;
}

function warmContactRecaptcha() {
  // Fetch the library while the visitor fills the form; tokens are still created only on submit.
  loadContactRecaptcha().catch(() => {});
}

async function getContactRecaptchaToken() {
  const siteKey = await loadContactRecaptcha();
  return window.grecaptcha.execute(siteKey, { action: 'contact_submit' });
}

function waitForContactRecaptcha(timeoutMs = 30_000) {
  return new Promise((resolve, reject) => {
    const timeout = window.setTimeout(() => reject(new Error('reCAPTCHA timed out.')), timeoutMs);
    getContactRecaptchaToken().then(
      token => { window.clearTimeout(timeout); resolve(token); },
      error => { window.clearTimeout(timeout); reject(error); }
    );
  });
}

async function submitBookingRequest(form) {
  if (form.dataset.submitting === 'true') return;
  form.dataset.submitting = 'true';

  const name = document.getElementById('booking-name')?.value.trim() || '';
  const contactMethod = form.querySelector('input[name="contactMethod"]:checked')?.value || 'email';
  const email = contactMethod === 'email' ? document.getElementById('booking-email')?.value.trim() || '' : '';
  const phone = contactMethod === 'phone' ? document.getElementById('booking-phone')?.value.trim() || '' : '';
  const phoneCountryCode = document.getElementById('booking-phone-country')?.value || '';
  const message = document.getElementById('booking-message')?.value.trim() || '';
  const status = document.getElementById('booking-form-status');
  const progress = document.getElementById('booking-progress');
  const success = document.getElementById('booking-success');
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = submitButton?.querySelector('.submit-button-label');

  if (status) {
    status.hidden = false;
    status.dataset.state = 'pending';
    status.textContent = 'Saving your request securely…';
  }
  if (progress) {
    progress.hidden = false;
    progress.classList.remove('is-complete');
    progress.setAttribute('aria-valuenow', '20');
  }
  if (submitButton) {
    submitButton.disabled = true;
    submitButton.setAttribute('aria-busy', 'true');
    if (submitLabel) submitLabel.textContent = 'Saving request…';
    form.setAttribute('aria-busy', 'true');
  }

  let submissionStage = 'security';
  try {
    const recaptchaToken = await waitForContactRecaptcha();
    submissionStage = 'contact';
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        name,
        contactMethod,
        ...(contactMethod === 'email' ? { email } : { phone, phoneCountryCode }),
        message,
        recaptchaToken,
        website: document.getElementById('booking-website')?.value || ''
      })
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.ok !== true) {
      if (status) {
        status.dataset.state = 'error';
        status.textContent = result.message || 'We could not verify and save your request. Please try again shortly.';
        status.focus();
      }
      if (progress) progress.hidden = true;
      return;
    }

    if (progress) {
      progress.classList.add('is-complete');
      progress.setAttribute('aria-valuenow', '100');
    }
    await new Promise(resolve => window.setTimeout(resolve, 420));
    form.hidden = true;
    if (success) {
      success.hidden = false;
      success.focus();
    }
    trackAnalyticsEvent('booking_request_sent');
  } catch (_) {
    if (status) {
      status.dataset.state = 'error';
      status.textContent = submissionStage === 'security'
        ? 'Google’s security check could not load or finish. Check your connection or content blocker, then try again.'
        : 'We could not reach the contact service. Please check your connection and try again.';
      status.focus();
    }
    if (progress) progress.hidden = true;
  } finally {
    if (submitButton) {
      submitButton.disabled = false;
      submitButton.removeAttribute('aria-busy');
      if (submitLabel) submitLabel.textContent = 'Send inquiry';
      form.removeAttribute('aria-busy');
    }
    delete form.dataset.submitting;
  }
}

function trackAnalyticsEvent(eventName) {
  try {
    const consent = JSON.parse(localStorage.getItem('annex-privacy-choices-v1') || 'null');
    if (consent?.analytics === true && typeof window.gtag === 'function') window.gtag('event', eventName);
  } catch (_) {}
}
