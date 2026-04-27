import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../lib/axios";
import { AxiosError } from "axios";
import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import {
  PlusIcon,
  PencilSimpleIcon,
  TrashIcon,
  BuildingsIcon,
  CircleNotchIcon,
  X,
} from "@phosphor-icons/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";


// Types
interface WorkExperience {
  id: number;
  user_id: number;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  achievements: string;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

// Zod Schema
const experienceSchema = z
  .object({
    company: z.string().min(1, "La empresa es requerida").max(50, "Máximo 50 caracteres"),
    position: z.string().min(1, "La posición es requerida").max(70, "Máximo 70 caracteres"),
    start_date: z.string().min(1, "La fecha de inicio es requerida"),
    end_date: z.string().nullable().optional(),
    is_current: z.boolean(),
    description: z.string().max(255, "Máximo 255 caracteres"),
    achievements: z.array(z.string().max(100, "Máximo 100 caracteres por logro")).nullable().optional(),
    is_visible: z.boolean(),
  })
  .superRefine((data, ctx) => {
    const todayStr = new Date().toISOString().split("T")[0];

    if (data.start_date && data.start_date > todayStr) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de inicio no puede ser mayor a la fecha actual",
        path: ["start_date"],
      });
    }

    if (!data.is_current && !data.end_date) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de fin es requerida si no es su trabajo actual",
        path: ["end_date"],
      });
    }

    if (data.end_date) {
      // No puede ser futura
      if (data.end_date > todayStr) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La fecha de fin no puede ser mayor a la fecha actual (selecciona 'Actualidad')",
          path: ["end_date"],
        });
      }

      // No puede ser anterior a la de inicio
      if (data.start_date && data.end_date < data.start_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "La fecha de fin no puede ser anterior a la fecha de inicio",
          path: ["end_date"],
        });
      }
    }
  });


type ExperienceFormData = z.infer<typeof experienceSchema>;

export default function ExperiencePage() {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<WorkExperience | null>(null);

  const { data: experiences, isLoading } = useQuery({
    queryKey: ["work-experiences"],
    queryFn: async () => {
      const response = await api.get<{ data: WorkExperience[] }>("/api/me/work-experiences");
      return response.data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: (newExp: ExperienceFormData) => api.post("/api/me/work-experiences", newExp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-experiences"] });
      handleCloseModal();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setErrMsg(error?.response?.data.message || "Error al crear la experiencia");
      }
    },
  });
  const [errMsg, setErrMsg] = useState<string | null>(null);
  const updateMutation = useMutation({
    mutationFn: (data: { id: number; exp: ExperienceFormData }) =>
      api.put(`/api/me/work-experiences/${data.id}`, data.exp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-experiences"] });
      handleCloseModal();
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        setErrMsg(error?.response?.data.message);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/me/work-experiences/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["work-experiences"] });
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      is_current: false,
      is_visible: true,
      description: "",
      achievements: [],
      company: "",
      position: "",
      start_date: "",
      end_date: "",
    },
  });

  const isCurrent = watch("is_current");

  const handleOpenModal = (exp?: WorkExperience) => {
    if (exp) {
      setEditingExperience(exp);
      reset({
        company: exp.company,
        position: exp.position,
        start_date: exp.start_date ? exp.start_date.split("T")[0] : "",
        end_date: exp.end_date ? exp.end_date.split("T")[0] : "",
        is_current: exp.is_current,
        description: exp.description,
        achievements: exp.achievements ? exp.achievements.split("\n").filter(Boolean) : [],

        is_visible: exp.is_visible,
      });
    } else {
      setEditingExperience(null);
      reset({
        is_current: false,
        is_visible: true,
        company: "",
        position: "",
        start_date: "",
        end_date: "",
        description: "",
        achievements: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingExperience(null);
    reset();
  };

  const onSubmit = (data: ExperienceFormData) => {
    const payload = {
      ...data,
      achievements: data.achievements ? data.achievements.join("\n") : "",
    };

    if (editingExperience) {
      updateMutation.mutate({
        id: editingExperience.id,
        exp: payload as unknown as ExperienceFormData,
      });
    } else {
      createMutation.mutate(payload as unknown as ExperienceFormData);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex-1">
          Experiencia Laboral
        </h1>
        <Button size="lg" onClick={() => handleOpenModal()}>
          <PlusIcon weight="bold" />
          Agregar Experiencia
        </Button>
      </div>

      {/* List */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-slate-400 text-center py-12">Cargando experiencia...</div>
        ) : experiences && experiences.length > 0 ? (
          experiences.map((exp) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group relative flex flex-col bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 pr-16 sm:p-6 sm:pr-6 transition-all hover:bg-slate-900/80 hover:border-indigo-500/50 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-indigo-900 text-white px-4 py-1.5 rounded-full font-bold text-sm sm:text-base shadow-sm">
                    {exp.position}
                  </span>
                </div>

                <div className="flex items-center sm:justify-end">
                  <span className="bg-indigo-900 text-indigo-100 px-3 py-1.5 rounded-full font-semibold text-xs sm:text-sm whitespace-nowrap">
                    {exp.start_date
                      ? format(parseISO(exp.start_date), "MMM yyyy", { locale: es })
                      : ""}{" "}
                    -{" "}
                    {exp.is_current
                      ? "Presente"
                      : exp.end_date
                        ? format(parseISO(exp.end_date), "MMM yyyy", { locale: es })
                        : ""}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                <BuildingsIcon size={18} className="text-indigo-400" />
                <span className="font-medium text-slate-200">{exp.company}</span>
              </div>

              <div className="flex-1 mt-2">
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-4">
                  {exp.description}
                </p>

                {exp.achievements && (
                  <div className="text-sm">
                    <strong className="text-slate-400 block mb-1">Logros:</strong>
                    <ul className="list-disc pl-5 text-slate-300 space-y-1">
                      {(exp.achievements ? exp.achievements.split("\n") : [])
                        .filter(Boolean)
                        .map((ach: string, i: number) => (
                          <li key={i}>{ach}</li>
                        ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="absolute top-4 right-4 sm:top-auto sm:bottom-4  transition-all flex gap-2">
                <Button
                  className="cursor-pointer"
                  onClick={() => handleOpenModal(exp)}
                  variant="ghost"
                  size="icon-lg"
                >
                  <PencilSimpleIcon weight="bold" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        className="hover:text-red-500 cursor-pointer"
                        variant="ghost"
                        size="icon-lg"
                      >
                        <TrashIcon weight="bold" />
                      </Button>
                    }
                  ></AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-900 border-slate-800 w-[60%] sm:w-full">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-white">¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription className="text-slate-400">
                        Esta acción no se puede deshacer. Se eliminará permanentemente la
                        experiencia laboral.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="bg-slate-800 text-white border-none hover:bg-slate-700 hover:text-white">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteMutation.mutate(exp.id)}
                        className="bg-red-600 text-white hover:bg-red-700 border-none"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-slate-400 text-center py-12 border border-slate-800 border-dashed rounded-2xl bg-slate-900/30">
            No tienes experiencias laborales registradas.
          </div>
        )}
      </div>

      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) handleCloseModal();
        }}
      >
        <DialogContent className="sm:max-w-2xl bg-slate-900 border-slate-800 flex flex-col max-h-[90vh]">
          <DialogHeader className="border-b border-slate-800 pb-4">
            <DialogTitle className="text-xl font-bold text-white">
              {editingExperience ? "Editar Experiencia Laboral" : "Nueva Experiencia Laboral"}
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto flex-1 custom-scrollbar -mx-4 px-4 py-4 space-y-5">
            <form id="experience-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label className="text-slate-300">Empresa</Label>
                  <Input
                    {...register("company")}
                    maxLength={50}
                    placeholder="Ej: Microsoft"
                    className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
                  />
                  {errors.company && (
                    <span className="text-xs text-red-500">{errors.company.message}</span>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-slate-300">Cargo / Posición</Label>
                  <Input
                    {...register("position")}
                    maxLength={70}
                    placeholder="Ej: Senior Developer"
                    className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500"
                  />
                  {errors.position && (
                    <span className="text-xs text-red-500">{errors.position.message}</span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 items-end">
                <div className="space-y-2">
                  <Label className="text-slate-300 mb-4">Fecha de Inicio</Label>
                  <Input
                    type="date"
                    {...register("start_date")}
                    className="bg-slate-950 border-slate-800 text-white focus-visible:ring-indigo-500"
                  />
                  {errors.start_date && (
                    <span className="text-xs text-red-500">{errors.start_date.message}</span>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-300">Fecha de Fin</Label>
                    <div className="flex items-center gap-2">
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
                      <Label htmlFor="is_current_cb" className="cursor-pointer text-xs">
                        Actualidad
                      </Label>
                    </div>
                  </div>
                  <Input
                    type="date"
                    {...register("end_date")}
                    disabled={isCurrent}
                    className="bg-slate-950 border-slate-800 text-white disabled:opacity-50 focus-visible:ring-indigo-500"
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
                  maxLength={255}
                  rows={3}
                  placeholder="Describe tus responsabilidades..."
                  className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 resize-none font-sans"
                />
                {errors.description && (
                  <span className="text-xs text-red-500">{errors.description.message}</span>
                )}
              </div>

              <Controller
                name="achievements"
                control={control}
                render={({ field }) => {
                  const valueArray = Array.isArray(field.value) ? field.value : [];
                  return (
                    <div className="space-y-3">
                      <Label className="text-slate-300">
                        Logros{" "}
                        <span className="text-slate-500 font-normal">
                          (Opcional, presiona Enter o el botón para agregar)
                        </span>
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="achievement-input"
                          maxLength={100}
                          placeholder="Ej: Reduje los tiempos de carga en un 50%"
                          className="bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 font-sans"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const val = e.currentTarget.value.trim();
                              if (val) {
                                field.onChange([...valueArray, val]);
                                e.currentTarget.value = "";
                              }
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white border-none"
                          onClick={() => {
                            const input = document.getElementById(
                              "achievement-input"
                            ) as HTMLInputElement;
                            if (input) {
                              const val = input.value.trim();
                              if (val) {
                                field.onChange([...valueArray, val]);
                                input.value = "";
                              }
                            }
                          }}
                        >
                          <PlusIcon weight="bold" />
                        </Button>
                      </div>
                      {valueArray.length > 0 && (
                        <div className="flex flex-col gap-2">
                          {valueArray.map((achievement, idx) => (
                            <div
                              key={idx}
                              className="flex items-start justify-between w-full bg-slate-900 border border-slate-800 text-slate-300 px-3 py-2.5 rounded-lg text-xs"
                            >
                              <span className="flex-1">{achievement}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const newArr = [...valueArray];
                                  newArr.splice(idx, 1);
                                  field.onChange(newArr);
                                }}
                                className="text-slate-500 hover:text-red-400 transition-colors ml-3 shrink-0 mt-0.5"
                              >
                                <X weight="bold" size={16} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }}
              />

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
                <Label
                  htmlFor="is_visible_cb"
                  className="cursor-pointer font-medium text-slate-300"
                >
                  Visible en mi portafolio
                </Label>
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 mt-auto">
            <span className="text-red-500 text-xs self-center mr-auto">{errMsg}</span>
            <Button type="button" variant="outline" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              className="w-20"
              onClick={() => setErrMsg("")}
              form="experience-form"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {createMutation.isPending || updateMutation.isPending ? (
                <CircleNotchIcon className="animate-spin" />
              ) : (
                "Guardar"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
