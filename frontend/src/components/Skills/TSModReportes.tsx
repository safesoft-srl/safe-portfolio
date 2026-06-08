import { useState, useEffect } from "react";
import {
  ChartPieSlice,
  CheckCircle,
  WarningCircle,
  ListBullets,
  Printer,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { TechnicalReportPDF } from "./TechnicalReportPDF";
import type { JSX } from "react";

interface CategoryData {
  category: string;
  total: number;
}
interface ReportData {
  total: number;
  active: number;
  inactive: number;
  categories: CategoryData[];
  skills: { name: string; category: string; is_active: boolean }[];
}

export function TSModReportes() {
  const [data, setData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/moderator/reports/technical-skills`,
          {
            headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
          }
        );
        const result = await res.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error cargando reporte:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReport();
  }, [token]);

  if (isLoading) return <div className="py-20 text-center text-slate-400">Cargando...</div>;
  if (!data) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Resumen Ejecutivo</h2>
        <PDFDownloadLink
          document={<TechnicalReportPDF skills={data.skills || []} />}
          fileName="reporte-habilidades.pdf"
        >
          {({ loading }) => (
            <Button className="bg-[#6c72ff] hover:bg-[#5b61e2] text-white flex items-center gap-2">
              <Printer size={18} /> {loading ? "Preparando..." : "Exportar PDF"}
            </Button>
          )}
        </PDFDownloadLink>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Tecnologías"
          value={data.total}
          icon={<ListBullets size={32} />}
          color="text-indigo-500"
          bgColor="bg-indigo-500/10"
        />
        <StatCard
          title="Habilitadas"
          value={data.active}
          icon={<CheckCircle size={32} />}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
        />
        <StatCard
          title="Deshabilitadas"
          value={data.inactive}
          icon={<WarningCircle size={32} />}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
        />
      </div>

      <div className="bg-[#13152e] border border-[#232555] rounded-3xl p-8">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ChartPieSlice size={20} className="text-[#6c72ff]" /> Distribución por Categoría
        </h3>
        <div className="space-y-4">
          {data.categories.map((cat) => (
            <div key={cat.category} className="flex items-center gap-4">
              <span className="text-slate-400 w-24 text-sm">{cat.category}</span>
              <div className="grow h-2 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#6c72ff] rounded-full"
                  style={{ width: `${data.total > 0 ? (cat.total / data.total) * 100 : 0}%` }}
                />
              </div>
              <span className="text-white font-mono text-sm">{cat.total}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
  bgColor,
}: {
  title: string;
  value: number;
  icon: JSX.Element;
  color: string;
  bgColor: string;
}) {
  return (
    <div className="bg-[#13152e] border border-[#232555] p-6 rounded-3xl flex items-center gap-5 shadow-xl">
      <div className={`${bgColor} ${color} p-4 rounded-2xl`}>{icon}</div>
      <div>
        <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
}
