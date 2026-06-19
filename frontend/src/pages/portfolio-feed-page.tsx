//import { useState } from "react";
import { Globe } from "@phosphor-icons/react";

export default function PortfolioFeedPage() {
  return (
    <div className="min-h-screen bg-[#0f1123] text-white p-8 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Encabezado Principal */}
        <div className="flex flex-col gap-2 border-b border-[#232555] pb-6">
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Globe size={32} className="text-[#6c72ff]" />
            Explorar Portafolios
          </h1>
          <p className="text-slate-400 text-sm">
            Descubre y conecta con los perfiles técnicos de la plataforma.
          </p>
        </div>

        {/* Zona del Buscador y Filtros*/}
        <div className="bg-[#13152e] border border-[#232555] rounded-3xl p-6 text-center text-slate-500 italic">
          Espacio para barra de búsqueda y filtros...
        </div>

        {/* Zona del Listado de Tarjetas */}
        <div className="bg-[#13152e] border border-[#232555] rounded-3xl p-12 text-center text-slate-500 italic">
          Aquí se renderizará el catálogo de portafolios.
        </div>

      </div>
    </div>
  );
}