import React from "react";
import Title from "../Title";

const Nosotros = () => {
  return (
    <div className="  bg-[#eaeaea]  mb-10">
      <Title title={"Nosotros"} image="/One.webp" />

      <div className="container mx-auto ">
        <div className=" flex justify-center items-center  p-1 lg:p-10 gap-x-10">
          <div className=" bg-white p-5 md:p-10 rounded-lg ">
            <div className=" flex flex-col items-center  space-y-7 ">
              <p className="text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Consectetur sint fugiat deleniti fugit tenetur necessitatibus
                voluptatum impedit odit aliquid aliquam numquam, molestiae
                consequuntur harum officia sequi sed dolores nulla esse.
              </p>

              <div>
                <h1 className="font-bold text-2xl pb-4 text-center">
                  Nuestros Pilares
                </h1>
                <ul className="list-decimal pl-3 md:pl-0 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <li>
                    <span className="font-bold text-xl">Seguridad</span>
                    <p>Aislaciones sísmicas.</p>
                  </li>
                  <li>
                    <span className="font-bold text-xl">Innovación</span>
                    <p>Diseños a la vanguardia.</p>
                  </li>
                  <li>
                    <span className="font-bold text-xl">Calidad</span>
                    <p>Los mejores materiales.</p>
                  </li>
                  <li>
                    <span className="font-bold text-xl">Modernidad</span>
                    <p>Cocinas, entradas y ascensores de lujo.</p>
                  </li>
                  <li>
                    <span className="font-bold text-xl">Espacios</span>
                    <p>Amplios y cómodos cuartos principales.</p>
                  </li>
                  <li>
                    <span className="font-bold text-xl">Céntricos</span>
                    <p>Obras estratégicamente ubicadas.</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
