import { useState } from "react";
import { Button } from "@/components/ui/button";

import SoftSkillRequestsSection from "@/components/moderator_SoftSkills/SoftSkillRequestsSection";
import SoftSkillCatalogSection from "@/components/moderator_SoftSkills/SoftSkillCatalogSection";
import SoftSkillReportsSection from "@/components/moderator_SoftSkills/SoftSkillReportPage";

import { useAuthStore } from "@/lib/auth-store";
import { hasPermission } from "@/services/user.service";

type Tab = "catalog" | "requests" | "reports";

export default function SoftSkillModerationSection() {
  const [tab, setTab] = useState<Tab>("catalog");
  const { user } = useAuthStore();

  return (
    <div className="p-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Moderación de habilidades blandas</h1>

        <p className="text-slate-400 mt-1">
          Gestiona solicitudes y catálogo de habilidades blandas
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
          variant={tab === "requests" ? "default" : "secondary"}
          onClick={() => setTab("requests")}
        >
          Solicitudes
        </Button>

        {hasPermission(user, "view_reports") && (
          <Button
            variant={tab === "reports" ? "default" : "secondary"}
            onClick={() => setTab("reports")}
          >
            Reportes
          </Button>
        )}
      </div>
      {tab === "catalog" && <SoftSkillCatalogSection />}

      {tab === "requests" && <SoftSkillRequestsSection />}
      {tab === "reports" && <SoftSkillReportsSection />}
    </div>
  );
}
