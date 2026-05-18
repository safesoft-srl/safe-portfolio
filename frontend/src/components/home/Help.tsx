import { CaretDown } from "@phosphor-icons/react";

export default function Help() {
  const faqs = [
    {
      question: "¿Es gratis crear un portafolio?",
      answer: "Si puedes crear y gestionar tu portafolio de forma completamente gratuita.",
      open: true,
    },
    {
      question: "¿Puedo personalizar mi portafolio?",
      answer: "Claro, tienes multiples opciones de personalizacion para que se adapte a tu estilo.",
    },
    {
      question: "¿Cómo comparto mi portafolio?",
      answer:
        "Puedes generar un enlace único para compartir tu portafolio con reclutadores y empleadores.",
    },
    {
      question: "¿Qué información puedo añadir?",
      answer:
        "Puedes añadir proyectos, habilidades tecnicas, habilidades blandas, experiencia laboral y mas.",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-transparent px-4 py-20 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(5,8,22,0.08)_0%,rgba(5,8,22,0.20)_50%,rgba(5,8,22,0.10)_100%)]"
      />

      <div className="relative mx-auto flex max-w-5xl flex-col gap-12">
        <div className="mx-auto max-w-3xl space-y-4 text-center">
          <span className="text-sm font-semibold text-[#a78bfa]">AYUDA</span>
          <h2 className="text-5xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
            Preguntas frecuentes
          </h2>
          <p className="mx-auto max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Todo lo que necesitas saber sobre cómo usar nuestro sistema. Si tienes más preguntas, no
            dudes en contactarnos.
          </p>
        </div>

        <div className="space-y-2 max-w-3xl mx-auto w-full">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              open={faq.open}
              className="group rounded-2xl bg-[#15172a]/90 p-4 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-sm transition-colors duration-300"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left font-semibold text-white text-sm leading-6">
                <span>{faq.question}</span>
                <CaretDown
                  size={14}
                  className="shrink-0 text-slate-300 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300 xs:text-base">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
