import type { IProperty } from "../property/property.interface";
import type { IUser } from "../users/user.interface";

export interface IMessage {
  _id: string;
  user: IUser;
  property: IProperty;
  comment: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}
