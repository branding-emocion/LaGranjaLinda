"use client";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth, db } from "@/firebase/firebaseClient";
import useAuthState from "@/lib/useAuthState";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { EyeIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const HistorialCompras = () => {
  const [{ user, claims }, loading, error] = useAuthState(auth);
  const [Compras, setCompras] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      const qReservas = query(
        collection(db, "Orders"),
        where("userId", "==", `${user?.uid}`)
      );

      const unsubscribe = onSnapshot(qReservas, (snapshot) => {
        setCompras(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        );
      });

      return () => unsubscribe();
    }
  }, [user?.uid]);
  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Bienvenido al módulo de Historial de Compras</CardTitle>

          <CardDescription>
            En esta sección, Visualizar las compras realiazadas
          </CardDescription>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de compras</CardTitle>
        </CardHeader>

        <div className="p-4 bg-gray-50">
          {/* component */}
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow">
              <div className="flex w-full items-center justify-between space-x-6 p-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center space-x-3">
                    <h3 className="truncate text-sm font-medium text-gray-900">
                      Shehab Najib
                    </h3>
                    <span className="inline-flex flex-shrink-0 items-center rounded-full bg-green-50 px-1.5 py-0.5 text-xs font-medium text-blue-600 ring-1 ring-inset ring-green-600/20">
                      Creator
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-gray-500">
                    Acount owner
                  </p>
                </div>
                <img
                  className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300"
                  src="https://qph.cf2.quoracdn.net/main-thumb-554097988-200-xietklpojlcioqxaqgcyykzfxblvoqrb.jpeg"
                  alt
                />
              </div>
              <div>
                <div className="-mt-px flex divide-x divide-gray-200">
                  <div className="flex w-0 flex-1">
                    <a
                      href="howpossible17@example.com"
                      className="relative -mr-px inline-flex w-0 flex-1 items-center justify-center gap-x-3 rounded-bl-lg border border-transparent py-4 text-sm font-semibold text-gray-900"
                    >
                      <EyeIcon className="w-5 h-5 " />
                      Más Detalles
                    </a>
                  </div>
                </div>
              </div>
            </li>

            {/* More people... */}
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default HistorialCompras;
