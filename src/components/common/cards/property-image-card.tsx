import { imageCard } from "@/utils/shared";

export default function PropertyImageCard() {
  return (
    <div className="max-w-[613px] h-[340px] w-full rounded-md overflow-hidden">
      <img className="w-full h-full" src={imageCard} alt="image card" />
    </div>
  );
}