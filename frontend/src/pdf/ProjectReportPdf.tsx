import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import type { ProjectReportPdfData } from "@/types/pdf_projects";

type Props = {
  data: ProjectReportPdfData;
};

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
    borderWidth: 0,
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
  nameColumn: {
    width: "55%",
  },
  skillsColumn: {
    width: "30%",
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

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const formatProjectFilters = (filters: ProjectReportPdfData["filters"]) => {
  const activeFilters: Array<{ label: string; value: string }> = [];

  if (filters.createdPeriod && filters.createdPeriod !== "custom") {
    activeFilters.push({ label: "Período de creación: ", value: filters.createdPeriod });
  }

  if (filters.dateFrom || filters.dateTo) {
    activeFilters.push({ 
      label: "Rango de fechas: ", 
      value: `de ${filters.dateFrom || "-"} a ${filters.dateTo || "-"}` 
    });
  }

  if (filters.selectedSkills.length > 0) {
    activeFilters.push({ label: "Tecnologías: ", value: filters.selectedSkills.join(", ") });
  }

  return activeFilters;
};

const getTechnologiesLabel = (project: ProjectReportPdfData["projects"][number]) => {
  if (!Array.isArray(project.skill_projects) || project.skill_projects.length === 0) {
    return "—";
  }

  return project.skill_projects.map((skill) => skill.name).join(", ");
};

export default function ProjectReportPdf({ data }: Props) {
  const filters = formatProjectFilters(data.filters);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Proyectos registrados</Text>
        <Text style={styles.meta}>
          Reporte generado el {new Date(data.generatedAt).toLocaleString("es-ES")}
        </Text>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Filtros aplicados</Text>
          
          {filters.length === 0 ? (
            <Text style={styles.filterText}>
              Sin filtros aplicados. Se listan todos los proyectos registrados.
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
          <Text style={styles.subtitle}>Lista de proyectos registrados</Text>
          <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cellBase, styles.nameColumn, styles.headerCell]}>Nombre del proyecto</Text>
              <Text style={[styles.cellBase, styles.skillsColumn, styles.headerCell]}>Tecnologías usadas</Text>
              <Text style={[styles.cellBase, styles.dateColumn, styles.headerCell]}>Fecha</Text>
            </View>

            {data.projects.length === 0 ? (
              <Text style={styles.empty}>No se encontraron proyectos con los filtros aplicados.</Text>
            ) : (
              data.projects.map((project) => (
                <View key={project.id} style={styles.row}>
                  <Text style={[styles.cellBase, styles.nameColumn]}>{project.name}</Text>
                  <Text style={[styles.cellBase, styles.skillsColumn]}>{getTechnologiesLabel(project)}</Text>
                  <Text style={[styles.cellBase, styles.dateColumn]}>{formatDate(project.start_date ?? project.created_at)}</Text>
                </View>
              ))
            )}
          </View>

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total proyectos: </Text>
            <Text style={styles.totalCount}>{data.projects.length}</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
