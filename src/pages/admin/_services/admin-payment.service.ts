import { adminApi } from "@/lib/api-instance";
import { API_ENDPOINTS } from "@/utils/shared";
import type {
  IPaginatedTransactions,
  ITransaction,
  OrderType,
} from "@/interfaces/payment/payment.interface";

interface ListParams {
  orderType?: OrderType;
  page?: number;
  limit?: number;
}

class AdminPaymentService {
  /** AWAITING holatdagi to'lovlar (admin tasdiqlash uchun). */
  async listAwaiting(params: ListParams = {}): Promise<IPaginatedTransactions> {
    const { data } = await adminApi.get<IPaginatedTransactions>(
      API_ENDPOINTS.ADMIN.payments.base,
      { params },
    );
    return data;
  }

  /** To'lovni tasdiqlash. Mos handler chaqiriladi (premium yoqish va h.k.). */
  async approve(
    id: string,
  ): Promise<{ transaction: ITransaction; activationResult: unknown }> {
    const { data } = await adminApi.post(
      API_ENDPOINTS.ADMIN.payments.approve(id),
    );
    return data;
  }

  /** To'lovni rad etish (refund admin tomonidan Payme dashboard'idan qo'lda). */
  async reject(id: string, reason: string): Promise<ITransaction> {
    const { data } = await adminApi.post<ITransaction>(
      API_ENDPOINTS.ADMIN.payments.reject(id),
      { reason },
    );
    return data;
  }
}

export const adminPaymentService = new AdminPaymentService();
