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

const ModalDistrito = ({ OpenModalDistrito, setOpenModalDistrito }) => {
  const [InputValues, setInputValues] = useState({});
  const [files, setFiles] = useState([]);

  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();

  const closeOpenModalDistrito = () => {
    setOpenModalDistrito({
      Visible: false,
      InfoEditar: {},
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
      if (Object.keys(OpenModalDistrito?.InfoEditar).length > 0) {
        if (Object.keys(InputValues).length > 0) {
          const UpdateRef = doc(
            db,
            "Distritos",
            `${OpenModalDistrito?.InfoEditar?.id}`
          );

          let newDataGuardar = {
            ...InputValues,
          };

          if (InputValues?.HoraInicio) {
            newDataGuardar = {
              ...newDataGuardar,
              HoraInicioTimes: serverTimestamp(InputValues?.HoraInicio),
            };
          }
          if (InputValues?.HoraFin) {
            newDataGuardar = {
              ...newDataGuardar,
              HoraFinTimes: serverTimestamp(InputValues?.HoraFin),
            };
          }

          // Set the "capital" field of the city 'DC'
          if (Object.keys(InputValues)?.length > 0) {
            await updateDoc(UpdateRef, {
              ...newDataGuardar,
            });
          }
        }

        closeOpenModalDistrito();
      } else {
        let newDataGuardar = {
          ...InputValues,
        };

        if (InputValues?.HoraInicio) {
          newDataGuardar = {
            ...newDataGuardar,
            HoraInicioTimes: serverTimestamp(InputValues?.HoraInicio),
          };
        }
        if (InputValues?.HoraFin) {
          newDataGuardar = {
            ...newDataGuardar,
            HoraFinTimes: serverTimestamp(InputValues?.HoraFin),
          };
        }
        const docRef = await addDoc(collection(db, "Distritos"), {
          ...newDataGuardar,
          // add timestamp creat_at
          createdAt: serverTimestamp(),
        });

        closeOpenModalDistrito();
      }
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
    <Dialog
      open={OpenModalDistrito?.Visible}
      onOpenChange={closeOpenModalDistrito}
    >
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>
            {Object.keys(OpenModalDistrito?.InfoEditar).length > 0
              ? "Editar"
              : "Agregar"}{" "}
            un restaurante
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="NombreDistrito" className="">
                Nombre del Distrito <span className="text-red-600">(*)</span>
              </Label>
              <Input
                id="NombreDistrito"
                name="NombreDistrito"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModalDistrito?.InfoEditar?.NombreDistrito}
                required
                autoComplete="off"
                autoFocus
                type="text"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Descripcion" className="">
                Descripción
              </Label>
              <Input
                id="Descripcion"
                name="Descripcion"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModalDistrito?.InfoEditar?.Descripcion}
                autoComplete="off"
                type="text"
              />
            </div>
            {/* Ahorario de atención hora inicio hora fin genera el codigo laben y input para agregar la hora*/}
          </div>

          <Button
            disabled={Loading}
            className="   disabled:cursor-not-allowed disabled:opacity-50"
            type="submit"
          >
            Guardar{" "}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalDistrito;
