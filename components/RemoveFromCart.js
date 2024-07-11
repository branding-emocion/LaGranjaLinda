"use client";

import { useCarStore } from "@/store";
import { Button } from "./ui/button";

const RemoveFromCart = ({ product }) => {
  const removeFromCart = useCarStore((state) => state.removeFromCart);

  const handleRemove = () => {
    removeFromCart(product);
  };

  return (
    <Button
      className="bg-[#7d2d04] hover:bg-[#7d2d04]/50"
      onClick={() => handleRemove()}
    >
      -
    </Button>
  );
};

export default RemoveFromCart;
