import type { ReactElement } from "react";
import type { Step, DefaultValues, Resolver, OnNext, Variables } from "formity";

import { forwardRef, useState, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FormProvider, useForm } from "react-hook-form";

import type { Animate } from "../context/animate";

import { AnimateContext, useAnimate } from "../context/animate";

interface FormProps {
  step: Step;
  defaultValues: DefaultValues;
  resolver: Resolver;
  onNext: OnNext;
  children: ReactElement;
}

export default function Form({
  step,
  defaultValues,
  resolver,
  onNext,
  children,
}: FormProps) {
  const [animate, setAnimate] = useState<Animate>("none");
  const value = useMemo(() => ({ animate, setAnimate }), [animate, setAnimate]);
  return (
    <AnimateContext.Provider value={value}>
      <AnimatePresence
        mode="popLayout"
        initial={false}
        onExitComplete={() => setAnimate("none")}
      >
        <MotionComponent
          key={step}
          defaultValues={defaultValues}
          resolver={resolver}
          onNext={onNext}
        >
          {children}
        </MotionComponent>
      </AnimatePresence>
    </AnimateContext.Provider>
  );
}

interface ComponentProps {
  defaultValues: DefaultValues;
  resolver: Resolver;
  onNext: OnNext;
  children: ReactElement;
}

const Component = forwardRef<HTMLFormElement, ComponentProps>(
  function Component({ defaultValues, resolver, onNext, children }, ref) {
    const form = useForm({ defaultValues, resolver });

    const { setAnimate } = useAnimate();

    const handleSubmit = useCallback(
      (formData: Variables) => {
        setAnimate("next");
        setTimeout(() => onNext(formData), 0);
      },
      [onNext, setAnimate],
    );

    return (
      <form
        ref={ref}
        onSubmit={form.handleSubmit(handleSubmit)}
        className="h-full"
      >
        <FormProvider {...form}>{children}</FormProvider>
      </form>
    );
  },
);

const MotionComponent = motion(Component);
