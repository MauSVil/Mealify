import { UsersRepository } from "@/lib/Repositories/User.repository";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    await UsersRepository.insertOne({ email, password, role: 'user', createdAt: new Date(), updatedAt: new Date() });
    // cookies().set('token', token as string);
    return NextResponse.json({ token: 'asda' });
  } catch (e) {
    console.error('Error signing up', e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SignupUser]' }, { status: 400 });
  }
};