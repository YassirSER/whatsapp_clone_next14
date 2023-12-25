"use client";

import ContactsPanel from "@/components/ContactsPanel";
import DiscussionPanel from "@/components/DiscussionPanel";
import Image from "next/image";
import "./globals.css";
import isAuthenticated from "@/lib/isAuthenticated";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import useWindowDimensions from "@/lib/useWindowDimensions";
import { useGlobalContext } from "./context/theme";

export default function Home() {
  const session = useSession();
  const { showContacts } = useGlobalContext();
  const { width } = useWindowDimensions();

  if (session.status === "unauthenticated") {
    redirect("/login");
  }

  return (
    <div className="w-full h-[100vh]">
      {/* more than 768px */}
      {width! < 768 && !showContacts ? (
        <div className="w-full h-[100vh]">
          <ContactsPanel />
        </div>
      ) : width! < 768 && showContacts ? (
        <div className="w-full h-[100vh]">
          <DiscussionPanel />
        </div>
      ) : (
        <div className="hidden w-full max-h-[100vh] grid-cols-[1fr,1.5fr] grid-rows-[100vh] md:grid">
          <ContactsPanel />
          <DiscussionPanel />
        </div>
      )}
    </div>
  );
}
