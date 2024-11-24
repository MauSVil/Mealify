import { UsersRepository } from "@/lib/Repositories/User.repository";
import { validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const POST = async (req: NextRequest) => {
  try {
    const token = await validateIfToken(req, 'dtoken');
    const user = await jwt.verify(token, process.env.DELIVERY_JWT_SECRET!) as { id: string };
    const body = await req.json();
    const userFound = await UsersRepository.findOne({ id: user.id });
    if (!userFound) throw new Error('No se encontró el usuario');

    const accountLink = await stripe.accountLinks.create({
      account: userFound.stripeAccountId!,
      return_url: `${req.headers.get("origin")}/delivery/sign-in`,
      refresh_url: `${req.headers.get("origin")}/delivery/dashboard`,
      type: "account_onboarding",
    });

    await UsersRepository.updateOne(user.id, { onboardingFinished: true, ...body });
    return NextResponse.json({ data: accountLink.url });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CompleteOnboardingDelivery]' }, { status: 400 });
  }
}