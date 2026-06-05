import { pdf } from "@react-pdf/renderer";
import TechnicalSkillReportPdf from "./TechnicalSkillReportPdf";
import type { TechnicalPdfConfig, TechnicalPdfData } from "@/types/pdf_technical";

export async function generateTechnicalSkillPdf(
  config: TechnicalPdfConfig,
  data: TechnicalPdfData
) {
  const blob = await pdf(<TechnicalSkillReportPdf config={config} data={data} />).toBlob();

  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "reporte-tecnico.pdf";
  a.click();

  URL.revokeObjectURL(url);
}
