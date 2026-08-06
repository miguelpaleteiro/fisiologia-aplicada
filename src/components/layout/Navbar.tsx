import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-2xl">

      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 lg:px-8 py-4">

        {/* Logo */}

        <Link href="/" className="cursor-pointer">

          <h1 className="text-2xl font-extrabold tracking-tight text-white">

            Fisiología{" "}

            <span className="bg-gradient-to-r from-sky-400 to-cyan-300 bg-clip-text text-transparent">
              Aplicada
            </span>

          </h1>

          <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
            Medicina • Entrenamiento • Nutrición
          </p>

        </Link>

        {/* Menú */}

        <nav className="hidden lg:flex items-center gap-10 text-slate-300 font-medium">

          <a
            href="#servicios"
            className="transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            Servicios
          </a>

          <a
            href="#metodo"
            className="transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            Método
          </a>

          <a
            href="#sobre-mi"
            className="transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            Sobre mí
          </a>

          <a
            href="#contacto"
            className="transition-all duration-300 hover:-translate-y-0.5 hover:text-white"
          >
            Contacto
          </a>

        </nav>

        {/* Botones */}

        <div className="flex items-center gap-4">

          <a
            href="#servicios"
            className="inline-flex rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:border-sky-500 hover:text-white sm:hidden"
          >
            Explorar
          </a>

          <Link
            href="/login"
            className="hidden sm:inline-flex rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition-all duration-300 hover:border-sky-500 hover:text-white"
          >
            Iniciar sesión
          </Link>

          <a
            href="https://instagram.com/miguelpaleteiro"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_15px_40px_rgba(14,165,233,0.35)]"
          >
            @miguelpaleteiro
          </a>

        </div>

      </div>

    </header>
  );
}
