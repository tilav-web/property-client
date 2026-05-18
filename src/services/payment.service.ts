import apiInstance from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";
import type {
  IPaginatedTransactions,
  ITransaction,
  OrderType,
} from "@/interfaces/payment/payment.interface";

interface ListMyParams {
  orderType?: OrderType;
  page?: number;
  limit?: number;
}

class PaymentService {
  /** Foydalanuvchining o'z to'lovlar ro'yxati. */
  async listMy(params: ListMyParams = {}): Promise<IPaginatedTransactions> {
    const res = await apiInstance.get(API_ENDPOINTS.TRANSACTIONS.my, {
      params,
    });
    return res.data;
  }

  /** Bitta transaction (faqat egasi). */
  async findOne(id: string): Promise<ITransaction> {
    const res = await apiInstance.get(API_ENDPOINTS.TRANSACTIONS.one(id));
    return res.data;
  }
}

export const paymentService = new PaymentService();
