export default function Stats() {
  return (
    <section className="relative overflow-hidden bg-slate-950 py-32 px-8 text-white">

      {/* Fondo */}

      <div className="absolute inset-0">

        <div className="absolute left-1/4 top-0 h-80 w-80 rounded-full bg-sky-500/10 blur-[140px]" />

        <div className="absolute right-1/4 bottom-0 h-80 w-80 rounded-full bg-cyan-500/10 blur-[140px]" />

      </div>

      <div className="relative max-w-7xl mx-auto">

        {/* Cabecera */}

        <div className="text-center mb-20">

          <span className="uppercase tracking-[0.35em] text-sky-400 font-semibold">
            DASHBOARD
          </span>

          <h2 className="mt-5 text-4xl md:text-5xl lg:text-6xl font-bold">
            Todo tu progreso en un solo lugar
          </h2>

          <p className="mx-auto mt-8 max-w-3xl text-slate-400 text-lg md:text-xl leading-9">
            Controla entrenamiento, nutrición, adherencia,
            recuperación y evolución desde un único panel.
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-10">

          {/* Dashboard */}

          <div className="group rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-xl p-10 transition-all duration-500 hover:-translate-y-2 hover:border-sky-500 hover:shadow-[0_25px_70px_rgba(14,165,233,0.20)]">

            <div className="flex justify-between items-center mb-10">

              <h3 className="text-3xl font-bold">
                Evolución
              </h3>

              <span className="rounded-full bg-green-500/20 px-4 py-2 text-sm font-semibold text-green-400">
                ● En progreso
              </span>

            </div>

            <div className="space-y-8">

              {/* Peso */}

              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-slate-400">
                    Peso
                  </span>

                  <span className="font-bold">
                    73 kg
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800">

                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"></div>

                </div>

              </div>

              {/* Adherencia */}

              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-slate-400">
                    Adherencia
                  </span>

                  <span className="font-bold text-green-400">
                    96%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800">

                  <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>

                </div>

              </div>

              {/* Recuperación */}

              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-slate-400">
                    Recuperación
                  </span>

                  <span className="font-bold text-violet-400">
                    85%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800">

                  <div className="h-full w-[85%] rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>

                </div>

              </div>

            </div>

          </div>

          {/* KPIs */}

          <div className="grid grid-cols-2 gap-6">

            <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:scale-105 hover:border-sky-500">

              <p className="text-slate-400">
                Entrenos
              </p>

              <h2 className="mt-4 text-6xl font-bold">
                4
              </h2>

              <span className="mt-4 inline-block text-green-400">
                +1 esta semana
              </span>

            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:scale-105 hover:border-cyan-500">

              <p className="text-slate-400">
                Pasos
              </p>

              <h2 className="mt-4 text-6xl font-bold">
                68k
              </h2>

              <span className="mt-4 inline-block text-cyan-400">
                Objetivo cumplido
              </span>

            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:scale-105 hover:border-violet-500">

              <p className="text-slate-400">
                Sueño
              </p>

              <h2 className="mt-4 text-6xl font-bold">
                8h
              </h2>

              <span className="mt-4 inline-block text-violet-400">
                Excelente
              </span>

            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/5 backdrop-blur-xl p-8 transition-all duration-300 hover:scale-105 hover:border-green-500">

              <p className="text-slate-400">
                Rendimiento
              </p>

              <h2 className="mt-4 text-6xl font-bold text-sky-400">
                ↑12%
              </h2>

              <span className="mt-4 inline-block text-green-400">
                Tendencia positiva
              </span>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}