import { ReactNode, useState } from "react";
import { CheckoutSheetContext } from "../providers";

export const CheckoutSheetProvider = ({ children }: { children: ReactNode }) => {
  const [isOpenCheckoutSheet, setIsOpenCheckoutSheet] = useState(false);

  const openCheckoutSheet = () => {
    setIsOpenCheckoutSheet(true);
  };

  const closeCheckoutSheet = () => {
    setIsOpenCheckoutSheet(false);
  };

  return (
    <CheckoutSheetContext.Provider value={{ isOpenCheckoutSheet, openCheckoutSheet, closeCheckoutSheet }}>
      {children}
    </CheckoutSheetContext.Provider>
  );
};