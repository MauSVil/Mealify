import { FieldValues, UseControllerProps } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form"
import { Switch } from "../switch";

export interface SwitchFormFieldProps<T extends FieldValues> {
  controllerProps: UseControllerProps<T>;
  label: string;
}

const SwitchFormField = <T extends FieldValues>(props: SwitchFormFieldProps<T>) => {
  const { label, controllerProps } = props;
  return (
    <FormField
      {...controllerProps}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel className="mb-2">{label}</FormLabel>
          <FormControl>
            <Switch
              {...field}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export { SwitchFormField }