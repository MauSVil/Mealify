import { OrderRepository } from "@/lib/Repositories/Order.repository";
import { validateIfBusiness, validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    await validateIfToken(req, 'atoken');
    const business = await validateIfBusiness(req);

    const oders = await OrderRepository.find({ restaurant: business, status: 'paid' });
    return NextResponse.json({ data: oders });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateOrderUserAdmin]' }, { status: 400 });
  }
};