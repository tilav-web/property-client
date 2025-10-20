import type { IProperty } from "./property.interface";

export interface IUser {
  _id: string;
  first_name: string;
  last_name: string;
  email: {
    value: string;
    isVerified: boolean;
  };
  phone: {
    value: string;
    isVerified: boolean;
  };
  avatar: string;
  role: UserRole;
  lan: UserLan;
  likes: IProperty[];
  saves: IProperty[];
  createdAt?: Date;
  updatedAt?: Date;
}

export type UserRole = "physical" | "legal";
export type UserLan = "uz" | "en" | "ru";
