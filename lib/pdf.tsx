import React from "react";
import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

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
  page: { padding: 28, fontSize: 11, color: '#0f172a', fontFamily: 'Helvetica' },
  masthead: { backgroundColor: '#0c4a6e', color: '#fff', padding: 12, borderRadius: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  logoWrap: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logo: { width: 24, height: 24 },
  brand: { fontSize: 18, fontWeight: 700 },
  mutedOnDark: { color: '#e2e8f0', fontSize: 10 },
  section: { marginTop: 14, paddingTop: 8 },
  sectionTitle: { fontSize: 13, color: '#0c4a6e', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 4, fontWeight: 700 },
  row: { marginTop: 4 },
  card: { borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 6, padding: 10, marginTop: 8 },
  grid2: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
});

export function ReportPDF(props: { report: any; timezone: string; noteTagFilter: string | null }) {
  const { report } = props;
  const logoSrc = (process.env.NEXT_PUBLIC_PDF_LOGO_URL || process.env.PDF_LOGO_URL) ? String(process.env.NEXT_PUBLIC_PDF_LOGO_URL || process.env.PDF_LOGO_URL) : undefined;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.masthead}>
          <View style={styles.logoWrap}>
            {logoSrc ? <Image src={logoSrc} style={styles.logo} /> : <View style={styles.logo} />}
            <Text style={styles.brand}>PermitIQ</Text>
          </View>
          <Text style={styles.mutedOnDark}>Generated {new Date().toLocaleDateString()}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Report Summary</Text>
          <View style={[styles.card, styles.grid2]}>
            <View style={styles.col}>
              <Text>Title: {report?.title ?? "Report"}</Text>
              <Text>Status: {report?.status ?? "unknown"}</Text>
              <Text>Address: {report?.address ?? "—"}</Text>
            </View>
            <View style={styles.col}>
              <Text>Created: {report?.createdAt ? String(report.createdAt) : "—"}</Text>
              <Text>Owner: {report?.userId ?? "—"}</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Moderation Summary</Text>
          <View style={styles.card}>
            <Text>Moderations: {Array.isArray(report?.moderations) ? report.moderations.length : 0}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Appeals</Text>
          <View style={styles.card}>
            <Text>Appeals Count: {Array.isArray(report?.appeals) ? report.appeals.length : 0}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}