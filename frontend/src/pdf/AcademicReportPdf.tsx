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
  dateColumn: {
    width: "15%",
  },
  userColumn: {
    width: "25%",
  },
  titleColumn: {
    width: "15%",
  },
  fieldColumn: {
    width: "20%",
  },
  institutionColumn: {
    width: "30%",
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

  const parts = value.split("-");
  if (parts.length !== 3) return "—";

  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const date = new Date(year, month, day);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

export default function AcademicReportPdf({ data }: Props) {
  const hasTitleFilter = data.filters?.title && data.filters.title.trim().length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Grados académicos</Text>
        <Text style={styles.meta}>
          Reporte generado el {new Date(data.generatedAt).toLocaleString("es-ES")}
        </Text>
        <Text style={styles.meta}>
          De: {data.filters.dateFrom || "-"} a: {data.filters.dateTo || "-"}
        </Text>

        <View style={styles.section}>
          {/* El subtítulo solo se renderiza si se filtró por un título específico */}
          {hasTitleFilter && <Text style={styles.subtitle}>{data.filters.title}</Text>}

          <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cellBase, styles.dateColumn, styles.headerCell]}>Fecha</Text>
              <Text style={[styles.cellBase, styles.userColumn, styles.headerCell]}>
                Nombre del usuario
              </Text>
              <Text style={[styles.cellBase, styles.titleColumn, styles.headerCell]}>Título</Text>
              <Text style={[styles.cellBase, styles.fieldColumn, styles.headerCell]}>
                Campo de estudio
              </Text>
              <Text style={[styles.cellBase, styles.institutionColumn, styles.headerCell]}>
                Institución
              </Text>
            </View>

            {data.academics.length === 0 ? (
              <Text style={styles.empty}>No se encontraron grados con los filtros aplicados.</Text>
            ) : (
              data.academics.map((a) => (
                <View key={a.id} style={styles.row}>
                  <Text style={[styles.cellBase, styles.dateColumn]}>{formatDate(a.end_date)}</Text>
                  <Text style={[styles.cellBase, styles.userColumn]}>
                    {a.portfolio.profile_name || "—"}
                  </Text>
                  <Text style={[styles.cellBase, styles.titleColumn]}>{a.title}</Text>
                  <Text style={[styles.cellBase, styles.fieldColumn]}>
                    {a.field_of_study || "—"}
                  </Text>
                  <Text style={[styles.cellBase, styles.institutionColumn]}>
                    {a.institution_name || "—"}
                  </Text>
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
