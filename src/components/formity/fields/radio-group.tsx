import { useId } from "react";
import { RadioGroup as RadioGroupS, RadioGroupItem } from "@/components/ui/radio-group";

import Field from "../user-interface/field";
import { Label } from "@/components/ui/label";

interface RadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  direction: "x" | "y";
  error: { message: string } | undefined;
}

export default function RadioGroup({ label, value, onChange, options, direction, error }: RadioGroupProps) {
  const id = useId();
  return (
    <Field id={id} label={label} error={error}>
      <RadioGroupS
        defaultValue={value}
        onValueChange={onChange}
      >
        {options.map((option) => (
          <div className="flex items-center gap-2" key={option.value}>
            <RadioGroupItem
              value={option.value}
            />
            <Label>{option.label}</Label>
          </div>
        ))}
      </RadioGroupS>
      {error && <p className="text-sm text-red-500">{error.message}</p>}
    </Field>
  );
}
