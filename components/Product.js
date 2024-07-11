import Link from "next/link";
import React from "react";
import { Badge } from "./ui/badge";
import Image from "next/image";

const Product = ({ product, name, setOpenModal }) => {
  return (
    <div
      onClick={(e) => {
        e.preventDefault();
        setOpenModal({
          Visible: true,
          Product: product,
        });
      }}
      className="flex flex-col relative border rounded-md h-full p-0 bg-green-50 border-granjaSecondary cursor-pointer"
    >
      <section className="relative w-full h-[200px]">
        <Image
          className="rounded-t-lg "
          fill
          src={product?.Imagenes[0] || ""}
          alt={product.NombreProducto}
          style={{
            objectFit: "cover",
          }}
        />
      </section>
      <div className="pt-3 px-5 pb-5">
        <p className="text-xl font-bold">S/ {product?.Precio}</p>

        <Badge className="w-fit absolute top-2 right-2 capitalize">
          {name}
        </Badge>

        <h1 className="font-normal text-xl uppercase">
          {product.NombreProducto}
        </h1>
        <p className=" font-light line-clamp-2">{product?.Descripcion}</p>
      </div>
    </div>
  );
};

export default Product;
