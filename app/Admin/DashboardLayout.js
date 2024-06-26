"use client";
import React, { useEffect, useState } from "react";
import Login from "./Login";
import useAuthState from "@/lib/useAuthState";
import { auth, db } from "@/firebase/firebaseClient";
import Link from "next/link";
import {
  BookOpenText,
  CalendarCheck,
  CalendarPlus,
  MessageSquareDot,
  MonitorXIcon,
  PartyPopper,
  Users,
  YoutubeIcon,
} from "lucide-react";
import { signOut } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { collection, onSnapshot, query, where } from "firebase/firestore";

const DashboardLayout = ({ children }) => {
  const [{ user, claims }, loading, error] = useAuthState(auth);
  const [Tareas, setTareas] = useState([]);
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    {
      name: "Usuarios",
      link: "/Usuarios",
      icon: <Users className="w-6 h-6 text-white" />,
      hidden: claims?.Admin ? false : true,
    },
    {
      name: "Asignar Tareas",
      link: "/AsignarTareas",
      icon: <CalendarPlus className="w-6 h-6 text-white" />,
      hidden: claims?.Admin ? false : true,
    },
    {
      name: "Tareas",
      link: "/Tareas",
      icon: <CalendarCheck className="w-6 h-6 text-white" />,
      Tareas: true,
    },
  ];

  menu.find((men) => {
    if (men?.hidden && pathname == men.link) {
      router.replace("/");
    }
  });
  useEffect(() => {
    const qComentarios = query(
      collection(db, "Notificaciones"),
      where("Show", "==", true) // Asegúrate de usar el valor booleano false
    );

    const commentarios = onSnapshot(qComentarios, (snapshot) => {
      setTareas(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });

    return () => {
      commentarios(); // Esta función cancela la suscripción al snapshot
    };
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>error</p>;

  if (!user) return <Login />;
  return (
    <div>
      <div className="min-h-screen flex flex-col flex-auto flex-shrink-0 antialiased bg-gray-50  text-black ">
        <div className="fixed flex flex-col left-0 w-14 hover:w-64 md:w-64 bg-lagranja h-full text-white transition-all duration-300 border-none z-10 sidebar">
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
                  <span className="ml-2 text-sm tracking-wide truncate uppercase">
                    {user.displayName || "Miryam Roncal"}
                  </span>
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
                        className={` flex flex-row items-center h-11 focus:outline-none hover:bg-blue-800  text-white-600 hover:text-white-800 border-l-4 border-transparent hover:border-blue-500  pr-6 ${
                          pathname.includes(men.link) &&
                          "bg-blue-800 border-blue-500 "
                        }`}
                      >
                        <span className="inline-flex justify-center items-center ml-4">
                          {men.icon}
                        </span>
                        <span className="ml-2 text-sm tracking-wide truncate">
                          {men.name}
                        </span>

                        {men?.Tareas && (
                          <span className="ml-2 text-sm tracking-wide truncate bg-orange-700 px-2  rounded-full">
                            {Tareas?.length || 0}
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
