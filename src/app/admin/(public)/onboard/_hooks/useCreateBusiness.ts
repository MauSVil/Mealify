import { SerializedError } from "@/lib/types/SerializedError";
import { Business } from "@/lib/types/Zod/Business";
import ky from "ky";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";

const timeout = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useCreateBusiness = () => {
  const router = useRouter();
  return useMutation<{}, SerializedError, Business>({
    mutationFn: async (values) => {
      const resp = await ky.post("/api/admin/business", { json: values }).json() as { data?: Business, error?: string };
      Cookies.set('business', resp.data?._id || '');
      return resp.data || {};
    },
    onSuccess: async () => {
      toast.success('Se ha creado el business correctamente');
      timeout(1000);
      router.push("/admin/dashboard");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
};