"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import React, { useState } from "react";

const ReporteVentas = dynamic(() => import("./ReporteVentas"), {
  ssr: false,
});
const ReporteClientes = dynamic(() => import("./ReporteClientes"), {
  ssr: false,
});

const Reportes = () => {
  const [TipoReporte, setTipoReporte] = useState({});

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bienvenido al módulo de Reportes</CardTitle>

          <CardDescription>
            En esta sección, puedes ver los reportes.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-md ">
        <CardHeader>
          <div className="space-x-3">
            <Button
              onClick={(e) => {
                e.preventDefault();
                setTipoReporte("ventas");
              }}
            >
              Reporte de ventas
            </Button>
            <Button
              onClick={(e) => {
                e.preventDefault();
                setTipoReporte("Clientes");
              }}
            >
              Reporte Clientes
            </Button>
          </div>
        </CardHeader>
        <CardContent className=" ">
          {(TipoReporte === "ventas" && <ReporteVentas />) ||
            (TipoReporte === "Clientes" && <ReporteClientes />)}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reportes;
