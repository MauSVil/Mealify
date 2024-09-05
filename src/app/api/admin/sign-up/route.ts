import { UsersRepository } from "@/lib/Repositories/User.repository";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const user = await UsersRepository.findOne({ email, role: 'admin' });
    if (user) {
      return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UsersRepository.insertOne({ email, password: hashedPassword, role: 'admin', createdAt: new Date(), updatedAt: new Date() });
    return NextResponse.json({ message: 'Administrador registrado correctamente' });
  } catch (e) {
    console.error('Error signing up', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SignupAdmin]' }, { status: 400 });
  }
};