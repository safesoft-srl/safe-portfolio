import { useState } from "react";
import { TechnicalSkillsSection } from "@/components/Skills/TechnicalSkillsSection";
import { SoftSkillsSection } from "@/components/Skills/SoftSkillsSection";

export default function Skills() {
  const [activeTab, setActiveTab] = useState<"technical" | "soft">("technical");

  return (
    <div className="min-h-screen flex flex-col text-slate-100 font-heading animate-in fade-in zoom-in duration-500">
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 sm:gap-4 mb-8 sm:mb-12">
          <h1 className="text-3xl font-bold text-white tracking-tight">Habilidades</h1>

          <div className="bg-[#1c1f38] border border-[#232555] rounded-full p-1 flex gap-1 sm:gap-2 shadow-lg w-full sm:w-fit">
            <button
              onClick={() => setActiveTab("technical")}
              className={`flex-1 sm:flex-none px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === "technical"
                  ? "bg-[#6c72ff] text-white shadow-[0_0_15px_rgba(108,114,255,0.3)]"
                  : "text-slate-400 sm:hover:text-white active:bg-white/5 active:scale-[0.98]"
              }`}
            >
              Técnicas
            </button>

            <button
              onClick={() => setActiveTab("soft")}
              className={`flex-1 sm:flex-none px-6 py-2.5 sm:py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === "soft"
                  ? "bg-[#6c72ff] text-white shadow-[0_0_15px_rgba(108,114,255,0.3)]"
                  : "text-slate-400 sm:hover:text-white active:bg-white/5 active:scale-[0.98]"
              }`}
            >
              Blandas
            </button>
          </div>
        </div>

        {activeTab === "technical" ? <TechnicalSkillsSection /> : <SoftSkillsSection />}
      </main>
    </div>
  );
}
