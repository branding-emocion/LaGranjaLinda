"use client";
import MenuPrincipal from "./MenuPrincipal";
import Footer from "./Footer";
import { usePathname } from "next/navigation";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const Main = ({ children }) => {
  const pathname = usePathname();

  return (
    <>
      {pathname.includes("/Admin") ? (
        <>
          <DndProvider backend={HTML5Backend}>{children}</DndProvider>
        </>
      ) : (
        <main className=" bg-gray-50 overflow-auto h-screen w-screen">
          <div className="h-28 ">
            <MenuPrincipal />
          </div>
          {children}
          <Footer />
        </main>
      )}
    </>
  );
};

export default Main;
