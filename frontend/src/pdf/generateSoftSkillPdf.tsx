import { pdf } from "@react-pdf/renderer";
import SoftSkillReportPdf from "./SoftSkillReportPdf";
import type { PdfConfig, PdfData } from "@/types/pdf_soft";

export async function generateSoftSkillPdf(config: PdfConfig, data: PdfData) {
  const blob = await pdf(<SoftSkillReportPdf config={config} data={data} />).toBlob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte-habilidades.pdf";
  a.click();

  URL.revokeObjectURL(url);
}
