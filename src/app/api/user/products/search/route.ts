import { ProductsRepository } from "@/lib/Repositories/Product.repository";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const products = await ProductsRepository.find({ restaurantId: body.businessId });
    return NextResponse.json({ data: products });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SearchProductsUserAdmin]' }, { status: 400 });
  }
};