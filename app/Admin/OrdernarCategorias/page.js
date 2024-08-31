"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { db } from "@/firebase/firebaseClient";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ProductList from "../Prueba/ProductList";
import { Button } from "@/components/ui/button";

const OrdernarCategorias = () => {
  const [Categorias, setCategorias] = useState([]);
  console.log(Categorias);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, `Categorias`),

      (snapshot) => {
        setCategorias(
          snapshot.docs
            .map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => a.Order - b.Order)
        );
      },
      (error) => {
        console.error("Error al obtener los documentos: ", error);
      }
    );

    // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      // Actualiza cada categoría en Firebase según su índice en orderedProducts

      await Promise.all(
        Categorias.map(async (category, index) => {
          const categoryRef = doc(db, "Categorias", category.id);
          await updateDoc(categoryRef, { Order: index + 1 });
        })
      );

      alert("Orden guardado correctamente");

      console.log("Orden guardado correctamente en Firebase!");
    } catch (error) {
      console.error("Error al guardar el orden:", error);
    }
  };

  return (
    <div>
      <Card className="shadow-md">
        {" "}
        <CardHeader>
          <CardTitle>
            Ordene y guarde como desea el orden al momento de visualizar las
            categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <ProductList products={Categorias} setProducts={setCategorias} />

            <Button onClick={handleClick}>Guardar Orden</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrdernarCategorias;
