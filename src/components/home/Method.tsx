export default function Method() {
  return (
    <section className="p-8">
      <h2 className="text-3xl font-bold mb-6 text-center">
        Cómo funciona el método
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">1. Evaluación</h3>
          <p>
            Analizamos tu situación inicial, objetivos, hábitos y nivel de
            entrenamiento.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">2. Aplicación</h3>
          <p>
            Diseñamos entrenamiento y nutrición adaptados a tu fisiología.
          </p>
        </div>

        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">3. Progreso</h3>
          <p>
            Medimos resultados y ajustamos el plan según tu evolución.
          </p>
        </div>
      </div>
    </section>
  );
}