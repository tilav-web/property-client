import HeroSection from "@/components/common/hero-section";
import { mainImage } from "@/utils/shared";
import MainLayoutBlock from "./_components/main-layout-block";

export default function Main() {
  return (
    <div className="py-12">
      {/* <CategoryFilter /> */}
      <HeroSection img={mainImage} title={"pages.hero.title"} />
      <MainLayoutBlock />
    </div>
  );
}
