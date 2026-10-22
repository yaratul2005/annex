import { handleContactRequest } from '../lib/contact-handler.mjs';
import nodemailer from 'nodemailer';

const MAILBOX = 'support@annexbd.tech';

const zohoMailer = {
  isConfigured(env) {
    return Boolean(env.SMTP_PASS);
  },
  async send({ name, email, notes }, env) {
    const port = Number(env.SMTP_PORT || 465);
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST || 'smtppro.zoho.com',
      port,
      secure: port === 465,
      auth: { user: MAILBOX, pass: env.SMTP_PASS },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 15_000
    });

    try {
      const info = await transporter.sendMail({
        from: { name: 'ANNEX Website', address: MAILBOX },
        to: MAILBOX,
        replyTo: email,
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
      });
      if (!info.accepted?.length) throw new Error('SMTP server did not accept the recipient.');
    } finally {
      transporter.close();
    }
  }
};

export default {
  async fetch(request) {
    return handleContactRequest(request, process.env, zohoMailer);
  }
};
