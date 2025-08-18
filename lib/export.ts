import { saveAs } from "file-saver";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { format } from "date-fns";

export function exportCSV(data: any[], filename = "export.csv") {
  if (!data || data.length === 0) {
    const blob = new Blob([""], { type: "text/csv" });
    saveAs(blob, filename);
    return;
  }
  const keys = Object.keys(data[0]);
  const rows = data.map((d) =>
    keys.map((k) => JSON.stringify((d as any)[k] ?? "")).join(",")
  );
  const csv = [keys.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  saveAs(blob, filename);
}

export async function exportPDF({
  title,
  data,
  includeNotes = false,
  localizedTimestamps = false
}: {
  title: string;
  data: any[];
  includeNotes?: boolean;
  localizedTimestamps?: boolean;
}) {
  // Renamed variable to avoid redeclaration error
  const pdfStyles = StyleSheet.create({
    page: { padding: 20, fontSize: 11 },
    header: { fontSize: 16, marginBottom: 8 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    note: { fontSize: 10, color: "#555" }
  });

  const Report = () => (
    <Document>
      <Page style={pdfStyles.page}>
        <Text style
