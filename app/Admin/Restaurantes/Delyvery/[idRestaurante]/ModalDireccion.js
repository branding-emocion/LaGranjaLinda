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

import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";

import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";

const ModalDireccion = ({ OpenModal, setOpenModal, idRestaurante }) => {
  const [InputValues, setInputValues] = useState({});

  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();

  const closeOpenModal = () => {
    setOpenModal({
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
      if (Object.keys(OpenModal?.InfoEditar).length > 0) {
        if (Object.keys(InputValues).length > 0) {
          const UpdateRef = doc(
            db,
            "Restaurantes",
            `${idRestaurante}`,
            `${OpenModal?.InfoEditar?.id}`
          );

          // Set the "capital" field of the city 'DC'
          await updateDoc(UpdateRef, {
            ...InputValues,
          });
        }
      } else {
        const docRef = await addDoc(
          collection(db, "Restaurantes", `${idRestaurante}`, "Delyvery"),
          {
            ...InputValues,

            createdAt: serverTimestamp(),
          }
        );
      }
    } catch (err) {
      console.error("Error:", err);
      toast({
        title: err?.error?.errorInfo?.code || "Internal Server Error",
        description: err?.error?.errorInfo?.message || "Contacte con soporte",
      });
    } finally {
      setLoading(false);
      //   closeOpenModal();
    }
  };

  return (
    <Dialog open={OpenModal?.Visible} onOpenChange={closeOpenModal}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>
            {Object.keys(OpenModal?.InfoEditar).length > 0
              ? "Editar"
              : "Agregar"}{" "}
            un direcciones de envio DELYVERY
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="NombreUbicacion" className="">
                Nombre del sitio <span className="text-red-600">(*)</span>
              </Label>
              <Input
                id="NombreUbicacion"
                name="NombreUbicacion"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModal?.InfoEditar?.NombreUbicacion}
                required
                autoComplete="off"
                autoFocus
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ValorDomicilio" className="">
                Valor del Domicilio S/ <span className="text-red-600">(*)</span>
              </Label>
              <Input
                id="ValorDomicilio"
                name="ValorDomicilio"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModal?.InfoEditar?.Precio}
                required
                autoComplete="off"
                type="number"
                step="0.01"
              />
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="Ruc" className="">
                Ruc <span className="text-red-600">(*)</span>
              </Label>
              <Input
                id="Ruc"
                name="Ruc"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModal?.InfoEditar?.Ruc}
                required
                autoComplete="off"
                type="text"
                pattern=".{6,}"
                title="6 caracteres mínimo"
              />
            </div> */}
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

export default ModalDireccion;
