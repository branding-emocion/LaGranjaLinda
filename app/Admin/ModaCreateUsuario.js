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
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { addDoc, doc, setDoc } from "firebase/firestore";
import { auth, db } from "@/firebase/firebaseClient";

const ModalCreateUsuario = ({ ModalNewUser, setModalNewUser }) => {
  const [InputValues, setInputValues] = useState({});
  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();

  const closeModal = () => {
    setModalNewUser(false);
    setInputValues({});
  };
  const HandlerChange = (e) => {
    setInputValues({
      ...InputValues,
      [e.target.name]: e.target.value,
    });
  };

  const createUser = async (email, password, displayName, phoneNumber) => {
    try {
      // Crear el usuario
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Actualizar el perfil del usuario (solo displayName y photoURL son permitidos)
      await updateProfile(user, { displayName });

      // Agregar datos adicionales en Firestore
      await setDoc(doc(db, "Usuarios", user.uid), {
        phoneNumber: phoneNumber,
        email: email,
        displayName: displayName,
        role: "user",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Error creando el usuario ",
      });
      console.error("Error creating user:", error);
    }
  };
  const HandlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!InputValues.NumeroCelular) {
      toast({
        title: "Numero de celular",
        description: "Ingrese un numero de celular",
      });
      return;
    }
    createUser(
      InputValues.Correo,
      InputValues.Password,
      InputValues.NombreCompleto,
      InputValues.NumeroCelular
    );
  };

  return (
    <Dialog open={ModalNewUser} onOpenChange={closeModal}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>Crear Usuario</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="NombreCompleto" className="">
                Nombre Completo <span className="text-red-600"> (*)</span>
              </Label>
              <Input
                id="NombreCompleto"
                name="NombreCompleto"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                required
                autoComplete="off"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Correo" className="">
                Correo <span className="text-red-600"> (*)</span>
              </Label>
              <Input
                id="Correo"
                name="Correo"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                required
                autoComplete="off"
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Password" className="">
                Password <span className="text-red-600"> (*)</span>
              </Label>

              <Input
                id="Password"
                name="Password"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                required
                autoComplete="off"
                type="text"
                pattern=".{6,}"
                title="6 caracteres mínimo"
              />
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
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="Direccion" className="">
                Dirección <span className="text-red-600"> (*)</span>
              </Label>
              <Input
                id="Direccion"
                name="Direccion"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                required
                autoComplete="off"
                type="text"
                pattern=".{6,}"
                title="6 caracteres mínimo"
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

export default ModalCreateUsuario;
