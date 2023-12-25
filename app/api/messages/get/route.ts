import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { senderid, receiverid } = body;
    const roomMessages = await prisma.message.findMany({
      where: {
        OR: [
          {
            AND: [
              {
                receiverId: receiverid,
              },
              {
                senderId: senderid,
              },
            ],
          },
          {
            AND: [
              {
                receiverId: senderid,
              },
              {
                senderId: receiverid,
              },
            ],
          },
        ],
      },
    });

    // console.log({ roomMessages });

    if (roomMessages) {
      return NextResponse.json({ messages: roomMessages });
    } else {
      return NextResponse.json({ messages: [] });
    }
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json({ status: "error", error });
  }
}
