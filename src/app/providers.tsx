'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createContext, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { CartContextType } from "@/lib/types/Cart";
import { CartProvider } from "./_providers/CartProvider";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { CheckoutSheetContextType } from "@/lib/types/CheckoutSheet";
import { CheckoutSheetProvider } from "./_providers/CheckoutSheetProvider";
import ModalContainer from 'react-modal-promise';
import { UserProvider } from "./_providers/UserProvider";

export const CartContext = createContext<CartContextType | undefined>(undefined);
export const CheckoutSheetContext = createContext<CheckoutSheetContextType | undefined>(undefined);

const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <>
      <Toaster richColors />
      <UserProvider>
        <CheckoutSheetProvider>
          <CartProvider>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <ReactQueryDevtools position="left" buttonPosition="bottom-left" />
                <TooltipProvider>
                  <ModalContainer />
                  {children}
                </TooltipProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </CartProvider>
        </CheckoutSheetProvider>
      </UserProvider>
    </>
  );
}

export default Providers;