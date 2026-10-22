import { handleContactRequest } from '../../lib/contact-handler.mjs';

const resendMailer = {
  isConfigured(env) {
    return Boolean(env.RESEND_API_KEY && env.RESEND_FROM_EMAIL);
  },
  async send({ name, email, notes }, env) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10_000);
    try {
      const delivery = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
          'Idempotency-Key': crypto.randomUUID()
        },
        body: JSON.stringify({
          from: env.RESEND_FROM_EMAIL,
          to: ['support@annexbd.tech'],
          reply_to: email,
          subject: `Consultation request — ${name}`,
          text: [
            'New consultation request from annexbd.tech',
            '',
            `Name: ${name}`,
            `Email: ${email}`,
            '',
            'Project notes / preferred time:',
            notes || '(No notes provided)'
          ].join('\n')
        }),
        signal: controller.signal
      });
      if (!delivery.ok) throw new Error('Resend could not accept the request.');
    } finally {
      clearTimeout(timeout);
    }
  }
};

export async function onRequest(context) {
  return handleContactRequest(context.request, context.env, resendMailer);
}
