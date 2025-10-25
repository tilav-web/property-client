import Footer from "@/components/common/footer/footer";
import Header from "@/components/common/header/header";
import Loading from "@/components/common/loadings/loading";
import { useUserStore } from "@/stores/user.store";
import { useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";

export default function SubLayout({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  const { pathname } = useLocation();

  useEffect(() => {
    const index = document.querySelector("#index");
    index?.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  if (user === undefined) return <Loading />;

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
