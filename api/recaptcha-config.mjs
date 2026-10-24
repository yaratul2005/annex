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

export default {
  async fetch(request) {
    if (request.method !== 'GET') return jsonResponse(405, { ok: false, message: 'Method not allowed.' });
    const siteKey = process.env.SiteK;
    if (!siteKey) return jsonResponse(503, { ok: false, code: 'recaptcha_unavailable' });
    return jsonResponse(200, { ok: true, siteKey });
  }
};
