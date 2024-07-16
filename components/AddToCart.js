"use client";

import { useCarStore } from "@/store";
import { Button } from "./ui/button";
import RemoveFromCart from "./RemoveFromCart";

const AddToCart = ({ product }) => {
  const [cart, addToCart] = useCarStore((state) => [
    state.cart,
    state.addToCard,
  ]);

  console.log("product", product);

  const howManyInCart = cart.filter((item) => item.id === product.id).length;

  const handleAdd = () => {
    addToCart(product);
  };

  if (howManyInCart > 0) {
    return (
      <div className="flex space-x-5 items-center">
        <RemoveFromCart product={product} />

        <span>{howManyInCart}</span>
        <Button
          onClick={handleAdd}
          className="bg-[#7d2d04] hover:bg-[#7d2d04]/50"
        >
          +
        </Button>
      </div>
    );
  }

  return (
    <Button
      className="bg-[#7d2d04] uppercase hover:bg-[#7d2d04]/50"
      onClick={() => handleAdd()}
    >
      añadir a mi orden
    </Button>
  );
};

export default AddToCart;
