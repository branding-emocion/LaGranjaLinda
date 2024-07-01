"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgePlus, PlusIcon } from "lucide-react";
import { db, storage } from "@/firebase/firebaseClient";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import FileUploader from "../FileUploader";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useToast } from "@/components/ui/use-toast";

const Carousel = () => {
  const [BannerInicio, setBannerInicio] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const uploadImages = async (images, name) => {
    const urlLinks = await Promise.all(
      images.map(async (image, index) => {
        const imageRef = ref(storage, `${name}/image-${index}.jpg`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        return url;
      })
    );
    return urlLinks;
  };

  useEffect(
    () =>
      onSnapshot(
        doc(db, `Carrousel`, "Inicio"),
        // orderBy("email", "asc"),
        (snapshot) => {
          console.log(snapshot.data());
          setBannerInicio(snapshot?.data()?.Imagenes || []);
          // if (snapshot.empty) {
          //   console.log("No matching documents.");
          //   return;
          //
        }

        //setHabits(snapshot.docs.map((doc) => doc.data())); // make sure that setHabits works and sets snapshot to habits
        //console.log(habits); // habits should have the habits from firebase, not the initial habits we hardcoded
      ),
    []
  );

  return (
    <>
      <div className="space-y-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Bienvenido al módulo de Carrousel</CardTitle>

            <CardDescription>
              En esta sección, puedes ver y modificar los Carrousel .
            </CardDescription>
            <div>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  console.log(e);
                  setOpenModal({
                    Visible: true,
                    InfoEditar: {},
                  });
                }}
                className="space-x-2"
              >
                <BadgePlus />
                <p>Agregar nuevo </p>
              </Button>
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Carrousel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label
                htmlFor="Imagenes"
                className="block text-sm font-edium text-gray-900"
              >
                Banner Inicio <span className="text-red-500"> (*)</span>
              </label>
              <FileUploader
                setFiles={setBannerInicio}
                files={BannerInicio}
                Modal={{
                  InfoEditar: {
                    Imagenes: BannerInicio || [],
                  },
                }}
              />
              <Button
                className="bg-lagranja"
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    setIsLoading(true);
                    const NewBanner = BannerInicio?.filter(
                      (baner) => baner.name
                    );

                    if (NewBanner?.length > 0) {
                      // Borrar las imágenes antiguas
                      const ImgRef = ref(storage, `Carrousel/`);
                      listAll(ImgRef)
                        .then((res) => {
                          res.items.forEach((itemRef) => {
                            // Ahora debes borrar cada objeto (archivo)
                            deleteObject(itemRef).catch((error) => {
                              // Maneja cualquier error
                              alert(` Error al eliminar ${itemRef.fullPath}`);
                              console.log(
                                `Error al eliminar ${itemRef.fullPath}`,
                                error
                              );
                            });
                          });
                        })
                        .catch((error) => {
                          // Maneja cualquier error
                          console.error("Error al listar los objetos", error);
                        });

                      // toca modificar la funcion y enviarle el values para que funcione mejor
                      const ImagesUrl = await uploadImages(
                        NewBanner,
                        "Carrousel"
                      );

                      await setDoc(doc(db, "Carrousel", "Inicio"), {
                        Imagenes: ImagesUrl,
                      });
                      toast({
                        title: "Alerta",
                        description: "No hay información para editar",
                      });
                    }
                  } catch (error) {
                    console.log(error);
                    alert("intente de nuevo");
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={IsLoading}
              >
                <PlusIcon /> Guardar{" "}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Carousel;
