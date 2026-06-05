import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

type CatalogConfig = {
  summary: boolean;
  table: boolean;
  usageChart: boolean;
  statusChart: boolean;
};
type RequestConfig = { table: boolean; chart: boolean };
type PdfConfig = {
  catalog: CatalogConfig;
  requests: RequestConfig;

  filters: {
    status: string;
    useOrder: string;
    limit: string;
    createdPeriod: string;
    dateFrom: string;
    dateTo: string;

    requestStatus: string;
    requestOrder: string;
    requestLimit: string;
    requestCreatedPeriod: string;
    requestDateFrom: string;
    requestDateTo: string;
  };
};

type Skill = { name: string; is_active: boolean; uses: number };
type Request = {
  name: string;
  status: "pending" | "approved" | "rejected";
  requests_count: number;
};
type Summary = { results: number; active: number; inactive: number; total_uses: number };

type PdfData = {
  summary: Summary;
  skills: Skill[];
  requests: Request[];
  images: { usage: string; status: string; requests: string };
};

type Props = { config: PdfConfig; data: PdfData };

const styles = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  title: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  section: { marginBottom: 15 },
  subtitle: { fontSize: 12, marginBottom: 6, fontWeight: "bold" },
  tableRow: { flexDirection: "row", borderBottom: "1px solid #ccc", paddingVertical: 4 },
  cell: { flex: 1 },
  header: { fontWeight: "bold" },
  image: { width: 450, height: 220, marginTop: 8 },
});

const stylestorta = StyleSheet.create({
  page: { padding: 20, fontSize: 10 },
  title: { fontSize: 16, marginBottom: 10, fontWeight: "bold" },
  section: { marginBottom: 15 },
  subtitle: { fontSize: 12, marginBottom: 6, fontWeight: "bold" },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 4,
  },
  cell: { flex: 1 },
  header: { fontWeight: "bold" },

  image: {
    width: 450,
    height: 220,
    marginTop: 8,
  },

  pieImage: {
    width: 250,
    height: 250,
    marginTop: 8,
    alignSelf: "center",
  },
});

export default function SoftSkillReportPdf({ config, data }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Moderación de Habilidades Blandas</Text>

        <Text
          style={{
            fontSize: 9,
            color: "#666",
            marginBottom: 12,
          }}
        >
          Generado el {new Date().toLocaleDateString()}
        </Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Filtros aplicados</Text>

          <Text>Estado habilidades: {config.filters.status || "Todos"}</Text>
          <Text>Orden por uso: {config.filters.useOrder || "Sin orden"}</Text>
          <Text>Límite catálogo: {config.filters.limit || "Sin límite"}</Text>
          <Text>Período catálogo: {config.filters.createdPeriod || "Todos"}</Text>

          {(config.filters.dateFrom || config.filters.dateTo) && (
            <Text>
              Rango catálogo: {config.filters.dateFrom || "-"} a {config.filters.dateTo || "-"}
            </Text>
          )}

          <Text style={{ marginTop: 5 }}>
            Estado solicitudes: {config.filters.requestStatus || "Todos"}
          </Text>

          <Text>Orden solicitudes: {config.filters.requestOrder || "Sin orden"}</Text>

          <Text>Límite solicitudes: {config.filters.requestLimit || "Sin límite"}</Text>

          <Text>Período solicitudes: {config.filters.requestCreatedPeriod || "Todos"}</Text>

          {(config.filters.requestDateFrom || config.filters.requestDateTo) && (
            <Text>
              Rango solicitudes: {config.filters.requestDateFrom || "-"} a{" "}
              {config.filters.requestDateTo || "-"}
            </Text>
          )}
        </View>

        {/* SUMMARY */}
        {config.catalog.summary && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Resumen general del catálogo</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.header]}>Total</Text>
              <Text style={[styles.cell, styles.header]}>Activas</Text>
              <Text style={[styles.cell, styles.header]}>Inactivas</Text>
              <Text style={[styles.cell, styles.header]}>Uso</Text>
            </View>
            <View style={styles.tableRow}>
              <Text style={styles.cell}>{data.summary.results}</Text>
              <Text style={styles.cell}>{data.summary.active}</Text>
              <Text style={styles.cell}>{data.summary.inactive}</Text>
              <Text style={styles.cell}>{data.summary.total_uses}</Text>
            </View>
            <Text style={{ marginTop: 8 }}>
              El catálogo contiene {data.summary.results} habilidades registradas.
            </Text>

            <Text>Habilidades activas: {data.summary.active}.</Text>

            <Text>Habilidades inactivas: {data.summary.inactive}.</Text>

            <Text>Total de usos registrados: {data.summary.total_uses}.</Text>
          </View>
        )}

        {/* SKILLS TABLE */}
        {config.catalog.table && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Listado de habilidades</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.header]}>Nombre</Text>
              <Text style={[styles.cell, styles.header]}>Estado</Text>
              <Text style={[styles.cell, styles.header]}>Usos</Text>
            </View>
            {data.skills.map((s, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{s.name}</Text>
                <Text style={styles.cell}>{s.is_active ? "Activo" : "Inactivo"}</Text>
                <Text style={styles.cell}>{s.uses}</Text>
              </View>
            ))}
          </View>
        )}

        {/* USAGE CHART */}

        {config.catalog.usageChart && data.images?.usage && (
          <View break wrap={false} style={styles.section}>
            <Text style={styles.subtitle}>Frecuencia de uso</Text>
            <Image src={data.images.usage} style={styles.image} />
          </View>
        )}

        {/* STATUS CHART */}
        {config.catalog.statusChart && data.images?.status && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.subtitle}>Estado de habilidades</Text>
            <Image src={data.images.status} style={stylestorta.pieImage} />
          </View>
        )}

        {/* REQUESTS TABLE */}
        {config.requests.table && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Solicitudes de habilidades</Text>
            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.header]}>Nombre</Text>
              <Text style={[styles.cell, styles.header]}>Estado</Text>
              <Text style={[styles.cell, styles.header]}>Cantidad</Text>
            </View>
            {data.requests.map((r, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{r.name}</Text>
                <Text style={styles.cell}>{r.status}</Text>
                <Text style={styles.cell}>{r.requests_count}</Text>
              </View>
            ))}
          </View>
        )}

        {/* REQUESTS CHART */}
        {config.requests.chart && data.images?.requests && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.subtitle}>Gráfico de solicitudes</Text>
            <Image src={data.images.requests} style={styles.image} />
          </View>
        )}
      </Page>
    </Document>
  );
}
