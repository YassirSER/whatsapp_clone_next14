"use client";

import { useGlobalContext } from "@/app/context/theme";
import unique from "@/lib/uniqueRoomId";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { HiDotsVertical } from "react-icons/hi";
import Popup from "reactjs-popup";
import { IoTrashBinSharp } from "react-icons/io5";
import "reactjs-popup/dist/index.css";
import DiscussionPanel from "./DiscussionPanel";
import useWindowDimensions from "@/lib/useWindowDimensions";

const ContactsPanel = () => {
  const { data } = useSession();
  const [contacts, setContacts] = useState([]);
  const [contactInfo, setContactInfo] = useState({ id: "", name: "" });
  const [ran, setRan] = useState(false);
  // const [lastMsg, setLastMsg] = useState<any>([]);
  const {
    setClickedContact,
    setRoomid,
    socket,
    setChat,
    showContacts,
    setShowContacts,
    lastMsg,
    setLastMsg,
  } = useGlobalContext();
  const { width } = useWindowDimensions();

  // const [showContact, setShowContact] = useState<boolean>(false);

  const deleteContact = async (id: string) => {
    try {
      setChat([]);
      await fetch("/api/contacts/delete", {
        method: "POST",
        body: JSON.stringify({ id }),
      });
      setContacts((prev) => {
        return prev.filter((contact: any) => contact.id !== id);
      });
      setClickedContact({});
      toast.success("user deleted succesfully");
    } catch (error) {
      console.log(error);
    }
  };

  const handleClick = (contact: any) => {
    let roomid = unique(contact.userid, contact.contactid);
    console.log(roomid);
    setRoomid(roomid);
    socket.emit("join_room", roomid);
    setClickedContact(contact);
    width && width < 768 && setShowContacts(true);
  };

  // console.log(data?.user.email);

  const getContacts = async () => {
    const toastid = toast.loading("Loading contacts...");
    try {
      setRan(true);
      const res = await fetch("/api/contacts/get", {
        method: "POST",
        body: JSON.stringify({ id: data?.user.id }),
      });
      const resp = await res.json();
      setContacts(resp.contacts);
      let list: tplotOptions = {};
      type tplotOptions = {
        [key: string]: string;
      };
      resp.lastMsgs.length > 0 &&
        resp.lastMsgs.forEach(
          (msg: { text: string; senderId: string; receiverId: string }) => {
            if (msg !== null) {
              let id = unique(msg.senderId, msg.receiverId);
              list[id] = msg.text;
            }
          }
        );

      console.log(resp.lastMsgs);

      setLastMsg(list);
      toast.remove(toastid);
    } catch (error) {
      console.log(error);
    }
  };

  if (ran === false) {
    if (data) {
      getContacts();
    }
  }

  // console.log(contacts);

  const addContact = async () => {
    const toastid = toast.loading("Loading...");
    try {
      if (contactInfo.name.length < 1 || contactInfo.id.length < 1) {
        toast.error("Name and id should not be empty", { id: toastid });
      } else {
        const res = await fetch("/api/contacts/add", {
          method: "POST",
          body: JSON.stringify({
            id: data?.user.id,
            contactid: contactInfo.id,
            name: contactInfo.name,
          }),
        });
        const resp = await res.json();
        console.log(resp);

        if (resp.ok) {
          toast.success(resp.mess, { id: toastid });
          //@ts-ignore
          setContacts([
            // @ts-ignore
            ...contacts,
            // @ts-ignore
            {
              id: Math.random().toString(),
              name: contactInfo.name,
              contactid: contactInfo.id,
              userid: data?.user.id,
            },
          ]);
        }
        !resp.ok && toast.error(resp.mess, { id: toastid });
      }
    } catch (error) {
      console.log(error);
      toast.error("something went wrong...", { id: toastid });
    }
  };

  return (
    <div className="h-full w-full">
      {/* {showContacts ? (
        <DiscussionPanel />
      ) : ( */}
      <div className="h-full grid w-full grid-rows-[1fr,10fr] border-solid border-[1px] border-[#D1D7DB]">
        <div
          id="upperbanner"
          className="bg-[#F0F2F5] flex items-center justify-between pl-[15px] pr-[15px]"
        >
          <div className="flex items-center">
            <Image
              src={"/defaultpic.webp"}
              alt="sd"
              width={"35"}
              height={"35"}
            />
            <p className="text-md p-3">{data?.user.name}</p>
          </div>

          <Popup
            trigger={
              <div className="text-xl text-icons hover:cursor-pointer">
                <HiDotsVertical />
              </div>
            }
            position={"bottom center"}
            nested
          >
            <div
              className="p-2 hover:cursor-pointer hover:bg-grayish"
              onClick={() => signOut()}
            >
              logout
            </div>
            <Popup
              trigger={
                <div className="p-[10px] hover:cursor-pointer hover:bg-grayish">
                  account details
                </div>
              }
              modal
            >
              <div className="flex flex-col w-full gap-[20px] p-[20px] items-center justify-center">
                <h1 className="font-bold text-xl">Account details</h1>
                <div className="flex justify-between w-full">
                  <span className="font-semibold">name</span>
                  <span>{data?.user.name}</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="font-semibold">email</span>
                  <span>{data?.user.email}</span>
                </div>
                <div className="flex justify-between w-full">
                  <span className="font-semibold">id</span>
                  <span>{data?.user.id}</span>
                </div>
              </div>
              <div className="w-fit p-[10px]"></div>
            </Popup>
            <Popup
              trigger={
                <div className="p-2 hover:cursor-pointer hover:bg-grayish">
                  add a contact
                </div>
              }
              modal
              nested
            >
              <div
                id="modal"
                className="flex flex-col w-full gap-[30px] items-center justify-center p-5"
              >
                <h1 className="text-xl font-bold">Add a contact</h1>
                <input
                  type="text"
                  placeholder="contact's name"
                  className="p-[10px] w-full outline-none border-[1px] border-solid border-[#D1D7DB]"
                  value={contactInfo.name}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="contact's id"
                  className="p-[10px] w-full outline-none border-[1px] border-solid border-[#D1D7DB]"
                  value={contactInfo.id}
                  onChange={(e) =>
                    setContactInfo({ ...contactInfo, id: e.target.value })
                  }
                />
                <button
                  className="p-2 bg-blue-400 text-white rounded-md"
                  onClick={addContact}
                >
                  add
                </button>
              </div>
            </Popup>
          </Popup>
        </div>
        <div id="contacts" className="flex h-full overflow-y-auto flex-col">
          {contacts?.length > 0 &&
            contacts.map((contact: any, i: number) => (
              <div
                id="contact"
                className="p-[10px] flex justify-between content-center hover:bg-gray-50
              hover:cursor-pointer border-b-solid border-b-[1px] border-b-[#D1D7DB]"
                key={contact.id}
                onClick={() => handleClick(contact)}
              >
                <div className="flex items-center">
                  <div className="p-[5px]">
                    <Image
                      src={"/defaultpic.webp"}
                      alt="sd"
                      width={"35"}
                      height={"35"}
                    />
                  </div>
                  {/* <div className="flex flex-col align-top"> */}
                  <div id="name" className="text-lg p-[10px] pt-[5px] pb-[5px]">
                    {contact.name}
                    <br />
                    <div className="text-[15px] text-gray-400 self-center">
                      {lastMsg &&
                        lastMsg[unique(contact.userid, contact.contactid)]}
                    </div>
                    {/* </div> */}
                  </div>
                </div>

                <Popup
                  trigger={
                    <div className="text-red-500 text-2xl self-center">
                      <IoTrashBinSharp />
                    </div>
                  }
                  modal
                >
                  <div className="flex flex-col p-[20px] justify-center items-center gap-3">
                    <span className="text-xl">
                      Are you sure you want delete user {contact.name} ?
                    </span>
                    <button
                      className="p-2 bg-red-500 text-white rounded-md"
                      onClick={() => deleteContact(contact.id)}
                    >
                      delete
                    </button>
                  </div>
                </Popup>
              </div>
            ))}
        </div>
      </div>
      {/* )} */}
    </div>
  );
};

export default ContactsPanel;
