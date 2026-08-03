export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 border-b">
      <h1 className="text-xl font-bold">
        Fisiología Aplicada
      </h1>

      <div className="flex gap-6 text-sm">
        <span className="cursor-pointer">
          Dashboard
        </span>

        <span className="cursor-pointer">
          Entrenamiento
        </span>

        <span className="cursor-pointer">
          Nutrición
        </span>

        <span className="cursor-pointer">
          Progreso
        </span>
      </div>
    </nav>
  );
}