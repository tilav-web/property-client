import { Facebook, Instagram, Youtube, Send } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Contact Section */}
          <div className="md:col-span-1">
            <p className="text-sm mb-4">Возник вопрос? Звоните</p>
            <Link
              to="tel:+998901234567"
              className="text-2xl font-bold mb-6 block"
            >
              +998 90 123 45 67
            </Link>

            {/* Social Media Icons */}
            <div className="flex gap-3 mb-6">
              <Link
                to="#"
                className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Facebook size={20} />
              </Link>
              <Link
                to="#"
                className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Send size={20} />
              </Link>
              <Link
                to="#"
                className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Instagram size={20} />
              </Link>
              <Link
                to="#"
                className="w-10 h-10 bg-gray-800 rounded flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Youtube size={20} />
              </Link>
            </div>

            <Link to="#" className="text-sm underline">
              Адреса магазинов
            </Link>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Компания</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Юридическим лицам
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  О Amaar
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Новости и блоги
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Проверка IMEI
                </Link>
              </li>
            </ul>
          </div>

          {/* Information Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Информация</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Бесплатная доставка
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Работа в Amaar
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Личный кабинет
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Контактные номера
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Help Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Помощь покупателю</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Возврат товара
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-sm hover:text-gray-300 transition-colors"
                >
                  Гарантия на товары
                </Link>
              </li>
            </ul>
          </div>

          {/* Download App Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Скачать приложение</h3>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-lg mb-4 w-32 h-32 flex items-center justify-center">
              <div className="text-black text-xs text-center">QR-код</div>
            </div>

            {/* App Store Icons */}
            <div className="flex gap-2 mb-2">
              <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                  <div className="w-0 h-0 border-l-2 border-l-green-600 border-t-1 border-t-transparent border-b-1 border-b-transparent"></div>
                </div>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                <div className="text-white text-xs">🍎</div>
              </div>
              <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
                <div className="text-white text-xs font-bold">A</div>
              </div>
            </div>

            <p className="text-xs text-gray-400">
              Отсканируй QR-код,
              <br />
              чтобы скачать
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
