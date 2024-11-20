import { AddressRepository } from "@/lib/Repositories/Address.repository";
import { AddressSchema } from "@/lib/types/Zod/Address";
import { validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export const POST = async (req: NextRequest) => {
  try {
    const token = await validateIfToken(req, 'utoken');
    const user = await jwt.verify(token, process.env.USER_JWT_SECRET!) as { id: string };
    const body = await req.json();
    const parsedBody = await AddressSchema.parseAsync({
      ...body,
      user: user.id,
    });
    const address = await AddressRepository.insertOne(parsedBody);

    return NextResponse.json({ data: address, error: '' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateAddressUserAdmin]' }, { status: 400 });
  }
}

export const GET = async (req: NextRequest) => {
  try {
    const token = await validateIfToken(req, 'utoken');
    const user = await jwt.verify(token, process.env.USER_JWT_SECRET!) as { id: string };

    const addresses = await AddressRepository.find({ user: user.id });

    return NextResponse.json({ data: addresses });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SearchAddressUserAdmin]' }, { status: 400 });
  }
}