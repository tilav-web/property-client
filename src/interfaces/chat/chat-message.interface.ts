import type { MessageType } from "./message-type";

export interface IChatMessage {
  _id: string;
  conversation: string;
  sender: string;
  type: MessageType;
  body: string;
  metadata?: Record<string, unknown> | null;
  readBy: string[];
  createdAt: string;
}

export interface IChatMessagesPage {
  items: IChatMessage[];
  nextCursor: string | null;
}
