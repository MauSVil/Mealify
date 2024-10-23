import { SerializedError } from "@/lib/types/SerializedError";
import { NewProduct, Product } from "@/lib/types/Zod/Product";
import ky from "ky";
import { useRouter } from "next/navigation";
import { useMutation } from "react-query";
import { toast } from "sonner";

export const useCreateProduct = () => {
  const router = useRouter();
  
  return useMutation<{}, SerializedError, NewProduct>(
    async (values) => {
      const formData = new FormData();
      const { image, ...rest } = values;

      formData.append('image', image);
      formData.append('data', JSON.stringify(rest));

      const resp = await ky.post("/api/admin/products", { body: formData }).json() as { data?: Product, error?: string };
      return resp.data || '';
    },
    {
      onSuccess: (resp) => {
        toast.success('Se ha creado el producto correctamente');
        router.push("/admin/products");
      },
      onError: () => {
        toast.error("Hubo un error al crear el producto");
      },
    }
  );
};