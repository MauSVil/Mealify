import { z } from "zod";

export const AdminSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type AdminSignUp = z.infer<typeof AdminSignUpSchema>;