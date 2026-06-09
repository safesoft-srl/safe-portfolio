import type { AcademicReportPdfData } from "@/types/pdf_academic";

export async function generateAcademicReportPdf(data: AcademicReportPdfData) {
  const [{ pdf }, { default: AcademicReportPdf }] = await Promise.all([
    import("@react-pdf/renderer"),
    import("./AcademicReportPdf"),
  ]);

  const blob = await pdf(<AcademicReportPdf data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte-formacion.pdf";
  a.click();
  URL.revokeObjectURL(url);
}
