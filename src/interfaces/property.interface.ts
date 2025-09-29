export interface IProperty {
  id: string;
  title: string; // nomi (masalan: "Albero", "Uyning tavsifi")
  description?: string; // qo'shimcha tavsif (masalan: "Ko‘p qavatli / G‘ishtli / 3 xonali")
  category?: string; // toifa (masalan: "Kvartira")
  location: string; // joylashuv (masalan: "Toshkent, Mirzo Ulug‘bek...")
  country?: string; // davlat (masalan: "O‘zbekiston")
  address?: string; // aniq manzil
  price: number; // narx (masalan: 300000000)
  currency: "UZS" | "USD" | "EUR"; // valyuta
  price_type?: "oyiga" | "umumiy summa"; // narx turi (oyiga yoki umumiy)
  beds?: string; // yotoqlar soni yoki oraliq (masalan: "1 - 3 o‘rin")
  rooms?: number; // xonalar soni (masalan: 3)
  is_premium?: boolean; // premium statusi (masalan: Premium)
  is_verified?: boolean; // tekshirilgan (masalan: Tekshirilgan e’lon)
  is_new?: boolean; // yangi e’lon
  is_guest_choice?: boolean; // mehmonlar tanlovi
  delivery_date?: string; // topshirilish sanasi (masalan: 2029-yil 3-chorak)
  sales_date?: string; // sotuv boshlanish sanasi (masalan: "2025-yil 22-iyun")
  rating: number; // reyting (masalan: 4.7)
  reviews_count?: number; // sharhlar soni
  images: string[]; // barcha rasm url’lari
  video_count?: number; // video soni
  photo_count?: number; // foto soni
  logo?: string; // kompaniya logosi (masalan: Emaar logosi)
  payment_plans?: number; // to'lov rejalar soni (masalan: 2)
}
