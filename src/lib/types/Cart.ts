import { Product } from "./Zod/Product";

export interface CartContextType {
  cart: Product[];
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
}