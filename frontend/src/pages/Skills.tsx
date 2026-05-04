import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AddTechnicalSkill } from "@/components/ui/addTechnicalSkill";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { PencilSimpleIcon, TrashIcon } from "@phosphor-icons/react";

interface UserSkill {
  id: number;
  technical_skill_id: number;
  portfolio_id: number;
  level: string;
  technical_skill?: {
    id: number;
    name: string;
    category: string;
    icon_url: string;
  };
}

const API_URL = import.meta.env.VITE_API_URL;
const PORTFOLIO_ID = 1;

const LEVELS = ["Principiante", "Intermedio", "Avanzado"];

export default function Skills() {
  const [activeTab, setActiveTab] = useState<"technical" | "soft">("technical");

  // technical skills
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUserSkills = async () => {
    try {
      setIsLoading(true);

      const res = await fetch(
        `${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      const skills = result.data || [];

      setUserSkills(skills);
    } catch (err) {
      console.error("Error cargando skills del usuario:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserSkills();
  }, []);

  const handleAddNewSkill = async (technical_skill_id: number, level: string) => {
    try {
      const res = await fetch(
        `${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ technical_skill_id, level }),
        }
      );

      if (res.ok) {
        await fetchUserSkills();
      } else {
        const errorData = await res.json();
        console.error("Error de la API:", errorData.message);
      }
    } catch (err) {
      console.error("Error de conexión:", err);
    }
  };

  const handleDeleteSkill = async (technical_skill_id: number) => {
    try {
      const res = await fetch(
        `${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ technical_skill_id }),
        }
      );

      if (res.ok) {
        await fetchUserSkills();
      } else {
        const errorData = await res.json();
        console.error("Error al eliminar:", errorData.message);
      }
    } catch (err) {
      console.error("Error eliminando skill:", err);
    }
  };

  const handleOpenEdit = (skill: UserSkill) => {
    setSelectedSkill(skill);
    setSelectedLevel(skill.level);
    setIsEditOpen(true);
  };

  const handleSelectLevel = (level: string) => {
    setSelectedLevel(level);
  };

  const handleSaveLevel = async () => {
    if (!selectedSkill || !selectedLevel) return;

    setIsSaving(true);

    try {
      const res = await fetch(
        `${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            technical_skill_id: selectedSkill.technical_skill_id,
            level: selectedLevel,
          }),
        }
      );

      if (res.ok) {
        setIsEditOpen(false);
        setSelectedSkill(null);
        setSelectedLevel(null);
        await fetchUserSkills();
      } else {
        const errorData = await res.json();
        console.error("Error al actualizar:", errorData.message);
      }
    } catch (err) {
      console.error("Error actualizando skill:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredSkills = userSkills.filter(
    (skill) =>
      activeCategory === "Todas" ||
      skill.technical_skill?.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#14162f] flex flex-col text-slate-100 font-heading">
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Habilidades
          </h1>
        </div>

        {/* TABS */}
        <div className="flex justify-center mb-12">
          <div className="bg-[#1c1f38] border border-[#232555] rounded-full p-1 flex gap-2 shadow-lg">
            <button
              onClick={() => setActiveTab("technical")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === "technical"
                  ? "bg-[#6c72ff] text-white shadow-[0_0_15px_rgba(108,114,255,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Técnicas
            </button>

            <button
              onClick={() => setActiveTab("soft")}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === "soft"
                  ? "bg-[#6c72ff] text-white shadow-[0_0_15px_rgba(108,114,255,0.3)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Blandas
            </button>
          </div>
        </div>

        {/* TECHNICAL SKILLS */}
        {activeTab === "technical" && (
          <>
            {/* TOP BAR */}
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-bold text-white tracking-tight">
                Habilidades Técnicas
              </h2>

              <div className="w-56">
                <AddTechnicalSkill onAdd={handleAddNewSkill} />
              </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-3 mb-10 justify-center">
              {["Todas", "Frontend", "Backend", "DevOps", "Otros"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium border transition-all ${
                    activeCategory === cat
                      ? "bg-[#6c72ff] text-white border-[#6c72ff] shadow-[0_0_15px_rgba(108,114,255,0.3)]"
                      : "bg-[#1c1f38] text-slate-400 border-[#232555] hover:border-[#303464]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* CONTENT */}
            {isLoading ? (
              <div className="text-center py-20 text-slate-500">
                Cargando habilidades...
              </div>
            ) : filteredSkills.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredSkills.map((skill) => (
                  <Card
                    key={skill.id}
                    className="relative bg-[#13152e] border border-[#232555] rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#6c72ff]/50"
                  >
                    <div className="absolute top-3 right-3 z-20 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenEdit(skill);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-full 
                                   text-indigo-300 hover:text-indigo-400 hover:bg-indigo-500/10 
                                   transition"
                      >
                        <PencilSimpleIcon size={14} weight="bold" />
                      </button>

                      <AlertDialog>
                        <AlertDialogTrigger
                          render={
                            <button
                              className="w-8 h-8 flex items-center justify-center rounded-full 
                                        text-indigo-300 hover:text-indigo-400 hover:bg-indigo-500/10 
                                        transition"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <TrashIcon size={14} weight="bold" />
                            </button>
                          }
                        />

                        <AlertDialogContent className="bg-[#13152e] border border-[#232555]">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-white">
                              ¿Eliminar habilidad?
                            </AlertDialogTitle>

                            <AlertDialogDescription className="text-slate-400">
                              Esta acción no se puede deshacer. Se eliminará
                              permanentemente la habilidad{" "}
                              <b>{skill.technical_skill?.name}</b>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel className="bg-[#1c1f38] text-white border-none hover:bg-[#232555]">
                              Cancelar
                            </AlertDialogCancel>

                            <AlertDialogAction
                              onClick={() =>
                                handleDeleteSkill(skill.technical_skill_id)
                              }
                              className="bg-red-600 text-white hover:bg-red-700 border-none"
                            >
                              Eliminar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>

                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="w-16 h-16 rounded-2xl mb-4 flex items-center justify-center bg-[#1c1f38] border border-[#232555] shadow-inner">
                        <img
                          src={skill.technical_skill?.icon_url || "/default-skill.png"}
                          alt={skill.technical_skill?.name || "Skill"}
                          className="w-10 h-10 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = "/default-skill.png";
                          }}
                        />
                      </div>

                      <h3 className="text-white font-bold text-xl mb-1">
                        {skill.technical_skill?.name || "Sin nombre"}
                      </h3>

                      <p className="text-slate-500 text-xs uppercase tracking-widest">
                        {skill.technical_skill?.category || "Sin categoría"}
                      </p>

                      <div className="mt-6 pt-4 border-t border-[#232555] w-full text-[#6c72ff] text-xs font-bold uppercase tracking-widest">
                        Nivel {skill.level}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#232555] rounded-3xl">
                <p className="text-slate-500 text-lg italic">
                  No hay nada que mostrar
                </p>
                <p className="text-slate-600 text-sm mt-2">
                  Empieza agregando una habilidad técnica a tu portafolio.
                </p>
              </div>
            )}
          </>
        )}




        {/* SOFT SKILLS */}
        {activeTab === "soft" && (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#232555] rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-3">
              Habilidades Blandas
            </h2>

            <p className="text-slate-500 text-lg italic">
              Aquí se mostrarán tus habilidades blandas.
            </p>

            <p className="text-slate-600 text-sm mt-2">
              Próximamente podrás agregarlas desde el CRUD.
            </p>
          </div>
        )}
      </main>

            {/* MODAL EDIT TECHNICAL SKILL */}
            {isEditOpen && selectedSkill && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                <div className="w-full max-w-md bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">
                      Editar nivel de {selectedSkill.technical_skill?.name}
                    </h2>

                    <button
                      onClick={() => {
                        setIsEditOpen(false);
                        setSelectedSkill(null);
                        setSelectedLevel(null);
                      }}
                      className="w-8 h-8 flex items-center justify-center rounded-full 
                                text-slate-400 hover:text-white hover:bg-white/10 transition"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-slate-400 text-sm mb-6">
                    Selecciona tu nivel de dominio:
                  </p>

                  <div className="flex flex-col gap-3">
                    {LEVELS.map((level) => (
                      <button
                        key={level}
                        onClick={() => handleSelectLevel(level)}
                        className={`w-full py-4 rounded-xl font-bold transition-all border ${
                          selectedLevel === level
                            ? "bg-[#6c72ff] text-white border-[#6c72ff]"
                            : "bg-[#1c1f38] hover:bg-[#232555] text-white border-[#232555]"
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>

                  <Button
                    disabled={!selectedLevel || isSaving}
                    onClick={handleSaveLevel}
                    className="mt-6 w-full h-12 rounded-xl"
                  >
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>
              </div>
            )}
    </div>
  );
}