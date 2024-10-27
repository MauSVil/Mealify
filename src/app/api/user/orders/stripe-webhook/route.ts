import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No se encontró la firma de Stripe' }, { status: 400 });
  }

  try {
    req.headers.set('Content-Type', 'application/json');

    const body = await req.arrayBuffer();
    const buf = Buffer.from(body);

    const event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      console.log(`💰 PaymentIntent status: ${paymentIntent.status}`);
    } else if (event.type === 'charge.succeeded') {
      const charge = event.data.object as Stripe.Charge;
      console.log(`💵 Charge id: ${charge.id}`);
    } else {
      console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error(`❌ Error message: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return NextResponse.json({ error: 'Webhook Error: Invalid signature' }, { status: 400 });
  }
}
