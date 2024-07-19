"use client";

import Basket from "@/components/Basket";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ShowProductos = ({ VisibleProductos, setVisibleProductos }) => {
  const closeVisibleProductos = () => {
    setVisibleProductos(false);
  };

  return (
    <Dialog open={VisibleProductos} onOpenChange={closeVisibleProductos}>
      <DialogContent className="h-4/5 w-full overflow-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>Mi Orden</DialogTitle>
          <DialogDescription>
            <p>
              {" "}
              Revise los artículos de su orden y precione checkout cuando esté
              listo.{" "}
            </p>
          </DialogDescription>
        </DialogHeader>

        <Basket hiddenCheckout={true} />
      </DialogContent>
    </Dialog>
  );
};

export default ShowProductos;
