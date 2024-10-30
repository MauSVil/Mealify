import { SerializedError } from "@/lib/types/SerializedError";
import { Business } from "@/lib/types/Zod/Business";
import ky from "ky";
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
    onError: (error) => {
      toast.error(error.message);
    },
  });
};