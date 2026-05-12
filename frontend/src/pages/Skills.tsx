import { useState } from "react";
import { TechnicalSkillsSection } from "@/components/Skills/TechnicalSkillsSection";
import { SoftSkillsSection } from "@/components/Skills/SoftSkillsSection";

export default function Skills() {
  const [activeTab, setActiveTab] = useState<"technical" | "soft">("technical");

  return (
    <div className="min-h-screen bg-[#14162f] flex flex-col text-slate-100 font-heading">
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-12">
          <h1 className="text-3xl font-bold text-white tracking-tight">Habilidades</h1>

          {/* TABS */}
          <div className="bg-[#1c1f38] border border-[#232555] rounded-full p-1 flex gap-2 shadow-lg w-fit">
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

        {activeTab === "technical" ? <TechnicalSkillsSection /> : <SoftSkillsSection />}
      </main>
    </div>
  );
}
