import React from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 12, fontFamily: "Helvetica" },
  h1: { fontSize: 18, marginBottom: 8 },
  h2: { fontSize: 14, marginTop: 12, marginBottom: 6 },
  row: { marginBottom: 4 }
});

export function ReportPDF({ report, timezone, noteTagFilter }: { report: any; timezone: string; noteTagFilter: string | null }) {
  const fmt = (ts: string) => new Date(ts).toLocaleString("en-US", { timeZone: timezone });
  const notes = (report.appeals?.flatMap((a:any)=>a.notes) ?? []).filter((n:any)=>!noteTagFilter || n.tag === noteTagFilter);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.h1}>Permit Report • {report.id}</Text>
        <View style={styles.row}><Text>Status: {report.status}</Text></View>
        <View style={styles.row}><Text>Address: {report.address ?? "—"}</Text></View>
        <View style={styles.row}><Text>Created: {fmt(report.createdAt)}</Text></View>

        <Text style={styles.h2}>Moderation</Text>
        {report.moderations?.length ? report.moderations.map((m:any)=>(
          <View key={m.id} style={styles.row}><Text>- {m.action} • {fmt(m.createdAt)} • {m.note ?? ""}</Text></View>
        )) : <Text style={styles.row}>No moderation actions</Text>}

        <Text style={styles.h2}>Appeals</Text>
        {report.appeals?.length ? report.appeals.map((a:any)=>(
          <View key={a.id} style={styles.row}>
            <Text>- {a.status} • {fmt(a.createdAt)} • {a.reason}</Text>
          </View>
        )) : <Text style={styles.row}>No appeals</Text>}

        <Text style={styles.h2}>Notes {noteTagFilter ? `(tag=${noteTagFilter})` : ""}</Text>
        {notes.length ? notes.map((n:any)=>(
          <View key={n.id} style={styles.row}><Text>- {fmt(n.createdAt)} • {n.content}</Text></View>
        )) : <Text style={styles.row}>No notes</Text>}
      </Page>
    </Document>
  );
}
