import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import React from "react";

const ModalCompraSuccess = ({ stateSucess, setstateSucess }) => {
  const router = useRouter();

  const closestateSucess = () => {
    setstateSucess(false);
    router.push("/");
  };

  return (
    <>
      <Dialog open={stateSucess} onOpenChange={closestateSucess}>
        <DialogContent className=" w-full overflow-auto max-w-3xl">
          {/* <DialogHeader>
            <DialogTitle>Orden creada con exito </DialogTitle>
            <DialogDescription>
              Revise los artículos de su orden y precione checkout cuando esté
              listo.{" "}
            </DialogDescription>
          </DialogHeader> */}
          <div className="w-full h-full mx-auto">
            {/* <PackageCheck className="w-5 h-5 text-green-800" /> */}
            <div className="m-8   mx-auto">
              <div className="mb-8">
                <h1 className="mb-4 text-3xl font-extrabold">Notificación</h1>
                <p className="text-gray-700">
                  La orden se ha creado exitosamente. Puedes encontrar más
                  información en el módulo de Historial de compras.
                </p>
              </div>
              <div className="space-y-4">
                <button
                  onClick={() => closestateSucess()}
                  className="p-3 bg-black rounded-full text-white w-full font-semibold"
                >
                  Cerrar Modal{" "}
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalCompraSuccess;
