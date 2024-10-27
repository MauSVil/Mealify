import { OrderRepository } from "@/lib/Repositories/Order.repository";
import { OrderSchema } from "@/lib/types/Zod/Order";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = req.cookies;
    const token = cookieStore.get('utoken')?.value || req.headers.get('authorization');
    if (!token) {
      throw new Error('Token no encontrado');
    }

    const body = await req.json();
    const parsedBody = await OrderSchema.parseAsync(body);
    parsedBody.status = 'pending';
    await OrderRepository.insertOne(parsedBody);
    return NextResponse.json({ data: 'Order created' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateOrderUserAdmin]' }, { status: 400 });
  }
};