import { z } from "zod";

export const OrderSchema = z.object({
  _id: z.string().optional(),
  checkoutSessionId: z.string(),
  restaurant: z.string(),
  user: z.string(),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  status: z.enum(['pending', 'paid', 'canceled']).default('pending'),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderRepositoryFilterModel = z.object({
  id: z.string().optional(),
});

export type OrderRepositoryFilter = z.infer<typeof OrderRepositoryFilterModel>;