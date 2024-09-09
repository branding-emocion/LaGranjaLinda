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
import { BadgePlus, PlusIcon, XIcon } from "lucide-react";
import { db, storage } from "@/firebase/firebaseClient";
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import FileUploader from "../FileUploader";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useToast } from "@/components/ui/use-toast";

const ImagenPromo = () => {
  const [ImagenesIMG, setImagenesIMG] = useState([]);
  const [Files, setFiles] = useState([]);
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

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, "Promos", "Inicio"),
      (snapshot) => {
        const Data = snapshot.data();
        setImagenesIMG(Data);
      },
      (error) => {
        console.error("Error fetching Carrousel data: ", error);
      }
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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
                Imagen de promo <span className="text-red-500"> (*)</span>
              </label>
              <FileUploader
                setFiles={setFiles}
                files={Files}
                Modal={{
                  InfoEditar: {
                    Imagenes: ImagenesIMG?.Imagenes || [],
                  },
                }}
              />
              <div className="flex gap-x-2">
                <Button
                  className="bg-lagranja"
                  onClick={async (e) => {
                    e.preventDefault();

                    try {
                      debugger;
                      setIsLoading(true);
                      const NewBanner = Files?.filter((baner) => baner.name);

                      if (NewBanner?.length > 0) {
                        // Borrar las imágenes antiguas
                        const ImgRef = ref(storage, `Promos/`);
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
                          "Promos"
                        );

                        await setDoc(doc(db, "Promos", "Inicio"), {
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
                <Button
                  onClick={async (e) => {
                    e.preventDefault();
                    setFiles([]);
                    setImagenesIMG([]);
                    const ImgRef = ref(storage, `Promos/`);
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

                    await updateDoc(doc(db, "Promos", "Inicio"), {
                      Imagenes: [],
                    });
                  }}
                  className="bg-red-600"
                >
                  <XIcon /> Borrar Promo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ImagenPromo;
