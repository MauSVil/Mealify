import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const business = await BusinessRepository.findOne({ id: body.id });
    return NextResponse.json({ data: business });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SearchBusinessAdmin]' }, { status: 400 });
  }
};