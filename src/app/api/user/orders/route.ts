import { OrderRepository } from "@/lib/Repositories/Order.repository";
import { OrderSchema } from "@/lib/types/Zod/Order";
import { validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await validateIfToken(req, 'utoken');

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