import type { IUser } from "./user.interface";

export interface IBankAccount {
  _id: string;
  author: IUser;
  account_number: string;
  bank_name: string;
  mfo: string;
  owner_full_name: string;
  swift_code: string;
  createdAt?: Date;
  updatedAt?: Date;
}
