import { Book, Target } from "@phosphor-icons/react";

export default function EducationProjects() {
  const education = [
    {
      date: "2020-2024",
      institution: "MIT",
      degree: "Licenciatura en Ciencias de la Computación"
    },
    {
      date: "2018-2019",
      institution: "Universidad de Harvard",
      degree: "Certificación en React y Redux, Curso de Desarrollador Node.js"
    },
    {
      date: "2015-2016",
      institution: "Universidad de Stanford",
      degree: "Certificación en desarrollo web full stack"
    },
    {
      date: "2013-2015",
      institution: "Universidad de Washington",
      degree: "Certificación en React y Redux, Curso de Desarrollador Node.js"
    }
  ];

  const projects = [
    {
      date: "2023-2024",
      title: "Análisis de datos avanzado con herramientas de Big Data",
      description: "Se utilizaron herramientas de big data para análisis y obtención de información avanzada."
    },
    {
      date: "2021-2023",
      title: "Arquitecturas de aplicaciones nativas de la nube",
      description: "Estudió las mejores prácticas para el diseño de aplicaciones nativas de la nube."
    },
    {
      date: "2019-2020",
      title: "Personalización de la experiencia del usuario impulsada por IA",
      description: "Se utilizó la IA para personalizar las experiencias de los usuarios en función de su comportamiento"
    }
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-12 md:px-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Education Column */}
        <div className="rounded-2xl border border-[#262b46] bg-[#13152e] p-8 md:p-10 shadow-xl">
          <div className="mb-10 flex items-center gap-3">
            <Book className="h-8 w-8 text-[#bcfd49]" weight="bold" />
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white">
              Estudios
            </h2>
          </div>

          <div className="relative space-y-10 pl-2">
            {/* Vertical Line */}
            <div className="absolute -left-px top-2 bottom-2 w-px bg-slate-800" />
            
            {education.map((edu, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-1.25 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#13152e] bg-slate-600 shadow-[0_0_0_1px_rgba(71,85,105,1)]" />
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
                    <span className="text-slate-500">{edu.date}:</span>
                    <span className="font-bold text-[#bcfd49]">{edu.institution}</span>
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-slate-300 ml-0 md:ml-22.5">
                    {edu.degree}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Projects Column */}
        <div className="rounded-2xl border border-[#262b46] bg-[#13152e] p-8 md:p-10 shadow-xl">
          <div className="mb-10 flex items-center gap-3">
            <Target className="h-8 w-8 text-[#bcfd49]" weight="bold" />
            <h2 className="font-mono text-3xl font-bold tracking-tight text-white">
              Proyectos Realizados
            </h2>
          </div>

          <div className="relative space-y-10 pl-2">
            {/* Vertical Line */}
            <div className="absolute -left-px top-2 bottom-2 w-px bg-slate-800" />
            
            {projects.map((proj, i) => (
              <div key={i} className="relative pl-8">
                <div className="absolute -left-1.25 top-1.5 h-2.5 w-2.5 rounded-full border-2 border-[#13152e] bg-slate-600 shadow-[0_0_0_1px_rgba(71,85,105,1)]" />
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-baseline gap-2 font-mono text-sm leading-snug">
                    <span className="text-slate-500 whitespace-nowrap">{proj.date}:</span>
                    <span className="font-bold text-[#bcfd49]">{proj.title}</span>
                  </div>
                  <p className="font-mono text-xs leading-relaxed text-slate-300 ml-0 md:ml-23.75">
                    {proj.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
