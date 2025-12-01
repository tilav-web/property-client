import type { IBankAccount } from "../bank/bank-account.interface";
import type { ICommissioner } from "../commissioner/commissioner.interface";
import type { IMchjSeller } from "./mchj-seller.interface";
import type { IPhysical } from "./physical.interface";
import type { ISelfEmployedSeller } from "./self-employed-seller.interface";
import type { IUser } from "./user.interface";
import type { IYttSeller } from "./ytt-yeller.interface";

export interface ISeller {
  _id: string;
  user: IUser;
  passport: string;
  business_type: SellerBusinessType;
  ytt?: IYttSeller;
  mchj?: IMchjSeller;
  self_employed?: ISelfEmployedSeller;
  physical: IPhysical;
  bank_account: IBankAccount;
  commissioner: ICommissioner;
  status: SellerStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SellerBusinessType = "ytt" | "mchj" | "self_employed" | "physical";
export type SellerStatus =
  | "in_progress"
  | "completed"
  | "approved"
  | "rejected";
