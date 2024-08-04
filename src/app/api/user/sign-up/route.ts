import { register } from "@/lib/MongoDB/actions/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }
    const token = await register({ email, password, role: 'consumer' });
    cookies().set('token', token as string);
    return NextResponse.json({ token });
  } catch (e) {
    console.error('Error signing up', e);
    return NextResponse.json({ error: 'Error signing up' }, { status: 400 });
  }
};