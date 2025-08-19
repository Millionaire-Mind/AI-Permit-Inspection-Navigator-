import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ExportPDFSchema } from "@/types/api/export";

export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const parsed = ExportPDFSchema.safeParse(data);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
    }

    const report = await prisma.report.findUnique({
      where: { id: parsed.data.reportId },
      include: { project: true, appeals: true }
    });
    
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    // Generate HTML content that can be converted to PDF by the client
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Report ${report.id}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 25px; }
            .label { font-weight: bold; color: #666; }
            .value { margin-top: 5px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Inspection Report</h1>
            <p><span class="label">Report ID:</span> ${report.id}</p>
            <p><span class="label">Generated:</span> ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>Report Details</h2>
            <p><span class="label">Title:</span> ${report.title}</p>
            <p><span class="label">Status:</span> ${report.status}</p>
            <p><span class="label">Category:</span> ${report.category || 'N/A'}</p>
            <p><span class="label">Priority:</span> ${report.priority}</p>
            <p><span class="label">Created:</span> ${new Date(report.createdAt).toLocaleDateString()}</p>
            <p><span class="label">Content:</span> ${report.content}</p>
          </div>
          
          ${report.project ? `
          <div class="section">
            <h2>Project Information</h2>
            <p><span class="label">Project Name:</span> ${report.project.name}</p>
            <p><span class="label">Project Address:</span> ${report.project.address}</p>
            <p><span class="label">Project Status:</span> ${report.project.status}</p>
            <p><span class="label">Description:</span> ${report.project.description || 'N/A'}</p>
          </div>
          ` : ''}
          
          ${report.appeals && report.appeals.length > 0 ? `
          <div class="section">
            <h2>Appeals</h2>
            <table>
              <thead>
                <tr><th>Appeal ID</th><th>Title</th><th>Status</th><th>Created</th></tr>
              </thead>
              <tbody>
                ${report.appeals.map(appeal => `
                  <tr>
                    <td>${appeal.id}</td>
                    <td>${appeal.title}</td>
                    <td>${appeal.status}</td>
                    <td>${new Date(appeal.createdAt).toLocaleDateString()}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          ` : ''}
        </body>
      </html>
    `;

    // Return HTML content that can be converted to PDF by the client
    return new NextResponse(htmlContent, {
      headers: {
        "Content-Type": "text/html",
        "Content-Disposition": `attachment; filename="report-${report.id}.html"`
      }
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 }
    );
  }
}
