import db from "@/lib/databases/DBSwitcher";
import { NextRequest, NextResponse } from "next/server";


export const GET = async (req: NextRequest, res: Response) => {
  const DB = await db();
  try {
    const users = await DB.get("Users");
    return NextResponse.json(users);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export const POST = async (req: NextRequest, res: Response) => {
  const DB = await db();
  try {
    const body = await req.json();
    const user = await DB.create("Users", body);
    return NextResponse.json(user);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}