"use client";

import React, { useEffect, useRef, useState } from "react";
import { HiDotsVertical } from "react-icons/hi";
import { BsEmojiDizzy } from "react-icons/bs";
import { IoMdSend, IoIosReturnLeft } from "react-icons/io";
// import { IoIosReturnLeft } from "react-icons/io";
import Image from "next/image";
import { useGlobalContext } from "@/app/context/theme";
import { io } from "socket.io-client";
import { useSession } from "next-auth/react";
import Popup from "reactjs-popup";
import "reactjs-popup/dist/index.css";
import toast from "react-hot-toast";
import useWindowDimensions from "@/lib/useWindowDimensions";
import ContactsPanel from "./ContactsPanel";

const DiscussionPanel = () => {
  const {
    clickedcontact,
    roomid,
    setSocket,
    socket,
    chat,
    setChat,
    setShowContacts,
    showContacts,
    setLastMsg,
  } = useGlobalContext();
  const [message, setMessage] = useState<string>("");
  const messContainerRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowDimensions();

  const { data } = useSession();

  const handleMessage = async (e: any) => {
    e.preventDefault();
    var hours = Date.prototype.getHours.bind(new Date());
    var minutes = Date.prototype.getMinutes.bind(new Date());
    var seconds = Date.prototype.getSeconds.bind(new Date());

    try {
      if (message.length > 0) {
        socket.emit("send_msg", message, {
          roomid,
          senderId: data?.user.id,
          receiverId: clickedcontact.contactid,
          createdAt: `${hours() - 1}:${minutes()}:${seconds()}`,
        });

        setLastMsg((current: any) => {
          current[roomid] = message;
          return current;
        });

        const res = await fetch("/api/messages/add", {
          method: "POST",
          body: JSON.stringify({
            senderid: data?.user.id,
            receiverid: clickedcontact.contactid,
            text: message,
          }),
        });

        await res.json();
      } else {
        toast.error("Message cannot be empty");
      }
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const socket = io("http://localhost:3001");

    clickedcontact &&
      socket.on("receive_msg", (message, info) => {
        setChat((pre: any) => [
          ...pre,
          {
            ...info,
            message,
          },
        ]);
      });

    setSocket(socket);
  }, []);

  useEffect(() => {
    const getMessages = async () => {
      const res = await fetch("/api/messages/get", {
        method: "POST",
        body: JSON.stringify({
          senderid: data?.user.id,
          receiverid: clickedcontact.contactid,
        }),
      });
      const resp = await res.json();

      setChat(resp.messages);
    };

    clickedcontact && getMessages();
    console.log("changed");
  }, [clickedcontact]);

  useEffect(() => {
    messContainerRef.current?.lastElementChild?.scrollIntoView();
  }, [messContainerRef.current?.lastElementChild]);

  console.log(chat);

  const getGoodDate = (time: string) => {
    // @ts-ignore
    let hours =
      // @ts-ignore
      parseInt(time?.split("T").pop().split(".")[0].split(":")[0]) + 1;
    // @ts-ignore
    let mins = time?.split("T").pop().split(".")[0].split(":")[1];
    return hours.toString().concat(":", mins);
  };

  return (
    <>
      {/* {width! < 768 && !showContacts ? (
        <ContactsPanel />
      ) : ( */}
      <div className="h-full grid w-full grid-rows-[1fr,9fr,1fr] border-solid border-[1px] border-[#D1D7DB] border-l-0">
        <div
          id="upperbanner"
          className="bg-grayish flex justify-between items-center"
        >
          <div
            id="bannerinfo"
            className="flex p-3 pt-0 pb-0 justify-center items-center"
          >
            <div
              className={
                width! < 768 ? "text-2xl p-3 hover:cursor-pointer" : "hidden"
              }
              onClick={() => setShowContacts(false)}
            >
              <IoIosReturnLeft />
            </div>
            <Image
              src={"/defaultpic.webp"}
              alt="sd"
              width={"35"}
              height={"35"}
            />

            <div id="bannername" className="text-md p-3">
              {clickedcontact.name}
            </div>
          </div>

          <Popup
            trigger={
              <div className="p-3 text-xl hover:cursor-pointer text-icons">
                <HiDotsVertical />
              </div>
            }
            position={"bottom right"}
            nested
          >
            <Popup
              trigger={
                <div className="p-[10px] hover:cursor-pointer hover:bg-grayish">
                  user details
                </div>
              }
              modal
            >
              <div className="flex flex-col w-full gap-[20px] p-[20px] items-center justify-center">
                <h1 className="font-bold text-xl">Account details</h1>
                <div className="flex justify-between w-full">
                  <span className="font-semibold">name</span>
                  <span>{clickedcontact?.name}</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="font-semibold">id</span>
                  <span>{clickedcontact.contactid}</span>
                </div>
              </div>
              <div className="w-fit p-[10px]"></div>
            </Popup>
          </Popup>
        </div>

        <div
          id="messages_container"
          className="flex flex-col overflow-y-auto gap-[10px] bg-[#EFEAE2]  p-[20px]"
          style={{ backgroundImage: "url('/whatsappbg.png')" }}
          ref={messContainerRef}
        >
          {clickedcontact &&
            chat.length > 0 &&
            chat?.map((mess: any) => (
              <div
                id="message"
                className={
                  mess.senderId === data?.user.id
                    ? "flex items-end justify-end self-end"
                    : "flex items-start justify-start self-start"
                }
                key={mess.message}
              >
                <div
                  className={
                    mess.senderId === data?.user.id
                      ? "p-[10px] w-fit rounded-lg bg-[#D9FDD3] text-sm text-black flex flex-col"
                      : "p-[10px] w-fit rounded-lg bg-white text-sm text-black flex flex-col"
                  }
                >
                  <p>{mess.message || mess.text}</p>
                  <p className="text-[10px] text-gray-400 self-end">
                    {getGoodDate(mess.createdAt)}
                  </p>
                </div>
              </div>
            ))}
        </div>

        <form
          id="messages_input"
          className="bg-[#F0F2F5] w-full flex content-center p-3"
          onSubmit={(e) => handleMessage(e)}
        >
          <div className="text-icons text-2xl pl-[10px] pr-[10px] self-center hover:cursor-pointer">
            <BsEmojiDizzy />
          </div>

          <div className="flex w-full content-center gap-[20px] justify-end">
            <input
              type="text"
              placeholder="type your message"
              className="w-[90%] outline-none p-[20px] h-2 rounded-lg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div
              className="text-icons text-2xl self-center hover:cursor-pointer"
              onClick={handleMessage}
            >
              <IoMdSend />
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default DiscussionPanel;
