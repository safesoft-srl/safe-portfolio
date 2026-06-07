import { Button } from "@/components/ui/button";
import { SkillComboBox } from "@/components/SkillComboBox";

import type { Skill } from "@/services/skill.service";

type Props = {
  dateFrom: string;
  dateTo: string;
  skills: Skill[];
  selectedSkills: Skill[];
  onSelectedSkillsChange: (skills: Skill[]) => void;
  onDateFromChange: (value: string) => void;
  onDateToChange: (value: string) => void;
  onApplyFilters: () => void;
};

const inputCls =
  "bg-[#14172b] border border-slate-800 text-white placeholder-slate-500 rounded-lg px-4 py-2 text-white outline-none text-sm ";

export default function ProjectReportFilters({
  dateFrom,
  dateTo,
  skills,
  selectedSkills,
  onSelectedSkillsChange,
  onDateFromChange,
  onDateToChange,
  onApplyFilters,
}: Props) {
  return (
    <div className="flex w-full flex-wrap items-end gap-4">
      <div className="h-10 w-full sm:w-auto sm:min-w-[230px]">
        <SkillComboBox
          skills={skills}
          selected={selectedSkills}
          onChange={onSelectedSkillsChange}
          label=""
          placeholder="Filtrar por tecnologías..."
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Desde</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onDateFromChange(e.target.value)}
          className={inputCls}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-slate-400">Hasta</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onDateToChange(e.target.value)}
          className={inputCls}
        />
      </div>

      <Button onClick={onApplyFilters} variant="default" size="lg" disabled={!dateFrom || !dateTo}>
        Generar Reporte
      </Button>
    </div>
  );
}