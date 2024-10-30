import { Business } from "@/lib/types/Zod/Business";
import ky from "ky";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

export const useClient = (businessId: string) => {
  return useQuery({
    queryKey: ["client", businessId],
    queryFn: async () => {
      const resp = await ky.post("/api/user/restaurants", { json: { id: businessId } }).json() as { data?: Business, error?: string };
      return resp.data || {};
    },
    onError: (error) => {
      if (error instanceof Error) {
        toast.error(error.message);
        return;
      }
      toast.error("Error al buscar productos");
    },
  })
};