import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@phosphor-icons/react";
import { SkillForm } from "@/components/SkillForm";
import { SkillCard } from "./SkillCard";

// Tipado actualizado respetando el objeto "urls" que envía tu backend
export interface TechnicalSkill {
  id: number;
  name: string;
  category: string;
  urls: { light: string; dark: string } | null;
  is_active: boolean; // Agregamos la columna que creamos en la DB
}

export interface SkillSubmitData {
  name: string;
  category: string;
  logo_light?: File;
  logo_dark?: File;
}

const CATEGORIES = ["Todas", "Frontend", "Backend", "DevOps", "Otros", "Deshabilitadas"];

export function TSModCatalogo() {
  const [skills, setSkills] = useState<TechnicalSkill[]>([]);
  const [activeTab, setActiveTab] = useState("Todas");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Guardamos la habilidad completa cuando queremos editar
  const [skillToEdit, setSkillToEdit] = useState<TechnicalSkill | null>(null);

  const token = localStorage.getItem("token");

  const loadSkills = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/technical-skills`);
      const data = await res.json();
      
      setSkills(Array.isArray(data) ? data : data.data || []);
    } catch (error: unknown) {
      console.error("Error cargando el catálogo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSkills();
  }, []);

  const handleSaveSkill = async (formData: SkillSubmitData) => {
    setIsSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("category", formData.category);
      if (formData.logo_light) data.append("logo_light", formData.logo_light);
      if (formData.logo_dark) data.append("logo_dark", formData.logo_dark);

      let url = `${import.meta.env.VITE_API_URL}/api/technical-skills`;
      const method = "POST";

    
      if (skillToEdit) {
        url = `${import.meta.env.VITE_API_URL}/api/technical-skills/${skillToEdit.id}`;
        data.append("_method", "PUT");
      }

      const res = await fetch(url, {
        method: method,
        headers: { Authorization: `Bearer ${token}` },
        body: data,
      });

      if (!res.ok) throw new Error("Error al guardar la habilidad");

      closeModal();
      await loadSkills();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      alert("Hubo un error al guardar la habilidad en el catálogo global.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Esta función reemplaza al handleDeleteSkill usando la ruta PATCH
  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    const action = currentStatus ? "deshabilitar" : "habilitar";
    const confirm = window.confirm(`¿Estás seguro de que deseas ${action} esta habilidad del catálogo?`);
    if (!confirm) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/moderator/technical-skills/${id}/toggle-status`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        await loadSkills();
      } else {
        throw new Error(`No se pudo ${action} la habilidad`);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(error.message);
      }
      alert(`Error al intentar modificar el estado de la habilidad.`);
    }
  };

  const openModalForCreate = () => {
    setSkillToEdit(null);
    setIsModalOpen(true);
  };

  const openModalForEdit = (skill: unknown) => {
    setSkillToEdit(skill as TechnicalSkill);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSkillToEdit(null);
  };

  const filteredSkills = skills.filter((skill) => {
    const matchesSearch = skill.name.toLowerCase().includes(search.toLowerCase());
    
    
    if (activeTab === "Deshabilitadas") {
      return matchesSearch && !skill.is_active; 
    }
    
    const matchesTab = activeTab === "Todas" || skill.category === activeTab;
    return matchesSearch && matchesTab && skill.is_active; 
  });

  if (isLoading) {
    return (
      <div className="w-full py-20 flex justify-center text-slate-400">
        Cargando catálogo de habilidades...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeTab === cat
                  ? "bg-[#6c72ff] text-white shadow-md shadow-indigo-500/20"
                  : "bg-[#13152e] border border-[#232555] text-slate-400 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex w-full lg:w-auto gap-3">
          <input
            type="text"
            placeholder="Buscar en catálogo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full lg:w-64 h-10 bg-[#13152e] text-white border border-[#232555] rounded-xl px-4 focus:ring-2 focus:ring-[#6c72ff] outline-none placeholder:text-slate-500 font-sans"
          />
          <Button 
            onClick={openModalForCreate} 
            className="bg-[#6c72ff] hover:bg-[#5a60d6] text-white font-bold h-10 px-5 rounded-xl shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <PlusIcon weight="bold" className="mr-2" size={16} />
            Nueva
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredSkills.length > 0 ? (
          filteredSkills.map((skill) => (
            <SkillCard
              key={skill.id}
              // Adaptamos el objeto al vuelo para que SkillCard lo lea sin errores
              skill={{
                id: skill.id,
                name: skill.name,
                category: skill.category,
                url_light: skill.urls?.light,
                url_dark: skill.urls?.dark,
                is_active: skill.is_active,
              }}
              role="moderator"
              onEdit={() => openModalForEdit(skill)}
              onToggleStatus={handleToggleStatus}
            />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-slate-500">
            No se encontraron habilidades en el catálogo que coincidan con tu búsqueda.
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 font-heading">
              {skillToEdit ? `Editar Habilidad: ${skillToEdit.name}` : "Registrar Nueva Habilidad"}
            </h2>
            
            <SkillForm 
              isLoading={isSubmitting}
              onCancel={closeModal}
              onSubmit={handleSaveSkill}
              // Mapeamos el objeto urls hacia lo que el formulario espera
              initialData={skillToEdit ? {
                id: skillToEdit.id,
                name: skillToEdit.name,
                category: skillToEdit.category,
                url_light: skillToEdit.urls?.light,
                url_dark: skillToEdit.urls?.dark,
              } : null}
            />
          </div>
        </div>
      )}
    </div>
  );
}