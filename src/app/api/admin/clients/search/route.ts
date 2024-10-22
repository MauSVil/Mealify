import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export const GET = async (req: NextRequest) => {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('atoken')?.value;
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const data = await jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const businesses = await BusinessRepository.find({ owner: data.id });

    return NextResponse.json({ data: businesses });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SearchClientsAdmin]' }, { status: 400 });
  }
};