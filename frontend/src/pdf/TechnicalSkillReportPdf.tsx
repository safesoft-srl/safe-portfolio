import { Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";

type PdfConfig = {
  catalog: {
    summary: boolean;
    table: boolean;
    levelChart: boolean;
  };

  filters: {
    status: string;
    category: string;
    usage: string;
    useOrder: string;
    limit: string;
    search: string;
  };
};

type Skill = {
  name: string;
  category: string;
  is_active: boolean;
  uses: number;

  beginner_percentage: number;
  intermediate_percentage: number;
  advanced_percentage: number;
};

type Summary = {
  results: number;
  active: number;
  inactive: number;
  total_uses: number;
};

type PdfData = {
  summary: Summary;
  skills: Skill[];

  images: {
    levelChart: string;
  };
};

type Props = {
  config: PdfConfig;
  data: PdfData;
};

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },

  title: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "bold",
  },

  section: {
    marginBottom: 15,
  },

  subtitle: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: "bold",
  },

  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 4,
  },

  cell: {
    flex: 1,
  },

  header: {
    fontWeight: "bold",
  },

  image: {
    width: 450,
    height: 220,
    marginTop: 8,
  },

  smallImage: {
    width: 420,
    height: 240,
    marginTop: 10,
  },
});

export default function TechnicalSkillReportPdf({ config, data }: Props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* TITLE */}
        <Text style={styles.title}>Reporte de Habilidades Técnicas</Text>

        <Text style={{ fontSize: 9, color: "#666", marginBottom: 12 }}>
          Generado el {new Date().toLocaleDateString()}
        </Text>

        {/* FILTERS */}
        <View style={styles.section}>
          <Text style={styles.subtitle}>Filtros aplicados</Text>

          <Text>Estado: {config.filters.status || "Todos"}</Text>
          <Text>Categoría: {config.filters.category || "Todas"}</Text>
          <Text>Uso: {config.filters.usage || "Todos"}</Text>
          <Text>Orden: {config.filters.useOrder || "desc"}</Text>
          <Text>Límite: {config.filters.limit || "Sin límite"}</Text>
          <Text>Búsqueda: {config.filters.search || "Ninguna"}</Text>
        </View>

        {/* SUMMARY */}
        {config.catalog.summary && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Resumen general</Text>

            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.header]}>Total</Text>
              <Text style={[styles.cell, styles.header]}>Activas</Text>
              <Text style={[styles.cell, styles.header]}>Inactivas</Text>
              <Text style={[styles.cell, styles.header]}>Usos</Text>
            </View>

            <View style={styles.tableRow}>
              <Text style={styles.cell}>{data.summary.results}</Text>
              <Text style={styles.cell}>{data.summary.active}</Text>
              <Text style={styles.cell}>{data.summary.inactive}</Text>
              <Text style={styles.cell}>{data.summary.total_uses}</Text>
            </View>

            <Text style={{ marginTop: 8 }}>Total de habilidades: {data.summary.results}</Text>

            <Text>Activas: {data.summary.active}</Text>

            <Text>Inactivas: {data.summary.inactive}</Text>

            <Text>Total de usos: {data.summary.total_uses}</Text>
          </View>
        )}

        {/* TABLE */}
        {config.catalog.table && (
          <View style={styles.section}>
            <Text style={styles.subtitle}>Listado de habilidades</Text>

            <View style={styles.tableRow}>
              <Text style={[styles.cell, styles.header]}>Nombre</Text>
              <Text style={[styles.cell, styles.header]}>Categoría</Text>
              <Text style={[styles.cell, styles.header]}>Estado</Text>
              <Text style={[styles.cell, styles.header]}>Usos</Text>
            </View>

            {data.skills.map((s, i) => (
              <View key={i} style={styles.tableRow}>
                <Text style={styles.cell}>{s.name}</Text>
                <Text style={styles.cell}>{s.category}</Text>
                <Text style={styles.cell}>{s.is_active ? "Activo" : "Inactivo"}</Text>
                <Text style={styles.cell}>{s.uses}</Text>
              </View>
            ))}
          </View>
        )}

        {/* LEVEL CHART */}
        {config.catalog.levelChart && data.images?.levelChart && (
          <View style={styles.section} wrap={false}>
            <Text style={styles.subtitle}>Distribución de niveles (Top Skills)</Text>

            <Image src={data.images.levelChart} style={styles.smallImage} />
          </View>
        )}
      </Page>
    </Document>
  );
}
