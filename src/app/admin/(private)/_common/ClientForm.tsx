import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { InputFormField } from "@/components/ui/form/InputFormField";
import { Business, BusinessSchema } from "@/lib/types/Zod/Business";
import { zodResolver } from "@hookform/resolvers/zod";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { UseMutationResult } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

const defaultValues: Omit<Business, "heroImage"> = {
  name: "",
  owner: "",
  description: "",
  phone: "",
  latitude: 0,
  longitude: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
  premium: false,
  category: 'Other',
};

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

interface Props<TMutationData = unknown, TMutationError = unknown> {
  mutation?: UseMutationResult<TMutationData, TMutationError, Business>;
  businessData?: Business;
}

const transformBusinessData = (data: any): Partial<Business> => {
  return {
    name: data.name || "",
    description: data.description || "",
    phone: data.phone || "",
    heroImage: data.heroImage || null,
    latitude: data.latitude || 0,
    longitude: data.longitude || 0,
    createdAt: data.createdAt ? new Date(data.createdAt) : null,
    updatedAt: data.updatedAt ? new Date(data.updatedAt) : null,
    deletedAt: data.deletedAt ? new Date(data.deletedAt) : null,
  };
};

const ClientForm = <TMutationData, TMutationError, TMutationVariables>(props: Props) => {
  const { mutation, businessData } = props;

  const router = useRouter();

  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 0, lng: 0 });

  const form = useForm<Business>({
    defaultValues,
    mode: "onChange",
    resolver: zodResolver(BusinessSchema),
  });

  const { handleSubmit } = form;

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    if (event.latLng) {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      form.setValue("latitude", lat);
      form.setValue("longitude", lng);
      setMapCenter({ lat, lng });
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    await mutation?.mutateAsync(values);
  });

  useEffect(() => {
    if (businessData) {
      const transformedData = transformBusinessData(businessData);
      console.log(transformedData);
      form.reset(transformedData);
      setMapCenter({ lat: businessData.latitude, lng: businessData.longitude });
    } else {
      form.reset(defaultValues);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
        },
        () => {
          setMapCenter({ lat: 0, lng: 0 });
        }
      );
    }
  }, [businessData, form]);

  return (
    <Card className="flex flex-col gap-4 p-4 md:gap-8 md:p-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <h1 className="text-2xl font-bold">Crea tu negocio</h1>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            noValidate
            className="w-full mt-3 flex flex-col gap-8 px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8"
          >
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
              <div className="flex flex-col gap-8 px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                <InputFormField
                  controllerProps={{
                    control: form.control,
                    name: "name",
                  }}
                  label="Name"
                  type="text"
                  required
                />

                <div className="flex gap-4">
                  <InputFormField
                    className="flex-1"
                    controllerProps={{
                      control: form.control,
                      name: "description",
                    }}
                    label="Description"
                    type="text"
                    required
                  />

                  <InputFormField
                    className="flex-1"
                    controllerProps={{
                      control: form.control,
                      name: "category",
                    }}
                    label="Categoría"
                    type="text"
                    required
                  />
                </div>

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
                  accept="image/*"
                />
              </div>
              <div className="w-full flex flex-col gap-8 px-4 pb-4 sm:px-6 sm:pb-6 lg:px-8 lg:pb-8">
                {
                  (!!mapCenter.lat && !!mapCenter.lng) && (
                    <LoadScript
                      googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}
                      loadingElement={<div style={{ height: `100%` }}><Loader2 className="mr-2 h-4 w-4 animate-spin" /></div>}
                    >
                      <GoogleMap
                        mapContainerStyle={mapContainerStyle}
                        center={mapCenter}
                        zoom={14}
                        onClick={handleMapClick}
                      >
                        <Marker position={mapCenter} />
                      </GoogleMap>
                    </LoadScript>
                  )
                }
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-row items-center justify-end pb-2 gap-4">
        <Button variant={"outline"} onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button onClick={onSubmit}>
          {mutation?.isPending &&  <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mutation?.isPending ? "Creando negocio..." : "Continuar"}
        </Button>
      </CardFooter>
    </Card>
  )
}

export default ClientForm;