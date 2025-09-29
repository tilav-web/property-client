import { imageCard } from "@/utils/shared";

export default function PropertyImageCard() {
  return (
    <div className="w-full h-64 lg:h-80 rounded-md overflow-hidden shadow-lg">
      <img
        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        src={imageCard}
        alt="property image"
      />
    </div>
  );
}
