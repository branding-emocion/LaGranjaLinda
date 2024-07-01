import React from "react";
import Title from "../Title";

const Carta = () => {
  return (
    <div className="  bg-[#eaeaea]  mb-10">
      <Title title={"Nuestra Carta"} image="/One.webp" />

      <div className="container mx-auto ">
        <div className=" flex justify-center items-center  p-1 lg:p-7 gap-x-10">
          <div className="w-full h-full  rounded-lg ">
            <iframe
              src="/Carta.pdf"
              frameborder=""
              className="w-full h-[82vh] rounded-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carta;
