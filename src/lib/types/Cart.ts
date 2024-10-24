import { Product, ProductCart } from "./Zod/Product";

export interface CartContextType {
  cart: {[id: string]: ProductCart};
  addToCart: (item: Product) => void;
  removeFromCart: (id: string) => void;
}