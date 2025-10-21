import type { IProperty } from "./property.interface";
import type { IUser } from "./user.interface";

export interface IMessage {
  _id: string;
  user: IUser;
  property: IProperty;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
