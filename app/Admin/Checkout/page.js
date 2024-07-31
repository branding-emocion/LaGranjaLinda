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
import {
  addDoc,
  collection,
  onSnapshot,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";
import { Textarea } from "@/components/ui/textarea";
import useAuthState from "@/lib/useAuthState";
import { getCartTotalValor } from "@/lib/getCartTotalValor";

const Checkout = () => {
  const [{ user, claims }, loading, error] = useAuthState(auth);
  const cart = useCarStore((state) => state.cart);

  const total = getCartTotal(cart);
  const TotalValue = getCartTotalValor(cart);
  const [VisibleProductos, setVisibleProductos] = useState(false);
  const [InputValues, setInputValues] = useState({});
  const [Direcciones, setDirecciones] = useState([]);
  console.log(user);

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

  const handleSuccessfulPayment = async (paymentId) => {
    try {
      const newOrder = {
        cart,
        total,
        ...InputValues,
        paymentId,
        createdAt: serverTimestamp(),
        ...user,
      };

      await addDoc(collection(db, "Orders"), newOrder);
      console.log("Order successfully saved to Firebase!");

      // Clear form fields, reset state, or perform other post-payment actions
    } catch (error) {
      console.error("Error saving order to Firebase:", error);
    }
  };
  const handleCulqiAction = async (event) => {
    if (event.data && event.data.status === "success") {
      // Payment successful
      const paymentId = event.data.id; // Adjust according to Culqi's response

      await handleSuccessfulPayment(paymentId);
    } else if (event.data && event.data.status === "error") {
      // Handle payment errors
      console.error("Payment error:", event.data.message);
    }
  };

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
            onSubmit={async (e) => {
              e.preventDefault();

              try {
                const settings = {
                  title: "La Granja Linda",
                  currency: "PEN",
                  amount: Math.round(TotalValue * 100),
                  order: "ord_live_d1P0Tu1n7Od4nZdp",
                  xculqirsaid: process.env.NEXT_PUBLIC_RSA_HASH,
                  rsapublickey: process.env.NEXT_PUBLIC_RSA_PUBLIC_KEY,
                };

                const paymentMethods = {
                  // las opciones se ordenan según se configuren
                  tarjeta: true,
                  yape: true,
                  billetera: true,
                  bancaMovil: true,
                  agente: true,
                  cuotealo: true,
                };

                const options = {
                  lang: "auto",
                  installments: true,
                  modal: true,
                  container: "#culqi-container", // Opcional
                  paymentMethods: paymentMethods,
                  paymentMethodsSort: Object.keys(paymentMethods), // las opciones se ordenan según se configuren en paymentMethods
                };

                const client = {
                  email: user?.email || "",
                };

                const config = {
                  settings,
                  client,
                  options,

                  // appearance,
                };

                const Culqi = new CulqiCheckout(
                  process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY,
                  config
                );

                Culqi.culqi = handleCulqiAction;

                Culqi.open();
              } catch (error) {
                console.error("Error al crear el token:", error);
              }
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

            <button type="submit">Prueba Pago</button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Checkout;
