import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { OrderRepository } from '@/lib/Repositories/Order.repository';

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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const sessionId = session.id;
      const order = await OrderRepository.findOne({ checkoutSessionId: sessionId });
      if (!order) {
        return NextResponse.json({ error: 'No se encontró la orden' }, { status: 400 });
      }
      await OrderRepository.updateOne(order._id!, { status: 'paid' });

      const shippingAmount = session?.metadata?.shippingAmount || 0;
      const paymentIntentId = session.payment_intent;

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
      const chargeId = paymentIntent.latest_charge;

      const charge = await stripe.charges.retrieve(chargeId as string);
      const balanceTransactionId = charge.balance_transaction;
      const balanceTransaction = await stripe.balanceTransactions.retrieve(balanceTransactionId as string);

      const netAmount = balanceTransaction.net;

      console.log(netAmount, 'netAmount');

      const platformFee = Math.round(netAmount * 0.10);
      const deliveryFee = Math.round(netAmount * 0.05);
      const restaurantAmount = netAmount - platformFee - deliveryFee;

      console.log(platformFee, deliveryFee, restaurantAmount);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error(`❌ Error message: ${err instanceof Error ? err.message : 'Unknown error'}`);
    return NextResponse.json({ error: 'Webhook Error: Invalid signature' }, { status: 400 });
  }
}
