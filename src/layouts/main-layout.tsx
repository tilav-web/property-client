import Footer from "@/components/common/footer/footer";
import Header from "@/components/common/header/header";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

// Chat route'larida Footer va asosiy main padding'i bo'lmaydi — chat o'zi
// to'liq ekrandan foydalanadi (telegram-style).
const CHAT_ROUTE_PREFIXES = ["/messages", "/ai-chat", "/chat"];

export default function MainLayout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const isChatRoute = CHAT_ROUTE_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const index = document.querySelector("#index");
    index?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return (
    <div id="index" className="h-screen overflow-y-auto bg-gray-50/50">
      <Header className={pathname === "/" ? "" : "sticky top-0 z-50"} />
      <main className={isChatRoute ? "select-none" : "select-none pb-12"}>
        {children}
      </main>
      {!isChatRoute && <Footer />}
    </div>
  );
}
