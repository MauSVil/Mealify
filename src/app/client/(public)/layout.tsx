import { ReactNode } from "react";

const PublicClientLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      {children}
    </section>
  )
};

export default PublicClientLayout;