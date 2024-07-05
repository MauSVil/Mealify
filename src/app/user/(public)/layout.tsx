import { ReactNode } from "react";

const PublicUserLayout = ({ children }: { children: ReactNode }) => {
  return (
    <section>
      {children}
    </section>
  )
};

export default PublicUserLayout;