'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputFormField } from "@/components/ui/form/InputFormField";
import { SwitchFormField } from "@/components/ui/form/SwitchFormField";
import { NewProduct, NewProductSchema } from "@/lib/types/Zod/Product";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateProduct } from "./_hooks/useCreateProduct";

const defaultValues: NewProduct = {
  name: "",
  description: "",
  price: 0,
  available: true,
  image: "",
};

const NewProductPage = () => {
  const router = useRouter();

  const form = useForm<NewProduct>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(NewProductSchema),
  });

  const { handleSubmit } = form;

  const createProduct = useCreateProduct();

  const onSubmit = handleSubmit(async (values) => {
    await createProduct.mutateAsync(values);
  });

  return (
    <div className="w-full flex p-4 md:gap-8 md:p-8 items-center justify-center">
      <div className="w-full flex gap-4 flex-1 max-w-5xl">
        <Card className="flex-1">
          <CardTitle className="px-8 py-4">Nuevo producto</CardTitle>
          <CardContent>
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
                  label="Nombre"
                  type="text"
                  required
                />

                <InputFormField
                  controllerProps={{
                    control: form.control,
                    name: "description",
                  }}
                  label="Descripción"
                  type="text"
                  required
                />

                <InputFormField
                  controllerProps={{
                    control: form.control,
                    name: "price",
                  }}
                  label="Precio"
                  type="number"
                  required
                />

                <SwitchFormField
                  controllerProps={{
                    control: form.control,
                    name: "available",
                  }}
                  label="Esta disponible?"
                />

                <InputFormField
                  controllerProps={{
                    control: form.control,
                    name: "image",
                  }}
                  label="Imagen"
                  type="file"
                  required
                />

              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-row items-center justify-end gap-4 px-8 py-4">
            <Button variant={"outline"} onClick={() => router.back()}>
              Cancelar
            </Button>
            <Button
              onClick={onSubmit}
            >
              {false &&  <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {false ? "Creando negocio..." : "Continuar"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

export default NewProductPage;