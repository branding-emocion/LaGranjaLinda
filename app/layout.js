import { Mohave } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import Main from "./Main";

const mohave = Mohave({ subsets: ["latin"] });

export const metadata = {
  title: "La Granja Linda",
  description:
    "Global Executive Training (GET) ofrece programas y entrenamientos diseñados para potenciar habilidades de gestión, liderazgo y emprendimiento. Únete a GET para acceder a oportunidades únicas de desarrollo profesional y personal hoy mismo.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={mohave.className}>
        <Main>{children}</Main>

        <Toaster />
      </body>
    </html>
  );
}
