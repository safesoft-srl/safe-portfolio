import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface Skill {
  id: number;
  name: string;
  category: string;
  icon_path?: string | null;
}

const CATEGORIES = ["Todas", "Frontend", "Backend", "DevOps", "Otros"];
const LEVELS = ["Principiante", "Intermedio", "Avanzado"];

export function AddTechnicalSkill({
  onAdd,
}: {
  onAdd: (skillId: number, level: string) => Promise<void>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [catalogo, setCatalogo] = useState<Skill[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Todas");
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchCatalog = async () => {
      if (!isOpen) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/technical-skills`
        );

        const result = await response.json();

        let skillsArray: Skill[] = [];

        if (Array.isArray(result)) {
          skillsArray = result;
        } else if (result && Array.isArray(result.data)) {
          skillsArray = result.data;
        } else if (typeof result === "object" && result !== null) {
          skillsArray = Object.values(result).filter(
            (item) => typeof item === "object"
          ) as Skill[];
        }

        setCatalogo(skillsArray);
      } catch (err) {
        console.error("Error al conectar con la API de habilidades:", err);
        setCatalogo([]);
      }
    };

    fetchCatalog();
  }, [isOpen]);

  const filteredCatalog = (Array.isArray(catalogo) ? catalogo : []).filter(
    (skill) => {
      if (!skill.name) return false;
      const matchesSearch = skill.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesTab = activeTab === "Todas" || skill.category === activeTab;
      return matchesSearch && matchesTab;
    }
  );

  const handleSaveSkill = async () => {
    if (!selectedSkill || !selectedLevel) return;

    setIsSaving(true);

    try {
      await onAdd(selectedSkill.id, selectedLevel);

      setIsOpen(false);
      setSelectedSkill(null);
      setSelectedLevel(null);
      setSearch("");
      setActiveTab("Todas");
    } catch (err) {
      console.error("Error guardando skill:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedSkill(null);
    setSelectedLevel(null);
    setIsSaving(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-[#6c72ff] hover:bg-[#5a60d6] text-white h-12 rounded-xl font-bold transition-all active:scale-95 shadow-lg shadow-indigo-500/20"
      >
        + Agregar Habilidad
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-4xl bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedSkill
                  ? `Nivel de ${selectedSkill.name}`
                  : "Buscar Habilidad"}
              </h2>

              <button
                onClick={handleClose}
                className="text-slate-500 hover:text-white text-2xl transition-colors"
              >
                ✕
              </button>
            </div>

            {!selectedSkill ? (
              <>
                <input
                  type="text"
                  placeholder="Buscar habilidad técnica..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 bg-white text-slate-900 rounded-xl px-4 mb-6 font-sans focus:ring-2 focus:ring-[#6c72ff] outline-none"
                />

                <div className="flex flex-wrap gap-2 mb-8">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveTab(cat)}
                      className={`px-5 py-1.5 rounded-full text-sm font-medium transition-all ${
                        activeTab === cat
                          ? "bg-[#6c72ff] text-white shadow-md shadow-indigo-500/20"
                          : "bg-[#1c1f38] text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pr-2 custom-scrollbar">
                  {filteredCatalog.length > 0 ? (
                    filteredCatalog.map((skill) => (
                      <div
                        key={skill.id}
                        className="group relative bg-[#1c1f38] border border-[#232555] rounded-2xl p-6 flex flex-col items-center hover:border-[#6c72ff]/50 cursor-pointer transition-all hover:bg-[#23274d]"
                        onClick={() => {
                          setSelectedSkill(skill);
                          setSelectedLevel(null);
                        }}
                      >
                        <div className="w-12 h-12 bg-[#13152e] rounded-xl flex items-center justify-center mb-3 border border-[#232555] overflow-hidden">
                          {skill.icon_path ? (
                            <img
                              src={`${import.meta.env.VITE_API_URL}/storage/${skill.icon_path}`}
                              alt={skill.name}
                              className="w-8 h-8 object-contain"
                            />
                          ) : (
                            <span className="text-[#6c72ff] font-bold text-xl">
                              {skill.name.charAt(0)}
                            </span>
                          )}
                        </div>

                        <h3 className="text-white font-bold group-hover:text-[#6c72ff] transition-colors">
                          {skill.name}
                        </h3>

                        <p className="text-slate-500 text-xs uppercase tracking-tighter">
                          {skill.category}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-10 text-center text-slate-500 italic">
                      No se encontraron habilidades disponibles.
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-[#1c1f38] rounded-2xl flex items-center justify-center border border-[#232555] overflow-hidden">
                  {selectedSkill.icon_path ? (
                    <img
                      src={`${import.meta.env.VITE_API_URL}/storage/${selectedSkill.icon_path}`}
                      alt={selectedSkill.name}
                      className="w-10 h-10 object-contain"
                    />
                  ) : (
                    <span className="text-[#6c72ff] font-bold text-2xl">
                      {selectedSkill.name.charAt(0)}
                    </span>
                  )}
                </div>

                <p className="text-slate-300 text-center text-lg">
                  ¿Cuál es tu nivel de dominio en{" "}
                  <span className="text-white font-bold">
                    {selectedSkill.name}
                  </span>
                  ?
                </p>

                <div className="flex flex-col w-full max-w-xs gap-3">
                  {LEVELS.map((level) => (
                    <button
                      key={level}
                      onClick={() => setSelectedLevel(level)}
                      className={`w-full py-4 rounded-xl font-bold transition-all border hover:scale-[1.02] ${
                        selectedLevel === level
                          ? "bg-[#6c72ff] text-white border-[#6c72ff]"
                          : "bg-[#1c1f38] hover:bg-[#232555] text-white border-[#232555]"
                      }`}
                    >
                      {level}
                    </button>
                  ))}

                  <Button
                    disabled={!selectedLevel || isSaving}
                    onClick={handleSaveSkill}
                    className="w-full h-12 rounded-xl mt-3"
                  >
                    {isSaving ? "Guardando..." : "Guardar"}
                  </Button>
                </div>

                <button
                  onClick={() => {
                    setSelectedSkill(null);
                    setSelectedLevel(null);
                  }}
                  className="text-slate-500 text-sm hover:text-slate-300 underline underline-offset-4 transition-colors"
                >
                  Volver al catálogo
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}