import ky from "ky";
import { useQuery } from "react-query";
import { toast } from "sonner";

export const useClients = () => {
  return useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      try {
        const resp = await ky.get("/api/admin/clients/search").json() as { data?: string, error?: string };
        return resp;
      } catch (e) {
        if (e instanceof Error) {
          toast.error(e.message)
        }
        toast.error('Error al buscar clientes')
      }
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchInterval: false,
  })
}