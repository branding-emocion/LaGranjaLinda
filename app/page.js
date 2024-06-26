"use client";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

import Link from "next/link";

const HomePage = () => {
  return (
    <div className="">
      <Carousel infiniteLoop autoPlay showStatus={false} showIndicators={false}>
        <div className="relative w-full h-[21rem]  sm:h-[84vh] bg-[#004f51]/80">
          <Image
            src={
              "https://img.freepik.com/psd-gratis/menu-comida-restaurante-plantilla-portada-facebook_106176-3738.jpg?t=st=1719356895~exp=1719360495~hmac=e0a6bd0944a3748e22347c96e1de890326b8e5c1af2e601db397cc593655380a&w=826"
            }
            alt="banner1"
            fill
            style={{
              objectFit: "cover",
            }}
          />
          <div className="absolute top-0 left-0 bg-[#004f51]/30 w-full h-full" />
        </div>
      </Carousel>
    </div>
  );
};

export default HomePage;
