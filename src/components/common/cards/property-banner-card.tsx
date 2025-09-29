import { Badge } from "@/components/ui/badge";
import type { IProperty } from "@/interfaces/property.interface";
import type { IUser } from "@/interfaces/user.interface";
import { MapPin, Mail, MousePointer2, Phone } from "lucide-react";

export default function PropertyBannerCard({
  property,
}: {
  property: IProperty & { author: IUser };
}) {
  return (
    <div className="w-full h-[302px] relative my-2 rounded-md overflow-hidden">
      <img
        className="w-full h-full object-cover"
        src={property.images[0]}
        alt={property.title}
      />
      <div className="flex flex-col absolute top-2 left-2 gap-1">
        <Badge className="uppercase bg-black/10">Vne plana</Badge>
        {property.delivery_date && (
          <Badge className="uppercase bg-black/10">
            Topshirish: {property.delivery_date}
          </Badge>
        )}
        {property.sales_date && (
          <Badge className="uppercase bg-red-400">
            Sotuv boshlandi: {property.sales_date}
          </Badge>
        )}
      </div>
      <div className="absolute bottom-2 left-2 text-white">
        <p className="text-2xl">{property.title}</p>
        <div className="flex items-center gap-1 mb-4">
          <MapPin size={18} />
          <p>{property.address}</p>
        </div>
        {property.beds && <p>{property.beds}</p>}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <p>Start narx:</p>
            <p>
              {property.price.toLocaleString()} {property.currency}
            </p>
          </div>
          {property.payment_plans && (
            <Badge className="bg-white text-blue-900 hidden md:block">
              {property.payment_plans} ta to‘lov rejasi
            </Badge>
          )}
        </div>
      </div>
      {property.logo && (
        <div className="absolute top-2 right-2 h-[54px] w-[70px]">
          <img
            className="w-full h-full object-cover"
            src={property.logo}
            alt="logo"
          />
        </div>
      )}
      <div className="absolute bottom-2 right-2 items-center gap-4 hidden sm:flex">
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2 w-full mg:w-auto">
          <Phone size={18} />
          <span>Qo‘ng‘iroq</span>
        </button>
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2 w-full mg:w-auto">
          <Mail size={18} />
          <span>Email</span>
        </button>
        <button className="flex items-center bg-white rounded px-3 py-1 gap-2 w-full mg:w-auto">
          <MousePointer2 size={18} />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
