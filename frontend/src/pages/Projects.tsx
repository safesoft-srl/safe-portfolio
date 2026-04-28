import { useState, useEffect } from "react";
import {
  createProject,
  updateProject,
  deleteProject,
} from "@/features/projects/services/project.service";
import { http } from "@/services/http.service";
import { getProfile } from "@/services/profile.service";
import { getSkills, type Skill } from "@/services/skill.service";
import { Plus, X, Trash, PencilSimple, UploadSimple, TrashSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { showErrorToast } from "@/components/ui/showErrorToast";
import { SkillComboBox } from "@/components/SkillComboBox";

type Project = {
  id: number;
  portfolio_id: number;
  name: string;
  description: string;
  url_demo: string | null;
  url_github: string | "";
  url_image: string | null;
  skill_ids: number[];
  skill_projects?: { skill_name: string }[];
};

export default function Projects() {
  const [isPublic, setIsPublic] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    url_demo: "",
    url_github: "",
    url_image: "",
    skill_ids: [] as number[],
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
    skill_ids: "",
    url_github: "",
  });
  // Estado para previsualización de imagen
  const [imagePreview, setImagePreview] = useState<string>("/src/assets/image.png");
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [fileImage, setFileImage] = useState<File | null>(null);

  const syncSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch {
      setSkills([]);
    }
  };

  // Sincronizar proyectos con el backend usando portfolioId
  const syncProjects = async (pid?: number | null) => {
    try {
      if (!pid && portfolioId == null) return;
      const id = pid ?? portfolioId;
      if (!id) return;
      const response = await http.get(`/api/portfolios/${id}/projects`);
      const data = response.data;
      if (Array.isArray(data.data)) {
        setProjects(data.data);
      } else if (Array.isArray(data)) {
        setProjects(data);
      }
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  // Al montar, obtener portfolioId y luego cargar proyectos y skills
  useEffect(() => {
    let isMounted = true;
    (async () => {
      if (isMounted) {
        try {
          const profile = await getProfile();
          if (profile?.id) {
            setPortfolioId(profile.id);
            await Promise.all([syncProjects(profile.id), syncSkills()]);
          } else {
            setPortfolioId(null);
            await syncSkills();
          }
        } catch {
          setPortfolioId(null);
          await syncSkills();
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-5xl items-center justify-center font-sans text-slate-900 dark:text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#6c72ff] border-t-transparent" />
          <span className="text-sm text-slate-700 dark:text-slate-200">Cargando...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <main className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-7xl flex-col px-1 pb-4 text-foreground font-sans">
          <header className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Proyectos</h1>
            </div>

            <AlertDialogTrigger>
              <Button
                type="button"
                className="inline-flex items-center gap-2 h-9 rounded-xl bg-[#6c72ff] px-4 text-xs sm:text-sm font-medium tracking-wide text-white font-heading hover:bg-[#5c61eb]"
                onClick={() => {
                  setEditIndex(null);
                  setForm({
                    name: "",
                    description: "",
                    url_demo: "",
                    url_github: "",
                    url_image: "",
                    skill_ids: [],
                  });
                  setIsPublic(true);
                  setOpen(true);
                }}
              >
                <Plus weight="bold" className="size-4" />
                <span>Nuevo Proyecto</span>
              </Button>
            </AlertDialogTrigger>
          </header>

          <section className="mt-4 flex w-full flex-1 items-start">
            {projects.length === 0 ? (
              <div className="w-full rounded-2xl bg-sidebar px-8 py-10 border border-sidebar-border">
                <div className="mx-auto flex max-w-xl flex-col items-center justify-center gap-4 text-center py-6">
                  <p className="text-sm text-sidebar-foreground">
                    Aún no has agregado ningún proyecto
                  </p>
                  <AlertDialogTrigger>
                    <Button
                      type="button"
                      className="inline-flex items-center gap-2 h-10 rounded-xl bg-[#6c72ff] px-5 text-xs sm:text-sm font-medium tracking-wide text-white font-heading hover:bg-[#5c61eb]"
                      onClick={() => {
                        setEditIndex(null);
                        setForm({
                          name: "",
                          description: "",
                          url_demo: "",
                          url_github: "",
                          url_image: "",
                          skill_ids: [],
                        });
                        setIsPublic(true);
                        setOpen(true);
                      }}
                    >
                      <Plus weight="bold" className="size-4" />
                      <span>Agregar tu Primer Proyecto</span>
                    </Button>
                  </AlertDialogTrigger>
                </div>
              </div>
            ) : (
              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project, idx) => {
                  const skillIds: number[] = Array.isArray(project.skill_ids)
                    ? project.skill_ids
                    : [];
                  return (
                    <div key={idx} className="max-w-3xl min-w-[250px]">
                      <div className="rounded-2xl bg-sidebar px-4 py-6 border border-sidebar-border">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex flex-col flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <h2 className="text-base sm:text-lg font-bold text-white mb-1">
                                {project.name}
                              </h2>
                              <div className="flex gap-2 ml-3 shrink-0">
                                <button
                                  className="hover:bg-[#23234a] p-2 rounded-md"
                                  title="Editar"
                                  onClick={() => {
                                    setEditIndex(idx);
                                    // Asegurar que skill_ids sea un array de números. Si no existen, mapear desde skill_projects usando los nombres.
                                    let skillIds: number[] = [];
                                    if (
                                      Array.isArray(project.skill_ids) &&
                                      project.skill_ids.length > 0
                                    ) {
                                      skillIds = project.skill_ids;
                                    } else if (
                                      Array.isArray(project.skill_projects) &&
                                      project.skill_projects.length > 0
                                    ) {
                                      skillIds = project.skill_projects
                                        .map((sp) => {
                                          const skill = skills.find(
                                            (s) => s.skill_name === sp.skill_name
                                          );
                                          return skill ? skill.id : null;
                                        })
                                        .filter((id) => id !== null) as number[];
                                    }
                                    setForm({
                                      name: project.name,
                                      description: project.description,
                                      url_demo: project.url_demo || "",
                                      url_github: project.url_github || "",
                                      url_image: project.url_image || "",
                                      skill_ids: skillIds,
                                    });
                                    setOpen(true);
                                  }}
                                >
                                  <PencilSimple size={18} color="#b3b3ff" weight="bold" />
                                </button>
                                <button
                                  className="hover:bg-[#23234a] p-2 rounded-md"
                                  title="Eliminar"
                                  onClick={() => {
                                    setDeleteIndex(idx);
                                    setDeleteDialogOpen(true);
                                  }}
                                >
                                  <Trash size={18} color="#b3b3ff" weight="bold" />
                                </button>
                              </div>
                            </div>
                            {/* Imagen debajo del título y antes de la descripción */}
                            <div
                              style={{
                                margin: "16px 0",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                            >
                              <img
                                src={project.url_image || "/src/assets/image.png"}
                                alt={project.name}
                                className="object-cover rounded-xl border border-sidebar-border bg-black/60"
                                style={{
                                  maxHeight: 350,
                                  minHeight: 120,
                                  background: "#181c2f",
                                  width: "98%",
                                  height: "auto",
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-white mt-2 mb-4">{project.description}</div>
                        <div className="flex flex-wrap gap-2 mb-4">
                          {Array.isArray(project.skill_projects) &&
                          project.skill_projects.length > 0 ? (
                            project.skill_projects.map((sp, i) => (
                              <span
                                key={i}
                                className="bg-[#6c72ff] text-white text-xs px-3 py-1 rounded-full"
                              >
                                {sp.skill_name}
                              </span>
                            ))
                          ) : skillIds.length > 0 ? (
                            skillIds.map((id, i) => {
                              const skill = skills.find((s) => s.id === id);
                              return (
                                <span
                                  key={i}
                                  className="bg-[#6c72ff] text-white text-xs px-3 py-1 rounded-full"
                                >
                                  {skill ? skill.skill_name : id}
                                </span>
                              );
                            })
                          ) : (
                            <span className="text-xs text-gray-400">Sin habilidades</span>
                          )}
                        </div>

                        <div className="flex gap-3 mb-2">
                          {project.url_github && (
                            <a href={project.url_github} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="flex items-center gap-2">
                                <span className="i-mdi-github" />
                                GitHub
                              </Button>
                            </a>
                          )}
                          {project.url_demo && (
                            <a href={project.url_demo} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" className="flex items-center gap-2">
                                <span className="i-mdi-link-variant" />
                                Ver Demo
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </main>
        <AlertDialogContent className="max-w-5xl w-full rounded-2xl border-sidebar-border bg-sidebar px-10 py-8 text-sidebar-foreground max-h-[85vh] overflow-y-auto sm:max-h-none sm:overflow-visible">
          <AlertDialogHeader className="mb-2 text-left">
            <AlertDialogTitle className="text-lg font-semibold text-slate-900 dark:text-sidebar-foreground">
              {editIndex !== null ? "Editar Proyecto" : "Nuevo Proyecto"}
            </AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogCancel className="absolute right-6 top-5 inline-flex h-7 w-7 items-center justify-center rounded-md border border-sidebar-border bg-transparent text-slate-300 hover:bg-[#6366f1] hover:text-white">
            <X className="size-4" />
            <span className="sr-only">Cerrar</span>
          </AlertDialogCancel>

          <form
            className="text-left"
            onSubmit={async (e) => {
              e.preventDefault();
              // Validaciones
              const newErrors = {
                name: form.name.trim() ? "" : "El nombre del proyecto es obligatorio.",
                description: form.description.trim() ? "" : "La descripción es obligatoria.",
                skill_ids: form.skill_ids.length > 0 ? "" : "Selecciona al menos una habilidad.",
                url_github: form.url_github.trim() ? "" : "La URL de GitHub es obligatoria.",
              };
              setErrors(newErrors);
              if (Object.values(newErrors).some(Boolean)) return;
              setIsSaving(true);
              const payload = {
                portfolio_id: portfolioId!,
                name: form.name,
                description: form.description,
                url_demo: form.url_demo || null,
                url_github: form.url_github || "",
                project_image: null,
                skill_ids: form.skill_ids,
              };

              try {
                if (editIndex !== null) {
                  const projectToEdit = projects[editIndex];
                  await updateProject(projectToEdit.id, payload, fileImage);
                  await syncProjects();
                } else {
                  await createProject(payload, fileImage);
                  await syncProjects();
                }
                setForm({
                  name: "",
                  description: "",
                  url_demo: "",
                  url_github: "",
                  url_image: "",
                  skill_ids: [],
                });
                setImagePreview("/src/assets/image.png");
                await syncProjects();
                setEditIndex(null);
                setOpen(false);
              } catch {
                showErrorToast(
                  editIndex !== null
                    ? "Error al actualizar proyecto"
                    : "Error al registrar proyecto"
                );
              } finally {
                setIsSaving(false);
              }
            }}
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
                  {/*<SkillComboBox
                    skills={skills}
                    selected={form.skill_ids}
                    onChange={(ids) => {
                      setForm((f) => ({ ...f, skill_ids: ids }));
                      if (errors.skill_ids) setErrors((prev) => ({ ...prev, skill_ids: "" }));
                    }}
                    label="Habilidades"
                    placeholder="Busca y selecciona habilidades..."
                  />*/}
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
                className={`relative inline-flex h-5 w-9 items-center rounded-full border text-[0.625rem] transition-colors ${
                  isPublic ? "border-[#6c72ff] bg-[#6c72ff]" : "border-sidebar-border bg-input/40"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform ${
                    isPublic ? "translate-x-4" : "translate-x-1"
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
                    {editIndex !== null ? "" : ""}
                  </>
                ) : editIndex !== null ? (
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
        </AlertDialogContent>
      </AlertDialog>

      {/* Modal de eliminar proyecto*/}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="border-sidebar-border dark:border-[#2a2d46] bg-white dark:bg-[#151a3f] text-slate-900 dark:text-slate-100">
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar proyecto?</AlertDialogTitle>
            <p className="text-slate-600 dark:text-slate-300 text-sm mt-1">
              Esta acción eliminará el proyecto seleccionado y no se podrá deshacer.
            </p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-sidebar-border dark:border-[#2a2d46] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-[#1c1f38] hover:text-slate-900 dark:hover:text-slate-200">
              Cancelar
            </AlertDialogCancel>
            <Button
              className="bg-[#e53e3e] text-white hover:bg-[#c53030]"
              onClick={async () => {
                if (deleteIndex !== null) {
                  const projectToDelete = projects[deleteIndex];
                  try {
                    await deleteProject(projectToDelete.id);
                    await syncProjects();
                  } catch {
                    showErrorToast("Error al eliminar proyecto");
                  }
                  setDeleteIndex(null);
                }
                setDeleteDialogOpen(false);
              }}
            >
              Eliminar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
