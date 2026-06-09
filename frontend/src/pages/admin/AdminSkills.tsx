import { useState } from "react";
import { TSModCatalogo } from "@/components/Skills/TSModCatalogo";
import TechnicalSkillReportPage from "@/components/moderator_TechnicalSkills/TechinicalSkillReportPage";

type TabType = "catalogo" | "solicitudes" | "reportes";

export default function AdminSkills() {
  const [activeTab, setActiveTab] = useState<TabType>("catalogo");

  return (
    <div className="min-h-screen bg-[#0a0b1e] text-slate-100 p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight font-heading">
            Moderación de habilidades técnicas
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Gestiona solicitudes y catálogo de habilidades técnicas
          </p>
        </div>

        <div className="flex flex-wrap gap-3 border-b border-[#232555] pb-4">
          <button
            onClick={() => setActiveTab("catalogo")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "catalogo"
                ? "bg-[#6c72ff] text-white shadow-md shadow-indigo-500/20"
                : "bg-[#1c1f38] text-slate-400 border border-[#232555] hover:text-slate-200 hover:bg-[#23274d]"
            }`}
          >
            Catálogo
          </button>

          <button
            onClick={() => setActiveTab("reportes")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              activeTab === "reportes"
                ? "bg-[#6c72ff] text-white shadow-md shadow-indigo-500/20"
                : "bg-[#1c1f38] text-slate-400 border border-[#232555] hover:text-slate-200 hover:bg-[#23274d]"
            }`}
          >
            Reportes
          </button>
        </div>

        <div className="pt-4 animate-in fade-in duration-300">
          {activeTab === "catalogo" && <TSModCatalogo />}
          {activeTab === "reportes" && <TechnicalSkillReportPage />}
        </div>
      </div>
    </div>
  );
}
