import { Business } from "@/lib/types/Zod/Business";
import ky from "ky";
import { useQuery } from "react-query";

export const useBusinesses = (lat: number | undefined, long: number | undefined) => {
  return useQuery({
    queryKey: ['businesses'],
    queryFn: async () => {
      const resp = await ky.post('/api/user/restaurants/search', { json: {
        "latitude": lat,
        "longitude": long 
    }}).json() as { data?: Business[], error?: string };
      return resp.data || [];
    },
    refetchOnWindowFocus: false,
    enabled: !!lat && !!long,
  });
}

// "latitude": 19.505450,
//         "longitude": -99.247842