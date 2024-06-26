"use client";
import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";
import ModalUsuarios from "./ModalUsuarios";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, BadgePlus, MoreHorizontal } from "lucide-react";
import DataTable from "@/components/DataTable";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Usuarios = () => {
  const { toast } = useToast();
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [OpenModal, setOpenModal] = useState({
    Visible: false,
    InfoEditar: {},
  });

  const DeleteUser = async (uid) => {
    try {
      const DeleteUser = await fetch(`/api/Usuario?uid=${uid}`, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
        },
      }).then((res) => res.json());

      toast({
        title: "Eliminación de usuario",
        description: DeleteUser?.body || "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error?.body || "",
      });
      console.log("error", error);
    }
  };

  const Inhabilitar = async (uid, displayName) => {
    try {
      const InhabilitarUsuario = await fetch(`/api/Usuario `, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          Inhabilitar: true,
          NombreCompleto: displayName,
        }), // Convierte los datos a formato JSON
      }).then((res) => res.json());

      // if (InhabilitarUsuario.body) {
      //   fetchData();
      // }
      toast({
        title: "Inhabiltar",
        description: InhabilitarUsuario?.body || "",
        NombreCompleto: displayName,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error?.body || "",
      });
      console.log("error", error);
    }
  };

  const Habilitar = async (uid, displayName) => {
    try {
      const HabilitarUsuario = await fetch(`/api/Usuario`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          uid: uid,
          Habilitar: true,
          NombreCompleto: displayName,
        }), // Convierte los datos a formato JSON
      }).then((res) => res.json());

      if (HabilitarUsuario.body) {
        // fetchData();
      }
      toast({
        title: "Habiltar",
        description: HabilitarUsuario?.body || "",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error?.body || "",
      });
      console.log("error", error);
    }
  };
  const columns = [
    {
      accessorKey: "displayName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Nombre Completo
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue("displayName")}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Email
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("email")}</div>
      ),
    },
    {
      accessorKey: "password",
      header: "Contraseña",
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("password")}</div>
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
              <DropdownMenuItem
                className="hover:cursor-pointer w-full h-full"
                onClick={(e) => {
                  e.preventDefault();
                  if (row?.original?.disabled) {
                    if (
                      confirm(
                        `¿Está seguro de habilitar la cuenta del usuario ${row?.original?.displayName}?`
                      )
                    ) {
                      Habilitar(row?.original?.uid, row?.original?.displayName);
                    }
                  } else {
                    if (
                      confirm(
                        `¿Está seguro de deshabilitar la cuenta del usuario ${row?.original?.displayName}?`
                      )
                    ) {
                      Inhabilitar(
                        row?.original?.uid,
                        row?.original?.displayName
                      );
                    }
                  }
                }}
              >
                {row?.original?.disabled ? "Habilitar" : "Inhabilitar"}
              </DropdownMenuItem>

              <DropdownMenuItem>
                <div
                  className="hover:cursor-pointer w-full h-full"
                  onClick={(e) => {
                    e.preventDefault();

                    if (
                      confirm(
                        `¿Está seguro de eliminar la cuenta del usuario ${row?.original?.displayName}?`
                      )
                    ) {
                      DeleteUser(row?.original?.uid);
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
    const unsubscribe = onSnapshot(
      collection(db, `Usuarios`),
      (snapshot) => {
        setData(
          snapshot.docs.map((doc) => ({
            uid: doc.id,
            ...doc.data(),
          }))
        ); // Finaliza el estado de carga cuando la operación se completa
        setLoading(false);
      },
      (error) => {
        setError(error); // Maneja cualquier error ocurrido // Asegúrate de finalizar el estado de carga incluso en caso de error
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      setData(null);
      setError(null);
    }; // Se ejecuta cuando el componente se desmonta para limpiar
  }, []);

  return (
    <>
      {OpenModal.Visible && (
        <ModalUsuarios OpenModal={OpenModal} setOpenModal={setOpenModal} />
      )}
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Bienvenido al módulo de usuarios</CardTitle>

            <CardDescription>
              En esta sección, puedes ver y modificar usuarios.
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
            <CardTitle>Lista de Usuarios</CardTitle>
          </CardHeader>
          <CardContent>
            {!loading && data?.length > 0 && (
              <DataTable
                data={data}
                columns={columns}
                styles={({ disabled }) => {
                  return disabled && "bg-red-200 ";
                }}
                search={{
                  Titulo: "Nombre completo",
                  Variable: "displayName",
                }}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Usuarios;
