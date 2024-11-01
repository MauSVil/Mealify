import ky from "ky";
import { useQuery } from "@tanstack/react-query";
import { Order } from "@/lib/types/Zod/Order";

export const useOrder = (id: string) => {
  return useQuery<Order>({
    queryKey: ['orders', id],
    queryFn: async () => {
      const resp = await ky.post('/api/user/orders/search', { json: { id } }).json() as { data: Order, error?: string };
      return resp.data || {};
    },
    refetchOnWindowFocus: false,
  });
}