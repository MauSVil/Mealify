import type { ReactNode } from "react";

import Button from "../user-interface/button";

import { useAnimate } from "../../context/animate";

interface ButtonProps {
  children: ReactNode;
}

export default function Next({ children }: ButtonProps) {
  const { animate } = useAnimate();
  return <Button disabled={animate !== "none"}>{children}</Button>;
}
