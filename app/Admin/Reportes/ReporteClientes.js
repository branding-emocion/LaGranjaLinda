"use client";
import { db } from "@/firebase/firebaseClient";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { collection, query, where, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ReporteClientesPDF from "./ReportesClientesPDF";
import { Button } from "@/components/ui/button";
import { DateRange } from "react-date-range";
// import { es } from "date-fns/locale";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import { es } from "date-fns/locale";

const ReporteClientes = () => {
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

        const DataNormalizada = ordersDB?.reduce((acc, order) => {
          let key = order.userId;
          if (!acc[key]) {
            acc[key] = {
              usuario: order.userId,
              nombre: order.displayName,
              email: order.email,
              telefono: order.phoneNumber,
              orders: [],
            };
          }

          acc[key].orders.push(order);
          return acc;
        }, {});
        console.log("DataNormalizada", DataNormalizada);

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
          <h1 className="text-2xl font-bold mb-4">Reporte de Clientes</h1>

          {Orders?.length === 0 ? (
            <p>No hay usuarios disponibles.</p>
          ) : (
            <div>
              {(Orders?.length > 0 && (
                <>
                  <Button>
                    <PDFDownloadLink
                      document={
                        <ReporteClientesPDF
                          Orders={Orders}
                          RangesData={RangesData}
                        />
                      }
                      fileName="reporte-clientes.pdf"
                    >
                      {({ loading }) =>
                        loading
                          ? "Cargando documento..."
                          : "Descargar Reporte PDF"
                      }
                    </PDFDownloadLink>
                  </Button>

                  <div className="mt-4">
                    <h2 className="text-xl font-semibold mb-2">
                      Previsualización del Reporte
                    </h2>

                    <ReporteClientesPDF
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
  );
};

export default ReporteClientes;
