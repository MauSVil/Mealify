import { Business } from "@/lib/types/Zod/Business";
import ky from "ky";
import { useQuery } from "react-query";

export const useBusinesses = () => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const resp = await ky.post('/api/user/restaurants/search', { json: {
        "latitude": 19.505450,
        "longitude": -99.247842
    }}).json() as { data?: Business[], error?: string };
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
  });
}