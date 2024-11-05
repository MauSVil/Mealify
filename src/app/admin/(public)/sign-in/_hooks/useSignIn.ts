import { AdminSignUp } from "@/lib/types/Zod/AdminSignUp";
import ky from "ky";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignIn = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: AdminSignUp) => {
      const resp = await ky.post("/api/admin/sign-in", { json: values }).json() as { data?: string, error?: string };
      return resp;
    },
    onSuccess: (resp) => {
      toast.success('Se ha iniciado sesión correctamente')
      setTimeout(() => {
        router.push("/admin/dashboard")
      }, 1500)
    },
    onError: () => {
      toast.error("Error al iniciar sesión")
    },
  })
}