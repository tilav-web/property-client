import type { IInquiry } from "./inquiry.interface";
import type { ISeller } from "../users/seller.interface";
import type { IUser } from "../users/user.interface";
import type { IProperty } from "../property/property.interface";

export type TInquiryResponseStatus = "approved" | "rejected";

export interface IInquiryResponse {
  _id: string;
  status: TInquiryResponseStatus;
  description: string;
  seller: ISeller;
  user: IUser;
  inquiry: IInquiry;
  property: IProperty;
  createdAt: string;
  updatedAt: string;
}