import { useQuery } from "react-query";
import ky from "ky";
import { Product } from "@/lib/types/Zod/Product";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: async () => {
      const resp = await ky.post('/api/admin/products/search', { json: {} }).json() as { data?: Product[], error?: string };
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
  });
};