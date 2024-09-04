import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type User = z.infer<typeof UserSchema>;

export const UserRepositoryFilterModel = z.object({});

export type UserRepositoryFilter = z.infer<typeof UserRepositoryFilterModel>;