import ky from "ky";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@/lib/types/Zod/Order";

export const useOrders = () => {
  return useQuery({
    queryKey: ['orders', 'dashboard'],
    queryFn: async () => {
      const resp = await ky.get('/api/user/orders/search').json() as { data?: Order[], error?: string };
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
  });
}