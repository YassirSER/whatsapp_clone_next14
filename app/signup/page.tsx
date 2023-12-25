"use client";

import React, { useState } from "react";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";

const page = () => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleVerification = () => {
    let isErr = false;
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Email Invalid");
      isErr = true;
    }

    if (username.length < 5) {
      toast.error("Username too short");
      isErr = true;
    }

    if (password.length < 5) {
      toast.error("Password too short");
      isErr = true;
    }

    if (isErr) {
      return "error";
    } else {
      return "noice";
    }
  };

  const handleSignup = async () => {
    const status = handleVerification();
    try {
      if (status === "noice") {
        const toastid = toast.loading("Loading...");
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          body: JSON.stringify({ email, name: username, password }),
        });
        const data = await res.json();
        console.log(data.status);
        if (data.status === "errorExists") {
          toast.error("User already exists", { id: toastid });
        } else {
          toast.success("User created succesfully", { id: toastid });
        }
        setUsername("");
        setEmail("");
        setPassword("");
      }
    } catch (error: any) {
      console.log({ error });
      toast.error("Something went wrong");
      setUsername("");
      setEmail("");
      setPassword("");
    }
  };

  return (
    <div className="w-full h-[100vh] bg-gray-50 flex justify-center items-center">
      <Toaster />
      <div
        id="container"
        className="w-[70%] h-[70vh] flex flex-col items-center justify-center gap-3"
      >
        <div className="text-2xl font-semibold">Sign Up</div>
        <input
          type="text"
          placeholder="username"
          name="username"
          className="w-full p-[15px] outline-none border-solid"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="email"
          placeholder="email"
          name="email"
          className="w-full p-[15px] outline-none border-solid"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          className="w-full p-[15px] outline-none border-solid"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="p-2 bg-blue-400 text-white rounded-md"
          onClick={handleSignup}
        >
          Sign up
        </button>
        <p>
          Already have an account ? go{" "}
          <Link href={"/login"} className="text-blue-400">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default page;
