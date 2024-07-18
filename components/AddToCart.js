"use client";

import { useCarStore } from "@/store";
import { Button } from "./ui/button";
import RemoveFromCart from "./RemoveFromCart";

const AddToCart = ({ product, Cantidad, setCantidad, show }) => {
  const [cart, addToCart] = useCarStore((state) => [
    state.cart,
    state.addToCard,
  ]);

  const howManyInCart = cart.filter((item) => item.id === product.id).length;

  const handleAdd = () => {
    if (show) {
      setCantidad((prev) => [...prev, product]);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex space-x-5 items-center ">
        <RemoveFromCart
          product={product}
          setCantidad={setCantidad}
          Cantidad={Cantidad}
          show={show}
        />

        <span>{Cantidad?.length || howManyInCart}</span>
        <Button
          type="button"
          onClick={handleAdd}
          className="bg-[#7d2d04] hover:bg-[#7d2d04]/50"
        >
          +
        </Button>
      </div>
      {show && (
        <Button
          type="submit"
          className="bg-[#7d2d04] uppercase hover:bg-[#7d2d04]/50"
        >
          Añadir a mi orden
        </Button>
      )}
    </div>
  );
};

export default AddToCart;
