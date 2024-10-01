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

import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";

import {
  Timestamp,
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseClient";
import { Textarea } from "@/components/ui/textarea";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ModalReservas = ({ OpenModal, setOpenModal, setAlertaState }) => {
  const [InputValues, setInputValues] = useState({});
  const [minDate, setMinDate] = useState("");

  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();

  const closeOpenModal = () => {
    setOpenModal({
      Visible: false,
      InfoRestaurante: {},
    });
    setInputValues({});
  };

  useEffect(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1); // Agregar 1 día a la fecha actual
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Meses empiezan en 0
    const day = String(today.getDate()).padStart(2, "0");

    // Hora mínima 12:00 PM
    const formattedDateMin = `${year}-${month}-${day}T12:00`;
    setMinDate(formattedDateMin);
  }, []);

  const HandlerChange = (e) => {
    const { name, value } = e.target;

    setInputValues({
      ...InputValues,
      [name]: value,
    });
  };

  const HandlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!InputValues?.NumeroCelular) {
        alert("Por favor ingrese un numero de celular");
        return;
      }

      // Convertir a objeto Date fecha y hora
      const fechaReservaDate = new Date(InputValues?.FechaReserva);

      // Establecer las horas de validación (12 PM y 9 PM)
      const minHour = 12;
      const maxHour = 21;

      // Validar que la fecha sea mayor a la fecha mínima y esté entre las 12 PM y 9 PM
      if (
        fechaReservaDate < minDate ||
        fechaReservaDate.getHours() < minHour ||
        fechaReservaDate.getHours() >= maxHour
      ) {
        alert("La hora mínima es de las 12 PM y la máxima es las 9 PM");
        return;
      }
      const docRef = await addDoc(collection(db, "Reservas"), {
        ...InputValues,
        Restaurante: OpenModal?.InfoRestaurante?.id,
        createdAt: serverTimestamp(),
        Estado: "Pendiente",
        FechaReserva: Timestamp.fromDate(fechaReservaDate), // Almacenar como Timestamp
      });
      // toast({
      //   title: "Reserva solicitada",
      //   description: "En breve nos comunicaremos contigo",
      // });
      closeOpenModal();
      setAlertaState(true);
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: err?.error?.errorInfo?.code || "Internal Server Error",
        description: err?.error?.errorInfo?.message || "Contacte con soporte",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={OpenModal?.Visible} onOpenChange={closeOpenModal}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>
            NUEVA RESERVA{" "}
            <span className="uppercase">
              {OpenModal.InfoRestaurante?.NombreLocal} -{" "}
              {OpenModal.InfoRestaurante?.Direction ||
                "Dirección no disponible"}
            </span>
          </DialogTitle>
          <DialogDescription>
            <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="NombreCompleto" className="">
                    Nombre Completo <span className="text-red-600">(*)</span>
                  </Label>
                  <Input
                    id="NombreCompleto"
                    name="NombreCompleto"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    defaultValue={OpenModal?.InfoEditar?.NombreCompleto}
                    required
                    autoComplete="off"
                    autoFocus
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="MotivoReserva" className="">
                    Motivo de la Reserva?
                  </Label>
                  <Select
                    value={InputValues?.MotivoReserva}
                    required
                    onValueChange={(e) => {
                      setInputValues({
                        ...InputValues,
                        MotivoReserva: e,
                      });
                    }}
                  >
                    <SelectTrigger className="">
                      <SelectValue placeholder="Motivo dela reserva ?" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        { id: 1, label: "Cena de Negocios" },
                        { id: 2, label: "Cumpleaños" },
                        { id: 3, label: "Aniversario" },
                        { id: 4, label: "Reunión Familiar" },
                        { id: 5, label: "Cita Romántica" },
                        { id: 6, label: "Celebración de Amigos" },
                        { id: 7, label: "Evento Corporativo" },
                        { id: 8, label: "Otro" },
                      ].map((adi, key) => (
                        <SelectItem key={adi.id} value={adi.label}>
                          {adi.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {InputValues?.MotivoReserva === "Otro" && (
                  <div className="space-y-2 lg:col-span-2">
                    <Label htmlFor="OtroMotivo" className="">
                      Otro Motivo <span className="text-red-600">(*)</span>
                    </Label>
                    <Input
                      id="OtroMotivo"
                      name="OtroMotivo"
                      className="w-full text-gray-900"
                      onChange={HandlerChange}
                      defaultValue={OpenModal?.InfoEditar?.OtroMotivo}
                      required
                      autoComplete="off"
                      type="text"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="Correo" className="">
                    Correo Electronico <span className="text-red-600">(*)</span>
                  </Label>
                  <Input
                    id="Correo"
                    name="Correo"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    defaultValue={OpenModal?.InfoEditar?.Correo}
                    required
                    autoComplete="off"
                    type="email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="FechaReserva" className="">
                    Fecha y hora de la reserva{" "}
                    <span className="text-red-600">(*)</span>
                  </Label>
                  <div>
                    <input
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      type="datetime-local"
                      name="FechaReserva"
                      id="FechaReserva"
                      required
                      onChange={HandlerChange}
                      min={minDate}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Celular" className=" ">
                    Celular <span className="text-red-600">(*)</span>
                  </Label>

                  <PhoneInput
                    placeholder={"Numero de Celular"}
                    defaultCountry="PE" // Aquí se establece el país predeterminado
                    value={InputValues?.NumeroCelular}
                    onChange={(e) => {
                      setInputValues({
                        ...InputValues,
                        NumeroCelular: e,
                      });
                    }}
                    className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="CantPersonas" className="">
                    Cantidad de personas
                    <span className="text-red-600">(*)</span>
                  </Label>
                  <Input
                    id="CantPersonas"
                    name="CantPersonas"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    defaultValue={OpenModal?.InfoEditar?.CantPersonas}
                    required
                    autoComplete="off"
                    type="number"
                  />
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="Comentario" className="">
                    Comentarios
                  </Label>
                  <Textarea
                    id="Comentario"
                    name="Comentario"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    defaultValue={OpenModal?.InfoEditar?.Comentario}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <Button
                disabled={Loading}
                className="   disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
              >
                Solicitar Reserva
              </Button>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ModalReservas;
