import { ReactNode } from "react";

const PublicAdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      {children}
    </section>
  )
};

export default PublicAdminLayout;