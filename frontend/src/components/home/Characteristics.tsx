import {
  FolderOpenIcon,
  BrainIcon,
  BriefcaseIcon,
  BookOpenIcon,
  LockIcon,
  GlobeIcon,
} from "@phosphor-icons/react";
import { type CSSProperties } from "react";
export default function Characteristics() {
  const services = [
    {
      icon: FolderOpenIcon,
      title: "Gestión de Proyectos",
      description: "Organiza y presenta tus proyectos profesionales con evidencias digitales.",
    },
    {
      icon: BrainIcon,
      title: "Habilidades",
      description: "Registra tus habilidades técnicas y blandas con niveles de dominio.",
    },
    {
      icon: BriefcaseIcon,
      title: "Experiencias",
      description: "Muestra tus expericiencias adquiridas en diferentes areas de trabajo.",
    },
    {
      icon: BookOpenIcon,
      title: "Formacion",
      description: "Registra tu formacion academica adquirida a lo largo de tu formacion.",
    },
    {
      icon: LockIcon,
      title: "Privacidad",
      description: "Control total sobre qué información deseas publicar",
    },
    {
      icon: GlobeIcon,
      title: "Portafolio publico",
      description: "Comparte tu portafolio profesional con un enlace único.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-20 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.10)_0%,rgba(5,8,22,0.24)_50%,rgba(5,8,22,0.12)_100%)]"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-12">
        <div
          className="mx-auto max-w-3xl space-y-4 text-center stagger-item"
          style={{ "--delay": "80ms" } as CSSProperties}
        >
          <span className="text-xs font-semibold uppercase text-[#a78bfa]">COMO FUNCIONA</span>
          <h2 className="text-3xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Todo lo que nesecitas para crecer
          </h2>
          <p
            className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 sm:text-base stagger-item"
            style={{ "--delay": "160ms" } as CSSProperties}
          >
            Desde la estrategia hasta la ejecución, ayudamos a las personas a crear portafolios
            profesionales y experiencias de cliente significativas.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = service.icon;
            const delay = 100 + Math.floor(idx / 3) * 240 + (idx % 3) * 80; // ms per item: row + column offsets

            return (
              <article
                key={service.title}
                className="rounded-2xl border border-white/10 bg-[#111526]/85 p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-transform duration-300 hover:-translate-y-1 hover:border-white/15 stagger-item"
                style={{ "--delay": `${delay}ms` } as CSSProperties}
              >
                <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-xl bg-[#23124a] text-white">
                  <Icon size={24} weight="regular" />
                </div>

                <h3 className="text-xl font-semibold tracking-tight text-white">{service.title}</h3>

                <p className="mt-4 text-sm leading-7 text-slate-300">{service.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
