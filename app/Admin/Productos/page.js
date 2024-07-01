"use client";
import React, { useEffect, useState } from "react";
import ModalProductos from "./ModalProductos";
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

const Productos = () => {
  const [OpenModal, setOpenModal] = useState({
    Visible: false,
    InfoEditar: {},
  });

  const [Productos, setProductos] = useState([]);
  const [Categorias, setCategorias] = useState([]);

  useEffect(() => {
    onSnapshot(
      collection(db, `Productos`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setProductos(
          snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
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
        <ModalProductos
          OpenModal={OpenModal}
          setOpenModal={setOpenModal}
          Categorias={Categorias}
        />
      )}
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Bienvenido al módulo de Productos</CardTitle>

            <CardDescription>
              En esta sección, puedes ver y modificar los Productos .
            </CardDescription>
            <div>
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
                <p>Agregar nuevo </p>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Lista de Categorias</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-4 gap-2">
              {Categorias?.map((Categoria) => (
                <Button key={Categoria.id} className="capitalize">
                  {Categoria.NombreCategoria}
                </Button>
              ))}
              <Button className="capitalize">Adicionales</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Lista de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3  ">
                {Productos?.map((producto) => (
                  <div
                    key={producto.id}
                    className="max-w-lg mx-auto cursor-pointer"
                  >
                    <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                      <img
                        className="rounded-t-lg"
                        src={producto?.Imagenes[0] || ""}
                        alt="imageproducto"
                      />

                      <div className="p-5">
                        <div>
                          <h1 className="text-gray-900 font-bold uppercase text-center text-2xl tracking-tight ">
                            {producto?.NombreProducto}
                          </h1>
                          <p className="line-clamp-3">{producto.Descripcion}</p>
                        </div>
                      </div>

                      <div className="flex items-center justify-center gap-x-2 pb-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setOpenModal({
                              Visible: true,
                              InfoEditar: producto,
                            });
                          }}
                          className="bg-blue-500 space-x-1.5 rounded-lg  px-4 py-1.5 text-white duration-100 hover:bg-blue-600"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async (e) => {
                            e.preventDefault();

                            const Confirm = confirm(
                              `Esta Seguro de eliminar el producto: ${producto.NombreProducto}`
                            );
                            if (Confirm) {
                              const ImgRef = ref(
                                storage,
                                `Productos/${producto?.NombreProducto?.replace(
                                  /\s+/g,
                                  "_"
                                )}/`
                              );

                              await deleteDoc(
                                doc(db, "Productos", `${producto.id}`)
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

export default Productos;
