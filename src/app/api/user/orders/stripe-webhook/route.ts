import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

// Helper para leer el cuerpo sin procesar
async function buffer(req: NextRequest) {
  if (req.body === null) {
    return Buffer.alloc(0);
  }
  const chunks = [];
  const reader = req.body.getReader();

  let result;
  while (!(result = await reader.read()).done) {
    chunks.push(result.value);
  }

  return Buffer.concat(chunks);
}

export const POST = async (req: NextRequest) => {
  try {
    const sig = req.headers.get('stripe-signature');
    if (!sig) throw new Error('No se encontró la firma de Stripe');

    const buf = await buffer(req);

    const event = stripe.webhooks.constructEvent(
      buf,
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
