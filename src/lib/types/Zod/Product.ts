import { z } from "zod";

export const ProductSchema = z.object({
  _id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  available: z.boolean(),
  image: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional(),
  restaurantId: z.string(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductRepositoryFilterModel = z.object({
  name: z.string().optional(),
  available: z.boolean().optional(),
  restaurantId: z.string().optional(),
});

export type ProductRepositoryFilter = z.infer<typeof ProductRepositoryFilterModel>;

export const NewProductSchema = z.object({
  name: z.string(),
  description: z.string(),
  price: z.number(),
  available: z.boolean(),
  image: z.string(),
});

export type NewProduct = z.infer<typeof NewProductSchema>;