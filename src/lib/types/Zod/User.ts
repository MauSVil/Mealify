import { z } from "zod";

export const UserSchema = z.object({
  _id: z.string().optional(),
  email: z.string(),
  password: z.string(),
  name: z.string(),
  firstLastName: z.string(),
  secondLastName: z.string(),
  age: z.number(),
  telephone: z.string(),
  vehicle: z.string(),
  vehicleRegistration: z.string().nullable(),
  motorType: z.string().nullable(),
  role: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  stripeAccountId: z.string().nullable(),
  onboardingFinished: z.boolean().default(false),
  stripeConfigFinished: z.boolean().default(false),
  customerId: z.string().optional(),
  active: z.boolean().default(false),
  onHold: z.boolean().default(false),
});

export type User = z.infer<typeof UserSchema>;

export const UserRepositoryFilterModel = z.object({
  email: z.string().optional(),
  role: z.enum(['admin', 'user', 'delivery']).optional(),
  id: z.string().optional(),
  stripeAccountId: z.string().optional(),
});

export type UserRepositoryFilter = z.infer<typeof UserRepositoryFilterModel>;