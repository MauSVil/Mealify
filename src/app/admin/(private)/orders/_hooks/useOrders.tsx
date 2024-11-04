import { Order } from "@/lib/types/Zod/Order";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders', 'admin'],
    queryFn: async () => {
      const resp = await ky.post('/api/admin/orders/search').json() as { data?: Order[], error?: string };
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
  });
}