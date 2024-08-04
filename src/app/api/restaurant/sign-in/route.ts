import { login } from "@/lib/MongoDB/actions/auth";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const { email, password } = await req.json();
    const token = await login({ email, password, role: 'owner' });
    cookies().set('token', token as string);
    return NextResponse.json({ token });
  } catch (e) {
    console.error('Error signing in', e);
    return NextResponse.json({ error: 'Error signing in' }, { status: 400 });
  }
}