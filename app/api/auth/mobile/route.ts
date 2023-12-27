import { useRouter } from "next/router";
import NextAuth from "next-auth/next";
import prisma from "@/lib/prisma";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { credentials } = body;

    console.log({ credentials });

    if (!credentials?.email || !credentials?.password) {
      return NextResponse.json({
        msg: "Please enter an email and password",
        status: "error",
      });
    }

    // check to see if user exists
    const user = await prisma.user.findUnique({
      where: {
        email: credentials?.email,
      },
    });

    // if no user was found
    if (!user || !user?.password) {
      console.log({ user });
      return NextResponse.json({ msg: "No user found", status: "error" });
    }

    // check to see if password matches
    const passwordMatch = await bcrypt.compare(
      credentials!.password,
      user.password
    );

    // if password does not match
    if (!passwordMatch) {
      return NextResponse.json({ msg: "Incorrect password", status: "error" });
    }

    return NextResponse.json({ user, status: "success" });
  } catch (error) {
    return;
  }
}
