import React from "react";

export type PdfConfig = {
  catalog: { summary: boolean; table: boolean; usageChart: boolean; statusChart: boolean };
  requests: { table: boolean; chart: boolean };
  filters: {
    status: string;
    useOrder: string;
    limit: string;
    createdPeriod: string;
    dateFrom: string;
    dateTo: string;
    requestStatus: string;
    requestOrder: string;
    requestLimit: string;
    requestCreatedPeriod: string;
    requestDateFrom: string;
    requestDateTo: string;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  config: PdfConfig;
  setConfig: React.Dispatch<React.SetStateAction<PdfConfig>>;
  onGenerate: (finalConfig: PdfConfig) => void;
};

export default function PdfConfigModal({ open, onClose, config, setConfig, onGenerate }: Props) {
  if (!open) return null;

  const toggleCatalog = (key: keyof PdfConfig["catalog"]) => {
    setConfig((prev) => ({ ...prev, catalog: { ...prev.catalog, [key]: !prev.catalog[key] } }));
  };

  const toggleRequest = (key: keyof PdfConfig["requests"]) => {
    setConfig((prev) => ({ ...prev, requests: { ...prev.requests, [key]: !prev.requests[key] } }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#14172b] p-6 rounded-xl w-130 border border-[#2a2f55]">
        <h2 className="text-white text-lg font-bold mb-4">Configurar PDF</h2>

        {/* CATÁLOGO */}
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2">Catálogo</h3>
          <label className="flex gap-2 text-sm text-white mb-1">
            <input
              type="checkbox"
              checked={config.catalog.summary}
              onChange={() => toggleCatalog("summary")}
            />{" "}
            Resumen
          </label>
          <label className="flex gap-2 text-sm text-white mb-1">
            <input
              type="checkbox"
              checked={config.catalog.table}
              onChange={() => toggleCatalog("table")}
            />{" "}
            Tabla de habilidades
          </label>
          <label className="flex gap-2 text-sm text-white mb-1">
            <input
              type="checkbox"
              checked={config.catalog.usageChart}
              onChange={() => toggleCatalog("usageChart")}
            />{" "}
            Gráfico de uso
          </label>
          <label className="flex gap-2 text-sm text-white mb-1">
            <input
              type="checkbox"
              checked={config.catalog.statusChart}
              onChange={() => toggleCatalog("statusChart")}
            />{" "}
            Gráfico de estado
          </label>
        </div>

        {/* SOLICITUDES */}
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2">Solicitudes</h3>
          <label className="flex gap-2 text-sm text-white mb-1">
            <input
              type="checkbox"
              checked={config.requests.table}
              onChange={() => toggleRequest("table")}
            />{" "}
            Tabla de solicitudes
          </label>
          <label className="flex gap-2 text-sm text-white mb-1">
            <input
              type="checkbox"
              checked={config.requests.chart}
              onChange={() => toggleRequest("chart")}
            />{" "}
            Gráfico de solicitudes
          </label>
        </div>

        {/* BOTONES */}
        <div className="flex justify-end gap-2">
          <button className="text-white" onClick={onClose}>
            Cancelar
          </button>
          <button
            className="bg-[#6c72ff] px-4 py-2 rounded text-white"
            onClick={() => onGenerate(config)}
          >
            Generar PDF
          </button>
        </div>
      </div>
    </div>
  );
}
