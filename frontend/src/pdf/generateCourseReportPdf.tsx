import type { CourseReportPdfData } from "@/types/pdf_courses";

export async function generateCourseReportPdf(data: CourseReportPdfData) {
  const [{ pdf }, { default: CourseReportPdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./CourseReportPdf"),
  ]);

  const blob = await pdf(<CourseReportPdf data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte-cursos.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
