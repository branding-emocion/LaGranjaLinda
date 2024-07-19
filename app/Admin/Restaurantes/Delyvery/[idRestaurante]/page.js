"use client";
import React, { useEffect, useState } from "react";
import ModalDireccion from "./ModalDireccion.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BadgePlus, MoreHorizontal } from "lucide-react";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import DataTable from "@/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Delyvery = ({ params: { idRestaurante }, searchParams: { name } }) => {
  const [OpenModal, setOpenModal] = useState({});
  const [Direcciones, setDirecciones] = useState([]);

  const columns = [
    {
      accessorKey: "NombreUbicacion",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Dirección <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("NombreUbicacion")}</div>
      ),
    },
    {
      accessorKey: "ValorDomicilio",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor del Domicilio
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="">S/ {row.getValue("ValorDomicilio")}</div>
      ),
    },

    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Operaciones</DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <div
                  onClick={(e) => {
                    e.preventDefault();
                    setOpenModal({
                      Visible: true,
                      InfoEditar: row?.original,
                    });
                  }}
                  className="w-full h-full cursor-pointer"
                >
                  Editar
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <div
                  className="hover:cursor-pointer w-full h-full"
                  onClick={async (e) => {
                    e.preventDefault();

                    const Confirm = confirm(
                      `Esta Seguro de eliminar esta direción: ${row.NombreUbicacion}`
                    );
                    if (Confirm) {
                      await deleteDoc(
                        doc(
                          db,
                          "Restaurantes",
                          `${idRestaurante}`,
                          "Delyvery",
                          `${row.id}`
                        )
                      );
                    }
                  }}
                >
                  Eliminar
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  useEffect(() => {
    if (idRestaurante) {
      const qDirection = query(
        collection(db, "DireccionesDelivery"),
        where("idRestaurante", "==", idRestaurante)
      );

      const unsubscribe = onSnapshot(qDirection, (snapshot) => {
        setDirecciones(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

      return () => {
        unsubscribe();
      };
    }
  }, [idRestaurante]);

  return (
    <>
      {OpenModal.Visible && (
        <ModalDireccion
          OpenModal={OpenModal}
          setOpenModal={setOpenModal}
          idRestaurante={idRestaurante}
        />
      )}
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              Bienvenido al módulo configuración para direcciones de envio
            </CardTitle>

            <CardDescription>
              En esta sección, puedes ver y modificar las direcciones a la cual
              se pueden hacer domicilios .
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
                <p>Agregar nueva dirección </p>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              <h1 className="uppercase">{name || "Nombre del restaurante"}</h1>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {Direcciones?.length > 0 && (
              <DataTable
                data={Direcciones}
                columns={columns}
                styles={({ disabled }) => {
                  return disabled && "bg-red-200 ";
                }}
                search={{
                  Titulo: "Lista de direcciones de envio",
                  Variable: "NombreUbicacion",
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Delyvery;
