import Footer from "@/components/common/footer/footer";
import Header from "@/components/common/header/header";
import Loading from "@/components/common/loadings/loading";
import { useUserStore } from "@/stores/user.store";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

// Chat route'larida footer va main padding/container yo'q — chat to'liq
// ekrandan foydalanadi (telegram-style).
const CHAT_ROUTE_PREFIXES = ["/messages", "/ai-chat", "/chat"];

export default function SubLayout({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const { pathname } = useLocation();
  const isChatRoute = CHAT_ROUTE_PREFIXES.some((p) => pathname.startsWith(p));

  useEffect(() => {
    const index = document.querySelector("#index");
    index?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (user === undefined) return <Loading />;

  // Chat route'larida outer = flex column + h-dvh; main = flex-1 min-h-0
  // overflow-hidden. Bu mobile brauzerda manzil paneli qisqarganda ham chat
  // input doim ko'rinadi (100vh hisoblamasdan, dynamic viewport bilan).
  if (isChatRoute) {
    return (
      <div className="flex h-[100dvh] flex-col overflow-hidden">
        <Header />
        <main className="min-h-0 flex-1 select-none overflow-hidden">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div id="index" className="h-screen overflow-y-auto">
      <Header />
      <main className="container mx-auto select-none pb-12 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
