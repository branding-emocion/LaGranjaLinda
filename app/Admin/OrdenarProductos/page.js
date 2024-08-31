"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/firebase/firebaseClient";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import ProductList from "../Prueba/ProductList";

const OrderProductos = () => {
  const [Categorias, setCategorias] = useState([]);
  const [ListProductos, setListProductos] = useState([]);
  const [Productos, setProductos] = useState([]);

  useEffect(() => {
    onSnapshot(
      collection(db, `Productos`),
      // orderBy("email", "asc"),
      (snapshot) => {
        const data = snapshot?.docs?.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setProductos(data);
      }
    );
    onSnapshot(
      collection(db, `Categorias`),
      // orderBy("email", "asc"),
      (snapshot) =>
        setCategorias(
          snapshot?.docs
            ?.map((doc) => ({
              id: doc.id,
              ...doc.data(),
            }))
            .sort((a, b) => a.Order - b.Order)
        )
    );
  }, []);

  const handleClick = async (e) => {
    try {
      e.preventDefault();
      // Actualiza cada categoría en Firebase según su índice en orderedProducts
      if (!ListProductos) {
        alert("No hay productos");
        return;
      }

      await Promise.all(
        ListProductos?.map(async (category, index) => {
          const categoryRef = doc(db, "Productos", category.id);
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
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>
            Ordene y guarde como desea el orden al momento de visualizar los
            productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="Disponibilidad" className="text-black">
                Seleccione una opción? <span className="text-red-600">(*)</span>
              </Label>
              <Select
                onValueChange={(e) => {
                  const ListaPoductos = Productos?.filter((pro) => {
                    return pro.Categoria == e;
                  }).sort((a, b) => a.Order - b.Order);
                  setListProductos(ListaPoductos);
                }}
              >
                <SelectTrigger className="">
                  <SelectValue placeholder="Por favor seleccione una opción" />
                </SelectTrigger>
                <SelectContent>
                  {Categorias?.map((adi, key) => (
                    <SelectItem key={adi.id} value={adi.id}>
                      {adi.NombreCategoria}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <ProductList
                products={ListProductos}
                setProducts={setListProductos}
              />

              <Button onClick={handleClick}>Guardar Orden</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default OrderProductos;
