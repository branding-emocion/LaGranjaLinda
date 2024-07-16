"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import { useToast } from "@/components/ui/use-toast";
import React, { useEffect, useState } from "react";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { useDrop } from "react-dnd";
import { LogIn } from "lucide-react";
import Product from "./Drag/Product";

const ModalAdicionales = ({ ModalAditional, setModalAditional }) => {
  const [Loading, setLoading] = useState(false);

  const [selectedAdicionales, setSelectedAdicionales] = useState(
    ModalAditional?.Producto?.Adicionales || []
  );

  const { toast } = useToast();

  const closeModalAditional = () => {
    setModalAditional({
      Visible: false,
      Producto: {},
      ProductosAdiconales: [],
    });
  };

  const HandlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const NewData = selectedAdicionales.map((adicional) => ({
        id: adicional.id,
        NombreProducto: adicional.NombreProducto,
      }));

      await updateDoc(doc(db, "Productos", ModalAditional.Producto.id), {
        Adicionales: NewData,
      });

      toast({
        title: "Adicionales actualizados",
        description: "Los adicionales se actualizaron correctamente",
      });
      closeModalAditional();
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
    <Dialog open={ModalAditional?.Visible} onOpenChange={closeModalAditional}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>Adicionales al producto</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={HandlerSubmit}>
          <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
              Selecciona los adicionales
            </h1>
            <Product
              product={ModalAditional?.Producto}
              adicionales={ModalAditional?.ProductosAdiconales}
              selectedAdicionales={selectedAdicionales}
              setSelectedAdicionales={setSelectedAdicionales}
            />

            <Button
              disabled={Loading}
              className=" mt-4   disabled:cursor-not-allowed disabled:opacity-50"
            >
              Guardar{" "}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalAdicionales;
