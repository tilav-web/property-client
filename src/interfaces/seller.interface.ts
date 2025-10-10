import type { IBankAccount } from "./bank-account.interface";
import type { IFile } from "./file.interface";
import type { IUser } from "./user.interface";

export interface ISeller {
  _id: string;
  user: IUser;
  passport: string;
  business_type: SellerBusinessType;
  ytt?: IYttSeller;
  mchj?: IMchjSeller;
  self_employed?: ISelfEmployedSeller;
  bank_account: IBankAccount;
  createdAt?: Date;
  updatedAt?: Date;
}

export type SellerBusinessType = "ytt" | "mchj" | "self_employed";

export interface IYttSeller {
  _id: string;
  seller: ISeller; // Seller ga havola (ref)
  company_name: string; // Korxona nomi
  inn: string; // STIR
  pinfl: string; // JShShIR
  business_reg_number: string; // Ro'yxatdan o'tish raqami
  business_reg_address: string; // Ro'yxatdan o'tgan manzil
  is_vat_payer: boolean; // QQS mavjudmi
  passport_file?: IFile | null; // Pasport nusxasi
  ytt_certificate_file?: IFile | null; // YTT guvohnomasi
  vat_file?: IFile | null; // QQS fayli (agar mavjud bo‘lsa)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMchjSeller {
  _id: string;
  seller: string; // Seller ga havola (ref)
  company_name: string; // Kompaniya nomi
  stir: string; // STIR
  oked: string; // OKED
  registration_address: string; // Biznes ro'yxatdan o'tgan manzil
  mchj_license: string; // MCHJ guvohnomasi (fayl URL)
  is_vat_payer: boolean; // QQS mavjudmi
  ustav_file?: IFile | null; // Ustav fayli
  director_appointment_file?: IFile | null; // Direktor tayinlash hujjati
  director_passport_file?: IFile | null; // Direktor pasport nusxasi
  legal_address_file?: IFile | null; // Yuridik manzil fayli
  kadastr_file?: IFile | null; // Kadastr fayli
  vat_file?: IFile | null; // QQS fayli (agar mavjud bo‘lsa)
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ISelfEmployedSeller {
  _id?: string; // MongoDB avtomatik identifikatori (ixtiyoriy)
  seller: string; // Bog‘langan Seller ID
  first_name: string; // Ism
  last_name: string; // Familiya
  middle_name: string; // Otasining ismi
  birth_date: string; // Tug‘ilgan sana
  jshshir: string; // JShShIR
  registration_number: string; // Ro‘yxatdan o‘tish raqami
  registration_address: string; // Biznes ro‘yxatdan o‘tgan manzil
  is_vat_payer: boolean; // QQS mavjudmi
  passport_file?: IFile | null;
  self_employment_certificate?: IFile | null;
  vat_file?: IFile | null;
  createdAt?: Date;
  updatedAt?: Date;
}
