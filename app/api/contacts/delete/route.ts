import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;
    await prisma.contact.delete({ where: { id } });
    return NextResponse.json({ msg: "success" });
    // }
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json({ status: "error", error });
  }
}
