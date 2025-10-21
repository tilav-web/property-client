import BackButton from "@/components/common/buttons/back-button";
import { Badge } from "@/components/ui/badge";
import { serverUrl } from "@/utils/shared";
import {
  Bath,
  Bed,
  Building,
  Building2,
  Camera,
  CirclePlay,
  MapPin,
  Maximize,
  Rotate3D,
  Shield,
  ShieldCheck,
  Shirt,
  UserCheck,
  Warehouse,
  Waves,
} from "lucide-react";
import { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import OnlineContractButton from "@/components/common/buttons/online-contract-button";
import CallButton from "@/components/common/buttons/call-button";
import MailButton from "@/components/common/buttons/mail-button";
import WhatsAppButton from "@/components/common/buttons/whats-app-button";
import HeartButton from "@/components/common/buttons/heart-button";
import EllipsisVerticalButton from "@/components/common/buttons/ellipsis-vertical-button";
import BidPriceButton from "@/components/common/buttons/bid-price-button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/property.service";
import { useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { IFile } from "@/interfaces/file.interface";
import { useCurrentLanguage } from "@/hooks/use-language";
import { useTranslation } from "react-i18next";

// Amenities ikonlari
const amenityIcons = {
  pool: <Waves className="w-4 h-4 flex-shrink-0" />,
  balcony: <Building className="w-4 h-4 flex-shrink-0" />,
  security: <Shield className="w-4 h-4 flex-shrink-0" />,
  air_conditioning: <Shirt className="w-4 h-4 flex-shrink-0" />,
  parking: <Warehouse className="w-4 h-4 flex-shrink-0" />,
  elevator: <UserCheck className="w-4 h-4 flex-shrink-0" />,
};

function PropertyMap({ coordinates }: { coordinates: [number, number] }) {
  const { t } = useTranslation();
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS || "",
  });

  if (!coordinates) {
    return (
      <div className="w-full h-[600px] rounded-xl bg-gray-200 flex items-center justify-center">
        {t("pages.property_page.no_coordinates")}
      </div>
    );
  }

  const [lng, lat] = coordinates;

  if (loadError)
    return (
      <div className="w-full h-[600px] rounded-xl bg-gray-200 flex items-center justify-center">
        {t("pages.property_page.map_load_error")}
      </div>
    );
  if (!isLoaded)
    return (
      <div className="w-full h-[600px] rounded-xl bg-gray-200 flex items-center justify-center">
        {t("pages.property_page.map_loading")}
      </div>
    );

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        center={{ lat, lng }}
        zoom={15}
      >
        <Marker position={{ lat, lng }} />
      </GoogleMap>
    </div>
  );
}

// Image Carousel komponenti
function ImageCarousel({ images }: { images: IFile[] }) {
  return (
    <div className="w-full h-full">
      {" "}
      {/* Balandlikni o'rab oluvchi div */}
      <Carousel className="w-full h-full">
        <CarouselContent className="h-full">
          {images.map((media) => (
            <CarouselItem key={media._id} className="h-full">
              <div className="w-full h-full">
                <img
                  src={`${serverUrl}/uploads${media.file_path}`}
                  alt={media.original_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>
    </div>
  );
}

// Video Carousel komponenti
function VideoCarousel({ videos }: { videos: IFile[] }) {
  const { t } = useTranslation();
  if (videos.length === 0) return null;

  if (videos.length === 1) {
    return (
      <div className="w-full h-full rounded-xl overflow-hidden">
        <video
          src={`${serverUrl}/uploads${videos[0].file_path}`}
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          {t("pages.property_page.video_unsupported")}
        </video>
      </div>
    );
  }

  return (
    <Carousel className="w-full h-full">
      <CarouselContent className="h-full">
        {videos.map((video) => (
          <CarouselItem key={video._id} className="h-full">
            <video
              src={`${serverUrl}/uploads${video.file_path}`}
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover rounded-xl"
            >
              {t("pages.property_page.video_unsupported")}
            </video>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="left-2" />
      <CarouselNext className="right-2" />
    </Carousel>
  );
}

export default function Property() {
  const [purchasePrice, setPurchasePrice] = useState(1200000);
  const [citizenshipStatus, setCitizenshipStatus] = useState("citizen");
  const [downPayment, setDownPayment] = useState(240000);
  const [loanAmount, setLoanAmount] = useState(960000);
  const [loanTerm, setLoanTerm] = useState(5);
  const [interestRate, setInterestRate] = useState(17.5);
  const { t } = useTranslation();

  const amenityLabels: { [key: string]: string } = {
    pool: t("enums.amenities.pool"),
    balcony: t("enums.amenities.balcony"),
    security: t("enums.amenities.security"),
    air_conditioning: t("enums.amenities.air_conditioning"),
    parking: t("enums.amenities.parking"),
    elevator: t("enums.amenities.elevator"),
  };

  const calculateMonthlyPayment = () => {
    const principal = loanAmount;
    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;

    if (monthlyRate === 0) {
      return principal / numberOfPayments;
    }

    const monthlyPayment =
      (principal *
        (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

    return monthlyPayment;
  };

  useEffect(() => {
    setLoanAmount(purchasePrice - downPayment);
  }, [purchasePrice, downPayment]);

  const monthlyPayment = calculateMonthlyPayment();
  const monthlyPaymentPercentage = (monthlyPayment / purchasePrice) * 100;
  const downPaymentPercentage = Math.round((downPayment / purchasePrice) * 100);
  const loanAmountPercentage = Math.round((loanAmount / purchasePrice) * 100);
  const { id } = useParams();

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(Math.round(num));
  };

  const formatPrice = (price: number) => {
    return `${formatNumber(price)} UZS`;
  };

  const { data: property } = useQuery({
    queryKey: ["property", id],
    queryFn: () => {
      if (!id) return;
      return propertyService.findById(id);
    },
  });

  const photos = property?.photos?.filter((photo: IFile) =>
    photo?.file_name?.startsWith("photos-")
  );

  const videos = property?.videos || [];

  const { getLocalizedText } = useCurrentLanguage();
  return (
    <div className="py-8">
      <BackButton className="mb-6" />

      {/* Rasmlar qismi */}
      <div className="flex flex-col lg:flex-row items-stretch gap-4 h-auto lg:h-[600px] mb-8">
        <div className="lg:w-2/3 flex flex-col lg:flex-row gap-4">
          {/* Asosiy rasm/slider */}
          <div className="lg:w-2/3 relative rounded-xl overflow-hidden shadow-lg">
            {photos && photos?.length > 0 && <ImageCarousel images={photos} />}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {property?.is_verified && (
                <Badge className="bg-[#00A663] rounded border-white text-xs px-3 py-1.5 backdrop-blur-sm">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  <span className="uppercase">
                    {t("pages.property_page.verified")}
                  </span>
                </Badge>
              )}
              {property?.is_new && (
                <Badge className="bg-[#333]/80 rounded uppercase border-white text-xs px-3 py-1.5 backdrop-blur-sm w-full">
                  {t("pages.property_page.new")}
                </Badge>
              )}
            </div>
            <button className="absolute right-4 bottom-4 p-2 bg-white/90 backdrop-blur-sm border-0 rounded shadow-lg hover:bg-white transition-all hover:scale-110">
              <MapPin className="w-4 h-4 text-gray-700" />
            </button>
            <Badge className="absolute bottom-4 left-4 bg-black/80 rounded-full px-3 py-1.5 backdrop-blur-sm">
              <Camera className="w-3 h-3 mr-1" />
              <span>{property?.photos?.length || 0}</span>
              {property?.videos && property?.videos?.length > 0 && (
                <>
                  <CirclePlay className="w-3 h-3 ml-2" />
                  <span>{property?.videos?.length}</span>
                </>
              )}
            </Badge>
          </div>

          {/* Qolgan rasmlar */}
          <div className="lg:w-1/3 flex flex-row lg:flex-col gap-3">
            {photos?.slice(0, 2).map((photo: IFile, index: number) => (
              <div
                key={photo?._id}
                className="flex-1 rounded-xl overflow-hidden shadow-md"
              >
                <img
                  className="w-full h-full min-h-[140px] object-cover transition-transform hover:scale-105 duration-300"
                  src={`${serverUrl}/uploads${photo?.file_path}`}
                  alt={`Property photo ${index + 2}`}
                />
              </div>
            ))}
            {videos.length > 0 && (
              <div className="flex-1 rounded-xl overflow-hidden shadow-md relative">
                <VideoCarousel videos={videos} />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black/70 text-white">
                    <CirclePlay className="w-3 h-3 mr-1" />
                    {t("pages.property_page.video")}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* O'ng tomondagi rasm (agar mavjud bo'lsa) */}
        <div className="lg:w-1/3 rounded-xl overflow-hidden shadow-lg">
          {photos?.length >= 3 && photos[2] && (
            <img
              className="w-full h-64 lg:h-full object-cover transition-transform hover:scale-105 duration-300"
              src={`${serverUrl}/uploads${photos[2]?.file_path}`}
              alt="Property overview"
            />
          )}
        </div>
      </div>

      {/* Xarita va asosiy ma'lumotlar */}
      <div className="flex flex-col lg:flex-row items-start gap-4 mb-8">
        <div className="w-full lg:w-1/2">
          <PropertyMap coordinates={property?.location?.coordinates} />
        </div>
        <div className="w-full lg:w-1/2">
          <div className="mb-12">
            <div className="flex items-center justify-between font-bold mb-4">
              {property?.contract_file && (
                <OnlineContractButton file={property?.contract_file} />
              )}
              <div className="flex items-center gap-3">
                {property?.author?.phone?.value && (
                  <CallButton phone={property?.author?.phone?.value} />
                )}
                {property?.author?.email?.value && (
                  <MailButton mail={property?.author?.email?.value} />
                )}
                <WhatsAppButton />
                <HeartButton property={property} />
                <EllipsisVerticalButton property={property} />
              </div>
            </div>
            <div className="font-bold flex items-center justify-end gap-8">
              <p className="text-4xl text-red-500">
                {formatPrice(property?.price || 0)}
              </p>
              <BidPriceButton property={property} />
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">
              {getLocalizedText(property?.title)}
            </h2>
            <p className="mb-4">{getLocalizedText(property?.description)}</p>

            <h3 className="mb-2 font-medium">
              {t("pages.property_page.device_details")}
            </h3>
            <ul className="space-y-1">
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                {t("pages.property_page.park_and_stream_view")}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                {t("pages.property_page.unfurnished")}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                {t("pages.property_page.kitchen_countertop")}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                {t("pages.property_page.spacious_living_room")}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Property details */}
      <div className="max-w-5xl mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          {t("pages.property_page.property_details")}
        </h2>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <p className="font-medium text-gray-800 capitalize">
                  {t(`enums.property_category.${property?.category}`)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">
                  {t("pages.property_page.bedrooms")}
                </span>
                <p className="font-medium text-gray-800">
                  {property?.bedrooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Rotate3D className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">
                  {t("pages.property_page.floor")}
                </span>
                <p className="font-medium text-gray-800">
                  {property?.floor_level || 0}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Maximize className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">
                  {t("pages.property_page.area")}
                </span>
                <p className="font-medium text-gray-800">
                  {property?.area || 0} {t("pages.property_page.sq_m")}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">
                  {t("pages.property_page.bathrooms")}
                </span>
                <p className="font-medium text-gray-800">
                  {property?.bathrooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Warehouse className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">
                  {t("pages.property_page.parking_spaces")}
                </span>
                <p className="font-medium text-gray-800">
                  {property?.parking_spaces || 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t("pages.property_page.amenities")}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {property?.amenities?.map((amenity: string, index: number) => (
              <div
                key={`${amenity}-${index}`}
                className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50"
              >
                {amenityIcons[amenity as keyof typeof amenityIcons]}
                <span className="text-sm">
                  {amenityLabels[amenity as keyof typeof amenityLabels]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Qolgan kodlar bir xil */}
      {/* Price Analysis */}
      <div className="max-w-5xl mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {t("pages.property_page.price_analysis")}
          </h2>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            {t("pages.property_page.price_trends")}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t("pages.property_page.apartments_for_sale")}
          </p>

          {/* Period Selector */}
          <div className="flex gap-2 items-center justify-end">
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700 border border-blue-300">
              {t("pages.property_page.1_year")}
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100">
              {t("pages.property_page.2_years")}
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100">
              {t("pages.property_page.5_years")}
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span className="text-sm text-gray-600">
              {t("pages.property_page.harbour_gate_tower_2")}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dotted border-purple-500"></div>
            <span className="text-sm text-gray-600">
              {t("pages.property_page.dubai_creek_harbour")}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={[
                { month: "Aug 24", harbourGate: 2500, dubaiCreek: 2500 },
                { month: "Oct 24", harbourGate: 2450, dubaiCreek: 2480 },
                { month: "Dec 24", harbourGate: 2400, dubaiCreek: 2520 },
                { month: "Feb 25", harbourGate: 2380, dubaiCreek: 2500 },
                { month: "Apr 25", harbourGate: 2420, dubaiCreek: 2490 },
                { month: "Jun 25", harbourGate: 2450, dubaiCreek: 2510 },
              ]}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <YAxis
                domain={[0, 3000]}
                ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
                tickFormatter={(value) => `${value / 1000}K`}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#6B7280" }}
              />
              <Line
                type="monotone"
                dataKey="harbourGate"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ fill: "#EF4444", strokeWidth: 0, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="dubaiCreek"
                stroke="#8B5CF6"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: "#8B5CF6", strokeWidth: 0, r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Mortgage Calculator */}
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            {t("pages.property_page.find_mortgage")}
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {t("pages.property_page.purchase_price")}
                </span>
                <span className="text-sm text-gray-500">UZS</span>
              </div>
              <div className="text-lg font-semibold text-blue-600 mb-2">
                {formatNumber(purchasePrice)}
              </div>
              <Slider
                value={[purchasePrice]}
                onValueChange={(value) => setPurchasePrice(value[0])}
                max={5000000}
                min={500000}
                step={50000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>500,000</span>
                <span>5,000,000</span>
              </div>
            </div>
            <div className="space-y-3">
              <span className="text-sm font-medium text-gray-700">
                {t("pages.property_page.citizenship_status")}
              </span>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="citizenship"
                    checked={citizenshipStatus === "citizen"}
                    onChange={() => setCitizenshipStatus("citizen")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">
                    {t("pages.property_page.cis_citizen")}
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="citizenship"
                    checked={citizenshipStatus === "resident"}
                    onChange={() => setCitizenshipStatus("resident")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">
                    {t("pages.property_page.cis_resident")}
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="citizenship"
                    checked={citizenshipStatus === "non-resident"}
                    onChange={() => setCitizenshipStatus("non-resident")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">
                    {t("pages.property_page.non_resident")}
                  </span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {t("pages.property_page.down_payment")}
                </span>
                <span className="text-sm text-gray-500">
                  {downPaymentPercentage}%
                </span>
              </div>
              <div className="text-lg font-semibold text-blue-600 mb-2">
                {formatNumber(downPayment)}
              </div>
              <div className="text-xs text-gray-500 mb-2">UZS</div>
              <Slider
                value={[downPayment]}
                onValueChange={(value) => setDownPayment(value[0])}
                max={purchasePrice * 0.5}
                min={purchasePrice * 0.1}
                step={10000}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {t("pages.property_page.loan_amount")}
                </span>
                <span className="text-sm text-gray-500">
                  {loanAmountPercentage}%
                </span>
              </div>
              <div className="text-lg font-semibold text-blue-600 mb-2">
                {formatNumber(loanAmount)}
              </div>
              <div className="text-xs text-gray-500">UZS</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {t("pages.property_page.loan_term")}
                </span>
                <span className="text-sm text-gray-500">
                  {loanTerm} {t("pages.property_page.years")}
                </span>
              </div>
              <div className="text-lg font-semibold text-blue-600 mb-2">
                {loanTerm}
              </div>
              <Slider
                value={[loanTerm]}
                onValueChange={(value) => setLoanTerm(value[0])}
                max={30}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  {t("pages.property_page.interest_rate")}
                </span>
                <span className="text-sm text-gray-500">%</span>
              </div>
              <div className="text-lg font-semibold text-blue-600 mb-2">
                {interestRate}
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                max={25}
                min={5}
                step={0.1}
                className="w-full"
              />
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                {t("pages.property_page.estimate_monthly_payment")}
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    {t("pages.property_page.monthly_payment")}
                  </span>
                  <span className="text-sm text-gray-600">
                    {t("pages.property_page.monthly_payment")}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatNumber(monthlyPayment)} UZS
                  </div>
                  <div className="text-2xl font-bold text-gray-900">
                    {monthlyPaymentPercentage.toFixed(1)}%
                  </div>
                </div>
              </div>
              <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
                {t("pages.property_page.confirm_mortgage")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
