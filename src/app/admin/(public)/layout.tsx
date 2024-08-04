import { ReactNode } from "react";

const PublicAdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section className="h-screen w-screen">
      {children}
    </section>
  )
};

export default PublicAdminLayout;