import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id, contactid, name } = body;
    const user = await prisma.user.findFirst({ where: { id: contactid } });
    if (!user) {
      return NextResponse.json({ mess: "user doesn't exist", ok: false });
    }
    await prisma.contact.create({
      data: { contact: { connect: { id } }, contactid, name },
    });
    return NextResponse.json({ mess: "user added succesfully", ok: true });
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json({ status: "error", error });
  }
}
