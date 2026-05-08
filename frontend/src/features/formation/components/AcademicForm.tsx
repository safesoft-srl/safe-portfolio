import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";

import { showErrorToast } from "@/components/ui/showErrorToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import type { AcademicFormData, AcademicRecord } from "../types/academic.types";

const academicSchema = z
  .object({
    institution_name: z.string().min(1, "La institución es requerida"),
    title: z.string().min(1, "El título es requerido"),
    field_of_study: z.string().min(1, "El campo de estudio es requerido"),
    start_date: z.string().min(1, "La fecha de inicio es requerida"),
    end_date: z.string().optional().nullable(),
    is_current: z.boolean(),
    description: z.string().min(1, "La descripción es requerida"),
    is_visible: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (!data.is_current && !data.end_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fecha fin requerida si no esta cursando actualmente",
        path: ["end_date"],
      });
    }
  });

type AcademicFormValues = z.infer<typeof academicSchema>;

type Props = {
  initialData: AcademicRecord | null;
  onSubmit: (data: AcademicFormData) => Promise<void>;
  onCancel?: () => void;
};

const defaultValues: AcademicFormValues = {
  institution_name: "",
  title: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  is_current: false,
  description: "",
  is_visible: true,
};

export default function AcademicForm({ initialData, onSubmit, onCancel }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<AcademicFormValues>({
    resolver: zodResolver(academicSchema),
    defaultValues,
  });

  const isCurrent = watch("is_current");

  useEffect(() => {
    if (initialData) {
      reset({
        institution_name: initialData.institution_name ?? "",
        title: initialData.title ?? "",
        field_of_study: initialData.field_of_study ?? "",
        start_date: initialData.start_date ? initialData.start_date.split("T")[0] : "",
        end_date: initialData.end_date ? initialData.end_date.split("T")[0] : "",
        is_current: initialData.is_current,
        description: initialData.description ?? "",
        is_visible: initialData.is_visible,
      });
      return;
    }

    reset(defaultValues);
  }, [initialData, reset]);

  const submitForm = async (data: AcademicFormValues) => {
    try {
      setIsSaving(true);
      await onSubmit({
        institution_name: data.institution_name.trim(),
        title: data.title.trim(),
        field_of_study: data.field_of_study.trim(),
        start_date: data.start_date,
        end_date: data.end_date ?? "",
        is_current: data.is_current,
        description: data.description.trim(),
        is_visible: data.is_visible,
      });
    } catch {
      showErrorToast("Error al guardar la formación");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form id="academic-form" onSubmit={handleSubmit(submitForm)} className="space-y-6 px-4">
      <div className="mb-6 space-y-2">
        <Label className="text-slate-300">Institución</Label>
        <Input
          {...register("institution_name")}
          placeholder="Ej: Universidad Nacional"
          className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
        />
        {errors.institution_name && (
          <span className="text-xs text-red-500">{errors.institution_name.message}</span>
        )}
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-slate-300">Título</Label>
          <Input
            {...register("title")}
            placeholder="Ej: Ingeniero de Sistemas"
            className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          />
          {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Campo de Estudio</Label>
          <Input
            {...register("field_of_study")}
            placeholder="Ej: Ciencias de la Computación"
            className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
          />
          {errors.field_of_study && (
            <span className="text-xs text-red-500">{errors.field_of_study.message}</span>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
        <div className="hidden sm:block" />
        <div className="flex items-center justify-end gap-2">
          <Controller
            name="is_current"
            control={control}
            render={({ field }) => (
              <Checkbox
                id="is_current_cb"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
          <Label htmlFor="is_current_cb" className="cursor-pointer text-xs text-slate-300">
            Actualmente cursando
          </Label>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Fecha de Inicio</Label>
          <Input
            type="date"
            {...register("start_date")}
            className="h-8 bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500"
          />
          {errors.start_date && (
            <span className="text-xs text-red-500">{errors.start_date.message}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Fecha de Fin</Label>
          <Input
            type="date"
            {...register("end_date")}
            disabled={isCurrent}
            className="h-8 bg-slate-950 border-slate-800 text-white disabled:opacity-50 focus-visible:ring-indigo-500"
          />
          {errors.end_date && (
            <span className="text-xs text-red-500">{errors.end_date.message}</span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-slate-300">Descripción</Label>
        <Textarea
          {...register("description")}
          rows={3}
          placeholder="Describe el enfoque, logros o detalles relevantes de tu formación..."
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
              id="is_visible_cb"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="is_visible_cb" className="cursor-pointer font-medium text-slate-300">
          Visible en mi portafolio
        </Label>
      </div>

      <div className="mb-3 pt-7 border-t border-slate-800 flex justify-end gap-3">
        <Button 
          type="button" 
          variant="outline" 
          className="w-28" 
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button type="submit" className="w-28" disabled={isSaving} form="academic-form">
          {isSaving ? (
            <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full inline-block align-middle" />
          ) : initialData ? (
            "Guardar Cambios"
          ) : (
            "Agregar"
          )}
        </Button>
      </div>
    </form>
  );
}
