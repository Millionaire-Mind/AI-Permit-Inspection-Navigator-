export function permitApprovedTemplate(params: { applicantName: string; projectName: string; dashboardUrl: string }) {
  const { applicantName, projectName, dashboardUrl } = params;
  const title = 'Your permit application has been approved!';
  const html = `
  <div style="font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; color:#0f172a;">
    <div style="background:#0c4a6e;color:#fff;padding:16px;border-radius:8px 8px 0 0;">
      <strong>PermitIQ</strong>
    </div>
    <div style="border:1px solid #e2e8f0;border-top:none;border-radius:0 0 8px 8px;padding:16px;">
      <h1 style="font-size:18px;margin:0 0 8px 0;">${title}</h1>
      <p style="margin:0 0 10px 0;">Hi ${applicantName},</p>
      <p style="margin:0 0 10px 0;">Great news — your permit application for <strong>${projectName}</strong> has been approved.</p>
      <p style="margin:0 0 16px 0;">You can view the approval details and next steps in your dashboard.</p>
      <a href="${dashboardUrl}" style="display:inline-block;background:#2563eb;color:#fff;text-decoration:none;padding:10px 14px;border-radius:6px;">Go to Dashboard</a>
      <p style="margin:16px 0 0 0;color:#475569;font-size:12px;">If you didn’t request this, please contact support.</p>
    </div>
  </div>`;
  const text = `${title}\n\nHi ${applicantName},\n\nYour permit application for ${projectName} has been approved.\nView details: ${dashboardUrl}`;
  return { subject: title, html, text };
}

