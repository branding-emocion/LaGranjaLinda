"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import LoadingSearch from "./search/loading";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";

const Delivery = () => {
  const [Categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onSnapshot(
      collection(db, `Categorias`),
      // orderBy("email", "asc"),
      (snapshot) => {
        setCategorias(
          snapshot?.docs
            ?.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => a.Order - b.Order)
        );
        setLoading(false);
      }
    );
  }, []);

  return (
    <div className="mb-10 bg-[#ece4d9]">
      <div className="container mx-auto p-4 ">
        <div className="space-y-3 pb-3">
          <div className="flex-grow border-2 border-t border-black" />
          <h1 className=" text-center text-3xl ">NUESTRA CARTA</h1>
          <div className="flex-grow border-2 border-t border-black" />
          <p className="text-center max-w-sm mx-auto text-xl">
            Buscamos darte ese deleite a través de nuestra diferentes
            especialidades.
          </p>
        </div>
        {loading ? (
          <LoadingSearch />
        ) : (
          Categorias?.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {Categorias?.map((categoria) => (
                  <Link
                    href={{
                      pathname: "/Delivery/search",
                      query: {
                        q: categoria.id,
                        name: categoria.NombreCategoria,
                      },
                    }}
                    key={categoria.id}
                    className="relative mx-auto  shadow-md rounded-lg cursor-pointer"
                  >
                    {/* <img
                  
                      className="max-w-[426px] h-[285px] object-cover rounded-lg"
                    /> */}
                    {categoria?.Imagenes?.length > 0 && (
                      <Image
                        width={426}
                        height={285}
                        className="rounded-lg"
                        src={categoria?.Imagenes[0] || ""}
                        alt={categoria?.Nombre}
                        style={{
                          objectFit: "cover",
                        }}
                      />
                    )}

                    <div className="absolute bottom-0 left-0 right-0 h-16 bg-black bg-opacity-50 backdrop-blur text-white p-4 rounded-b-lg">
                      <h1 className="text-2xl font-semibold uppercase">
                        {categoria.NombreCategoria}
                      </h1>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Delivery;
