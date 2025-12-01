export interface ICommissioner {
  _id: string; // MongoDB document ID
  seller: string; // Seller bilan bog‘langan id
  inn_or_jshshir: string; // INN yoki JSHSHIR
  company: string; // Kompaniya nomi
  mfo: string; // MFO raqami
  account_number: string; // Hisob raqami
  contract_number: string; // Shartnoma raqami
  contract_start_date: string; // Shartnoma boshlanish sanasi
  contract_end_date: string; // Shartnoma tugash sanasi
  contract_file?: string | null; // Virtual field orqali keluvchi fayl maʼlumotlari (optional)
  createdAt?: Date; // timestamps: true uchun
  updatedAt?: Date;
}
