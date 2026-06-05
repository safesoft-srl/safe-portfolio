import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import SoftSkillReportFilters from "@/components/moderator_SoftSkills/report/SoftSkillReportFilters";
import SoftSkillReportSummary from "@/components/moderator_SoftSkills/report/SoftSkillReportSummary";
import SoftSkillReportTable from "@/components/moderator_SoftSkills/report/SoftSkillReportTable";
import SoftSkillUsageChart from "@/components/moderator_SoftSkills/graphics/SoftSkillUsageChart";
import SoftSkillStatusChart from "@/components/moderator_SoftSkills/graphics/SoftSkillStatusChart";
import SoftSkillRequestFilters from "@/components/moderator_SoftSkills/report/SoftSkillRequestFilters";
import SoftSkillRequestTable from "@/components/moderator_SoftSkills/report/SoftSkillRequestTable";
import SoftSkillRequestChart from "@/components/moderator_SoftSkills/graphics/SoftSkillRequestChart";
import PdfConfigModal from "@/components/moderator_SoftSkills/report/PdfConfigModal";
import { generateSoftSkillPdf } from "@/pdf/generateSoftSkillPdf";

const API_URL = import.meta.env.VITE_API_URL;

type SoftSkillReport = {
  id: number;
  name: string;
  is_active: boolean;
  uses: number;
  created_at: string;
};
type Summary = { results: number; active: number; inactive: number; total_uses: number };
type SoftSkillRequest = {
  name: string;
  status: "pending" | "approved" | "rejected";
  requests_count: number;
  created_at: string;
};

export default function SoftSkillReportSection() {
  const token = localStorage.getItem("token");
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [useOrder, setUseOrder] = useState("desc");
  const [limit, setLimit] = useState("20");
  const [createdPeriod, setCreatedPeriod] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [summary, setSummary] = useState<Summary>({
    results: 0,
    active: 0,
    inactive: 0,
    total_uses: 0,
  });
  const [skills, setSkills] = useState<SoftSkillReport[]>([]);

  const [requestLoading, setRequestLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState("");
  const [requestOrder, setRequestOrder] = useState("desc");
  const [requestLimit, setRequestLimit] = useState("20");
  const [requestCreatedPeriod, setRequestCreatedPeriod] = useState("");
  const [requestDateFrom, setRequestDateFrom] = useState("");
  const [requestDateTo, setRequestDateTo] = useState("");
  const [requests, setRequests] = useState<SoftSkillRequest[]>([]);

  const [usageChartImg, setUsageChartImg] = useState("");
  const [statusChartImg, setStatusChartImg] = useState("");
  const [requestChartImg, setRequestChartImg] = useState("");

  const [catalogView, setCatalogView] = useState({
    summary: true,
    table: true,
    usageChart: true,
    statusChart: true,
  });
  const [requestView, setRequestView] = useState({ table: true, chart: true });

  const waitForImages = async () => {
    for (let i = 0; i < 10; i++) {
      if (usageChartImg && statusChartImg && requestChartImg) return;
      await new Promise((r) => setTimeout(r, 200));
    }
  };

  const [pdfOpen, setPdfOpen] = useState(false);
  const [pdfConfig, setPdfConfig] = useState({
    catalog: { ...catalogView },
    requests: { ...requestView },
    filters: {
      status,
      useOrder,
      limit,
      createdPeriod,
      dateFrom,
      dateTo,
      requestStatus,
      requestOrder,
      requestLimit,
      requestCreatedPeriod,
      requestDateFrom,
      requestDateTo,
    },
  });

  const loadReport = async (
    currentStatus = status,
    currentUseOrder = useOrder,
    currentLimit = limit,
    currentCreatedPeriod = createdPeriod,
    currentDateFrom = dateFrom,
    currentDateTo = dateTo
  ) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (currentStatus) params.append("status", currentStatus);
      if (currentUseOrder) params.append("use_order", currentUseOrder);
      if (currentLimit !== "all") params.append("limit", currentLimit);
      if (currentCreatedPeriod) params.append("created_period", currentCreatedPeriod);
      if (currentDateFrom && currentDateTo) {
        params.append("date_from", currentDateFrom);
        params.append("date_to", currentDateTo);
      }
      const res = await fetch(`${API_URL}/api/moderator/reports/soft-skills?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) return console.error(data.message);
      setSummary(data.data.summary);
      setSkills(data.data.skills);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRequestReport = async (
    currentStatus = requestStatus,
    currentOrder = requestOrder,
    currentLimit = requestLimit,
    currentPeriod = requestCreatedPeriod,
    currentFrom = requestDateFrom,
    currentTo = requestDateTo
  ) => {
    try {
      setRequestLoading(true);
      const params = new URLSearchParams();
      if (currentStatus) params.append("status", currentStatus);
      if (currentOrder) params.append("request_order", currentOrder);
      if (currentLimit !== "all") params.append("limit", currentLimit);
      if (currentPeriod) params.append("created_period", currentPeriod);
      if (currentFrom && currentTo) {
        params.append("date_from", currentFrom);
        params.append("date_to", currentTo);
      }
      const res = await fetch(
        `${API_URL}/api/moderator/reports/soft-skill-requests?${params.toString()}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      if (!res.ok) return console.error(data.message);
      setRequests(data.data.requests ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setRequestLoading(false);
    }
  };

  useEffect(() => {
    loadReport();
    loadRequestReport();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-white">Reporte de habilidades blandas</h2>
          <p className="text-slate-400 mt-1">
            Análisis completo del catálogo de habilidades y solicitudes de uso dentro del sistema.
          </p>
        </div>
        <Button
          className="bg-[#6c72ff] hover:bg-[#5a60e6]"
          onClick={() => {
            setPdfConfig({
              catalog: { ...catalogView },
              requests: { ...requestView },
              filters: {
                status,
                useOrder,
                limit,
                createdPeriod,
                dateFrom,
                dateTo,
                requestStatus,
                requestOrder,
                requestLimit,
                requestCreatedPeriod,
                requestDateFrom,
                requestDateTo,
              },
            });
            setPdfOpen(true);
          }}
        >
          Generar PDF
        </Button>
      </div>

      <SoftSkillReportFilters
        status={status}
        useOrder={useOrder}
        limit={limit}
        createdPeriod={createdPeriod}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onStatusChange={(v) => {
          setStatus(v);
          loadReport(v, useOrder, limit, createdPeriod, dateFrom, dateTo);
        }}
        onUseOrderChange={(v) => {
          setUseOrder(v);
          loadReport(status, v, limit, createdPeriod, dateFrom, dateTo);
        }}
        onLimitChange={(v) => {
          setLimit(v);
          loadReport(status, useOrder, v, createdPeriod, dateFrom, dateTo);
        }}
        onCreatedPeriodChange={(v) => {
          setCreatedPeriod(v);
          if (v !== "custom") {
            setDateFrom("");
            setDateTo("");
            loadReport(status, useOrder, limit, v, "", "");
          }
        }}
        onDateFromChange={setDateFrom}
        onDateToChange={setDateTo}
        onApplyCustomDates={() =>
          loadReport(status, useOrder, limit, createdPeriod, dateFrom, dateTo)
        }
      />

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="text-white font-semibold">Resumen general del catálogo</h3>
            <p className="text-slate-400 text-sm">
              Total de habilidades registradas, activas, inactivas y uso acumulado en el sistema.
            </p>
          </div>
          <input
            type="checkbox"
            checked={catalogView.summary}
            onChange={() => setCatalogView((p) => ({ ...p, summary: !p.summary }))}
          />
        </div>
        {catalogView.summary && <SoftSkillReportSummary summary={summary} />}
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="text-white font-semibold">Listado de habilidades registradas</h3>
            <p className="text-slate-400 text-sm">
              Detalle de cada habilidad blanda, su estado y número de usos en el sistema.
            </p>
          </div>
          <input
            type="checkbox"
            checked={catalogView.table}
            onChange={() => setCatalogView((p) => ({ ...p, table: !p.table }))}
          />
        </div>
        {catalogView.table && <SoftSkillReportTable loading={loading} skills={skills} />}
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="text-white font-semibold">Frecuencia de uso de habilidades</h3>
            <p className="text-slate-400 text-sm">
              Muestra qué habilidades blandas son más utilizadas por los usuarios.
            </p>
          </div>
          <input
            type="checkbox"
            checked={catalogView.usageChart}
            onChange={() => setCatalogView((p) => ({ ...p, usageChart: !p.usageChart }))}
          />
        </div>
        {catalogView.usageChart && (
          <SoftSkillUsageChart data={skills} loading={loading} onExport={setUsageChartImg} />
        )}
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-2">
          <div>
            <h3 className="text-white font-semibold">
              Estado de habilidades (activas vs inactivas)
            </h3>
            <p className="text-slate-400 text-sm">
              Distribución del catálogo según el estado de cada habilidad.
            </p>
          </div>
          <input
            type="checkbox"
            checked={catalogView.statusChart}
            onChange={() => setCatalogView((p) => ({ ...p, statusChart: !p.statusChart }))}
          />
        </div>
        {catalogView.statusChart && (
          <SoftSkillStatusChart data={skills} loading={loading} onExport={setStatusChartImg} />
        )}
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="mb-4">
          <h3 className="text-white font-semibold text-lg">Solicitudes de habilidades blandas</h3>
          <p className="text-slate-400 text-sm mt-1">
            Análisis de solicitudes de creación y uso de habilidades dentro del sistema.
          </p>
        </div>

        <SoftSkillRequestFilters
          status={requestStatus}
          requestOrder={requestOrder}
          limit={requestLimit}
          createdPeriod={requestCreatedPeriod}
          dateFrom={requestDateFrom}
          dateTo={requestDateTo}
          onStatusChange={(v) => {
            setRequestStatus(v);
            loadRequestReport(
              v,
              requestOrder,
              requestLimit,
              requestCreatedPeriod,
              dateFrom,
              dateTo
            );
          }}
          onRequestOrderChange={(v) => {
            setRequestOrder(v);
            loadRequestReport(
              requestStatus,
              v,
              requestLimit,
              requestCreatedPeriod,
              dateFrom,
              dateTo
            );
          }}
          onLimitChange={(v) => {
            setRequestLimit(v);
            loadRequestReport(
              requestStatus,
              requestOrder,
              v,
              requestCreatedPeriod,
              dateFrom,
              dateTo
            );
          }}
          onCreatedPeriodChange={(v) => {
            setRequestCreatedPeriod(v);
            if (v !== "custom") {
              setRequestDateFrom("");
              setRequestDateTo("");
              loadRequestReport(requestStatus, requestOrder, requestLimit, v, "", "");
            }
          }}
          onDateFromChange={setRequestDateFrom}
          onDateToChange={setRequestDateTo}
          onApplyCustomDates={() =>
            loadRequestReport(
              requestStatus,
              requestOrder,
              requestLimit,
              requestCreatedPeriod,
              requestDateFrom,
              requestDateTo
            )
          }
        />

        <div className="rounded-xl border border-[#2a2f55] bg-[#0f1224] p-4 mt-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-white font-medium">Tabla de solicitudes</h4>
              <p className="text-slate-400 text-sm">
                Detalle de solicitudes por habilidad y estado.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requestView.table}
              onChange={() => setRequestView((p) => ({ ...p, table: !p.table }))}
            />
          </div>
          {requestView.table && (
            <SoftSkillRequestTable loading={requestLoading} requests={requests} />
          )}
        </div>

        <div className="rounded-xl border border-[#2a2f55] bg-[#0f1224] p-4 mt-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="text-white font-medium">Gráfico de solicitudes</h4>
              <p className="text-slate-400 text-sm">
                Visualización del volumen y comportamiento de solicitudes.
              </p>
            </div>
            <input
              type="checkbox"
              checked={requestView.chart}
              onChange={() => setRequestView((p) => ({ ...p, chart: !p.chart }))}
            />
          </div>
          {requestView.chart && (
            <SoftSkillRequestChart
              data={requests}
              loading={requestLoading}
              onExport={setRequestChartImg}
            />
          )}
        </div>
      </div>

      <PdfConfigModal
        open={pdfOpen}
        onClose={() => setPdfOpen(false)}
        config={pdfConfig}
        setConfig={setPdfConfig}
        onGenerate={async (finalConfig) => {
          await waitForImages();

          const data = {
            summary,
            skills,
            requests,
            images: {
              usage: usageChartImg,
              status: statusChartImg,
              requests: requestChartImg,
            },
          };
          console.log({
            usageChartImg: !!usageChartImg,
            statusChartImg: !!statusChartImg,
            requestChartImg: !!requestChartImg,
          });
          await generateSoftSkillPdf(finalConfig, data);

          setPdfOpen(false);
        }}
      />
    </div>
  );
}
