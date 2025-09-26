import { Badge } from "@/components/ui/badge";
import { bannerImage1, emaarImage } from "@/utils/shared";
import { Mail, MapPin, MousePointer2, Phone } from "lucide-react";

export default function PropertyBannerCard() {
  return (
    <div className="w-full h-[302px] relative my-2 rounded-md overflow-hidden">
      <img className="w-full h-full" src={bannerImage1} alt="banner image" />
      <div className="flex flex-col absolute top-2 left-2 gap-1">
        <Badge className="uppercase bg-black/10">Вне плана</Badge>
        <Badge className="uppercase bg-black/10">Дата доставки: Q3 2029</Badge>
        <Badge className="uppercase bg-red-400">
          Продажи начались: 22 июня 2025 года
        </Badge>
      </div>
      <div className="absolute bottom-2 left-2 text-white">
        <p className="text-2xl">Альберо</p>
        <div className="flex items-center gap-1 mb-4">
          <MapPin size={18} />
          <p>Ташкент, Мирзо Улугбек 1-5, Узбекистан</p>
        </div>
        <p>1 - 3 кровати</p>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <p>Запуск цена:</p>
            <p>2.8m uzs</p>
          </div>
          <Badge className="bg-white text-blue-900">2 планы оплаты</Badge>
        </div>
      </div>
      <div className="absolute top-2 right-2 h-[54px] w-[70px]">
        <img className="w-full h-full object-cover" src={emaarImage} alt="" />
      </div>
      <div className=" absolute bottom-2 right-2 flex items-center gap-4">
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2">
          <Phone size={18} />
          <span>Вызов</span>
        </button>
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2">
          <Mail size={18} />
          <span>Вызов</span>
        </button>
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2">
          <MousePointer2 size={18} />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
