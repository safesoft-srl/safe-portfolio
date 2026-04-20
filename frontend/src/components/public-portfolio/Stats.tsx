import { PersonIcon } from "@phosphor-icons/react";

export default function () {
  return (
    <div className="mx-auto max-w-6xl px-5 md:px-10">
      <div className="relative overflow-hidden rounded-2xl border border-[#262b46] bg-[#13152e] p-8 md:p-12 shadow-xl shadow-[#000000]/20">
        {/* Grid background pattern */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #808080 1px, transparent 1px), linear-gradient(to bottom, #808080 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative z-10 grid grid-cols-2 gap-10 md:grid-cols-4 md:gap-8">
          {/* Stat 1 */}
          <div className="flex flex-col gap-1.5">
            <PersonIcon className="h-6 w-6 text-[#72f587]" weight="bold" />
            <div className="mt-2 text-4xl font-semibold tracking-tight text-white font-mono">
              12 <span className="text-slate-500">+</span>
            </div>
            <div className="text-xs font-mono text-slate-300">Años de Experiencia</div>
          </div>

          {/* Stat 2 */}
          <div className="flex flex-col gap-1.5">
            <PersonIcon className="h-6 w-6 text-[#72f587]" weight="bold" />
            <div className="mt-2 text-4xl font-semibold tracking-tight text-white font-mono">
              250 <span className="text-slate-500">+</span>
            </div>
            <div className="text-xs font-mono text-slate-300">Proyectos Completados</div>
          </div>

          {/* Stat 3 */}
          <div className="flex flex-col gap-1.5">
            <PersonIcon className="h-6 w-6 text-[#72f587]" weight="bold" />
            <div className="mt-2 text-4xl font-semibold tracking-tight text-white font-mono">
              680 <span className="text-slate-500">+</span>
            </div>
            <div className="text-xs font-mono text-slate-300">Clientes Satisfechos</div>
          </div>

          {/* Stat 4 */}
          <div className="flex flex-col gap-1.5">
            <PersonIcon className="h-6 w-6 text-[#72f587]" weight="bold" />
            <div className="mt-2 text-4xl font-semibold tracking-tight text-white font-mono">
              18 <span className="text-slate-500">+</span>
            </div>
            <div className="text-xs font-mono text-slate-300">Ganador de Premios</div>
          </div>
        </div>
      </div>
    </div>
  );
}
