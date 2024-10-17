import { FieldValues, UseControllerProps } from "react-hook-form";
import { RadioGroup, RadioGroupItem } from "../radio-group"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form"
import { Label } from "../label";
import { cn } from "@/lib/utils";

export interface RadioGroupFormFieldProps<T extends FieldValues> {
  controllerProps: UseControllerProps<T>;
  label: string;
  items: { label: string, value: string, className?: string }[];
  direction?: 'row' | 'column';
}

const RadioGroupFormField = <T extends FieldValues>(props: RadioGroupFormFieldProps<T>) => {
  const { items, label, controllerProps, direction = 'column' } = props;
  return (
    <FormField
      {...controllerProps}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="mb-2">{label}</FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className={cn("flex flex-row items-start justify-start", {
                "flex-col": direction === "column",
                "flex-row": direction === "row",
              })}
            >
              {items.map((item, idx) => (
                <FormItem className="flex items-center space-x-3 space-y-0" key={idx}>
                  <FormControl>
                    <RadioGroupItem value={item.value} />
                  </FormControl>
                  <Label className={cn("font-normal", item.className)}>
                    {item.label}
                  </Label>
                </FormItem>
              ))}
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { RadioGroupFormField }