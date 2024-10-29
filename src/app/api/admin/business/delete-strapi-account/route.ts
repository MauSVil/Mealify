import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const DELETE = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const accountId = body.accountId;
    const deletedAccount = await stripe.accounts.del(accountId);
    return NextResponse.json({ data: deletedAccount, error: '' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [DeleteStrapiAccountAdmin]' }, { status: 400 });
  }
}