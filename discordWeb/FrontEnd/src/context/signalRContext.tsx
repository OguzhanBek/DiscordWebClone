import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./userProvider";
import type { SignalRContextType } from "../types/signalProvider";

export const SignalRContext = createContext<SignalRContextType | null>(null);

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const appCtx = useContext(AppContext);
  const [chatConnection, setChatConnection] = useState<HubConnection | null>(
    null,
  );
  const [presenceConnection, setPresenceConnection] =
    useState<HubConnection | null>(null);
  const [editConnection, setEditConnection] = useState<HubConnection | null>(
    null,
  );
  useEffect(() => {
    if (!appCtx?.jwtToken) return;

    const connectToPresence = async () => {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl("http://localhost:5200/hub/presence", {
            accessTokenFactory: () => appCtx.jwtToken!,
          })
          .withAutomaticReconnect()
          .build();

        await conn.start();
        setPresenceConnection(conn);
      } catch (error) {
        console.error(" presencehub'a bağlanamadı : ", error);
      }
    };

    const connectToChat = async () => {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl("http://localhost:5200/hub/chat", {
            accessTokenFactory: () => appCtx.jwtToken!,
          })
          .withAutomaticReconnect()
          .build();

        await conn.start();
        setChatConnection(conn);
      } catch (error) {
        console.error("Chat hub'a bağlanamadı ", error);
      }
    };

    const connectToEdit = async () => {
      try {
        const conn = new HubConnectionBuilder()
          .withUrl("http://localhost:5200/hub/editHub", {
            accessTokenFactory: () => appCtx.jwtToken!,
          })
          .withAutomaticReconnect()
          .build();
        await conn.start();
        setEditConnection(conn);
      } catch (error) {
        console.error("Edit hub'a bağlanırken hata:", error);
      }
    };

    connectToChat();
    connectToPresence();
    connectToEdit();
    return () => {
      chatConnection?.stop();
      presenceConnection?.stop();
      editConnection?.stop();
    };
  }, [appCtx?.jwtToken]);

  const ctx = useContext(AppContext);
  if (!ctx) {
    return null;
  }
  const {
    setFriendList,
    setDmFriendName,
    setConversationList,
    setOnlineFriends,
  } = ctx;

  useEffect(() => {
    if (!editConnection) return;

    const handleUpdateSuccess = (userId: string, newUsername: string) => {
      setFriendList((prev) =>
        prev?.map((friend) =>
          friend.friendId === userId
            ? { ...friend, userName: newUsername }
            : friend,
        ),
      );
      setOnlineFriends((prev) =>
        prev?.map((friend) =>
          friend.friendId === userId
            ? { ...friend, userName: newUsername }
            : friend,
        ),
      );
      //conversationId: string;
      // friendId: string;
      // userName: string;
      setConversationList((prev) =>
        prev?.map((friend) =>
          friend.friendId === userId
            ? { ...friend, userName: newUsername }
            : friend,
        ),
      );

      // setDmFriendName(
      //   () =>
      //     friendList?.map((friend) =>
      //       friend.friendId === userId ? newUsername : friend.userName,
      //     ) || [],
      // );
      // alert("sex");
    };

    editConnection.on("UsernameChanged", handleUpdateSuccess);

    return () => {
      editConnection.off("UsernameChanged", handleUpdateSuccess);
    };
  }, [editConnection]); // Sabah bak çalışmıyor adam akıllı

  return (
    <SignalRContext.Provider
      value={{ presenceConnection, chatConnection, editConnection }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
