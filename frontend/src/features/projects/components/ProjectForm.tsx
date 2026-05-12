import { useState, useEffect } from "react";
import { showErrorToast } from "@/components/ui/showErrorToast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { UploadSimple, TrashSimple } from "@phosphor-icons/react";
import { SkillComboBox } from "@/components/SkillComboBox";
import { Checkbox } from "@/components/ui/checkbox";
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
import defaultProjectImage from "@/assets/image.png";

const DEFAULT_PROJECT_IMAGE = defaultProjectImage;
const PROJECT_NAME_MAX_LENGTH = 70;
const PROJECT_DESCRIPTION_MAX_LENGTH = 240;
const PROJECT_NAME_MAX_ERROR = "Solo se permite 70 letras en el nombre del proyecto.";
const PROJECT_DESCRIPTION_MAX_ERROR = "Solo se permite 240 letras en la descripción.";
const PROJECT_NAME_REQUIRED_ERROR = "El nombre del proyecto es obligatorio.";
const PROJECT_DESCRIPTION_REQUIRED_ERROR = "La descripción es obligatoria.";

type Props = {
  skills: Skill[];
  onSubmit: (data: BaseProjectDTO, file: File | null, deleteImage:boolean) => Promise<void>;
  initialData: Project | null;
  existingProjects?: Project[];
};

export default function ProjectForm({
  skills,
  onSubmit,
  initialData,
  existingProjects = [],
}: Props) {
  const [form, setForm] = useState<BaseProjectDTO>({
    name: "",
    description: "",
    url_demo: "",
    url_github: "",
    url_image: "",
    skill_ids: [],
    skill_projects: [],
    visible: true,
  });

  const [errors, setErrors] = useState({
    name: "",
    description: "",
    skill_ids: "",
    url_github: "",
  });

  const [imagePreview, setImagePreview] = useState<string>(DEFAULT_PROJECT_IMAGE);
  const [fileImage, setFileImage] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublic, setIsPublic] = useState(true);
  const [showDuplicateWarning, setShowDuplicateWarning] = useState(false);
  const [deleteImage, setDeleteImage] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setIsPublic(initialData.visible);
      if (initialData.url_image) {
        setImagePreview(initialData.url_image);
      }
    }
  }, [initialData]);

  const validate = () => {
    if (!form.name.trim()) return PROJECT_NAME_REQUIRED_ERROR;
    if (form.name.length > PROJECT_NAME_MAX_LENGTH) {
      return PROJECT_NAME_MAX_ERROR;
    }
    if (!form.description.trim()) return PROJECT_DESCRIPTION_REQUIRED_ERROR;
    if (form.description.length > PROJECT_DESCRIPTION_MAX_LENGTH) {
      return PROJECT_DESCRIPTION_MAX_ERROR;
    }

    if (form.url_github.trim()) {
      const githubRegex = /^https:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/;
      if (!githubRegex.test(form.url_github)) {
        return "La URL de GitHub debe tener el formato: https://github.com/usuario/proyecto";
      }
    }

    if (form.url_demo) {
      const demoRegex =
        /^https:\/\/(www\.[\w.-]+\.[a-zA-Z]{2,}(\/.*)?|[\w-]+\.railway\.app\/?|[\w-]+\.vercel\.app\/?)+$/;
      if (!demoRegex.test(form.url_demo)) {
        return "La URL de demo debe tener el formato: https://www.sitio.com, railway.app o vercel.app";
      }
    }

    if (form.skill_projects.length === 0) return "Selecciona al menos una tecnología.";
    return null;
  };

  const checkDuplicateName = (): boolean => {
    const currentNameLower = form.name.trim().toLowerCase();

    return existingProjects.some((project) => {
      if (initialData && project.id === initialData.id) {
        return false;
      }

      return project.name.toLowerCase() === currentNameLower;
    });
  };

  const handleNameChange = (value: string) => {
    const limitedValue = value.slice(0, PROJECT_NAME_MAX_LENGTH);
    setForm((f) => ({ ...f, name: limitedValue }));

    if (value.length > PROJECT_NAME_MAX_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        name: PROJECT_NAME_MAX_ERROR,
      }));
      return;
    }

    if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
  };

  const handleNameBlur = (value: string) => {
    setErrors((prev) => ({
      ...prev,
      name: !value.trim()
        ? PROJECT_NAME_REQUIRED_ERROR
        : value.length > PROJECT_NAME_MAX_LENGTH
          ? PROJECT_NAME_MAX_ERROR
          : "",
    }));
  };

  const handleDescriptionChange = (value: string) => {
    const limitedValue = value.slice(0, PROJECT_DESCRIPTION_MAX_LENGTH);
    setForm((f) => ({ ...f, description: limitedValue }));

    if (value.length > PROJECT_DESCRIPTION_MAX_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        description: PROJECT_DESCRIPTION_MAX_ERROR,
      }));
      return;
    }

    if (errors.description) setErrors((prev) => ({ ...prev, description: "" }));
  };

  const handleDescriptionBlur = (value: string) => {
    setErrors((prev) => ({
      ...prev,
      description: !value.trim()
        ? PROJECT_DESCRIPTION_REQUIRED_ERROR
        : value.length > PROJECT_DESCRIPTION_MAX_LENGTH
          ? PROJECT_DESCRIPTION_MAX_ERROR
          : "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const error = validate();
    if (error) {
      showErrorToast(error);
      return;
    }

    if (checkDuplicateName()) {
      setShowDuplicateWarning(true);
      return;
    }
    await proceedWithSubmit();
  };

  const proceedWithSubmit = async () => {
    setIsSaving(true);
    try {
      await onSubmit(form, fileImage, deleteImage);
    } catch {
      showErrorToast("Error al guardar proyecto");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form className="text-left" onSubmit={handleSubmit}>
      <div
        className={`transition-all duration-200 ${showDuplicateWarning ? "blur-sm pointer-events-none" : ""}`}
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
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={(e) => handleNameBlur(e.target.value)}
                placeholder="Ej: Plataforma de Portafolios"
                className={`h-8 rounded-xl border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50${errors.name ? " border-red-500" : ""}`}
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
              <Textarea
                id="projectDescription"
                name="projectDescription"
                value={form.description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                onBlur={(e) => handleDescriptionBlur(e.target.value)}
                placeholder="Describe brevemente el objetivo y alcance del proyecto."
                className={`min-h-24 h-8 rounded-xl border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50 custom-scrollbar${errors.description ? " border-red-500" : ""}`}
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
            <div className="-mt-1">
              <SkillComboBox
                skills={skills}
                selected={form.skill_projects}
                onChange={(selectedSkills) => {
                  setForm((f) => ({
                    ...f,
                    skill_projects: selectedSkills,
                    skill_ids: selectedSkills.map((s) => s.id),
                  }));
                  if (errors.skill_ids) setErrors((prev) => ({ ...prev, skill_ids: "" }));
                }}
                label="Tecnologías"
                placeholder="Busca y selecciona tecnologías..."
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
            <div className="space-y-1.5 mt-2">
              <Label
                htmlFor="urlGithub"
                className="text-xs font-semibold text-slate-900 dark:text-slate-300"
              >
                URL GitHub (Opcional)
              </Label>
              <Input
                id="urlGithub"
                name="urlGithub"
                value={form.url_github}
                onChange={(e) => {
                  setForm((f) => ({ ...f, url_github: e.target.value }));
                  if (errors.url_github) setErrors((prev) => ({ ...prev, url_github: "" }));
                }}
                onBlur={() =>
                  setErrors((prev) => ({
                    ...prev,
                    url_github: "",
                  }))
                }
                placeholder="https://github.com/usuario/proyecto"
                className={`h-8 rounded-xl border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50${errors.url_github ? " border-red-500" : ""}`}
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
                className="h-8 rounded-xl border bg-slate-950 border-slate-800 text-white placeholder-slate-500 focus-visible:ring-indigo-500 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-50"
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
                  onError={(e) => (e.currentTarget.src = DEFAULT_PROJECT_IMAGE)}
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
                          Esta acción quitará la imagen actual y volverá a la imagen por defecto.
                        </p>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="border-sidebar-border dark:border-[#2a2d46] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1f38] hover:text-slate-900 dark:hover:text-slate-200">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-[#e53e3e] text-white hover:bg-[#c53030]"
                          onClick={() => {
                            setForm((f) => ({ ...f, url_image: "" }));
                            setFileImage(null);
                            setImagePreview(DEFAULT_PROJECT_IMAGE);
                            setDeleteImage(true);
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
          <Checkbox
            id="is_public_cb"
            checked={isPublic}
            onCheckedChange={() => {
              setIsPublic((prev) => !prev);
              setForm((f) => ({ ...f, visible: !isPublic }));
            }}
          />
          <Label
            htmlFor="is_public_cb"
            className="cursor-pointer font-medium text-sidebar-foreground text-xs"
          >
            Visible en portafolio público
          </Label>
        </div>
        <div className="pt-4 border-t border-slate-800 flex justify-end gap-3 mt-8"></div>
        <AlertDialogFooter className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="submit" size="lg" className="sm:min-w-[150px]" disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="animate-spin h-5 w-5 mr-2 border-2 border-white border-t-transparent rounded-full inline-block align-middle" />
              </>
            ) : initialData !== null ? (
              "Guardar Cambios"
            ) : (
              "Agregar Proyecto"
            )}
          </Button>
          <AlertDialogCancel className="h-8 rounded-lg border-sidebar-border text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1f38] hover:text-slate-900 dark:hover:text-white sm:min-w-[110px]">
            Cancelar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </div>

      {/* Modal de advertencia de proyecto duplicado */}
      <AlertDialog open={showDuplicateWarning} onOpenChange={setShowDuplicateWarning}>
        <AlertDialogContent className="border-sidebar-border dark:border-[#2a2d46] bg-white dark:bg-[#151a3f] text-slate-900 dark:text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>Proyecto con nombre duplicado</AlertDialogTitle>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-2">
              Ya existe un proyecto registrado con el nombre "{form.name}". ¿Deseas continuar de
              todas formas?
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
