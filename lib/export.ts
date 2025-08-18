// lib/export.ts
import { Document, Page, Text, StyleSheet } from "@react-pdf/renderer";

// ✅ Only one pdfStyles declaration
const pdfStyles = StyleSheet.create({
  page: { padding: 20, fontSize: 11 },
  header: { fontSize: 16, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
});

interface ReportProps {
  title: string;
  localizedTimestamps?: boolean; // optional
}

export const Report = ({ title }: ReportProps) => (
  <Document>
    <Page style={pdfStyles.page}>
      <Text style={pdfStyles.header}>{title}</Text>
    </Page>
  </Document>
);
