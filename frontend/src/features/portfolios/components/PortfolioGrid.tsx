import type { ProfileData } from "@/types/public-portfolio";
import PortfolioCard from "./PortfolioCard";

export default function PortfolioGrid({
  profile,
  view = "grid",
}: {
  profile: ProfileData | null;
  view?: "grid" | "list";
}) {
  if (!profile) {
    return <div className="text-sm text-slate-400">No hay portafolios para mostrar.</div>;
  }

  const isListView = view === "list";

  return (
    <div className={isListView ? "mt-6" : "mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"}>
      <PortfolioCard profile={profile} variant={view} />
    </div>
  );
}
