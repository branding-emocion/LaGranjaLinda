"use client";

import { getCartTotal } from "@/lib/getCartTotal";
import groupBySKU from "@/lib/groupBySKU";
import { useCarStore } from "@/store";
import Image from "next/image";
import AddToCart from "./AddToCart";
import { Button } from "./ui/button";
import Link from "next/link";

const Basket = () => {
  const cart = useCarStore((state) => state.cart);
  const grouped = groupBySKU(cart);
  const BasketTotal = getCartTotal(cart);

  console.log("grouped", grouped);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <ul className="space-y-2 divide-y-2 w-full">
        {Object.keys(grouped).map((sku) => {
          const item = grouped[sku][0];
          const total = getCartTotal(grouped[sku]);
          return (
            <li
              key={sku}
              className="p-5 my-2 flex items-center justify-center "
            >
              {item.Imagenes[0] && (
                <Image
                  src={item.Imagenes[0]}
                  alt={item.NombreProducto}
                  width={100}
                  height={100}
                />
              )}
              <div className="flex space-x-4 pl-4">
                <div>
                  <p className="line-clamp-2 font-bold uppercase">
                    {" "}
                    {item.NombreProducto}
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.Descripcion || "",
                    }}
                    className="line-clamp-2 font-light text-sm mt-2"
                  />
                </div>

                <div className="flex flex-col border rounded-md p-5">
                  <AddToCart product={item} />
                  <p className="mt-4 font-bold text-right">{total}</p>
                </div>
              </div>
              <hr />
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col justify-end p-5 ">
        <p className="font-bold text-2xl text-right text-[#7d2d04] mb-5">
          Total : {BasketTotal}
        </p>
        <Link href={"/Admin/Pagos"}>
          <Button className="mt-5 h-20 bg-[#7d2d04] hover:bg-[#7d2d04]/70 w-full">
            {" "}
            Checkout
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Basket;
