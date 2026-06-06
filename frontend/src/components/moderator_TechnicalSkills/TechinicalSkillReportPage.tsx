import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

import TechnicalSkillReportFilters from "@/components/moderator_TechnicalSkills/report/TechnicalSkillReportFilters";
import TechnicalSkillReportSummary from "@/components/moderator_TechnicalSkills/report/TechnicalSkillReportSummary";
import TechnicalSkillReportTable from "@/components/moderator_TechnicalSkills/report/TechnicalSkillReportTable";
import TechnicalSkillLevelDistributionChart from "@/components/moderator_TechnicalSkills/graphics/TechnicalSkillLevelDistributionChart";

import PdfConfigModal from "@/components/moderator_TechnicalSkills/report/PdfConfigModal";
import { generateTechnicalSkillPdf } from "@/pdf/generateTechnicalSkillPdf";
import type { TechnicalPdfConfig } from "@/types/pdf_technical";

const API_URL = import.meta.env.VITE_API_URL;

type TechnicalSkillReport = {
  id: number;
  name: string;
  category: string;
  is_active: boolean;
  uses: number;
  created_at: string;

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

export default function TechnicalSkillReportPage() {
  const token = localStorage.getItem("token");

  const [loading, setLoading] = useState(true);

  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [usage, setUsage] = useState("");
  const [useOrder, setUseOrder] = useState("desc");
  const [limit, setLimit] = useState("20");
  const [search, setSearch] = useState("");

  const [summary, setSummary] = useState<Summary>({
    results: 0,
    active: 0,
    inactive: 0,
    total_uses: 0,
  });

  const [skills, setSkills] = useState<TechnicalSkillReport[]>([]);

  const [reportView, setReportView] = useState({
    summary: true,
    table: true,
    levelChart: true,
  });

  const [pdfConfig, setPdfConfig] = useState<TechnicalPdfConfig>({
    catalog: {
      summary: true,
      table: true,
      levelChart: true,
    },
    filters: {
      status: "",
      category: "",
      usage: "",
      useOrder: "",
      limit: "",
      search: "",
    },
  });

  // PDF
  const [pdfOpen, setPdfOpen] = useState(false);
  //  const [pdfConfig, setPdfConfig] = useState<TechnicalPdfConfig | null>(null);

  const [levelChartImg, setLevelChartImg] = useState("");

  const waitForImages = async () => {
    for (let i = 0; i < 10; i++) {
      if (levelChartImg) return;
      await new Promise((r) => setTimeout(r, 200));
    }
  };

  const loadReport = async (
    currentStatus = status,
    currentCategory = category,
    currentUsage = usage,
    currentUseOrder = useOrder,
    currentLimit = limit,
    currentSearch = search
  ) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (currentStatus) params.append("status", currentStatus);
      if (currentCategory) params.append("category", currentCategory);
      if (currentUsage) params.append("usage", currentUsage);
      if (currentUseOrder) params.append("use_order", currentUseOrder);
      if (currentSearch.trim()) params.append("search", currentSearch.trim());
      if (currentLimit !== "all") params.append("limit", currentLimit);

      const res = await fetch(
        `${API_URL}/api/moderator/reports/technical-skills?${params.toString()}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      setSummary(data.data.summary);
      setSkills(data.data.skills);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
  }, []);

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Reporte de habilidades técnicas</h2>
          <p className="text-slate-400 mt-1">
            Análisis del catálogo de habilidades técnicas utilizadas dentro del sistema.
          </p>
        </div>

        <Button
          className="bg-[#6c72ff] hover:bg-[#5a60e6]"
          onClick={() => {
            setPdfConfig({
              catalog: {
                summary: reportView.summary,
                table: reportView.table,
                levelChart: reportView.levelChart,
              },
              filters: {
                status,
                category,
                usage,
                useOrder,
                limit,
                search,
              },
            });

            setPdfOpen(true);
          }}
        >
          Generar PDF
        </Button>
      </div>

      {/* FILTERS */}
      <TechnicalSkillReportFilters
        status={status}
        category={category}
        usage={usage}
        useOrder={useOrder}
        limit={limit}
        search={search}
        onStatusChange={(v) => {
          setStatus(v);
          loadReport(v, category, usage, useOrder, limit, search);
        }}
        onCategoryChange={(v) => {
          setCategory(v);
          loadReport(status, v, usage, useOrder, limit, search);
        }}
        onUsageChange={(v) => {
          setUsage(v);
          loadReport(status, category, v, useOrder, limit, search);
        }}
        onUseOrderChange={(v) => {
          setUseOrder(v);
          loadReport(status, category, usage, v, limit, search);
        }}
        onLimitChange={(v) => {
          setLimit(v);
          loadReport(status, category, usage, useOrder, v, search);
        }}
        onSearchChange={setSearch}
        onSearch={() => loadReport(status, category, usage, useOrder, limit, search)}
      />

      {/* SUMMARY */}
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-2">
          <h3 className="text-white font-semibold">Resumen general</h3>

          <input
            type="checkbox"
            checked={reportView.summary}
            onChange={() => setReportView((p) => ({ ...p, summary: !p.summary }))}
          />
        </div>

        {reportView.summary && <TechnicalSkillReportSummary summary={summary} />}
      </div>

      {/* TABLE */}
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-2">
          <h3 className="text-white font-semibold">Listado de habilidades</h3>

          <input
            type="checkbox"
            checked={reportView.table}
            onChange={() => setReportView((p) => ({ ...p, table: !p.table }))}
          />
        </div>

        {reportView.table && <TechnicalSkillReportTable loading={loading} skills={skills} />}
      </div>

      {/* LEVEL CHART */}
      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-2">
          <h3 className="text-white font-semibold">Distribución de niveles</h3>

          <input
            type="checkbox"
            checked={reportView.levelChart}
            onChange={() =>
              setReportView((p) => ({
                ...p,
                levelChart: !p.levelChart,
              }))
            }
          />
        </div>

        {reportView.levelChart && (
          <TechnicalSkillLevelDistributionChart
            data={skills}
            loading={loading}
            onExport={setLevelChartImg}
          />
        )}
      </div>

      {/* PDF MODAL */}
      {pdfOpen && pdfConfig && (
        <PdfConfigModal
          open={pdfOpen}
          onClose={() => setPdfOpen(false)}
          config={pdfConfig}
          setConfig={setPdfConfig}
          onGenerate={(finalConfig) => {
            void (async () => {
              await waitForImages();

              const data = {
                summary,
                skills,
                images: {
                  levelChart: levelChartImg,
                },
              };

              await generateTechnicalSkillPdf(finalConfig, data);
              setPdfOpen(false);
            })();
          }}
        />
      )}
    </section>
  );
}
