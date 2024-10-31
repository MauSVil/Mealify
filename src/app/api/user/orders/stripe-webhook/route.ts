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
        throw new Error('No se encontró la orden');
      }
      await OrderRepository.updateOne(order._id!, { status: 'paid' });
  
      const shippingAmount = session.metadata?.shippingAmount || 0;
      console.log(`Monto de envío: ${shippingAmount}`);
  
      const paymentIntentId = session.payment_intent;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
      const chargeId = paymentIntent.latest_charge;
  
      const charge = await stripe.charges.retrieve(chargeId as string);
      const balanceTransactionId = charge.balance_transaction;

      let withStripeFee = false;
      let amount = charge.amount;
  
      if (balanceTransactionId) {
        const balanceTransaction = await stripe.balanceTransactions.retrieve(balanceTransactionId as string);
        const netAmount = balanceTransaction.net;
        amount = netAmount;
        withStripeFee = true;
        console.log(`Monto neto después de comisiones: ${netAmount}`);
      } else {
        console.error('No se encontró el balance_transaction para el charge.');
      }

      const stripeFee = Math.round(amount * 0.04);
      const platformFee = Math.round(amount * 0.10);
      const deliveryFee = Math.round(amount * 0.05);
      let restaurantAmount = amount - platformFee - deliveryFee;

      if (!withStripeFee) restaurantAmount -= stripeFee;

      console.log(`Monto original del charge: ${amount}`);
      console.log(`Comisión para plataforma: ${platformFee}`);
      console.log(`Comisión para repartidor: ${deliveryFee}`);
      console.log(`Comisión para Stripe: ${stripeFee}`);
      console.log(`Monto para el restaurante: ${restaurantAmount}`);

      // Transferencia para el restaurante
      await stripe.transfers.create({
        amount: restaurantAmount,
        currency: 'mxn',
        destination: "acct_1QFHwyD5KLGk800D", // Toks
        source_transaction: chargeId as string,
        transfer_group: `group_${session.id}`,
      });

      // Transferencia para el repartidor
      await stripe.transfers.create({
        amount: deliveryFee,
        currency: 'mxn',
        destination: "acct_1QF7PLRiGCLkNX6A", // Repartidor?
        source_transaction: chargeId as string,
        transfer_group: `group_${session.id}`,
      });

      console.log(`Transferencias realizadas exitosamente para la sesión ${session.id}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`❌ Error message: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 400 });
    }
    console.error(`❌ Error message: ${err}`);
    return NextResponse.json({ error: 'Webhook Error: Invalid signature' }, { status: 400 });
  }
}
