import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useToast } from "@/components/ui/use-toast";
import React, { useState } from "react";

const ModalPromo = ({ OpenModalPromo, setOpenModalPromo }) => {
  const closeOpenModalPromo = () => {
    setOpenModalPromo({
      Visible: false,
      info: {},
    });
  };

  console.log(OpenModalPromo);

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
