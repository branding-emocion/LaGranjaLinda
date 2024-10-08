"use client";
import React, { useEffect, useState } from "react";
import ModalRestaurantes from "./ModalRestaurantes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BadgePlus,
  DeleteIcon,
  Edit2Icon,
  Locate,
  LocateIcon,
  PackageCheck,
  PencilIcon,
  TrashIcon,
} from "lucide-react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseClient";
import { deleteObject, listAll, ref } from "firebase/storage";
import Image from "next/image";
import Link from "next/link";
import ModalDistrito from "./ModalDistrito";

const Restaurantes = () => {
  const [OpenModal, setOpenModal] = useState({
    Visible: false,
    InfoEditar: {},
  });
  const [OpenModalDistrito, setOpenModalDistrito] = useState({
    Visible: false,
    InfoEditar: {},
  });

  const [Restaurantes, setRestaurantes] = useState([]);
  const [Distrito, setDistrito] = useState([]);

  console.log("Distrito", Distrito);

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
    onSnapshot(
      collection(db, `Distritos`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setDistrito(
          snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
  }, []);
  return (
    <>
      {OpenModal.Visible && (
        <ModalRestaurantes
          OpenModal={OpenModal}
          setOpenModal={setOpenModal}
          Distrito={Distrito}
        />
      )}
      {OpenModalDistrito.Visible && (
        <ModalDistrito
          OpenModalDistrito={OpenModalDistrito}
          setOpenModalDistrito={setOpenModalDistrito}
        />
      )}
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Bienvenido al módulo de Restaurantes</CardTitle>

            <CardDescription>
              En esta sección, puedes ver y modificar los restaurantes .
            </CardDescription>
            <div className="flex gap-x-2 ">
              <Button
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
                <p>Agregar nuevo restaurante </p>
              </Button>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setOpenModalDistrito({
                    Visible: true,
                    InfoEditar: {},
                  });
                }}
                className="space-x-2"
              >
                <Locate />
                <p>Agregar Distrito</p>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Lista de Distritos y Restaurantes </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2 justify-center items-center">
              {Distrito?.map((distrito) => (
                <div key={distrito.id} className="">
                  <div className=" p-2 w-full h-full border rounded-lg mx-auto  flex justify-center items-center flex-col ">
                    <h1 className="uppercase">{distrito?.NombreDistrito}</h1>
                    <div className="  space-x-1.5 rounded-lg  px-4 py-1.5  duration-100 w-full h-full mx-auto flex justify-center items-center   ">
                      <Link
                        href={{
                          pathname: `/Admin/Restaurantes/Delyvery/${distrito.id}`,
                          query: {
                            name: distrito.NombreDistrito,
                          },
                        }}
                      >
                        <Button
                          title="Agregar direcciones"
                          className="bg-blue-500 text-white"
                        >
                          <PackageCheck className="w-4 h-4 mx-auto" />
                        </Button>
                      </Link>
                      <Button
                        title="Editar Distrito"
                        className="bg-yellow-700 text-white"
                        onClick={(e) => {
                          e.preventDefault();

                          setOpenModalDistrito({
                            Visible: true,
                            InfoEditar: distrito,
                          });
                        }}
                      >
                        <Edit2Icon className=" text-white w-4 h-4" />
                      </Button>
                      <Button
                        onClick={async (e) => {
                          e.preventDefault();
                          const Confirm = confirm(
                            `Esta Seguro de eliminar el Distrito: ${distrito.NombreDistrito}`
                          );
                          if (Confirm) {
                            await deleteDoc(
                              doc(db, "Distritos", `${distrito.id}`)
                            );
                          }
                        }}
                        title="Agregar direcciones"
                        className="bg-red-500 text-white"
                      >
                        <DeleteIcon className="w-4 h-4 mx-auto" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3  ">
              {Restaurantes?.map((Restaurante) => (
                <div
                  key={Restaurante.id}
                  className={`w-full mx-auto border mb-5  ${
                    Restaurante?.EstadoRestaurante == "Si"
                      ? "bg-green-200 border-green-500"
                      : (Restaurante?.EstadoRestaurante == "No" &&
                          "bg-red-200 border-red-500") ||
                        "bg-white border-gray-200"
                  } rounded-lg cursor-pointer shadow-md `}
                >
                  {Restaurante?.Imagenes?.length && (
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
                  )}

                  <div className="p-5">
                    <div>
                      <h1 className="text-gray-900 font-bold text-2xl tracking-tight ">
                        {Restaurante?.NombreLocal}
                      </h1>

                      <p className=" capitalize text-gray-700">
                        <span className="font-semibold">Razón Social: </span>
                        {Restaurante?.RazonSocial}
                      </p>
                      <p className=" capitalize text-gray-700">
                        <span className="font-semibold">RUC: </span>
                        {Restaurante?.Ruc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-center gap-x-2 pb-2">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        setOpenModal({
                          Visible: true,
                          InfoEditar: Restaurante,
                        });
                      }}
                      title="Editar"
                      className="bg-blue-500 space-x-1.5 rounded-lg  px-4 py-1.5 text-white duration-100 hover:bg-blue-600"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      title="Eliminar"
                      onClick={async (e) => {
                        e.preventDefault();

                        const Confirm = confirm(
                          `Esta Seguro de eliminar el Restaurante: ${Restaurante.NombreLocal}`
                        );
                        if (Confirm) {
                          const ImgRef = ref(
                            storage,
                            `Restaurantes/${Restaurante?.NombreLocal?.replace(
                              /\s+/g,
                              "_"
                            )}/`
                          );

                          await deleteDoc(
                            doc(db, "Restaurantes", `${Restaurante.id}`)
                          );

                          // Lista todos los objetos (archivos) en el directorio
                          listAll(ImgRef)
                            .then((res) => {
                              res.items.forEach((itemRef) => {
                                // Ahora debes borrar cada objeto (archivo)
                                deleteObject(itemRef).catch((error) => {
                                  // Maneja cualquier error
                                  alert(
                                    ` Error al eliminar ${itemRef.fullPath}`
                                  );
                                  console.log(
                                    `Error al eliminar ${itemRef.fullPath}`,
                                    error
                                  );
                                });
                              });
                            })
                            .catch((error) => {
                              // Maneja cualquier error
                              console.error(
                                "Error al listar los objetos",
                                error
                              );
                            });
                        }
                      }}
                      className="bg-red-500 space-x-1.5 rounded-lg  px-4 py-1.5 text-white duration-100 hover:bg-red-600"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
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

export default Restaurantes;
