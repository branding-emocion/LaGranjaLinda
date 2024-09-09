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

const HomePage = () => {
  const [BannerInicio, setBannerInicio] = useState([]);
  const [TextosBanner, setTextosBanner] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  console.log(pathname);

  useEffect(() => {
    const docRef = doc(db, "Carrousel", "Inicio");
    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setBannerInicio(snapshot.data()?.Imagenes || []);
          setTextosBanner(snapshot.data()?.LinksBanner || []);
          setIsLoading(false);
        } else {
          console.log("No matching documents.");
        }
      },
      (error) => {
        console.error("Error fetching document:", error);
      }
    );

    // Limpieza del listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []);
  return (
    <div className="">
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
