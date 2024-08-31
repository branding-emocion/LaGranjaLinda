"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/firebase/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const ReservasHoy = () => {
  const [Restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    onSnapshot(
      collection(db, `Restaurantes`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setRestaurantes(
          snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
  }, []);
  return (
    <Card className="shadow-md">
      {" "}
      <CardHeader>
        <CardTitle>Selecione un restaurante para ver sus reservas</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3  ">
            {Restaurantes?.map((Restaurante) => (
              <Link
                key={Restaurante.id}
                href={`/Admin/OrdenesMostrador/${Restaurante.id}`}
              >
                <div className="w-full mx-auto border mb-5 border-gray-400 bg-white rounded-lg cursor-pointer shadow-md ">
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
                      <h1 className="text-gray-900 font-bold text-2xl tracking-tight  text-center">
                        {Restaurante?.NombreLocal}
                      </h1>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReservasHoy;
