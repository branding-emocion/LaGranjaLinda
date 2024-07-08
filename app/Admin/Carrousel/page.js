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
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import FileUploader from "../FileUploader";
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Carousel = () => {
  const [BannerInicio, setBannerInicio] = useState([]);
  const [LinksBanner, setLinksBanner] = useState([]);
  const [IsLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  console.log("LinksBanner", LinksBanner);

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
      doc(db, "Carrousel", "Inicio"),
      (snapshot) => {
        const data = snapshot.data();
        if (data) {
          setBannerInicio(data.Imagenes || []);
          setLinksBanner(data.LinksBanner || []);
        }
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

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Link Imagenes </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <label
                htmlFor="Imagenes"
                className="block text-sm font-medium text-gray-900"
              >
                Link Imagenes
              </label>

              {BannerInicio?.map((imagen, index) => (
                <div key={index}>
                  <Label>Imagen {index + 1}</Label>{" "}
                  <Input
                    defaultValue={
                      LinksBanner.find((e) => e?.index === index)?.link || ""
                    }
                    onChange={(e) => {
                      const { value } = e.target;
                      setLinksBanner((prev) => {
                        const newLinks = prev.find((e) => {
                          return e.index === index;
                        });
                      });
                    }}
                    type="text"
                  />
                </div>
              ))}
              <Button
                className="bg-lagranja"
                onClick={async (e) => {
                  e.preventDefault();

                  try {
                    setIsLoading(true);

                    await updateDoc(doc(db, "Carrousel", "Inicio"), {
                      LinksBanner: LinksBanner,
                    });
                    toast({
                      title: "Notificación",
                      description: "Se agrego con correctamente ",
                    });
                  } catch (error) {
                    toast({
                      title: "Alerta",
                      description:
                        "Ha ocurrido un error intente otra vez o contacte con soporte",
                    });

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
