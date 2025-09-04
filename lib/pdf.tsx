import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

type ReportPdfProps = {
title?: string;
status?: string;
projectName?: string;
createdAt?: string;
};

// This component intentionally does NOT import @react-pdf/renderer.
// The route should import the renderer and wrap this content.
export function ReportPdfContent(props: ReportPdfProps) {
const { title = "Untitled", status = "unknown", projectName = "—", createdAt = "—" } = props;
// This is just a placeholder; in practice you'd return plain data and construct the PDF in the route.
return (
<>
{title}
Status: {status}
Project: {projectName}
Created: {createdAt}
</>
);
}

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 11, color: '#111827' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  brand: { fontSize: 18, fontWeight: 700 },
  muted: { color: '#6b7280' },
  sectionTitle: { fontSize: 14, marginTop: 10, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: 4 },
  row: { marginBottom: 4 }
});

export function ReportPDF(props: { report: any; timezone: string; noteTagFilter: string | null }) {
  const { report } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.brand}>PermitIQ</Text>
          <Text style={styles.muted}>Generated {new Date().toLocaleDateString()}</Text>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Report</Text>
          <Text style={styles.row}>Title: {report?.title ?? "Report"}</Text>
          <Text style={styles.row}>Status: {report?.status ?? "unknown"}</Text>
          <Text style={styles.row}>Address: {report?.address ?? "—"}</Text>
          <Text style={styles.row}>Created: {report?.createdAt ? String(report.createdAt) : "—"}</Text>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Moderation Summary</Text>
          <Text style={styles.row}>Moderations: {Array.isArray(report?.moderations) ? report.moderations.length : 0}</Text>
        </View>
        <View>
          <Text style={styles.sectionTitle}>Appeals</Text>
          <Text style={styles.row}>Appeals Count: {Array.isArray(report?.appeals) ? report.appeals.length : 0}</Text>
        </View>
      </Page>
    </Document>
  );
}