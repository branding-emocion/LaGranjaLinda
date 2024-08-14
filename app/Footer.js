"use client";
import { Facebook, Linkedin, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <>
      <footer className="border-t -mt-[41px]  py-6 px-4 lg:px-0 bg-granjaSecondary text-white">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 justify-center gap-4 items-center sm:items-start">
          <div className=" lg:mx-auto  ">
            <h1 className="font-semibold mb-2 text-xl">Granja Linda</h1>
            <hr className="mb-2" />
            <div className="space-y-2">
              <div className="flex space-x-2 items-center ">
                <ul>
                  <li>
                    <Link href={"/Nosotros"}>Nosotros</Link>
                  </li>
                  <li>
                    <Link href={"/Nutricion"}>Nuestras Experiencias</Link>
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
            <h1 className="font-semibold mb-2 text-xl uppercase">Servicios</h1>
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
            <h1 className="font-semibold mb-2 text-xl uppercase">
              POLÍTICAS Y TÉRMINOS
            </h1>
            <hr className="mb-2" />
            <div className="space-y-2">
              <div className="flex space-x-2 items-center ">
                <ul>
                  <li>
                    <Link href={"/Delivery"}>Términos y Condiciones</Link>
                  </li>
                  <li>
                    <Link href={"/PoliticasPrivacidad"}>
                      Políticas de privacidad
                    </Link>
                  </li>
                  <li>
                    <Link href={"/TerminosCondiciones"}>
                      Términos y Condiciones
                    </Link>
                  </li>
                  <li>
                    <Link href={"/PromocionesComerciales"}>
                      Promociones Comerciales
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className=" lg:mx-auto  ">
            <h1 className="font-semibold mb-2 text-xl uppercase">
              CONTÁCTANOS
            </h1>
            <hr className="mb-2" />
            <div className="space-y-2">
              <div className="flex space-x-2 items-center ">
                <ul>
                  <li>
                    <Link href={"/Escríbenos"}>Escríbenos</Link>
                  </li>
                  <li>
                    <Link href={"/Reservas"}>Trabaja con nosotros</Link>
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
