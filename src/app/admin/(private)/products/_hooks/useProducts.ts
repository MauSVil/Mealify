import { useQuery } from "react-query";
import ky from "ky";
import { Product } from "@/lib/types/Zod/Product";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const resp = await ky.post('/api/products/search', { json: {} }).json() as Product[]
      return resp
    },
  });
};