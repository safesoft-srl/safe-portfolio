import { ArrowUpRight, ArrowLeft, ArrowRight } from "@phosphor-icons/react";

export default function RecentWork() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="mb-10">
        <span className="font-mono text-xs text-[#bcfd49]">• Projects</span>
        <h2 className="mt-4 text-4xl font-bold tracking-tight text-white md:text-5xl">
          Mis trabajos recientes
        </h2>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-[#262b46] bg-[#111327] p-6 lg:p-10 shadow-2xl">
        {/* Accent line on top */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#bcfd49]/30 to-transparent" />

        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Project Image Placeholder */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#262b46] bg-[#0a0b1e] group">
            <div className="absolute inset-0 bg-white/5 group-hover:bg-transparent transition-colors duration-500" />
            <div className="flex h-full w-full items-center justify-center p-4">
               {/* Mockup styled placeholder */}
               <div className="h-full w-full rounded-lg bg-[#0f1120] border border-white/5 shadow-2xl p-6 flex flex-col gap-4">
                  <div className="flex items-center gap-2">
                     <div className="h-2 w-2 rounded-full bg-red-400" />
                     <div className="h-2 w-2 rounded-full bg-yellow-400" />
                     <div className="h-2 w-2 rounded-full bg-green-400" />
                  </div>
                  <div className="h-4 w-1/3 bg-white/5 rounded" />
                  <div className="h-10 w-2/3 bg-white/10 rounded mt-4" />
                  <div className="grid grid-cols-2 gap-4 mt-4">
                     <div className="h-32 bg-white/5 rounded" />
                     <div className="h-32 bg-white/5 rounded" />
                  </div>
               </div>
            </div>
          </div>

          {/* Project Content */}
          <div className="flex flex-col">
            <h3 className="font-mono text-2xl font-bold leading-tight text-[#727bff] lg:text-3xl">
              Integrar la IA en el <br />
              sistema de comercio <br />
              electrónico
            </h3>
            <p className="mt-6 font-mono text-xs leading-relaxed text-slate-400">
              Desarrollé una plataforma de aprendizaje en línea con gestión de cursos, cuestionarios y seguimiento del progreso.
            </p>

            <div className="mt-10">
              <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff6098]">
                Informacion del proyecto
              </h4>
              <div className="mt-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-slate-200">Cliente</span>
                  <span className="text-slate-400">Conceptual JSC</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-slate-200">Tiempo de finalizacion</span>
                  <span className="text-slate-400">6 months</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-slate-200">Tecnologias</span>
                  <span className="text-slate-400">Node.js, React, MongoDB, Stripe</span>
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-6">
              <div className="flex gap-8">
                <a href="#" className="flex items-center gap-2 font-mono text-[10px] text-slate-300 hover:text-white transition-colors border-b border-slate-700 pb-1">
                   URL del proyecto en vivo <ArrowUpRight size={14} />
                </a>
                <a href="#" className="flex items-center gap-2 font-mono text-[10px] text-slate-300 hover:text-white transition-colors border-b border-slate-700 pb-1">
                   Logros <ArrowUpRight size={14} />
                </a>
              </div>

              {/* Navigation Indicators */}
              <div className="flex gap-3">
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white transition-all">
                  <ArrowLeft size={18} />
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 hover:border-white/30 hover:text-white transition-all">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
