import { z } from "zod";

export const ProductSchema = z.object({
  _id: z.string().optional(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number().min(1),
  available: z.boolean(),
  image: z.any(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
  restaurantId: z.string().optional(),
});

export type Product = z.infer<typeof ProductSchema>;

export const ProductRepositoryFilterModel = z.object({
  name: z.string().optional(),
  available: z.boolean().optional(),
  restaurantId: z.string().optional(),
});

export type ProductRepositoryFilter = z.infer<typeof ProductRepositoryFilterModel>;

export const NewProductSchema = ProductSchema.omit({ _id: true });

export type NewProduct = z.infer<typeof NewProductSchema>;