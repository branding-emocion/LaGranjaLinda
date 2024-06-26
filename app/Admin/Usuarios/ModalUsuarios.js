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

const ModalUsuarios = ({ OpenModal, setOpenModal }) => {
  const [InputValues, setInputValues] = useState({});
  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();
  const closeModal = () => {
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
      if (!Object.keys(InputValues).length) {
        toast({
          title: "Alerta",
          description: "No hay información para editar",
        });
        return;
      }

      const endpoint = "/api/Usuario";

      const method = OpenModal?.InfoEditar?.uid ? "PUT" : "POST";

      const Send = {
        uid: OpenModal?.InfoEditar?.uid,
        ...InputValues,
      };

      const response = await fetch(endpoint, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Send),
      });

      const responseData = await response.json();

      if (!response.ok) {
        toast({
          title: "Alerta",
          description:
            responseData?.error?.errorInfo?.message ||
            responseData?.error?.message ||
            "Error Interno",
        });
        return;
      }

      toast({
        title: OpenModal?.InfoEditar?.uid ? "Editar" : "Agregar",
        description: responseData.body,
      });
      setInputValues({});
      closeModal();
      toast({
        title: "Alerta",
        description: responseData?.body || "",
      });
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

  console.log("OpenModal", OpenModal);
  return (
    <Dialog open={OpenModal?.Visible} onOpenChange={closeModal}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>
            {Object.keys(OpenModal?.InfoEditar).length > 0
              ? "Editar"
              : "Agregar"}{" "}
            un usuario
          </DialogTitle>
          <DialogDescription>
            <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="NombreCompleto" className="">
                    Nombre Completo
                  </Label>
                  <Input
                    id="NombreCompleto"
                    name="NombreCompleto"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    defaultValue={OpenModal?.InfoEditar?.displayName}
                    required
                    autoComplete="off"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Correo" className="">
                    Correo
                  </Label>
                  <Input
                    id="Correo"
                    name="Correo"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    defaultValue={OpenModal?.InfoEditar?.email}
                    required
                    autoComplete="off"
                    type="email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="Pass" className="">
                    Pass
                  </Label>
                  <Input
                    id="Pass"
                    name="Pass"
                    className="w-full text-gray-900"
                    onChange={HandlerChange}
                    defaultValue={OpenModal?.InfoEditar?.password}
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
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ModalUsuarios;
