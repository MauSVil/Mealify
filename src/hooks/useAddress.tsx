import { useContext } from "react";
import { AddressContext } from "@/app/user/(private)/_providers/AddressProvider";

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};