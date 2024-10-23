import { ProductsRepository } from "@/lib/Repositories/Product.repository";
import { uploadFile } from "@/lib/services/minio/uploadFile";
import { ProductSchema } from "@/lib/types/Zod/Product";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get('atoken')?.value;
    const business = req.cookies.get('business')?.value;
    const formData = await req.formData();
    const body = await formData.get('data');
    const myParsedBody = await JSON.parse(body as string);
    const image = await formData.get('image');

    if (!image || typeof image === 'string') {
      return NextResponse.json({ error: 'El archivo image no es válido' }, { status: 400 });
    }

    const input = {
      ...myParsedBody,
      image,
    };

    const parsedBody = await ProductSchema.parseAsync(input);
    if (!token) {
      throw new Error('Token no encontrado en cookies');
    }
    if (!business) {
      throw new Error('Business not found');
    }

    parsedBody.createdAt = new Date();
    parsedBody.updatedAt = new Date();
    parsedBody.deletedAt = null;
    parsedBody.restaurantId = business

    const insertedId = await ProductsRepository.insertOne(parsedBody);

    const fileURL = await uploadFile('products', insertedId, image);

    parsedBody.image = fileURL;
    parsedBody._id = insertedId;

    await ProductsRepository.updateOne(insertedId, parsedBody);

    return NextResponse.json({ data: parsedBody, error: '' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateProductAdmin]' }, { status: 400 });
  }
};