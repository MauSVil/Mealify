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
    const user = await UsersRepository.findOne({ email, role: 'user' });
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
    }, process.env.USER_JWT_SECRET!, { expiresIn: '1d' });

    cookies().set('utoken', token);

    return NextResponse.json({ data: { token } });
  } catch (e) {
    console.error('Error signing up', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SigninUser]' }, { status: 400 });
  }
};