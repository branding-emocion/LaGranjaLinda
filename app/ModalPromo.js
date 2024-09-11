"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import React from "react";

const ModalPromo = ({ OpenModalPromo, setOpenModalPromo }) => {
  const closeOpenModalPromo = () => {
    setOpenModalPromo({
      Visible: false,
      info: {},
    });
  };

  return (
    <Dialog open={OpenModalPromo?.Visible} onOpenChange={closeOpenModalPromo}>
      <DialogContent className="h-auto  w-[90%] md:w-full max-h-[95vh] overflow-auto   sm:max-w-4xl">
        <DialogHeader className="w-full h-full">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div>
          <img
            src={
              OpenModalPromo?.info?.Imagenes?.length > 0 &&
              OpenModalPromo?.info?.Imagenes[0]
            }
            alt="Promo"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ModalPromo;
