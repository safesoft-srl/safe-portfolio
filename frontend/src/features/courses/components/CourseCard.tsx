import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  BuildingsIcon,
  ClockIcon,
  PencilSimpleIcon,
  GraduationCapIcon,
  TrashIcon,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";

import type { CourseRecord } from "../types/course.types";

type Props = {
  course: CourseRecord;
  onEdit: (course: CourseRecord) => void;
  onDelete: (course: CourseRecord) => void;
};

export default function CourseCard({ course, onEdit, onDelete }: Props) {
  const certificateLabel = course.is_current
    ? "Presente"
    : course.certificate_date
      ? format(parseISO(course.certificate_date), "MMM yyyy", { locale: es })
      : "";

  return (
    <div className="group relative flex w-full flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/50 p-5 pr-16 backdrop-blur-xl transition-all hover:border-indigo-500/50 hover:bg-slate-900/80 sm:p-6 sm:pr-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xl font-bold text-white">{course.title}</span>
          {!course.is_visible && (
            <span className="whitespace-nowrap rounded-full bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-100 sm:text-sm">
              Oculto
            </span>
          )}
        </div>

        <div className="flex items-center sm:justify-end">
          {certificateLabel && (
            <span className="whitespace-nowrap rounded-full bg-indigo-900 px-3 py-1.5 text-xs font-semibold text-indigo-100 sm:text-sm">
              {certificateLabel}
            </span>
          )}
        </div>
      </div>

      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <BuildingsIcon size={18} className="text-indigo-400" />
        <span className="font-medium text-slate-200">{course.institution_name}</span>
      </div>

      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <GraduationCapIcon size={18} className="text-indigo-400" />
        <span className="font-medium text-slate-200">{course.area}</span>
      </div>

      <div className="mb-2 flex items-center gap-2 text-sm text-slate-400">
        <ClockIcon size={18} className="text-indigo-400" />
        <span className="font-medium text-slate-200">Carga horaria: {course.workload_hours}</span>
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-slate-400">
        <span className="font-medium text-slate-200">Nivel: {course.level}</span>
      </div>

      <div className="mt-2 flex-1">
        <p className="mb-4 text-sm leading-relaxed text-slate-300 sm:text-base">
          {course.description}
        </p>
      </div>

      <div className="absolute right-4 top-4 flex gap-2 transition-all sm:bottom-4 sm:top-auto">
        <Button
          className="cursor-pointer"
          onClick={() => onEdit(course)}
          variant="ghost"
          size="icon-lg"
        >
          <PencilSimpleIcon weight="bold" />
        </Button>
        <Button
          className="cursor-pointer hover:text-red-500"
          onClick={() => onDelete(course)}
          variant="ghost"
          size="icon-lg"
        >
          <TrashIcon weight="bold" />
        </Button>
      </div>
    </div>
  );
}
