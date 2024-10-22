"use client";

import { useEffect, useState } from "react";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { db, storage } from "@/firebase/firebaseClient";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function RestaurantMoments() {
  const [moments, setMoments] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    if (e.target.files) {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // upload images firebase storage
    const imageUrls = await Promise.all(
      images.map(async (image) => {
        const imageRef = ref(storage, `MomentosLindos/${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        return url;
      })
    );

    const newMoment = {
      id: Date.now().toString(),
      title,
      description,
      images: imageUrls,
    };

    await addDoc(collection(db, "MomentosLindos"), newMoment);

    toast({
      title: "Momento lindo subido",
      description: "Tu momento ha sido guardado exitosamente.",
    });
    setIsOpen(false);
    // Reset the form
    setTitle("");
    setDescription("");
    setImages([]);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "MomentosLindos"),
      (snapshot) => {
        setMoments(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      },
      (error) => {
        console.error("Error fetching MomentosLindos document:", error);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">
        Momentos Lindos del Restaurante
      </h1>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="mb-4 text-black">
            Subir Momento Lindo
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-black">
              Subir Momento Lindo
            </DialogTitle>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {moments.map((moment) => (
          <Card key={moment.id}>
            <CardHeader>
              <CardTitle>{moment.title}</CardTitle>
              <CardDescription>{moment.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {moment.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Imagen ${index + 1} de ${moment.title}`}
                    className="w-full h-32 object-cover rounded"
                  />
                ))}
              </div>
              <div className="mt-4">
                <Button
                  onClick={async (e) => {
                    e.preventDefault();
                    if (confirm("¿Estás seguro de eliminar el momento?")) {
                      await deleteDoc(
                        doc(db, "MomentosLindos", `${moment.id}`)
                      );
                    }
                  }}
                >
                  Eliminar Momento
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {moments.length === 0 && (
        <p className="text-center text-gray-500 mt-4">
          No hay momentos lindos para mostrar aún.
        </p>
      )}
    </div>
  );
}
