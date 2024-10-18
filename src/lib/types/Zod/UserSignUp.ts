import { z } from "zod";

export const UserSignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export type UserSignUp = z.infer<typeof UserSignUpSchema>;