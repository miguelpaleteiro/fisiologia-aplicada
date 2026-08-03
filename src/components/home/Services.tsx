export default function Services() {
  return (
    <section className="p-8">

      <h2 className="text-3xl font-bold mb-6 text-center">
        Un método basado en fisiología
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">
            Entrenamiento
          </h3>
          <p>
            Planificación del ejercicio adaptada a tu objetivo,
            nivel y disponibilidad.
          </p>
        </div>


        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">
            Nutrición
          </h3>
          <p>
            Estrategias nutricionales para mejorar composición
            corporal y rendimiento.
          </p>
        </div>


        <div className="border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-2">
            Educación científica
          </h3>
          <p>
            Entiende cómo funciona tu cuerpo para tomar mejores
            decisiones.
          </p>
        </div>

      </div>

    </section>
  );
}