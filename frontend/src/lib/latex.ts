import { type ProfileData } from "@/types/public-portfolio";
import { format, isValid } from "date-fns";
import { es } from "date-fns/locale";

function stringToArray(text = "") {
  console.log(
    "what",
    text
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "")
  );

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "");
}

function formatDate(date: string | null | undefined) {
  if (!date) return "Presente";

  const parsedDate = new Date(date);

  if (!isValid(parsedDate)) {
    console.error("Fecha inválida:", date);
    return "Presente";
  }

  return format(parsedDate, "MMM yyyy", { locale: es });
}

export const generateLatexPdf = (profile: ProfileData | null) => {
  if (!profile) return "";

  const contactInfo = [profile.profession, profile.city, profile.profile_email, profile.phone]
    .filter((item): item is string => typeof item === "string" && item.trim() !== "")
    .join(" \\textbullet \\ ");

  const baseText = String.raw`\documentclass[11pt]{article}
\setlength{\parindent}{0pt}
\usepackage{hyperref}
\usepackage{enumitem}
\usepackage[utf8]{inputenc} 
\usepackage[T1]{fontenc}
\usepackage[brazil]{babel}
\usepackage{lipsum}
\usepackage[left=1.06cm,top=1.7cm,right=1.06cm,bottom=0.49cm]{geometry}

%by: Aline R. Antunes

\begin{document}

\begin{center}
    \textbf{${profile.profile_name}}\\ 
    \hrulefill
\end{center}

\begin{center}
    ${contactInfo}
\end{center}

\vspace{0.5pt}

\begin{center}
    \textbf{Educación}
\end{center}

${profile.academyc_trainings
  .map(
    (training) => String.raw`

\textbf{${training.institution_name}} 
\hfill ${formatDate(training.start_date)} – ${formatDate(training.end_date)}

${training.field_of_study || ""}
${training.description || ""}
`
  )
  .join("\n")}

\vspace{12pt}

\begin{center}
    \textbf{Experiencia}
\end{center}

${profile.work_experiences
  .map(
    (experiencie) => String.raw`

\textbf{${experiencie.company}} 

\textbf{${experiencie.position}} 
\hfill ${formatDate(experiencie.start_date)} – ${formatDate(experiencie.end_date)}

${
  experiencie.achievements !== null
    ? String.raw`
\begin{itemize}[noitemsep, topsep=0pt, partopsep=0pt, parsep=0pt]
${
  experiencie.achievements
    ? stringToArray(experiencie.achievements)
        .map((line) => String.raw`\item ${line}`)
        .join("\n")
    : "\\item {}"
}
\end{itemize}`
    : ""
}

\vspace{12pt}
`
  )
  .join("\n")}

\begin{center}
    \textbf{Habilidades Técnicas y Blandas}
\end{center}

\textbf{Técnico:} ${profile.portfolio_skills
    .filter((skill) => skill?.technical_skill?.name)
    .map((skill) => `${skill?.technical_skill?.name} (${skill?.level})`)
    .join(", ")}

\textbf{Blandas:}
${profile?.soft_skills.map((skill) => `${skill?.name}: ${skill?.description}`).join(", ")}

\end{document}`;

  console.log("base", baseText);

  return "https://latexonline.cc/compile?text=" + encodeURIComponent(baseText);
};
