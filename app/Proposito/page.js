"use client";

import React from "react";
import Title from "../Title";

const Proposito = () => {
  return (
    <div className="  bg-[#eaeaea]  mb-10">
      <Title title={"Propósito "} image="/One.webp" />

      <div className="container mx-auto ">
        <div className=" flex justify-center items-center  p-1 lg:p-7 gap-x-10">
          <div className="w-full h-full  rounded-lg ">
            <iframe
              src="/Pdf/NuestraHistoriaGL.pdf"
              className="w-full h-[82vh] rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposito;
