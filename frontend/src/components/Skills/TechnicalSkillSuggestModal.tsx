import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Lightbulb, CheckCircle, WarningCircle } from "@phosphor-icons/react";

interface TechnicalSkillSuggestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ["Frontend", "Backend", "DevOps"];

export function TechnicalSkillSuggestModal({ isOpen, onClose }: TechnicalSkillSuggestModalProps) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem("token");

  // Si no está abierto, no renderizamos nada en el DOM
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/technical-skills/suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, category }),
      });

      if (res.ok) {
        setSuccess("¡Gracias! Tu sugerencia ha sido enviada a revisión.");
        
        setTimeout(() => {
          handleClose();
        }, 2000);
      } else {
        const data = await res.json();
        throw new Error(data.message || "Ocurrió un error al enviar la sugerencia.");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Error inesperado de conexión.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setName("");
    setCategory(CATEGORIES[0]);
    setError(null);
    setSuccess(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#13152e] border border-[#232555] rounded-3xl p-8 shadow-2xl flex flex-col">
        
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#6c72ff]/10 flex items-center justify-center border border-[#6c72ff]/30">
              <Lightbulb size={20} weight="fill" className="text-[#6c72ff]" />
            </div>
            <h2 className="text-xl font-bold text-white">Sugerir Habilidad</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isSubmitting || !!success}
            className="text-slate-500 hover:text-white text-2xl transition-colors disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <p className="text-slate-400 text-sm mb-6">
          ¿No encuentras la tecnología que buscas? Sugiérela y nuestros moderadores la revisarán para agregarla al catálogo global.
        </p>

        {success ? (
          <div className="w-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 text-sm p-4 rounded-xl flex items-center gap-3 animate-in zoom-in-95">
            <CheckCircle size={24} weight="fill" className="shrink-0" />
            <p>{success}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Nombre de la habilidad
              </label>
              <input
                type="text"
                maxLength={30}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Svelte, Kubernetes..."
                className="w-full h-12 bg-[#1c1f38] text-white border border-[#232555] rounded-xl px-4 focus:ring-2 focus:ring-[#6c72ff] outline-none font-sans"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">
                Rama / Categoría
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-12 bg-[#1c1f38] text-white border border-[#232555] rounded-xl px-4 focus:ring-2 focus:ring-[#6c72ff] outline-none appearance-none cursor-pointer font-sans"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2 animate-in slide-in-from-top-2">
                <WarningCircle size={18} weight="bold" />
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full h-12 mt-4 rounded-xl font-bold bg-[#6c72ff] hover:bg-[#5a60d6] text-white disabled:opacity-50 transition-all font-heading"
            >
              {isSubmitting ? "Enviando..." : "Enviar Sugerencia"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}