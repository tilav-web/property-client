export interface IMchjSeller {
  _id: string;
  seller: string; // Seller ga havola (ref)
  company_name: string; // Kompaniya nomi
  stir: string; // STIR
  oked: string; // OKED
  registration_address: string; // Biznes ro'yxatdan o'tgan manzil
  mchj_license: string | null; // MCHJ guvohnomasi (fayl URL)
  is_vat_payer: boolean; // QQS mavjudmi
  ustav_file?: string | null; // Ustav fayli
  director_appointment_file?: string | null; // Direktor tayinlash hujjati
  director_passport_file?: string | null; // Direktor pasport nusxasi
  legal_address_file?: string | null; // Yuridik manzil fayli
  kadastr_file?: string | null; // Kadastr fayli
  vat_file?: string | null; // QQS fayli (agar mavjud bo‘lsa)
  createdAt?: Date;
  updatedAt?: Date;
}