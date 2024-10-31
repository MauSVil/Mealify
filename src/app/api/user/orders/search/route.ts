import { validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { OrderRepository } from "@/lib/Repositories/Order.repository";

export const GET = async (req: NextRequest) => {
  try {
    const token = await validateIfToken(req, 'utoken');
    const user = await jwt.verify(token, process.env.USER_JWT_SECRET!) as { id: string };

    const orders = await OrderRepository.find({ user: user.id });

    return NextResponse.json({ data: orders });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateOrderUserAdmin]' }, { status: 400 });
  }
}