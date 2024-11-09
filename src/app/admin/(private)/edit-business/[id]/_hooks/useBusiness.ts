import { Business } from "@/lib/types/Zod/Business";
import { useQuery } from "@tanstack/react-query"
import ky from "ky";

export const useBusiness = (businessId: string) => {
  return useQuery({
    queryKey: ['business', 'admin'],
    queryFn: async () => {
      const resp = await ky.post('/api/admin/business/search', { json: { id: businessId } }).json() as { data: Business, error?: string };
      return resp.data || {};
    },
  })
}