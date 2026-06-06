import { Button } from "@/components/ui/button";

type Props = {
  status: string;
  category: string;
  usage: string;
  useOrder: string;
  limit: string;
  search: string;

  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onUsageChange: (value: string) => void;
  onUseOrderChange: (value: string) => void;
  onLimitChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
};

export default function TechnicalSkillReportFilters({
  status,
  category,
  usage,
  useOrder,
  limit,
  search,
  onStatusChange,
  onCategoryChange,
  onUsageChange,
  onUseOrderChange,
  onLimitChange,
  onSearchChange,
  onSearch,
}: Props) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center">
        <input
          type="text"
          value={search}
          placeholder="Buscar habilidad..."
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        />

        <Button onClick={onSearch} className="bg-[#2a2f55] hover:bg-[#3a3f70]">
          Buscar
        </Button>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="">Todos los estados</option>
          <option value="active">Activas</option>
          <option value="inactive">Inactivas</option>
        </select>

        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="">Todas las categorías</option>
          <option value="Frontend">Frontend</option>
          <option value="Backend">Backend</option>
          <option value="DevOps">DevOps</option>
          <option value="Otros">Otros</option>
        </select>

        <select
          value={usage}
          onChange={(e) => onUsageChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="">Todos los usos</option>
          <option value="used">Con uso</option>
          <option value="unused">Sin uso</option>
        </select>

        <select
          value={useOrder}
          onChange={(e) => onUseOrderChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="desc">Más usadas</option>
          <option value="asc">Menos usadas</option>
        </select>

        <select
          value={limit}
          onChange={(e) => onLimitChange(e.target.value)}
          className="bg-[#14172b] border border-[#2a2f55] rounded-xl px-4 py-3 text-white"
        >
          <option value="10">Top 10</option>
          <option value="20">Top 20</option>
          <option value="50">Top 50</option>
          <option value="100">Top 100</option>
          <option value="all">Todas</option>
        </select>
      </div>
    </div>
  );
}
