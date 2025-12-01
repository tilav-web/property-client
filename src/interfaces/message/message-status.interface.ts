import type { IUser } from "../users/user.interface";
import type { IMessage } from "./message.interface";

export interface IMessageStatus {
  _id: string;
  message: IMessage;
  seller: IUser;
  is_read: boolean;
  createdAt: string;
  updatedAt: string;
}
