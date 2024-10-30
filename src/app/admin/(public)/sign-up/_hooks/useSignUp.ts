import { AdminSignUp } from "@/lib/types/Zod/AdminSignUp";
import ky from "ky";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignUp = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: AdminSignUp) => {
      const resp = await ky.post("/api/admin/sign-up", { json: values }).json() as { message?: string, error?: string };
      return resp;
    },
    onSuccess: (resp) => {
      toast.success(resp.message)
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1000)
    },
    onError: () => {
      toast.error("Error al registrarse")
    },
  })
}