import { SerializedError } from "@/lib/types/SerializedError";
import { NewProduct } from "@/lib/types/Zod/Product";
import ky from "ky";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { toast } from "sonner";

export const useCreateProduct = () => {
  const router = useRouter();
  
  return useMutation<string, SerializedError, NewProduct>(
    async (values) => {
      const resp = await ky.post("/api/admin/products", { json: values }).json() as { data?: string, error?: string };
      return resp.data || '';
    },
    {
      onSuccess: (resp) => {
        toast.success(resp);
        router.push("/admin/products");
      },
      onError: () => {
        toast.error("Hubo un error al crear el producto");
      },
    }
  );
};