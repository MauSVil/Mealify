"use client";

import { createContext, ReactNode, useState } from "react";
import _ from "lodash";

interface AddressContextType {
  address: string | undefined;
  setAddressValue: (value: string | undefined) => void;
}

export const AddressContext = createContext<AddressContextType | undefined>(undefined);

export const AddressProvider = ({ children }: { children: ReactNode }) => {
  const [address, setAddress] = useState<string | undefined>(undefined);

  const setAddressValue = (value: string | undefined) => {
    setAddress(value);
  };

  return (
    <AddressContext.Provider value={{ address, setAddressValue }}>
      {children}
    </AddressContext.Provider>
  );
};