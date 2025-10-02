import type { IFile } from "@/interfaces/file.interface";
import type { IProperty } from "@/interfaces/property.interface";

export const categories = [
  { key: "flats", count: "26 000" },
  { key: "dacha", count: "15 600" },
  { key: "rooms", count: "31 000" },
  { key: "office", count: "1 650" },
  { key: "land", count: "500" },
  { key: "business", count: "8 125" },
  { key: "basement", count: "22 000" },
  { key: "building", count: "9 560" },
];

const sampleFiles: IFile[] = [
  {
    _id: "file_1",
    document_id: "doc_1",
    document_type: "Property",
    file_name: "property_main.jpg",
    file_path:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80",
    mime_type: "image/jpeg",
    file_size: 2048576,
    original_name: "apartment_main.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "file_2",
    document_id: "doc_1",
    document_type: "Property",
    file_name: "property_living_room.jpg",
    file_path:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=958&q=80",
    mime_type: "image/jpeg",
    file_size: 1856321,
    original_name: "living_room.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "file_3",
    document_id: "doc_1",
    document_type: "Property",
    file_name: "property_kitchen.jpg",
    file_path:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=874&q=80",
    mime_type: "image/jpeg",
    file_size: 1987456,
    original_name: "kitchen.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "file_4",
    document_id: "doc_1",
    document_type: "Property",
    file_name: "property_virtual_tour.mp4",
    file_path:
      "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    mime_type: "video/mp4",
    file_size: 10485760,
    original_name: "virtual_tour.mp4",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    _id: "file_5",
    document_id: "doc_1",
    document_type: "Property",
    file_name: "property_bedroom.jpg",
    file_path:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80",
    mime_type: "image/jpeg",
    file_size: 2156890,
    original_name: "bedroom.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Asosiy property data
export const property: IProperty = {
  _id: "prop_1",
  title: "Zamonaviy 3 xonali kvartira, Yunusobod tumani",
  description:
    "Yaqinda ta'mirlangan, yangi mebel va texnika bilan jihozlangan, kunduzgi yorug' kvartira. Markaziy joylashuv, maktab, bog'cha va savdo markazlariga yaqin. Xonalar keng, shift baland. Oshxona va mehmonxona birlashtirilgan. 2 hammom, ayvon. Xavfsizlik va video kuzatuv tizimi mavjud.",
  category: "apartment",
  location: {
    type: "Point",
    coordinates: [69.2401, 41.2995], // Toshkent koordinatalari
  },
  address: "Yunusobod tumani, 5-kvartal, 25-uy",
  price: 850000000,
  price_type: "sale",
  area: 85,
  bedrooms: 3,
  bathrooms: 2,
  floor_level: 4,
  amenities: ["air_conditioning", "balcony", "security", "elevator", "parking"],
  construction_status: "READY",
  year_built: 2018,
  parking_spaces: 1,
  is_premium: true,
  is_verified: true,
  is_new: true,
  is_guest_choice: true,
  rating: 4.7,
  reviews_count: 23,
  logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1073&q=80",
  delivery_date: new Date("2024-03-15"),
  sales_date: new Date("2024-01-10"),
  payment_plans: 3,
  photos: sampleFiles.filter((file) => file.mime_type.startsWith("image/")),
  videos: sampleFiles.filter((file) => file.mime_type.startsWith("video/")),
  createdAt: new Date("2024-01-10"),
  updatedAt: new Date("2024-01-20"),
};
