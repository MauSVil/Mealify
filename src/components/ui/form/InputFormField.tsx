import { FieldValues, UseControllerProps } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Input } from "../input";

export interface NextUIInputFormFieldProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  controllerProps: UseControllerProps<T>;
  placeholder?: string;
  label?: string;
}

export const InputFormField = <T extends FieldValues>(props: NextUIInputFormFieldProps<T>) => {
  const {
    controllerProps,
    hidden,
    placeholder,
    label,
    type = "text",
    className,
    ...rest
  } = props;

  return (
    <FormField
      {...controllerProps}
      render={({ field }) => (
        <FormItem hidden={hidden} className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              {...rest}
              placeholder={placeholder}
              onChange={(e) => {
                if (type === 'file') {
                  field.onChange(e.target.files?.[0]);
                } else {
                  field.onChange(e.target.value);
                }
              }}
              type={type}
            />
          </FormControl>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
};