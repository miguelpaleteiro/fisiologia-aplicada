import Link from "next/link";

export default function Registro() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">

      {/* Fondo */}

      <div className="absolute inset-0 -z-10 overflow-hidden">

        <div className="absolute left-0 top-0 h-[420px] w-[420px] rounded-full bg-sky-500/20 blur-[180px]" />

        <div className="absolute bottom-0 right-0 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[180px]" />

      </div>

      {/* Volver */}

      <Link
        href="/"
        className="absolute left-8 top-8 text-slate-400 transition hover:text-white"
      >
        ← Volver al inicio
      </Link>

      {/* Card */}

      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-white/5 p-10 backdrop-blur-xl shadow-2xl">

        <div className="mb-10 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-3xl">
            🚀
          </div>

          <h1 className="text-4xl font-bold text-white">
            Crear cuenta
          </h1>

          <p className="mt-3 text-slate-400">
            Empieza hoy tu transformación basada en evidencia.
          </p>

        </div>

        <form className="space-y-5">

          <input
            type="text"
            placeholder="Nombre completo"
            autoComplete="name"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />

          <input
            type="email"
            placeholder="Correo electrónico"
            autoComplete="email"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />

          <input
            type="password"
            placeholder="Contraseña"
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-5 py-4 text-white outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30"
          />

          <button
            type="submit"
            className="w-full rounded-xl bg-gradient-to-r from-sky-500 to-cyan-400 py-4 font-semibold text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(14,165,233,0.35)]"
          >
            Crear cuenta
          </button>

        </form>

        <div className="mt-8 text-center text-sm text-slate-400">

          ¿Ya tienes una cuenta?

          <Link
            href="/login"
            className="ml-2 font-medium text-sky-400 transition hover:text-white"
          >
            Iniciar sesión
          </Link>

        </div>

      </div>

    </main>
  );
}