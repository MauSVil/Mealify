import { validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import { OrderRepository } from "@/lib/Repositories/Order.repository";
import { OrderRepositoryFilterModel } from "@/lib/types/Zod/Order";

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

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const filter = await OrderRepositoryFilterModel.parseAsync(body);
    const order = await OrderRepository.findOne(filter);
    return NextResponse.json({ data: order });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateOrderUserAdmin]' }, { status: 400 });
  }
}