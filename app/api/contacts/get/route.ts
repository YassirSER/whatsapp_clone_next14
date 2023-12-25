import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { id } = body;

    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        Contacts: true,
      },
    });

    let lastMsgs = [];

    for (const contact of user!.Contacts) {
      console.log({ contact });

      const mess = await prisma.message.findFirst({
        where: {
          OR: [
            {
              AND: [
                {
                  receiverId: contact.contactid,
                },
                {
                  senderId: user!.id,
                },
              ],
            },
            {
              AND: [
                {
                  receiverId: user!.id,
                },
                {
                  senderId: contact.contactid,
                },
              ],
            },
          ],
        },
        orderBy: { id: "desc" },
        take: 1,
      });

      lastMsgs.push(mess);
    }

    // console.log({ lastMsgs });

    return NextResponse.json({
      contacts: user?.Contacts,
      lastMsgs,
    });
    // }
  } catch (error: any) {
    console.log({ error });
    return NextResponse.json({ status: "error", error });
  }
}
