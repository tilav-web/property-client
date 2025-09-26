import BackButton from "@/components/common/buttons/back-button";
import { Badge } from "@/components/ui/badge";
import { miniCardImage } from "@/utils/shared";
import {
  Bath,
  Bed,
  Building,
  Building2,
  Camera,
  CirclePlay,
  Dumbbell,
  Eye,
  MapPin,
  Maximize,
  PawPrint,
  Rotate3D,
  Shield,
  ShieldCheck,
  Shirt,
  UserCheck,
  Warehouse,
  Waves,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import OnlineContractButton from "@/components/common/buttons/online-contract-button";
import CallButton from "@/components/common/buttons/call-button";
import MailButton from "@/components/common/buttons/mail-button";
import WhatsAppButton from "@/components/common/buttons/whats-app-button";
import HeartButton from "@/components/common/buttons/heart-button";
import EllipsisVerticalButton from "@/components/common/buttons/ellipsis-vertical-button";
import BidPriceButton from "@/components/common/buttons/bid-price-button";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Slider } from "@/components/ui/slider";

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
  const location: [number, number] = [41.2995, 69.2401];

  const [purchasePrice, setPurchasePrice] = useState(1200000);
  const [citizenshipStatus, setCitizenshipStatus] = useState("citizen");
  const [downPayment, setDownPayment] = useState(240000);
  const [loanAmount, setLoanAmount] = useState(960000);
  const [loanTerm, setLoanTerm] = useState(5);
  const [interestRate, setInterestRate] = useState(17.5);

  // Calculate monthly payment
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

  // Update loan amount when purchase price or down payment changes
  useEffect(() => {
    setLoanAmount(purchasePrice - downPayment);
  }, [purchasePrice, downPayment]);

  const monthlyPayment = calculateMonthlyPayment();
  const monthlyPaymentPercentage = (monthlyPayment / purchasePrice) * 100;
  const downPaymentPercentage = Math.round((downPayment / purchasePrice) * 100);
  const loanAmountPercentage = Math.round((loanAmount / purchasePrice) * 100);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("ru-RU").format(Math.round(num));
  };

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
          <div className="mb-12">
            <div className="flex items-center justify-between font-bold mb-4">
              <OnlineContractButton />
              <div className="flex items-center gap-3">
                <CallButton />
                <MailButton />
                <WhatsAppButton />
                <HeartButton />
                <EllipsisVerticalButton />
              </div>
            </div>
            <div className="font-bold flex items-center justify-end gap-8">
              <p className="text-4xl text-red-500">300 000 000 UZS</p>
              <BidPriceButton />
            </div>
          </div>
          <div className="opacity-50">
            <h2 className="mb-4">
              Полный вид на парк/частичный вид на залив, верхний этаж, сдается в
              аренду
            </h2>

            <p className="mb-4">
              Компания Премиум с гордостью представляет эту прекрасную квартиру
              с 3 спальнями и услугами горничной, расположенную на верхнем этаже
              в Harbour Gate Tower 2, Dubai Creek Harbour (The Lagoons) . Из
              квартиры открывается великолепный вид на парк.
            </p>

            <h3 className="mb-2">Детали устройства:</h3>
            <ul className="">
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                Вид на парк и ручей
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                Без мебели
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                Кухонная столешница
              </li>
              <li className="before:content-['-'] before:mr-2 before:text-gray-800">
                Просторная гостиная
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">
          Сведения о недвижимости
        </h2>
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Building2 className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Тип недвижимости</span>
                <p className="font-medium text-gray-800">Квартира</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bed className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Спальни</span>
                <p className="font-medium text-gray-800">4</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Rotate3D className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Ширина улицы</span>
                <p className="font-medium text-gray-800">0</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Maximize className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">
                  Размер объекта недвижимости
                </span>
                <p className="font-medium text-gray-800">
                  152 кв. м / 1638 кв.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Bath className="w-5 h-5 text-gray-500" />
              <div className="flex items-center gap-4">
                <span className="text-gray-600 text-sm">Ванные комнаты</span>
                <p className="font-medium text-gray-800">4</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Удобства</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <UserCheck className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Комната для прислуги</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <Building className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Балкон</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <Waves className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Общий Бассейн</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <Shield className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Безопасность</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <Warehouse className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Встроенные шкафы</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <Shirt className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Встроенная гардеробная</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <Eye className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Вид на воду</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Вид на достопримечательность</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <PawPrint className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Разрешены домашние животные</span>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-md transition-colors text-gray-700 hover:bg-gray-50">
              <Dumbbell className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Общий Тренажерный зал</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mb-8">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Анализ цен
          </h2>
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Ценовые тенденции
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Продаются апартаменты с 3 спальнями в Harbour Gate Tower 2 и Dubai
            Creek Harbour (The Lagoons)
          </p>

          {/* Period Selector */}
          <div className="flex gap-2 items-center justify-end">
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-blue-100 text-blue-700 border border-blue-300">
              1 год
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100">
              2 года
            </button>
            <button className="px-4 py-2 rounded-md text-sm font-medium transition-colors bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100">
              5 лет
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-red-500"></div>
            <span className="text-sm text-gray-600">Harbour Gate Tower 2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 border-t-2 border-dotted border-purple-500"></div>
            <span className="text-sm text-gray-600">
              Dubai Creek Harbour (The Lagoons)
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
      <div className="w-full">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Подберите подходящий для вас ипотечный кредит
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Покупная цена
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
                Гражданин/статус резидента
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
                  <span className="text-sm">Гражданин СНГ</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="citizenship"
                    checked={citizenshipStatus === "resident"}
                    onChange={() => setCitizenshipStatus("resident")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Резидент СНГ</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="citizenship"
                    checked={citizenshipStatus === "non-resident"}
                    onChange={() => setCitizenshipStatus("non-resident")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">Не резидент</span>
                </label>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Первоначальный взнос
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
                  Сумма кредита
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
                  Срок кредита
                </span>
                <span className="text-sm text-gray-500">{loanTerm} лет</span>
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
                  Процентная ставка
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
                Оцените свой ежемесячный платеж по ипотеке
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Ежемесячный платеж
                  </span>
                  <span className="text-sm text-gray-600">
                    Ежемесячный платеж
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
                Подтвердить получение ипотеки
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
