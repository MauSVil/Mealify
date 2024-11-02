import { useQuery } from "@tanstack/react-query";
import ky, { HTTPError } from "ky";
import { Product } from "@/lib/types/Zod/Product";

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
  });
};