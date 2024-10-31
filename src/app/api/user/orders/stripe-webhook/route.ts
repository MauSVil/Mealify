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
  
      // Actualizar la orden en tu base de datos
      const order = await OrderRepository.findOne({ checkoutSessionId: sessionId });
      if (!order) {
        throw new Error('No se encontró la orden');
      }
      await OrderRepository.updateOne(order._id!, { status: 'paid' });
      console.log(`Orden ${order._id} actualizada a 'paid'`);
  
      const shippingAmount = session.metadata?.shippingAmount || 0;
      console.log(`Monto de envío: ${shippingAmount}`);
  
      const paymentIntentId = session.payment_intent;
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId as string);
      const chargeId = paymentIntent.latest_charge;
  
      const charge = await stripe.charges.retrieve(chargeId as string);
      const balanceTransactionId = charge.balance_transaction;
  
      if (balanceTransactionId) {
        const balanceTransaction = await stripe.balanceTransactions.retrieve(balanceTransactionId as string);
        const netAmount = balanceTransaction.net;
  
        console.log(`Monto neto después de comisiones: ${netAmount}`);
  
        // Cálculo de comisiones y distribución
        const platformFee = Math.round(netAmount * 0.10);
        const deliveryFee = Math.round(netAmount * 0.05);
        const restaurantAmount = netAmount - platformFee - deliveryFee;
  
        console.log(`Comisión para plataforma: ${platformFee}`);
        console.log(`Comisión para repartidor: ${deliveryFee}`);
        console.log(`Monto para el restaurante: ${restaurantAmount}`);
  
        // Realiza las transferencias a cuentas conectadas si es necesario
      } else {
        console.error('No se encontró el balance_transaction para el charge.');
      }
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
