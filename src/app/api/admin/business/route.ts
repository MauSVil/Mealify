import { BusinessRepository } from "@/lib/Repositories/Business.repository";
import { BusinessSchema } from "@/lib/types/Zod/Business";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { uploadFile } from "@/lib/services/minio/uploadFile";

export const POST = async (req: NextRequest) => {
  try {
    const token = req.cookies.get('token')?.value;
    const formData = await req.formData();
    const body = await formData.get('data');
    const myParsedBody = await JSON.parse(body as string);
    const heroImage = await formData.get('heroImage');

    if (!(heroImage instanceof File)) {
      return NextResponse.json({ error: 'El archivo heroImage no es válido' }, { status: 400 });
    }

    const input = {
      ...myParsedBody,
      heroImage,
    };

    const parsedBody = await BusinessSchema.parseAsync(input);
    if (!token) {
      return NextResponse.json({ error: 'Token no encontrado' }, { status: 400 });
    }

    const data = await jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    parsedBody.owner = data.id;

    const insertedId =await BusinessRepository.insertOne(parsedBody);
    
    const fileURL = await uploadFile('businesses', insertedId, heroImage);
    parsedBody.heroImage = fileURL;
    parsedBody._id = insertedId;

    await BusinessRepository.updateOne(insertedId, parsedBody);

    return NextResponse.json({ data: parsedBody, error: '' });
  } catch (e) {
    console.log(e);
    if (e instanceof Error) {
      return NextResponse.json({ error: e.message }, { status: 400 });
    }
    return NextResponse.json({ error: 'Error [CreateBusinessAdmin]' }, { status: 400 });
  }
};