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

import type { AcademicFormData, AcademicRecord } from "../types/academic.types";

const academicSchema = z
  .object({
    institution_name: z.string().min(1, "La institución es requerida"),
    title: z.string().min(1, "El título es requerido"),
    field_of_study: z.string().min(1, "El campo de estudio es requerido"),
    end_date: z.string().optional().nullable(),
    is_current: z.boolean(),
    description: z.string(),
    is_visible: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (!data.is_current && !data.end_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Fecha fin requerida si no esta cursando actualmente",
        path: ["end_date"],
      });
    }

    if (data.end_date && !data.is_current) {
      if (data.end_date > todayStr) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La fecha de fin no puede ser mayor a la fecha actual (selecciona 'Actualidad')",
          path: ["end_date"],
        });
      }
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
  end_date: "",
  is_current: false,
  description: "",
  is_visible: true,
};

export default function AcademicForm({ initialData, onSubmit, onCancel }: Props) {
  const [isSaving, setIsSaving] = useState(false);
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
  } = useForm<AcademicFormValues>({
    resolver: zodResolver(academicSchema),
    defaultValues,
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const isCurrent = watch("is_current");
  const endDate = watch("end_date");
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    const fieldsToValidate: Array<"end_date"> = [];

    if (endDate) {
      fieldsToValidate.push("end_date");
    }

    if (fieldsToValidate.length > 0) {
      void trigger(fieldsToValidate);
    }
  }, [endDate, isCurrent, trigger]);

  useEffect(() => {
    if (initialData) {
      reset({
        institution_name: initialData.institution_name ?? "",
        title: initialData.title ?? "",
        field_of_study: initialData.field_of_study ?? "",
        end_date: initialData.end_date ? initialData.end_date.split("T")[0] : "",
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
      setValue("end_date", "");
    }
  }, [isCurrent, setValue]);

  const submitForm = async (data: AcademicFormValues) => {
    try {
      setIsSaving(true);
      await onSubmit({
        institution_name: data.institution_name.trim(),
        title: data.title.trim(),
        field_of_study: data.field_of_study.trim(),
        end_date: data.is_current ? "" : (data.end_date ?? ""),
        is_current: data.is_current,
        description: data.description.trim(),
        is_visible: Boolean(data.is_visible),
      });
    } catch {
      showErrorToast("Error al guardar la formación");
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
      id="academic-form"
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

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label className="text-slate-300">Título</Label>
          <Input
            {...register("title")}
            placeholder="Ej: Licenciatura, Master, etc."
            disabled={!!initialData}
            className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 disabled:opacity-50"
          />
          {errors.title && <span className="text-xs text-red-500">{errors.title.message}</span>}
        </div>

        <div className="space-y-2">
          <Label className="text-slate-300">Campo de Estudio</Label>
          <Input
            {...register("field_of_study")}
            placeholder="Ej: Ingeniero en Informatica, etc."
            disabled={!!initialData}
            className="h-8 bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 disabled:opacity-50"
          />
          {errors.field_of_study && (
            <span className="text-xs text-red-500">{errors.field_of_study.message}</span>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
        <div className="sm:col-span-2 flex items-center gap-4 w-full">
          <div className="flex-1 flex items-center gap-2">
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

          <div className="flex-1 justify-end">
            {!isCurrent && (
              <div className="flex flex-col gap-2">
                <Label className="text-slate-300">Fecha de emision titulo</Label>
                <Input
                  type="date"
                  {...register("end_date")}
                  className="h-8 bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500"
                />
                {errors.end_date && (
                  <span className="text-xs text-red-500">{errors.end_date.message}</span>
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
            <Checkbox id="is_visible_cb" checked={field.value} onCheckedChange={field.onChange} />
          )}
        />
        <Label htmlFor="is_visible_cb" className="cursor-pointer font-medium text-slate-300">
          Visible en mi portafolio
        </Label>
      </div>

      <div className="mb-3 pt-7 border-t border-slate-800 flex justify-end gap-3">
        <Button type="button" variant="outline" className="w-28" onClick={onCancel}>
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
