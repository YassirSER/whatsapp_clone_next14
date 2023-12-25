import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;
    const existingUser = await prisma.user.findFirst({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ status: "errorExists" });
    } else {
      const hash = await bcrypt.hash(password, 11);
      const user = await prisma.user.create({
        data: { email, name, password: hash },
      });
      return NextResponse.json({ status: "success", user });
    }
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json({ status: "error", error });
  }
}
