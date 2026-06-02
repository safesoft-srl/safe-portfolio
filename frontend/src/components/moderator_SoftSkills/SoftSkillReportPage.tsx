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
  const [charts, setCharts] = useState({ usage: true, status: false });

  const [requestLoading, setRequestLoading] = useState(true);
  const [requestStatus, setRequestStatus] = useState("");
  const [requestOrder, setRequestOrder] = useState("desc");
  const [requestLimit, setRequestLimit] = useState("20");
  const [requestCreatedPeriod, setRequestCreatedPeriod] = useState("");
  const [requestDateFrom, setRequestDateFrom] = useState("");
  const [requestDateTo, setRequestDateTo] = useState("");
  const [requests, setRequests] = useState<SoftSkillRequest[]>([]);
  const [requestView] = useState({ table: true, chart: true });

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
          <p className="text-slate-400 mt-1">Consulta estadísticas del catálogo y solicitudes.</p>
        </div>
        <Button className="bg-[#6c72ff] hover:bg-[#5a60e6]">Generar PDF</Button>
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

      <SoftSkillReportSummary summary={summary} />
      <SoftSkillReportTable loading={loading} skills={skills} />

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold">Uso de habilidades</h3>
          </div>
          <input
            type="checkbox"
            checked={charts.usage}
            onChange={() => setCharts((p) => ({ ...p, usage: !p.usage }))}
          />
        </div>
        {charts.usage && <SoftSkillUsageChart data={skills} loading={loading} />}
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
        <div className="flex justify-between mb-3">
          <div>
            <h3 className="text-white font-semibold">Estado</h3>
          </div>
          <input
            type="checkbox"
            checked={charts.status}
            onChange={() => setCharts((p) => ({ ...p, status: !p.status }))}
          />
        </div>
        {charts.status && <SoftSkillStatusChart data={skills} loading={loading} />}
      </div>

      <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] p-5">
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
              requestDateFrom,
              requestDateTo
            );
          }}
          onRequestOrderChange={(v) => {
            setRequestOrder(v);
            loadRequestReport(
              requestStatus,
              v,
              requestLimit,
              requestCreatedPeriod,
              requestDateFrom,
              requestDateTo
            );
          }}
          onLimitChange={(v) => {
            setRequestLimit(v);
            loadRequestReport(
              requestStatus,
              requestOrder,
              v,
              requestCreatedPeriod,
              requestDateFrom,
              requestDateTo
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

        {requestView.table && (
          <SoftSkillRequestTable loading={requestLoading} requests={requests} />
        )}
        {requestView.chart && <SoftSkillRequestChart data={requests} loading={requestLoading} />}
      </div>
    </div>
  );
}
