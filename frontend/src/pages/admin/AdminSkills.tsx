import { useState } from "react";
import { Button } from "@/components/ui/button";

import TechnicalSkillReportPage from "@/components/moderator_TechnicalSkills/TechinicalSkillReportPage";
import { TSModCatalogo } from "@/components/Skills/TSModCatalogo";

type Tab = "catalog" | "reports";

export default function TechnicalSkillModerationSection() {
  const [tab, setTab] = useState<Tab>("catalog");

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Moderación de habilidades técnicas</h1>

        <p className="text-slate-400 mt-1">
          Gestiona solicitudes y catálogo de habilidades técnicas
        </p>
      </div>

      <div className="flex gap-3 mb-8">
        <Button
          variant={tab === "catalog" ? "default" : "secondary"}
          onClick={() => setTab("catalog")}
        >
          Catálogo
        </Button>

        <Button
          variant={tab === "reports" ? "default" : "secondary"}
          onClick={() => setTab("reports")}
        >
          Reportes
        </Button>
      </div>
      {tab === "reports" && <TechnicalSkillReportPage />}
      {tab === "catalog" && <TSModCatalogo />}
    </div>
  );
}
