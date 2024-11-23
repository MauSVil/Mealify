import type { Dispatch, SetStateAction } from "react";

import { createContext, useContext } from "react";

export type Animate = "none" | "next" | "back";

export interface AnimateValue {
  animate: Animate;
  setAnimate: Dispatch<SetStateAction<Animate>>;
}

export const AnimateContext = createContext<AnimateValue | null>(null);

export function useAnimate(): AnimateValue {
  const context = useContext(AnimateContext);
  if (!context) {
    throw new Error(
      "useAnimate must be used within an AnimateContext.Provider",
    );
  }
  return context;
}
