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
  if (!appCtx) {
    return null;
  }
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
    setConversationList,
    setOnlineFriends,
    setDmParticipants,
  } = ctx;

  useEffect(() => {
    if (!editConnection) return;

    const handleUserUpdated = (data: {
      userId: string;
      userName?: string;
      profilePhoto?: string;
    }) => {
      setFriendList((prev) =>
        prev?.map((item) =>
          item.friendId === data.userId
            ? {
                ...item,
                ...(data.userName && { userName: data.userName }),
                ...(data.profilePhoto && { profilePhoto: data.profilePhoto }),
              }
            : item,
        ),
      );

      setOnlineFriends((prev) =>
        prev?.map((item) =>
          item.friendId === data.userId
            ? {
                ...item,
                ...(data.userName && { userName: data.userName }),
                ...(data.profilePhoto && { profilePhoto: data.profilePhoto }),
              }
            : item,
        ),
      );
      setConversationList((prev) =>
        prev?.map((item) =>
          item.friendId === data.userId
            ? {
                ...item,
                ...(data.userName && { userName: data.userName }),
                ...(data.profilePhoto && { profilePhoto: data.profilePhoto }),
              }
            : item,
        ),
      );

      setDmParticipants((prev) =>
        prev?.map((item) =>
          item.userId === data.userId
            ? {
                ...item,
                ...(data.userName && { userName: data.userName }), // 3 nokta olmadan yazılmıyormuş yav. Analamdım burasını. Öğren gel.
                ...(data.profilePhoto && { profilePhoto: data.profilePhoto }),
              }
            : item,
        ),
      );
    };

    editConnection.on("UserUpdated", handleUserUpdated);

    return () => {
      editConnection.off("UserUpdated", handleUserUpdated);
    };
  }, [editConnection]);


  useEffect(() => {
    if (!presenceConnection) return;

    const handleInitialOnlineUsers = (users: any[]) => {
      setOnlineFriends(users);
    };
    const handleUserOnline = (user: any) => {
      console.log("Yeni online user:", user);
      setOnlineFriends((prev) => {
        if (prev.some((u) => u.friendId === user.friendId)) {
          return prev;
        }
        return [...prev, user];
      });
    };

    const handleUserOffline = (userId: string) => {
      console.log("👋 User offline:", userId);
      setOnlineFriends((prev) => prev.filter((u) => u.friendId !== userId));
    };

    presenceConnection?.on("initialOnlineUsers", handleInitialOnlineUsers);
    presenceConnection?.on("useronline", handleUserOnline);
    presenceConnection?.on("useroffline", handleUserOffline);

    presenceConnection
      ?.invoke("GetOnlineUsers")
      .then(() => console.log("GetOnlineUsers başarıyla çağrıldı"))
      .catch((err: any) => console.error("GetOnlineUsers hatası:", err));

    return () => {
      presenceConnection?.off("initialOnlineUsers", handleInitialOnlineUsers);
      presenceConnection?.off("useronline", handleUserOnline);
      presenceConnection?.off("useroffline", handleUserOffline);
    };
  }, [presenceConnection]);

  return (
    <SignalRContext.Provider
      value={{ presenceConnection, chatConnection, editConnection }}
    >
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
