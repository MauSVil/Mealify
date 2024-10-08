import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  role: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type User = z.infer<typeof UserSchema>;

export const UserRepositoryFilterModel = z.object({
  email: z.string().optional(),
  role: z.enum(['admin', 'user']).optional(),
});

export type UserRepositoryFilter = z.infer<typeof UserRepositoryFilterModel>;