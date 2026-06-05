import { Button } from "@/components/ui/button";

type Props = {
  status: string;
  useOrder: string;
  limit: string;
  createdPeriod: string;
  dateFrom: string;
  dateTo: string;

  onStatusChange: (value: string) => void;
  onUseOrderChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onCreatedPeriodChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApplyCustomDates: () => void;
};

export default function SoftSkillReportFilters({
  status,
  useOrder,
  limit,
  createdPeriod,
  dateFrom,
  dateTo,
  onStatusChange,
  onUseOrderChange,
  onLimitChange,
  onCreatedPeriodChange,
  onDateFromChange,
  onDateToChange,
  onApplyCustomDates,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="">Todas</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
        </select>

        <select
          value={useOrder}
          onChange={(e) => onUseOrderChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="desc">Más usadas</option>
          <option value="asc">Menos usadas</option>
        </select>

        <select
          value={limit}
          onChange={(e) => onLimitChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="10">Top 10</option>
          <option value="20">Top 20</option>
          <option value="50">Top 50</option>
          <option value="100">Top 100</option>
          <option value="all">Todas</option>
        </select>

        <select
          value={createdPeriod}
          onChange={(e) => onCreatedPeriodChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="">Sin filtro fecha</option>
          <option value="week">Última semana</option>
          <option value="month">Últimos 30 días</option>
          <option value="year">Último año</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>

      {createdPeriod === "custom" && (
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
          />

          <span className="text-slate-400">→</span>

          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
          />

          <Button onClick={onApplyCustomDates} className="bg-[#2a2f55] hover:bg-[#3a3f70]">
            Aplicar rango
          </Button>
        </div>
      )}
    </div>
  );
}
