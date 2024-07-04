"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ItemMenu from "./ItemMenu";
import { usePathname } from "next/navigation";
import { PhoneCall, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const MenuPrincipal = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [Scroll, setScroll] = useState("");

  const pathname = usePathname();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     const isElementVisible = window.scrollY > 40;
  //     if (isElementVisible) {
  //       setScroll("bg-lagranja ");
  //     } else {
  //       setScroll("bg-transparent");
  //     }
  //   };

  //   window.addEventListener("scroll", handleScroll);

  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // }, []);
  return (
    <>
      {/* <div className="fixed bottom-4 right-4 z-[100]">
        <a
          href="https://api.whatsapp.com/send?phone=51914125509&text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20"
          target="_blank"
          title="Contacto via whatsapp"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white focus:outline-none"
        >
          <FaWhatsapp className="w-10 h-10" />{" "}
        </a>
      </div> */}
      <nav
        style={{ filter: "drop-shadow(0px 0px 3px black)" }}
        className={`sticky h-28 z-50 top-0 p-2 md:px-11 shadow-sm md:flex md:items-center md:justify-around 2xl:justify-around bg-lagranja `}
      >
        <div className="  flex justify-between items-  ">
          {/* Escudo Logo "inicio" */}
          <Link href="/">
            <div
              // style={{ filter: "drop-shadow(0px 0px 6px #99C5B5)" }}
              className="cursor-pointer"
            >
              <Image
                title="Ir a inicio"
                src="/GranjaCompleto.webp"
                width={150}
                height={70}
                alt="Logotype"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          </Link>
          <span className="text-3xl cursor-pointer mx-2 md:hidden block text-white">
            <button name="Menu" onClick={() => setIsOpen(!isOpen)}>
              <svg
                className="h-10 w-10 text-white"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>{" "}
            </button>
          </span>
        </div>
        <div className="flex flex-col   ">
          <h1 className="hidden   lg:block lg:text-yellow-500 text-2xl ">
            Elige tu pedido, elige tu experiencia 
          </h1>
          <div
            className={` text-center  flex flex-col h-screen md:h-auto  md:flex md:flex-row  md:items-center  z-[-1] md:z-auto md:static gap-2 absolute text-white md:text-white bg-lagranja    md:bg-transparent  w-full left-0 top-full md:w-auto md:py-0  md:pl-0 pl-7 md:opacity-100 opacity-0 right-[-400px] transition-all ease-in  ${
              isOpen ? ` right-0 py-11 opacity-100` : `hidden`
            }`}
          >
            {/*  */}
            <ItemMenu
              ruta="/"
              setIsOpen={setIsOpen}
              border={pathname == "/" ? true : false}
            >
              Inicio
            </ItemMenu>
            <ItemMenu
              ruta="/Carta"
              setIsOpen={setIsOpen}
              border={pathname == "/Carta" ? true : false}
            >
              Nuestra Carta
            </ItemMenu>
            <ItemMenu
              ruta="/Promociones"
              setIsOpen={setIsOpen}
              border={pathname == "/Promociones" ? true : false}
            >
              Promociones
            </ItemMenu>
            <ItemMenu
              ruta="/Reservas"
              setIsOpen={setIsOpen}
              border={pathname == "/Reservas" ? true : false}
            >
              Reservas
            </ItemMenu>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center gap-x-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-red-700 uppercase">Ordena Aquí</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className=" w-full h-full">
                <Link className="w-full h-full" href="/Delivery">
                  Delivery
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="hover:cursor-pointer w-full h-full">
                <Link className="w-full h-full" href={`/Delivery?LLevar=true`}>
                  Llevar
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className=" uppercase lg:flex text-white">
            <p className=" w-20 text-right  h-full tracking-tight leading-4">
              Te lo LLevamos donde estes
            </p>
            <div>
              <Smartphone className="w-14 h-full" />
            </div>
            <div className="">
              <h1>LLamanos</h1>
              <a className="text-yellow-300 text-2xl" href="tel:+310403">
                310403
              </a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default MenuPrincipal;
