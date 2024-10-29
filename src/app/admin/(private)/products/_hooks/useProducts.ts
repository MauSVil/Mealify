import { useQuery } from "react-query";
import ky, { HTTPError } from "ky";
import { Product } from "@/lib/types/Zod/Product";
import { toast } from "sonner";

export const useProducts = () => {
  return useQuery<Product[], HTTPError>({
    queryKey: ["products"],
    queryFn: async () => {
      const resp = await ky
        .post('/api/admin/products/search', { json: {} })
        .json<{ data?: Product[], error?: string }>();
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
    onError: async (error: HTTPError) => {
      const errorBody = await error.response.json<{ error?: string }>();
      toast.error(errorBody.error || error.message);
    },
  });
};