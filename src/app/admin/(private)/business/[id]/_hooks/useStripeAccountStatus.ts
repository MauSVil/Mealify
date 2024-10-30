import ky from "ky";
import { useQuery } from "@tanstack/react-query";

export const useStripeAccountStatus = (businessId: string) => {
  return useQuery({
    queryKey: ['stripe-account-status', businessId],
    queryFn: async () => {
      try {
        const resp = await ky.get(`/api/admin/business/check-account-status?businessId=${businessId}`).json() as { data?: boolean, error?: string };
        return resp.data;
      } catch (e) {
        console.log(e);
      }
    },
    refetchOnWindowFocus: false,
  });
}