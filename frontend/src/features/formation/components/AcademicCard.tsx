import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import { BuildingsIcon, PencilSimpleIcon, TrashIcon, GraduationCapIcon } from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import type { AcademicRecord } from "../types/academic.types";

type Props = {
  academic: AcademicRecord;
  onEdit: (academic: AcademicRecord) => void;
  onDelete: (academic: AcademicRecord) => void;
};

export default function AcademicCard({ academic, onEdit, onDelete }: Props) {
  const startLabel = academic.start_date
    ? format(parseISO(academic.start_date), "MMM yyyy", { locale: es })
    : "";
  const endLabel = academic.is_current
    ? "Presente"
    : academic.end_date
      ? format(parseISO(academic.end_date), "MMM yyyy", { locale: es })
      : "";

  return (
    <div
      className="group relative flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 pr-16 sm:p-6 sm:pr-6 transition-all hover:bg-slate-900/80 hover:border-indigo-500/50 overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="bg-indigo-900 text-white px-4 py-1.5 rounded-full font-bold text-sm sm:text-base shadow-sm">
            {academic.title}
          </span>
          {!academic.is_visible && (
            <span className="bg-slate-800 text-slate-100 px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap">
              Oculto
            </span>
          )}
        </div>

        <div className="flex items-center sm:justify-end">
          <span className="bg-indigo-900 text-indigo-100 px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap">
            {startLabel} - {endLabel}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-sm mb-2">
        <BuildingsIcon size={18} className="text-indigo-400" />
        <span className="font-medium text-slate-200">{academic.institution_name}</span>
      </div>

      <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
        <GraduationCapIcon size={18} className="text-indigo-400" />
        <span className="font-medium text-slate-200">{academic.field_of_study}</span>
      </div>

      <div className="flex-1 mt-2">
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
          {academic.description}
        </p>
      </div>

      <div className="absolute top-4 right-4 sm:top-auto sm:bottom-4 transition-all flex gap-2">
        <Button
          className="cursor-pointer"
          onClick={() => onEdit(academic)}
          variant="ghost"
          size="icon-lg"
        >
          <PencilSimpleIcon weight="bold" />
        </Button>
        <Button
          className="hover:text-red-500 cursor-pointer"
          onClick={() => onDelete(academic)}
          variant="ghost"
          size="icon-lg"
        >
          <TrashIcon weight="bold" />
        </Button>
      </div>
    </div>
  );
}
