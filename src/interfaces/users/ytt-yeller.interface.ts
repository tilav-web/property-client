import type { ISeller } from "./seller.interface";

export interface IYttSeller {
  _id: string;
  seller: ISeller; // Seller ga havola (ref)
  company_name: string; // Korxona nomi
  inn: string; // STIR
  pinfl: string; // JShShIR
  business_reg_number: string; // Ro'yxatdan o'tish raqami
  business_reg_address: string; // Ro'yxatdan o'tgan manzil
  is_vat_payer: boolean; // QQS mavjudmi
  passport_file?: string | null; // Pasport nusxasi
  ytt_certificate_file?: string | null; // YTT guvohnomasi
  vat_file?: string | null; // QQS fayli (agar mavjud bo‘lsa)
  createdAt?: Date;
  updatedAt?: Date;
}
