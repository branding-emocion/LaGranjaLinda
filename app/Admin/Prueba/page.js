"use client";
import React, { useState } from "react";
import ProductList from "./ProductList";

const Prueba = () => {
  const [products, setProducts] = useState([
    { id: 1, name: "Producto A" },
    { id: 2, name: "Producto B" },
    { id: 3, name: "Producto C" },
  ]);

  console.log(products);

  return (
    <div>
      <ProductList products={products} setProducts={setProducts} />
    </div>
  );
};

export default Prueba;
