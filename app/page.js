"use client";
import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import Image from "next/image";

const HomePage = () => {
  return (
    <div className="">
      <Carousel infiniteLoop autoPlay showStatus={false} showIndicators={false}>
        <div className="relative w-full h-[21rem]  sm:h-[84vh] bg-[#004f51]/80">
          <Image
            src={"/"}
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
