"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function ModalAlerta({ AlertaState, setAlertaState }) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {AlertaState && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-[#4CAF50] p-6 rounded-lg max-w-2xl w-full">
            <h2 className="text-white text-2xl font-bold text-center mb-4">
              RESERVA SOLICITADA
            </h2>
            <ul className="text-white space-y-4 list-disc list-inside">
              <li>
                Si usted solicitó reservar entre las 21:00 hrs y 11:00 hrs del
                siguiente día un granjero se comunicará con usted a las 12 del
                medio día.
              </li>
              <li>
                Si usted solicitó reservar entre las 12 m. y 20 hrs. Un granjero
                se comunicará en un lapso de 30 minutos después de su solicitud.
              </li>
            </ul>
            <div className="mt-6 text-center">
              <Button onClick={() => setAlertaState(false)} variant="secondary">
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
