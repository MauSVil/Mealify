import { z } from "zod";

export const BusinessSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(3),
  owner: z.string().optional(),
  description: z.string().min(3),
  phone: z.string().min(3),
  heroImage: z.any(),
  latitude: z.number(),
  longitude: z.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
  stripeAccountId: z.string().nullable(),
});

export type Business = z.infer<typeof BusinessSchema>;

export const BusinessRepositoryFilterModel = z.object({
  owner: z.string().optional(),
  id: z.string().optional(),
});

export type BusinessRepositoryFilter = z.infer<typeof BusinessRepositoryFilterModel>;