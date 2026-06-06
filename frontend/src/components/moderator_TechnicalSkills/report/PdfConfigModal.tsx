import React from "react";

export type TechnicalPdfConfig = {
  catalog: {
    summary: boolean;
    table: boolean;
    levelChart: boolean;
  };

  filters: {
    status: string;
    category: string;
    usage: string;
    useOrder: string;
    limit: string;
    search: string;
  };
};

type Props = {
  open: boolean;
  onClose: () => void;
  config: TechnicalPdfConfig;
  setConfig: React.Dispatch<React.SetStateAction<TechnicalPdfConfig>>;
  onGenerate: (finalConfig: TechnicalPdfConfig) => Promise<void> | void;
};

export default function TechnicalPdfConfigModal({
  open,
  onClose,
  config,
  setConfig,
  onGenerate,
}: Props) {
  if (!open) return null;

  const toggleCatalog = (key: keyof TechnicalPdfConfig["catalog"]) => {
    setConfig((prev) => ({
      ...prev,
      catalog: {
        ...prev.catalog,
        [key]: !prev.catalog[key],
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-[#14172b] p-6 rounded-xl w-[500px] border border-[#2a2f55]">
        <h2 className="text-white text-lg font-bold mb-4">Configurar PDF - Technical Skills</h2>

        {/* CATÁLOGO */}
        <div className="mb-4">
          <h3 className="text-white font-semibold mb-2">Catálogo</h3>

          <label className="flex gap-2 text-sm text-white mb-2">
            <input
              type="checkbox"
              checked={config.catalog.summary}
              onChange={() => toggleCatalog("summary")}
            />
            Resumen general
          </label>

          <label className="flex gap-2 text-sm text-white mb-2">
            <input
              type="checkbox"
              checked={config.catalog.table}
              onChange={() => toggleCatalog("table")}
            />
            Tabla de skills
          </label>

          <label className="flex gap-2 text-sm text-white mb-2">
            <input
              type="checkbox"
              checked={config.catalog.levelChart}
              onChange={() => toggleCatalog("levelChart")}
            />
            Gráfico de niveles (Top skills)
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
