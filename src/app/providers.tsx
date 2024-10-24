'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { createContext, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from 'react-query/devtools'
import { CartContextType } from "@/lib/types/Cart";
import { CartProvider } from "./_providers/CartProvider";

export const CartContext = createContext<CartContextType | undefined>(undefined);

const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
    <CartProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
          <TooltipProvider>
            <Toaster richColors />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </CartProvider>
  );
}

export default Providers;