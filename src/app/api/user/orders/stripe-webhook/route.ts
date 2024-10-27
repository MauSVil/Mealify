import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  try {
    const sig = req.headers.get('stripe-signature');
    if (!sig) throw new Error('No se encontró la firma de Stripe');

    const body = await req.arrayBuffer();
    const rawBody = new TextDecoder('utf-8').decode(body);

    const event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    if (event.type === 'checkout.session.completed') {
      console.log('CheckoutSession completed');
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateOrderUserAdmin]' }, { status: 400 });
  }
};
