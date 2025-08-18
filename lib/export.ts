import { saveAs } from "file-saver";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { format } from "date-fns";

/**
 * Export data as CSV
 * @param data Array of objects to export
 * @param filename CSV filename
 */
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

/**
 * Export data as PDF
 * @param title PDF title
 * @param data Array of objects
 * @param includeNotes Whether to include notes field
 * @param localizedTimestamps Whether to format date in localized format
 */
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
  // Styles for PDF elements
  const pdfStyles = StyleSheet.create({
    page: { padding: 20, fontSize: 11 },
    header: { fontSize: 16, marginBottom: 8 },
    row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
    note: { fontSize: 10, color: "#555" }
  });

  // Create Document directly
  const doc = (
    <Document>
      <Page style={pdfStyles.page}>
        <Text style={pdfStyles.header}>{title}</Text>
        {data.map((item, idx) => (
          <View key={idx} style={pdfStyles.row}>
            <Text>
              {localizedTimestamps && item.date
                ? format(new Date(item.date), "PPpp")
                : item.date ?? item.title ?? idx}
            </Text>
            <Text>{item.predicted ?? item.count ?? ""}</Text>
            {includeNotes && item.notes && (
              <Text style={pdfStyles.note}>{item.notes}</Text>
            )}
          </View>
        ))}
      </Page>
    </Document>
  );

  // Generate PDF blob and trigger download
  const blob = await pdf(doc).toBlob();
  saveAs(blob, `${title.replace(/\s+/g, "_")}.pdf`);
}
