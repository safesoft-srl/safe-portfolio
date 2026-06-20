import { useEffect, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { showErrorToast } from "@/components/ui/showErrorToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Combobox } from "@/components/ui/combobox";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import type { CourseFormData, CourseRecord } from "../types/course.types";

const todayStr = new Date().toISOString().split("T")[0];

const courseSchema = z
  .object({
    institution_name: z.string().min(1, "La institución es requerida"),
    title: z.string().min(1, "El título es requerido"),
    area: z.string().min(1, "El área es requerida"),
    workload_hours: z.string().min(1, "La carga horaria es requerida"),
    level: z.string().min(1, "El nivel es requerido"),
    certificate_date: z.string().optional().nullable(),
    is_current: z.boolean(),
    description: z.string(),
    is_visible: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.is_current && !data.certificate_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fecha de emisión requerida si no está cursando actualmente",
        path: ["certificate_date"],
      });
    }

    if (data.certificate_date && data.certificate_date > todayStr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de emisión no puede ser mayor a la fecha actual",
        path: ["certificate_date"],
      });
    }
  });

type CourseFormValues = z.infer<typeof courseSchema>;

type Props = {
  initialData: CourseRecord | null;
  onSubmit: (data: CourseFormData) => Promise<void>;
  onCancel?: () => void;
  existingCourses?: CourseRecord[];
};

const defaultValues: CourseFormValues = {
  institution_name: "",
  title: "",
  area: "",
  workload_hours: "",
  level: "",
  certificate_date: "",
  is_current: false,
  description: "",
  is_visible: true,
};

const levels = [
  {
    value: 'Basico',
    label: 'Basico',
  },
  {
    value: 'Intermedio',
    label: 'Intermedio',
  },
  {
    value: 'Avanzado',
    label: 'Avanzado',
  },
]

export default function CourseForm({ initialData, onSubmit, onCancel, existingCourses = [] }: Props) {
  const [isSaving, setIsSaving] = useState(false);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<CourseFormValues | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    trigger,
    setValue,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const isCurrent = watch("is_current");
  const certificateDate = watch("certificate_date");
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const fieldsToValidate: Array<"certificate_date"> = [];

    if (certificateDate) {
      fieldsToValidate.push("certificate_date");
    }

    if (fieldsToValidate.length > 0) {
      void trigger(fieldsToValidate);
    }
  }, [certificateDate, isCurrent, trigger]);

  useEffect(() => {
    if (initialData) {
      reset({
        institution_name: initialData.institution_name ?? "",
        title: initialData.title ?? "",
        area: initialData.area ?? "",
        workload_hours: initialData.workload_hours ?? "",
        level: initialData.level ?? "",
        certificate_date: initialData.certificate_date
          ? initialData.certificate_date.split("T")[0]
          : "",
        is_current: initialData.is_current,
        description: initialData.description ?? "",
        is_visible: Boolean(initialData.is_visible),
      });
      return;
    }

    reset(defaultValues);
  }, [initialData, reset]);

  useEffect(() => {
    if (isCurrent) {
      setValue("certificate_date", "");
    }
  }, [isCurrent, setValue]);

  const checkDuplicateCourse = (formData: CourseFormValues): boolean => {
    const institutionLower = formData.institution_name.trim().toLowerCase();
    const titleLower = formData.title.trim().toLowerCase();
    const areaLower = formData.area.trim().toLowerCase();

    return existingCourses.some((course) => {
      if (initialData && course.id === initialData.id) {
        return false;
      }

      return (
        course.institution_name.toLowerCase() === institutionLower &&
        course.title.toLowerCase() === titleLower &&
        course.area.toLowerCase() === areaLower
      );
    });
  };

  const submitForm = async (data: CourseFormValues) => {
    if (checkDuplicateCourse(data)) {
      setPendingFormData(data);
      setShowDuplicateWarning(true);
      return;
    }

    try {
      setIsSaving(true);
      await onSubmit({
        institution_name: data.institution_name.trim(),
        title: data.title.trim(),
        area: data.area.trim(),
        workload_hours: data.workload_hours.trim(),
        level: data.level.trim(),
        certificate_date: data.certificate_date ?? "",
        is_current: data.is_current,
        description: data.description.trim(),
        is_visible: Boolean(data.is_visible),
      });
    } catch {
      showErrorToast("Error al guardar el curso");
    } finally {
      setIsSaving(false);
    }
  };

  const proceedWithSubmit = async () => {
    if (!pendingFormData) return;

    try {
      setIsSaving(true);
      await onSubmit({
        institution_name: pendingFormData.institution_name.trim(),
        title: pendingFormData.title.trim(),
        area: pendingFormData.area.trim(),
        workload_hours: pendingFormData.workload_hours.trim(),
        level: pendingFormData.level.trim(),
        certificate_date: pendingFormData.certificate_date ?? "",
        is_current: pendingFormData.is_current,
        description: pendingFormData.description.trim(),
        is_visible: Boolean(pendingFormData.is_visible),
      });
    } catch {
      showErrorToast("Error al guardar el curso");
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDownCapture = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== "Enter" || e.shiftKey || e.altKey || e.ctrlKey || e.metaKey) {
      return;
    }

    const target = e.target as HTMLElement | null;
    if (target?.tagName === "TEXTAREA") {
      return;
    }

    e.preventDefault();
    formRef.current?.requestSubmit();
  };

  return (
    <form
      ref={formRef}
      id="course-form"
      onSubmit={handleSubmit(submitForm)}
      onKeyDownCapture={handleKeyDownCapture}
      className="space-y-6 px-4"
    >
      <div className="mb-6 space-y-2">
        <Label className="text-slate-300">Institución</Label>
        <Input
          {...register("institution_name")}
          placeholder="Ej: Universidad Nacional"
          disabled={!!initialData}
          className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 disabled:opacity-50"
        />
        {errors.institution_name && (
          <span className="text-xs text-red-500">{errors.institution_name.message}</span>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-slate-300">Título</Label>
          <Input
            {...register("title")}
            placeholder="Ej: Curso de Excel"
            disabled={!!initialData}
            className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 disabled:opacity-50"
          />
          {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Área</Label>
          <Input
            {...register("area")}
            placeholder="Ej: Tecnología, Gestión, Diseño"
            disabled={!!initialData}
            className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 disabled:opacity-50"
          />
          {errors.area && <span className="text-xs text-red-500">{errors.area.message}</span>}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-slate-300">Carga horaria</Label>
          <Input
            {...register("workload_hours")}
            placeholder="Ej: 40 horas"
            disabled={!!initialData}
            className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 disabled:opacity-50"
          />
          {errors.workload_hours && (
            <span className="text-xs text-red-500">{errors.workload_hours.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Nivel</Label>
          <Controller
            name='level'
            control={control}
            render={({ field }) => (
              <Combobox
                options={levels}
                value={field.value}
                onChange={field.onChange}
                placeholder='Selecciona un título'
                disabled={!!initialData}
              />
            )}
          />

          {errors.level && <span className="text-xs text-red-500">{errors.level.message}</span>}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-x-5 gap-y-2 sm:grid-cols-2">
        <div className="sm:col-span-2 flex w-full items-center gap-4">
          <div className="flex flex-1 items-center gap-2">
            <Controller
              name="is_current"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="is_current_course_cb"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />

            <Label htmlFor="is_current_course_cb" className="cursor-pointer text-xs text-slate-300">
              Actualmente cursando
            </Label>
          </div>

          <div className="flex-1 justify-end">
            {!isCurrent && (
              <div className="flex flex-col gap-2">
                <Label className="text-slate-300">Fecha de emision certificado</Label>
                <Input
                  type="date"
                  {...register("certificate_date")}
                  className="h-8 bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500"
                />
                {errors.certificate_date && (
                  <span className="text-xs text-red-500">{errors.certificate_date.message}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Descripción</Label>
        <Textarea
          {...register("description")}
          rows={3}
          placeholder="Describe los contenidos, logros o certificación del curso..."
          className="h-10 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 resize-none font-sans"
        />
        {errors.description && (
          <span className="text-xs text-red-500">{errors.description.message}</span>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Controller
          name="is_visible"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="is_visible_course_cb"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="is_visible_course_cb" className="cursor-pointer font-medium text-slate-300">
          Visible en mi portafolio
        </Label>
      </div>

      <div className="mb-3 pt-7 border-t border-slate-800 flex justify-end gap-3">
        <Button type="button" variant="outline" className="w-28" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="w-28" disabled={isSaving} form="course-form">
          {isSaving ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block align-middle" />
          ) : initialData ? (
            "Guardar Cambios"
          ) : (
            "Agregar"
          )}
        </Button>
      </div>

      <AlertDialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
        <AlertDialogContent className="border-sidebar-border dark:border-[#2a2d46] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Curso duplicado</AlertDialogTitle>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
              Ya existe un curso registrado con la misma institución, título y área. ¿Deseas continuar de todas formas?
            </p>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel className="border-sidebar-border dark:border-[#2a2d46] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1f38] hover:text-slate-900 dark:hover:text-slate-200">
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              className="bg-[#6c72ff] text-white hover:bg-[#5c61eb]"
              onClick={async () => {
                setShowDuplicateWarning(false);
                await proceedWithSubmit();
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
