import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AddTechnicalSkill } from "@/components/ui/addTechnicalSkill";

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
  const [activeCategory, setActiveCategory] = useState("Todas");
  const [userSkills, setUserSkills] = useState<UserSkill[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<UserSkill | null>(null);

  const fetchUserSkills = async () => {
    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`);
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
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technical_skill_id, level }),
      });

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
    const confirmDelete = confirm("¿Seguro que deseas eliminar esta habilidad?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ technical_skill_id }),
      });

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
    setIsEditOpen(true);
  };

  const handleUpdateLevel = async (level: string) => {
    if (!selectedSkill) return;

    try {
      const res = await fetch(`${API_URL}/api/portfolios/${PORTFOLIO_ID}/technical-skills`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          technical_skill_id: selectedSkill.technical_skill_id,
          level,
        }),
      });

      if (res.ok) {
        setIsEditOpen(false);
        setSelectedSkill(null);
        await fetchUserSkills();
      } else {
        const errorData = await res.json();
        console.error("Error al actualizar:", errorData.message);
      }
    } catch (err) {
      console.error("Error actualizando skill:", err);
    }
  };

  const filteredSkills = userSkills.filter(
    (skill) => activeCategory === "Todas" || skill.technical_skill?.category === activeCategory
  );

  return (
    <div className="min-h-screen bg-[#14162f] flex flex-col text-slate-100 font-heading">
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-12">
          <h1 className="text-3xl font-bold text-white tracking-tight">Habilidades</h1>
          <div className="w-48">
            <AddTechnicalSkill onAdd={handleAddNewSkill} />
          </div>
        </div>

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

        {isLoading ? (
          <div className="text-center py-20 text-slate-500">Cargando habilidades...</div>
        ) : filteredSkills.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => (
              <Card
                key={skill.id}
                className="relative bg-[#13152e] border border-[#232555] rounded-2xl overflow-hidden shadow-2xl transition-all hover:border-[#6c72ff]/50"
              >
                <button
                  onClick={() => handleDeleteSkill(skill.technical_skill_id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold flex items-center justify-center transition-all"
                >
                  ✕
                </button>

                <CardContent
                  className="p-8 flex flex-col items-center text-center cursor-pointer"
                  onClick={() => handleOpenEdit(skill)}
                >
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

                  <p className="text-slate-600 text-xs mt-2 italic">Click para editar nivel</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-[#232555] rounded-3xl">
            <p className="text-slate-500 text-lg italic">No hay nada que mostrar</p>
            <p className="text-slate-600 text-sm mt-2">
              Empieza agregando una habilidad técnica a tu portafolio.
            </p>
          </div>
        )}
      </main>

      {isEditOpen && selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">
                Editar nivel de {selectedSkill.technical_skill?.name}
              </h2>

              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedSkill(null);
                }}
                className="text-slate-500 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            <p className="text-slate-400 text-sm mb-6">Selecciona tu nivel de dominio:</p>

            <div className="flex flex-col gap-3">
              {LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => handleUpdateLevel(level)}
                  className="w-full py-4 bg-[#1c1f38] hover:bg-[#6c72ff] text-white rounded-xl font-bold transition-all border border-[#232555]"
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
