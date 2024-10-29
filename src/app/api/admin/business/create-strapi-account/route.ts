import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const POST = async (req: NextRequest) => {
  try {
    const account = await stripe.accounts.create({
      type: 'express'
    });

    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      return_url: 'http://localhost:3000/admin/dashboard',
      refresh_url: 'http://localhost:3000/admin/dashboard',
      type: 'account_onboarding',
    });

    console.log(accountLink.url);

    return NextResponse.json({ data: accountLink.url, error: '' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateStrapiAccountAdmin]' }, { status: 400 });
  }
}