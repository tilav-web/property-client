
import type { IInquiryResponse } from "./inquiry-response.interface";
import type { IProperty } from "../property/property.interface";
import type { IUser } from "../users/user.interface";

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
  response?: IInquiryResponse;
  createdAt: string;
  updatedAt: string;
}

export interface IInquiryPopulated extends Omit<IInquiry, 'user' | 'property'> {
  user: {
    _id: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    avatar?: string;
  };
  property: {
    _id: string;
    title?: string;
  };
}
