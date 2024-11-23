import type { ChangeEvent } from "react";

import { useId } from "react";


import Field from "../user-interface/field";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface TextFieldProps {
  type: string;
  label: string;
  value?: string;
  onChange: (value: string) => void;
  error: { message: string } | undefined;
}

export default function TextField({
  type,
  label,
  value,
  onChange,
  error,
}: TextFieldProps) {
  const id = useId();
  return (
    <Field
      id={id}
      label={label}
      error={error}
    >
      <Label htmlFor={id}>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) => {
          onChange(e.target.value);
        }}
        className={cn(
          "peer placeholder-transparent focus:border-neutral-500 focus:outline-none focus:ring-transparent",
          { "border-red-500 focus:border-red-500": error },
        )}
      />
    </Field>
  );
}
