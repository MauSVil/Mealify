import { AdminSignUp } from "@/lib/types/Zod/AdminSignUp";
import ky from "ky";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSignUp = () => {
  return useMutation({
    mutationFn: async (values: AdminSignUp) => {
      const resp = await ky.post("/api/admin/sign-up", { json: values }).json() as { data?: string, error?: string };
      return resp;
    },
    onSuccess: (resp) => {
      window.location.href = resp.data as string;
    },
    onError: () => {
      toast.error("Error al registrarse")
    },
  })
}