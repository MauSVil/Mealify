import { validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const POST = async (req: NextRequest) => {
  try {
    const token = await validateIfToken(req, 'atoken');
    const tokenData = await jwt.verify(token, process.env.JWT_SECRET!) as { stripeAccountId: string };

    const accountLink = await stripe.accountLinks.create({
      account: tokenData.stripeAccountId,
      return_url: `${req.headers.get("origin")}/admin/dashboard`,
      refresh_url: `${req.headers.get("origin")}/admin/dashboard`,
      type: "account_onboarding",
    });

    return NextResponse.json({ data: accountLink.url, error: '' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [EditOnboardingAdmin]' }, { status: 400 });
  }
}