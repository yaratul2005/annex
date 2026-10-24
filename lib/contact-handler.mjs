const MAX_BODY_BYTES = 8_000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 600;
const PHONE_COUNTRY_CODES = new Set([
  '+1', '+27', '+33', '+44', '+49', '+61', '+64', '+65', '+81', '+880', '+91', '+92', '+966', '+971'
]);

function jsonResponse(status, payload) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store, max-age=0',
      'X-Content-Type-Options': 'nosniff'
    }
  });
}

function cleanText(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

export async function handleContactRequest(request, env = {}, controls = {}) {
  if (request.method !== 'POST') {
    return jsonResponse(405, { ok: false, message: 'Method not allowed.' });
  }

  const origin = request.headers.get('origin');
  if (origin) {
    try {
      if (new URL(origin).origin !== new URL(request.url).origin) {
        return jsonResponse(403, { ok: false, message: 'Request origin is not allowed.' });
      }
    } catch (_) {
      return jsonResponse(403, { ok: false, message: 'Request origin is not allowed.' });
    }
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > MAX_BODY_BYTES) return jsonResponse(413, { ok: false, message: 'Request is too large.' });
  if (!request.headers.get('content-type')?.toLowerCase().includes('application/json')) {
    return jsonResponse(415, { ok: false, message: 'Send this request as JSON.' });
  }

  let payload;
  try {
    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_BODY_BYTES) {
      return jsonResponse(413, { ok: false, message: 'Request is too large.' });
    }
    payload = JSON.parse(rawBody);
  } catch (_) {
    return jsonResponse(400, { ok: false, message: 'Request could not be read.' });
  }

  // Quietly discard basic automated submissions; never store the honeypot value.
  if (cleanText(payload?.website, 200)) return jsonResponse(200, { ok: true });

  const name = cleanText(payload?.name, MAX_NAME_LENGTH + 1).replace(/\s+/g, ' ');
  const contactMethod = payload?.contactMethod === 'phone' ? 'phone' : payload?.contactMethod === 'email' ? 'email' : '';
  const message = cleanText(payload?.message, MAX_MESSAGE_LENGTH + 1);
  if (name.length > MAX_NAME_LENGTH || message.length > MAX_MESSAGE_LENGTH) {
    return jsonResponse(400, { ok: false, message: 'One or more fields are too long.' });
  }
  if (name.length < 2) return jsonResponse(400, { ok: false, message: 'Enter your name.' });
  if (!contactMethod) return jsonResponse(400, { ok: false, message: 'Choose email or phone as your contact method.' });
  if (message.length < 5) return jsonResponse(400, { ok: false, message: 'Add a short message so we know how to help.' });

  let contact;
  if (contactMethod === 'email') {
    const email = cleanText(payload?.email, MAX_EMAIL_LENGTH + 1);
    if (!email || email.length > MAX_EMAIL_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return jsonResponse(400, { ok: false, message: 'Enter a valid email address.' });
    }
    contact = { name, contactMethod, email, message };
  } else {
    const phoneCountryCode = cleanText(payload?.phoneCountryCode, 5);
    const phoneValue = cleanText(payload?.phone, 32);
    const countryDigits = phoneCountryCode.replace(/\D/g, '');
    let phoneDigits = phoneValue.replace(/\D/g, '');
    if (phoneValue.trim().startsWith('+') && phoneDigits.startsWith(countryDigits)) {
      phoneDigits = phoneDigits.slice(countryDigits.length);
    } else if (phoneDigits.startsWith(`00${countryDigits}`)) {
      phoneDigits = phoneDigits.slice(countryDigits.length + 2);
    }
    phoneDigits = phoneDigits.replace(/^0+/, '');
    if (!PHONE_COUNTRY_CODES.has(phoneCountryCode) || phoneDigits.length < 5 || phoneDigits.length > 14 || countryDigits.length + phoneDigits.length > 15) {
      return jsonResponse(400, { ok: false, message: 'Enter a valid phone number and country code.' });
    }
    contact = { name, contactMethod, phoneCountryCode, phone: `+${countryDigits}${phoneDigits}`, message };
  }

  if (typeof controls.verifyRecaptcha !== 'function' || !env.RECAPTCHA_SECRET_KEY) {
    return jsonResponse(503, {
      ok: false,
      code: 'recaptcha_unavailable',
      message: 'The security check is not ready. Please try again shortly.'
    });
  }

  let recaptchaResult;
  try {
    recaptchaResult = await controls.verifyRecaptcha(payload?.recaptchaToken, new URL(request.url).hostname, env);
  } catch (error) {
    console.error('reCAPTCHA verification failed:', {
      name: typeof error?.name === 'string' ? error.name.slice(0, 40) : 'unknown'
    });
    return jsonResponse(503, {
      ok: false,
      code: 'recaptcha_unavailable',
      message: 'The security check is temporarily unavailable. Please try again shortly.'
    });
  }
  if (recaptchaResult?.unavailable) {
    return jsonResponse(503, {
      ok: false,
      code: 'recaptcha_unavailable',
      message: 'The security check is temporarily unavailable. Please try again shortly.'
    });
  }
  if (recaptchaResult?.ok !== true) {
    return jsonResponse(403, {
      ok: false,
      code: 'recaptcha_rejected',
      message: 'The security check could not verify this request. Please try again.'
    });
  }

  if (typeof controls.isContactPaused === 'function') {
    try {
      if (await controls.isContactPaused()) {
        return jsonResponse(503, {
          ok: false,
          code: 'contact_temporarily_paused',
          message: 'The inquiry form is temporarily paused. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Contact form control read failed; continuing with normal storage:', {
        name: typeof error?.name === 'string' ? error.name.slice(0, 40) : 'unknown'
      });
    }
  }

  if (typeof controls.storeContactRequest !== 'function' || !(env.annex_MONGODB_URL || env.MONGODB_URI)) {
    return jsonResponse(503, {
      ok: false,
      code: 'contact_storage_unavailable',
      message: 'We could not save your request just now. Please try again shortly.'
    });
  }

  try {
    await controls.storeContactRequest(contact, env);
    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error('Contact request could not be stored:', {
      code: typeof error?.code === 'string' ? error.code.slice(0, 40) : error?.name || 'unknown'
    });
    return jsonResponse(503, {
      ok: false,
      code: 'contact_storage_unavailable',
      message: 'We could not save your request just now. Please try again shortly.'
    });
  }
}
