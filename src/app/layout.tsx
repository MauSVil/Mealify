import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import 'react-toastify/dist/ReactToastify.css';

const dmSans = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mealify",
  description: "A restaurant dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body className={dmSans.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
