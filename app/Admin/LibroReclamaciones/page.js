"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { db } from "@/firebase/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ModalReclamaciones from "./ModalReclamaciones";

const LibroReclamaciones = () => {
  const [Reclamos, setReclamos] = useState([]);
  const [ModalState, setModalState] = useState({
    Visible: false,
    Reclamo: {},
  });

  useEffect(() => {
    onSnapshot(
      collection(db, `Reclamos`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setReclamos(
          snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
  }, []);

  return (
    <div className="space-y-6">
      {ModalState?.Visible && (
        <ModalReclamaciones
          ReclamoState={ModalState}
          setModalState={setModalState}
        />
      )}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bienvenido al módulo de Reclamaciones </CardTitle>

          <CardDescription>
            En esta sección, puedes ver los reclamos que se han enviado a la
            granja. En rojo se encuentran los reclamos pendientes.
          </CardDescription>
        </CardHeader>
      </Card>
      <ScrollArea className="h-[500px] w-full rounded-md border p-4">
        {Reclamos?.map((item, index) => (
          <Card
            key={item.id || index}
            className={`mb-4 ${
              item.Status == "Pendiente" ? "bg-red-200" : "bg-green-200"
            }`}
          >
            <CardHeader>
              <CardTitle>{item.NombreCompleto}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Celular:</strong> {item.Celular}
                  </p>
                  <p>
                    <strong>Correo Electrónico:</strong>{" "}
                    {item.CorreoElectronico}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {item.Direccion}
                  </p>
                  <p>
                    <strong>Fecha Pedido:</strong> {item.FechaPedido}
                  </p>
                  <p>
                    <strong>Número Documento:</strong> {item.NumeroDocumento}
                  </p>
                  <p>
                    <strong>Número Pedido:</strong> {item.NumeroPedido}
                  </p>
                  <p>
                    <strong>Status:</strong> {item.Status}
                  </p>
                  <p>
                    <strong>Tipo Documento:</strong> {item.TipoDocumento}
                  </p>
                  <p>
                    <strong>Tipo Reclamación:</strong> {item.TipoReclamacion}
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Información del Restaurante
                  </h4>
                  <p>
                    <strong>Nombre Local:</strong>{" "}
                    {item.InfoRestaurante.NombreLocal}
                  </p>
                  <p>
                    <strong>Dirección:</strong> {item.InfoRestaurante.Direction}
                  </p>
                  <p>
                    <strong>Razón Social:</strong>{" "}
                    {item.InfoRestaurante.RazonSocial}
                  </p>
                  <p>
                    <strong>RUC:</strong> {item.InfoRestaurante.Ruc}
                  </p>
                  <p>
                    <strong>Horario:</strong> {item.InfoRestaurante.HoraInicio}{" "}
                    - {item.InfoRestaurante.HoraFin}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Detalles</h4>
                <p>{item.Detalles}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {item.PedidoReclamente && (
                  <div className="mt-4">
                    <h4 className="font-semibold mb-2">Pedido Reclamente</h4>
                    <p>{item.PedidoReclamente}</p>
                  </div>
                )}
                <div>
                  <h4 className="font-semibold mb-2">Comentario</h4>
                  <p>{item.Comentario}</p>
                </div>
              </div>

              {item.Status == "Pendiente" && (
                <div className="mt-4">
                  <Button
                    onClick={(e) => {
                      e.preventDefault();
                      if (confirm("¿Estás seguro de resolver el reclamo?")) {
                        setModalState({
                          Visible: true,
                          Reclamo: item,
                        });
                      }
                    }}
                  >
                    {item?.Status != "Pendiente"
                      ? "Reclamo Resuelto"
                      : "Resolver Reclamo"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </ScrollArea>
    </div>
  );
};

export default LibroReclamaciones;
