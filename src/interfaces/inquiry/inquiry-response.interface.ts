import type { IProperty } from "../property/property.interface";
import type { ISeller } from "../users/seller.interface";
import type { IUser } from "../users/user.interface";
import type { IInquiry } from "./inquiry.interface";

export type InquiryResponseStatusType = "approved" | "rejected";

export interface IInquiryResponse {
  _id: string;
  status: InquiryResponseStatusType;
  description: string;
  user: IUser;
  inquiry: IInquiry;
  property: IProperty;
  seller: ISeller;
  createdAt: string;
  updatedAt: string;
}
