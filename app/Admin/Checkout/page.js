"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCartTotal } from "@/lib/getCartTotal";
import { useCarStore } from "@/store";
import React, { useEffect, useState } from "react";
import ShowProductos from "./ShowProductos";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { Textarea } from "@/components/ui/textarea";

const Checkoust = () => {
  const cart = useCarStore((state) => state.cart);
  const total = getCartTotal(cart);
  const [VisibleProductos, setVisibleProductos] = useState(false);
  const [InputValues, setInputValues] = useState({});
  const [Direcciones, setDirecciones] = useState([]);
  console.log(Direcciones);

  useEffect(() => {
    if (InputValues?.Entrega == "Delivery") {
      const unsubscribe = onSnapshot(
        collection(db, "DireccionesDelivery"),
        (snapshot) => {
          setDirecciones(
            snapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
          );
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [InputValues?.Entrega]);

  return (
    <div className="space-y-6">
      {VisibleProductos && (
        <ShowProductos
          VisibleProductos={VisibleProductos}
          setVisibleProductos={setVisibleProductos}
        />
      )}
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bienvenido al módulo de pagos</CardTitle>

          <CardDescription>
            En esta sección, puedes realizar el pago de tus productos
          </CardDescription>

          <div className="flex justify-center flex-wrap items-center gap-5">
            <Button
              onClick={(e) => {
                e.preventDefault();
                setVisibleProductos(true);
              }}
            >
              Lista de productos
            </Button>

            <Card>
              <CardHeader>
                <CardTitle>Total: {total}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </CardHeader>
      </Card>

      <Card className="shadow-md ">
        <CardHeader>
          <CardTitle>Opciones de Entrega y Recogida</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Formulario enviado");
            }}
            className="space-y-3"
          >
            {/* Delivery o llevar */}
            <div className="space-y-2">
              <Label htmlFor="Disponibilidad" className="">
                Seleccione una opción? <span className="text-red-600">(*)</span>
              </Label>
              <Select
                value={InputValues?.Entrega}
                required
                onValueChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    Entrega: e,
                  });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Por favor seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    // esAdicional
                    { id: "Delivery", label: "Delivery" },
                    { id: "Llevar", label: "Llevar" },
                  ].map((adi, key) => (
                    <SelectItem key={adi.id} value={adi.id}>
                      {adi.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {InputValues?.Entrega == "Delivery" && (
              <div className="space-y-2 ">
                <Label htmlFor="Disponibilidad" className="">
                  Direcciones disponibles
                  <span className="text-red-600">(*)</span>
                </Label>
                <Select
                  value={InputValues?.IdDireccion}
                  required
                  onValueChange={(e) => {
                    setInputValues({
                      ...InputValues,
                      IdDireccion: e,
                    });
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Solo hay disponible en estas direcciones" />
                  </SelectTrigger>
                  <SelectContent>
                    {Direcciones.map((adi, key) => (
                      <SelectItem
                        className="uppercase"
                        key={adi.id}
                        value={adi.id}
                      >
                        {adi.NombreUbicacion} - S/ {adi.ValorDomicilio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2 ">
              <Label htmlFor="ComentarioAdicionalEntre" className="">
                Comentario adicional de entrega{" "}
              </Label>
              <Textarea
                id="ComentarioAdicionalEntre"
                name="ComentarioAdicionalEntre"
                className="w-full text-gray-900"
                onChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    ComentarioAdicionalEntre: e.target.value,
                  });
                }}
                autoComplete="off"
              />
            </div>

            <button type="submit">hola</button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkoust;
