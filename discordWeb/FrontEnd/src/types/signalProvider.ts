import type { HubConnection } from "@microsoft/signalr";

export interface SignalRContextType {
  chatConnection: HubConnection | null;
  presenceConnection: HubConnection | null;
}