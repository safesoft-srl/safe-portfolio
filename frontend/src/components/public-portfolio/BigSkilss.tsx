import { Browser, Database, Cloud, FastForward, ShoppingCart, Brain } from "@phosphor-icons/react";

export default function BigSkilss() {
  const skills = [
    {
      title: "Desarrollo web y de aplicaciones",
      desc: "Creación de interfaces visualmente atractivas y fáciles de usar mediante HTML, CSS, JavaScript y marcos de trabajo modernos como React y Angular.",
      Icon: Browser,
    },
    {
      title: "Gestión de bases de datos",
      desc: "Diseño y gestión de bases de datos con tecnologías SQL y NoSQL como MySQL, PostgreSQL y MongoDB.",
      Icon: Database,
    },
    {
      title: "Desarrollo de API",
      desc: "Creación e integración de API RESTful para permitir una comunicación fluida entre los sistemas front-end y back-end",
      Icon: Cloud,
    },
    {
      title: "Optimización del rendimiento",
      desc: "Mejorar la velocidad y el rendimiento de las aplicaciones web para ofrecer una mejor experiencia de usuario. Trabajar con Node.js y Express",
      Icon: FastForward,
    },
    {
      title: "Soluciones de comercio electrónico",
      desc: "Desarrollamos soluciones de pago escalables y seguras para plataformas de comercio electrónico, adaptadas a las necesidades de su negocio",
      Icon: ShoppingCart,
    },
    {
      title: "Integrando IA",
      desc: "Potencia tus aplicaciones con IA para lograr mayor eficiencia, automatización y una mejor experiencia de usuario.",
      Icon: Brain,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <div className="text-center">
        <span className="font-mono text-xs text-[#727bff]">• Cooperation</span>
        <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-5xl">
          Diseñando soluciones personalizadas <br />
          para cumplir con sus requisitos
        </h2>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-[#262b46] bg-[#13152e]/50 p-8 transition-all hover:bg-[#13152e] hover:shadow-2xl hover:shadow-[#000000]/40"
          >
            {/* Image Placeholder (White block) */}
            <div className="mb-8 flex aspect-video w-full items-center justify-center rounded-xl border border-[#262b46] bg-[#1a1d3a] p-4 lg:grayscale lg:opacity-60 grayscale-0 opacity-100 group-hover:grayscale-0 group-hover:opacity-100 transition-opacity overflow-hidden">
              {/* This represents the colorful illustration in the screenshot */}
              <div className="relative h-full w-full bg-white/5 rounded-lg flex items-center justify-center">
                <div className="absolute inset-0 bg-linear-to-br from-white/10 to-transparent" />
                <skill.Icon size={48} weight="thin" className="text-white/20" />
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="mt-1 shrink-0">
                <skill.Icon size={18} weight="bold" className="text-white" />
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-white">
                  {skill.title}
                </h3>
                <p className="font-mono text-[11px] leading-relaxed text-slate-400">{skill.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
        <p className="font-mono text-sm text-slate-400">
          ¡Me entusiasma emprender nuevos proyectos y colaborar!
        </p>
        <p className="mt-4 font-mono text-sm text-slate-300">
          Hablemos de tus ideas. <span className="text-white">¡Contáctame!</span>
        </p>
      </div>
    </section>
  );
}
