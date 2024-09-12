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
  getDocs,
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
import { useToast } from "@/components/ui/use-toast";

const Checkout = () => {
  const { toast } = useToast();

  const [{ user, claims }, loading, error] = useAuthState(auth);
  const cart = useCarStore((state) => state.cart);
  const clearCart = useCarStore((state) => state.clearCart);

  const total = getCartTotal(cart);

  const [VisibleProductos, setVisibleProductos] = useState(false);
  const [InputValues, setInputValues] = useState({});
  const [Direcciones, setDirecciones] = useState([]);
  const [stateSucess, setstateSucess] = useState(false);
  const [Distritos, setDistritos] = useState([]);
  const [Restaurantes, setRestaurantes] = useState([]);
  const TotalValue = getCartTotalValor(cart);

  console.log("Restaurantes", Restaurantes);

  useEffect(() => {
    if (InputValues?.Distrito) {
      const queryDirection = query(
        collection(db, "DireccionesDelivery"),
        where("idDistrito", "==", `${InputValues?.Distrito}`)
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
  }, [InputValues?.Distrito]);

  useEffect(() => {
    const obtenerDistritosAbiertos = () => {
      const unsubscribe = onSnapshot(
        collection(db, "Distritos"),
        (querySnapshot) => {
          const distritosFiltrados = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setDistritos(distritosFiltrados);
        }
      );

      // Limpieza del snapshot cuando el componente se desmonte o la dependencia cambie
      return () => unsubscribe();
    };

    const GetRestaurantesAbiertos = async () => {
      const ahora = new Date();
      const horaActual = ahora.toTimeString().slice(0, 5); // Obtiene la hora actual en formato "HH:mm"
      const unsubscribeResta = onSnapshot(
        collection(db, "Restaurantes"),
        (querySnapshot) => {
          const RestaurantesFiltrados = querySnapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .filter((res) => {
              const horaInicio = res.HoraInicio; // HoraInicio en formato "HH:mm"
              const horaFin = res.HoraFin; // HoraFin en formato "HH:mm"

              // Compara la hora actual con HoraInicio y HoraFin
              return (
                res?.EstadoRestaurante == "Si" &&
                horaActual >= horaInicio &&
                horaActual < horaFin
              );
            });

          setRestaurantes(RestaurantesFiltrados);
        }
      );

      return () => unsubscribeResta();
    };

    obtenerDistritosAbiertos();
    GetRestaurantesAbiertos();
  }, []);

  const HandlerChange = (e) => {
    setInputValues({
      ...InputValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleSuccessfulPayment = async (paymentDetails) => {
    try {
      const Restau =
        Restaurantes.find((res) => res.id == InputValues?.RestauranteId) || {};

      const InfoDristrito =
        Distritos.find((dist) => dist.id == InputValues?.Distrito) || {};

      const newOrder = {
        restaurante: Restau,
        distrito: InfoDristrito,
        RestauranteId: Restau.id,
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
        estado: "Pendiente",
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
            if (
              Math.round(
                (parseFloat(TotalValue) +
                  parseFloat(
                    InputValues?.Entrega == "Delivery"
                      ? InputValues?.Direccion
                      : 0
                  )) *
                  100
              ) < 20000
            ) {
              toast({
                title: "Error al crear el token",
                description: "El monto mínimo de compra es de S/ 20.00",
              });
              return;
            }

            const settings = {
              title: "La Granja Linda",
              currency: "PEN",
              amount: Math.round(
                (parseFloat(TotalValue) +
                  parseFloat(
                    InputValues?.Entrega == "Delivery"
                      ? InputValues?.Direccion
                      : 0
                  )) *
                  100
              ),
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

                const response = await fetch("/api/ProcesarPago", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    TotalValue,
                    user,
                    settings,
                    token,
                  }),
                });

                const data = await response.json();

                await handleSuccessfulPayment(data?.infoPago);

                // Cerrar el modal de Culqi
                Culqi.close();

                clearCart();
                // Abrir un modal de éxito
                setstateSucess(true);

                console.log("response", response);
              } else if (Culqi.order) {
                const order = Culqi.order;

                console.log("Se ha creado el objeto Order: ", order);
              } else {
                console.log("Errorrr : ", Culqi.error);
              }
            };

            let Culqi = new CulqiCheckout(
              process.env.NEXT_PUBLIC_CULQI_PUBLIC_KEY,
              config
            );

            Culqi.culqi = handleCulqiAction;

            Culqi.open();
          } catch (error) {
            console.error("Error al crear el token:", error);
            toast({
              title: "Error al crear el token",
              message: "Por favor, intente nuevamente",
              type: "error",
            });
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
                required
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
              <Label htmlFor="Distrito" className="">
                Seleccione un Distrito ?{" "}
                <span className="text-red-600">(*)</span>
              </Label>
              <Select
                id="Distrito"
                value={InputValues?.Distrito}
                required
                onValueChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    Distrito: e,
                  });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Por favor seleccione una opción" />
                </SelectTrigger>
                <SelectContent className="uppercase">
                  {Distritos?.map((distrito, key) => (
                    <SelectItem key={distrito.id} value={distrito.id}>
                      {distrito.NombreDistrito}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="Restaurante" className="">
                Seleccione un Restaurante ?{" "}
                <span className="text-red-600">(*)</span>
              </Label>
              <Select
                id="Restaurante"
                value={InputValues?.RestauranteId}
                required
                onValueChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    RestauranteId: e,
                  });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Por favor seleccione una opción" />
                </SelectTrigger>
                <SelectContent className="uppercase">
                  {Restaurantes?.map((res, key) => (
                    <SelectItem key={res.id} value={res.id}>
                      {`${res?.NombreLocal} - ${res.Direction}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {InputValues?.Distrito && InputValues?.Entrega == "Delivery" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="Direccion" className="">
                    Seleccione una dirección ?{" "}
                    <span className="text-red-600">(*)</span>
                  </Label>
                  <Select
                    id="Direccion"
                    value={InputValues?.Direccion}
                    required
                    onValueChange={(e) => {
                      setInputValues({
                        ...InputValues,
                        Direccion: e,
                      });
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Por favor seleccione una dirección" />
                    </SelectTrigger>
                    <SelectContent className="uppercase">
                      {Direcciones?.map((direction, key) => (
                        <SelectItem
                          key={direction.id}
                          value={direction.ValorDomicilio}
                        >
                          {direction.NombreUbicacion} - S/{" "}
                          {direction.ValorDomicilio}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {InputValues.Direccion &&
                  InputValues?.Entrega == "Delivery" && (
                    <>
                      <h1 className="pt-4 text-center font-bold text-3xl">
                        Adicional Domicilio S/ {InputValues?.Direccion}
                      </h1>

                      <h1 className="pt-4 text-center font-bold text-3xl">
                        Total con Domicilio S/{" "}
                        {parseFloat(TotalValue) +
                          parseFloat(InputValues?.Direccion) || 0}
                      </h1>
                    </>
                  )}
              </>
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
                    Dirección de entrega - Dirección/Urb/Calle/PJ
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
                  <Label htmlFor="Interior" className="">
                    Dptp / Interior (Opcional)
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
                    Celular <span className="text-red-600">(*)</span>
                  </Label>
                  <Input
                    required
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

        <Button
          disabled={cart?.length == 0 ? true : false}
          className="w-full "
          type="submit"
        >
          Realizar Pago
        </Button>
      </form>
    </div>
  );
};

export default Checkout;
