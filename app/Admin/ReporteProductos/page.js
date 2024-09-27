"use client";
import { db } from "@/firebase/firebaseClient";
import {
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { DateRange } from "react-date-range";
// import { es } from "date-fns/locale";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { ca, es } from "date-fns/locale";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
// import ReportesProductosPDF from "./ReporteProductoPDF";

const ReportesProductosPDF = dynamic(() => import("./ReporteProductoPDF"), {
  ssr: false,
});

const ReporteProductos = () => {
  const [loading, setLoading] = useState(true);
  const [Orders, setOrders] = useState([]);
  const [Restaurantes, setRestaurantes] = useState([]);
  const [Distrito, setDistrito] = useState([]);
  const [OrdersFiltered, setOrdersFiltered] = useState({});
  const [Title, setTitle] = useState("Reporte de Ventas por Producto");

  const [RangesData, setRangesData] = useState({
    startDate: new Date(),
    endDate: new Date(),
  });

  const HandlerFecha = (ranges) => {
    setRangesData({
      startDate: ranges.selection.startDate,
      endDate: ranges.selection.endDate,
    });
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const docRef = collection(db, "Orders");
        const q = query(
          docRef,
          where("createdAt", ">=", RangesData.startDate),
          where("createdAt", "<=", RangesData.endDate)
        );
        const querySnapshot = await getDocs(q);

        const ordersDB = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        let DataNormalizadaCart = [];

        for (const element of ordersDB) {
          const cartOrders = element?.cart;

          for (const producto of cartOrders) {
            DataNormalizadaCart.push({
              ...producto,
              restaurante: element?.restaurante?.id,
              distrito: element?.Distrito,
              orden: element?.id,
            });
          }
        }

        const DataNormalizada = DataNormalizadaCart?.reduce((acc, order) => {
          let key = order.NombreProducto;
          if (!acc[key]) {
            acc[key] = {
              nombreproducto: order.NombreProducto,

              Productos: [],
            };
          }

          acc[key].Productos.push(order);
          return acc;
        }, {});

        setOrdersFiltered(DataNormalizada);

        setOrders(DataNormalizada);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [RangesData]);

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

  const selectionRange = {
    startDate: RangesData?.startDate,
    endDate: RangesData?.endDate,
    key: "selection",
  };
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bienvenido al módulo de Reporte de productos</CardTitle>

          <CardDescription>
            En esta sección, puedes ver los reportes de los productos vendidos.
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="shadow-md ">
        <CardContent className=" ">
          <div className="p-4">
            <div className="w-full h-full mx-auto flex justify-center items-center bg-gray-50">
              <DateRange
                ranges={[selectionRange]}
                maxDate={new Date()}
                onChange={HandlerFecha}
                locale={es}
              />
            </div>
            {loading ? (
              <p>Cargando...</p>
            ) : (
              <div>
                <h1 className="text-2xl font-bold mb-4">
                  Reporte de Productos
                </h1>
                <div className="flex flex-col">
                  <h1 className=" font-semibold text-xl">
                    {" "}
                    Seleccione un Restaurante
                  </h1>

                  <div className="flex w-full  justify-center items-center gap-x-2 pb-2">
                    {Restaurantes?.map((restaurante) => (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setTitle(
                            `Reporte de Ventas por Producto: ${restaurante.NombreLocal}`
                          );

                          const OrdersFilteredByRestaurante = Object.values(
                            Orders
                          )[0]?.Productos?.filter(
                            (res) => res.restaurante == restaurante.id
                          );

                          const Productos = OrdersFilteredByRestaurante?.reduce(
                            (acc, el) => {
                              const key = el.NombreProducto;
                              if (!acc[key]) {
                                acc[key] = {
                                  ...el,

                                  Productos: [],
                                };
                              }
                              acc[key].Productos.push(el);
                              return acc;
                            },
                            {}
                          );
                          console.log("Productos", Productos);

                          setOrdersFiltered(Productos);
                        }}
                        key={restaurante.id}
                      >
                        {restaurante.NombreLocal}
                      </Button>
                    ))}
                  </div>
                  <h1 className=" font-semibold text-xl">
                    Seleccione un Distrito
                  </h1>
                  <div className="flex w-full  justify-center items-center gap-x-2 pb-2">
                    {Distrito?.map((distrito) => (
                      <Button
                        onClick={(e) => {
                          e.preventDefault();
                          setTitle(
                            `Reporte de Ventas por Producto Distrito: ${distrito.NombreDistrito}`
                          );

                          const OrdersFilteredByDistrito = Object.values(
                            Orders
                          )[0]?.Productos?.filter(
                            (res) => res.distrito == distrito.id
                          );

                          const Productos = OrdersFilteredByDistrito?.reduce(
                            (acc, el) => {
                              const key = el.NombreProducto;
                              if (!acc[key]) {
                                acc[key] = {
                                  ...el,

                                  Productos: [],
                                };
                              }
                              acc[key].Productos.push(el);
                              return acc;
                            },
                            {}
                          );

                          setOrdersFiltered(Productos);
                        }}
                        key={distrito.id}
                      >
                        {distrito.NombreDistrito}
                      </Button>
                    ))}
                  </div>
                </div>

                {Object.keys(OrdersFiltered)?.length === 0 ? (
                  <p>No hay datos para mostrar.</p>
                ) : (
                  <div>
                    {(Object.keys(OrdersFiltered)?.length > 0 && (
                      <>
                        <div className="mt-4">
                          <h2 className="text-xl font-semibold mb-2">
                            Previsualización del Reporte
                          </h2>

                          <ReportesProductosPDF
                            Orders={OrdersFiltered}
                            RangesData={RangesData}
                            Title={Title}
                          />
                        </div>
                      </>
                    )) || <p>No hay datos para mostrar. </p>}
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReporteProductos;
