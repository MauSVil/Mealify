import { SerializedError } from "@/lib/types/SerializedError";
import { Business } from "@/lib/types/Zod/Business";
import ky, { HTTPError } from "ky";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";

const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useCreateBusiness = () => {
  const router = useRouter();
  return useMutation<Business, SerializedError, Business>({
    mutationFn: async (values) => {
      const formData = new FormData();
      const { heroImage, ...rest } = values;
      formData.append('heroImage', heroImage);
      formData.append('data', JSON.stringify(rest));

      const resp = await ky.post("/api/admin/business", { body: formData }).json() as { data: Business, error?: string };

      Cookies.set('business', resp.data?._id || '');
      return resp.data;
    },
    onSuccess: async (data) => {
      toast.success('Se ha creado el business correctamente');
      timeout(1000);
      router.push(`/admin/business/${data?._id}`);
    },
    onError: async (error) => {
      if (error instanceof HTTPError) {
        const errorBody = await error.response.json<{ error?: string }>();
        if (errorBody.error === 'El usuario no ha completado el onboarding') {
          toast('No se ha completado el onboarding', {
            duration: 10000,
            icon: '🚨',
            action: {
              label: 'Volver a onboarding',
              onClick: async () => {
                try {
                  const resp = await ky.post('/api/admin/edit-onboarding').json() as { data: string, error?: string };
                  window.location.href = resp.data;
                } catch (e) {
                  console.error(e);
                }
              },
            }
          })
        }
        return;
      }
      toast.error('Error al crear el business');
    },
  });
};