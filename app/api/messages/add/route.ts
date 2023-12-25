import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { senderid, receiverid, text } = body;

    await prisma.user.update({
      data: {
        sentMessages: {
          create: { text, receiver: { connect: { id: receiverid } } },
        },
      },
      where: { id: senderid },
    });

    return NextResponse.json({ mess: "message created succesfully" });
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json({ status: "error", error });
  }
}
