import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import type {
  WorkExperienceReportData,
  WorkExperienceReportParams,
} from "@/features/experiences/hooks/useExperienceReport";

type Props = {
  data: WorkExperienceReportData;
  filters: WorkExperienceReportParams;
};

const styles = StyleSheet.create({
  page: { padding: 30, fontSize: 10, fontFamily: "Helvetica" },
  headerContainer: {
    borderBottom: "2px solid #1a1a2e",
    paddingBottom: 10,
    marginBottom: 20,
  },
  title: { fontSize: 18, fontWeight: "bold", color: "#1a1a2e" },
  subtitle: { fontSize: 9, color: "#666", marginTop: 4 },
  section: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "#f4f4f5",
    padding: 5,
    color: "#1a1a2e",
  },
  filterText: { fontSize: 10, marginBottom: 4, color: "#3f3f46" },

  // Cards
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  card: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 4,
  },
  cardTitle: { color: "#a1a1aa", fontSize: 9, marginBottom: 4 },
  cardValue: { color: "#ffffff", fontSize: 16, fontWeight: "bold" },

  // Tables
  table: {
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: "auto", flexDirection: "row" },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e4e4e7",
    backgroundColor: "#f4f4f5",
    padding: 5,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderBottomWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e4e4e7",
    padding: 5,
  },
  tableCellHeader: { fontSize: 10, fontWeight: "bold" },
  tableCell: { fontSize: 9 },

  // Detailed Table
  colUser: { width: "25%" },
  colCompany: { width: "25%" },
  colPosition: { width: "25%" },
  colDate: { width: "25%" },

  flexRow: { flexDirection: "row", justifyContent: "space-between" },
});

const getPeriodLabel = (p?: string) => {
  if (p === "week") return "Última Semana";
  if (p === "month") return "Último Mes";
  if (p === "year") return "Último Año";
  return "Histórico Completo";
};

const getStatusLabel = (s?: string) => {
  if (s === "current") return "Trabajos Actuales";
  if (s === "past") return "Trabajos Pasados";
  return "Todos los Estados";
};

export default function WorkExperienceReportPdf({ data, filters }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Reporte de Experiencias Laborales</Text>
          <Text style={styles.subtitle}>
            Plataforma Safe Portfolio | Generado el {new Date().toLocaleDateString()}
          </Text>
        </View>

        {/* FILTERS */}
        <View style={styles.section}>
          <Text style={styles.filterText}>Filtro de Estado: {getStatusLabel(filters.status)}</Text>
          <Text style={styles.filterText}>Período: {getPeriodLabel(filters.created_period)}</Text>
          {(filters.date_from || filters.date_to) && (
            <Text style={styles.filterText}>
              Rango de Fechas: {filters.date_from || "-"} a {filters.date_to || "-"}
            </Text>
          )}
        </View>

        {/* SUMMARY CARDS */}
        <View style={styles.summaryContainer}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Experiencias</Text>
            <Text style={styles.cardValue}>{data.summary.total_experiences}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Trabajos Actuales</Text>
            <Text style={styles.cardValue}>{data.summary.currently_working}</Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Trabajos Pasados</Text>
            <Text style={styles.cardValue}>{data.summary.past_jobs}</Text>
          </View>
        </View>

        {/* TOP 10 LISTS */}
        <View style={styles.flexRow}>
          {/* Top Positions */}
          <View style={{ width: "48%" }}>
            <Text style={styles.sectionTitle}>Cargos más comunes</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, { width: "70%" }]}>
                  <Text style={styles.tableCellHeader}>Cargo</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "30%" }]}>
                  <Text style={styles.tableCellHeader}>Usuarios</Text>
                </View>
              </View>
              {data.top_positions.map((p, i) => (
                <View style={styles.tableRow} key={i}>
                  <View style={[styles.tableCol, { width: "70%" }]}>
                    <Text style={styles.tableCell}>{p.position}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "30%" }]}>
                    <Text style={styles.tableCell}>{p.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Top Companies */}
          <View style={{ width: "48%" }}>
            <Text style={styles.sectionTitle}>Empresas Frecuentes</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <View style={[styles.tableColHeader, { width: "70%" }]}>
                  <Text style={styles.tableCellHeader}>Empresa</Text>
                </View>
                <View style={[styles.tableColHeader, { width: "30%" }]}>
                  <Text style={styles.tableCellHeader}>Usuarios</Text>
                </View>
              </View>
              {data.top_companies.map((c, i) => (
                <View style={styles.tableRow} key={i}>
                  <View style={[styles.tableCol, { width: "70%" }]}>
                    <Text style={styles.tableCell}>{c.company}</Text>
                  </View>
                  <View style={[styles.tableCol, { width: "30%" }]}>
                    <Text style={styles.tableCell}>{c.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* DETAILED LIST */}
        <View style={{ marginTop: 30 }}>
          <Text style={styles.sectionTitle}>Registro Detallado (Últimos añadidos)</Text>
          <View style={styles.table}>
            <View style={styles.tableRow}>
              <View style={[styles.tableColHeader, styles.colUser]}>
                <Text style={styles.tableCellHeader}>Usuario</Text>
              </View>
              <View style={[styles.tableColHeader, styles.colCompany]}>
                <Text style={styles.tableCellHeader}>Empresa</Text>
              </View>
              <View style={[styles.tableColHeader, styles.colPosition]}>
                <Text style={styles.tableCellHeader}>Cargo</Text>
              </View>
              <View style={[styles.tableColHeader, styles.colDate]}>
                <Text style={styles.tableCellHeader}>Duración</Text>
              </View>
            </View>
            {data.detailed_list.map((item) => (
              <View style={styles.tableRow} key={item.id}>
                <View style={[styles.tableCol, styles.colUser]}>
                  <Text style={styles.tableCell}>{item.user_name}</Text>
                </View>
                <View style={[styles.tableCol, styles.colCompany]}>
                  <Text style={styles.tableCell}>{item.company}</Text>
                </View>
                <View style={[styles.tableCol, styles.colPosition]}>
                  <Text style={styles.tableCell}>{item.position}</Text>
                </View>
                <View style={[styles.tableCol, styles.colDate]}>
                  <Text style={styles.tableCell}>
                    {item.start_date || "?"} - {item.is_current ? "Presente" : item.end_date || "?"}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  );
}
