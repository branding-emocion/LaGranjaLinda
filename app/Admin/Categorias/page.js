"use client";
import React, { useEffect, useState } from "react";
import ModalCategorias from "./ModalCategorias";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePlus, PencilIcon, TrashIcon } from "lucide-react";
import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseClient";
import { deleteObject, listAll, ref } from "firebase/storage";
import Image from "next/image";

const Categorias = () => {
  const [OpenModal, setOpenModal] = useState({
    Visible: false,
    InfoEditar: {},
  });

  const [Categorias, setCategorias] = useState([]);

  useEffect(() => {
    onSnapshot(
      collection(db, `Categorias`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setCategorias(
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
        <ModalCategorias OpenModal={OpenModal} setOpenModal={setOpenModal} />
      )}
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Bienvenido al módulo de Categorias</CardTitle>

            <CardDescription>
              En esta sección, puedes ver y modificar los Categorias .
            </CardDescription>
            <div>
              <Button
                title="Agregar nueva Categoria"
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
                <p>Agregar nueva </p>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Lista de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-4  ">
                {Categorias?.map((Categoria) => (
                  <div
                    key={Categoria.id}
                    className="w-full mx-auto border mb-5 border-gray-200 bg-white rounded-lg  shadow-md "
                  >
                    {Categoria?.Imagenes?.length > 0 && (
                      <section className="relative w-full h-[200px]">
                        <Image
                          className="rounded-t-lg "
                          fill
                          src={Categoria?.Imagenes[0] || ""}
                          alt="imageCategoria"
                          style={{
                            objectFit: "cover",
                          }}
                        />
                      </section>
                    )}

                    <div className="p-5">
                      <div>
                        <h1 className="text-gray-900 font-bold uppercase text-center text-2xl tracking-tight ">
                          {Categoria?.NombreCategoria}
                        </h1>
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-x-2 pb-2">
                      <button
                        title="Editar Categoria"
                        onClick={(e) => {
                          e.preventDefault();
                          setOpenModal({
                            Visible: true,
                            InfoEditar: Categoria,
                          });
                        }}
                        className="bg-blue-500 space-x-1.5 rounded-lg  px-4 py-1.5 text-white duration-100 hover:bg-blue-600"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        title="Eliminar Categoria"
                        onClick={async (e) => {
                          e.preventDefault();

                          const Confirm = confirm(
                            `Esta Seguro de eliminar el Categoria: ${Categoria.NombreLocal}`
                          );
                          if (Confirm) {
                            const ImgRef = ref(
                              storage,
                              `Categorias/${Categoria?.NombreLocal?.replace(
                                /\s+/g,
                                "_"
                              )}/`
                            );

                            await deleteDoc(
                              doc(db, "Categorias", `${Categoria.id}`)
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
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Categorias;
