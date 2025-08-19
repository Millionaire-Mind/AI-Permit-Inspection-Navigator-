<<<<<<< HEAD
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { ReportPDF } from "@/lib/pdf";
import { prisma } from "@/lib/prisma";
import { ExportPDFSchema } from "@/types/api/export";
=======
export const dynamic = "force-dynamic";
>>>>>>> 85e1c072 (Save local changes before rebase)

import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import React from "react";

export async function GET(req: NextRequest) {
const { pdf, Document, Page, Text, StyleSheet, View } = await import("@react-pdf/renderer");

const report = await prisma.report.findFirst({
orderBy: { createdAt: "desc" },
include: {
project: true,
},
});

const styles = StyleSheet.create({
page: { padding: 24, fontSize: 12 },
h1: { fontSize: 18, marginBottom: 8 },
section: { marginTop: 12 },
label: { fontWeight: 700 },
});

const Doc = (


Report

ID: {report?.id ?? "N/A"}
Title: {report?.title ?? "Untitled"}
Status: {report?.status ?? "unknown"}
Project: {report?.project?.name ?? "—"}
Created: {report?.createdAt?.toISOString() ?? "—"}



);

const buffer = await pdf(Doc).toBuffer();
return new Response(buffer, {
headers: {
"Content-Type": "application/pdf",
"Content-Disposition": 'inline; filename="report.pdf"',
},
});
}