"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/firebase/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";

const MostrarPedido = ({
  ListaComprasModalVisible,
  setListaComprasModalVisible,
}) => {
  const [InputValues, setInputValues] = useState({});
  const [CartFiltered, setCartFiltered] = useState(
    ListaComprasModalVisible?.cart?.reduce((acc, el) => {
      const key = el?.id;
      if (!acc[key]) {
        acc[key] = {
          ...el,

          ListaPedido: [],
        };
      }
      acc[key].ListaPedido.push(el);
      return acc;
    }, {})
  );

  console.log("ListaComprasModalVisible", ListaComprasModalVisible);
  const closeListaComprasModalVisible = () => {
    setListaComprasModalVisible({
      visible: false,
      cart: [],
    });
  };

  return (
    <Dialog
      open={ListaComprasModalVisible?.visible}
      onOpenChange={closeListaComprasModalVisible}
    >
      <DialogContent className="max-h-[90%] w-full overflow-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>Orden</DialogTitle>
          <DialogDescription>
            Estos articulos se encuentran en la orden
          </DialogDescription>
        </DialogHeader>

        <h1 className="uppercase font-bold text-xl text-center">
          {" "}
          {ListaComprasModalVisible?.order?.Entrega}{" "}
        </h1>
        {ListaComprasModalVisible?.order?.DireccionEntrega && (
          <h1 className="uppercase font-bold text-xl text-center">
            Direccón de entrega:
            {ListaComprasModalVisible?.order?.DireccionEntrega}
          </h1>
        )}
        {ListaComprasModalVisible?.order?.DireccionValorDomicilio && (
          <h1 className="uppercase font-bold text-xl text-center">
            Valor Del Domicilio: $
            {ListaComprasModalVisible?.order?.DireccionValorDomicilio}
          </h1>
        )}
        <div className="mx-auto w-full">
          <ul className="space-y-2  w-full  gap-2 ">
            {Object.values(CartFiltered)?.map((list, key) => {
              return (
                <li
                  key={key}
                  className="  p-1  w-full h-full mx-auto border-b "
                >
                  <div className="flex lists-center justify-between gap-x-3">
                    {list?.Imagenes[0] && (
                      <Image
                        src={list.Imagenes[0]}
                        alt={list.NombreProducto}
                        width={120}
                        height={120}
                      />
                    )}

                    <div className="w-full">
                      <p className="line-clamp-3 font-bold uppercase">
                        {" "}
                        {list.NombreProducto}
                      </p>

                      {list?.PreguntasRespuestas?.length > 0 && (
                        <div className="flex flex-col space-y-1">
                          {list?.PreguntasRespuestas?.map((pregunta, key) => (
                            <div key={key} className="space-y-1">
                              {pregunta?.Respuesta?.length > 0 && (
                                <>
                                  {" "}
                                  <p className="text-sm font-bold">
                                    {pregunta?.Pregunta}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {pregunta?.Respuesta}
                                  </p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className=" w-48  text-xl ">
                      <p className="mt-4 font-bold text-right">
                        Cant {list?.ListaPedido?.length}
                      </p>
                      <p className="mt-2 font-bold text-right">
                        total: $
                        {list?.ListaPedido?.reduce(
                          (acc, el) => acc + parseFloat(el?.Precio || 0),
                          0
                        )}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          {!ListaComprasModalVisible?.order?.Estrega == "Listado" && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                if (confirm("¿Estás seguro de listar la orden?")) {
                  await updateDoc(
                    doc(db, "Orders", `${ListaComprasModalVisible?.order?.id}`),
                    {
                      ...InputValues,
                      Estrega: "Listado",
                    }
                  );
                  setListaComprasModalVisible({
                    visible: false,
                    cart: [],
                    order: {},
                  });
                }
              }}
              className="py-2 w-full h-full"
            >
              {ListaComprasModalVisible?.order?.Entrega == "Delivery" && (
                <div className="flex justify-between">
                  <div className="flex  gap-x-5">
                    <div>
                      <Label htmlFor="NombreMotogranjero" className="">
                        Nombre de Motogranjero
                      </Label>
                      <Input
                        type="text"
                        id="NombreMotogranjero"
                        name="NombreMotogranjero"
                        className="w-full text-gray-900"
                        onChange={(e) => {
                          setInputValues({
                            ...InputValues,
                            NombreMotogranjero: e.target.value,
                          });
                        }}
                        autoComplete="off"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="ObservacionesPedido" className="">
                        Observaciones de Pedido
                      </Label>
                      <Input
                        type="text"
                        id="ObservacionesPedido"
                        name="ObservacionesPedido"
                        className="w-full text-gray-900"
                        onChange={(e) => {
                          setInputValues({
                            ...InputValues,
                            ObservacionesPedido: e.target.value,
                          });
                        }}
                        autoComplete="off"
                        required
                      />
                    </div>
                  </div>

                  <div className="font-bold text-xl">
                    Total Pagado ${" "}
                    {ListaComprasModalVisible?.order?.paymentDetails?.amount /
                      100}
                  </div>
                </div>
              )}

              <Button className="mt-2 bg-blue-500 text-white" type="submit">
                Entregar Pedido
              </Button>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MostrarPedido;
