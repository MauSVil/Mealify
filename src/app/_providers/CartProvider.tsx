import { ReactNode, useState } from "react";
import { CartContext } from "../providers";
import { Product, ProductCart } from "@/lib/types/Zod/Product";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<{[id: string]: ProductCart}>({});

  const addToCart = (item: Product) => {
    const newItem = {
      [item._id!]: {
        ...item,
        quantity: 1,
      },
    }
    setCart((prevCart) => {
      if (prevCart[item._id!]) {
        return {
          ...prevCart,
          [item._id!]: {
            ...prevCart[item._id!],
            quantity: prevCart[item._id!].quantity + 1,
          },
        };
      }
      return {
        ...prevCart,
        ...newItem,
      };
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      delete newCart[id];
      return newCart;
    });
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};