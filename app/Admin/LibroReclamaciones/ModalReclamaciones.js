import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/firebase/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";

const ModalReclamaciones = ({ ReclamoState, setModalState }) => {
  const [InputValues, setInputValues] = useState({});

  const closeShowReclamo = () => {
    setModalState({
      Visible: false,
      Reclamo: {},
    });
  };

  return (
    <Dialog open={ReclamoState?.Visible} onOpenChange={closeShowReclamo}>
      <DialogContent className="w-full overflow-auto max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {" "}
            Reclamo {ReclamoState?.Reclamo?.NombreCompleto}{" "}
          </DialogTitle>
          <DialogDescription>Como se resolvio el reclamo</DialogDescription>
        </DialogHeader>
        {ReclamoState?.Reclamo?.Status == "Pendiente" && (
          <>
            <form
              onSubmit={async (e) => {
                e.preventDefault();

                if (confirm("¿Estás seguro de guardar el comentario?")) {
                  await updateDoc(
                    doc(db, "Reclamos", `${ReclamoState?.Reclamo?.id}`),
                    {
                      ...InputValues,
                      Status: "Resuelto",
                      Comentario: InputValues?.Comentario,
                    }
                  );
                }
              }}
              className="space-y-7"
            >
              <div className="space-y-2">
                <Label htmlFor="NombreCompleto" className="">
                  Como se resolvio
                  <span className="text-red-600">(*)</span>
                </Label>
                {/* Area label */}
                <Textarea
                  onChange={(e) => {
                    setInputValues({
                      ...InputValues,
                      Comentario: e.target.value,
                    });
                  }}
                />
              </div>
              <Button
                disabled={InputValues?.Comentario?.length == 0}
                className="disabled:cursor-not-allowed disabled:opacity-50"
                type="submit"
              >
                Guardar{" "}
              </Button>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalReclamaciones;
