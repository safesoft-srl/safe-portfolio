import { useState, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/services/http.service";

import { MagnifyingGlass, FunnelSimple, Globe } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PortfolioFeedCard } from "@/components/portfolio-feed/portfolio-feed-card";
import Header from "@/components/home/Header";
import Loading from "@/components/Loading";

type FilterState = {
  search: string;
  role: string;
};

type Skill = {
  name: string;
  url_light?: string;
  url_dark?: string;
};

export type PublicPortfolioData = {
  id: number;
  profile_name: string;
  profile_email: string;
  profession: string;
  bio: string;
  profile_image: string;
  url_portfolio: string;
  portfolio_slug: string;
  portfolio_name: string;
  portfolio_descripcion: string;
  phone: string;
  city: string;
  github_username: string;
  linkedin_url: string;
  skills: Skill[];
};

// Definimos estrictamente cómo puede llegar el JSON anidado de Laravel
type LaravelApiResponse = 
  | PublicPortfolioData[] 
  | { data: PublicPortfolioData[] } 
  | { data: { data: PublicPortfolioData[] } };

export default function PortfolioFeedPage() {
  const [inputs, setInputs] = useState<FilterState>({ search: "", role: "all" });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ search: "", role: "all" });

  const { data, isLoading, error } = useQuery<PublicPortfolioData[]>({
    queryKey: ["portfolios"],
    queryFn: async (): Promise<PublicPortfolioData[]> => {
      // Reemplazamos <any> por nuestro tipo estricto LaravelApiResponse
      const response = await http.get<LaravelApiResponse>("/api/portfolios");
      const resData = response.data;
      
      // Type guards seguros (sin usar anys implícitos)
      if (Array.isArray(resData)) {
        return resData;
      }
      
      if (resData && typeof resData === "object" && "data" in resData) {
        if (Array.isArray(resData.data)) {
          return resData.data;
        }
        
        if (resData.data && typeof resData.data === "object" && "data" in resData.data) {
          if (Array.isArray(resData.data.data)) {
            return resData.data.data;
          }
        }
      }
      
      return [];
    },
  });

  // Filtrado 100% en el cliente
  const filteredPortfolios = data?.filter((portfolio) => {
    const searchLower = appliedFilters.search.toLowerCase();

    // 1. Filtro General: Busca en nombre, profesión, ciudad y también en las SKILLS
    const matchesSearch =
      searchLower === "" ||
      (portfolio.profile_name || "").toLowerCase().includes(searchLower) ||
      (portfolio.profession || "").toLowerCase().includes(searchLower) ||
      (portfolio.city || "").toLowerCase().includes(searchLower) ||
      (portfolio.skills || []).some(skill => (skill.name || "").toLowerCase().includes(searchLower));

    // 2. Filtro de Rol específico
    const matchesRole =
      appliedFilters.role === "all" ||
      (portfolio.profession || "").toLowerCase().includes(appliedFilters.role.toLowerCase());

    return matchesSearch && matchesRole;
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAppliedFilters(inputs);
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error) {
    console.error("Ocurrió un error al cargar los portafolios:", error);
  }

  return (
    <div className="min-h-screen bg-[#0f1123] text-white font-sans flex flex-col">
      <Header />

      <div className="flex-1 p-8 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232555] pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
                <Globe size={36} className="text-[#6c72ff]" weight="duotone" />
                Descubre Portafolios
              </h1>
              <p className="text-slate-400 text-sm md:text-base max-w-2xl">
                Explora portafolios de profesionales talentosos. Filtra por tecnologías o roles específicos.
              </p>
            </div>
          </div>

          <form onSubmit={handleSearch} className="bg-[#13152e] border border-[#232555] rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center">
            
            <div className="relative grow w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlass size={20} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, rol, ciudad o tecnología (ej. java)..."
                value={inputs.search}
                onChange={(e) => setInputs({ ...inputs, search: e.target.value })}
                className="w-full h-12 bg-[#1c1f38] text-white rounded-xl pl-12 pr-4 border border-[#232555] focus:ring-2 focus:ring-[#6c72ff] outline-none placeholder:text-slate-500 transition-all"
              />
            </div>

            <div className="flex w-full md:w-auto gap-4">
              <div className="relative w-full md:w-56">
                <select
                  value={inputs.role}
                  onChange={(e) => setInputs({ ...inputs, role: e.target.value })}
                  className="w-full h-12 bg-[#1c1f38] text-slate-300 rounded-xl px-4 border border-[#232555] focus:ring-2 focus:ring-[#6c72ff] outline-none appearance-none cursor-pointer"
                >
                  <option value="all">Todos los Roles</option>
                  <option value="frontend">Frontend Dev</option>
                  <option value="backend">Backend Dev</option>
                  <option value="fullstack">Fullstack Dev</option>
                  <option value="devops">DevOps</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FunnelSimple size={16} className="text-slate-500" />
                </div>
              </div>
            </div>

            <Button type="submit" className="w-full md:w-auto h-12 bg-[#6c72ff] hover:bg-[#5b61e2] text-white px-8 rounded-xl font-bold shadow-lg shadow-indigo-500/20">
              Buscar
            </Button>
          </form>

          <p className="text-slate-400 text-sm">{filteredPortfolios?.length || 0} portafolios encontrados</p>

          {filteredPortfolios && filteredPortfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((portfolio) => (
                <PortfolioFeedCard key={portfolio.id} data={portfolio} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-slate-500 bg-[#13152e]/50 border border-dashed border-[#232555] rounded-3xl">
              <p>No se encontraron portafolios con esos filtros.</p>
              <Button 
                variant="link" 
                onClick={() => {
                  setInputs({ search: "", role: "all" });
                  setAppliedFilters({ search: "", role: "all" });
                }}
                className="text-[#6c72ff]"
              >
                Limpiar filtros
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}