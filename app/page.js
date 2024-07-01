"use client";
import React, { useEffect, useState } from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage = () => {
  const [BannerInicio, setBannerInicio] = useState([]);
  const [IsLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const docRef = doc(db, "Carrousel", "Inicio");
    const unsubscribe = async () => {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setBannerInicio(docSnap.data()?.Imagenes || []);
        setIsLoading(false);
      } else {
        console.log("No matching documents.");
      }
    };

    return () => unsubscribe();
  }, []);

  return (
    <div className="">
      {
        /* {IsLoading && <p>Cargando...</p>} */
        IsLoading ? (
          <Skeleton className="flex items-center justify-center h-[84vh]" />
        ) : (
          <Carousel
            infiniteLoop
            autoPlay
            showStatus={false}
            showIndicators={false}
          >
            {BannerInicio.map((imagen, index) => (
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
                <div className="absolute top-0 left-0 bg-[#004f51]/30 w-full h-full" />
              </div>
            ))}
          </Carousel>
        )
      }
    </div>
  );
};

export default HomePage;
