import type { IAdvertise } from "@/interfaces/advertise.interface";
import { useNavigate } from "react-router-dom";

export default function ImageAds({ ads }: { ads: IAdvertise }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(ads?.target)}
      className="w-full h-64 lg:h-80 rounded-md overflow-hidden shadow-lg cursor-pointer"
    >
      <img
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        src={ads?.image?.file_path}
        alt="ads image"
      />
    </div>
  );
}
