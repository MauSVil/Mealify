import { UsersRepository } from "@/lib/Repositories/User.repository";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const user = await UsersRepository.findOne({ email, role: 'delivery' });
    if (user) {
      return NextResponse.json({ error: 'Delivery already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertedId = await UsersRepository.insertOne({
      email,
      password: hashedPassword,
      role: 'delivery',
      createdAt: new Date(),
      updatedAt: new Date(),
      stripeAccountId: null,
      onboardingFinished: false,
    });

    const insertedUser = await UsersRepository.findOne({ id: insertedId });

    if (!insertedUser) throw new Error('No se ha podido crear el usuario');

    const account = await stripe.accounts.create({
      type: "express",
      email: email,
      business_type: "individual",
      country: "MX",
    });

    await UsersRepository.updateOne(insertedUser._id!, { stripeAccountId: account.id });

    return NextResponse.json({ data: 'Se creo el repartidor correctamente' });
  } catch (e) {
    console.error('Error signing up', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SignupAdmin]' }, { status: 400 });
  }
};