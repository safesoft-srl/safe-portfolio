import { useState, useEffect } from "react";
import { showErrorToast } from "@/components/ui/showErrorToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {UploadSimple, TrashSimple } from "@phosphor-icons/react";
import { SkillComboBox } from "@/components/SkillComboBox";
import type { Skill } from "@/services/skill.service";
import type { BaseProjectDTO, Project } from "../types/project.types";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";


type Props = {
  skills: Skill[];
  onSubmit: (data: BaseProjectDTO, file: File | null) => Promise<void>;
  initialData: Project | null;
};

export default function ProjectForm({
  skills,
  onSubmit,
  initialData,
}: Props) {

  const [form, setForm] = useState<BaseProjectDTO>({
    name: "",
    description: "",
    url_demo: "",
    url_github: "",
    url_image: "",
    skill_ids: [],
    skill_projects: [],
  });

  const [errors, setErrors] = useState({
    name:"",
    description:"",
    url_github:"",
    skill_ids:"",
  });

  const [imagePreview, setImagePreview] = useState<string>("/src/assets/image.png");
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      if (initialData.url_image) {
        setImagePreview(initialData.url_image);
      }
    }
  }, [initialData]);

  const validate = () => {
    if (!form.name.trim()) return "El nombre del proyecto es obligatorio.";
    if (!form.description.trim()) return "La descripción es obligatoria.";
    if (!form.url_github.trim()) return "La URL de GitHub es obligatoria.";
    if (form.skill_projects.length === 0) return "Selecciona al menos una habilidad.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      showErrorToast(error);
      return;
    }

    setIsSaving(true);

    try {
      await onSubmit(form, fileImage);
    } catch {
      showErrorToast("Error al guardar proyecto");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form
      className="text-left"
      onSubmit={handleSubmit}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="projectName"
              className="text-xs font-semibold text-slate-900 dark:text-slate-300"
            >
              Nombre del Proyecto *
            </Label>
            <Input
              id="projectName"
              name="projectName"
              value={form.name}
              onChange={(e) => {
                setForm((f) => ({ ...f, name: e.target.value }));
                if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
              }}
              onBlur={(e) =>
                setErrors((prev) => ({
                  ...prev,
                  name: e.target.value.trim() ? "" : "El nombre del proyecto es obligatorio.",
                }))
              }
              placeholder="Ej: Plataforma de Portafolios"
              className={`h-10 rounded-xl border bg-input dark:bg-[#1f2552] px-4 text-sm text-slate-900 dark:text-slate-200 placeholder:text-[#8c91b7] focus-visible:ring-2 focus-visible:ring-[#5d68f5] disabled:cursor-not-allowed disabled:opacity-50${errors.name ? " border-red-500" : ""}`}
            />
            {errors.name && (
              <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>
                {errors.name}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="projectDescription"
              className="text-xs font-semibold text-slate-900 dark:text-slate-300"
            >
              Descripción *
            </Label>
            <textarea
              id="projectDescription"
              name="projectDescription"
              value={form.description}
              onChange={(e) => {
                setForm((f) => ({ ...f, description: e.target.value }));
                if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
              }}
              onBlur={(e) =>
                setErrors((prev) => ({
                  ...prev,
                  description: e.target.value.trim() ? "" : "La descripción es obligatoria.",
                }))
              }
              placeholder="Describe brevemente el objetivo y alcance del proyecto."
              rows={4}
              className={`w-full rounded-xl border bg-input dark:bg-[#1f2552] px-4 py-2 text-sm md:text-xs/relaxed text-slate-900 dark:text-slate-200 placeholder:text-[#8c91b7] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5d68f5] disabled:cursor-not-allowed disabled:opacity-50 custom-scrollbar resize-none${errors.description ? " border-red-500" : ""}`}
              style={{
                scrollbarColor: "#23234a #181c2f",
                scrollbarWidth: "thin",
                minHeight: "96px",
                maxHeight: "96px",
              }}
            />
            {errors.description && (
              <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>
                {errors.description}
              </p>
            )}
            <style>{`
                            .custom-scrollbar::-webkit-scrollbar {
                                width: 8px;
                                background: #181c2f;
                            }
                            .custom-scrollbar::-webkit-scrollbar-thumb {
                                background: #23234a;
                                border-radius: 8px;
                            }
                        `}</style>
          </div>
          <div className="-mt-2">
            <SkillComboBox
              skills={skills}
              selected={form.skill_projects}
              onChange={(selectedSkills) => {
                setForm((f) => ({ 
                  ...f,
                  skill_projects: selectedSkills,
                  skill_ids: selectedSkills.map(s => s.id),
                 }));
                if (errors.skill_ids) setErrors((prev) => ({ ...prev, skill_ids: "" }));
              }}
              label="Habilidades"
              placeholder="Busca y selecciona habilidades..."
            />
            {errors.skill_ids && (
              <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>
                {errors.skill_ids}
              </p>
            )}
          </div>
        </div>
        {/* Columna Derecha */}
        <div className="flex flex-col gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="urlGithub"
              className="text-xs font-semibold text-slate-900 dark:text-slate-300"
            >
              URL GitHub
            </Label>
            <Input
              id="urlGithub"
              name="urlGithub"
              value={form.url_github}
              onChange={(e) => {
                setForm((f) => ({ ...f, url_github: e.target.value }));
                if (errors.url_github) setErrors((prev) => ({ ...prev, url_github: "" }));
              }}
              onBlur={(e) =>
                setErrors((prev) => ({
                  ...prev,
                  url_github: e.target.value.trim() ? "" : "La URL de GitHub es obligatoria.",
                }))
              }
              placeholder="https://github.com/usuario/proyecto"
              className={`h-10 rounded-xl border bg-input dark:bg-[#1f2552] px-4 text-sm text-slate-900 dark:text-slate-200 placeholder:text-[#8c91b7] focus-visible:ring-2 focus-visible:ring-[#5d68f5] disabled:cursor-not-allowed disabled:opacity-50${errors.url_github ? " border-red-500" : ""}`}
            />
            {errors.url_github && (
              <p className="text-xs mt-1" style={{ color: "var(--destructive)" }}>
                {errors.url_github}
              </p>
            )}
          </div>
          <div className="space-y-1.5">
            <Label
              htmlFor="urlDemo"
              className="text-xs font-semibold text-slate-900 dark:text-slate-300"
            >
              URL Demo
            </Label>
            <Input
              id="urlDemo"
              name="urlDemo"
              value={form.url_demo}
              onChange={(e) => setForm((f) => ({ ...f, url_demo: e.target.value }))}
              placeholder="https://proyecto.com"
              className="h-10 rounded-xl border bg-input dark:bg-[#1f2552] px-4 text-sm text-slate-900 dark:text-slate-200 placeholder:text-[#8c91b7] focus-visible:ring-2 focus-visible:ring-[#5d68f5] disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          {/* Imagen y acciones de carga/eliminar */}
          <div className="flex flex-col items-center w-full mb-2">
            <div className="w-full">
              <img
                src={form.url_image || imagePreview}
                alt="Vista previa"
                className="object-cover rounded-xl border border-sidebar-border bg-black/60 w-full h-60"
                style={{ minHeight: 120, background: "#181c2f" }}
                onError={(e) => (e.currentTarget.src = "/src/assets/image.png")}
              />
            </div>
            <div className="flex gap-2 mt-3">
              <label
                htmlFor="project-image-upload"
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-[#6c72ff] text-white text-xs font-medium cursor-pointer hover:bg-[#5c61eb]"
              >
                <UploadSimple size={14} />
                {form.url_image ? "Subir Otra" : "Subir Imagen"}
                <input
                  id="project-image-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setFileImage(file);
                      const reader = new FileReader();
                      reader.onload = (ev) => {
                        const imgData = ev.target?.result as string;
                        setForm((f) => ({ ...f, url_image: imgData }));
                        setImagePreview(imgData);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {form.url_image && (
                <AlertDialog>
                  <AlertDialogTrigger
                    type="button"
                    className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600"
                  >
                    <TrashSimple size={14} />
                    Eliminar Imagen
                  </AlertDialogTrigger>
                  <AlertDialogContent className="border-sidebar-border dark:border-[#2a2d46] bg-white dark:bg-[#151a3f] text-slate-900 dark:text-slate-100 backdrop-blur-sm">
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar imagen del proyecto?</AlertDialogTitle>
                      <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
                        Esta acción quitará la imagen actual y volverá a la imagen por
                        defecto.
                      </p>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-sidebar-border dark:border-[#2a2d46] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1f38] hover:text-slate-900 dark:hover:text-slate-200">
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-[#e53e3e] text-white hover:bg-[#c53030]"
                        onClick={() => {
                          setForm((f) => ({ ...f, project_image: "" }));
                          setImagePreview("/src/assets/image.png");
                        }}
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-1.5"></div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setIsPublic((prev) => !prev)}
          className={`relative inline-flex h-5 w-9 items-center rounded-full border text-[0.625rem] transition-colors ${isPublic ? "border-[#6c72ff] bg-[#6c72ff]" : "border-sidebar-border bg-input/40"
            }`}
        >
          <span
            className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${isPublic ? "translate-x-4" : "translate-x-1"
              }`}
          />
        </button>
        <span className="text-xs font-medium text-sidebar-foreground">
          Visible en portafolio público
        </span>
      </div>

      <AlertDialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="submit"
          className="h-10 rounded-lg bg-[#6c72ff] px-5 text-sm font-medium text-white hover:bg-[#5c61eb] sm:min-w-[150px] flex items-center justify-center"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full inline-block align-middle" />
              {initialData === null ? "" : ""}
            </>
          ) : initialData === null ? (
            "Guardar Cambios"
          ) : (
            "Agregar Proyecto"
          )}
        </Button>
        <AlertDialogCancel className="h-10 rounded-lg border-sidebar-border text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1f38] hover:text-slate-900 dark:hover:text-white sm:min-w-[110px]">
          Cancelar
        </AlertDialogCancel>
      </AlertDialogFooter>
    </form>
  );
}