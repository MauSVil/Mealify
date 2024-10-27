import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { ProductCart } from "@/lib/types/Zod/Product";
import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import ky from "ky";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const commission = 5;

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { products, userLon, userLat } = body as {
      products: { [id: string]: ProductCart },
      userLon: number,
      userLat: number,
    };
    if (!products || Object.keys(products).length === 0) {
      return NextResponse.json({ error: 'No hay productos' }, { status: 400 });
    }

    const restaurant = await BusinessRepository.findOne({ id: products[Object.keys(products)[0]].restaurantId });
    if (!restaurant) {
      return NextResponse.json({ error: 'Restaurante no encontrado' }, { status: 400 });
    }

    const eta = await ky.post(`${req.headers.get('origin')}/api/user/orders/eta`, {
      json: {
        user: { longitude: userLon, latitude: userLat },
        restaurant: { longitude: restaurant.longitude, latitude: restaurant.latitude },
      }
    }).json() as {
      durationInSeconds: number,
      distance: string,
      duration: string,
      shippingCost: string,
    }

    let subtotal = 0;
    const lineItems = Object.keys(products).map((key) => {
      const product = products[key];
      const productTotal = product.price * product.quantity * 100;
      subtotal += productTotal;
      return {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: product.name,
            images: [product.image as string],
          },
          unit_amount: product.price * 100,
        },
        quantity: product.quantity,
      };
    });

    const commissionAmount = Math.round(subtotal * (commission / 100));

    lineItems.push({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: 'Comisión de servicio',
          images: [],
        },
        unit_amount: commissionAmount,
      },
      quantity: 1,
    });


    lineItems.push({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: 'Gastos de envío',
          images: [],
        },
        unit_amount: Math.floor(Number(eta.shippingCost) * 100),
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/user/orders/success`,
      cancel_url: `${req.headers.get('origin')}/user/orders/cancel`,
    });

    return NextResponse.json({ data: session.id });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateCheckoutSessionUserAdmin]' }, { status: 400 });
  }
};
