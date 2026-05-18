export default function Footer() {
  const currentYear = new Date().getFullYear();

  const companyLinks = [
    { label: "Inicio", href: "#i" },
    { label: "Sobre Nosotros", href: "#s" },
    { label: "Contactanos", href: "#c" },
    { label: "Política de privacidad", href: "#p" },
  ];
  const socialLinks = [
    { label: "+591 65678590", href: "#c" },
    { label: "safesoftware.srl@gmail.com", href: "#s" },
  ];

  return (
    <footer
      id="footer"
      className="relative mt-12 overflow-hidden border-t border-white/10 bg-transparent text-slate-200"
    >
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[2fr_0.5fr_0.7fr_0.7fr] lg:gap-16">
          <div className="max-w-xl">
            <a href="#inicio" className="inline-flex items-center gap-3">
              <span className="text-[1.6rem] font-extrabold tracking-[-0.04em] text-white">
                Safe Portfolio
              </span>
            </a>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-300/90">
              Potenciamos tu marca personal a través de portafolios digitales optimizados. Ayudamos
              a creadores, desarrolladores y agencias a estructurar sus mejores proyectos con
              diseños listos para convertir visitas en grandes oportunidades.
            </p>
          </div>

          <div className="hidden lg:block"></div>

          <div>
            <h3 className="text-sm font-bold tracking-[-0.02em] text-white">Empresa</h3>
            <ul className="mt-6 space-y-3 text-xs leading-6 text-slate-300">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <a className="transition-colors hover:text-white" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold tracking-[-0.02em] text-white">Ponte en Contacto</h3>
            <ul className="mt-6 space-y-3 text-xs leading-6 text-slate-300">
              {socialLinks.map((link) => (
                <li key={link.label}>
                  <a className="transition-colors hover:text-white" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/10 pt-6 text-center text-[0.95rem] text-slate-400">
          <p>&copy; {currentYear} SafePortfolio. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
