import { UsersRepository } from "@/lib/Repositories/User.repository";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { cookies } from "next/headers";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const user = await UsersRepository.findOne({ email, role: 'delivery' });
    if (!user) {
      return NextResponse.json({ error: 'Error al iniciar sesion' }, { status: 400 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Error al iniciar sesion' }, { status: 400 });
    }

    const token = jwt.sign({
      id: user._id,
      email: user.email,
      role: user.role
    }, process.env.DELIVERY_JWT_SECRET!, { expiresIn: '1d' });

    cookies().set('dtoken', token);

    let url = '';
    if (user.onboardingFinished) {
      url = '/delivery/dashboard';
    } else {
      url = '/delivery/onboard';
    }

    return NextResponse.json({ data: { token, url } });
  } catch (e) {
    console.error('Error signing in', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SigninDelivery]' }, { status: 400 });
  }
};