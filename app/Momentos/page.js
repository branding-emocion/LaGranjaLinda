"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";

const Momentos = () => {
  const [MomentosLindos, setMomentosLindos] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `MomentosLindos`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setMomentosLindos(
          snapshot?.docs?.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
        )
    );
    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div className="bg-amber-100 min-h-screen p-8">
      <h1 className="text-4xl font-bold text-amber-800 mb-8 text-center uppercase">
        Momentos Mágicos
      </h1>

      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-4 p-4">
          {MomentosLindos.map((momento) => (
            <Card
              key={momento.id}
              className="w-[350px] flex-shrink-0 bg-white shadow-lg hover:shadow-xl transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-xl text-amber-900">
                  {momento.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4 whitespace-normal">
                  {momento.description}
                </p>
                <div className="space-y-2">
                  {momento.images?.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Imagen ${index + 1} de ${momento.name}`}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default Momentos;
