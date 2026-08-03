import "./globals.css";

export const metadata = {
  title: "Fisiología Aplicada",
  description: "Entrenamiento, nutrición y rendimiento basado en evidencia",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}