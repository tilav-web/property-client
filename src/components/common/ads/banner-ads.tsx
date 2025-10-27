import { serverUrl } from "@/utils/shared";
import type { IAdvertise } from "@/interfaces/advertise.interface";
import { useNavigate } from "react-router-dom";

export default function BannerAds({ ads }: { ads: IAdvertise }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(ads?.target)}
      className="w-full h-[302px] relative my-2 rounded-md overflow-hidden"
    >
      <img
        className="w-full h-full object-cover"
        src={`${serverUrl}/uploads${ads?.image?.file_path}`}
        alt="ads image"
      />
    </div>
  );
}
