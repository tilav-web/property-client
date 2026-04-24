import type { IUser } from "../users/user.interface";

export interface IConversationProperty {
  _id: string;
  title?: string | { uz?: string; ru?: string; en?: string };
  photos?: string[];
  price?: number;
  currency?: string;
  author?: string | { _id?: string };
}

export interface IConversation {
  _id: string;
  participants: IUser[];
  property?: IConversationProperty | null;
  lastMessageAt: string;
  lastMessageSnippet: string;
  unreadBy?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}
