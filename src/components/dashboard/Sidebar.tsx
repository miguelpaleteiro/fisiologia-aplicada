import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 h-screen border-r border-white/10 bg-slate-950 sticky top-0">

      <div className="p-8">

        <Link href="/" className="block">

          <h1 className="text-2xl font-black text-white">

            Fisiología{" "}

            <span className="text-sky-400">
              Aplicada
            </span>

          </h1>

        </Link>

      </div>

      <nav className="px-5 space-y-2">

        <Link
          href="/dashboard"
          className="flex rounded-xl px-5 py-4 bg-sky-500 text-white font-semibold"
        >
          🏠 Dashboard
        </Link>

        <Link
          href="#"
          className="flex rounded-xl px-5 py-4 text-slate-400 hover:bg-slate-900 transition"
        >
          🏋 Entrenamientos
        </Link>

        <Link
          href="#"
          className="flex rounded-xl px-5 py-4 text-slate-400 hover:bg-slate-900 transition"
        >
          🥗 Nutrición
        </Link>

        <Link
          href="#"
          className="flex rounded-xl px-5 py-4 text-slate-400 hover:bg-slate-900 transition"
        >
          📈 Progreso
        </Link>

        <Link
          href="#"
          className="flex rounded-xl px-5 py-4 text-slate-400 hover:bg-slate-900 transition"
        >
          📅 Calendario
        </Link>

        <Link
          href="#"
          className="flex rounded-xl px-5 py-4 text-slate-400 hover:bg-slate-900 transition"
        >
          🤖 Coach IA
        </Link>

      </nav>

    </aside>
  );
}