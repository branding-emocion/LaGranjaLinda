"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const MostrarPedido = ({
  ListaComprasModalVisible,
  setListaComprasModalVisible,
}) => {
  const closeListaComprasModalVisible = () => {
    setListaComprasModalVisible({
      visible: false,
      cart: [],
    });
  };

  return (
    <Dialog
      open={ListaComprasModalVisible?.visible}
      onOpenChange={closeListaComprasModalVisible}
    >
      <DialogContent className="h-4/5 w-full overflow-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>Orden</DialogTitle>
          <DialogDescription>
            <p>Estos articulos se encuentran en la orden</p>
          </DialogDescription>
        </DialogHeader>

        <div className="max-w-7xl mx-auto w-full">
          <ul className="space-y-2  w-full grid md:grid-cols-2 gap-2">
            {ListaComprasModalVisible?.cart?.map((list, key) => {
              return (
                <li key={key} className="  my-2 pt-2  w-full h-full mx-auto">
                  <div className="flex lists-center justify-between gap-x-3">
                    {list?.Imagenes[0] && (
                      <Image
                        src={list.Imagenes[0]}
                        alt={list.NombreProducto}
                        width={120}
                        height={120}
                      />
                    )}

                    <div className="w-full">
                      <p className="line-clamp-3 font-bold uppercase">
                        {" "}
                        {list.NombreProducto}
                      </p>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: list?.Descripcion || "",
                        }}
                        className="line-clamp-2 font-light text-sm mt-1"
                      />
                    </div>

                    {/* <div className="flex flex-col border rounded-md p-4 ">
                      <p className="mt-4 font-bold text-right">
                        Cant {list?.length} - total: 0
                      </p>
                    </div> */}
                  </div>
                </li>
              );
            })}
          </ul>
          {/* <div className="flex flex-col justify-end p-5 ">
            <p className="font-bold text-2xl text-right text-[#7d2d04] mb-5">
              Total : 0
            </p>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MostrarPedido;
