import React from "react";
import Title from "../Title";
import Image from "next/image";

const Promociones = () => {
  return (
    <div className="  bg-[#eaeaea]  mb-10">
      <Title title={"Promociones"} image="/One.webp" />

      <div className="container mx-auto ">
        <div className=" flex justify-center items-center  p-1 lg:p-7 gap-x-10 ">
          <div className=" bg-white p-5 md:p-10 rounded-lg w-full h-full grid grid-cols-1 md:grid-cols-2  gap-4">
            {[1, 2, 3].map((item, key) => (
              <div
                key={key}
                className=" flex w-full max-w-[48rem] flex-row rounded-xl border  text-gray-700 shadow-md "
              >
                <div className="relative m-0 w-[15rem] shrink-0 overflow-hidden rounded-xl rounded-r-none  bg-clip-border text-gray-700">
                  <Image
                    src="https://api.pardoschicken.pe/images/resource/products/499d2920-fb32-11ee-a970-bb0c6299a7d8"
                    alt="image"
                    className="h-full w-full object-cover"
                    fill
                  />
                </div>
                <div className="p-6">
                  <h4 className="mb-2 block font-sans text-2xl font-semibold leading-snug tracking-normal text-blue-gray-900 antialiased">
                    Promotion{" "}
                  </h4>
                  <p className="mb-8 block font-sans text-base font-normal leading-relaxed text-gray-700 antialiased">
                    Like so many organizations these days, Autodesk is a company
                    in transition. It was until recently a traditional boxed
                    software company selling licenses. Yet its own business
                    model disruption is only part of the story
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Promociones;
