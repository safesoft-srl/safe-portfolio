import type { Portfolio } from "@/features/portfolios/types/portfolios.type";
import PortfolioCard from "./PortfolioCard";

export default function PortfolioGrid({
  portfolios,
  view = "grid",
}: {
  portfolios: Portfolio[] | null;
  view?: "grid" | "list";
}) {
  if (!portfolios || portfolios.length === 0) {
    return <div className="text-sm text-slate-400">No hay portafolios para mostrar.</div>;
  }

  const isListView = view === "list";

  return (
    <div
      className={
        isListView
          ? "mt-6 flex flex-col gap-4"
          : "mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
      }
    >
      {portfolios.map((portfolio) => (
        <PortfolioCard key={portfolio.id} portfolio={portfolio} variant={view} />
      ))}
    </div>
  );
}
