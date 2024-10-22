import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id, ...rest } = body;

    const restaurant = await BusinessRepository.findOne({
      ...(id ? { _id: new ObjectId(id) } : {}),
      ...rest
    })
    return NextResponse.json({ data: restaurant });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [RestaurantUser]' }, { status: 400 });
  }
}