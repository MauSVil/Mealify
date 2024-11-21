import { ReactNode } from "react";

const PublicDeliveryLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="h-screen w-screen">
      {children}
    </section>
  )
};

export default PublicDeliveryLayout;