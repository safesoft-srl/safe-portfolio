import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@phosphor-icons/react";

export default function Join() {
  const navigate = useNavigate();

  return (
    <section className="relative px-4 py-16">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(180deg,rgba(8,11,28,0.06)_0%,rgba(8,11,28,0.12)_100%)]"
      />

      <div className="relative z-10 mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-[#17162b]/80 px-6 py-16 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] backdrop-blur-sm sm:px-10 lg:px-16 lg:py-20">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-3xl">
            ¿Listo para destacar profesionalmente?
          </h2>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Únete a miles de profesionales que ya confían en Safe Portfolio
          </p>

          <Button
            onClick={() => navigate("/register")}
            className="mt-10 flex h-10 items-center gap-2 rounded-lg bg-[#6c72ff] px-6 text-sm font-medium tracking-wide text-white hover:bg-[#5c61eb]"
          >
            Crear mi portafolio ahora
            <ArrowRightIcon size={18} />
          </Button>
        </div>
      </div>
    </section>
  );
}
