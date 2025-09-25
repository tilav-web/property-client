import Footer from "@/components/common/footer/footer";
import Header from "@/components/common/header/header";
import { type ReactNode } from "react";

export default function SubLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="container mx-auto select-none pb-12">{children}</main>
      <Footer />
    </>
  );
}
