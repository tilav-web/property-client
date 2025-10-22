
import type { IProperty } from "./property.interface";
import type { IUser } from "./user.interface";

export type TInquiryType = "purchase" | "rent" | "mortgage";

export type TInquiryStatus = 
  | "pending"
  | "viewed"
  | "responded"
  | "accepted"
  | "rejected"
  | "canceled";

export interface RentalPeriod {
  from: Date;
  to: Date;
}

export interface IInquiry {
  _id: string;
  user: Partial<IUser>;
  property: Partial<IProperty>;
  type: TInquiryType;
  offered_price?: number;
  rental_period?: RentalPeriod;
  comment: string;
  status: TInquiryStatus;
  createdAt: string;
  updatedAt: string;
}
