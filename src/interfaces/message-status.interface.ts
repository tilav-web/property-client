import type { IMessage } from "./message.interface";
import type { IUser } from "./user.interface";

export interface IMessageStatus {
  _id: string;
  message: IMessage;
  seller: IUser;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}
