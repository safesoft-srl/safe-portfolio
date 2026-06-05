type TechnicalSkillReport = {
  id: number;
  name: string;
  category: string;
  is_active: boolean;
  uses: number;
  created_at: string;
};

type Props = {
  skills: TechnicalSkillReport[];
  loading: boolean;
};

export default function TechnicalSkillReportTable({ skills, loading }: Props) {
  return (
    <div className="rounded-2xl border border-[#2a2f55] bg-[#14172b] overflow-hidden">
      <div className="px-5 py-4 border-b border-[#2a2f55]">
        <h3 className="font-semibold text-white">Habilidades Técnicas</h3>
      </div>

      {loading ? (
        <div className="p-5 text-slate-400">Cargando reporte...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#2a2f55]">
                <th className="text-left p-4 text-slate-400">Habilidad</th>

                <th className="text-left p-4 text-slate-400">Categoría</th>

                <th className="text-left p-4 text-slate-400">Estado</th>

                <th className="text-left p-4 text-slate-400">Usos en portafolios</th>
              </tr>
            </thead>

            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-b border-[#232555]">
                  <td className="p-4 text-white">{skill.name}</td>

                  <td className="p-4 text-slate-300">{skill.category}</td>

                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        skill.is_active
                          ? "bg-green-500/20 text-green-400"
                          : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {skill.is_active ? "Activa" : "Inactiva"}
                    </span>
                  </td>

                  <td className="p-4 text-white">{skill.uses}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {skills.length === 0 && (
            <div className="p-6 text-center text-slate-400">No se encontraron resultados.</div>
          )}
        </div>
      )}
    </div>
  );
}
