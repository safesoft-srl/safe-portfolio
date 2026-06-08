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
  dateColumn: {
    width: "15%",
  },
  userColumn: {
    width: "25%",
  },
  emailColumn: {
    width: "30%",
  },
  nameColumn: {
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

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
};

const getUserName = (project: ProjectReportPdfData["projects"][number]) => {
  return project.user_name || "—";
};

const getUserEmail = (project: ProjectReportPdfData["projects"][number]) => {
  return project.user_email || "—";
};

export default function ProjectReportPdf({ data }: Props) {
  const hasSkills = data.filters?.selectedSkills && data.filters.selectedSkills.length > 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Reporte de Proyectos</Text>
        <Text style={styles.meta}>
          Reporte generado el {new Date(data.generatedAt).toLocaleString("es-ES")}
        </Text>
        <Text style={styles.meta}>
          De: {data.filters.dateFrom || "/"} a: {data.filters.dateTo || "/"}
        </Text>

        <View style={styles.section}>
          {hasSkills && (
            <Text style={styles.subtitle}>{data.filters.selectedSkills.join(", ")}</Text>
          )}

          <View style={styles.table}>
            <View style={[styles.row, styles.headerRow]}>
              <Text style={[styles.cellBase, styles.dateColumn, styles.headerCell]}>Fecha</Text>
              <Text style={[styles.cellBase, styles.userColumn, styles.headerCell]}>
                Nombre del usuario
              </Text>
              <Text style={[styles.cellBase, styles.emailColumn, styles.headerCell]}>
                Correo del usuario
              </Text>
              <Text style={[styles.cellBase, styles.nameColumn, styles.headerCell]}>
                Nombre del proyecto
              </Text>
            </View>

            {data.projects.length === 0 ? (
              <Text style={styles.empty}>
                No se encontraron proyectos con los filtros aplicados.
              </Text>
            ) : (
              data.projects.map((project) => (
                <View key={project.id} style={styles.row}>
                  <Text style={[styles.cellBase, styles.dateColumn]}>
                    {formatDate(project.start_date ?? project.created_at)}
                  </Text>
                  <Text style={[styles.cellBase, styles.userColumn]}>{getUserName(project)}</Text>
                  <Text style={[styles.cellBase, styles.emailColumn]}>{getUserEmail(project)}</Text>
                  <Text style={[styles.cellBase, styles.nameColumn]}>{project.name}</Text>
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
