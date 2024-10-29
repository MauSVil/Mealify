import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const POST = async (req: NextRequest) => {
  try {
    const { businessId } = await req.json();

    const business = await BusinessRepository.findOne({ id: businessId });
    if (!business) throw new Error('Business not found');

    if (business.stripeAccountId) {
      const accountLink = await stripe.accountLinks.create({
        account: business.stripeAccountId,
        return_url: `${req.headers.get("origin")}/admin/business/${businessId}`,
        refresh_url: `${req.headers.get("origin")}/admin/business/${businessId}`,
        type: 'account_onboarding',
      });
      return NextResponse.json({ data: accountLink.url, error: '' });
    }

    const account = await stripe.accounts.create({
      type: 'express'
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      return_url: `${req.headers.get("origin")}/admin/business/${businessId}`,
      refresh_url: `${req.headers.get("origin")}/admin/business/${businessId}`,
      type: 'account_onboarding',
    });

    await BusinessRepository.updateOne(businessId, { stripeAccountId: account.id });

    return NextResponse.json({ data: accountLink.url, error: '' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateStrapiAccountAdmin]' }, { status: 400 });
  }
}