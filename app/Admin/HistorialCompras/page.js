"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, db } from "@/firebase/firebaseClient";
import useAuthState from "@/lib/useAuthState";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  limit,
} from "firebase/firestore";
import { EyeIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import ModalListaProductos from "./ModalListaProductos";

const HistorialCompras = () => {
  const [{ user, claims }, loading, error] = useAuthState(auth);
  const [Compras, setCompras] = useState([]);
  const [ShowProductos, setShowProductos] = useState({
    Visible: false,
    ListaProductos: [],
  });

  useEffect(() => {
    if (user?.uid) {
      const qReservas = query(
        collection(db, "Orders"),
        where("userId", "==", `${user?.uid}`),
        orderBy("createdAt", "desc"),
        limit(3)
        // las primeras 10 pedidos
      );

      const unsubscribe = onSnapshot(qReservas, (snapshot) => {
        setCompras(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

      return () => unsubscribe();
    }
  }, [user?.uid]);
  return (
    <div className="space-y-6">
      {ShowProductos.Visible && (
        <ModalListaProductos
          ShowProductos={ShowProductos}
          setShowProductos={setShowProductos}
        />
      )}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bienvenido al módulo de Historial de Compras</CardTitle>

          <CardDescription>
            En esta sección, Visualizar las compras realiazadas
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de compras</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="p-4 bg-gray-50">
            {/* component */}
            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Compras.map((compra) => (
                <li
                  key={compra?.id}
                  className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow"
                >
                  <div className="flex w-full items-center justify-between space-x-6 p-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="truncate text-sm font-medium text-gray-900">
                          S/ {compra?.paymentDetails?.amount / 100}
                        </h3>
                        <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-inset ring-green-600/20">
                          {compra?.createdAt.toDate().toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        {compra?.paymentDetails?.source?.card_number ||
                          "Tarjeta no disponible"}
                      </p>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        Id Venta:{" "}
                        {compra?.paymentDetails?.source?.id ||
                          "id no disponible"}
                      </p>
                      <p className="mt-1 truncate text-sm text-gray-500">
                        Código de Referencia:{" "}
                        {compra?.paymentDetails?.reference_code ||
                          "id no disponible"}
                      </p>
                    </div>

                    <Avatar className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="flex w-0 flex-1">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setShowProductos({
                              Visible: true,
                              ListaProductos: compra?.cart || [],
                            });
                          }}
                          className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                        >
                          <EyeIcon className="w-5 h-5 " />
                          Más Detalles
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HistorialCompras;
