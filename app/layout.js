import { Mohave } from "next/font/google";
import "./globals.css";

import { Toaster } from "@/components/ui/toaster";
import Main from "./Main";

const mohave = Mohave({ subsets: ["latin"] });

export const metadata = {
  title: "La Granja Linda",
  description:
    "Disfruta del mejor pollo a la brasa en Perú en nuestra pollería. Ofrecemos un sabor auténtico y jugoso con una receta tradicional. ¡Ven y prueba nuestro delicioso menú hoy mismo!",
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
