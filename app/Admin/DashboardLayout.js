"use client";
import React, { useEffect, useState } from "react";
import Login from "./Login";
import useAuthState from "@/lib/useAuthState";
import { auth, db } from "@/firebase/firebaseClient";
import Link from "next/link";
import {
  Beef,
  BookmarkMinus,
  BookOpenText,
  BrickWall,
  CalendarCheck,
  CalendarClock,
  CalendarPlus,
  CircleDollarSign,
  FileText,
  GalleryHorizontal,
  GalleryThumbnails,
  HistoryIcon,
  MessageSquareDot,
  MonitorXIcon,
  PartyPopper,
  Users,
  Utensils,
  YoutubeIcon,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const DashboardLayout = ({ children }) => {
  const [{ user, claims }, loading, error] = useAuthState(auth);
  const [Tareas, setTareas] = useState([]);
  const [CantReservas, setCantReservas] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  // useEffect(() => {
  //   let qTotalReservas;

  //   if (claims?.IdRestaurante) {
  //     // Consulta para obtener todas las reservas del restaurante especificado en los claims
  //     qTotalReservas = query(
  //       collection(db, "Reservas"),
  //       where("Restaurante", "==", claims.IdRestaurante),
  //       where("Estado", "==", "Pendiente")
  //     );
  //   } else {
  //     // Consulta para obtener todas las reservas pendientes sin filtrar por restaurante
  //     qTotalReservas = query(
  //       collection(db, "Reservas"),
  //       where("Estado", "==", "Pendiente")
  //     );
  //   }

  //   // Suscripción para las reservas pendientes
  //   const unsubscribeTotal = onSnapshot(qTotalReservas, (snapshot) => {
  //     setCantReservas(snapshot.size); // Actualizar la cantidad de reservas pendientes
  //   });

  //   // Limpiar las suscripciones al desmontar el componente
  //   return () => {
  //     unsubscribeTotal();
  //   };
  // }, [claims?.IdRestaurante]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>error</p>;

  if (!user) return <Login />;

  const menu = [
    {
      name: "Usuarios",
      link: "/Admin/Usuarios",
      icon: <Users className="w-6 h-6 text-white" />,
      hidden: claims?.Rol?.includes("Admin") ? false : true,
    },
    {
      name: "Carrousel",
      link: "/Admin/Carrousel",
      icon: <GalleryHorizontal className="w-6 h-6 text-white" />,
      hidden: claims?.Rol?.includes("Admin") ? false : true,
    },

    {
      name: "Restaurantes",
      link: "/Admin/Restaurantes",
      icon: <Utensils className="w-6 h-6 text-white" />,
      hidden: claims?.Rol?.includes("Admin") ? false : true,
    },
    {
      name: "Categorias",
      link: "/Admin/Categorias",
      icon: <BrickWall className="w-6 h-6 text-white" />,
      hidden: claims?.Rol?.includes("Admin") ? false : true,
    },
    {
      name: "Productos",
      link: "/Admin/Productos",
      icon: <Beef className="w-6 h-6 text-white" />,
      hidden: claims?.Rol?.includes("Admin") ? false : true,
    },
    {
      name: "Reservas Pendientes",
      link: `${
        claims?.Rol?.includes("Mostrador") && claims?.IdRestaurante?.length > 0
          ? `/Admin/Reservas/${claims?.IdRestaurante}`
          : "/Admin/Reservas"
      }`,
      icon: <CalendarClock className="w-6 h-6 text-white" />,
      // Cant: true,
      hidden:
        claims?.Rol?.includes("Admin") || claims?.Rol?.includes("Mostrador")
          ? false
          : true,
    },
    {
      name: "Reservas para Hoy",
      link: `${
        claims?.Rol?.includes("Mostrador") && claims?.IdRestaurante?.length > 0
          ? `/Admin/MesasHoy/${claims?.IdRestaurante}`
          : "/Admin/MesasHoy"
      }`,
      icon: <CalendarCheck className="w-6 h-6 text-white" />,
      hidden:
        claims?.Rol?.includes("Admin") || claims?.Rol?.includes("Mostrador")
          ? false
          : true,
    },
    ,
    {
      name: "Realizar Pago",
      link: `/Admin/Checkout`,

      icon: <CircleDollarSign className="w-6 h-6 text-white" />,
    },
    {
      name: "Historial Compras",
      link: `/Admin/HistorialCompras`,

      icon: <HistoryIcon className="w-6 h-6 text-white" />,
    },

    {
      name: "Reportes",
      link: "/Admin/Reportes",
      icon: <FileText className="w-6 h-6 text-white" />,
      hidden: claims?.Rol?.includes("Admin") ? false : true,
    },
    {
      name: "LibroReclamaciones",
      link: "/Admin/LibroReclamaciones",
      icon: <BookmarkMinus className="w-6 h-6 text-white" />,
      hidden: claims?.Rol?.includes("Admin") ? false : true,
    },
  ];

  menu.find((men) => {
    if (men?.hidden && pathname == men.link) {
      router.replace("/Admin");
    }
  });

  return (
    <div>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50  text-black ">
        <div className="fixed flex flex-col left-0 w-14 hover:w-64 md:w-64 bg-granjaSecondary h-full text-white transition-all duration-300 border-none z-10 sidebar">
          <div className="overflow-y-auto overflow-x-hidden flex flex-col justify-between flex-grow">
            <ul className="flex flex-col py-4 space-y-1">
              <li>
                <div className="flex flex-row items-center h-11 focus:outline-none   text-white-600 hover:text-white-800 border-l-4 border-transparent    pr-6">
                  <div className="inline-flex justify-center items-center ml-4">
                    {/* <User className="w-6 h-6 text-white" /> */}
                    <Avatar className="h-6 w-6 lg:w-9 lg:h-9">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </div>

                  <p className="ml-2 text-sm text-wrap tracking-wide truncate uppercase">
                    {claims?.Rol} - {user?.displayName || "No Disponible"}
                  </p>
                </div>
              </li>

              <li className="px-5 hidden md:block">
                <div className="flex flex-row items-center h-8">
                  <div className="text-sm font-light tracking-wide text-gray-p00 uppercase">
                    Dashboard
                  </div>
                </div>
              </li>
              {menu.map((men, key) => (
                <li key={key}>
                  {!men.hidden && (
                    <>
                      <Link
                        href={men.link}
                        className={` flex flex-row items-center h-11 focus:outline-none hover:bg-yellow-800  text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-yellow-600  pr-6 ${
                          pathname.includes(men.link) &&
                          "bg-yellow-800 border-yellow-600 "
                        }`}
                      >
                        <span className="inline-flex justify-center items-center ml-4">
                          {men.icon}
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                          {men.name}
                        </span>

                        {men?.Cant && (
                          <span className="ml-2 text-sm tracking-wide truncate bg-orange-700 px-2  rounded-full">
                            {CantReservas || 0}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                </li>
              ))}

              <li>
                <div
                  onClick={() => signOut(auth)}
                  className="cursor-pointer relative flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800  text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500  pr-6"
                >
                  <span className="inline-flex justify-center items-center ml-4">
                    <MonitorXIcon className="w-6 h-6 text-white" />{" "}
                  </span>
                  <span className="ml-2 text-sm tracking-wide truncate">
                    Cerrar sesión
                  </span>
                </div>
              </li>
            </ul>
            <p className="mb-14 px-5 py-3 hidden md:block text-center text-xs">
              Copyright @{new Date().getFullYear()} -{" "}
              {new Date().getFullYear() + 1}
            </p>
          </div>
        </div>
        {/* ./Sidebar */}
        <div className=" ml-14  mb-6 md:ml-64 p-4 ">{children}</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
