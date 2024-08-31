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
import {
  BadgePlus,
  CircleHelpIcon,
  PencilIcon,
  Sparkle,
  TrashIcon,
} from "lucide-react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseClient";
import { deleteObject, listAll, ref } from "firebase/storage";
import Link from "next/link";
import Image from "next/image";
import ModalPreguntas from "./ModalPreguntas";
import ModalAdicionales from "./ModalAdicionales";

const Productos = () => {
  const [OpenModal, setOpenModal] = useState({
    Visible: false,
    InfoEditar: {},
  });
  const [ModalQuestion, setModalQuestion] = useState({
    Visible: false,
    Producto: {},
  });

  const [ModalAditional, setModalAditional] = useState({
    Visible: false,
    Producto: {},
    ProductosAdiconales: [],
  });

  const [Productos, setProductos] = useState([]);
  const [Categorias, setCategorias] = useState([]);
  const [FilterByCategoria, setFilterByCategoria] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    onSnapshot(
      collection(db, `Productos`),
      // orderBy("email", "asc"),
      (snapshot) => {
        const data = snapshot?.docs?.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(data);
        setFilteredItems(data);
      }
    );
    onSnapshot(
      collection(db, `Categorias`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setCategorias(
          snapshot?.docs
            ?.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => a.Order - b.Order)
        )
    );
  }, []);

  useEffect(() => {
    if (FilterByCategoria == "Todos") {
      setFilteredItems(Productos);
    } else {
      const filteredItems = Productos.reduce((acc, item) => {
        if (FilterByCategoria == "Adicionales") {
          if (item.esAdicional == "Si") {
            acc.push(item);
          }
        } else {
          const Categoria =
            !FilterByCategoria || item.Categoria == FilterByCategoria;

          if (Categoria) {
            acc.push(item);
          }
        }
        return acc;
      }, []);

      setFilteredItems(filteredItems);
    }
  }, [FilterByCategoria, Productos]);

  return (
    <>
      {ModalQuestion?.Visible && (
        <ModalPreguntas
          ModalQuestion={ModalQuestion}
          setModalQuestion={setModalQuestion}
        />
      )}
      {ModalAditional?.Visible && (
        <ModalAdicionales
          ModalAditional={ModalAditional}
          setModalAditional={setModalAditional}
        />
      )}
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
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setFilterByCategoria("Todos");
                }}
                className="capitalize"
              >
                Todos
              </Button>
              {Categorias?.map((Categoria) => (
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    setFilterByCategoria(Categoria.id);
                  }}
                  key={Categoria.id}
                  className="capitalize"
                >
                  {Categoria.NombreCategoria}
                </Button>
              ))}
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  setFilterByCategoria("Adicionales");
                }}
                className="capitalize"
              >
                Adicionales
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Lista de Productos</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <div className="mx-auto grid  container  grid-cols-1 gap-5  md:grid-cols-2 lg:grid-cols-3  ">
                {filteredItems
                  ?.sort((a, b) => a.Order - b.Order)
                  .map((producto) => (
                    <div
                      key={producto.id}
                      className={`w-full h-full mx-auto shadow-md border  ${
                        producto?.Disponibilidad == "Si"
                          ? "bg-green-200 border-green-500 "
                          : (producto.Disponibilidad == "No" &&
                              "bg-red-200 border-red-500 ") ||
                            "bg-white"
                      }  border-gray-200 rounded-lg`}
                    >
                      <div className="">
                        <section className="relative w-full h-[200px]">
                          <Image
                            className="rounded-t-lg "
                            fill
                            src={producto?.Imagenes[0] || ""}
                            alt={`Imagen de ${producto?.NombreProducto}`}
                            style={{
                              objectFit: "cover",
                            }}
                          />
                        </section>

                        <div className="py-2  px-5">
                          <div className="space-y-1">
                            <h1 className="text-gray-900 font-bold uppercase text-center text-2xl tracking-tight ">
                              {producto?.NombreProducto}
                            </h1>
                            <h1 className="capitalize">
                              <span className="font-semibold">Categoria: </span>
                              {Categorias.find(
                                (categoria) =>
                                  producto.Categoria == categoria.id
                              )?.NombreCategoria || "Sin Categoria"}
                            </h1>
                            <p className="line-clamp-3">
                              {producto.Descripcion}
                            </p>

                            {/* Precio */}

                            <p className="text-3xl m-0 font-normal text-end ">
                              S/ {producto?.Precio || 0}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-center gap-x-2 pb-2">
                          {producto?.esAdicional == "No" && (
                            <>
                              <button
                                title="Agregar Adicionales"
                                onClick={(e) => {
                                  e.preventDefault();
                                  setModalAditional({
                                    Visible: true,
                                    Producto: producto,
                                    ProductosAdiconales:
                                      Productos.filter(
                                        (item) => item.esAdicional == "Si"
                                      ) || [],
                                    Producto: producto,
                                  });
                                }}
                                className="bg-violet-600 space-x-1.5 rounded-lg  px-4 py-1.5 text-white duration-100 hover:bg-violet-600"
                              >
                                <Sparkle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              setModalQuestion({
                                Visible: true,
                                Producto: producto,
                              });
                            }}
                            title="Preguntas adicionales"
                            className="bg-orange-500 space-x-1.5 rounded-lg  px-4 py-1.5 text-white duration-100 hover:bg-orange-600"
                          >
                            <CircleHelpIcon className="w-4 h-4" />
                          </button>
                          <button
                            title={"Editar producto"}
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
                            title="Eliminar producto"
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
