import { PersonIcon } from "@phosphor-icons/react";

export default function BusinessGit() {
  const gitLog = [
    { date: "15 Jul", text: "Servicios API de streaming de mozilla para python" },
    { date: "30 Jun", text: "ChatHub-Aplicasion de chat -VueJs-Mongodb" },
    { date: "26 May", text: "DineEasy-coffee-tea-reservation-system" },
    { date: "17 Apr", text: "FinanceBuddy-Personal-finance-tracker" },
    { date: "05 Mar", text: "TuneStream-Music-streaming-service-API" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 md:px-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Section: Cooperation */}
        <div className="relative overflow-hidden rounded-2xl border border-[#262b46] bg-[#13152e] p-8 lg:col-span-2">
          {/* Green accent line on top like the image */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#72f587]/40 to-transparent" />

          <div className="relative z-10">
            <span className="font-mono text-xs text-[#72f587]">• Cooperation</span>
            <h2 className="mt-4 text-3xl font-semibold leading-tight text-white md:text-4xl">
              Mas de 168 <span className="text-slate-400 font-light italic">empresas</span> <br />
              de confianza <span className="text-slate-400 font-light italic">en todo el</span>{" "}
              <br />
              <span className="text-slate-400 font-light italic">mundo</span>
            </h2>

            {/* Logo Grid */}
            <div className="mt-10 rounded-xl border border-[#262b46]/50 bg-[#1a1d3a]/50 p-6">
              <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="flex h-12 items-center justify-center grayscale opacity-40 hover:opacity-100 transition-opacity"
                  >
                    {/* White block placeholder for images */}
                    <div className="h-6 w-24 bg-white/40 rounded-sm" />
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Section */}
            <div className="mt-12 flex flex-col items-center gap-8 md:flex-row">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <div className="absolute inset-0 rounded-full border border-[#262b46] bg-[#181b36] shadow-inner" />
                <div className="absolute inset-2 rounded-full border border-white/5 bg-[#111327]" />
                <div className="relative z-10 h-16 w-16 overflow-hidden rounded-full border border-white/10 bg-white/10">
                  {/* White block placeholder for avatar */}
                  <div className="h-full w-full bg-slate-500/50 flex items-center justify-center">
                    <PersonIcon className="h-8 w-8 text-white/50" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-2 h-3 w-3 rounded-full bg-[#72f587] border-2 border-[#13152e]" />
              </div>

              <div className="flex flex-col gap-3 font-mono text-xs">
                <div className="flex items-center gap-3">
                  <PersonIcon className="h-4 w-4 text-white" />
                  <span className="text-slate-400">[skype]</span>
                  <span className="text-[#ff6098]">james.dev</span>
                </div>
                <div className="flex items-center gap-3">
                  <PersonIcon className="h-4 w-4 text-white" />
                  <span className="text-slate-400">[phone]</span>
                  <span className="text-[#ff6098]">+1-234-567-8901</span>
                </div>
                <div className="flex items-center gap-3">
                  <PersonIcon className="h-4 w-4 text-white" />
                  <span className="text-slate-400">[email]</span>
                  <span className="text-[#ff6098]">contact@james.dev</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section: Git log */}
        <div className="relative overflow-hidden rounded-2xl border border-[#262b46] bg-[#13152e] p-8 shadow-xl">
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-[#72f587]/40 to-transparent" />

          <div className="relative z-10">
            <span className="font-mono text-xs text-[#72f587]">• Registro de git</span>

            <div className="mt-8 space-y-8 relative">
              {/* Vertical line */}
              <div className="absolute left-0.75 top-2 bottom-2 w-px bg-slate-800" />

              {gitLog.map((log, i) => (
                <div key={i} className="relative pl-6">
                  <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full bg-slate-600" />
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] text-slate-500 whitespace-nowrap mt-0.5">
                      {log.date}:
                    </span>
                    <p className="text-xs leading-relaxed text-slate-300 font-mono">{log.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
