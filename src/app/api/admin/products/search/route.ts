import { ProductsRepository } from "@/lib/Repositories/Product.repository";
import { validateIfBusiness, validateIfToken } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const business = await validateIfBusiness(req);
    await validateIfToken(req, 'atoken');

    const products = await ProductsRepository.find({ restaurantId: business });

    return NextResponse.json({ data: products });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [SearchProductsAdmin]' }, { status: 400 });
  }
};