"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

export default function UploadMomentsModal({ ModalState, setModalState }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos al servidor
    console.log({ title, description, images });
    toast({
      title: "Momento lindo subido",
      description: "Tu momento ha sido guardado exitosamente.",
    });
    // Resetear el formulario
    setTitle("");
    setDescription("");
    setImages([]);
  };

  return (
    <Dialog
      open={ModalState?.Visible}
      onOpenChange={() => setModalState({ Visible: false })}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Subir Momento Lindo</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subir Momento Lindo</DialogTitle>
          <DialogDescription>
            Comparte un momento especial de tu restaurante. Completa los
            detalles a continuación.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="images" className="text-right">
                Imágenes
              </Label>
              <Input
                id="images"
                type="file"
                onChange={handleImageChange}
                className="col-span-3"
                accept="image/*"
                multiple
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Guardar momento</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
