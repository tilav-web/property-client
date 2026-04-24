import { io, type Socket } from "socket.io-client";
import { handleStorage } from "@/utils/handle-storage";

export type ChatSocket = Socket;

type Listener = (socket: ChatSocket) => void;

class SocketManager {
  private socket: ChatSocket | null = null;
  private readyListeners = new Set<Listener>();

  private baseUrl(): string {
    return import.meta.env.VITE_API_URL ?? "http://localhost:3000";
  }

  connect(): ChatSocket {
    if (this.socket && this.socket.connected) return this.socket;
    if (this.socket) this.socket.connect();
    else this.socket = this.create();
    return this.socket;
  }

  private create(): ChatSocket {
    const socket = io(`${this.baseUrl()}/chat`, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      transports: ["websocket"],
      withCredentials: true,
      auth: (cb) => {
        cb({ token: handleStorage({ key: "access_token" }) ?? "" });
      },
    });

    socket.on("connect", () => {
      this.readyListeners.forEach((fn) => fn(socket));
    });

    return socket;
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  get instance(): ChatSocket | null {
    return this.socket;
  }

  onReady(fn: Listener): () => void {
    this.readyListeners.add(fn);
    if (this.socket?.connected) fn(this.socket);
    return () => {
      this.readyListeners.delete(fn);
    };
  }

  // Re-auth: access_token yangilanganda socket'ni qayta ulash
  refreshAuth(): void {
    if (!this.socket) return;
    this.socket.disconnect();
    this.socket.connect();
  }
}

export const socketManager = new SocketManager();
