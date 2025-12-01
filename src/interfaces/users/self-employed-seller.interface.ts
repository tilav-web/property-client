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
  passport_file?: string | null;
  self_employment_certificate?: string | null;
  vat_file?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}