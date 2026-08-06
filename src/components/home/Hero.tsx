import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-slate-950 text-white flex items-center px-8 pt-24">

      <div className="max-w-7xl mx-auto">

        <div className="grid lg:grid-cols-2 gap-20 items-center">


          {/* IZQUIERDA */}

          <div className="lg:-translate-y-4">

            <span className="uppercase tracking-[0.35em] text-sky-400 font-semibold">
              FISIOLOGÍA APLICADA
            </span>

            <h1 className="mt-6 text-5xl md:text-6xl lg:text-7xl font-black leading-tight">
              Entiende tu cuerpo.
              <br />
              Mejora tu rendimiento.
            </h1>

            <p className="mt-8 max-w-xl text-lg md:text-xl text-slate-400 leading-9">
              La plataforma que une entrenamiento, nutrición y fisiología
              basada en evidencia para ayudarte a progresar de forma
              inteligente.
            </p>


            <div className="mt-10 flex flex-wrap gap-4">

              <Link
                href="/login"
                className="rounded-2xl bg-gradient-to-r from-sky-500 to-cyan-400 px-8 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-[0_20px_60px_rgba(14,165,233,0.35)]"
              >
                Empieza ahora
              </Link>


              <a
                href="#metodo"
                className="rounded-2xl border border-slate-700 px-8 py-4 text-lg transition hover:border-sky-500 hover:bg-slate-900"
              >
                Ver demo
              </a>

            </div>

          </div>




          {/* DERECHA */}

          <div className="flex justify-center">

            <div className="w-full max-w-md rounded-[36px] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_40px_100px_rgba(0,0,0,0.45)] overflow-hidden transition-all duration-500 hover:-translate-y-2">


              {/* Header */}

              <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">

                <div>

                  <p className="text-sm text-slate-400">
                    Bienvenido
                  </p>

                  <h3 className="text-xl font-bold">
                    Miguel 👋
                  </h3>

                </div>

                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-sky-500 to-cyan-400"></div>

              </div>




              <div className="p-6 space-y-6">


                {/* Objetivo */}

                <div className="rounded-2xl bg-slate-900 p-5">

                  <p className="text-slate-400 text-sm">
                    Objetivo
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    Hipertrofia
                  </h2>

                </div>




                {/* Métricas */}

                <div className="grid grid-cols-2 gap-4">


                  <div className="rounded-2xl bg-slate-900 p-5">

                    <p className="text-slate-400 text-sm">
                      Entrenos
                    </p>

                    <h2 className="mt-3 text-4xl font-bold">
                      4
                    </h2>

                  </div>




                  <div className="rounded-2xl bg-slate-900 p-5">

                    <p className="text-slate-400 text-sm">
                      Adherencia
                    </p>

                    <h2 className="mt-3 text-4xl font-bold text-green-400">
                      96%
                    </h2>

                  </div>


                </div>
                                {/* Evolución */}

                <div className="rounded-2xl bg-slate-900 p-5">


                  <div className="flex justify-between mb-5">

                    <span className="text-slate-400">
                      Evolución
                    </span>

                    <span className="text-green-400">
                      +12%
                    </span>

                  </div>



                  <div className="flex items-end gap-2 h-36">

                    <div className="w-full h-12 rounded-full bg-sky-500"></div>
                    <div className="w-full h-20 rounded-full bg-sky-500"></div>
                    <div className="w-full h-16 rounded-full bg-sky-500"></div>
                    <div className="w-full h-28 rounded-full bg-sky-500"></div>
                    <div className="w-full h-24 rounded-full bg-cyan-400"></div>
                    <div className="w-full h-32 rounded-full bg-cyan-400"></div>
                    <div className="w-full h-36 rounded-full bg-cyan-400"></div>

                  </div>


                </div>




                {/* Próximo entreno */}

                <div className="rounded-2xl border border-sky-500/30 bg-sky-500/10 p-5">

                  <p className="text-sm text-slate-300">
                    Próximo entrenamiento
                  </p>

                  <h3 className="mt-2 text-xl font-bold">
                    Torso · Hoy · 18:00
                  </h3>

                </div>



              </div>


            </div>


          </div>


        </div>





        {/* IA FISIOLÓGICA - BLOQUE HORIZONTAL */}

        <div
          className="
          mt-12
          rounded-3xl
          border
          border-purple-500/30
          bg-purple-500/10
          backdrop-blur-xl
          p-8
          shadow-[0_30px_80px_rgba(168,85,247,0.15)]
          "
        >


          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">


            <div>


              <div className="flex items-center gap-3">


                <p className="text-purple-300 font-semibold text-lg">
                  🧠 IA · Análisis fisiológico
                </p>


                <span
                  className="
                  rounded-full
                  bg-purple-500/20
                  px-3
                  py-1
                  text-xs
                  text-purple-300
                  "
                >
                  Beta
                </span>


              </div>



              <h3 className="mt-4 text-2xl font-bold">
                Tu recuperación necesita atención
              </h3>



              <p className="mt-2 max-w-3xl text-slate-300 leading-7">
                Detectamos una caída del rendimiento del 8%.
                Analizamos fatiga, entrenamiento, sueño y adherencia
                para ajustar tu próxima fase.
              </p>


            </div>




            <div className="flex gap-3 flex-wrap">


              <span className="
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              ">
                Fatiga ↑
              </span>


              <span className="
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              ">
                Sueño ↓
              </span>


              <span className="
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              ">
                Ajuste recomendado
              </span>


            </div>



          </div>



        </div>



      </div>


    </section>
  );
}
