import { AdminSignUp } from "@/lib/types/Zod/AdminSignUp";
import ky from "ky";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useSignUp = () => {
  const router = useRouter()
  return useMutation({
    mutationFn: async (values: AdminSignUp) => {
      const resp = await ky.post("/api/delivery/sign-up", { json: values }).json() as { data?: string, error?: string };
      return resp;
    },
    onSuccess: (resp) => {
      toast.success(resp.data)
      setTimeout(() => {
        router.push("/delivery/onboard")
      }, 1000);
    },
    onError: () => {
      toast.error("Error al registrarse")
    },
  })
}