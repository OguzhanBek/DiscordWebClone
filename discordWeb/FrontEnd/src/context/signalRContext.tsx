import { HubConnection, HubConnectionBuilder } from "@microsoft/signalr";
import { createContext, useContext, useEffect, useState } from "react";
import { AppContext } from "./userProvider";

export const SignalRContext = createContext<HubConnection | null>(null);

export const SignalRProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const appCtx = useContext(AppContext);
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    if (!appCtx?.jwtToken) return;

    const connect = async () => {
      const conn = new HubConnectionBuilder()
        .withUrl("http://localhost:5200/hub/chat", {
          accessTokenFactory: () => appCtx.jwtToken!,
        })
        .withAutomaticReconnect()
        .build();

      await conn.start();
      setConnection(conn);
    };

    connect();

    return () => {
      connection?.stop();
    };
  }, [appCtx?.jwtToken]);

  return (
    <SignalRContext.Provider value={connection}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);
