import { validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { UsersRepository } from "@/lib/Repositories/User.repository";

export const GET = async (req: NextRequest) => {
  try {
    const token = await validateIfToken(req, 'dtoken');
    const user = await jwt.verify(token, process.env.DELIVERY_JWT_SECRET!) as { id: string };
    const userFound = await UsersRepository.findOne({ id: user.id });
    if (!userFound) throw new Error('No se encontró el usuario');
    return NextResponse.json({ data: userFound });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [User]' }, { status: 400 });
  }
}