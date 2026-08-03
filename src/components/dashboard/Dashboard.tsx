export default function Dashboard() {
  return (
    <section className="p-8">
      <h2 className="text-2xl font-bold mb-6">
        Dashboard
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="border rounded-xl p-6">
          <p className="text-sm">
            Peso
          </p>
          <strong className="text-3xl">
            73 kg
          </strong>
        </div>


        <div className="border rounded-xl p-6">
          <p className="text-sm">
            Adherencia
          </p>
          <strong className="text-3xl">
            92%
          </strong>
        </div>


        <div className="border rounded-xl p-6">
          <p className="text-sm">
            Entrenamientos esta semana
          </p>
          <strong className="text-3xl">
            4
          </strong>
        </div>

      </div>
    </section>
  );
}