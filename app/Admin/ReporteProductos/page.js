"use client";
import { db } from "@/firebase/firebaseClient";
import { collection, query, where, getDocs } from "firebase/firestore";
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
// import ReportesProductosPDF from "./ReporteProductoPDF";

const ReportesProductosPDF = dynamic(() => import("./ReporteProductoPDF"), {
  ssr: false,
});

const ReporteProductos = () => {
  const [loading, setLoading] = useState(true);
  const [Orders, setOrders] = useState([]);

  console.log("Orders", Orders);

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
            DataNormalizadaCart.push(producto);
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

        setOrders(DataNormalizada);
      } catch (error) {
        console.error("Error fetching data: ", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, [RangesData]);

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
                  Reporte de Clientes y ventas
                </h1>

                {Object.keys(Orders)?.length === 0 ? (
                  <p>No hay usuarios disponibles.</p>
                ) : (
                  <div>
                    {(Object.keys(Orders)?.length > 0 && (
                      <>
                        <div className="mt-4">
                          <h2 className="text-xl font-semibold mb-2">
                            Previsualización del Reporte
                          </h2>

                          <ReportesProductosPDF
                            Orders={Orders}
                            RangesData={RangesData}
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
