"use client";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer
        className="border-t -mt-[41px]  py-6 px-4 lg:px-0 bg-granjaSecondary text-white"
        style={{
          filter: "drop-shadow(0px 0px 3px black)",

          //  poner de background una imagen esta en "/bg-web.jpg"
          backgroundImage: "url('/bg-botton.webp')",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "repeat",
        }}
      >
        <div className="grid sm:grid-cols-2 lg:grid-cols-5   justify-center gap-4 items-center sm:items-start">
          <div className=" lg:mx-auto  ">
            <div className="flex relative ">
              <h1 className="font-semibold mb-2 text-xl"> La Granja Linda</h1>
              <img
                src="/Iconos/Nata.png"
                alt=" log "
                className="w-24 h-24 object-cover absolute top-0 -left-28"
              />
            </div>
            <hr className="mb-2" />
            <div className="space-y-2">
              <div className="flex space-x-2 items-center ">
                <ul>
                  <li>
                    <Link href={"/Historia"}>Historia</Link>
                  </li>
                  <li>
                    <Link href={"/Historia"}>Propósito</Link>
                  </li>
                  <li>
                    <Link href={"/Misión"}>Misión</Link>
                  </li>
                  <li>
                    <Link href={"/Valores"}>Valores</Link>
                  </li>
                  <li>
                    <Link href={"/Creencias"}>Creencias</Link>
                  </li>
                  <li>
                    <Link href={"/Reclamaciones"}>
                      <Image
                        src="/LibroReclamaciones.webp"
                        width={150}
                        height={150}
                        alt="Libro de Reclamaciones"
                        style={{
                          objectFit: "cover",
                          cursor: "pointer",
                        }}
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className=" lg:mx-auto  ">
            <div className="relative">
              <h1 className="font-semibold mb-2 text-xl uppercase">
                Servicios
              </h1>
              <img
                src="/Iconos/Morita.png"
                alt=""
                className="w-24 h-24 object-cover absolute top-0 -left-28"
              />
            </div>
            <hr className="mb-2" />
            <div className="space-y-2">
              <div className="flex space-x-2 items-center ">
                <ul>
                  <li>
                    <Link href={"/Delivery"}>Delivery</Link>
                  </li>
                  <li>
                    <Link href={"/Reservas"}>Reservas</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className=" lg:mx-auto  ">
            <div className="relative">
              <h1 className="font-semibold mb-2 text-xl uppercase">
                POLÍTICAS Y TÉRMINOS
              </h1>

              <img
                src="/Iconos/Casa.png"
                alt=""
                className="w-24 h-24 object-cover absolute top-0 -left-28"
              />
            </div>
            <hr className="mb-2" />
            <div className="space-y-2">
              <div className="flex space-x-2 items-center ">
                <ul>
                  <li>
                    <Link href={"/Terminos"}>Términos y Condiciones</Link>
                  </li>
                  <li>
                    <Link href={"/Politica"}>Políticas de privacidad</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className=" lg:mx-auto  ">
            <h1 className="font-semibold mb-2 text-xl uppercase">
              Metodos de pago
            </h1>
            <hr className="mb-2" />
            <div className="space-y-2">
              <div className="flex space-x-2 items-center ">
                <ul>
                  <li>
                    <img
                      src="/Visa.png"
                      className="w-40 h-20 object-contain "
                      alt="visa"
                    />
                  </li>
                  <li>
                    <img
                      src="/yape.png"
                      className="w-40 h-20 object-contain "
                      alt="yape"
                    />
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className=" lg:mx-auto  ">
            <h1 className="font-semibold mb-2 text-xl uppercase">
              Metodos de pago
            </h1>
            <hr className="mb-2" />
            <div className="space-y-2">
              <div className="flex space-x-2 items-center ">
                <ul>
                  <li>
                    <Link href={"/Escribenos"}>Escríbenos</Link>
                  </li>
                  <li>
                    <Link href={"/Escribenos"}>Trabaja con nosotros</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="  sm:col-span-2 lg:col-span-4 ">
            <div className="">
              <hr className=" py-2 border-gray-300" />
              <div className="flex  flex-wrap items-center md:justify-between justify-center">
                <div className="w-full  px-4 mx-auto text-center">
                  <div className="text-sm font-semibold text-white ">
                    Copyright ©{" "}
                    <span id="get-current-year">
                      {new Date().getFullYear()}
                    </span>{" "}
                    La Granja Linda
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default Footer;
