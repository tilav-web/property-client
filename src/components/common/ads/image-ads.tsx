import type { IAdvertise } from "@/interfaces/advertise/advertise.interface";
import { serverUrl } from "@/utils/shared";
import { useNavigate } from "react-router-dom";

export default function ImageAds({ ads }: { ads: IAdvertise }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(ads?.target)}
      className="w-full h-full lg:h-86 rounded-md overflow-hidden shadow-lg cursor-pointer"
    >
      <img
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        src={`${serverUrl}/uploads${ads?.image?.file_path}`}
        alt="ads image"
      />
    </div>
  );
}
