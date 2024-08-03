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
import ModalCompraSuccess from "./ModalCompraSuccess";
import { Input } from "@/components/ui/input";

const Checkout = () => {
  const [{ user, claims }, loading, error] = useAuthState(auth);
  const cart = useCarStore((state) => state.cart);

  const total = getCartTotal(cart);
  const TotalValue = getCartTotalValor(cart);
  const [VisibleProductos, setVisibleProductos] = useState(false);
  const [InputValues, setInputValues] = useState({});
  const [Direcciones, setDirecciones] = useState([]);
  const [stateSucess, setstateSucess] = useState(false);
  const [Restaurantes, setRestaurantes] = useState([]);

  useEffect(() => {
    if (InputValues?.Restaurante) {
      const queryDirection = query(
        collection(db, "DireccionesDelivery"),
        where("idRestaurante", "==", `${InputValues?.Restaurante}`)
      );

      const unsubscribe = onSnapshot(queryDirection, (snapshot) => {
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
  }, [InputValues?.Restaurante]);
  useEffect(() => {
    const restaurantesDb = onSnapshot(
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

    return () => {
      restaurantesDb();
    };
  }, []);

  const HandlerChange = (e) => {
    setInputValues({
      ...InputValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSuccessfulPayment = async (paymentDetails) => {
    try {
      const newOrder = {
        cart,
        TotalValue,
        ...InputValues,
        paymentDetails: {
          ...paymentDetails,
        },
        createdAt: serverTimestamp(),
        displayName: user?.displayName || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        providerId: user?.providerId || "",
        photoURL: user?.photoURL || "",
        userId: user?.uid || "",
      };

      await addDoc(collection(db, "Orders"), newOrder);
      console.log("Order successfully saved to Firebase!");

      setstateSucess(true);
      // Clear form fields, reset state, or perform other post-payment actions
    } catch (error) {
      console.error("Error saving order to Firebase:", error);
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
      {stateSucess && (
        <ModalCompraSuccess
          stateSucess={stateSucess}
          setstateSucess={setstateSucess}
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
              // billetera: true,
              // bancaMovil: true,
              // agente: true,
              // cuotealo: true,
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

            const handleCulqiAction = async () => {
              if (Culqi.token) {
                const token = Culqi.token.id;
                console.log("Se ha creado un Token: ", token);
              } else if (Culqi.order) {
                const order = Culqi.order;
                await handleSuccessfulPayment(order);

                console.log("Se ha creado el objeto Order: ", order);
              } else {
                console.log("Errorrr : ", Culqi.error);
              }
            };

            let Culqi = new CulqiCheckout(
              process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY,
              config
            );

            console.log("Culqi", Culqi);

            Culqi.culqi = handleCulqiAction;

            Culqi.open();
          } catch (error) {
            console.error("Error al crear el token:", error);
          }
        }}
        className="space-y-3"
      >
        <Card className="shadow-md ">
          <CardHeader>
            <CardTitle>Opciones de Entrega y Recogida</CardTitle>
          </CardHeader>
          <CardContent>
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

            <div className="space-y-2">
              <Label htmlFor="Restaruante" className="">
                Seleccione un restaurante ?{" "}
                <span className="text-red-600">(*)</span>
              </Label>
              <Select
                id="Restaurante"
                value={InputValues?.Restaurante}
                onValueChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    Restaurante: e,
                  });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Por favor seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  {Restaurantes?.map((restaurante, key) => (
                    <SelectItem key={restaurante.id} value={restaurante.id}>
                      {restaurante.NombreLocal} - {restaurante.Direction}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {InputValues?.Entrega == "Delivery" && InputValues?.Restaurante && (
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

            {/* <div className="space-y-2 ">
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
            </div> */}
          </CardContent>
        </Card>

        {InputValues?.Entrega == "Delivery" && (
          <Card>
            <CardHeader>
              <CardTitle>Dirección de entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="DireccionEntrega" className="">
                    Dirección de entrega
                    <span className="text-red-600">(*)</span>
                  </Label>
                  <Input
                    id="DireccionEntrega"
                    name="DireccionEntrega"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    required
                    autoComplete="off"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Numero" className="">
                    Número
                    <span className="text-red-600">(*)</span>
                  </Label>
                  <Input
                    id="Numero"
                    name="Numero"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    required
                    autoComplete="off"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Interior" className="">
                    Dptp / Interior (Opcional)
                    <span className="text-red-600">(*)</span>
                  </Label>
                  <Input
                    id="Interior"
                    name="Interior"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    autoComplete="off"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Referencia" className="">
                    Referencia / Urbanización / Barrio / Cruce
                    {/* <span className="text-red-600">(*)</span> */}
                  </Label>
                  <Input
                    id="Referencia"
                    name="Referencia"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    autoComplete="off"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Celular" className="">
                    Celular {/* <span className="text-red-600">(*)</span> */}
                  </Label>
                  <Input
                    id="Celular"
                    name="Celular"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    autoComplete="off"
                    type="text"
                  />
                </div>
                {/* <div className="space-y-2">
                  <Label htmlFor="NombreDireccion" className="">
                    Nombre de la Direccion{" "}
                   </Label>
                  <Input
                    id="NombreDireccion"
                    name="NombreDireccion"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    autoComplete="off"
                    type="text"
                  />
                </div> */}
              </div>
            </CardContent>
          </Card>
        )}
        <Button className="w-full " type="submit">
          Realizar Pago
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
