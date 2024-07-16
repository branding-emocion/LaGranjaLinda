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
import FileUploader from "../FileUploader";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseClient";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";

const ModalProductos = ({ OpenModal, setOpenModal, Categorias }) => {
  const [InputValues, setInputValues] = useState({});
  const [files, setFiles] = useState([]);

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

  const uploadImages = async (images, name) => {
    const urlLinks = await Promise.all(
      images.map(async (image, index) => {
        const imageRef = ref(storage, `Productos/${name}/image-${index}.jpg`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        return url;
      })
    );
    return urlLinks;
  };
  const HandlerSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (Object.keys(OpenModal?.InfoEditar).length > 0) {
        if (Object.keys(InputValues).length > 0) {
          const UpdateRef = doc(
            db,
            "Productos",
            `${OpenModal?.InfoEditar?.id}`
          );

          // Set the "capital" field of the city 'DC'
          await updateDoc(UpdateRef, {
            ...InputValues,
          });
        }
        if (files?.length > 0) {
          // Borrar las imágenes antiguas
          const ImgRef = ref(
            storage,
            `Productos/${OpenModal?.InfoEditar?.NombreProducto?.replace(
              /\s+/g,
              "_"
            )}/`
          );
          listAll(ImgRef)
            .then((res) => {
              res.items.forEach((itemRef) => {
                // Ahora debes borrar cada objeto (archivo)
                deleteObject(itemRef).catch((error) => {
                  // Maneja cualquier error
                  alert(` Error al eliminar ${itemRef.fullPath}`);
                  console.log(`Error al eliminar ${itemRef.fullPath}`, error);
                });
              });
            })
            .catch((error) => {
              // Maneja cualquier error
              console.error("Error al listar los objetos", error);
            });

          const NombreCarpeta =
            InputValues?.NombreProducto?.replace(/\s+/g, "_") ||
            OpenModal?.InfoEditar?.NombreProducto?.replace(/\s+/g, "_");

          // toca modificar la funcion y enviarle el values para que funcione mejor
          const ImagesUrl = await uploadImages(files, NombreCarpeta);

          const UpdateRef = doc(
            db,
            "Productos",
            `${OpenModal?.InfoEditar?.id}`
          );
          await updateDoc(UpdateRef, {
            Imagenes: ImagesUrl,
          });
        }
        closeOpenModal();
      } else {
        if (!files?.length > 0) {
          toast({
            title: "Alerta",
            description: "Por favor seleccione una imágen para el restaurante",
          });

          return;
        }

        const NombreCarpeta = InputValues?.NombreProducto?.replace(/\s+/g, "_");

        const ImagesUrl = await uploadImages(files, NombreCarpeta); // Asegúrate de que la promesa se haya resuelto

        const docRef = await addDoc(collection(db, "Productos"), {
          ...InputValues,
          Imagenes: ImagesUrl || [], // Ahora ImagesUrl es una matriz de cadenas de texto
          createdAt: serverTimestamp(),
        });

        closeOpenModal();
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
    <Dialog open={OpenModal?.Visible} onOpenChange={closeOpenModal}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle>
            {Object.keys(OpenModal?.InfoEditar).length > 0
              ? "Editar"
              : "Agregar"}{" "}
            un producto
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form onSubmit={HandlerSubmit} className="space-y-4 w-full h-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="NombreProducto" className="">
                Nombre del producto <span className="text-red-600">(*)</span>
              </Label>
              <Input
                id="NombreProducto"
                name="NombreProducto"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModal?.InfoEditar?.NombreProducto}
                required
                autoComplete="off"
                autoFocus
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Disponibilidad" className="">
                Disponibilidad? <span className="text-red-600">(*)</span>
              </Label>
              <Select
                value={
                  InputValues?.Disponibilidad ||
                  OpenModal?.InfoEditar?.Disponibilidad
                }
                required
                onValueChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    Disponibilidad: e,
                  });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="El producto esta disponibles? " />
                </SelectTrigger>
                <SelectContent>
                  {[
                    // esAdicional
                    { id: "Si", label: "Si" },
                    { id: "No", label: "No" },
                  ].map((adi, key) => (
                    <SelectItem key={adi.id} value={adi.id}>
                      {adi.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Precio" className="">
                Precio S/ <span className="text-red-600">(*)</span>
              </Label>
              <Input
                id="Precio"
                name="Precio"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModal?.InfoEditar?.Precio}
                required
                autoComplete="off"
                type="number"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="EstimadoDia" className="">
                Estimado del producto al Dia
              </Label>
              <Input
                id="EstimadoDia"
                name="EstimadoDia"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModal?.InfoEditar?.EstimadoDia}
                autoComplete="off"
                type="number"
                //step numeros como 123456
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="Categoria" className="">
                Categoria
              </Label>
              <Select
                value={
                  InputValues?.Categoria || OpenModal?.InfoEditar?.Categoria
                }
                onValueChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    Categoria: e,
                  });
                }}
                id="Categoria"
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Define categoría del producto" />
                </SelectTrigger>
                <SelectContent>
                  {Categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.id}>
                      {categoria.NombreCategoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="Adicional" className="">
                Adicional?
              </Label>
              <Select
                value={
                  InputValues?.esAdicional || OpenModal?.InfoEditar?.esAdicional
                }
                required
                onValueChange={(e) => {
                  setInputValues({
                    ...InputValues,
                    esAdicional: e,
                  });
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Es adicional ?" />
                </SelectTrigger>
                <SelectContent>
                  {[
                    // esAdicional
                    { id: "Si", label: "Si" },
                    { id: "No", label: "No" },
                  ].map((adi, key) => (
                    <SelectItem key={adi.id} value={adi.id}>
                      {adi.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="lg:col-span-2">
              <Label htmlFor="Imagenes">
                Imagen Principal <span className="text-red-600"> (*)</span>
              </Label>
              <FileUploader
                setFiles={setFiles}
                files={files}
                Modal={OpenModal}
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="Descripcion" className="">
                Descripción del producto
              </Label>
              <Textarea
                id="Descripcion"
                name="Descripcion"
                className="w-full text-gray-900"
                onChange={HandlerChange}
                defaultValue={OpenModal?.InfoEditar?.Descripcion}
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
            Guardar{" "}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ModalProductos;
