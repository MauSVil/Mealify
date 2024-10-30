import { Business } from "@/lib/types/Zod/Business";
import ky from "ky";
import { useQuery } from "@tanstack/react-query";

export const useBusiness = (businessId: string) => {
  return useQuery<Business>({
    queryKey: ["business", businessId],
    queryFn: async () => {
      const resp = await ky.post('/api/admin/business/search', { json: { id: businessId } }).json() as { data: Business, error?: string };
      return resp.data;
    },
  })
};