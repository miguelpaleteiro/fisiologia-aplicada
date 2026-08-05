export default function Services() {
  return (
    <section
      id="servicios"
      className="bg-slate-950 text-white py-32 px-8"
    >
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-20">

          <span className="text-sky-400 uppercase tracking-[0.3em] font-semibold">
            EL MÉTODO
          </span>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mt-5 mb-6">
            Un método basado en fisiología
          </h2>

          <p className="max-w-3xl mx-auto text-slate-400 text-lg md:text-xl leading-9">
            No seguimos modas. Cada decisión está basada en evidencia
            científica para optimizar tu entrenamiento, nutrición y
            recuperación.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          {/* Card */}

          <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-8 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-sky-500 hover:shadow-[0_25px_70px_rgba(14,165,233,0.18)]">

            <div className="text-6xl mb-8 transition-transform duration-500 group-hover:scale-110">
              🏋🏻
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Entrenamiento
            </h3>

            <p className="text-slate-400 leading-8">
              Planificación individualizada basada en fisiología del
              ejercicio, progresión y adaptación al entrenamiento.
            </p>

          </div>

          {/* Card */}

          <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-8 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-sky-500 hover:shadow-[0_25px_70px_rgba(14,165,233,0.18)]">

            <div className="text-6xl mb-8 transition-transform duration-500 group-hover:scale-110">
              🥗
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Nutrición
            </h3>

            <p className="text-slate-400 leading-8">
              Estrategias nutricionales enfocadas en rendimiento,
              salud y composición corporal sin dietas extremas.
            </p>

          </div>

          {/* Card */}

          <div className="group rounded-3xl border border-slate-800 bg-slate-900 p-8 transition-all duration-500 hover:-translate-y-3 hover:scale-[1.02] hover:border-sky-500 hover:shadow-[0_25px_70px_rgba(14,165,233,0.18)]">

            <div className="text-6xl mb-8 transition-transform duration-500 group-hover:scale-110">
              🧬
            </div>

            <h3 className="text-2xl font-bold mb-4">
              Educación científica
            </h3>

            <p className="text-slate-400 leading-8">
              Comprende cómo funciona tu cuerpo para tomar mejores
              decisiones y dejar atrás los mitos del fitness.
            </p>

          </div>

        </div>

      </div>
    </section>
  );
}