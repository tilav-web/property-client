import type { IInquiry } from "./inquiry.interface";
import type { IUser } from "../users/user.interface";
import type { IProperty } from "../property/property.interface";

export type TInquiryResponseStatus = "approved" | "rejected";

export interface IInquiryResponseSeller {
  _id: string;
  first_name: string;
  last_name: string;
  avatar: string | null;
}

export interface IInquiryResponse {
  _id: string;
  status: TInquiryResponseStatus;
  description: string;
  seller: IInquiryResponseSeller;
  user: IUser;
  inquiry: IInquiry;
  property: IProperty;
  createdAt: string;
  updatedAt: string;
}