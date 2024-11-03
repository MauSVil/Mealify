import { SerializedError } from "@/lib/types/SerializedError";
import { NewProduct, Product } from "@/lib/types/Zod/Product";
import ky from "ky";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useEditProduct = () => {  
  return useMutation<Product, SerializedError, NewProduct>({
    mutationFn: async (values) => {
      const resp = await ky.put("/api/admin/products", { json: values }).json() as { data: Product, error?: string };
      return resp.data;
    },
    onError: () => {
      toast.error("Hubo un error al crear el producto");
    },
  });
};