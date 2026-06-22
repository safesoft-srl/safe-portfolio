import { useState, useEffect, type FormEvent } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/services/http.service";

import { MagnifyingGlass, Globe } from "@phosphor-icons/react";
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

type LaravelApiResponse =
  | PublicPortfolioData[]
  | { data: PublicPortfolioData[] }
  | { data: { data: PublicPortfolioData[] } };

export default function PortfolioFeedPage() {
  const [inputs, setInputs] = useState<FilterState>({ search: "", role: "all" });
  const [appliedFilters, setAppliedFilters] = useState<FilterState>({ search: "", role: "all" });

  const { data, isLoading, error, refetch, } = useQuery<PublicPortfolioData[]>({
    queryKey: ["public_portfolios"],
    queryFn: async (): Promise<PublicPortfolioData[]> => {
      const response = await http.get<LaravelApiResponse>("/api/portfolios");
      const resData = response.data;

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

  useEffect(() => {
    refetch();
  }, []);


  const filteredPortfolios = data?.filter((portfolio) => {
    const searchLower = appliedFilters.search.toLowerCase();

    const matchesSearch =
      searchLower === "" ||
      (portfolio.profile_name || "").toLowerCase().includes(searchLower) ||
      (portfolio.profession || "").toLowerCase().includes(searchLower) ||
      (portfolio.city || "").toLowerCase().includes(searchLower) ||
      (portfolio.skills || []).some(skill => (skill.name || "").toLowerCase().includes(searchLower));

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
    <div
      className="min-h-screen text-white font-sans flex flex-col"
      style={{
        backgroundColor: "#050816",
        backgroundImage: `
      radial-gradient(circle at 30% 35%, rgba(124,58,237,.28), transparent 15%),
      radial-gradient(circle at 52% 42%, rgba(88,28,135,.38), transparent 30%),
      radial-gradient(circle at 82% 48%, rgba(173,19,127,.26), transparent 24%)
    `,
      }}
    >
      <Header />
      <div className="flex-1 p-8 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto space-y-8">

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#232555] pb-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold flex items-center gap-3">
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
                placeholder="Buscar por profesión, ciudad o tecnología (ej. java)..."
                value={inputs.search}
                onChange={(e) => setInputs({ ...inputs, search: e.target.value })}
                className="w-full h-12 bg-[#1c1f38] text-white rounded-xl pl-12 pr-4 border border-[#232555] focus:ring-2 focus:ring-[#6c72ff] outline-none placeholder:text-slate-500 transition-all"
              />
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