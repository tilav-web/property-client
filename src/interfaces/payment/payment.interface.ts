import type { CurrencyCode } from "@/constants/currencies";

export const PaymentProvider = {
  PAYME: "PAYME",
  CLICK: "CLICK",
} as const;
export type PaymentProvider =
  (typeof PaymentProvider)[keyof typeof PaymentProvider];

export const PaymentStatus = {
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  FAILED: "FAILED",
  CANCELLED: "CANCELLED",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

export const OrderType = {
  ADVERTISE: "ADVERTISE",
  PROPERTY_PREMIUM: "PROPERTY_PREMIUM",
} as const;
export type OrderType = (typeof OrderType)[keyof typeof OrderType];

export const AdminApprovalStatus = {
  NOT_APPLICABLE: "NOT_APPLICABLE",
  AWAITING: "AWAITING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
} as const;
export type AdminApprovalStatus =
  (typeof AdminApprovalStatus)[keyof typeof AdminApprovalStatus];

export interface ITransaction {
  _id: string;
  user:
    | string
    | {
        _id: string;
        first_name?: string;
        last_name?: string;
        email?: string;
        phone?: string;
      };
  orderType: OrderType;
  orderId: string;
  amount: number;
  currency: CurrencyCode;
  provider: PaymentProvider;
  providerTransactionId?: string;
  providerCreateTime?: number;
  providerPerformTime?: number;
  providerCancelTime?: number;
  cancelReason?: number;
  status: PaymentStatus;
  adminApprovalStatus: AdminApprovalStatus;
  adminApprovedBy?: string;
  adminApprovedAt?: string;
  adminRejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPaginatedTransactions {
  items: ITransaction[];
  total: number;
  page?: number;
  limit?: number;
}

export interface IStartPremiumUpgradeResult {
  transactionId: string;
  amount: number;
  currency: CurrencyCode;
  durationDays: number;
  checkoutUrl: string;
  provider: PaymentProvider;
}

export interface ICreateAdvertiseResult {
  /** Backend hozir to'liq Advertise document qaytaradi */
  advertise: unknown;
  /** PAYMENT_PROVIDER=none bo'lsa null (Malaysia) */
  transactionId: string | null;
  checkoutUrl: string | null;
  provider: PaymentProvider | "NONE";
}
