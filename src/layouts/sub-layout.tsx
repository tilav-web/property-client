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

  return (
    <div id="index" className="h-screen overflow-y-auto">
      <Header />
      <main
        className={
          isChatRoute
            ? "select-none"
            : "container mx-auto select-none pb-12 px-4"
        }
      >
        {children}
      </main>
      {!isChatRoute && <Footer />}
    </div>
  );
}
