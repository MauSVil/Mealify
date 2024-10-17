import { UsersRepository } from "@/lib/Repositories/User.repository";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    const user = await UsersRepository.findOne({ email, role: 'user' });
    console.log('user', user);
    // cookies().set('token', token as string);
    return NextResponse.json({ token: 'asda' });
  } catch (e) {
    console.error('Error signing in', e);
    return NextResponse.json({ error: 'Error signing in' }, { status: 400 });
  }
}