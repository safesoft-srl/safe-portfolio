import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0b1e] text-slate-100 px-4 text-center">
      <h1 className="text-9xl font-bold text-[#6c72ff]">404</h1>
      <h2 className="mt-6 text-3xl font-semibold sm:text-4xl">Página no encontrada</h2>
      <p className="mt-4 text-lg text-slate-400">
        Lo sentimos, el portafolio o página que buscas no existe.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-[#6c72ff] px-6 py-3 font-medium text-white transition-colors hover:bg-[#5a5fcc]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
