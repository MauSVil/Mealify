import { UserSignUp } from "@/lib/types/Zod/UserSignUp";
import ky from "ky";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignIn = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: async (values: UserSignUp) => {
      const resp = await ky.post("/api/user/sign-in", { json: values }).json() as { data?: string, error?: string };
      return resp;
    },
    onSuccess: (resp) => {
      toast.success('Se ha iniciado sesión correctamente')
      setTimeout(() => {
        router.push("/user/dashboard")
      }, 1000)
    },
    onError: () => {
      toast.error("Error al iniciar sesión")
    },
  })
}