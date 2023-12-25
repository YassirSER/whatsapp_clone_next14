"use client";
import { useSession } from "next-auth/react";
import React from "react";

const isAuthenticated = () => {
  const session = useSession();
  if (session.data?.user) {
    return "Authenticated";
  } else {
    return "Unauthenticated";
  }
};

export default isAuthenticated;
