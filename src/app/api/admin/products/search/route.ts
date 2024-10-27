import { ProductsRepository } from "@/lib/Repositories/Product.repository";
import { validateIfToken } from "@/lib/utils";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = cookies();
    const business = cookieStore.get('business')?.value;
    const token = await validateIfToken(req, 'atoken');

    if (!business) {
      throw new Error('Business not found');
    }

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