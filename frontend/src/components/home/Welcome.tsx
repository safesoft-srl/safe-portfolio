import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon, PlayIcon } from "@phosphor-icons/react";
import heroUno from "../../assets/image1.png";
import heroDos from "../../assets/image2.png";
import heroTres from "../../assets/image3.png";
import heroCuatro from "../../assets/image4.png";

export default function Welcome() {
  const navigate = useNavigate();
  const audienceItems = [
    "Desarrolladores",
    "Disenadores",
    "Estudiantes",
    "Profesionales",
    "Freelancers",
    "Creadores",
    "Consultores",
    "Programadores",
  ];
  const avatars = [
    { initials: "", color: "bg-blue-500", name: "Juan D." },
    { initials: "", color: "bg-purple-500", name: "María R." },
    { initials: "", color: "bg-pink-500", name: "Carlos S." },
  ];

  return (
    <main className="relative mx-auto grid max-w-6xl gap-10 px-4 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-screen h-full z-0 bg-[radial-gradient(circle_at_10%_20%,rgba(124,58,237,0.12),transparent_22%),radial-gradient(circle_at_80%_10%,rgba(99,102,241,0.08),transparent_30%)]"
      />
      <section className="relative space-y-6 z-10">
        <div className="mt-16 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur-sm sm:px-4 sm:py-2">
          <div className="flex -space-x-1.5">
            {avatars.map((avatar, index) => (
              <div
                key={index}
                className={`flex h-5 w-5 items-center justify-center rounded-full border border-[#050816] ${avatar.color} text-xs font-semibold text-white`}
                title={avatar.name}
              >
                {avatar.initials}
              </div>
            ))}
          </div>
          <span className="text-[8px] text-slate-300 sm:text-xs">De confianza por creadores de todo el mundo</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Bienvenido a
            <span className="block bg-gradient-to-r from-indigo-400 via-sky-400 to-fuchsia-400 bg-clip-text text-transparent">
              Safe Portfolio
            </span>
          </h1>
          <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Crea y gestiona un portafolio en línea que unifique tus proyectos, habilidades,
            experiencia y logros. Una herramienta clave para fortalecer tu marca personal y
            destacar profesionalmente.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button
            className="flex h-10 items-center gap-2 rounded-lg bg-[#6c72ff] px-6 text-sm font-medium tracking-wide text-white hover:bg-[#5c61eb]"
            onClick={() => navigate("/register")}
          >
            Crear portafolio
            <ArrowRightIcon size={18} />
          </Button>
          <Button
            className="flex h-10 items-center gap-2 rounded-lg border border-slate-600/60 bg-transparent px-6 text-sm font-medium tracking-wide text-slate-100 hover:bg-white/5"
            onClick={() => navigate("/portfolios")}
          >
            <PlayIcon size={18} weight="fill" />
            Ver Demo
          </Button>
        </div>

      </section>

      <section className="mx-auto w-full max-w-[540px] lg:ml-auto lg:mr-0 z-10">
        <div className="relative space-y-4 pt-10">

          <div className="mt-12 h-[300px] w-full max-w-[540px] overflow-hidden rounded-[1.2rem] bg-[#120f2a]">
            <img
              src={heroTres}
              alt="Ilustración de trabajo en equipo"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="mt-4 flex items-center justify-start gap-3 px-1 pb-1">
            <div className="flex gap-2">
              <span className="h-10 w-16 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <img src={heroDos} alt="Miniatura 1" className="h-full w-full object-cover opacity-80" />
              </span>
              <span className="h-10 w-16 overflow-hidden rounded-lg border border-white/10 bg-white/5">
                <img src={heroUno} alt="Miniatura 2" className="h-full w-full object-cover opacity-60" />
              </span>
              <span className="h-10 w-16 overflow-hidden rounded-lg border border-white/10 bg-white/5 grayscale">
                <img src={heroCuatro} alt="Miniatura 3" className="h-full w-full object-cover opacity-50" />
              </span>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm text-slate-200">
              <span
                className="h-2 w-2 rounded-full bg-emerald-500"
                style={{ animation: "greenDotPulse 1s ease-in-out infinite" }}
              />
              20+ Portafolios Completados
            </div>
          </div>
        </div>
      </section>

      <section
        className="lg:col-span-2 mt-30 overflow-hidden border-y border-white/10 bg-[#070b20]/65 py-5 z-10"
        style={{
          maskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(90deg, transparent 0%, rgba(0,0,0,1) 12%, rgba(0,0,0,1) 88%, transparent 100%)",
        }}
      >
        <div
          className="flex w-max items-center gap-30 whitespace-nowrap"
          style={{
            animation: "scrollCarousel 60s linear infinite",
          }}
        >
          {[...audienceItems, ...audienceItems].map((text, idx) => (
            <span
              key={`${text}-${idx}`}
              className="inline-block flex-shrink-0 text-sm font-bold tracking-wide text-slate-400"
            >
              {text}
            </span>
          ))}
        </div>
      </section>
    </main>
  );
}
