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
import React, { useState } from "react";

import {
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

const ModalReservas = ({ OpenModal, setOpenModal }) => {
  const [InputValues, setInputValues] = useState({});
  const [files, setFiles] = useState([]);

  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();

  const closeOpenModal = () => {
    setOpenModal({
      Visible: false,
      InfoRestaurante: {},
    });
    setInputValues({});
  };
  const HandlerChange = (e) => {
    setInputValues({
      ...InputValues,
      [e.target.name]: e.target.value,
    });
  };

  const HandlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const docRef = await addDoc(collection(db, "Reservas"), {
        ...InputValues,
        Restaurante: OpenModal?.InfoRestaurante?.id,
        createdAt: serverTimestamp(),
      });
      toast({
        title: "Reserva solicitada",
        description: "En breve nos comunicaremos contigo",
      });
      closeOpenModal();
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
            Agregar nueva reserva{" "}
            <span className="uppercase">
              {OpenModal.InfoRestaurante?.NombreLocal} -{" "}
              {OpenModal.InfoRestaurante?.Direccion ||
                "Dirección no disponible"}
            </span>
          </DialogTitle>
          <DialogDescription>
            <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
              <div className="grid grid-cols-1 gap-4">
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
                    Fecha <span className="text-red-600">(*)</span>
                  </Label>
                  <div>
                    <input
                      className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                      type="datetime-local"
                      name="Fecha Reserva"
                      id="FechaReserva"
                      //min date hoy
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="Celular" className="">
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
                <div className="space-y-2">
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
