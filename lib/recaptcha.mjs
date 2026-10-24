const VERIFY_URL = 'https://www.google.com/recaptcha/api/siteverify';
const EXPECTED_ACTION = 'contact_submit';
const VERIFY_TIMEOUT_MS = 5_000;

function normalizeHostname(value) {
  return typeof value === 'string' ? value.toLowerCase().replace(/\.$/, '') : '';
}

export async function verifyRecaptcha(token, expectedHostname, env = process.env) {
  const secret = env.SecretK;
  if (!secret) return { ok: false, unavailable: true };
  if (typeof token !== 'string' || token.length < 1 || token.length > 4_096) return { ok: false };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), VERIFY_TIMEOUT_MS);
  try {
    const response = await fetch(VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
      signal: controller.signal
    });
    if (!response.ok) return { ok: false, unavailable: true };

    const result = await response.json();
    const minimumScoreValue = Number(env.RECAPTCHA_MIN_SCORE ?? 0.5);
    const minimumScore = Number.isFinite(minimumScoreValue)
      ? Math.max(0, Math.min(1, minimumScoreValue))
      : 0.5;
    const hostnameMatches = normalizeHostname(result?.hostname) === normalizeHostname(expectedHostname);

    return {
      ok: result?.success === true &&
        result?.action === EXPECTED_ACTION &&
        hostnameMatches &&
        Number.isFinite(result?.score) &&
        result.score >= minimumScore
    };
  } catch (_) {
    return { ok: false, unavailable: true };
  } finally {
    clearTimeout(timeout);
  }
}
