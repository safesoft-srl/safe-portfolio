import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { 
  PlusIcon, 
  Clock,
  Trash
} from "@phosphor-icons/react";
import { SkillForm } from "@/components/SkillForm";

// --- Tipados Estrictos ---
interface TechnicalSkill {
  id: number;
  name: string;
  category: string;
  urls: { light: string; dark: string } | null;
}

interface Suggestion {
  id: number;
  name: string;
  category: string;
  status: "pending" | "approved" | "rejected";
}

// Nueva interfaz para tipar estrictamente los datos del formulario
export interface SkillSubmitData {
  name: string;
  category: string;
  logo_light?: File;
  logo_dark?: File;
}

const CATEGORIES = ["Todas", "Frontend", "Backend", "DevOps", "Otros"];

export default function TechnicalSkillsModerator() {
  const [skills, setSkills] = useState<TechnicalSkill[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState("Todas");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [suggestionToApprove, setSuggestionToApprove] = useState<Suggestion | null>(null);

  const token = localStorage.getItem("token");

  const loadData = async () => {
    setIsLoading(true);
    try {
      const skillsRes = await fetch(`${import.meta.env.VITE_API_URL}/api/technical-skills`);
      const skillsData = await skillsRes.json();
      
      const mockSuggestions: Suggestion[] = [
        { id: 1, name: "Svelte", category: "Frontend", status: "pending" },
        { id: 2, name: "Kubernetes", category: "DevOps", status: "pending" }
      ];

      setSkills(Array.isArray(skillsData) ? skillsData : skillsData.data || []);
      setSuggestions(mockSuggestions);
    } catch (error: unknown) {
      console.error("Error cargando datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // --- El parámetro 'formData' ahora está estrictamente tipado ---
  const handleSaveSkill = async (formData: SkillSubmitData) => {
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      if (formData.logo_light) data.append("logo_light", formData.logo_light);
      if (formData.logo_dark) data.append("logo_dark", formData.logo_dark);

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/technical-skills`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) throw new Error("Error al guardar la habilidad");

      if (suggestionToApprove) {
        setSuggestions(suggestions.filter(s => s.id !== suggestionToApprove.id));
      }

      setIsModalOpen(false);
      setSuggestionToApprove(null);
      await loadData(); 
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      alert("Hubo un error al guardar la habilidad");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDiscontinue = async (id: number, name: string) => {
    const confirm = window.confirm(`¿Estás seguro de que deseas descontinuar '${name}' del sistema?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/technical-skills/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setSkills(skills.filter(skill => skill.id !== id));
      } else {
        throw new Error("No se pudo descontinuar");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      alert("Error al descontinuar la habilidad");
    }
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "Todas" || skill.category === activeTab;
    return matchesSearch && matchesTab;
  });

  if (isLoading) return <div className="min-h-screen bg-[#0a0b1e] text-white flex items-center justify-center">Cargando panel de moderación...</div>;

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-100 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Moderación de Tecnologías</h1>
            <p className="text-slate-400 mt-1">Gestiona el catálogo global de habilidades técnicas del sistema.</p>
          </div>
          <Button 
            onClick={() => {
              setSuggestionToApprove(null);
              setIsModalOpen(true);
            }} 
            className="bg-[#6c72ff] hover:bg-[#5a60d6] text-white font-bold h-12 px-6 rounded-xl shadow-lg shadow-indigo-500/20"
          >
            <PlusIcon weight="bold" className="mr-2" size={18} />
            Añadir Nueva Habilidad
          </Button>
        </div>

        {suggestions.length > 0 && (
          <section className="bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Clock className="text-[#6c72ff]" size={24} weight="bold" />
              Sugerencias Pendientes de Usuarios
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {suggestions.map((sug) => (
                <div key={sug.id} className="bg-[#1c1f38] border border-[#232555] rounded-xl p-5 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-white">{sug.name}</h3>
                    <p className="text-xs text-slate-400 uppercase tracking-widest">{sug.category}</p>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-300"
                    onClick={() => {
                      setSuggestionToApprove(sug);
                      setIsModalOpen(true);
                    }}
                  >
                    Evaluar
                  </Button>
                </div>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                    activeTab === cat
                      ? "bg-[#6c72ff] text-white shadow-md shadow-indigo-500/20"
                      : "bg-[#13152e] border border-[#232555] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <input
              type="text"
              placeholder="Buscar en catálogo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 h-10 bg-[#13152e] text-white border border-[#232555] rounded-xl px-4 focus:ring-2 focus:ring-[#6c72ff] outline-none placeholder:text-slate-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredSkills.map((skill) => (
              <div
                key={skill.id}
                className="group relative bg-[#13152e] border border-[#232555] rounded-2xl p-6 flex flex-col items-center shadow-xl transition-all hover:border-[#6c72ff]/50 hover:-translate-y-1"
              >
                <button
                  onClick={() => handleDiscontinue(skill.id, skill.name)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#1c1f38] border border-[#232555] text-slate-400 hover:bg-red-500 hover:text-white hover:border-red-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                  title="Descontinuar Habilidad"
                >
                  <Trash size={16} weight="bold" />
                </button>

                <div className="w-16 h-16 bg-[#1c1f38] rounded-xl flex items-center justify-center mb-4 border border-[#232555]">
                  {skill.urls?.dark ? (
                    <img src={skill.urls.dark} alt={skill.name} className="w-10 h-10 object-contain" />
                  ) : (
                    <span className="text-[#6c72ff] font-bold text-2xl">{skill.name.charAt(0)}</span>
                  )}
                </div>
                <h3 className="text-white font-bold text-lg mb-1">{skill.name}</h3>
                <p className="text-slate-500 text-xs uppercase tracking-widest">{skill.category}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6">
              {suggestionToApprove ? `Aprobar Sugerencia: ${suggestionToApprove.name}` : "Registrar Nueva Habilidad"}
            </h2>
            
            <SkillForm 
              isLoading={isSubmitting}
              onCancel={() => {
                setIsModalOpen(false);
                setSuggestionToApprove(null);
              }}
              onSubmit={handleSaveSkill}
            />
          </div>
        </div>
      )}
    </div>
  );
}