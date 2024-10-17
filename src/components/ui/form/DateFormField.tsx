import { FieldValues, UseControllerProps } from "react-hook-form";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { es } from "date-fns/locale";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../form";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Button } from "../button";
import { Calendar } from "../calendar";
import moment from "moment";

export interface NextUIInputFormFieldProps<T extends FieldValues> extends React.InputHTMLAttributes<HTMLInputElement> {
  controllerProps: UseControllerProps<T>;
  placeholder?: string;
  label?: string;
  emptyLabel?: string;
  description?: string;
}

export const DateFormField = <T extends FieldValues>(props: NextUIInputFormFieldProps<T>) => {
  const {
    controllerProps,
    label,
    emptyLabel,
    description
  } = props;
  return (
    <FormField
      {...controllerProps}
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>{label}</FormLabel>
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[240px] pl-3 text-left font-normal",
                    !field.value && "text-muted-foreground"
                  )}
                >
                  {field.value ? (
                    <span>{moment(field.value).format('DD/MM/YYYY')}</span>
                  ) : (
                    <span>{emptyLabel}</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date()}
                lang="es"
                locale={es}
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            {description}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  )
};