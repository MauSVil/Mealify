'use client';

import { Form } from "@/components/ui/form";
import { InputFormField } from "@/components/ui/form/InputFormField";
import { RadioGroupFormField } from "@/components/ui/form/RadioGroupFormField";
import { NewProduct, NewProductSchema } from "@/lib/types/Zod/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const defaultValues: NewProduct = {
  name: "",
  description: "",
  price: 0,
  available: false,
  image: "",
};

const NewProductPage = () => {
  const form = useForm<NewProduct>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(NewProductSchema),
  });

  return (
    <div className="w-full flex p-4 md:gap-8 md:p-8 items-center justify-center">
      <div className="w-fullflex flex-col gap-4 flex-1 max-w-5xl">
        <Form {...form}>
          <form
            noValidate
            className="w-full mt-3 flex flex-col gap-8 px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8"
          >
            <InputFormField
              controllerProps={{
                control: form.control,
                name: "name",
              }}
              label="Name"
              type="text"
              required
            />

            <InputFormField
              controllerProps={{
                control: form.control,
                name: "description",
              }}
              label="Description"
              type="text"
              required
            />

            <InputFormField
              controllerProps={{
                control: form.control,
                name: "price",
              }}
              label="Price"
              type="number"
              required
            />

            <RadioGroupFormField
              controllerProps={{
                control: form.control,
                name: "available",
              }}
              label="Available"
              items={[
                { label: "Yes", value: "true" },
                { label: "No", value: "false" },
              ]}
            />

            <InputFormField
              controllerProps={{
                control: form.control,
                name: "image",
              }}
              label="Image"
              type="file"
              required
            />

          </form>
        </Form>
      </div>
    </div>
  );
}

export default NewProductPage;