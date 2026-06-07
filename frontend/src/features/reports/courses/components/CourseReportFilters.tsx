import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  area: string;
  dateFrom: string;
  dateTo: string;
  onAreaChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApplyFilters: () => void;
};

export default function CourseReportFilters({
  area,
  dateFrom,
  dateTo,
  onAreaChange,
  onDateFromChange,
  onDateToChange,
  onApplyFilters,
}: Props) {
  return (
    <div className="flex w-full flex-wrap items-end gap-4">
      <div className="w-full sm:max-w-xs">
        <Input
          value={area}
          onChange={(e) => onAreaChange(e.target.value)}
          placeholder="Filtrar por área..."
          className="h-10 rounded-xl border border-slate-800 bg-[#14172b] text-white placeholder:text-slate-500"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Desde</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className="bg-[#14172b] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-white outline-none text-sm"
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Hasta</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className="bg-[#14172b] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-white outline-none text-sm"
        />
      </div>

      <Button onClick={onApplyFilters} variant="default" size="lg" disabled={!dateFrom || !dateTo}>
        Generar Reporte
      </Button>
    </div>
  );
}
