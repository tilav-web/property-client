import { cardImage, cardImageLink, courtSvg } from "@/utils/shared";
import {
  Camera,
  CirclePlay,
  ClipboardPenLine,
  EllipsisVertical,
  Heart,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Badge } from "../ui/badge";

export default function PropertyCard() {
  return (
    <div className="bg-white rounded-xl overflow-hidden">
      {/* Asosiy kontent */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4 p-4 lg:p-2">
        {/* Rasm qismi */}
        <div className="w-full lg:max-w-[320px] h-[240px] relative">
          <img
            className="w-full h-full object-cover"
            src={cardImage}
            alt="Property image"
          />
          <div className="absolute top-2 left-2 flex flex-col gap-2">
            <Badge className="bg-[#00A663] rounded border-white text-xs">
              <ShieldCheck className="w-3 h-3" />
              <span className="uppercase">Проверенный</span>
            </Badge>
            <Badge className="bg-[#333]/70 rounded uppercase w-full border-white text-xs">
              Новый
            </Badge>
          </div>
          <button className="p-2 bg-white border absolute right-4 bottom-4 rounded-md">
            <MapPin className="w-4 h-4" />
          </button>
          <Badge className="bg-black/80 rounded-none absolute bottom-0 left-0 text-xs">
            <Camera className="w-3 h-3" />
            <span>20</span>
            <CirclePlay className="w-3 h-3" />
          </Badge>
        </div>

        {/* Ma'lumotlar qismi */}
        <div className="flex-1 flex flex-col justify-between gap-3">
          <div className="flex flex-col gap-2">
            <p className="text-sm text-gray-600">Квартира</p>
            <p className="text-xl lg:text-2xl font-bold text-[#FF0000]">
              300 000 000 UZS
            </p>
          </div>
          <p className="text-sm lg:text-base text-gray-700">
            Много этажный / Керпичный / 3 комнатный
          </p>
          <div className="flex items-center gap-2 text-gray-500">
            <MapPin className="w-4 h-4" />
            <p className="text-sm">Ташкент Мирзо Улугбек 25/2</p>
          </div>
        </div>

        {/* Link rasm (faqat desktopda ko'rinadi) */}
        <div className="hidden lg:block">
          <div className="w-[95px] h-[125px] border rounded overflow-hidden">
            <img
              src={cardImageLink}
              alt="property image"
              className="w-full h-full object-cover"
            />
          </div>
          <p className="text-center text-[#B78A00] uppercase text-sm">Премиум</p>
        </div>
      </div>

      {/* Pastki buttonlar qismi */}
      <div className="bg-[#B7B7B7] p-3 lg:p-2 rounded-b-xl">
        <div className="flex flex-col lg:flex-row items-center gap-3 justify-between">
          {/* Chap tomondagi buttonlar */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
            <button className="bg-[#FF990063] flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
              <img src={courtSvg} alt="Court svg" className="w-4 h-4" />
              <span className="whitespace-nowrap">Ваша цена</span>
            </button>
            <button className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
              <ClipboardPenLine className="w-4 h-4" />
              <span className="whitespace-nowrap">Онлайн контракт</span>
            </button>
          </div>

          {/* O'ng tomondagi buttonlar */}
          <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
            <button className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Вызов</span>
            </button>
            <button className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
              <Mail className="w-4 h-4" />
              <span className="hidden sm:inline">Email</span>
            </button>
            <button className="bg-white flex items-center gap-2 px-3 py-2 rounded border border-black text-sm min-w-0">
              <span className="whitespace-nowrap">WhatsApp</span>
            </button>
            <button className="bg-white flex items-center gap-2 p-2 rounded border border-black">
              <Heart className="w-4 h-4" />
            </button>
            <button className="bg-[#FAD397] flex items-center gap-2 p-2 rounded border border-black">
              <EllipsisVertical className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
