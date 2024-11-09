import { FieldValues, UseControllerProps } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Input } from "../input";
import Image from "next/image";
import { Button } from "../button";
import { Eye, Trash2 } from "lucide-react";

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
            <>
              {type === "file" && field.value && typeof field.value === "string" && (
                <div className="flex flex-col items-start gap-2 mb-2">
                  <p className="text-sm text-muted-foreground">Imagen actual:</p>
                  <div className="relative w-32 h-32 rounded overflow-hidden border">
                    <Image
                      src={field.value}
                      alt="Imagen actual"
                      layout="fill"
                      objectFit="cover"
                      className="rounded"
                      priority
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(field.value, "_blank")}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Ver imagen
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => field.onChange(null)}
                      className="flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Eliminar imagen
                    </Button>
                  </div>
                </div>
              )}
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
                value={type === 'file' ? undefined : field.value}
                type={type}
              />
            </>
          </FormControl>
          <FormMessage className="text-xs text-red-500" />
        </FormItem>
      )}
    />
  );
};