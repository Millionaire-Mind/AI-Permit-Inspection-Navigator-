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
  page: { padding: 24 },
  title: { fontSize: 18, marginBottom: 8 },
  row: { marginBottom: 4 }
});

export function ReportPDF(props: { report: any; timezone: string; noteTagFilter: string | null }) {
  const { report } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View>
          <Text style={styles.title}>{report?.title ?? "Report"}</Text>
          <Text style={styles.row}>Status: {report?.status ?? "unknown"}</Text>
          <Text style={styles.row}>Address: {report?.address ?? "—"}</Text>
          <Text style={styles.row}>Created: {report?.createdAt ? String(report.createdAt) : "—"}</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, marginBottom: 6 }}>Moderation Summary</Text>
          <Text style={styles.row}>Moderations: {Array.isArray(report?.moderations) ? report.moderations.length : 0}</Text>
        </View>
        <View style={{ marginTop: 12 }}>
          <Text style={{ fontSize: 14, marginBottom: 6 }}>Appeals</Text>
          <Text style={styles.row}>Appeals Count: {Array.isArray(report?.appeals) ? report.appeals.length : 0}</Text>
        </View>
      </Page>
    </Document>
  );
}