"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/firebaseClient";
import {
  Timestamp,
  collection,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";

import { DateRange } from "react-date-range";
// import { es } from "date-fns/locale";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { es } from "date-fns/locale";

const OrdenesRestaurante = ({ params: { idRestaurante } }) => {
  const [Reservas, setReservas] = useState([]);
  const [SearchReservas, setSearchReservas] = useState([]);
  const [RangesData, setRangesData] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  useEffect(() => {
    if (idRestaurante) {
      const qReservas = query(
        collection(db, "Reservas"),
        where("Restaurante", "==", idRestaurante),
        where("Estado", "==", "Confirmado"),
        where("FechaReserva", ">=", RangesData.startDate),
        where("FechaReserva", "<=", RangesData.endDate)
      );

      const unsubscribe = onSnapshot(qReservas, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        console.log("data", data);

        setReservas(data);
        setSearchReservas(data);
      });

      return () => unsubscribe();
    }
  }, [idRestaurante, RangesData.endDate, RangesData.startDate]);

  const HandlerFecha = (ranges) => {
    setRangesData({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  const selectionRange = {
    startDate: RangesData?.startDate,
    endDate: RangesData?.endDate,
    key: "selection",
  };

  return (
    <>
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              Bienvenido al módulo para ver las reservas aceptadas
            </CardTitle>

            <CardDescription>
              En esta sección, puedes visualizar las reservas aceptadas .
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Lista de Reservas para hoy</CardTitle>

            <div></div>
            <div className="w-full h-full mx-auto flex justify-center items-center bg-gray-50"></div>

            {/* Vamos a agregar un buscador de reservas por nombre */}

            <div className="flex justify-center">
              <Input
                onChange={(e) => {
                  const value = e.target.value;
                  // Agregla el filter y quita espacios en blanco al realizar la busqueda
                  if (value.trim() === "") {
                    setSearchReservas(Reservas);
                  } else {
                    const filterReservas = Reservas.filter((reserva) =>
                      reserva.NombreCompleto.toLowerCase().includes(
                        value.toLowerCase().trim()
                      )
                    );

                    setSearchReservas(filterReservas);
                  }
                }}
                type="text"
                placeholder="Buscar por nombre ..."
                autoFocus
              />
            </div>
          </CardHeader>
          <CardContent>
            <div className="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3  ">
              {SearchReservas?.map((reserva) => (
                <div
                  key={reserva.id}
                  className="w-full bg-sky-50 hover:scale-105 mx-auto border mb-5 border-gray-200  rounded-lg cursor-pointer shadow-lg "
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
                        {reserva?.MotivoReserva}
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

                      <p className=" capitalize text-gray-700">
                        <span className="font-semibold">N° Personas: </span>
                        {reserva?.CantPersonas}
                      </p>
                      <p className=" capitalize text-gray-700">
                        <span className="font-semibold">Mail: </span>
                        <a href={`${reserva.Correo}`}>{reserva.Correo}</a>
                      </p>
                      <p className=" capitalize text-gray-700">
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
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default OrdenesRestaurante;
