"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/firebase/firebaseClient";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { BadgePlus, CircleCheckBig, XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const ShowReservas = ({ params: { idRestaurante } }) => {
  const [Reservas, setReservas] = useState([]);
  console.log("Reservas", Reservas);

  useEffect(() => {
    if (idRestaurante) {
      const qReservas = query(
        collection(db, "Reservas"),
        where("Restaurante", "==", idRestaurante),
        where("Estado", "in", ["Pendiente", "Rechazado"]), // Filtrar por estado pendiente o rechazado
        orderBy("FechaReserva", "desc")
      );

      const unsubscribe = onSnapshot(qReservas, (snapshot) => {
        setReservas(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

      return () => unsubscribe(); // Cleanup subscription on unmount
    }
  }, [idRestaurante]);

  return (
    <>
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              Bienvenido al módulo para aceptar las reservas
            </CardTitle>

            <CardDescription>
              En esta sección, puedes aceptar o rechazar las reservas .
            </CardDescription>
            <div>
              {/* <Button
                onClick={(e) => {
                  e.preventDefault();
                  console.log(e);
                  setOpenModal({
                    Visible: true,
                    InfoEditar: {},
                  });
                }}
                className="space-x-2"
              >
                <BadgePlus />
                <p>Agregar nuevo </p>
              </Button> */}
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Lista de Reservas pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3  ">
              {Reservas?.map((reserva) => (
                <div
                  key={reserva.id}
                  className={`w-full mx-auto border mb-5 border-gray-200  ${
                    reserva.Estado == "Rechazado" ? "bg-red-200" : "bg-sky-50"
                  } rounded-lg cursor-pointer shadow-lg `}
                >
                  <div className="p-5">
                    <div>
                      <h1 className="text-gray-900 font-bold text-2xl tracking-tight text-center capitalize ">
                        {reserva?.NombreCompleto}
                      </h1>
                      <h2 className="capitalize text-gray-800 font-semibold text-lg">
                        Reserva:{" "}
                        <span className="font-normal">
                          {/* Date Firebase fecha y hora */}
                          {new Date(
                            reserva.FechaReserva?.toDate()
                          ).toLocaleDateString()}{" "}
                          {new Date(
                            reserva.FechaReserva?.toDate()
                          ).toLocaleTimeString()}
                        </span>
                      </h2>
                      <p className=" capitalize text-gray-800">
                        <span className="font-semibold">Motivo: </span>
                        {reserva?.MotivoReserva || reserva?.OtroMotivo || "N/A"}
                      </p>
                      <h2 className="capitalize text-gray-800 font-semibold">
                        Fecha de creación:{" "}
                        <span className="font-normal">
                          {/* Date Firebase */}
                          {new Date(
                            reserva.createdAt?.toDate()
                          ).toLocaleDateString()}{" "}
                          {new Date(
                            reserva.createdAt?.toDate()
                          ).toLocaleTimeString()}
                        </span>
                      </h2>
                      <p className=" capitalize text-gray-800">
                        <span className="font-semibold">N° Personas: </span>
                        {reserva?.CantPersonas}
                      </p>
                      <p className=" capitalize text-gray-800">
                        <span className="font-semibold">Mail: </span>
                        <a href={`${reserva.Correo}`}>{reserva.Correo}</a>
                      </p>
                      <p className=" capitalize text-gray-800">
                        <span className="font-semibold">Celular: </span>
                        <a href={`tel:+${reserva.NumeroCelular}`}>
                          {reserva.NumeroCelular}
                        </a>
                      </p>
                      <p className="w-full max-h-52 overflow-auto">
                        {reserva.Comentario}
                      </p>
                    </div>
                  </div>
                  {reserva.Estado == "Rechazado" ? (
                    <>
                      <p className=" text-center font-medium ">
                        {" "}
                        Motivo de rechazo: {reserva?.MotivoRechazo}
                      </p>
                    </>
                  ) : (
                    <>
                      {" "}
                      <div className="flex items-center justify-center gap-x-2 pb-2">
                        <button
                          onClick={async (e) => {
                            e.preventDefault();

                            // Actualizar el estado de la reserva
                            if (
                              confirm("¿Estás seguro de confirmar la reserva?")
                            ) {
                              await updateDoc(
                                doc(db, "Reservas", `${reserva.id}`),
                                {
                                  Estado: "Confirmado",
                                }
                              );
                            }
                          }}
                          className="bg-blue-500 space-x-1.5 rounded-lg  px-4 py-1.5 text-white duration-100 hover:bg-blue-600"
                        >
                          <CircleCheckBig className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();

                            // Confirmar si el usuario quiere rechazar la reserva
                            if (
                              confirm("¿Estás seguro de rechazar la reserva?")
                            ) {
                              // Pedir el motivo de rechazo
                              const motivoRechazo = prompt(
                                "Por favor, ingresa el motivo del rechazo:"
                              );

                              // Validar que el motivo de rechazo no sea vacío
                              if (
                                !motivoRechazo ||
                                motivoRechazo.trim() === ""
                              ) {
                                alert(
                                  "Debes ingresar un motivo para rechazar la reserva."
                                );
                                return;
                              }

                              if (motivoRechazo) {
                                // Actualizar el estado de la reserva y agregar el motivo de rechazo
                                await updateDoc(
                                  doc(db, "Reservas", `${reserva.id}`),
                                  {
                                    Estado: "Rechazado",
                                    MotivoRechazo: motivoRechazo,
                                  }
                                );
                              } else {
                                alert(
                                  "Debes ingresar un motivo para rechazar la reserva."
                                );
                              }
                            }
                          }}
                          className="bg-red-500 space-x-1.5 rounded-lg px-4 py-1.5 text-white duration-100 hover:bg-red-600"
                        >
                          <XIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ShowReservas;
