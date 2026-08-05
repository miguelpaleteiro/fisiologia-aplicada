export default function Hero() {
  return (
    <section className="relative min-h-screen bg-slate-950 text-white flex items-center justify-center px-8 overflow-hidden">

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

        {/* Texto */}

        <div>

          <span className="uppercase tracking-[0.3em] text-sky-400 font-semibold">
            FISIOLOGÍA APLICADA
          </span>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mt-6">
            Entiende tu cuerpo.
            <br />
            Mejora tu rendimiento.
          </h1>

          <p className="text-slate-400 text-lg md:text-xl leading-9 mt-8 max-w-xl">
            Entrenamiento, nutrición y fisiología aplicada
            basados en evidencia científica para conseguir
            resultados sostenibles.
          </p>

          <div className="mt-10">

            <button className="px-8 py-4 rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_50px_rgba(14,165,233,0.35)]">
              Empieza tu cambio →
            </button>

          </div>

        </div>

        {/* Dashboard */}

        <div className="flex justify-center">

          <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

            <h3 className="text-2xl font-bold mb-8">
              Dashboard
            </h3>

            <div className="space-y-8">

              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-slate-400">
                    Peso
                  </span>

                  <span className="font-semibold">
                    73 kg
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

                  <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"></div>

                </div>

              </div>

              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-slate-400">
                    Adherencia
                  </span>

                  <span className="text-green-400 font-semibold">
                    96%
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

                  <div className="h-full w-[96%] rounded-full bg-gradient-to-r from-green-500 to-emerald-400"></div>

                </div>

              </div>

              <div>

                <div className="flex justify-between mb-3">

                  <span className="text-slate-400">
                    Entrenamientos
                  </span>

                  <span className="font-semibold">
                    4
                  </span>

                </div>

                <div className="h-3 rounded-full bg-slate-800 overflow-hidden">

                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"></div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}