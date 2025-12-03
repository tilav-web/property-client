import HeroSection from "@/components/common/hero-section";
import { mainImage } from "@/utils/shared";
import CategoryFilter from "@/components/common/category-filter";
import MainLayoutBlock from "./_components/main-layout-block";

export default function Main() {
  return (
    <>
      <CategoryFilter />
      <HeroSection img={mainImage} title={"pages.hero.title"} />

      <MainLayoutBlock />
    </>
  );
}
