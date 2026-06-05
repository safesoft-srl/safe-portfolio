import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { CourseReportPdfData } from "@/types/pdf_courses";

type Props = { data: CourseReportPdfData };

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
    width: "35%",
  },
  areaColumn: {
    width: "25%",
  },
  institutionColumn: {
    width: "25%",
  },
  levelColumn: {
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

const formatCourseFilters = (f: CourseReportPdfData["filters"]) => {
  const out: Array<{ label: string; value: string }> = [];
  if (f.institution) out.push({ label: "Institución: ", value: f.institution });
  if (f.level) out.push({ label: "Nivel: ", value: f.level });
  return out;
};

export default function CourseReportPdf({ data }: Props) {
  const filters = formatCourseFilters(data.filters);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Cursos realizados</Text>
        <Text style={styles.meta}>Reporte generado el {new Date(data.generatedAt).toLocaleString("es-ES")}</Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Filtros aplicados</Text>
          {filters.length === 0 ? (
            <Text style={styles.filterText}>
              Sin filtros aplicados. Se muestran todos los cursos registrados.
            </Text>
          ) : (
            filters.map((filter, index) => (
              <Text key={index} style={styles.filterText}>
                <Text style={styles.filterBold}>{filter.label}</Text>
                {filter.value}
              </Text>
            ))
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Listado de cursos</Text>
          <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cellBase, styles.titleColumn, styles.headerCell]}>Título</Text>
              <Text style={[styles.cellBase, styles.areaColumn, styles.headerCell]}>Área</Text>
              <Text style={[styles.cellBase, styles.institutionColumn, styles.headerCell]}>Institución</Text>
              <Text style={[styles.cellBase, styles.levelColumn, styles.headerCell]}>Nivel</Text>
            </View>

            {data.courses.length === 0 ? (
              <Text style={styles.empty}>No se encontraron cursos con los filtros aplicados.</Text>
            ) : (
              data.courses.map((c) => (
                <View key={c.id} style={styles.row}>
                  <Text style={[styles.cellBase, styles.titleColumn]}>{c.title}</Text>
                  <Text style={[styles.cellBase, styles.areaColumn]}>{c.area || "—"}</Text>
                  <Text style={[styles.cellBase, styles.institutionColumn]}>{c.institution_name || "—"}</Text>
                  <Text style={[styles.cellBase, styles.levelColumn]}>{c.level || "—"}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total cursos: </Text>
            <Text style={styles.totalCount}>{data.courses.length}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
