import { ReactNode } from "react";

const PublicUserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="h-screen w-screen">
      {children}
    </section>
  )
};

export default PublicUserLayout;