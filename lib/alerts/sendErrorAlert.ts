import nodemailer from "nodemailer";

export async function sendErrorAlert({ subject, message }: { subject: string; message: string }) {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SMTP_HOST,
    port: Number(process.env.EMAIL_SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"System Alert" <${process.env.EMAIL_FROM || "alerts@yourdomain.com"}>`,
    to: process.env.ADMIN_EMAILS || "admin@yourdomain.com",
    subject,
    text: message
  });
}
