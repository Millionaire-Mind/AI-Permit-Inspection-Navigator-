export async function sendErrorAlert({ subject, message }: { subject: string; message: string }) {
  // Phase 1 stub: log to console instead of sending email
  console.warn(`[EmailStub] ${subject}: ${message}`);
}
