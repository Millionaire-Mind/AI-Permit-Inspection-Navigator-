import nodemailer from 'nodemailer';

type EmailPayload = {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
};

function getFrom(): string {
  return process.env.EMAIL_FROM || 'PermitIQ <no-reply@permitiq.example>';
}

async function sendViaResend(payload: EmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error('RESEND_API_KEY is not set');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: payload.from ?? getFrom(),
      to: Array.isArray(payload.to) ? payload.to : [payload.to],
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend error: ${res.status} ${text}`);
  }
}

async function sendViaSendGrid(payload: EmailPayload) {
  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) throw new Error('SENDGRID_API_KEY is not set');
  const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      personalizations: [
        { to: (Array.isArray(payload.to) ? payload.to : [payload.to]).map((e) => ({ email: e })) }
      ],
      from: { email: (payload.from ?? getFrom()).split('<').pop()?.replace('>', '') || getFrom() },
      subject: payload.subject,
      content: [
        payload.html ? { type: 'text/html', value: payload.html } : { type: 'text/plain', value: payload.text ?? '' }
      ]
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`SendGrid error: ${res.status} ${text}`);
  }
}

let smtpTransport: nodemailer.Transporter | null = null;
function getSmtpTransport() {
  if (smtpTransport) return smtpTransport;
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const secure = (process.env.SMTP_SECURE || 'false') === 'true' || port === 465;
  if (!host || !user || !pass) throw new Error('SMTP credentials are not fully set');
  smtpTransport = nodemailer.createTransport({ host, port, secure, auth: { user, pass } });
  return smtpTransport;
}

async function sendViaSmtp(payload: EmailPayload) {
  const transport = getSmtpTransport();
  await transport.sendMail({
    from: payload.from ?? getFrom(),
    to: Array.isArray(payload.to) ? payload.to.join(',') : payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
  });
}

export async function sendEmail(payload: EmailPayload) {
  // Provider selection priority: Resend -> SendGrid -> SMTP
  if (process.env.RESEND_API_KEY) return sendViaResend(payload);
  if (process.env.SENDGRID_API_KEY) return sendViaSendGrid(payload);
  return sendViaSmtp(payload);
}

// Convenience helper: send a standardized notification
export async function sendNotificationEmail(to: string, title: string, htmlBody: string, textFallback?: string) {
  return sendEmail({ to, subject: title, html: htmlBody, text: textFallback, from: getFrom() });
}

