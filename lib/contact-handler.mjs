const MAX_BODY_BYTES = 12_000;
const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_NOTES_LENGTH = 5_000;

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

export async function handleContactRequest(request, env = {}, mailer) {
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
    payload = await request.json();
  } catch (_) {
    return jsonResponse(400, { ok: false, message: 'Request could not be read.' });
  }

  // Quietly discard basic automated submissions; never deliver the honeypot value.
  if (cleanText(payload?.website, 200)) return jsonResponse(200, { ok: true });

  const name = cleanText(payload?.name, MAX_NAME_LENGTH + 1).replace(/\s+/g, ' ');
  const email = cleanText(payload?.email, MAX_EMAIL_LENGTH + 1);
  const notes = cleanText(payload?.notes, MAX_NOTES_LENGTH + 1);
  if (name.length > MAX_NAME_LENGTH || email.length > MAX_EMAIL_LENGTH || notes.length > MAX_NOTES_LENGTH) {
    return jsonResponse(400, { ok: false, message: 'One or more fields are too long.' });
  }
  if (name.length < 2) return jsonResponse(400, { ok: false, message: 'Enter your name.' });
  if (!email || email.length > MAX_EMAIL_LENGTH || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return jsonResponse(400, { ok: false, message: 'Enter a valid email address.' });
  }

  if (!mailer || !mailer.isConfigured?.(env)) {
    return jsonResponse(503, { ok: false, code: 'email_delivery_unconfigured', message: 'Email delivery is not configured.' });
  }

  try {
    await mailer.send({ name, email, notes }, env);
    return jsonResponse(200, { ok: true });
  } catch (error) {
    console.error('Contact email delivery failed:', error?.code || error?.name || 'unknown');
    return jsonResponse(502, { ok: false, message: 'Email service is temporarily unavailable.' });
  }
}
