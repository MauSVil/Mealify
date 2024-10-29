import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { NextRequest, NextResponse } from "next/server";
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const GET = async (req: NextRequest) => {
  try {
    const businessId = req.nextUrl.searchParams.get("businessId");
    if (!businessId) {
      return NextResponse.json({ error: 'businessId is missing' }, { status: 400 });
    }

    const business = await BusinessRepository.findOne({ id: businessId });
    if (!business) throw new Error('Business not found');

    if (!business.stripeAccountId) throw new Error('Stripe account not found');

    const account = await stripe.accounts.retrieve(business.stripeAccountId);
    const requirementsCurrentlyDue = account?.requirements?.currently_due;
    const status = requirementsCurrentlyDue ? requirementsCurrentlyDue.length > 0 : true;
    return NextResponse.json({ data: status }, { status: 200 });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CheckAccountStatusAdmin]' }, { status: 400 });
  }
}