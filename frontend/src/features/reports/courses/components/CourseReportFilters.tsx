import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  institution: string;
  level: string;
  onInstitutionChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onApplyFilters: () => void;
};

export default function CourseReportFilters({
  institution,
  level,
  onInstitutionChange,
  onLevelChange,
  onApplyFilters,
}: Props) {
  return (
    <div className="flex w-full flex-wrap items-center gap-4">
      <div className="w-full sm:max-w-xs">
        <Input
          value={institution}
          onChange={(e) => onInstitutionChange(e.target.value)}
          placeholder="Filtrar por institución..."
          className="h-10 rounded-xl border border-slate-800 bg-[#14172b] text-white placeholder:text-slate-500"
        />
      </div>

      <div className="w-full sm:max-w-xs">
        <Input
          value={level}
          onChange={(e) => onLevelChange(e.target.value)}
          placeholder="Filtrar por nivel..."
          className="h-10 rounded-xl border border-slate-800 bg-[#14172b] text-white placeholder:text-slate-500"
        />
      </div>

      <Button onClick={onApplyFilters} variant="default" size="lg">
        Generar Reporte
      </Button>
    </div>
  );
}
