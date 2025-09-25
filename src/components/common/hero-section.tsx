import { ChevronDown, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

export default function HeroSection({
  img,
  title,
}: {
  title: string;
  img: string;
}) {
  const { t } = useTranslation();
  return (
    <div className="w-full relative mb-3">
      <div className="absolute w-full h-full flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center pb-24 pr-12">
          <h1
            className="text-6xl max-w-[550px] text-center"
            style={{ fontFamily: "Edu NSW ACT Foundation" }}
          >
            {title}
          </h1>
        </div>
        <div className="max-w-[500px] w-full"></div>
      </div>
      <img
        className="w-full h-full object-cover"
        src={img}
        alt="main hero image"
      />
      <div className="absolute border bg-white flex items-center h-10 rounded-xl overflow-hidden left-0 right-0 bottom-4 mx-auto max-w-[950px]">
        <div className="relative border-r-2 border-black h-full max-w-[280px]">
          <Search className="absolute left-2 top-0 bottom-0 my-auto" />
          <Input
            className="pl-10 border-0 focus-visible:ring-0 h-full"
            placeholder={t("hero.search.search_placeholder")}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full max-w-[190px] items-center gap-1 borser-r px-2 border-r-2 border-black h-full">
            <span className="opacity-50">
              {t("hero.search.dropdown_menu.first")}
            </span>
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex flex-1 items-center gap-1 borser-r px-2 border-r-2 border-black h-full">
            <span className="opacity-50">
              {t("hero.search.dropdown_menu.secound")}
            </span>
            <ChevronDown />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <button className="h-full flex items-center gap-2 px-4 bg-yellow-300 capitalize">
          <Search />
          {t("search")}
        </button>
      </div>
    </div>
  );
}
