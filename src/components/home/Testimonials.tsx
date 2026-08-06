export default function Testimonials() {
  return (
    <section className="bg-slate-950 text-white py-32 px-8">

      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-20">

          <span className="uppercase tracking-[0.25em] text-sky-400 font-semibold">
            RESULTADOS REALES
          </span>

          <h2 className="text-5xl font-bold mt-5">
            Personas que ya han cambiado
          </h2>

          <p className="text-slate-400 text-xl mt-6 max-w-2xl mx-auto">
            El objetivo no es entrenar más. Es entrenar mejor y mantener los resultados.
          </p>

        </div>

        <div className="grid md:grid-cols-3 gap-8">

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-sky-500 transition">

            <div className="text-5xl mb-6">💪</div>

            <h3 className="text-2xl font-bold mb-4">
              -8 kg
            </h3>

            <p className="text-slate-400 leading-8">
              &ldquo;Aprendí por qué hacía cada cosa. No seguía una dieta,
              entendía cómo funcionaba mi cuerpo.&rdquo;
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-sky-500 transition">

            <div className="text-5xl mb-6">🏃</div>

            <h3 className="text-2xl font-bold mb-4">
              +22% rendimiento
            </h3>

            <p className="text-slate-400 leading-8">
              &ldquo;Nunca había tenido un seguimiento tan personalizado.
              Todo tenía una explicación.&rdquo;
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 hover:border-sky-500 transition">

            <div className="text-5xl mb-6">🧬</div>

            <h3 className="text-2xl font-bold mb-4">
              Más conocimiento
            </h3>

            <p className="text-slate-400 leading-8">
              &ldquo;Ahora sé interpretar mi progreso y ya no dependo de los
              mitos que veía en redes.&rdquo;
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}
