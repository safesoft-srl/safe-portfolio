import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "@/components/home/Header";
import Welcome from "@/components/home/Welcome";
import Characteristics from "@/components/home/Characteristics";
import Help from "@/components/home/Help";
import Join from "@/components/home/Join";
import Footer from "@/components/home/Footer";
import useReveal from "@/hooks/useReveal";
import "@/styles/reveal.css";

export default function Home() {
  const [activeSection, setActiveSection] = useState<string>("inicio");
  const location = useLocation();
  const inicioRef = useReveal();
  const comoRef = useReveal();
  const ayudaRef = useReveal();
  const contactosRef = useReveal();

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo;

    if (!scrollTo) return;

    setTimeout(() => {
      setActiveSection(scrollTo);
    }, 0);

    const element = document.getElementById(scrollTo);

    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [location.state]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="isolate relative min-h-screen bg-[#050816] text-slate-100 font-heading">
      <div
        ref={(el) => {
          (window as Window & { __homeBgRef?: HTMLDivElement | null }).__homeBgRef = el || null;
        }}
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[#050816] bg-no-repeat bg-top bg-cover will-change-transform"
        style={{
          transform: "translateY(0px)",
          backgroundImage:
            "radial-gradient(circle at 30% 35%, rgba(124, 58, 237, 0.28), transparent 15%), radial-gradient(circle at 52% 42%, rgba(88, 28, 135, 0.38), transparent 30%), radial-gradient(circle at 82% 48%, rgba(173, 19, 127, 0.26), transparent 24%)",
        }}
      />

      <div className="relative z-10">
        <Header activeSection={activeSection} onNavigate={handleNavigate} />

        <div id="inicio" ref={inicioRef} className="reveal">
          <Welcome />
        </div>

        <div id="como-funciona" ref={comoRef} className="reveal">
          <Characteristics />
        </div>

        <div id="ayuda" ref={ayudaRef} className="reveal">
          <Help />
        </div>

        <div id="contactos" ref={contactosRef} className="reveal">
          <Join />
        </div>

        <Footer />
      </div>
    </div>
  );
}
