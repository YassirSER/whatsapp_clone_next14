"use client";

import {
  createContext,
  useContext,
  Dispatch,
  SetStateAction,
  useState,
} from "react";

type DataType = {
  firstName: string;
};

interface ContextProps {
  user: {
    name?: string;
    email?: string;
  };
  clickedcontact: {
    name?: string;
    id?: string;
    userid?: string;
    contactid?: string;
  };
  roomid: string;
  setUser: Dispatch<SetStateAction<any>>;
  setClickedContact: Dispatch<SetStateAction<any>>;
  setRoomid: Dispatch<SetStateAction<any>>;
  socket: any;
  setSocket: Dispatch<SetStateAction<any>>;
  chat: any;
  setChat: Dispatch<SetStateAction<any>>;
  showContacts: any;
  setShowContacts: Dispatch<SetStateAction<any>>;
  lastMsg: any;
  setLastMsg: Dispatch<SetStateAction<any>>;
}

const GlobalContext = createContext<ContextProps>({
  user: {},
  setUser: () => {},
  clickedcontact: {},
  setClickedContact: () => {},
  roomid: "",
  setRoomid: () => {},
  showContacts: false,
  setShowContacts: () => {},
  chat: [],
  setChat: () => {},
  socket: undefined,
  setSocket: () => {},
  lastMsg: [],
  setLastMsg: () => {},
});

export const GlobalContextProvider = ({ children }: any) => {
  const [user, setUser] = useState({
    email: "",
    name: "",
  });

  const [clickedcontact, setClickedContact] = useState({
    name: "",
    id: "",
    userid: "",
    contactid: "",
  });

  const [roomid, setRoomid] = useState<string>("");
  const [socket, setSocket] = useState<any>();
  const [lastMsg, setLastMsg] = useState<any>();
  const [showContacts, setShowContacts] = useState<boolean>(false);
  const [chat, setChat] = useState<any>([]);

  return (
    <GlobalContext.Provider
      value={{
        user,
        setUser,
        clickedcontact,
        setClickedContact,
        roomid,
        setRoomid,
        socket,
        setSocket,
        chat,
        setChat,
        showContacts,
        setShowContacts,
        lastMsg,
        setLastMsg,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalContext = () => useContext(GlobalContext);
