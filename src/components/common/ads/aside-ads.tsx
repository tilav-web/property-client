import type { IAdvertise } from "@/interfaces/advertise.interface";
import { serverUrl } from "@/utils/shared";
import { useNavigate } from "react-router-dom";

export default function AsideAds({ ads }: { ads: IAdvertise }) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`${ads?.target}`)}
      className="max-w-[395px] w-full bg-red-500"
    >
      <img
        className="w-full h-full"
        src={`${serverUrl}/uploads${ads?.image.file_path}`}
        alt="ads iamge"
      />
    </div>
  );
}
