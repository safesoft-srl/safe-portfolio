import { Button } from "@/components/ui/button";
import { SkillComboBox } from "@/components/SkillComboBox";

import type { Skill } from "@/services/skill.service";

type Props = {
  createdPeriod: string;
  dateFrom: string;
  dateTo: string;
  skills: Skill[];
  selectedSkills: Skill[];
  onSelectedSkillsChange: (skills: Skill[]) => void;
  onCreatedPeriodChange: (value: string) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApplyFilters: () => void;
};

const inputCls =
  "bg-[#14172b] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-white outline-none text-sm ";

export default function ProjectReportFilters({
  createdPeriod,
  dateFrom,
  dateTo,
  skills,
  selectedSkills,
  onSelectedSkillsChange,
  onCreatedPeriodChange,
  onDateFromChange,
  onDateToChange,
  onApplyFilters,
}: Props) {
  return (
    <div className="flex w-full flex-wrap items-center gap-4">
      <div className="h-10 w-full sm:w-auto sm:min-w-[230px]">
        <SkillComboBox
          skills={skills}
          selected={selectedSkills}
          onChange={onSelectedSkillsChange}
          label=""
          placeholder="Filtrar por tecnologías..."
        />
      </div>

      <select
        
        value={createdPeriod}
        onChange={(e) => onCreatedPeriodChange(e.target.value)}
        className={inputCls}
      >
        <option value="">Sin filtro fecha</option>
        <option value="custom">Personalizado</option>
      </select>

      {createdPeriod === "custom" && (
        <>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className={inputCls}
          />

          <span className="text-slate-400">→</span>

          <input
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className={inputCls}
          />
        </>
      )}

      <Button onClick={onApplyFilters} variant="default" size="lg">
        Generar Reporte
      </Button>
    </div>
  );
}