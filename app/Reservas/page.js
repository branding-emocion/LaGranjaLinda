"use client";
import React, { useEffect, useState } from "react";
import Title from "../Title";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import Image from "next/image";
import ModalReservas from "./ModalReservas";

const Reservas = () => {
  const [OpenModal, setOpenModal] = useState({
    Visible: false,
    InfoRestaurante: {},
  });
  const [Restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    // Crear la query con la condición
    const q = query(
      collection(db, "Restaurantes"),
      where("EstadoRestaurante", "==", "Si")
    );

    // Usar la query en onSnapshot
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setRestaurantes(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    // Limpiar el suscriptor al desmontar el componente
    return () => unsubscribe();
  }, []);

  return (
    <div className="  bg-[#eaeaea]  mb-10">
      {OpenModal.Visible && (
        <ModalReservas OpenModal={OpenModal} setOpenModal={setOpenModal} />
      )}
      <Title title={"Reservas"} image="/One.webp" />

      <div className="container mx-auto ">
        <div className=" flex justify-center items-center  p-1 lg:p-10 gap-x-10">
          <div className=" bg-white p-5 md:p-10 rounded-lg ">
            <div className=" flex flex-col items-center  space-y-7 ">
              <p className="text-justify">
                ¡Bienvenido a nuestro módulo de reservas! Aquí puedes asegurar
                tu mesa en nuestro restaurante de manera rápida y sencilla. Ya
                sea para una cena íntima, una reunión familiar o una ocasión
                especial, estamos encantados de recibirte. Elige la fecha, la
                hora, y el número de comensales, y nosotros nos encargaremos del
                resto. ¡Tu experiencia gastronómica comienza con un solo clic!
              </p>

              <div className="mx-auto grid  w-full h-full  grid-cols-1 gap-6  sm:grid-cols-2 md:grid-cols-3  ">
                {Restaurantes?.map((Restaurante) => (
                  <div
                    onClick={(e) => {
                      e.preventDefault();
                      console.log(e);
                      setOpenModal({
                        Visible: true,
                        InfoRestaurante: Restaurante,
                      });
                    }}
                    key={Restaurante.id}
                    className="w-full mx-auto border mb-5 border-gray-200 bg-white rounded-lg cursor-pointer shadow-md hover:scale-105 transition duration-300 ease-in-out"
                  >
                    <section className="relative w-full h-[205px]">
                      <Image
                        className="rounded-t-lg "
                        fill
                        src={Restaurante?.Imagenes[0] || ""}
                        alt="imageRestaurante"
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    </section>

                    <div className="p-5">
                      <div>
                        <h1 className="text-gray-900 font-bold text-2xl tracking-tight ">
                          {Restaurante?.NombreLocal}
                        </h1>

                        <p className="  text-gray-700">
                          <span className="font-semibold">Dirección: </span>
                          {Restaurante?.Direction || "No disponible"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservas;
