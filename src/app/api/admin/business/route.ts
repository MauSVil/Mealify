import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { BusinessSchema } from "@/lib/types/Zod/Business";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get('token')?.value;
    const body = await req.json();
    const parsedBody = await BusinessSchema.parseAsync(body);
    if (!token) {
      return NextResponse.json({ error: 'Token no encontrado' }, { status: 400 });
    }

    const data = await jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    parsedBody.owner = data.id;
    const insertedId =await BusinessRepository.insertOne(parsedBody);
    parsedBody._id = insertedId;
    return NextResponse.json({ data: parsedBody });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateBusinessAdmin]' }, { status: 400 });
  }
};