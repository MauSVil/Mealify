import { Business } from "@/lib/types/Zod/Business";
import ky from "ky";
import { useQuery } from "@tanstack/react-query";

export const useBusinesses = ({ address, selectedCategory }: { address?: string, selectedCategory?: string }) => {
  return useQuery({
    queryKey: ['businesses', selectedCategory, address],
    queryFn: async () => {
      const resp = await ky.post('/api/user/restaurants/dashboard', { json: {
        address,
        selectedCategory
    }}).json() as { data?: Record<string, Business[]>, error?: string };
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
  });
}