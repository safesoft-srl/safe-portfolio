import { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useExperienceReport } from "@/features/experiences/hooks/useExperienceReport";
import WorkExperienceReportPdf from "@/pdf/WorkExperienceReportPdf";
import { Briefcase, DownloadSimple, UserCircleGear, CalendarBlank } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AdminExperience() {
  const [status, setStatus] = useState<string>("all");
  const [createdPeriod, setCreatedPeriod] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<string>("");
  const [dateTo, setDateTo] = useState<string>("");

  const params = {
    ...(status !== "all" && { status }),
    ...(createdPeriod !== "all" && { created_period: createdPeriod }),
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
  };

  const { data, isLoading, isError, isFetching } = useExperienceReport(params);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0b1e] text-white">
        Cargando...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0b1e] text-red-500">
        Error al cargar los datos del reporte.
      </div>
    );
  }

  const pieChartData = {
    labels: ["Actuales", "Pasados"],
    datasets: [
      {
        data: [data.summary.currently_working, data.summary.past_jobs],
        backgroundColor: ["#6c72ff", "#2a2f55"],
        borderWidth: 0,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "bottom" as const, labels: { color: "#94a3b8" } },
      tooltip: {
        backgroundColor: "#0f1224",
        titleColor: "#ffffff",
        bodyColor: "#94a3b8",
        borderColor: "#2a2f55",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
  };

  const barChartData = {
    labels:
      data.monthly_trend?.map((d: any) => {
        const [year, month] = d.month.split("-");
        const monthNames = [
          "Ene",
          "Feb",
          "Mar",
          "Abr",
          "May",
          "Jun",
          "Jul",
          "Ago",
          "Sep",
          "Oct",
          "Nov",
          "Dic",
        ];
        return `${monthNames[parseInt(month, 10) - 1]} ${year}`;
      }) || [],
    datasets: [
      {
        label: "Nuevos Trabajos",
        data: data.monthly_trend?.map((d: any) => Number(d.count)) || [],
        backgroundColor: "#6c72ff",
        borderRadius: 4,
        barThickness: 24,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f1224",
        titleColor: "#ffffff",
        bodyColor: "#94a3b8",
        borderColor: "#2a2f55",
        borderWidth: 1,
        padding: 10,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: "#94a3b8" },
      },
      y: {
        grid: { color: "#2a2f55" },
        ticks: { color: "#94a3b8", precision: 0 },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-8 w-full">
      <div className="mb-8 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white font-heading">Reporte de Experiencias Laborales</h1>
          <p className="text-slate-400 mt-1">
            Análisis detallado de los trabajos registrados por los usuarios en la plataforma.
          </p>
        </div>
        <PDFDownloadLink
          document={<WorkExperienceReportPdf data={data} filters={params} />}
          fileName="Reporte_Experiencias_Laborales.pdf"
        >
          {({ loading }) => (
            <div className="flex flex-col items-end gap-1">
              <Button disabled={loading} className="bg-[#6c72ff] hover:bg-[#5a60e6] text-white">
                <DownloadSimple size={20} className="mr-2" />
                {loading ? "Generando PDF..." : "Descargar Reporte PDF"}
              </Button>
            </div>
          )}
        </PDFDownloadLink>
      </div>

      <div className="space-y-6 pb-10">
        {/* Filters Section */}
        <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold flex items-center gap-2 text-lg">
                <CalendarBlank size={22} />
                Filtros del Reporte
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Selecciona los criterios para generar el reporte de experiencia laboral.
              </p>
            </div>
            {isFetching && (
              <span className="text-xs bg-[#6c72ff]/20 text-[#6c72ff] px-2 py-1 rounded-full animate-pulse flex items-center gap-1">
                <div className="w-2 h-2 bg-[#6c72ff] rounded-full animate-ping"></div>
                Actualizando...
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">Estado del Trabajo</label>
              <select
                className="h-10 w-48 rounded-md border border-[#2a2f55] bg-[#0f1224] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6c72ff]"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="all">Todos</option>
                <option value="current">Actuales</option>
                <option value="past">Pasados</option>
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-400">Periodo de Registro</label>
              <select
                className="h-10 w-48 rounded-md border border-[#2a2f55] bg-[#0f1224] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6c72ff]"
                value={createdPeriod}
                onChange={(e) => {
                  setCreatedPeriod(e.target.value);
                  if (e.target.value !== "custom") {
                    setDateFrom("");
                    setDateTo("");
                  }
                }}
              >
                <option value="all">Histórico Completo</option>
                <option value="last_week">Última Semana</option>
                <option value="last_month">Último Mes</option>
                <option value="last_year">Último Año</option>
                <option value="custom">Rango Personalizado</option>
              </select>
            </div>

            {createdPeriod === "custom" && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Desde</label>
                  <input
                    type="date"
                    className="h-10 rounded-md border border-[#2a2f55] bg-[#0f1224] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6c72ff] date-input"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-400">Hasta</label>
                  <input
                    type="date"
                    className="h-10 rounded-md border border-[#2a2f55] bg-[#0f1224] px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#6c72ff] date-input"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                  />
                </div>
              </>
            )}

            <div className="flex flex-col justify-end h-full">
              <Button
                variant="outline"
                className="border-[#2a2f55] text-slate-300 hover:bg-[#2a2f55] hover:text-white h-10 bg-transparent"
                onClick={() => {
                  setStatus("all");
                  setCreatedPeriod("all");
                  setDateFrom("");
                  setDateTo("");
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[#2a2f55]">
            <p className="text-xs text-slate-500 italic">
              * El PDF se generará basado en los filtros seleccionados actualmente
            </p>
          </div>
        </div>

        {data && (
          <div className={`space-y-6 transition-opacity duration-300 ${isFetching ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
            {/* Quick Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-white font-semibold">Total Experiencias</h3>
                  <Briefcase size={20} className="text-slate-400" />
                </div>
                <div className="text-3xl font-bold text-white mt-2">
                  {data.summary?.total_experiences || 0}
                </div>
              </div>
              <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-white font-semibold">Trabajos Actuales</h3>
                  <Briefcase size={20} className="text-[#6c72ff]" />
                </div>
                <div className="text-3xl font-bold text-white mt-2">
                  {data.summary?.currently_working || 0}
                </div>
              </div>
              <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
                <div className="flex flex-row items-center justify-between pb-2">
                  <h3 className="text-white font-semibold">Trabajos Pasados</h3>
                  <Briefcase size={20} className="text-slate-500" />
                </div>
                <div className="text-3xl font-bold text-white mt-2">
                  {data.summary?.past_jobs || 0}
                </div>
              </div>
            </div>

            {/* Charts Section */}
            <div className="grid gap-4 md:grid-cols-3">
              {/* Pie Chart */}
              {data.summary && (data.summary.currently_working > 0 || data.summary.past_jobs > 0) && (
                <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5 col-span-1">
                  <div className="mb-4">
                    <h3 className="text-white font-semibold">Distribución de Trabajos</h3>
                  </div>
                  <div className="h-[250px] pb-4">
                    <Pie data={pieChartData} options={pieChartOptions} />
                  </div>
                </div>
              )}

              {/* Bar Chart */}
              {data.monthly_trend && data.monthly_trend.length > 0 && (
                <div
                  className={`rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5 ${
                    data.summary &&
                    (data.summary.currently_working > 0 || data.summary.past_jobs > 0)
                      ? "col-span-2"
                      : "col-span-3"
                  }`}
                >
                  <div className="mb-4">
                    <h3 className="text-white font-semibold">Tendencia Histórica (Nuevos Trabajos)</h3>
                  </div>
                  <div className="h-[250px] pb-4">
                    <Bar data={barChartData} options={barChartOptions} />
                  </div>
                </div>
              )}
            </div>

            {/* Top Lists */}
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Top Roles */}
              <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <UserCircleGear size={20} className="text-[#6c72ff]" />
                  <h3 className="text-white font-semibold">Top 10 Cargos</h3>
                </div>
                {data.top_positions && data.top_positions.length > 0 ? (
                  <div className="space-y-3">
                    {data.top_positions.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-[#0f1224] p-3 rounded-lg border border-[#2a2f55]/50">
                        <span className="text-sm font-medium text-white">{item.position}</span>
                        <span className="text-xs bg-[#2a2f55] text-white px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 py-4 text-center">No hay datos</div>
                )}
              </div>

              {/* Top Companies */}
              <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Briefcase size={20} className="text-[#6c72ff]" />
                  <h3 className="text-white font-semibold">Top 10 Empresas</h3>
                </div>
                {data.top_companies && data.top_companies.length > 0 ? (
                  <div className="space-y-3">
                    {data.top_companies.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between items-center bg-[#0f1224] p-3 rounded-lg border border-[#2a2f55]/50">
                        <span className="text-sm font-medium text-white">
                          {item.company}
                        </span>
                        <span className="text-xs bg-[#2a2f55] text-white px-2 py-1 rounded-full">
                          {item.count}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-slate-500 py-4 text-center">No hay datos</div>
                )}
              </div>
            </div>

            {/* Detailed Table */}
            <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
              <div className="mb-4">
                <h3 className="text-white font-semibold">Detalle de Experiencias Laborales</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-[#2a2f55]">
                      <th className="pb-3 pr-4 font-medium text-slate-400">Usuario</th>
                      <th className="pb-3 pr-4 font-medium text-slate-400">Empresa</th>
                      <th className="pb-3 pr-4 font-medium text-slate-400">Cargo</th>
                      <th className="pb-3 pr-4 font-medium text-slate-400">Estado</th>
                      <th className="pb-3 font-medium text-slate-400">Periodo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.detailed_list && data.detailed_list.length > 0 ? (
                      data.detailed_list.map((exp: any, idx: number) => (
                        <tr key={idx} className="border-b border-[#2a2f55]/50 last:border-0 hover:bg-[#0f1224] transition-colors">
                          <td className="py-4 pr-4 text-white">
                            {exp.user_name || "Desconocido"}
                          </td>
                          <td className="py-4 pr-4 text-slate-300 font-medium">
                            {exp.company}
                          </td>
                          <td className="py-4 pr-4 text-slate-300">{exp.position}</td>
                          <td className="py-4 pr-4">
                            {exp.is_current ? (
                              <span className="inline-flex items-center rounded-full border border-green-500/30 bg-green-500/10 px-2 py-0.5 text-xs font-semibold text-green-500">
                                Actual
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full border border-slate-500/30 bg-slate-500/10 px-2 py-0.5 text-xs font-semibold text-slate-400">
                                Pasado
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-slate-400">
                            {new Date(exp.start_date).toLocaleDateString("es-ES", {
                              month: "short",
                              year: "numeric",
                            })}{" "}
                            -{" "}
                            {exp.is_current
                              ? "Presente"
                              : exp.end_date
                                ? new Date(exp.end_date).toLocaleDateString("es-ES", {
                                    month: "short",
                                    year: "numeric",
                                  })
                                : "N/A"}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-500">
                          No se encontraron experiencias con estos filtros.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
