// lib/export.ts
import { Document, Page, Text, View, StyleSheet, pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { format } from "date-fns";

// ✅ Only one pdfStyles declaration in the module
export const pdfStyles = StyleSheet.create({
  page: { padding: 20, fontSize: 11 },
  header: { fontSize: 16, marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 6 },
});

// ----------------------
// PDF Export Function
// ----------------------
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

// ----------------------
// CSV Export Function
// ----------------------
export function exportCSV({
  title,
  data,
  delimiter = ",",
}: {
  title: string;
  data: any[];
  delimiter?: string;
}) {
  if (!data.length) return;

  const headers = Object.keys(data[0]);
  const csvContent =
    [headers.join(delimiter)]
      .concat(
        data.map(row => headers.map(h => `"${row[h] ?? ""}"`).join(delimiter))
      )
      .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  saveAs(blob, `${title}.csv`);
}
