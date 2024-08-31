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
import { auth } from "@/firebase/firebaseClient";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";

const ModalRecoveryPass = ({ OpenModalReset, setOpenModalReset }) => {
  const [CorreoValue, setCorreoValue] = useState("");
  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();

  const closeModal = () => {
    setOpenModalReset(false);
    setCorreoValue("");
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, CorreoValue);
      toast({
        title: "Recuperar Contraseña",
        description: "Se ha enviado un enlace a tu correo electrónico",
      });
      closeModal();
    } catch (error) {
      const errorCode = error.code;
      console.log("error", error);
      toast({
        title: "Error",
        description: "Error al intentar recuperar la contraseña",
      });

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={OpenModalReset} onOpenChange={closeModal}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>Recuperar Contraseña</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form
          onSubmit={handlePasswordReset}
          className="space-y-4 w-full h-full"
        >
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="CorreoRecovery" className="">
                Correo Electrónico
                <span className="text-red-600"> (*)</span>
              </Label>
              <Input
                id="CorreoRecovery"
                name="CorreoRecovery"
                className="w-full text-gray-900"
                onChange={(e) => {
                  setCorreoValue(e.target.value);
                }}
                required
                autoComplete="off"
                autoFocus
                type="email"
              />
            </div>
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

export default ModalRecoveryPass;
