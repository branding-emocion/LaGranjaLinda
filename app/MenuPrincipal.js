"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ItemMenu from "./ItemMenu";
import { usePathname } from "next/navigation";
import { PackageIcon, PhoneCall, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCarStore } from "@/store";
import { getCartTotal } from "@/lib/getCartTotal";
import useAuthState from "@/lib/useAuthState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/firebase/firebaseClient";

const MenuPrincipal = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const [Scroll, setScroll] = useState("");
  const [{ user, claims }, loading, error] = useAuthState(auth);

  const pathname = usePathname();

  const cart = useCarStore((state) => state.cart);
  const total = getCartTotal(cart);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <div>
      <div className="fixed top-[47%] right-4 z-[100]">
        <a
          href="https://api.whatsapp.com/send?phone=+51945756201&text=Hola%2C%20quiero%20m%C3%A1s%20informaci%C3%B3n%20sobre%20"
          target="_blank"
          title="Contacto via whatsapp"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-16 h-16 rounded-full bg-green-500 hover:bg-green-600 text-white focus:outline-none"
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth={0}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className="w-10 h-10  bg-green-500 "
          >
            <path d="M260.062 32C138.605 32 40.134 129.701 40.134 250.232c0 41.23 11.532 79.79 31.559 112.687L32 480l121.764-38.682c31.508 17.285 67.745 27.146 106.298 27.146C381.535 468.464 480 370.749 480 250.232 480 129.701 381.535 32 260.062 32zm109.362 301.11c-5.174 12.827-28.574 24.533-38.899 25.072-10.314.547-10.608 7.994-66.84-16.434-56.225-24.434-90.052-83.844-92.719-87.67-2.669-3.812-21.78-31.047-20.749-58.455 1.038-27.413 16.047-40.346 21.404-45.725 5.351-5.387 11.486-6.352 15.232-6.413 4.428-.072 7.296-.132 10.573-.011 3.274.124 8.192-.685 12.45 10.639 4.256 11.323 14.443 39.153 15.746 41.989 1.302 2.839 2.108 6.126.102 9.771-2.012 3.653-3.042 5.935-5.961 9.083-2.935 3.148-6.174 7.042-8.792 9.449-2.92 2.665-5.97 5.572-2.9 11.269 3.068 5.693 13.653 24.356 29.779 39.736 20.725 19.771 38.598 26.329 44.098 29.317 5.515 3.004 8.806 2.67 12.226-.929 3.404-3.599 14.639-15.746 18.596-21.169 3.955-5.438 7.661-4.373 12.742-2.329 5.078 2.052 32.157 16.556 37.673 19.551 5.51 2.989 9.193 4.529 10.51 6.9 1.317 2.38.901 13.531-4.271 26.359z" />
          </svg>

          {/* <FaWhatsapp className="w-10 h-10" />{" "} */}
        </a>
      </div>

      <Link
        href={"/basket"}
        className=" fixed top-[35%] right-0 z-40  border-2 border-[#7d2d04] rounded-l-lg bg-granjaPrimary flex w-32 justify-center items-center text-[#7d2d04] font-bold py-4 space-x-1 text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-10 h-10"
        >
          <circle cx={8} cy={21} r={1} />
          <circle cx={19} cy={21} r={1} />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>

        <div>
          <p className="text-xs font-extralight">
            {cart.length > 0 ? `${cart.length} Productos` : "No Productos"}
          </p>
          <p>{total}</p>
        </div>
      </Link>

      <Link
        href={"/Admin"}
        className=" fixed top-[23%] right-0 z-40  border-2 border-[#7d2d04] rounded-l-lg bg-granjaPrimary flex w-32 justify-center items-center text-[#7d2d04] font-bold py-4 space-x-1 text-sm"
      >
        <div className=" justify-center items-center ml-4 ">
          {/* <User className="w-6 h-6 text-white" /> */}
          <Avatar className="h-6 w-6 lg:w-9 lg:h-9">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>

        <p className="ml-2 text-sm text-wrap tracking-wide truncate uppercase">
          {user?.displayName || "Login / Registro"}
        </p>
      </Link>

      <Link
        href={"/Admin/Delivery"}
        className="md:hidden fixed bottom-0 right-0 z-40  border-2 border-[#7d2d04] rounded-l-lg bg-granjaPrimary flex w-full justify-center items-center text-[#7d2d04] font-bold py-5"
      >
        <Button className="bg-[#ce0d05]">Ordena Aquí</Button>
      </Link>

      <nav
        style={{
          filter: "drop-shadow(0px 0px 3px black)",

          //  poner de background una imagen esta en "/bg-web.jpg"
          backgroundImage: "url('/bg-web.jpg')",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "repeat",
        }}
        className={`sticky h-28 z-50 top-0 left-0 right-0 p-2 md:px-11 shadow-sm md:flex md:items-center md:justify-around 2xl:justify-around   `}
      >
        <div className="  flex justify-between items-center  ">
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
                className="h-10 w-10 text-[#7d2d04]"
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
          <h1 className="hidden   lg:block lg:text-white text-2xl ">
            Elige tu pedido, elige tu experiencia 
          </h1>
          <div
            className={` text-center  flex flex-col h-screen md:h-auto  md:flex md:flex-row  md:items-center  z-[-1] md:z-auto md:static gap-2 absolute text-white bg-[#ece4d9]    md:bg-transparent  w-full left-0 top-full md:w-auto md:py-0  md:pl-0 pl-7 md:opacity-100 opacity-0 right-[-400px] transition-all ease-in  ${
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
              ruta="/Delivery"
              setIsOpen={setIsOpen}
              border={pathname == "/Delivery" ? true : false}
            >
              Nuestra Carta
            </ItemMenu>
            {/* <ItemMenu
              ruta="/Promociones"
              setIsOpen={setIsOpen}
              border={pathname == "/Promociones" ? true : false}
            >
              Promociones
            </ItemMenu> */}
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
          <Link href="/Delivery">
            <Button className="bg-red-700 uppercase">Ordena Aquí</Button>
          </Link>

          <div className=" uppercase lg:flex text-white">
            <p className=" w-20 text-right  h-full tracking-tight leading-4">
              Te lo LLevamos donde estes
            </p>
            <div>
              <Smartphone className="w-14 h-full" />
            </div>
            <div className="">
              <h1>LLamanos</h1>
              <a className=" text-2xl" href="tel:+310403">
                310403
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MenuPrincipal;
