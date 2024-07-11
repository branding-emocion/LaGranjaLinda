import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useCarStore = create()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],
        removeFromCart(product) {
          const ProductToRemove = get().cart.findIndex(
            (p) => p.id === product.id
          );

          set((state) => {
            const newCart = [...state.cart];

            newCart.splice(ProductToRemove, 1);
            return {
              cart: newCart,
            };
          });
        },
        addToCard: (product) => {
          set((state) => ({
            cart: [...state.cart, product],
          }));
        },
      }),

      {
        name: "shopping-cart-storage",
      }
    )
  )
);
