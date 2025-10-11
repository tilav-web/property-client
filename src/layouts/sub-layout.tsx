import Footer from "@/components/common/footer/footer";
import Header from "@/components/common/header/header";
import Loading from "@/components/common/loadings/loading";
import { useUserStore } from "@/stores/user.store";
import { type ReactNode } from "react";

export default function SubLayout({ children }: { children: ReactNode }) {
  const { user } = useUserStore();
  if (user === undefined) return <Loading />;
  return (
    <div className="h-screen overflow-y-auto">
      <Header />
      <main className="container mx-auto select-none pb-12 px-4">
        {children}
      </main>
      <Footer />
    </div>
  );
}
