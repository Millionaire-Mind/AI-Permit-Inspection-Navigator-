export async function sendEmail(to: string, subject: string, text: string) {
  // Placeholder – integrate nodemailer if you wish
  console.log("[EMAIL]", { to, subject, text });
  return { ok: true };
}
