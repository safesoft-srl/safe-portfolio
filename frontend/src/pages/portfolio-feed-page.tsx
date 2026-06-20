import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { http } from "@/services/http.service";

import { MagnifyingGlass, FunnelSimple } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import { PortfolioFeedCard } from "@/components/portfolio-feed/portfolio-feed-card";
import Header from "@/components/home/Header";
import Loading from "@/components/Loading";

type FilterState = {
  search: string;
  technology: string;
  role: string;
};

type Skill = {
  name:string,
  url_ligth:string,
  url_dark:string,
}

export type PublicPortfolioData = {
  id:number,
  profile_name: string,
  profile_email:string,
  profession:string,
  bio:string,
  profile_image:string,
  url_portfolio:string,
  portfolio_name:string,
  portfolio_descripcion:string,
  phone:string,
  city:string,
  github_username: string,
  linkedin_url:string,
  skills: Skill[],
}

export default function PortfolioFeedPage() {
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    technology: "all",
    role: "all",
  });
  const { data, isLoading, error } = useQuery<PublicPortfolioData[]>({
    queryKey: ["portfolios"],
    queryFn: async (): Promise<PublicPortfolioData[]> => {
      const response = await http.get<{data : PublicPortfolioData[]}>("/api/portfolios");
      return response.data.data;
    }
  });

  if(isLoading) {
      return <Loading/>;
  }

  console.log('data', data);

  if(error) {
    console.error('ocurrio un error al cargar los portafolios:', error);
  }


  return (
    <div className="min-h-screen bg-[#0f1123] text-white font-sans flex flex-col">
      <Header />

      <div className="flex-1 p-8 animate-in fade-in duration-500">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="bg-[#13152e] border border-[#232555] rounded-3xl p-6 shadow-xl flex flex-col md:flex-row gap-4 items-center">
            <div className="relative grow w-full">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <MagnifyingGlass size={20} className="text-slate-500" />
              </div>
              <input
                type="text"
                placeholder="Buscar por nombre, rol, ciudad o tecnología..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full h-12 bg-[#1c1f38] text-white rounded-xl pl-12 pr-4 border border-[#232555] focus:ring-2 focus:ring-[#6c72ff] outline-none placeholder:text-slate-500 transition-all"
              />
            </div>

            <div className="flex w-full md:w-auto gap-4">
              <div className="relative w-1/2 md:w-48">
                <select
                  value={filters.role}
                  onChange={(e) => setFilters({ ...filters, role: e.target.value })}
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

              <div className="relative w-1/2 md:w-48">
                <select
                  value={filters.technology}
                  onChange={(e) => setFilters({ ...filters, technology: e.target.value })}
                  className="w-full h-12 bg-[#1c1f38] text-slate-300 rounded-xl px-4 border border-[#232555] focus:ring-2 focus:ring-[#6c72ff] outline-none appearance-none cursor-pointer"
                >
                  <option value="all">Cualquier Tecnología</option>
                  <option value="react">React</option>
                  <option value="java">Java</option>
                  <option value="python">Python</option>
                  <option value="docker">Docker</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <FunnelSimple size={16} className="text-slate-500" />
                </div>
              </div>
            </div>

            <Button className="w-full md:w-auto h-12 bg-[#6c72ff] hover:bg-[#5b61e2] text-white px-8 rounded-xl font-bold shadow-lg shadow-indigo-500/20">
              Buscar
            </Button>
          </div>

          <p className="text-slate-400 text-sm">
            {data?.length} portafolios encontrados
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.map((portfolio) => (
              <PortfolioFeedCard key={portfolio.id} data={portfolio} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
