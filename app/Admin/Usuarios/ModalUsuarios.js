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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/firebase/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const ModalUsuarios = ({ OpenModal, setOpenModal }) => {
  const [InputValues, setInputValues] = useState({});
  const [Loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [Restaurantes, setRestaurantes] = useState([]);

  const Roles = [
    {
      value: "Admin",
      label: "Admin",
    },
    {
      value: "Mostrador",
      label: "Mostrador",
    },

    {
      value: "Cliente",
      label: "Cliente",
    },
  ];

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
    console.log("InputValues", InputValues);
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

  console.log(OpenModal);

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
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="NombreCompleto" className="">
                Nombre Completo <span className="text-red-600"> (*)</span>
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
              <Label htmlFor="Rol" className="">
                Rol <span className="text-red-600"> (*)</span>
              </Label>
              <Select
                value={OpenModal?.InfoEditar?.Rol}
                required
                onValueChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    Rol: e,
                  });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Define Rol del Usuario" />
                </SelectTrigger>
                <SelectContent>
                  {Roles.map((rol) => (
                    <SelectItem key={rol.value} value={rol.value}>
                      {rol.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {(InputValues?.Rol == "Mostrador" ||
              OpenModal?.InfoEditar?.Rol == "Mostrador") && (
              <div className="space-y-2">
                <Label htmlFor="Restaurante" className="">
                  Restaurante <span className="text-red-600"> (*)</span>
                </Label>
                <Select
                  value={
                    InputValues?.IdRestaurante ||
                    OpenModal?.InfoEditar?.IdRestaurante
                  }
                  required
                  onValueChange={(e) => {
                    setInputValues({
                      ...InputValues,
                      IdRestaurante: e,
                    });
                  }}
                >
                  <SelectTrigger className="">
                    <SelectValue placeholder="Define restaurante del Usuario" />
                  </SelectTrigger>
                  <SelectContent>
                    {Restaurantes?.map((restaurante) => (
                      <SelectItem key={restaurante.id} value={restaurante.id}>
                        {restaurante.NombreLocal}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="Correo" className="">
                Correo <span className="text-red-600"> (*)</span>
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
                Pass <span className="text-red-600"> (*)</span>
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
      </DialogContent>
    </Dialog>
  );
};

export default ModalUsuarios;
