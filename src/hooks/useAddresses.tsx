import { Address } from "@/lib/types/Zod/Address";
import { useQuery } from "@tanstack/react-query";
import ky from "ky";

export const useAddresses = () => {
  return useQuery({
    queryKey: ['addresses'],
    queryFn: async () => {
      const resp = await ky.get('/api/user/addresses').json() as { data?: Address[], error?: string };
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
  });
}