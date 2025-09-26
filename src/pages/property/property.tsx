import BackButton from "@/components/common/buttons/back-button";
import { Badge } from "@/components/ui/badge";
import { miniCardImage } from "@/utils/shared";
import { Camera, CirclePlay, MapPin, ShieldCheck } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect } from "react";

function MapCenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);
  useEffect(() => {
    map.setView(center, 15);
  }, [center, map]);
  return null;
}

export default function Property() {
  const location: [number, number] = [41.2995, 69.2401]; // Toshkent koordinatalari (masalan)

  return (
    <div className="py-8">
      <BackButton className="mb-6" />
      <div className="flex flex-col lg:flex-row items-stretch gap-4 h-auto lg:h-[600px] mb-8">
        <div className="lg:w-2/3 flex flex-col lg:flex-row gap-4">
          <div className="lg:w-2/3 relative rounded-xl overflow-hidden shadow-lg">
            <img
              className="w-full h-64 lg:h-full object-cover transition-transform hover:scale-105 duration-300"
              src={miniCardImage}
              alt="Property image"
            />
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              <Badge className="bg-[#00A663] rounded border-white text-xs px-3 py-1.5 backdrop-blur-sm">
                <ShieldCheck className="w-3 h-3 mr-1" />
                <span className="uppercase">Проверенный</span>
              </Badge>
              <Badge className="bg-[#333]/80 rounded uppercase border-white text-xs px-3 py-1.5 backdrop-blur-sm w-full">
                Новый
              </Badge>
            </div>
            <button className="absolute right-4 bottom-4 p-2 bg-white/90 backdrop-blur-sm border-0 rounded shadow-lg hover:bg-white transition-all hover:scale-110">
              <MapPin className="w-4 h-4 text-gray-700" />
            </button>
            <Badge className="absolute bottom-4 left-4 bg-black/80 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <Camera className="w-3 h-3 mr-1" />
              <span>20</span>
              <CirclePlay className="w-3 h-3 ml-2" />
            </Badge>
          </div>
          <div className="lg:w-1/3 flex flex-row lg:flex-col gap-3">
            <div className="flex-1 rounded-xl overflow-hidden shadow-md">
              <img
                className="w-full h-full min-h-[140px] object-cover transition-transform hover:scale-105 duration-300"
                src={miniCardImage}
                alt="Property photo 1"
              />
            </div>
            <div className="flex-1 rounded-xl overflow-hidden shadow-md">
              <img
                className="w-full h-full min-h-[140px] object-cover transition-transform hover:scale-105 duration-300"
                src={miniCardImage}
                alt="Property photo 2"
              />
            </div>
          </div>
        </div>
        <div className="lg:w-1/3 rounded-xl overflow-hidden shadow-lg">
          <img
            className="w-full h-64 lg:h-full object-cover transition-transform hover:scale-105 duration-300"
            src={miniCardImage}
            alt="Property overview"
          />
        </div>
      </div>
      <div className="flex flex-col lg:flex-row items-start gap-4 mb-8">
        <div className="w-2/4 -z-1 h-[600px]">
          <MapContainer
            center={location}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom={false}
            className="rounded-xl"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={location}>
              <Popup>
                <div className="text-center min-w-[150px]">
                  <h3 className="font-semibold text-sm">Tashkent</h3>
                  <p className="text-xs text-gray-600 mt-1">
                    Проверенный объект
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button className="flex-1 bg-blue-600 text-white py-1 px-2 rounded text-xs hover:bg-blue-700">
                      Маршрут
                    </button>
                    <button className="flex-1 bg-gray-600 text-white py-1 px-2 rounded text-xs hover:bg-gray-700">
                      Подробнее
                    </button>
                  </div>
                </div>
              </Popup>
            </Marker>
            <MapCenter center={location} />
          </MapContainer>
        </div>
        <div className="w-full lg:w-2/4">

        </div>
      </div>
    </div>
  );
}
