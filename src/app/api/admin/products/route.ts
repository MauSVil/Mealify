import { ProductsRepository } from "@/lib/Repositories/Product.repository";
import { NewProduct } from "@/lib/types/Zod/Product";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const cookieStore = cookies();
    const business = cookieStore.get('business')?.value;
    const token = cookieStore.get('atoken')?.value;

    if (!token) {
      throw new Error('Token no encontrado');
    }

    if (!business) {
      throw new Error('Business not found');
    }

    const body = await req.json() as NewProduct;
    body.createdAt = new Date();
    body.updatedAt = new Date();
    body.deletedAt = null;
    body.restaurantId = business

    await ProductsRepository.insertOne(body);
    return NextResponse.json({ data: 'Producto creado' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateProductAdmin]' }, { status: 400 });
  }
};