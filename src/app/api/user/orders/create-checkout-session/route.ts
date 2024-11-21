import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { ProductCart } from "@/lib/types/Zod/Product";
import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import ky from "ky";
import jwt from 'jsonwebtoken';
import { validateIfToken } from "@/lib/utils";
import { OrderRepository } from "@/lib/Repositories/Order.repository";
import { Order } from "@/lib/types/Zod/Order";
import { AddressRepository } from "@/lib/Repositories/Address.repository";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const stripeComission = 7;
const myComission = 10;

export const POST = async (req: NextRequest) => {
  try {
    const token = await validateIfToken(req, 'utoken');

    const user = await jwt.verify(token, process.env.USER_JWT_SECRET!) as { id: string };

    const body = await req.json();
    const { products, address, deliveryPersonComission = 5 } = body as {
      products: { [id: string]: ProductCart },
      address: string,
      deliveryPersonComission?: number,
    };
    if (!products || Object.keys(products).length === 0) {
      return NextResponse.json({ error: 'No hay productos' }, { status: 400 });
    }

    const addressFound = await AddressRepository.findOne({ id: address });
    if (!addressFound) throw new Error('Address not found');
    const { latitude, longitude } = addressFound;

    const business = await BusinessRepository.findOne({ id: products[Object.keys(products)[0]].restaurantId });
    if (!business) {
      return NextResponse.json({ error: 'Negocio no encontrado' }, { status: 400 });
    }

    const eta = await ky.post(`${req.headers.get('origin')}/api/user/orders/eta`, {
      json: {
        user: { longitude, latitude },
        restaurant: { longitude: business.longitude, latitude: business.latitude },
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

    const shippingCost = Math.round(Number(eta.shippingCost) * 100);

    lineItems.push({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: 'Gastos de envío',
          images: [],
        },
        unit_amount: shippingCost,
      },
      quantity: 1,
    });

    const platformCommission = Math.round(subtotal * (myComission / 100));
    const stripeFee = Math.round(subtotal * (stripeComission / 100));
    const deliveryFee = Math.round(subtotal * (deliveryPersonComission / 100));
    const totalCommission = platformCommission + stripeFee;

    lineItems.push({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: 'Propina del repartidor',
          images: [],
        },
        unit_amount: deliveryFee,
      },
      quantity: 1,
    })

    lineItems.push({
      price_data: {
        currency: 'mxn',
        product_data: {
          name: 'Comision',
          images: [],
        },
        unit_amount: totalCommission,
      },
      quantity: 1,
    });

    const orderToAdd: Order = {
      restaurant: products[Object.keys(products)[0]].restaurantId!,
      user: user.id,
      products: Object.keys(products).map((key) => {
        const product = products[key];
        return {
          id: product._id!,
          name: product.name,
          price: product.price,
          quantity: product.quantity,
        };
      }),
      status: 'pending',
      checkoutSessionId: '',
      paymentIntentId: '',
      shippingAmount: shippingCost,
      userLat: latitude,
      userLon: longitude,
      deliveryStatus: null,
      deliveryPersonComission,
    }

    const insertedId = await OrderRepository.insertOne(orderToAdd);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      locale: 'es',
      success_url: `${req.headers.get('origin') || 'http://localhost:3000'}/user/orders/${insertedId}`,
      cancel_url: `${req.headers.get('origin') || 'http://localhost:3000'}/user/orders/cancel`,
      metadata: {
        shippingAmount: shippingCost,
      },
    });

    await OrderRepository.updateOne(insertedId, { checkoutSessionId: session.id });

    return NextResponse.json({ data: session.id });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateCheckoutSessionUserAdmin]' }, { status: 400 });
  }
};
