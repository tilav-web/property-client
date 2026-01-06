import type { CurrencyType } from "../types/currency.type";

export type AdvertiseType = "banner" | "aside" | "image";
export const advertiseTypes: AdvertiseType[] = ["banner", "aside", "image"];

export type AdvertiseStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";
export const advertiseStatuses: AdvertiseStatus[] = ["PENDING", "APPROVED", "REJECTED", "EXPIRED"];

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";
export const paymentStatuses: PaymentStatus[] = ["pending", "paid", "failed", "refunded"];


export interface IAdvertise {
  _id: string;
  author: string;
  target: string;
  type: AdvertiseType;
  status: AdvertiseStatus;
  days: number;
  price: number;
  currency: CurrencyType;
  payment_status: PaymentStatus;
  from?: string;
  to?: string;
  image: string | null;
  views?: number;
  clicks?: number;
  createdAt?: string;
  updatedAt?: string;
}