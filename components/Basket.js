"use client";

import { getCartTotal } from "@/lib/getCartTotal";
import groupBySKU from "@/lib/groupBySKU";
import { useCarStore } from "@/store";
import Image from "next/image";
import AddToCart from "./AddToCart";
import { Button } from "./ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Basket = ({ hiddenCheckout }) => {
  const cart = useCarStore((state) => state.cart);
  const grouped = groupBySKU(cart);
  const BasketTotal = getCartTotal(cart);

  return (
    <div className="max-w-7xl mx-auto w-full">
      <ul className="space-y-2  w-full">
        {Object.keys(grouped).map((sku) => {
          const item = grouped[sku][0];
          const total = getCartTotal(grouped[sku]);
          return (
            <li key={sku} className="  my-2 pt-2  w-full h-full mx-auto">
              <div className="flex items-center justify-between gap-x-3">
                {item.Imagenes[0] && (
                  <Image
                    src={item.Imagenes[0]}
                    alt={item.NombreProducto}
                    width={120}
                    height={120}
                  />
                )}

                <div className="w-full">
                  <p className="line-clamp-3 font-bold uppercase">
                    {" "}
                    {item.NombreProducto}
                  </p>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: item?.Descripcion || "",
                    }}
                    className="line-clamp-2 font-light text-sm mt-1"
                  />
                </div>

                <div className="flex flex-col border rounded-md p-4 ">
                  <AddToCart product={item} />
                  <p className="mt-4 font-bold text-right">{total}</p>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-col justify-end p-5 ">
        <p className="font-bold text-2xl text-right text-[#7d2d04] mb-5">
          Total : {BasketTotal}
        </p>

        {!hiddenCheckout && (
          <Link href="/Admin/Checkout">
            {/* <a href="/Admin/Checkout" rel="noopener noreferrer"> */}
            <Button className="mt-5 h-20 bg-[#7d2d04] hover:bg-[#7d2d04]/70 w-full uppercase     ">
              <span className="text-xl lg:text-3xl">Lo Quiero</span>
            </Button>
            {/* </a> */}
          </Link>
        )}
      </div>
    </div>
  );
};

export default Basket;
