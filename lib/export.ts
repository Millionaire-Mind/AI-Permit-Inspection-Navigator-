// lib/export.ts
import { saveAs } from "file-saver";
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { format } from "date-fns";

/**
 * Export data as CSV
 * @param data Array of objects to export
 * @param filename Name of the CSV file
 */
export function exportCSV(data: any[], filename = "export.csv") {
  if (!data || data.length === 0) {
    const blob = new Blob([""], { type: "text/csv" });
    saveAs(blob, filename);
    return;
  }

  const keys = Object.keys(data[0]);
  const rows = data.map((d) =>
    keys.map((k) => JSON.stringify(d[k] ?? "")).join(",")
  );
  const csv = [keys.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  saveAs(blob, filename);
}

/**
 * Export data as PDF
 * @param param0 Object containing title, data, and options
 */
export async function exportPDF({
  title,
  data,
  includeNotes = false,
  localizedTimestamps = false,
}: {
  title: string;
  data: any[];
  includeNotes?: boolean;
  localizedTimestamps?: boolean;
}) {
  // ✅ Only one pdfStyles declaration
  const pdfStyles = StyleSheet.create({
    page: { padding: 20, fontSize: 11 },
    header: { fontSize: 16, marginBottom: 8 },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 6,
    },
  });

  const Report = () => (
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
            {includeNotes && item.notes && <Text>{item.notes}</Text>}
          </View>
        ))}
      </Page>
    </Document>
  );

  const blob = await pdf(<Report />).toBlob();
  saveAs(blob, `${title}.pdf`);
}
