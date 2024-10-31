import { z } from "zod";

export const OrderSchema = z.object({
  _id: z.string().optional(),
  restaurant: z.string(),
  user: z.string(),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  status: z.enum(['pending', 'paid', 'canceled']).default('pending'),
  checkoutSessionId: z.string().default(''),
  paymentIntentId: z.string().default(''),
  shippingAmount: z.number().default(0),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  deletedAt: z.coerce.date().optional().nullable(),
});

export type Order = z.infer<typeof OrderSchema>;

export const OrderRepositoryFilterModel = z.object({
  id: z.string().optional(),
  checkoutSessionId: z.string().optional(),
  paymentIntentId: z.string().optional(),
  user: z.string().optional(),
});

export type OrderRepositoryFilter = z.infer<typeof OrderRepositoryFilterModel>;