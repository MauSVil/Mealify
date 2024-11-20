import { z } from "zod";

export const AddressSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  user: z.string(),
});

export type Address = z.infer<typeof AddressSchema>;

export const AddressRepositoryFilterModel = z.object({
  id: z.string().optional(),
  user: z.string().optional(),
});

export type AddressRepositoryFilter = z.infer<typeof AddressRepositoryFilterModel>;