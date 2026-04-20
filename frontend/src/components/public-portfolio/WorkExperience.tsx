export default function WorkExperience() {
  const experiences = [
    {
      company: "Google",
      period: "2018 - Present",
      description:
        "Lideré el desarrollo de aplicaciones web escalables, mejorando el rendimiento y la experiencia de usuario para millones de usuarios.",
      achievements: [
        { symbol: "+", text: "Reconocimiento por desempeño laboral" },
        {
          symbol: "+",
          text: "Reduccion de problemas en un 70% gracias a las aplicaciones implementadas",
        },
      ],
      color: "text-[#bcfd49]",
      borderColor: "border-[#bcfd49]/40",
    },
    {
      company: "FACEBOOK",
      period: "2020-2024",
      description:
        "Se implementaron algoritmos de aprendizaje automático para mejorar la funcionalidad de búsqueda.",
      achievements: [
        {
          symbol: "*",
          text: "Aumento de eficiencia y eficacia en un 85% en la interaccin con el navegador",
        },
        {
          symbol: "•",
          text: "Mayor satisfaccoin por parte de los usuarios que intereactuaron en el web en su uso cotidiano",
        },
      ],
      color: "text-[#85ff4d]",
      borderColor: "border-[#85ff4d]/40",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="rounded-2xl border border-[#bcfd49]/20 bg-[#13152e]/50 p-8 md:p-12 shadow-2xl">
        <div className="mb-10">
          <h2 className="font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
            Experiancia Laboral
          </h2>
          <p className="mt-2 font-mono text-sm font-medium text-[#727bff]">
            • Ingeniero en Software Senior
          </p>
        </div>

        <div className="flex flex-col gap-8">
          {experiences.map((exp, i) => (
            <div
              key={i}
              className={`rounded-xl border ${exp.borderColor} bg-[#13152e] p-6 md:p-8 shadow-lg transition-transform hover:scale-[1.01]`}
            >
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h3
                  className={`font-mono text-2xl font-bold uppercase tracking-tight ${exp.color}`}
                >
                  {exp.company}
                </h3>
                <span className="font-mono text-sm font-semibold text-[#727bff]">{exp.period}</span>
              </div>

              <p className="max-w-3xl font-mono text-sm leading-relaxed text-white">
                {exp.description}
              </p>

              <div className="mt-6">
                <h4 className="font-mono text-xs font-bold uppercase tracking-widest text-slate-300">
                  Logros:
                </h4>
                <ul className="mt-3 space-y-2">
                  {exp.achievements.map((ach, j) => (
                    <li key={j} className="flex gap-3 font-mono text-xs text-white">
                      <span className={exp.color}>{ach.symbol}</span>
                      <span className="leading-relaxed">{ach.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
