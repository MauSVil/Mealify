import { Business } from "@/lib/types/Zod/Business";
import ky from "ky";
import { useQuery } from "@tanstack/react-query";

export const useBusinesses = ({ latitude, longitude, selectedCategory }: { latitude: number | undefined, longitude: number | undefined, selectedCategory?: string }) => {
  return useQuery({
    queryKey: ['businesses', selectedCategory],
    queryFn: async () => {
      const resp = await ky.post('/api/user/restaurants/search', { json: {
        "latitude": latitude,
        "longitude": longitude,
        selectedCategory
    }}).json() as { data?: Business[], error?: string };
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
    enabled: !!latitude && !!longitude,
  });
}