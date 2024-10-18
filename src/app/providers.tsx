'use client';

import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "sonner";
import { ReactQueryDevtools } from 'react-query/devtools'

const Providers = ({ children }: { children: ReactNode }) => {
  const queryClient = new QueryClient();

  return (
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
  );
}

export default Providers;