import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { OrderRepository } from '@/lib/Repositories/Order.repository';
import { BusinessRepository } from '@/lib/Repositories/Business.repository';

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
      const paymentIntentId = session.payment_intent;
      const shippingAmount = session.metadata?.shippingAmount || 0;
  
      const order = await OrderRepository.findOne({ checkoutSessionId: sessionId });
      if (!order) {
        throw new Error('No se encontró la orden');
      }
      await OrderRepository.updateOne(order._id!, {
        status: 'paid',
        paymentIntentId: paymentIntentId?.toString(),
        checkoutSessionId: sessionId,
        shippingAmount: Number(shippingAmount),
      });
    }

    if (event.type === 'charge.updated') {
      const charge = event.data.object;
      const chargeId = charge.id;
      const paymentIntentId = charge.payment_intent;
    
      const balanceTransactionId = charge.balance_transaction;
    
      if (balanceTransactionId) {
        const balanceTransaction = await stripe.balanceTransactions.retrieve(balanceTransactionId as string);
        const netAmount = balanceTransaction.net;

        const order = await OrderRepository.findOne({ paymentIntentId: paymentIntentId?.toString() });
        if (!order) throw new Error('No se encontró la orden para este paymentIntent');
        const business = await BusinessRepository.findOne({ id: order.restaurant });
        if (!business) throw new Error('No se encontró el restaurante para esta orden');

        const { checkoutSessionId, shippingAmount } = order;
    
        const platformFee = Math.round(netAmount * 0.10);
        const deliveryFee = Math.round(netAmount * 0.05);
        const restaurantAmount = netAmount - platformFee - deliveryFee;
    
        console.log('*********************');
        console.log(`Monto neto después de comisiones: ${netAmount}`);
        console.log(`Comisión para plataforma: ${platformFee}`);
        console.log(`Comisión para repartidor: ${deliveryFee}`);
        console.log(`Monto para el restaurante: ${restaurantAmount}`);
        console.log('*********************');

        // Transferencia para el restaurante
        await stripe.transfers.create({
          amount: restaurantAmount,
          currency: 'mxn',
          destination: business.stripeAccountId as string,
          source_transaction: chargeId as string,
          transfer_group: `group_${checkoutSessionId}`,
        });

        // Transferencia para el repartidor
        await stripe.transfers.create({
          amount: deliveryFee,
          currency: 'mxn',
          destination: "acct_1QF7PLRiGCLkNX6A", // Repartidor?
          source_transaction: chargeId as string,
          transfer_group: `group_${checkoutSessionId}`,
        });

      } else {
        console.error('No se encontró el balance_transaction en el evento charge.updated.');
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
