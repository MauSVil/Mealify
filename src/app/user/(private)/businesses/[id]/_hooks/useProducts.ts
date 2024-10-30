import { Product } from "@/lib/types/Zod/Product";
import ky from "ky";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useProducts = (businessId: string) => {
  return useQuery({
    queryKey: ["products", businessId],
    queryFn: async () => {
      const resp = await ky.post("/api/user/products/search", { json: { businessId } }).json() as { data?: Product[], error?: string };
      return resp.data || [];
    },
  })
};