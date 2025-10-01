import Footer from "@/components/common/footer/footer";
import Header from "@/components/common/header/header";
import Loading from "@/components/common/loading";
import { userService } from "@/services/user.service";
import { useUserStore } from "@/stores/user.store";
import { useEffect, type ReactNode } from "react";

export default function SubLayout({ children }: { children: ReactNode }) {
  const { setUser, user, logout } = useUserStore();
  useEffect(() => {
    (async () => {
      try {
        if (user || user === null) return;
        const data = await userService.findMe();
        setUser(data);
      } catch (error) {
        console.error(error);
        logout()
      }
    })();
  }, [setUser, logout]);

  if (user === undefined) return <Loading />;

  return (
    <>
      <Header />
      <main className="container mx-auto select-none pb-12 px-4">
        {children}
      </main>
      <Footer />
    </>
  );
}
