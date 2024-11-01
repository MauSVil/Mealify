import { Product, ProductCart } from "./Zod/Product";

export interface CheckoutSheetContextType {
  openCheckoutSheet: () => void;
  closeCheckoutSheet: () => void;
  isOpenCheckoutSheet: boolean;
}