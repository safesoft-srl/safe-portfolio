import type { ProjectReportPdfData } from "@/types/pdf_projects";

export async function generateProjectReportPdf(data: ProjectReportPdfData) {
  const [{ pdf }, { default: ProjectReportPdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./ProjectReportPdf"),
  ]);

  const blob = await pdf(<ProjectReportPdf data={data} />).toBlob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte-proyectos.pdf";
  a.click();

  URL.revokeObjectURL(url);
}