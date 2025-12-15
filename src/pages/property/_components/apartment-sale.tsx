import { useEffect, useRef, useCallback } from "react";
import type { IApartmentSale } from "@/interfaces/property/categories/apartment-sale.interface";

// Ikonlar
import {
  Bath,
  Bed,
  Building,
  Building2,
  Maximize,
  Rotate3D,
  ShieldCheck,
  Shirt,
  UserCheck,
  Warehouse,
  Waves,
  Home,
  Sofa,
  Wrench,
} from "lucide-react";

// Button komponentlari
import BackButton from "@/components/common/buttons/back-button";
import OnlineContractButton from "@/components/common/buttons/online-contract-button";
import CallButton from "@/components/common/buttons/call-button";
import MailButton from "@/components/common/buttons/mail-button";
import WhatsAppButton from "@/components/common/buttons/whats-app-button";
import HeartButton from "@/components/common/buttons/heart-button";
import EllipsisVerticalButton from "@/components/common/buttons/ellipsis-vertical-button";
import BidPriceButton from "@/components/common/buttons/bid-price-button";
import PropertyMediaGallery from "./property-media-gallery";

// Amenities ikonlari
const amenityIcons = {
  pool: <Waves className="w-4 h-4 flex-shrink-0" />,
  balcony: <Building className="w-4 h-4 flex-shrink-0" />,
  security: <ShieldCheck className="w-4 h-4 flex-shrink-0" />,
  air_conditioning: <Shirt className="w-4 h-4 flex-shrink-0" />,
  parking: <Warehouse className="w-4 h-4 flex-shrink-0" />,
  elevator: <UserCheck className="w-4 h-4 flex-shrink-0" />,
};

// Xarita komponenti
function PropertyMap({ coordinates }: { coordinates: [number, number] }) {
  const mapInstanceRef = useRef<ymaps.Map | null>(null);
  const ymapsReadyPromise = useRef<Promise<void> | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);

  const loadYmaps = useCallback(() => {
    if (ymapsReadyPromise.current) return ymapsReadyPromise.current;

    ymapsReadyPromise.current = new Promise<void>((resolve) => {
      const check = setInterval(() => {
        if (window.ymaps) {
          clearInterval(check);
          window.ymaps.ready(() => resolve());
        }
      }, 100);
    });
    return ymapsReadyPromise.current;
  }, []);

  useEffect(() => {
    if (!coordinates) return;

    let destroyed = false;
    const [lng, lat] = coordinates;

    loadYmaps().then(() => {
      if (destroyed || !mapContainerRef.current) return;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter([lat, lng], 15);
        return;
      }

      const ymaps = window.ymaps;
      const map = new ymaps.Map(mapContainerRef.current, {
        center: [lat, lng],
        zoom: 15,
        controls: ["zoomControl", "fullscreenControl", "geolocationControl"],
      });

      const placemark = new ymaps.Placemark([lat, lng]);
      map.geoObjects.add(placemark);

      mapInstanceRef.current = map;
    });

    return () => {
      destroyed = true;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy();
        mapInstanceRef.current = null;
      }
    };
  }, [coordinates, loadYmaps]);

  if (!coordinates) {
    return (
      <div className="w-full h-[600px] rounded-xl bg-gray-200 flex items-center justify-center">
        <span className="text-gray-500">No coordinates available</span>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden">
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

// Asosiy komponent
export default function ApartmentSale({
  apartment,
}: {
  apartment: IApartmentSale;
}) {
  // const [purchasePrice, setPurchasePrice] = useState(
  //   apartment.price || 1200000
  // );
  // const [downPayment, setDownPayment] = useState(240000);
  // const [loanAmount, setLoanAmount] = useState(960000);
  // const [loanTerm, setLoanTerm] = useState(5);
  // const [interestRate, setInterestRate] = useState(17.5);

  // useEffect(() => {
  //   setPurchasePrice(apartment.price || 1200000);
  //   const calculatedDownPayment = Math.round(
  //     (apartment.price || 1200000) * 0.2
  //   );
  //   setDownPayment(calculatedDownPayment);
  //   setLoanAmount((apartment.price || 1200000) - calculatedDownPayment);
  // }, [apartment]);

  // useEffect(() => {
  //   setLoanAmount(purchasePrice - downPayment);
  // }, [purchasePrice, downPayment]);

  // const calculateMonthlyPayment = () => {
  //   const principal = loanAmount;
  //   const monthlyRate = interestRate / 100 / 12;
  //   const numberOfPayments = loanTerm * 12;

  //   if (monthlyRate === 0) {
  //     return principal / numberOfPayments;
  //   }

  //   const monthlyPayment =
  //     (principal *
  //       (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
  //     (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  //   return monthlyPayment;
  // };

  // const monthlyPayment = calculateMonthlyPayment();
  // const monthlyPaymentPercentage = (monthlyPayment / purchasePrice) * 100;
  // const downPaymentPercentage = Math.round((downPayment / purchasePrice) * 100);
  // const loanAmountPercentage = Math.round((loanAmount / purchasePrice) * 100);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(Math.round(num));
  };

  const formatPrice = (price: number) => {
    return `${formatNumber(price)} ${apartment.currency || "UZS"}`;
  };

  if (!apartment) {
    return (
      <div className="py-8">
        <BackButton className="mb-6" />
        <div className="text-center py-20">
          <div className="text-gray-500">No apartment data available</div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <BackButton className="mb-6" />

      {/* Rasmlar qismi */}
      <PropertyMediaGallery
        photos={apartment.photos}
        videos={apartment.videos}
        isPremium={apartment.is_premium}
        status={apartment.status}
      />

      {/* Xarita va asosiy ma'lumotlar */}
      <div className="flex flex-col lg:flex-row items-start gap-4 mb-8">
        <div className="w-full lg:w-1/2">
          {apartment.location?.coordinates && (
            <PropertyMap
              coordinates={apartment.location.coordinates as [number, number]}
            />
          )}
        </div>
        <div className="w-full lg:w-1/2">
          <div className="mb-12">
            <div className="flex items-center justify-between font-bold mb-4">
              {apartment.contract_file && (
                <OnlineContractButton file={apartment.contract_file} />
              )}
              <div className="flex items-center gap-3">
                {apartment.author?.phone?.value && (
                  <CallButton phone={apartment.author.phone.value} />
                )}
                {apartment.author?.email?.value && (
                  <MailButton mail={apartment.author.email.value} />
                )}
                <WhatsAppButton />
                <HeartButton property={apartment} />
                <EllipsisVerticalButton property={apartment} />
              </div>
            </div>
            <div className="font-bold flex items-center justify-end gap-8">
              <p className="text-4xl text-red-500">
                {formatPrice(apartment.price || 0)}
              </p>
              <BidPriceButton property={apartment} />
            </div>
          </div>
          <div>
            <h2 className="mb-4 text-xl font-semibold">{apartment.title}</h2>
            <p className="mb-4 text-gray-600">{apartment.description}</p>

            <h3 className="mb-2 font-medium text-gray-800">Property Details</h3>
            <ul className="space-y-1 text-gray-600">
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Address:</span>{" "}
                {apartment.address}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Category:</span> Apartment Sale
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Furnished:</span>{" "}
                {apartment.furnished ? "Yes" : "No"}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Repair Type:</span>{" "}
                {apartment.repair_type || "Not specified"}
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                <span className="font-medium">Heating:</span>{" "}
                {apartment.heating || "Not specified"}
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Property details */}
      <div className="max-w-5xl mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Property Details
        </h2>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Category</span>
                <p className="font-medium text-gray-800 capitalize">
                  Apartment Sale
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Bedrooms</span>
                <p className="font-medium text-gray-800">
                  {apartment.bedrooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Rotate3D className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Floor</span>
                <p className="font-medium text-gray-800">
                  {apartment.floor_level || 0} /{" "}
                  {apartment.total_floors || "N/A"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Home className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Heating</span>
                <p className="font-medium text-gray-800">
                  {apartment.heating || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Maximize className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Area</span>
                <p className="font-medium text-gray-800">
                  {apartment.area || 0} sq m
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Bathrooms</span>
                <p className="font-medium text-gray-800">
                  {apartment.bathrooms || 0}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Warehouse className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Parking</span>
                <p className="font-medium text-gray-800">
                  {apartment.parking ? "Available" : "Not available"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Repair Type</span>
                <p className="font-medium text-gray-800">
                  {apartment.repair_type || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Amenities */}
        {apartment.amenities && apartment.amenities.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Amenities
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {apartment.amenities.map((amenity: string, index: number) => (
                <div
                  key={`${amenity}-${index}`}
                  className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50"
                >
                  {amenityIcons[amenity as keyof typeof amenityIcons] || (
                    <Building className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span className="text-sm">
                    {amenity.charAt(0).toUpperCase() +
                      amenity.slice(1).replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Features */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Additional Features
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Sofa className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Air Conditioning: {apartment.air_conditioning ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Balcony: {apartment.balcony ? "Yes" : "No"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">
                Elevator: {apartment.elevator ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// <div className="max-w-5xl mb-8">
//   <div className="mb-6">
//     <h2 className="text-xl font-semibold text-gray-900 mb-2">
//       Price Analysis
//     </h2>
//     <h3 className="text-lg font-medium text-gray-700 mb-3">
//       Price Trends in {apartment.address.split(",")[0]}
//     </h3>
//     <p className="text-sm text-gray-600 mb-4">
//       Apartments for sale in this area
//     </p>

//     {/* Period Selector */}
//     <div className="flex gap-2 items-center justify-end">
//       <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700 border border-blue-300">
//         1 Year
//       </button>
//       <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100">
//         2 Years
//       </button>
//       <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100">
//         5 Years
//       </button>
//     </div>
//   </div>

//   {/* Legend */}
//   <div className="flex gap-6 mb-4">
//     <div className="flex items-center gap-2">
//       <div className="w-4 h-0.5 bg-red-500"></div>
//       <span className="text-sm text-gray-600">
//         Current Property Price Trend
//       </span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-4 h-0.5 border-t-2 border-dotted border-purple-500"></div>
//       <span className="text-sm text-gray-600">
//         Area Average Price Trend
//       </span>
//     </div>
//   </div>

//   {/* Chart */}
//   <div className="h-80">
//     <ResponsiveContainer width="100%" height="100%">
//       <LineChart
//         data={[
//           {
//             month: "Aug 24",
//             current: apartment.price * 0.8,
//             average: apartment.price * 0.85,
//           },
//           {
//             month: "Oct 24",
//             current: apartment.price * 0.82,
//             average: apartment.price * 0.83,
//           },
//           {
//             month: "Dec 24",
//             current: apartment.price * 0.85,
//             average: apartment.price * 0.84,
//           },
//           {
//             month: "Feb 25",
//             current: apartment.price * 0.88,
//             average: apartment.price * 0.86,
//           },
//           {
//             month: "Apr 25",
//             current: apartment.price * 0.92,
//             average: apartment.price * 0.89,
//           },
//           {
//             month: "Jun 25",
//             current: apartment.price * 0.95,
//             average: apartment.price * 0.91,
//           },
//         ]}
//         margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
//       >
//         <XAxis
//           dataKey="month"
//           axisLine={false}
//           tickLine={false}
//           tick={{ fontSize: 12, fill: "#6B7280" }}
//         />
//         <YAxis
//           axisLine={false}
//           tickLine={false}
//           tick={{ fontSize: 12, fill: "#6B7280" }}
//           tickFormatter={(value) =>
//             `${formatNumber(value)} ${apartment.currency || "UZS"}`
//           }
//         />
//         <Line
//           type="monotone"
//           dataKey="current"
//           stroke="#EF4444"
//           strokeWidth={2}
//           dot={{ fill: "#EF4444", strokeWidth: 0, r: 3 }}
//         />
//         <Line
//           type="monotone"
//           dataKey="average"
//           stroke="#8B5CF6"
//           strokeWidth={2}
//           strokeDasharray="5 5"
//           dot={{ fill: "#8B5CF6", strokeWidth: 0, r: 3 }}
//         />
//       </LineChart>
//     </ResponsiveContainer>
//   </div>
// </div>

// <div className="w-full">
//   <div className="mb-6">
//     <h2 className="text-xl font-semibold text-gray-900">
//       Mortgage Calculator
//     </h2>
//   </div>

//   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
//     <div className="space-y-6">
//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium text-gray-700">
//             Purchase Price
//           </span>
//           <span className="text-sm text-gray-500">
//             {apartment.currency || "UZS"}
//           </span>
//         </div>
//         <div className="text-lg font-semibold text-blue-600 mb-2">
//           {formatNumber(purchasePrice)}
//         </div>
//         <Slider
//           value={[purchasePrice]}
//           onValueChange={(value) => setPurchasePrice(value[0])}
//           max={apartment.price ? apartment.price * 2 : 5000000}
//           min={500000}
//           step={50000}
//           className="w-full"
//         />
//         <div className="flex justify-between text-xs text-gray-500">
//           <span>500,000</span>
//           <span>
//             {formatNumber(
//               apartment.price ? apartment.price * 2 : 5000000
//             )}
//           </span>
//         </div>
//       </div>

//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium text-gray-700">
//             Down Payment
//           </span>
//           <span className="text-sm text-gray-500">
//             {downPaymentPercentage}%
//           </span>
//         </div>
//         <div className="text-lg font-semibold text-blue-600 mb-2">
//           {formatNumber(downPayment)}
//         </div>
//         <div className="text-xs text-gray-500 mb-2">
//           {apartment.currency || "UZS"}
//         </div>
//         <Slider
//           value={[downPayment]}
//           onValueChange={(value) => setDownPayment(value[0])}
//           max={purchasePrice * 0.5}
//           min={purchasePrice * 0.1}
//           step={10000}
//           className="w-full"
//         />
//       </div>

//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium text-gray-700">
//             Loan Amount
//           </span>
//           <span className="text-sm text-gray-500">
//             {loanAmountPercentage}%
//           </span>
//         </div>
//         <div className="text-lg font-semibold text-blue-600 mb-2">
//           {formatNumber(loanAmount)}
//         </div>
//         <div className="text-xs text-gray-500">
//           {apartment.currency || "UZS"}
//         </div>
//       </div>

//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium text-gray-700">
//             Loan Term
//           </span>
//           <span className="text-sm text-gray-500">{loanTerm} Years</span>
//         </div>
//         <div className="text-lg font-semibold text-blue-600 mb-2">
//           {loanTerm}
//         </div>
//         <Slider
//           value={[loanTerm]}
//           onValueChange={(value) => setLoanTerm(value[0])}
//           max={30}
//           min={1}
//           step={1}
//           className="w-full"
//         />
//       </div>

//       <div className="space-y-2">
//         <div className="flex justify-between items-center">
//           <span className="text-sm font-medium text-gray-700">
//             Interest Rate
//           </span>
//           <span className="text-sm text-gray-500">%</span>
//         </div>
//         <div className="text-lg font-semibold text-blue-600 mb-2">
//           {interestRate}
//         </div>
//         <Slider
//           value={[interestRate]}
//           onValueChange={(value) => setInterestRate(value[0])}
//           max={25}
//           min={5}
//           step={0.1}
//           className="w-full"
//         />
//       </div>
//     </div>

//     <div className="space-y-6">
//       <div className="bg-gray-50 p-6 rounded-lg">
//         <h3 className="text-lg font-semibold text-gray-900 mb-6">
//           Estimated Monthly Payment
//         </h3>

//         <div className="space-y-4">
//           <div className="flex justify-between items-center">
//             <span className="text-sm text-gray-600">Monthly Payment</span>
//             <span className="text-sm text-gray-600">Percentage</span>
//           </div>

//           <div className="flex justify-between items-center">
//             <div className="text-2xl font-bold text-gray-900">
//               {formatNumber(monthlyPayment)} {apartment.currency || "UZS"}
//             </div>
//             <div className="text-2xl font-bold text-gray-900">
//               {monthlyPaymentPercentage.toFixed(1)}%
//             </div>
//           </div>
//         </div>
//         <button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-medium transition-colors">
//           Apply for Mortgage
//         </button>
//       </div>
//     </div>
//   </div>
// </div>
