"use client";

import { useCarStore } from "@/store";
import { Button } from "./ui/button";

const RemoveFromCart = ({ product, setCantidad, Cantidad, show }) => {
  const removeFromCart = useCarStore((state) => state.removeFromCart);

  const handleRemove = () => {
    if (show) {
      const ProducRemove = Cantidad?.findIndex((p) => p.id === product.id);

      setCantidad((prev) => {
        const newCart = [...prev];

        if (newCart.length > 0) {
          newCart.splice(ProducRemove, 1);
          return newCart;
        } else {
          return [];
        }
      });
    } else {
      removeFromCart(product);
    }
  };

  return (
    <Button
      type="button"
      className="bg-[#7d2d04] hover:bg-[#7d2d04]/50"
      onClick={() => handleRemove()}
    >
      -
    </Button>
  );
};

export default RemoveFromCart;
