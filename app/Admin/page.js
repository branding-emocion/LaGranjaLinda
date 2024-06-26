import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

const Home = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>¡Bienvenido al Panel de Control!</CardTitle>
        <CardDescription>Administración del Sitio</CardDescription>
      </CardHeader>
      <CardContent>
        Utiliza el menú de abajo para navegar y editar las diferentes secciones
        de tu sitio.
      </CardContent>
    </Card>
  );
};

export default Home;
