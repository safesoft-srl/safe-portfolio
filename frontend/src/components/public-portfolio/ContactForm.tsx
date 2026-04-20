import { Phone, EnvelopeSimple, SkypeLogo, MapPin, ArrowUpRight } from "@phosphor-icons/react";

export default function ContactForm() {
  const contactInfo = [
    {
      icon: Phone,
      label: "Número de teléfono",
      value: "+1-234-567-8901",
    },
    {
      icon: EnvelopeSimple,
      label: "Correo electrónico",
      value: "contact@william.design",
    },
    {
      icon: SkypeLogo,
      label: "Skype",
      value: "WilliamDesignUX",
    },
    {
      icon: MapPin,
      label: "Dirección",
      value: "0811 Erdman Prairie, Joaville CA",
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-5 py-24 md:px-10">
      <h2 className="mb-10 font-mono text-4xl font-bold tracking-tight text-[#bcfd49]">
        Contactame
      </h2>

      <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
        {/* Contact Form */}
        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="text"
              placeholder="Tu nombre"
              className="w-full rounded-lg border border-[#262b46] bg-[#1a1d3a]/50 p-4 font-mono text-sm text-white placeholder-slate-500 outline-hidden focus:border-[#bcfd49]/50 transition-colors"
            />
            <input
              type="text"
              placeholder="Telefono"
              className="w-full rounded-lg border border-[#262b46] bg-[#1a1d3a]/50 p-4 font-mono text-sm text-white placeholder-slate-500 outline-hidden focus:border-[#bcfd49]/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <input
              type="email"
              placeholder="Correo electronico"
              className="w-full rounded-lg border border-[#262b46] bg-[#1a1d3a]/50 p-4 font-mono text-sm text-white placeholder-slate-500 outline-hidden focus:border-[#bcfd49]/50 transition-colors"
            />
            <input
              type="text"
              placeholder="Sujeto"
              className="w-full rounded-lg border border-[#262b46] bg-[#1a1d3a]/50 p-4 font-mono text-sm text-white placeholder-slate-500 outline-hidden focus:border-[#bcfd49]/50 transition-colors"
            />
          </div>
          <textarea
            placeholder="Mensaje"
            rows={8}
            className="w-full rounded-lg border border-[#262b46] bg-[#1a1d3a]/50 p-4 font-mono text-sm text-white placeholder-slate-500 outline-hidden focus:border-[#bcfd49]/50 transition-colors resize-none"
          />
          <button
            type="submit"
            className="flex items-center justify-center gap-2 self-start rounded-lg bg-[#bcfd49] px-6 py-3 font-mono text-sm font-bold text-[#13152e] shadow-lg shadow-[#bcfd49]/20 transition-all hover:scale-105 active:scale-95"
          >
            Enviar mensaje <ArrowUpRight size={18} weight="bold" />
          </button>
        </form>

        {/* Contact Info */}
        <div className="flex flex-col gap-8">
          {contactInfo.map((item, i) => (
            <div key={i} className="flex items-center gap-5 group">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#262b46] bg-[#1a1d3a] transition-colors group-hover:border-[#bcfd49]/40 group-hover:bg-[#1a1d3a]/80">
                <item.icon className="h-6 w-6 text-[#bcfd49]" weight="bold" />
              </div>
              <div className="flex flex-col gap-1">
                <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
                  {item.label}
                </span>
                <span className="font-mono text-sm font-semibold text-white">{item.value}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
