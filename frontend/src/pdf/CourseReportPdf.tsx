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
  // Distribución calculada para las 6 columnas (Total: 100%)
  dateColumn: {
    width: "13%",
  },
  userColumn: {
    width: "17%",
  },
  titleColumn: {
    width: "22%",
  },
  areaColumn: {
    width: "15%",
  },
  institutionColumn: {
    width: "20%",
  },
  levelColumn: {
    width: "13%",
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

const formatDate = (value: string | null | undefined) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
};

export default function CourseReportPdf({ data }: Props) {
  // Verifica si el filtro de área contiene texto
  const hasAreaFilter = data.filters?.area && data.filters.area.trim().length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Cursos realizados</Text>
        <Text style={styles.meta}>
          Reporte generado el {new Date(data.generatedAt).toLocaleString("es-ES")}
        </Text>
        <Text style={styles.meta}>
          De: {data.filters.dateFrom || "-"} a: {data.filters.dateTo || "-"}
        </Text>

        <View style={styles.section}>
          {/* El subtítulo solo se renderiza si se filtró por un área específica */}
          {hasAreaFilter && <Text style={styles.subtitle}>{data.filters.area}</Text>}

          <View style={styles.table}>
            {/* Encabezado ordenado según los requerimientos */}
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cellBase, styles.dateColumn, styles.headerCell]}>Fecha</Text>
              <Text style={[styles.cellBase, styles.userColumn, styles.headerCell]}>Nombre</Text>
              <Text style={[styles.cellBase, styles.titleColumn, styles.headerCell]}>Título</Text>
              <Text style={[styles.cellBase, styles.areaColumn, styles.headerCell]}>Área</Text>
              <Text style={[styles.cellBase, styles.institutionColumn, styles.headerCell]}>
                Institución
              </Text>
              <Text style={[styles.cellBase, styles.levelColumn, styles.headerCell]}>Nivel</Text>
            </View>

            {data.courses.length === 0 ? (
              <Text style={styles.empty}>No se encontraron cursos con los filtros aplicados.</Text>
            ) : (
              data.courses.map((c) => (
                <View key={c.id} style={styles.row}>
                  <Text style={[styles.cellBase, styles.dateColumn]}>
                    {formatDate(c.certificate_date ?? c.created_at)}
                  </Text>
                  <Text style={[styles.cellBase, styles.userColumn]}>{c.user_name || "—"}</Text>
                  <Text style={[styles.cellBase, styles.titleColumn]}>{c.title}</Text>
                  <Text style={[styles.cellBase, styles.areaColumn]}>{c.area || "—"}</Text>
                  <Text style={[styles.cellBase, styles.institutionColumn]}>
                    {c.institution_name || "—"}
                  </Text>
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
