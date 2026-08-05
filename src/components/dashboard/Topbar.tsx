export default function Topbar() {
  return (
    <header className="h-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl flex items-center justify-between px-8">

      {/* Buscador */}

      <div className="flex-1 max-w-xl">

        <div className="flex items-center gap-3 rounded-xl border border-slate-800 bg-slate-900 px-5 py-3">

          <span className="text-slate-400">
            🔍
          </span>

          <input
            type="text"
            placeholder="Buscar..."
            className="w-full bg-transparent text-white outline-none placeholder:text-slate-500"
          />

        </div>

      </div>


      {/* Acciones */}

      <div className="flex items-center gap-5 ml-8">


        {/* Notificaciones */}

        <button
          className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-xl hover:bg-slate-800 transition"
        >

          🔔

          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-sky-400" />

        </button>


        {/* Ajustes */}

        <button
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-xl hover:bg-slate-800 transition"
        >

          ⚙️

        </button>


        {/* Avatar */}

        <div className="flex items-center gap-3">

          <div className="h-11 w-11 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400 flex items-center justify-center font-bold text-white">
            MP
          </div>

        </div>


      </div>

    </header>
  );
}