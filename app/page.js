"use client";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ModalPromo from "./ModalPromo";

const HomePage = () => {
  const [BannerInicio, setBannerInicio] = useState([]);
  const [TextosBanner, setTextosBanner] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const [OpenModalPromo, setOpenModalPromo] = useState({
    Visible: false,
    info: {},
  });

  useEffect(() => {
    // Suscripción a los cambios en el documento de "Carrousel"
    const carrouselRef = doc(db, "Carrousel", "Inicio");
    const carrouselUnsubscribe = onSnapshot(
      carrouselRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setBannerInicio(snapshot.data()?.Imagenes || []);
          setTextosBanner(snapshot.data()?.LinksBanner || []);
          setIsLoading(false);
        } else {
          console.log("No matching documents for Carrousel.");
        }
      },
      (error) => {
        console.error("Error fetching Carrousel document:", error);
      }
    );

    // Suscripción a los cambios en el documento de "Promos"
    const promoRef = doc(db, "Promos", "Inicio");
    const promoUnsubscribe = onSnapshot(
      promoRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setOpenModalPromo({
            Visible: true,
            info: snapshot.data(),
          });
        } else {
          console.log("No such document for Promo!");
        }
      },
      (error) => {
        console.error("Error fetching Promo document: ", error);
      }
    );

    // Limpieza de las suscripciones cuando el componente se desmonta
    return () => {
      carrouselUnsubscribe();
      promoUnsubscribe();
    };
  }, []);

  return (
    <div className="">
      {OpenModalPromo?.info?.Imagenes?.length > 0 && OpenModalPromo.Visible && (
        <ModalPromo
          OpenModalPromo={OpenModalPromo}
          setOpenModalPromo={setOpenModalPromo}
        />
      )}

      {IsLoading && !BannerInicio.length >= 0 ? (
        <Skeleton className="flex items-center justify-center h-[100vh] md:h-[84vh] mb-10" />
      ) : (
        <Carousel
          infiniteLoop
          autoPlay
          showStatus={false}
          showIndicators={false}
        >
          {BannerInicio?.map((imagen, index) => {
            const { link } =
              TextosBanner?.find((item) => item.index == index) || {};
            return (
              <div
                key={index}
                className="relative w-full h-[21rem]  sm:h-[84vh] bg-[#004f51]/80"
              >
                <Image
                  src={imagen}
                  alt={`carousel-${index}`}
                  fill
                  style={{
                    objectFit: "cover",
                  }}
                />
                {link && (
                  <div className="absolute top-0 left-0 w-full h-full">
                    <div className="w-full h-full flex justify-center items-end py-11">
                      {link?.split("/").includes(pathname) ? (
                        <Link href={link}>
                          <Button>Más Información</Button>
                        </Link>
                      ) : (
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button>Más Información</Button>
                        </a>
                      )}
                    </div>
                  </div>
                )}
                {/* <div className="absolute top-0 left-0 bg-[#004f51]/30 w-full h-full" /> */}
              </div>
            );
          })}
        </Carousel>
      )}
    </div>
  );
};

export default HomePage;
