"use client";

import Basket from "@/components/Basket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getCartTotal } from "@/lib/getCartTotal";
import groupBySKU from "@/lib/groupBySKU";
import Image from "next/image";

const ModalListaProductos = ({ ShowProductos, setShowProductos }) => {
  const grouped = groupBySKU(ShowProductos?.ListaProductos);
  const BasketTotal = getCartTotal(ShowProductos?.ListaProductos);

  console.log("grouped", grouped);

  const closeShowProductos = () => {
    setShowProductos({
      Visible: false,
      ListaProductos: [],
    });
  };

  return (
    <Dialog open={ShowProductos?.Visible} onOpenChange={closeShowProductos}>
      <DialogContent className="h-4/5 w-full overflow-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mi Orden</DialogTitle>
          <DialogDescription>
            <p>Estos articulos se encuentran en tu orden</p>
          </DialogDescription>
        </DialogHeader>

        <div className="max-w-7xl mx-auto w-full">
          <ul className="space-y-2  w-full">
            {Object.keys(grouped).map((sku) => {
              const item = grouped[sku][0];
              const total = getCartTotal(grouped[sku]);
              return (
                <li key={sku} className="  my-2 pt-2  w-full h-full mx-auto">
                  <div className="flex items-center justify-between gap-x-3">
                    {item.Imagenes[0] && (
                      <Image
                        src={item.Imagenes[0]}
                        alt={item.NombreProducto}
                        width={120}
                        height={120}
                      />
                    )}

                    <div className="w-full">
                      <p className="line-clamp-3 font-bold uppercase">
                        {" "}
                        {item.NombreProducto}
                      </p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: item?.Descripcion || "",
                        }}
                        className="line-clamp-2 font-light text-sm mt-1"
                      />
                    </div>

                    <div className="flex flex-col border rounded-md p-4 ">
                      <p className="mt-4 font-bold text-right">
                        Cant {grouped[sku]?.length} - total: {total}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex flex-col justify-end p-5 ">
            <p className="font-bold text-2xl text-right text-[#7d2d04] mb-5">
              Total : {BasketTotal}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalListaProductos;
