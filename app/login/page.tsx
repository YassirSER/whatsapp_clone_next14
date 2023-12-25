"use client";

import React, { useContext, useState } from "react";
import "../globals.css";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../context/theme";

const page = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();
  const { setUser } = useGlobalContext();

  const loginUser = async () => {
    const toastid = toast.loading("Loading...");
    const credentials = { email, password };
    const res = await signIn("credentials", {
      ...credentials,
      redirect: false,
      callbackUrl: "/",
    });
    if (res?.error) {
      console.log(res.error);
      toast.error(res.error, { id: toastid });
    }

    if (res?.ok && !res?.error) {
      toast.success("Logged in successfully!", { id: toastid });
      router.push("/");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gray-50 flex justify-center items-center">
      <Toaster />
      <div
        id="container"
        className="w-[70%] h-[70vh] flex flex-col items-center justify-center gap-3"
      >
        <div className="text-2xl font-semibold">Log In</div>
        {/* <form className="flex h-full items-center justify-center w-full flex-col gap-3"> */}
        <input
          type="email"
          placeholder="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-[15px] outline-none border-solid"
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-[15px] outline-none border-solid"
        />
        <button
          className="p-2 bg-blue-400 text-white rounded-md"
          onClick={loginUser}
        >
          Log in
        </button>
        <p>
          Don't have an account ? go{" "}
          <Link href={"/signup"} className="text-blue-400">
            Sign up
          </Link>
        </p>
        {/* </form> */}
      </div>
    </div>
  );
};

export default page;
