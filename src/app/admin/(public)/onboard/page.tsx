
"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputFormField } from "@/components/ui/form/InputFormField";
import { Business, BusinessSchema } from "@/lib/types/Zod/Business";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateBusiness } from "./_hooks/useCreateBusiness";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

const defaultValues: Business = {
  name: "",
  owner: "",
  address: "",
  phone: "",
  latitude: 0,
  longitude: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  heroImage: null as unknown as File,
};

const OnboardPage = () => {
  const form = useForm<Business>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(BusinessSchema),
  });

  const createBusiness = useCreateBusiness();

  const { handleSubmit } = form;

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          form.setValue("latitude", latitude);
          form.setValue("longitude", longitude);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  const onSubmit = handleSubmit(async (values) => {
    await createBusiness.mutateAsync(values);
  });


  return (
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <Card className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <h1 className="text-2xl font-bold">Onboarding</h1>
        </CardHeader>
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
                label="Name"
                type="text"
                required
              />

              <InputFormField
                controllerProps={{
                  control: form.control,
                  name: "address",
                }}
                label="Description"
                type="text"
                required
              />

              <InputFormField
                controllerProps={{
                  control: form.control,
                  name: "phone",
                }}
                label="Telefono"
                required
              />

              <InputFormField
                controllerProps={{
                  control: form.control,
                  name: "heroImage",
                }}
                label="Image"
                type="file"
                required
              />

            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-row items-center justify-end pb-2 gap-4">
          <Button variant={"outline"}>
            Cancelar
          </Button>
          <Button onClick={onSubmit}>
            {createBusiness.isLoading &&  <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {createBusiness.isLoading ? "Creando negocio..." : "Continuar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

export default OnboardPage;