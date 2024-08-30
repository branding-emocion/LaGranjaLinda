"use client";
import React, { useEffect, useState } from "react";
import Title from "../Title";
import {
  addDoc,
  collection,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Reclamaciones = () => {
  const [Restaurantes, setRestaurantes] = useState([]);
  const [InputValues, setInputValues] = useState({});

  const { toast } = useToast();

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
  }, []);

  useEffect(() => {
    if (InputValues?.RestauranteId) {
      const restaurante = Restaurantes?.find(
        (res) => res.id === InputValues?.RestauranteId
      );
      setInputValues({
        ...InputValues,
        InfoRestaurante: restaurante,
      });
    }
  }, [InputValues?.RestauranteId]);

  const HandlerChange = (e) => {
    setInputValues({
      ...InputValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="  bg-[#eaeaea]  mb-10">
      <Title
        title={"Libro de Reclamaciones"}
        image="/BannerReclamaciones.webp"
      />
      <div className="container mx-auto px-28 py-10 lg:pr-36 space-y-3">
        <p>
          Conforme a lo establecido en código de la Protección y Defensa del
          consumidor contamos con un Libro de Reclamaciones a tu disposición
          para que puedas registrar tu queja o reclamo acerca de algún pedido o
          transacción realizada
        </p>
        <h1 className="text-center font-semibold uppercase  text-xl ">
          Hoja de reclamación V-02689
        </h1>
        <p>Fecha de Registro: {new Date().toLocaleDateString()}</p>
        <p>
          En la siguiente lista desplegable elija el restaurante responsable de
          su queja o reclamo, si tiene dudas puede ubicar el restaurante en la
          parte superior de la boleta de venta o escribanos un mensaje al correo
          <span>
            <a
              href="mailto:atencionalinvitado@lagranjalinda.com.pe"
              className=" text-blue-700"
            >
              {" "}
              atencionalinvitado@lagranjalinda.com.pe
            </a>
          </span>{" "}
          para poder orientarlo.{" "}
        </p>

        <form
          onSubmit={async (e) => {
            e.preventDefault();

            try {
              // add to firebase

              const docRef = await addDoc(collection(db, "Reclamos"), {
                ...InputValues,
                Status: "Pendiente",
                createdAt: serverTimestamp(),
              });

              e.target.reset();

              toast({
                title: "Reclamo Enviado",
                description: "Reclamo enviado correctamente",
              });
            } catch (error) {
              console.error("Error adding document: ", error);
              toast({
                title: "Error",
                description: "Error al enviar el reclamo",
              });
            }
          }}
          className="space-y-3"
        >
          <div className="space-y-2">
            <Label
              htmlFor="Restaurante"
              className="font-semibold uppercase  text-xl"
            >
              Restaurante <span className="text-red-600"> (*)</span>
            </Label>
            <Select
              value={InputValues?.Restaurante}
              required
              onValueChange={(e) => {
                setInputValues({
                  ...InputValues,
                  RestauranteId: e,
                });
              }}
              autoFocus
              id="Restaurante"
            >
              <SelectTrigger className="">
                <SelectValue placeholder="Seleccione un restaurante" />
              </SelectTrigger>
              <SelectContent>
                {Restaurantes?.map((res) => (
                  <SelectItem key={res.id} value={res.id}>
                    {res?.NombreLocal || ""} - {res?.Direction}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Card>
              {InputValues?.InfoRestaurante && (
                <CardContent className="pt-4">
                  <p>
                    <span className="font-semibold">Razón Social: </span>

                    {InputValues?.InfoRestaurante?.RazonSocial}
                  </p>
                  <p>
                    <span className="font-semibold">RUC: </span>
                    {InputValues?.InfoRestaurante?.Ruc}{" "}
                  </p>
                  <p>
                    <span className="font-semibold">DIRECCIÓN: </span>
                    {InputValues?.InfoRestaurante?.Direction}{" "}
                  </p>
                </CardContent>
              )}
            </Card>
          </div>

          <div>
            <h1 className="font-semibold uppercase  text-xl">
              {" "}
              1- Identificación del Usuario{" "}
            </h1>

            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="NombreCompleto" className="">
                      Nombre Completo
                      <span className="text-red-600">(*)</span>
                    </Label>
                    <Input
                      id="NombreCompleto"
                      name="NombreCompleto"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      required
                      autoComplete="off"
                      type="text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="Direccion" className="">
                      Dirección <span className="text-red-600">(*)</span>
                    </Label>
                    <Input
                      id="Direccion"
                      name="Direccion"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      required
                      autoComplete="off"
                      type="text"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="TipoDocumento"
                      className="font-semibold uppercase  text-xl"
                    >
                      Tipo de Documento{" "}
                      <span className="text-red-600"> (*)</span>
                    </Label>
                    <Select
                      required
                      onValueChange={(e) => {
                        setInputValues({
                          ...InputValues,
                          TipoDocumento: e,
                        });
                      }}
                      id="Restaurante"
                    >
                      <SelectTrigger className="">
                        <SelectValue placeholder="Seleccione un restaurante" />
                      </SelectTrigger>
                      <SelectContent>
                        {[
                          {
                            Label: "DNI",
                          },
                          {
                            Label: "Carnet de Extranjeria",
                          },
                          {
                            Label: "Pasaporte",
                          },
                          {
                            Label: "RUC",
                          },
                        ]?.map((res) => (
                          <SelectItem key={res.Label} value={res.Label}>
                            {res?.Label || ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="NumeroDocumento" className="">
                      Número de Documento{" "}
                      <span className="text-red-600">(*)</span>
                    </Label>
                    <Input
                      id="NumeroDocumento"
                      name="NumeroDocumento"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      required
                      autoComplete="off"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="Celular" className="">
                      Celular <span className="text-red-600">(*)</span>
                    </Label>
                    <Input
                      id="Celular"
                      name="Celular"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      required
                      autoComplete="off"
                      type="text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="CorreoElectronico" className="">
                      E-MAIL <span className="text-red-600">(*)</span>
                    </Label>
                    <Input
                      id="CorreoElectronico"
                      name="CorreoElectronico"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      required
                      autoComplete="off"
                      type="email"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h1 className="font-semibold uppercase  text-xl">
              {" "}
              2- DETALLE DE RECLAMACIÓN{" "}
            </h1>

            <Card>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="TipoReclamacion"
                    className="font-semibold uppercase  text-xl"
                  >
                    Tipo de Reclamación{" "}
                    <span className="text-red-600"> (*)</span>
                  </Label>
                  <Select
                    required
                    onValueChange={(e) => {
                      setInputValues({
                        ...InputValues,
                        TipoReclamacion: e,
                      });
                    }}
                    id="Restaurante"
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Seleccione un restaurante" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        {
                          Label: "Reclamo",
                        },
                        {
                          Label: "Queja",
                        },
                      ]?.map((res) => (
                        <SelectItem key={res.Label} value={res.Label}>
                          {res?.Label || ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="Detalles" className="">
                    Detalles <span className="text-red-600"> (*)</span>
                  </Label>
                  <Textarea
                    id="Detalles"
                    name="Detalles"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    required
                    autoComplete="off"
                    // min length 10 caract
                    minLength={10}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <h1 className="font-semibold uppercase  text-xl">
              3- DETALLE DEL PRODUCTO O SERVICIO ADQUIRIDO
            </h1>

            <Card>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="NumeroPedido" className="">
                      Número de pedido
                    </Label>
                    <Input
                      id="NumeroPedido"
                      name="NumeroPedido"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      autoComplete="off"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="FechaPedido" className="">
                      Fechal del Pedido
                    </Label>
                    {/*Input Date  */}
                    <Input
                      id="FechaPedido"
                      name="FechaPedido"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      autoComplete="off"
                      type="date"
                    />
                  </div>
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="PedidoReclamente" className="">
                      Pedido del Reclamente{" "}
                      <span className="text-red-600"> (*)</span>
                    </Label>
                    <Textarea
                      id="PedidoReclamente"
                      name="PedidoReclamente"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      required
                      autoComplete="off"
                      // min length 10 caract
                      minLength={10}
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <p className="pt-2">
                    La formulación del reclamo no impide acudir a otras vías de
                    solución de controversias ni es requisito previo para
                    interponer una denuncia ante el INDECOPI. El proveedor debe
                    dar respuesta al reclamo o queja en un plazo no mayor a
                    quince(15) días hábiles, el cual es improrrogable.
                  </p>

                  {/* Check terminos  y condiciones */}

                  <div className="space-y-2">
                    <Label htmlFor="TerminosCondiciones" className="">
                      Acepto los términos y condiciones
                      <span className="text-red-600"> (*)</span>
                    </Label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="TerminosCondiciones"
                        name="TerminosCondiciones"
                        required
                      />
                      <label htmlFor="TerminosCondiciones">
                        Acepto los términos y condiciones
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button type="submit">Enviar Reclamo</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Reclamaciones;
