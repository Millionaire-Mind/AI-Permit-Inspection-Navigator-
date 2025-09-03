import React from "react";
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

export type ReportPdfProps = {
  title?: string;
  status?: string;
  projectName?: string;
  createdAt?: string;
};

const styles = StyleSheet.create({
  page: { padding: 24 },
  title: { fontSize: 18, marginBottom: 8 },
  row: { marginBottom: 4 },
  label: { fontSize: 12, color: '#444' },
  value: { fontSize: 12 },
});

export function ReportPDF(props: ReportPdfProps) {
  const { title = "Report", status = "unknown", projectName = "—", createdAt = "—" } = props;
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Status: </Text>
          <Text style={styles.value}>{status}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Project: </Text>
          <Text style={styles.value}>{projectName}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Created: </Text>
          <Text style={styles.value}>{createdAt}</Text>
        </View>
      </Page>
    </Document>
  );
}