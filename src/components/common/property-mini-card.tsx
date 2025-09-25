import { miniCardImage } from "@/utils/shared";
import { Heart, MapPin, Star } from "lucide-react";
import { Badge } from "../ui/badge";

export default function PropertyMiniCard() {
  return (
    <div className="p-2 max-w-[302px] rounded-md shadow-xl">
      <div className="w-[285px] h-[240px] relative">
        <img
          className="w-full h-full object-cover"
          src={miniCardImage}
          alt="mini card image"
        />
        <div className="absolute top-1 flex items-center justify-between w-full px-2">
          <Badge className="rounded border-white bg-black/50 text-white uppercase">
            Выбор гостей
          </Badge>
          <button className="p-1 rounded bg-white/40 border">
            <Heart size={18} />
          </button>
        </div>
        <button className="border-white border p-2 rounded bg-white/60 absolute right-2 bottom-1">
          <MapPin size={18} />
        </button>
      </div>
      <div className="">
        <div className="flex items-start justify-between">
          <p>Уютная и красивая</p>
          <div className="flex items-center pr-2">
            <div className="flex items-center">
              <Star size={18} />
              <Star size={18} />
              <Star size={18} />
              <Star size={18} />
              <Star size={18} />
            </div>
            <span>4.7</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-60 mb-4">
          <MapPin />
          <p>Ташкент Мирзо Улугбек 25/2</p>
        </div>
        <p className="font-bold">5 000 000 UZS за месяц</p>
      </div>
    </div>
  );
}
