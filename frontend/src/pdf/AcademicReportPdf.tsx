import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { AcademicReportPdfData } from "@/types/pdf_academic";

type Props = { data: AcademicReportPdfData };

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 28,
    fontSize: 10,
    color: "#111827",
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 8,
  },
  meta: {
    fontSize: 9,
    color: "#4b5563",
    textAlign: "center",
    marginBottom: 14,
  },
  section: {
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 700,
    marginBottom: 6,
  },
  filterText: {
    marginBottom: 2,
    lineHeight: 1.1,
    color: "#4b5563", 
  },
  filterBold: {
    fontWeight: 700,
    color: "#111827",
  },
  table: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    minHeight: 26,
  },
  headerRow: {
    backgroundColor: "#ffffff", 
  },
  cellBase: {
    paddingVertical: 6,
    paddingHorizontal: 6,
  },
  titleColumn: {
    width: "20%",
  },
  fieldColumn: {
    width: "25%",
  },
  institutionColumn: {
    width: "40%",
  },
  dateColumn: {
    width: "15%",
    textAlign: "center", 
  },
  headerCell: {
    color: "#111827",
    fontWeight: 700,
  },
  empty: {
    paddingVertical: 12,
    textAlign: "center",
    color: "#6b7280",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
    fontSize: 10,
  },
  totalText: {
    color: "#4b5563",
  },
  totalCount: {
    fontWeight: 700,
    color: "#111827",
  },
});

const formatDate = (value: string | null) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-ES", { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);
};

export default function AcademicReportPdf({ data }: Props) {
  const filter = data.filters.institution 
    ? { label: "Institución: ", value: data.filters.institution } 
    : null;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Grados académicos registrados</Text>
        <Text style={styles.meta}>Reporte generado el {new Date(data.generatedAt).toLocaleString("es-ES")}</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Filtros aplicados</Text>
          {!filter ? (
            <Text style={styles.filterText}>
              Sin filtros aplicados. Se muestran todos los grados registrados.
            </Text>
          ) : (
            <Text style={styles.filterText}>
              <Text style={styles.filterBold}>{filter.label}</Text>
              {filter.value}
            </Text>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Listado de grados</Text>
          <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cellBase, styles.titleColumn, styles.headerCell]}>Título</Text>
              <Text style={[styles.cellBase, styles.fieldColumn, styles.headerCell]}>Campo de estudio</Text>
              <Text style={[styles.cellBase, styles.institutionColumn, styles.headerCell]}>Institución</Text>
              <Text style={[styles.cellBase, styles.dateColumn, styles.headerCell]}>Fecha</Text>
            </View>

            {data.academics.length === 0 ? (
              <Text style={styles.empty}>No se encontraron grados con los filtros aplicados.</Text>
            ) : (
              data.academics.map((a) => (
                <View key={a.id} style={styles.row}>
                  <Text style={[styles.cellBase, styles.titleColumn]}>{a.title}</Text>
                  <Text style={[styles.cellBase, styles.fieldColumn]}>{a.field_of_study || "—"}</Text>
                  <Text style={[styles.cellBase, styles.institutionColumn]}>{a.institution_name || "—"}</Text>
                  <Text style={[styles.cellBase, styles.dateColumn]}>{formatDate(a.created_at)}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total formaciones: </Text>
            <Text style={styles.totalCount}>{data.academics.length}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
