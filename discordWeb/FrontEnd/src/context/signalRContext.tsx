import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./userProvider";
import type { SignalRContextType } from "../types/types";



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

  useEffect(() => {
    if (!appCtx?.jwtToken) return;

    const connectToPresence = async () => {
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5200/hub/presence", {
          accessTokenFactory: () => appCtx.jwtToken!,
        })
        .withAutomaticReconnect()
        .build();

      await conn.start();
      setPresenceConnection(conn);
      console.log("✅ Presence hub'a bağlandı");
    };

    const connectToChat = async () => {
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5200/hub/chat", {
          accessTokenFactory: () => appCtx.jwtToken!,
        })
        .withAutomaticReconnect()
        .build();

      await conn.start();
      setChatConnection(conn);
      console.log("✅ Chat hub'a bağlandı");

    };

    connectToChat();
    connectToPresence();

    return () => {
      chatConnection?.stop();
      presenceConnection?.stop();
    };
  }, [appCtx?.jwtToken]);

  return (
    <SignalRContext.Provider value={{presenceConnection, chatConnection  }}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
