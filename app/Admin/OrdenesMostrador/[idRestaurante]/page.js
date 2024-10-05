"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { db } from "@/firebase/firebaseClient";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import MostrarPedido from "./MostrarPedido";

const OrdenesRestaurante = ({ params: { idRestaurante } }) => {
  const [OrdenesActuales, setOrdenesActuales] = useState([]);
  const [ListaComprasModalVisible, setListaComprasModalVisible] = useState({
    visible: false,
    cart: [],
  });

  useEffect(() => {
    if (idRestaurante) {
      const FechaActual = new Date();

      // Crear una fecha de inicio y fin del día actual
      const inicioDia = new Date(FechaActual.setHours(0, 0, 0, 0)); // 00:00:00 del día actual
      const finDia = new Date(FechaActual.setHours(23, 59, 59, 999)); // 23:59:59 del día actual

      const qOrdenesActuales = query(
        collection(db, "Orders"),
        where("RestauranteId", "==", idRestaurante),
        where("createdAt", ">=", inicioDia),
        where("createdAt", "<=", finDia),
        where("estado", "==", "Comprado")
      );

      const unsubscribe = onSnapshot(qOrdenesActuales, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setOrdenesActuales(data);
      });

      return () => unsubscribe();
    }
  }, [idRestaurante]);

  return (
    <>
      {ListaComprasModalVisible?.visible && (
        <MostrarPedido
          ListaComprasModalVisible={ListaComprasModalVisible}
          setListaComprasModalVisible={setListaComprasModalVisible}
        />
      )}
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>
              Bienvenido al módulo para ver las ordenes de mostrador
            </CardTitle>

            <CardDescription>
              En esta sección, puedes visualizar los pedidos .
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Ordenes Mostrador</CardTitle>

            <div className="w-full h-full mx-auto flex justify-center items-center bg-gray-50"></div>

            {/* Vamos a agregar un buscador de reservas por nombre */}
          </CardHeader>
          <CardContent>
            <div className="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3  ">
              {OrdenesActuales?.map((order) => (
                <div
                  key={order?.id}
                  className={`${
                    (order?.EstadoEntraga == "Listado" && "bg-green-400") ||
                    (order?.EstadoEntraga == "NoEntregado" && "bg-red-400") ||
                    "bg-sky-50"
                  } w-full  hover:scale-105 mx-auto border mb-5 border-gray-200  rounded-lg cursor-pointer shadow-lg`}
                >
                  <div className="p-5">
                    <div>
                      <h1 className="text-gray-900 font-bold text-2xl tracking-tight text-center capitalize ">
                        {order?.displayName}
                      </h1>
                      <h2 className="capitalize text-gray-800 font-semibold">
                        Fecha de creación:{" "}
                        <span className="font-normal">
                          {/* Date Firebase */}
                          {new Date(
                            order.createdAt?.toDate()
                          ).toLocaleDateString()}{" "}
                          {new Date(
                            order.createdAt?.toDate()
                          ).toLocaleTimeString()}
                        </span>
                      </h2>

                      <h2 className="capitalize text-gray-800 font-semibold text-lg">
                        Entrega:{" "}
                        <span className="font-normal">{order?.Entrega} </span>
                      </h2>
                      {order?.EstadoEntraga == "NoEntregado" && (
                        <h1 className=" font-semibold text-xl">No entregado</h1>
                      )}

                      {order?.DireccionEntrega?.length && (
                        <p className=" capitalize text-gray-800">
                          <span className="font-semibold">
                            Dirección Entrega:{" "}
                          </span>
                          {order?.DireccionEntrega}
                        </p>
                      )}
                      {/* Referencia del pedido */}

                      {order?.Interior && (
                        <p className=" capitalize text-gray-800">
                          <span className="font-semibold">Interior: </span>
                          {order?.Interior}
                        </p>
                      )}
                      {order?.Referencia && (
                        <p className=" capitalize text-gray-800">
                          <span className="font-semibold">Referencia: </span>
                          {order?.Referencia}
                        </p>
                      )}
                      {/* Interior */}

                      {/* Celular del pedido */}

                      <div className=" capitalize text-gray-700">
                        <span className="font-semibold">Mail: </span>
                        <a href={`${order?.email}`}>{order?.email}</a>
                      </div>
                      <p className=" capitalize text-gray-700">
                        <span className="font-semibold">Celular: </span>
                        <a href={`tel:+${order?.Celular}`}>{order.Celular}</a>
                      </p>
                      <p className="w-full max-h-52 overflow-auto">
                        {order?.Comentario}
                      </p>

                      <p className=" capitalize text-gray-800">
                        <span className="font-semibold">
                          Cantidad Productos:{" "}
                        </span>
                        {order?.cart?.length}
                      </p>

                      <Button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setListaComprasModalVisible({
                            visible: true,
                            cart: order.cart,
                            order: order,
                          });
                        }}
                      >
                        Lista de compra
                      </Button>
                    </div>
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

export default OrdenesRestaurante;
