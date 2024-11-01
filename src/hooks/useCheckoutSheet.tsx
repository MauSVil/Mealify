import { useContext } from "react";
import { CheckoutSheetContext } from "../app/providers";

export const useCheckoutSheet = () => {
  const context = useContext(CheckoutSheetContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};