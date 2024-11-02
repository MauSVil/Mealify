import { ReactNode, useState } from "react";
import { CartContext } from "../providers";
import { Product, ProductCart } from "@/lib/types/Zod/Product";
import _ from "lodash";
import { toast } from "sonner";
import { useCheckoutSheet } from "@/hooks/useCheckoutSheet";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<{[id: string]: ProductCart}>({});
  const { openCheckoutSheet } = useCheckoutSheet();

  const addToCart = (item: Product) => {
    const cartItems = Object.keys(cart).map((key) => cart[key]);
    const restaurantIds = _.uniq(cartItems.map((item) => item.restaurantId));

    if (Object.keys(cart).length === 0) {
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
      openCheckoutSheet();
    } else {
      if (restaurantIds.includes(item.restaurantId)) {
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
        openCheckoutSheet();
      } else {
        toast.error("El producto pertenece a otro restaurante");
      }
    }
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